// src/utils/PredictiveContentEngine.js
// Predictive content generation based on campaign patterns

import { characterState } from '../characterState.js'

export class PredictiveContentEngine {
  constructor() {
    this.campaignAnalyzer = new CampaignPatternAnalyzer()
    this.contentPredictor = new ContentPredictor()
    this.preparationQueue = []
    this.isGenerating = false
    this.generatedContent = new Map()
  }
  
  // Analyze current campaign flow and predict needed content
  async analyzeCampaignFlow() {
    const patterns = await this.campaignAnalyzer.analyzePatterns()
    const predictions = await this.contentPredictor.predictNextNeeds(patterns)
    
    return {
      immediateNeeds: predictions.filter(p => p.urgency === 'high'),
      upcomingNeeds: predictions.filter(p => p.urgency === 'medium'),
      futureOpportunities: predictions.filter(p => p.urgency === 'low'),
      confidence: this.calculateOverallConfidence(predictions)
    }
  }
  
  calculateOverallConfidence(predictions) {
    if (predictions.length === 0) return 0
    
    const avgConfidence = predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length
    return Math.round(avgConfidence * 100) / 100
  }

  // Pre-generate content during downtime
  async preGenerateContent(predictions) {
    if (this.isGenerating) {
      console.log('Content generation already in progress')
      return
    }

    this.isGenerating = true
    
    try {
      const generationTasks = predictions.map(prediction => ({
        type: prediction.contentType,
        context: prediction.context,
        priority: prediction.urgency,
        estimatedUse: prediction.probability,
        id: this.generateTaskId()
      }))
      
      // Use smart batching to optimize API costs
      const batchedTasks = this.optimizeBatching(generationTasks)
      
      for (const batch of batchedTasks) {
        await this.processBatch(batch)
        // Rate limiting between batches
        await this.wait(2000)
      }
    } finally {
      this.isGenerating = false
    }
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  optimizeBatching(tasks) {
    // Group by content type and context similarity
    const groups = this.groupBySimilarity(tasks)
    
    return groups.map(group => ({
      tasks: group,
      combinedPrompt: this.buildBatchPrompt(group),
      estimatedTokens: this.estimateTokenUsage(group),
      batchId: this.generateTaskId()
    }))
  }

  groupBySimilarity(tasks) {
    const groups = {}
    
    tasks.forEach(task => {
      const key = `${task.type}_${task.context.difficulty || 'normal'}_${task.context.theme || 'generic'}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(task)
    })
    
    return Object.values(groups)
  }
  
  buildBatchPrompt(taskGroup) {
    const baseContext = this.getCharacterContext()
    const taskDescriptions = taskGroup.map((task, index) => 
      `${index + 1}. ${task.type}: ${task.context.description || this.getTaskDescription(task)}`
    ).join('\n')
    
    return `Generate multiple ${taskGroup[0].type} items for our Pathfinder campaign:

**Character Context:**
${baseContext}

**Requested Content:**
${taskDescriptions}

**Output Format:**
For each item, provide:
- Name and brief description
- Relevant game statistics
- Narrative hooks or usage suggestions
- Adaptability notes for different situations

Generate varied, interconnected content that could work together in our campaign.
Format as JSON array with clear separation between items.`
  }

  getTaskDescription(task) {
    const descriptions = {
      npc: `Create ${task.context.role || 'various'} NPCs for ${task.context.location || 'general use'}`,
      encounter: `Design CR ${this.getCurrentCR()} encounters for ${task.context.theme || 'adventure'}`,
      location: `Build ${task.context.type || 'varied'} locations with ${task.context.atmosphere || 'engaging'} atmosphere`,
      treasure: `Generate appropriate treasure for level ${this.getCurrentLevel()} characters`,
      plot: `Create plot hooks related to ${task.context.theme || 'current storylines'}`
    }
    
    return descriptions[task.type] || `Generate ${task.type} content for the campaign`
  }

  getCharacterContext() {
    const totalLevel = characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
    
    return `- Character: ${characterState.name || 'Adventurer'} (Level ${totalLevel})
- Classes: ${characterState.classes.map(c => `${c.className} ${c.level}`).join(', ') || 'None'}
- Current HP: ${characterState.hp}/${characterState.hpMax}
- Key Skills: ${characterState.skills.filter(s => s.rank > 0).map(s => s.name).slice(0, 3).join(', ') || 'None'}`
  }

  getCurrentLevel() {
    return characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
  }

  getCurrentCR() {
    const level = this.getCurrentLevel()
    return Math.max(1, level - 1) // Slightly below character level for balanced encounters
  }

  estimateTokenUsage(taskGroup) {
    const baseTokens = 300 // System prompt and context
    const taskTokens = taskGroup.length * 100 // Per task
    const responseTokens = taskGroup.length * 200 // Estimated response per task
    
    return baseTokens + taskTokens + responseTokens
  }

  async processBatch(batch) {
    try {
      const response = await this.callContentGenerationAPI(batch.combinedPrompt)
      const parsedContent = this.parseGeneratedContent(response, batch.tasks)
      
      // Store generated content for future use
      parsedContent.forEach((content, index) => {
        const task = batch.tasks[index]
        if (task && content) {
          this.generatedContent.set(task.id, {
            content: content,
            type: task.type,
            context: task.context,
            generated: Date.now(),
            used: false
          })
        }
      })
      
      console.log(`Generated ${parsedContent.length} items in batch ${batch.batchId}`)
      
    } catch (error) {
      console.error('Batch processing failed:', error)
      // Continue with next batch despite error
    }
  }

  async callContentGenerationAPI(prompt) {
    const apiKey = localStorage.getItem('openai-api-key')
    if (!apiKey) {
      throw new Error('No API key available for content generation')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Pathfinder 1e GM creating varied, high-quality content for immediate use.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  parseGeneratedContent(response, tasks) {
    try {
      // Try to parse as JSON first
      if (response.trim().startsWith('[')) {
        const parsed = JSON.parse(response)
        return parsed.slice(0, tasks.length) // Ensure we don't exceed task count
      }
      
      // Fallback: split by numbered items
      const items = response.split(/\d+\.\s+/).filter(item => item.trim().length > 0)
      return items.map(item => this.parseIndividualItem(item.trim()))
      
    } catch (error) {
      console.error('Failed to parse generated content:', error)
      return tasks.map(() => null) // Return nulls to maintain array length
    }
  }

  parseIndividualItem(itemText) {
    // Extract name, description, and other details from text
    const lines = itemText.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) return null
    
    const name = lines[0].replace(/^\*\*|\*\*$/g, '').trim()
    const description = lines.slice(1).join(' ').trim()
    
    return {
      name: name,
      description: description,
      tags: this.extractTags(itemText),
      stats: this.extractStats(itemText)
    }
  }

  extractTags(text) {
    const tags = []
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('combat')) tags.push('combat')
    if (lowerText.includes('social')) tags.push('social')
    if (lowerText.includes('magic')) tags.push('magic')
    if (lowerText.includes('treasure')) tags.push('treasure')
    if (lowerText.includes('mystery')) tags.push('mystery')
    
    return tags
  }

  extractStats(text) {
    const stats = {}
    
    // Look for common stat patterns
    const crMatch = text.match(/CR\s*(\d+)/i)
    if (crMatch) stats.cr = parseInt(crMatch[1])
    
    const hpMatch = text.match(/(\d+)\s*HP/i)
    if (hpMatch) stats.hp = parseInt(hpMatch[1])
    
    const acMatch = text.match(/AC\s*(\d+)/i)
    if (acMatch) stats.ac = parseInt(acMatch[1])
    
    return stats
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Generate input suggestions based on context
  async generateInputSuggestions(options) {
    const { partialInput, context, characterContext } = options
    
    const suggestions = []
    
    // Pattern-based suggestions
    const patternSuggestions = this.getPatternBasedSuggestions(partialInput)
    suggestions.push(...patternSuggestions)
    
    // Context-aware suggestions
    const contextSuggestions = this.getContextBasedSuggestions(context, characterContext)
    suggestions.push(...contextSuggestions)
    
    // AI-powered suggestions (if budget allows)
    if (suggestions.length < 3 && this.shouldUseAIForSuggestions()) {
      const aiSuggestions = await this.getAIInputSuggestions(partialInput, context)
      suggestions.push(...aiSuggestions)
    }
    
    return suggestions.slice(0, 3) // Return top 3 suggestions
  }

  getPatternBasedSuggestions(partialInput) {
    const patterns = [
      { trigger: 'I search', suggestions: ['I search the room for hidden doors', 'I search the body for clues', 'I search for traps'] },
      { trigger: 'I attack', suggestions: ['I attack with my weapon', 'I attack the nearest enemy', 'I attack while flanking'] },
      { trigger: 'I cast', suggestions: ['I cast a spell at the enemy', 'I cast a defensive spell', 'I cast a utility spell'] },
      { trigger: 'I try to', suggestions: ['I try to sneak past', 'I try to negotiate', 'I try to disable the trap'] },
      { trigger: 'I examine', suggestions: ['I examine the object closely', 'I examine for magical auras', 'I examine the area'] }
    ]
    
    const lowerInput = partialInput.toLowerCase()
    const matchingPattern = patterns.find(p => lowerInput.includes(p.trigger.toLowerCase()))
    
    return matchingPattern ? matchingPattern.suggestions.filter(s => 
      s.toLowerCase().startsWith(lowerInput) && s.length > partialInput.length
    ) : []
  }

  getContextBasedSuggestions(context, characterContext) {
    const suggestions = []
    
    // Skill-based suggestions
    if (characterContext.topSkills) {
      characterContext.topSkills.forEach(skill => {
        if (skill === 'Stealth') suggestions.push('I try to move stealthily')
        if (skill === 'Perception') suggestions.push('I look around carefully')
        if (skill === 'Diplomacy') suggestions.push('I attempt to negotiate')
      })
    }
    
    // Context-based suggestions
    if (context && context.includes('door')) {
      suggestions.push('I listen at the door', 'I check the door for traps')
    }
    
    if (context && context.includes('enemy')) {
      suggestions.push('I ready my weapon', 'I prepare for combat')
    }
    
    return suggestions
  }

  shouldUseAIForSuggestions() {
    // Only use AI for suggestions if we haven't made too many API calls recently
    const recentCalls = this.getRecentAPICalls()
    return recentCalls < 10 // Conservative limit
  }

  getRecentAPICalls() {
    // This would track recent API usage
    return 5 // Placeholder
  }

  async getAIInputSuggestions(partialInput, context) {
    try {
      const prompt = `Complete this Pathfinder 1e player action: "${partialInput}"
      
Context: ${context}
Character: ${this.getCharacterContext()}

Provide 2-3 short, specific completions that make sense for the character and situation.
Format as simple array of strings.`

      const response = await this.callContentGenerationAPI(prompt)
      return this.parseInputSuggestions(response)
      
    } catch (error) {
      console.error('AI suggestion generation failed:', error)
      return []
    }
  }

  parseInputSuggestions(response) {
    try {
      if (response.includes('[')) {
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      }
      
      // Fallback: extract lines that look like suggestions
      return response.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-*]\s*/, '').replace(/^"\s*|\s*"$/g, ''))
        .slice(0, 3)
        
    } catch (error) {
      return []
    }
  }

  // Predict next content needs based on recent activity
  async predictNextContent(options) {
    const { lastGMResponse, characterContext, narrativeHistory } = options
    
    const predictions = []
    
    // Analyze what content might be needed next
    if (lastGMResponse.includes('door') || lastGMResponse.includes('room')) {
      predictions.push({
        type: 'location',
        preview: 'Additional room details',
        suggestedAction: 'I examine the room more closely',
        confidence: 0.8
      })
    }
    
    if (lastGMResponse.includes('enemy') || lastGMResponse.includes('hostile')) {
      predictions.push({
        type: 'encounter',
        preview: 'Combat tactics and options',
        suggestedAction: 'I ready my weapon and assess the threat',
        confidence: 0.9
      })
    }
    
    if (lastGMResponse.includes('treasure') || lastGMResponse.includes('gold')) {
      predictions.push({
        type: 'treasure',
        preview: 'Additional treasure details',
        suggestedAction: 'I examine the treasure carefully',
        confidence: 0.7
      })
    }
    
    return predictions
  }

  // Start background predictive generation
  startPredictiveGeneration() {
    if (this.predictionInterval) {
      clearInterval(this.predictionInterval)
    }
    
    // Run predictions every 5 minutes
    this.predictionInterval = setInterval(async () => {
      try {
        const analysis = await this.analyzeCampaignFlow()
        if (analysis.immediateNeeds.length > 0) {
          await this.preGenerateContent(analysis.immediateNeeds.slice(0, 3)) // Limit to 3 items
        }
      } catch (error) {
        console.error('Predictive generation failed:', error)
      }
    }, 5 * 60 * 1000)
  }

  stopPredictiveGeneration() {
    if (this.predictionInterval) {
      clearInterval(this.predictionInterval)
      this.predictionInterval = null
    }
  }

  // Get pre-generated content when available
  getPreGeneratedContent(type, context = {}) {
    const availableContent = Array.from(this.generatedContent.values())
      .filter(item => item.type === type && !item.used)
      .sort((a, b) => b.generated - a.generated) // Most recent first
    
    if (availableContent.length > 0) {
      const selected = availableContent[0]
      selected.used = true
      selected.usedAt = Date.now()
      
      return selected.content
    }
    
    return null
  }

  // Get analytics on prediction accuracy
  getPredictionAnalytics() {
    const usedContent = Array.from(this.generatedContent.values())
      .filter(item => item.used)
    
    const totalGenerated = this.generatedContent.size
    const totalUsed = usedContent.length
    
    return {
      totalGenerated,
      totalUsed,
      usageRate: totalGenerated > 0 ? totalUsed / totalGenerated : 0,
      averageTimeToUse: this.calculateAverageTimeToUse(usedContent),
      mostUsefulType: this.getMostUsefulContentType(usedContent)
    }
  }

  calculateAverageTimeToUse(usedContent) {
    if (usedContent.length === 0) return 0
    
    const totalTime = usedContent.reduce((sum, item) => {
      return sum + (item.usedAt - item.generated)
    }, 0)
    
    return totalTime / usedContent.length / 1000 / 60 // Convert to minutes
  }

  getMostUsefulContentType(usedContent) {
    const typeCounts = {}
    usedContent.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1
    })
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
  }

  // Clean up old generated content
  cleanup() {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000 // 24 hours ago
    
    for (const [id, item] of this.generatedContent.entries()) {
      if (item.generated < cutoff) {
        this.generatedContent.delete(id)
      }
    }
  }
}

class CampaignPatternAnalyzer {
  constructor() {
    this.sessionHistory = this.loadSessionHistory()
    this.narrativePatterns = new Map()
  }
  
  async analyzePatterns() {
    const patterns = {
      sessionLength: this.calculateAverageSessionLength(),
      preferredEncounterTypes: this.analyzeEncounterPreferences(),
      npcInteractionFrequency: this.calculateNPCInteractionRate(),
      explorationToRoleplaying: this.calculateActivityBalance(),
      plotAdvancementRate: this.analyzePlotPacing(),
      resourceUsagePatterns: this.analyzeResourceConsumption()
    }
    
    return {
      patterns,
      insights: this.generateInsights(patterns),
      recommendations: this.generateRecommendations(patterns)
    }
  }
  
  loadSessionHistory() {
    try {
      const saved = localStorage.getItem('rpg-narrator-session-history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  calculateAverageSessionLength() {
    if (this.sessionHistory.length === 0) return 3 // Default 3 hours
    
    const totalTime = this.sessionHistory.reduce((sum, session) => 
      sum + (session.duration || 3), 0
    )
    
    return totalTime / this.sessionHistory.length
  }

  analyzeEncounterPreferences() {
    const encounterTypes = { combat: 0, social: 0, exploration: 0, puzzle: 0 }
    
    this.sessionHistory.forEach(session => {
      session.encounters?.forEach(encounter => {
        encounterTypes[encounter.type] = (encounterTypes[encounter.type] || 0) + 1
      })
    })
    
    const total = Object.values(encounterTypes).reduce((sum, count) => sum + count, 0)
    
    if (total === 0) {
      return { combat: 0.4, social: 0.2, exploration: 0.3, puzzle: 0.1 } // Default distribution
    }
    
    return Object.fromEntries(
      Object.entries(encounterTypes).map(([type, count]) => [type, count / total])
    )
  }

  calculateNPCInteractionRate() {
    if (this.sessionHistory.length === 0) return 0.5 // Default
    
    const sessionsWithNPCs = this.sessionHistory.filter(session => 
      session.npcsEncountered && session.npcsEncountered.length > 0
    ).length
    
    return sessionsWithNPCs / this.sessionHistory.length
  }

  calculateActivityBalance() {
    const activities = { combat: 0, social: 0, exploration: 0, other: 0 }
    
    this.sessionHistory.forEach(session => {
      session.activities?.forEach(activity => {
        activities[activity.type] = (activities[activity.type] || 0) + (activity.duration || 1)
      })
    })
    
    const total = Object.values(activities).reduce((sum, time) => sum + time, 0)
    
    if (total === 0) {
      return { combat: 0.3, social: 0.2, exploration: 0.4, other: 0.1 } // Default
    }
    
    return Object.fromEntries(
      Object.entries(activities).map(([type, time]) => [type, time / total])
    )
  }

  analyzePlotPacing() {
    if (this.sessionHistory.length < 2) return 0.5 // Default moderate pacing
    
    const plotAdvances = this.sessionHistory.filter(session => 
      session.plotAdvancement === true
    ).length
    
    return plotAdvances / this.sessionHistory.length
  }

  analyzeResourceConsumption() {
    // Placeholder for resource usage analysis
    return {
      spellUsage: 0.6,
      consumableUsage: 0.4,
      equipmentDamage: 0.2
    }
  }

  generateInsights(patterns) {
    const insights = []
    
    // Combat frequency analysis
    if (patterns.preferredEncounterTypes.combat > 0.6) {
      insights.push({
        type: 'combat-heavy',
        description: 'Campaign tends toward combat encounters',
        suggestion: 'Prepare more tactical encounters and enemy variety',
        confidence: 0.8
      })
    }
    
    // Social interaction patterns
    if (patterns.npcInteractionFrequency > 0.7) {
      insights.push({
        type: 'social-focused',
        description: 'High NPC interaction frequency',
        suggestion: 'Pre-generate diverse NPCs with rich personalities',
        confidence: 0.9
      })
    }
    
    // Pacing analysis
    if (patterns.plotAdvancementRate < 0.3) {
      insights.push({
        type: 'slow-burn',
        description: 'Plot advances gradually',
        suggestion: 'Focus on character development and world-building',
        confidence: 0.7
      })
    }
    
    return insights
  }

  generateRecommendations(patterns) {
    const recommendations = []
    
    // Based on encounter preferences
    if (patterns.preferredEncounterTypes.exploration > 0.4) {
      recommendations.push('Pre-generate exploration locations and environmental challenges')
    }
    
    if (patterns.preferredEncounterTypes.social > 0.3) {
      recommendations.push('Create a diverse pool of NPCs with varying motivations')
    }
    
    // Based on session length
    if (patterns.sessionLength > 4) {
      recommendations.push('Prepare additional content and backup encounters for longer sessions')
    }
    
    return recommendations
  }
}

class ContentPredictor {
  async predictNextNeeds(patterns) {
    const predictions = []
    
    // Predict based on activity balance
    if (patterns.patterns.explorationToRoleplaying.exploration > 0.5) {
      predictions.push({
        contentType: 'location',
        context: { theme: 'exploration', difficulty: 'varied' },
        probability: 0.8,
        urgency: 'medium',
        reasoning: 'High exploration activity detected'
      })
    }
    
    // Predict NPCs based on social frequency
    if (patterns.patterns.npcInteractionFrequency > 0.6) {
      predictions.push({
        contentType: 'npc',
        context: { role: 'varied', importance: 'moderate' },
        probability: 0.9,
        urgency: 'high',
        reasoning: 'Frequent NPC interactions require diverse characters'
      })
    }
    
    // Predict encounters based on combat preference
    if (patterns.patterns.preferredEncounterTypes.combat > 0.4) {
      predictions.push({
        contentType: 'encounter',
        context: { type: 'combat', cr: this.getCurrentCR() },
        probability: 0.7,
        urgency: 'medium',
        reasoning: 'Regular combat encounters expected'
      })
    }
    
    // Predict treasure based on resource usage
    if (patterns.patterns.resourceUsagePatterns.consumableUsage > 0.5) {
      predictions.push({
        contentType: 'treasure',
        context: { type: 'consumables', value: 'moderate' },
        probability: 0.6,
        urgency: 'low',
        reasoning: 'High consumable usage indicates need for resupply'
      })
    }
    
    return predictions
  }
  
  getCurrentCR() {
    const characterLevel = characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
    return Math.max(1, characterLevel - 1) // Slightly below character level for balanced encounters
  }
}

export default PredictiveContentEngine