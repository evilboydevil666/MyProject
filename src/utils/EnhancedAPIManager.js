// src/utils/EnhancedAPIManager.js
// Advanced API management with cost optimization and intelligent routing
import { ContentCache } from '../utils/ContentCache.js'
import { characterState } from '../characterState.js'

export class EnhancedAPIManager {
  constructor() {
    this.requestQueue = []
    this.isProcessing = false
    this.costTracker = new CostTracker()
    this.rateLimiter = new RateLimiter()
    this.contentCache = new ContentCache()
    
    // Load settings
    this.settings = this.loadSettings()
  }

  /**
   * Intelligent request routing based on complexity and cost
   */
  async makeRequest(requestConfig) {
    const { 
      prompt, 
      priority = 'normal', 
      cacheKey = null,
      fallbackToCache = true,
      maxTokens = 1500,
      temperature = 0.8,
      requiresLatestModel = false 
    } = requestConfig

    // Check cache first
    if (cacheKey && fallbackToCache) {
      const cached = this.contentCache.get(cacheKey)
      if (cached) {
        console.log(`💰 Cache hit - saved ~$${this.estimateCost(maxTokens)}`)
        return {
          content: cached,
          source: 'cache',
          cost: 0,
          tokens: 0
        }
      }
    }

    // Check cost limits
    const estimatedCost = this.estimateCost(maxTokens)
    if (!this.costTracker.canAfford(estimatedCost)) {
      throw new Error(`Cost limit reached. Estimated: $${estimatedCost}`)
    }

    // Select optimal model based on requirements
    const model = this.selectOptimalModel(requestConfig)
    
    // Queue management for rate limiting
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        ...requestConfig,
        model,
        estimatedCost,
        resolve,
        reject,
        timestamp: Date.now()
      })
      
      this.processQueue()
    })
  }

  /**
   * Process request queue with intelligent batching
   */
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return
    
    this.isProcessing = true
    
    try {
      // Sort by priority
      this.requestQueue.sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

      while (this.requestQueue.length > 0) {
        await this.rateLimiter.waitIfNeeded()
        
        const request = this.requestQueue.shift()
        
        try {
          const result = await this.executeRequest(request)
          
          // Cache if successful
          if (request.cacheKey && result.content) {
            this.contentCache.store(request.cacheKey, result.content)
          }
          
          // Track costs
          this.costTracker.recordRequest(result.cost, result.tokens)
          
          request.resolve(result)
          
        } catch (error) {
          console.error('Request failed:', error)
          
          // Try fallback strategies
          const fallback = await this.tryFallbackStrategies(request, error)
          if (fallback) {
            request.resolve(fallback)
          } else {
            request.reject(error)
          }
        }
      }
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Execute individual API request
   */
  async executeRequest(request) {
    const apiKey = localStorage.getItem('openai-api-key')
    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const requestBody = {
      model: request.model,
      messages: [
        {
          role: 'system',
          content: this.buildSystemPrompt(request)
        },
        {
          role: 'user',
          content: request.prompt
        }
      ],
      max_tokens: request.maxTokens,
      temperature: request.temperature
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const usage = data.usage

    return {
      content,
      source: 'api',
      cost: this.calculateActualCost(usage, request.model),
      tokens: usage.total_tokens,
      model: request.model,
      usage
    }
  }

  /**
   * Smart model selection based on request requirements
   */
  selectOptimalModel(request) {
    const { 
      requiresLatestModel, 
      maxTokens, 
      complexity = 'medium',
      budget = 'standard'
    } = request

    // Cost-conscious selection - FIXED: Using actual OpenAI model names
    if (budget === 'minimal' && !requiresLatestModel) {
      return 'gpt-3.5-turbo'
    }

    // High complexity or latest model required
    if (complexity === 'high' || requiresLatestModel || maxTokens > 2000) {
      return 'gpt-4'
    }

    // Default balanced option
    return this.settings.defaultModel || 'gpt-3.5-turbo'
  }

  /**
   * Fallback strategies when requests fail
   */
  async tryFallbackStrategies(request, error) {
    console.log('Trying fallback strategies for failed request')

    // Strategy 1: Try with smaller token limit
    if (error.message.includes('token') && request.maxTokens > 500) {
      console.log('Fallback: Reducing token limit')
      return await this.executeRequest({
        ...request,
        maxTokens: Math.floor(request.maxTokens * 0.7)
      })
    }

    // Strategy 2: Use cheaper model
    if (error.message.includes('rate') || error.message.includes('quota')) {
      console.log('Fallback: Using cheaper model')
      return await this.executeRequest({
        ...request,
        model: 'gpt-3.5-turbo' // FIXED: Using actual model name
      })
    }

    // Strategy 3: Return cached content if available
    if (request.cacheKey) {
      const cached = this.contentCache.getStale(request.cacheKey)
      if (cached) {
        console.log('Fallback: Using stale cache')
        return {
          content: cached,
          source: 'stale_cache',
          cost: 0,
          tokens: 0,
          fallback: true
        }
      }
    }

    // Strategy 4: Generate simple fallback content
    return this.generateFallbackContent(request)
  }

  /**
   * Generate simple fallback content when AI fails
   */
  generateFallbackContent(request) {
    const fallbacks = {
      encounter: "A group of appropriate-level creatures blocks your path. They appear hostile and ready for combat.",
      npc: "A generic NPC approaches you. They seem willing to talk and might have information or services available.",
      location: "You find yourself in a typical location for this type of environment. There are several areas of interest to explore.",
      plot: "An interesting development occurs that advances the story and provides new opportunities for adventure."
    }

    // Determine content type from prompt
    let contentType = 'general'
    for (const [type, template] of Object.entries(fallbacks)) {
      if (request.prompt.toLowerCase().includes(type)) {
        contentType = type
        break
      }
    }

    return {
      content: fallbacks[contentType] || "Something interesting happens that moves the story forward.",
      source: 'fallback',
      cost: 0,
      tokens: 0,
      fallback: true
    }
  }

  /**
   * Build contextual system prompt
   */
  buildSystemPrompt(request) {
    const character = characterState
    const basePrompt = "You are an expert Pathfinder 1e Game Master creating content for actual play."

    const contextPrompt = `
Character Context: ${character.name || 'Character'} (Level ${character.classes.reduce((sum, c) => sum + (c.level || 0), 0)})
Current HP: ${character.hp}/${character.hpMax}
Classes: ${character.classes.map(c => `${c.className} ${c.level}`).join(', ')}

Create practical, ready-to-use content that fits this character and campaign.`

    return basePrompt + contextPrompt
  }

  /**
   * Cost estimation and tracking
   */
  estimateCost(maxTokens, model = 'gpt-3.5-turbo') {
    // FIXED: Using actual OpenAI pricing
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    }

    const rates = pricing[model] || pricing['gpt-3.5-turbo']
    const estimatedInput = 500 // Approximate input tokens
    const estimatedOutput = maxTokens * 0.8 // Estimate actual vs max

    return ((estimatedInput * rates.input) + (estimatedOutput * rates.output)) / 1000
  }

  calculateActualCost(usage, model) {
    // FIXED: Using actual OpenAI pricing
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    }

    const rates = pricing[model] || pricing['gpt-3.5-turbo']
    return ((usage.prompt_tokens * rates.input) + (usage.completion_tokens * rates.output)) / 1000
  }

  /**
   * Settings management
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('rpg-narrator-api-settings')
      return saved ? JSON.parse(saved) : {
        dailyBudget: 10.00,
        defaultModel: 'gpt-3.5-turbo', // FIXED: Default to actual model
        maxRequestsPerMinute: 20,
        enableCaching: true,
        enableFallbacks: true
      }
    } catch {
      return {
        dailyBudget: 10.00,
        defaultModel: 'gpt-3.5-turbo',
        maxRequestsPerMinute: 20,
        enableCaching: true,
        enableFallbacks: true
      }
    }
  }

  saveSettings() {
    localStorage.setItem('rpg-narrator-api-settings', JSON.stringify(this.settings))
  }

  /**
   * Usage analytics - FIXED with safe access
   */
  getUsageStats() {
    // Get cache stats safely
    let cacheHitRate = 0
    if (this.contentCache && typeof this.contentCache.getCacheStats === 'function') {
      const cacheStats = this.contentCache.getCacheStats()
      if (cacheStats && cacheStats.totalHits !== undefined && cacheStats.entries !== undefined) {
        cacheHitRate = cacheStats.entries > 0 ? (cacheStats.totalHits / cacheStats.entries) : 0
      }
    }
    
    return {
      totalCost: this.costTracker.getTotalCost(),
      requestCount: this.costTracker.getRequestCount(),
      cacheHitRate: cacheHitRate, // FIXED: Now calculates hit rate properly
      averageCostPerRequest: this.costTracker.getAverageCost(),
      dailyBudgetUsed: this.costTracker.getDailyUsage(),
      topRequestTypes: this.costTracker.getTopRequestTypes()
    }
  }
}

/**
 * Cost tracking utility
 */
class CostTracker {
  constructor() {
    this.dailyUsage = this.loadDailyUsage()
    this.requests = []
  }

  canAfford(estimatedCost) {
    const settings = JSON.parse(localStorage.getItem('rpg-narrator-api-settings') || '{}')
    const dailyBudget = settings.dailyBudget || 10.00
    return (this.dailyUsage.total + estimatedCost) <= dailyBudget
  }

  recordRequest(cost, tokens) {
    const today = new Date().toDateString()
    
    if (this.dailyUsage.date !== today) {
      this.dailyUsage = { date: today, total: 0, requests: 0 }
    }

    this.dailyUsage.total += cost
    this.dailyUsage.requests += 1

    this.requests.push({
      cost,
      tokens,
      timestamp: Date.now()
    })

    this.saveDailyUsage()
  }

  loadDailyUsage() {
    try {
      const saved = localStorage.getItem('rpg-narrator-daily-usage')
      const data = saved ? JSON.parse(saved) : null
      const today = new Date().toDateString()
      
      if (data && data.date === today) {
        return data
      } else {
        return { date: today, total: 0, requests: 0 }
      }
    } catch {
      return { date: new Date().toDateString(), total: 0, requests: 0 }
    }
  }

  saveDailyUsage() {
    localStorage.setItem('rpg-narrator-daily-usage', JSON.stringify(this.dailyUsage))
  }

  getTotalCost() {
    return this.requests.reduce((sum, req) => sum + req.cost, 0)
  }

  getRequestCount() {
    return this.requests.length
  }

  getAverageCost() {
    return this.requests.length > 0 ? this.getTotalCost() / this.requests.length : 0
  }

  getDailyUsage() {
    return this.dailyUsage.total
  }

  getTopRequestTypes() {
    // This would need to be implemented based on how you track request types
    return {}
  }
}

/**
 * Rate limiting utility
 */
class RateLimiter {
  constructor() {
    this.requestTimes = []
    this.maxRequestsPerMinute = 20
  }

  async waitIfNeeded() {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Remove old requests
    this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo)

    // Check if we need to wait
    if (this.requestTimes.length >= this.maxRequestsPerMinute) {
      const oldestRequest = Math.min(...this.requestTimes)
      const waitTime = oldestRequest + 60000 - now
      
      if (waitTime > 0) {
        console.log(`Rate limit: waiting ${waitTime}ms`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return this.waitIfNeeded() // Check again after waiting
      }
    }

    // Record this request
    this.requestTimes.push(now)
  }
}