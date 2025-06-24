// Centralized systems management for better integration
import { reactive, computed } from 'vue'
import { characterState } from '../characterState.js'
import { NarrativeEngine } from './NarrativeEngine.js'
import { DiceSystem } from './DiceSystem.js'
import { MemorySystem } from './MemorySystem.js'
import { PredictionSystem } from './PredictionSystem.js'
import { InventorySystem } from './InventorySystem.js'

export class SystemsManager {
  constructor() {
    // Initialize all subsystems
    this.narrative = new NarrativeEngine(this)
    this.dice = new DiceSystem(this)
    this.memory = new MemorySystem(this)
    this.prediction = new PredictionSystem(this)
    this.inventory = new InventorySystem(this)
    
    // Cross-system event bus
    this.events = reactive({
      listeners: new Map()
    })
    
    // System state
    this.state = reactive({
      initialized: false,
      apiKey: localStorage.getItem('openai-api-key') || '',
      lastSync: null,
      activeSession: null
    })
    
    this.initialize()
  }
  
  async initialize() {
    // Initialize systems in correct order
    await this.memory.initialize(characterState)
    await this.narrative.initialize()
    await this.dice.initialize(this.memory)
    await this.prediction.initialize(this.narrative, this.memory)
    await this.inventory.initialize()
    
    this.state.initialized = true
    this.emit('systems:ready')
  }
  
  // Event system for cross-component communication
  on(event, handler) {
    if (!this.events.listeners.has(event)) {
      this.events.listeners.set(event, [])
    }
    this.events.listeners.get(event).push(handler)
  }
  
  off(event, handler) {
    const handlers = this.events.listeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) handlers.splice(index, 1)
    }
  }
  
  emit(event, data) {
    const handlers = this.events.listeners.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }
  
  // Unified context for all systems
  getContext() {
    return {
      character: this.getCharacterContext(),
      narrative: this.narrative.getRecentContext(),
      memory: this.memory.getRelevantMemories(),
      predictions: this.prediction.getCurrentPredictions(),
      session: this.state.activeSession
    }
  }
  
  getCharacterContext() {
    const totalLevel = characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1
    
    return {
      name: characterState.name || 'Character',
      level: totalLevel,
      classes: characterState.classes?.map(c => `${c.className} ${c.level}`).join(', ') || 'Fighter 1',
      hp: `${characterState.hp}/${characterState.hpMax}`,
      ac: characterState.ac,
      saves: characterState.saves,
      topSkills: characterState.skills
        ?.filter(s => s.rank > 0)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 5)
        .map(s => ({ name: s.name, bonus: s.rank + this.getAbilityMod(s.ability) }))
    }
  }
  
  getAbilityMod(ability) {
    const score = characterState.abilityScores?.[ability] || 10
    return Math.floor((score - 10) / 2)
  }
}

// Singleton instance
export const systems = new SystemsManager()