import { ref } from 'vue'
import { InventoryParser } from '../utils/InventoryParser.js'

export class InventorySystem {
  constructor(systems) {
    this.systems = systems
    this.parser = InventoryParser
    
    this.state = ref({
      pendingChanges: [],
      recentChanges: []
    })
  }
  
  async initialize() {
    // Load any saved pending changes
    this.loadPendingChanges()
  }
  
  async parseChanges(content) {
    const changes = this.parser.parseInventoryChanges(content)
    
    return {
      hasChanges: this.parser.hasChanges(changes),
      ...changes
    }
  }
  
  async applyChanges(changes) {
    const result = await this.parser.applyInventoryChanges(changes, true)
    
    if (result.applied) {
      this.state.value.recentChanges.push({
        id: Date.now(),
        timestamp: Date.now(),
        changes: result.changes,
        ...changes
      })
      
      // Keep only recent history
      if (this.state.value.recentChanges.length > 10) {
        this.state.value.recentChanges = this.state.value.recentChanges.slice(-10)
      }
    }
    
    return result
  }
  
  addPendingChange(changes) {
    this.state.value.pendingChanges.push({
      id: Date.now(),
      timestamp: Date.now(),
      ...changes
    })
    
    this.savePendingChanges()
  }
  
  removePendingChange(changeId) {
    this.state.value.pendingChanges = this.state.value.pendingChanges
      .filter(c => c.id !== changeId)
    
    this.savePendingChanges()
  }
  
  savePendingChanges() {
    try {
      localStorage.setItem('rpg-narrator-pending-inventory', 
        JSON.stringify(this.state.value.pendingChanges)
      )
    } catch (error) {
      console.warn('Failed to save pending changes:', error)
    }
  }
  
  loadPendingChanges() {
    try {
      const saved = localStorage.getItem('rpg-narrator-pending-inventory')
      if (saved) {
        this.state.value.pendingChanges = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load pending changes:', error)
    }
  }
}