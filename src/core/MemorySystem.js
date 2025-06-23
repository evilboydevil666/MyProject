import { ref } from 'vue'

export class MemorySystem {
  constructor(systems) {
    this.systems = systems
    
    this.state = ref({
      coreMemory: {},
      recentMemories: [],
      relevantMemories: []
    })
  }
  
  async initialize(characterState) {
    this.character = characterState
    this.loadMemory()
  }
  
  async searchRelated(query) {
    // Simple keyword search for now
    const keywords = query.toLowerCase().split(' ')
    
    return this.state.value.recentMemories.filter(memory => 
      keywords.some(keyword => 
        memory.content.toLowerCase().includes(keyword)
      )
    ).slice(0, 5)
  }
  
  async recordInteraction(interaction) {
    const memory = {
      id: Date.now(),
      timestamp: Date.now(),
      type: 'interaction',
      content: interaction.gmResponse,
      playerAction: interaction.playerAction,
      context: interaction.context
    }
    
    this.state.value.recentMemories.unshift(memory)
    
    // Keep only recent memories
    if (this.state.value.recentMemories.length > 50) {
      this.state.value.recentMemories = this.state.value.recentMemories.slice(0, 50)
    }
    
    this.saveMemory()
  }
  
  async predictOutcomes(rollResult, context) {
    // Simple predictions based on roll type and result
    return {
      success: 'You succeed in your action',
      failure: 'The attempt fails',
      complication: 'Something unexpected happens'
    }
  }
  
  async generateCharacterInsights(character) {
    const insights = []
    
    // Health status
    const hpPercent = parseInt(character.hp.split('/')[0]) / parseInt(character.hp.split('/')[1])
    if (hpPercent < 0.3) {
      insights.push({
        id: 'health-low',
        message: 'Health critically low - consider healing',
        type: 'warning'
      })
    }
    
    return insights
  }
  
  getRelevantMemories() {
    return this.state.value.relevantMemories
  }
  
  updateCharacterMemory(characterState) {
    this.character = characterState
  }
  
  saveMemory() {
    try {
      localStorage.setItem('rpg-narrator-memory', JSON.stringify({
        core: this.state.value.coreMemory,
        recent: this.state.value.recentMemories.slice(0, 20)
      }))
    } catch (error) {
      console.warn('Failed to save memory:', error)
    }
  }
  
  loadMemory() {
    try {
      const saved = localStorage.getItem('rpg-narrator-memory')
      if (saved) {
        const data = JSON.parse(saved)
        this.state.value.coreMemory = data.core || {}
        this.state.value.recentMemories = data.recent || []
      }
    } catch (error) {
      console.warn('Failed to load memory:', error)
    }
  }
}