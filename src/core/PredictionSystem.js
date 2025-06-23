import { ref } from 'vue'

export class PredictionSystem {
  constructor(systems) {
    this.systems = systems
    
    this.state = ref({
      activePredictions: [],
      preGeneratedContent: new Map(),
      analytics: {
        totalGenerated: 0,
        totalUsed: 0,
        hitRate: 0
      }
    })
  }
  
  async initialize(narrativeEngine, memorySystem) {
    this.narrative = narrativeEngine
    this.memory = memorySystem
  }
  
  async predictOutcomes(action, context) {
    const predictions = []
    
    // Analyze action for predictable outcomes
    const actionLower = action.toLowerCase()
    
    if (actionLower.includes('search') || actionLower.includes('look')) {
      predictions.push({
        type: 'discovery',
        probability: 0.7,
        outcome: 'You might find something hidden'
      })
    }
    
    if (actionLower.includes('attack') || actionLower.includes('fight')) {
      predictions.push({
        type: 'combat',
        probability: 0.9,
        outcome: 'Combat will likely ensue'
      })
    }
    
    if (actionLower.includes('sneak') || actionLower.includes('hide')) {
      predictions.push({
        type: 'stealth',
        probability: 0.6,
        outcome: 'Stealth check required'
      })
    }
    
    return predictions
  }
  
  async generateInputSuggestions({ partialInput, context }) {
    const suggestions = []
    
    if (!partialInput || partialInput.length < 2) return suggestions
    
    const lowerInput = partialInput.toLowerCase()
    
    // Common action patterns
    const patterns = [
      { trigger: 'i search', completion: 'I search the room for hidden doors' },
      { trigger: 'i attack', completion: 'I attack with my weapon' },
      { trigger: 'i cast', completion: 'I cast a spell' },
      { trigger: 'i try to', completion: 'I try to negotiate' },
      { trigger: 'i examine', completion: 'I examine the object closely' }
    ]
    
    patterns.forEach(pattern => {
      if (pattern.trigger.startsWith(lowerInput)) {
        suggestions.push(pattern.completion)
      }
    })
    
    return suggestions.slice(0, 3)
  }
  
  async preGenerate(context) {
    const predictions = []
    
    // Analyze context for likely needs
    const lastMessage = context.narrative?.[context.narrative.length - 1]
    
    if (lastMessage?.content.includes('door')) {
      predictions.push({
        id: 'door-' + Date.now(),
        type: 'location',
        preview: 'What lies beyond the door',
        suggestedAction: 'I open the door carefully'
      })
    }
    
    if (lastMessage?.content.includes('enemy') || lastMessage?.content.includes('hostile')) {
      predictions.push({
        id: 'combat-' + Date.now(),
        type: 'encounter',
        preview: 'Combat tactics and options',
        suggestedAction: 'I ready my weapon'
      })
    }
    
    // Store predictions
    predictions.forEach(pred => {
      this.state.value.preGeneratedContent.set(pred.id, pred)
    })
    
    this.state.value.activePredictions = predictions
    this.state.value.analytics.totalGenerated += predictions.length
    
    return predictions
  }
  
  getCurrentPredictions() {
    return this.state.value.activePredictions
  }
  
  usePrediction(predictionId) {
    const prediction = this.state.value.preGeneratedContent.get(predictionId)
    if (prediction) {
      this.state.value.analytics.totalUsed++
      this.updateHitRate()
    }
    return prediction
  }
  
  updateHitRate() {
    const { totalGenerated, totalUsed } = this.state.value.analytics
    this.state.value.analytics.hitRate = totalGenerated > 0 
      ? totalUsed / totalGenerated 
      : 0
  }
  
  stopPredictiveGeneration() {
    // Clean up any intervals or processes
    this.state.value.preGeneratedContent.clear()
  }
}