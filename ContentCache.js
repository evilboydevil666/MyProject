// src/utils/ContentCache.js
// Smart caching system for AI-generated content

export class ContentCache {
  constructor() {
    this.cache = new Map()
    this.maxAge = 24 * 60 * 60 * 1000 // 24 hours
    this.hits = 0
    this.misses = 0
    this.loadFromStorage()
  }

  /**
   * Generate cache key based on context
   */
  generateKey(type, context) {
    const contextHash = this.hashObject({
      characterLevel: context.level,
      location: context.location,
      partySize: context.partySize,
      difficulty: context.difficulty,
      theme: context.theme
    })
    return `${type}_${contextHash}`
  }

  /**
   * Check if we have valid cached content
   */
  has(key) {
    const entry = this.cache.get(key)
    if (!entry) {
      this.misses++
      return false
    }
    
    const age = Date.now() - entry.timestamp
    if (age > this.maxAge) {
      this.cache.delete(key)
      this.misses++
      return false
    }
    
    return true
  }

  /**
   * Store content with variations
   */
  store(key, content, variations = 3) {
    const entry = {
      content: Array.isArray(content) ? content : [content],
      timestamp: Date.now(),
      usageCount: 0,
      variations: Math.max(variations, entry?.variations || 1)
    }
    
    this.cache.set(key, entry)
    this.saveToStorage()
  }

  /**
   * Get content and track usage
   */
  get(key) {
    const entry = this.cache.get(key)
    if (!entry) {
      this.misses++
      return null
    }
    
    this.hits++
    entry.usageCount++
    
    // Return random variation if multiple exist
    const content = Array.isArray(entry.content) 
      ? entry.content[Math.floor(Math.random() * entry.content.length)]
      : entry.content
      
    return content
  }

  /**
   * Get stale content (for fallback)
   */
  getStale(key) {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    // Return content regardless of age for fallback scenarios
    this.hits++
    entry.usageCount++
    
    const content = Array.isArray(entry.content) 
      ? entry.content[Math.floor(Math.random() * entry.content.length)]
      : entry.content
      
    return content
  }

  /**
   * Cost optimization - prefer cached content
   */
  async getOrGenerate(type, context, generator) {
    const key = this.generateKey(type, context)
    
    // Return cached if available
    if (this.has(key)) {
      const cached = this.get(key)
      console.log(`💰 Using cached ${type}:`, cached.name || type)
      return cached
    }
    
    // Generate new content
    console.log(`🤖 Generating new ${type}...`)
    const content = await generator(context)
    
    // Cache with variations for future use
    this.store(key, content)
    
    return content
  }

  /**
   * Batch content generation with smart queueing
   */
  async batchGenerate(requests) {
    const results = []
    const uncachedRequests = []
    
    // First pass: get cached content
    for (const request of requests) {
      const key = this.generateKey(request.type, request.context)
      if (this.has(key)) {
        results.push({
          ...request,
          content: this.get(key),
          cached: true
        })
      } else {
        uncachedRequests.push(request)
      }
    }
    
    // Second pass: generate uncached content with rate limiting
    for (const request of uncachedRequests) {
      const content = await request.generator(request.context)
      this.store(this.generateKey(request.type, request.context), content)
      
      results.push({
        ...request,
        content,
        cached: false
      })
      
      // Rate limiting: 1 request per 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    return results
  }

  /**
   * Simple object hashing for cache keys
   */
  hashObject(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort())
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Get cache hit rate - NEW METHOD
   */
  getHitRate() {
    const total = this.hits + this.misses
    return total > 0 ? (this.hits / total) : 0
  }

  /**
   * Persistence
   */
  saveToStorage() {
    try {
      const data = {
        entries: [...this.cache.entries()],
        stats: {
          hits: this.hits,
          misses: this.misses
        }
      }
      const serialized = JSON.stringify(data)
      localStorage.setItem('rpg-narrator-content-cache', serialized)
    } catch (error) {
      console.warn('Failed to save content cache:', error)
    }
  }

  loadFromStorage() {
    try {
      const serialized = localStorage.getItem('rpg-narrator-content-cache')
      if (serialized) {
        const data = JSON.parse(serialized)
        
        // Load entries
        if (data.entries) {
          this.cache = new Map(data.entries)
        }
        
        // Load stats
        if (data.stats) {
          this.hits = data.stats.hits || 0
          this.misses = data.stats.misses || 0
        }
        
        // Clean expired entries
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
          if (now - entry.timestamp > this.maxAge) {
            this.cache.delete(key)
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load content cache:', error)
      this.cache = new Map()
      this.hits = 0
      this.misses = 0
    }
  }

  /**
   * Cache management
   */
  clear() {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
    localStorage.removeItem('rpg-narrator-content-cache')
  }

  getCacheStats() {
    const entries = this.cache.size
    const totalHits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.usageCount, 0)
    const ages = Array.from(this.cache.values()).map(entry => entry.timestamp)
    const oldestEntry = ages.length > 0 ? Math.min(...ages) : Date.now()
    
    return {
      entries: entries,
      totalHits: totalHits,
      hitRate: this.getHitRate(),
      hits: this.hits,
      misses: this.misses,
      oldestEntry: oldestEntry,
      memorySize: JSON.stringify([...this.cache.entries()]).length
    }
  }
}

// Usage in your existing components:
/*
const contentCache = new ContentCache()

// In session planning
const encounter = await contentCache.getOrGenerate('encounter', {
  level: characterLevel,
  location: 'dungeon',
  difficulty: 'moderate'
}, generateEncounterAPI)

// Batch session prep
const sessionContent = await contentCache.batchGenerate([
  { type: 'npc', context: { role: 'shopkeeper', location: 'town' }, generator: generateNPC },
  { type: 'encounter', context: { level: 5, type: 'combat' }, generator: generateEncounter },
  { type: 'location', context: { type: 'tavern', size: 'medium' }, generator: generateLocation }
])

// Check cache performance
const stats = contentCache.getCacheStats()
console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`)
*/