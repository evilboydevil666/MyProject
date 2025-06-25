import { ref } from 'vue'
import { AIService } from '../services/AIService.js'
import { ContentFormatter } from '../utils/ContentFormatter.js'

export class NarrativeEngine {
  constructor(systems) {
    this.systems = systems
    this.aiService = new AIService()
    this.formatter = new ContentFormatter()
    
    this.state = ref({
      messages: [],
      isLoading: false,
      currentContext: null
    })
  }
  
  async initialize() {
    // Load narrative history
    this.loadHistory()
  }
  
  async processPlayerAction(action) {
    // Add to messages
    this.addMessage('user', action)
    
    // Get enriched context
    const context = await this.buildEnrichedContext(action)
    
    // Route to appropriate handler
    const response = await this.routeAction(action, context)
    
    // Process response
    await this.processResponse(response)
    
    // Emit events for other systems
    this.systems.emit('narrative:action', { action, response })
    
    return response
  }
  
  async buildEnrichedContext(action) {
    const baseContext = this.systems.getContext()
    
    // Enhance with memory search
    const relevantMemories = await this.systems.memory.searchRelated(action)
    
    // Get predictions
    const predictions = await this.systems.prediction.predictOutcomes(action, baseContext)
    
    return {
      ...baseContext,
      action,
      relevantMemories,
      predictions,
      timestamp: Date.now()
    }
  }
  
  async routeAction(action, context) {
    // Check if dice roll
    if (this.isDiceCommand(action)) {
      return this.systems.dice.processCommand(action, context)
    }
    
    // Check if requires web chat
    if (this.requiresWebChat(action, context)) {
      this.systems.emit('narrative:suggest-web', { action, context })
    }
    
    // Default to AI processing
    return this.aiService.generateNarrative(action, context)
  }
  
  isDiceCommand(action) {
    return action.toLowerCase().startsWith('/roll') || 
           action.match(/\d+d\d+/i)
  }
  
  requiresWebChat(action, context) {
    const complexityIndicators = [
      'create detailed',
      'design complete',
      'full session',
      'comprehensive'
    ]
    
    return complexityIndicators.some(indicator => 
      action.toLowerCase().includes(indicator)
    )
  }
  
  addMessage(role, content, metadata = {}) {
    const message = {
      id: Date.now() + Math.random(),
      role,
      content,
      timestamp: Date.now(),
      ...metadata
    }
    
    this.state.value.messages.push(message)
    this.saveHistory()
    
    return message
  }
  
  async processResponse(response) {
    // Add to messages
    this.addMessage('assistant', response.content, {
      type: response.type || 'narrative',
      source: response.source,
      confidence: response.confidence
    })
    
    // Check for inventory changes
    if (response.content) {
      const inventoryChanges = await this.systems.inventory.parseChanges(response.content)
      if (inventoryChanges.hasChanges) {
        this.systems.emit('inventory:changes', inventoryChanges)
      }
    }
    
    // Update memory
    await this.systems.memory.recordInteraction({
      playerAction: this.getLastPlayerAction(),
      gmResponse: response.content,
      context: this.state.value.currentContext
    })
  }
  
  getLastPlayerAction() {
    const userMessages = this.state.value.messages.filter(m => m.role === 'user')
    return userMessages[userMessages.length - 1]?.content || ''
  }
  
  getRecentContext(limit = 5) {
    return this.state.value.messages.slice(-limit)
  }
  
  saveHistory() {
    try {
      const toSave = this.state.value.messages.slice(-100) // Keep last 100
      localStorage.setItem('rpg-narrator-narrative', JSON.stringify(toSave))
    } catch (error) {
      console.warn('Failed to save narrative history:', error)
    }
  }
  
  loadHistory() {
    try {
      const saved = localStorage.getItem('rpg-narrator-narrative')
      if (saved) {
        this.state.value.messages = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load narrative history:', error)
    }
  }
}