import { ref } from 'vue'
import DiceRoller from '../utils/DiceRoller.js'
import { DiceStatistics } from '../utils/DiceStatistics.js'

export class DiceSystem {
  constructor(systems) {
    this.systems = systems
    this.roller = DiceRoller
    this.statistics = new DiceStatistics()
    
    this.state = ref({
      history: [],
      currentStreak: null,
      statistics: {}
    })
  }
  
  async initialize(memorySystem) {
    this.memory = memorySystem
    this.loadHistory()
    this.updateStatistics()
  }
  
  async processCommand(command, context) {
    const rollRequest = this.parseCommand(command)
    if (!rollRequest.valid) {
      return {
        type: 'dice-error',
        content: rollRequest.error,
        source: 'dice-system'
      }
    }
    
    // Execute roll
    const rollResult = await this.executeRoll(rollRequest, context)
    
    // Generate predictions
    const predictions = await this.generatePredictions(rollResult, context)
    
    // Format response
    const response = this.formatRollResponse(rollResult, predictions)
    
    // Update history and statistics
    this.recordRoll(rollResult)
    
    return response
  }
  
  parseCommand(command) {
    // Handle various formats
    const patterns = [
      { regex: /\/roll\s+(\d+)?d(\d+)([+-]\d+)?/i, type: 'basic' },
      { regex: /\/roll\s+(\w+)(?:\s+([+-]\d+))?/i, type: 'skill' },
      { regex: /\/roll\s+(fort|ref|will)(?:\s+([+-]\d+))?/i, type: 'save' }
    ]
    
    for (const pattern of patterns) {
      const match = command.match(pattern.regex)
      if (match) {
        return this.buildRollRequest(match, pattern.type)
      }
    }
    
    return { valid: false, error: 'Invalid roll format' }
  }
  
  buildRollRequest(match, type) {
    switch (type) {
      case 'basic':
        return {
          valid: true,
          type: 'basic',
          dice: parseInt(match[1]) || 1,
          sides: parseInt(match[2]),
          modifier: parseInt(match[3]) || 0
        }
      
      case 'skill':
        return {
          valid: true,
          type: 'skill',
          skillName: match[1],
          situationalMod: parseInt(match[2]) || 0
        }
      
      case 'save':
        return {
          valid: true,
          type: 'save',
          saveType: match[1],
          situationalMod: parseInt(match[2]) || 0
        }
      
      default:
        return { valid: false, error: 'Unknown roll type' }
    }
  }
  
  async executeRoll(request, context) {
    let result
    
    switch (request.type) {
      case 'basic':
        result = this.roller.rollExpression(
          `${request.dice}d${request.sides}${request.modifier >= 0 ? '+' : ''}${request.modifier}`
        )
        break
      
      case 'skill':
        result = this.rollSkill(request.skillName, request.situationalMod)
        break
      
      case 'save':
        result = this.rollSave(request.saveType, request.situationalMod)
        break
    }
    
    return {
      ...result,
      context,
      request,
      timestamp: Date.now()
    }
  }
  
  rollSkill(skillName, situationalMod = 0) {
    const skill = this.systems.getCharacterContext().topSkills
      .find(s => s.name.toLowerCase() === skillName.toLowerCase())
    
    if (!skill) {
      return {
        success: false,
        error: `Skill "${skillName}" not found or has no ranks`
      }
    }
    
    const totalMod = skill.bonus + situationalMod
    const roll = this.roller.rollD20(totalMod)
    
    return {
      ...roll,
      skillName: skill.name,
      baseBonus: skill.bonus,
      situationalMod,
      type: 'skill'
    }
  }
  
  rollSave(saveType, situationalMod = 0) {
    const saves = this.systems.getCharacterContext().saves
    const saveBonus = saves[saveType] || 0
    const totalMod = saveBonus + situationalMod
    
    const roll = this.roller.rollD20(totalMod)
    
    return {
      ...roll,
      saveType,
      baseBonus: saveBonus,
      situationalMod,
      type: 'save'
    }
  }
  
  async generatePredictions(rollResult, context) {
    // Get statistical context
    const stats = this.statistics.analyzeRoll(rollResult, this.state.value.history)
    
    // Get memory-based predictions
    const memoryPredictions = await this.memory.predictOutcomes(rollResult, context)
    
    // Combine predictions
    return {
      statistical: stats,
      narrative: memoryPredictions,
      confidence: this.calculateConfidence(stats, memoryPredictions)
    }
  }
  
  formatRollResponse(rollResult, predictions) {
    let content = `🎲 **${rollResult.description || 'Roll Result'}**\n`
    
    if (rollResult.expression) {
      content += `Expression: ${rollResult.expression}\n`
    }
    
    content += `Result: **${rollResult.total}**`
    
    if (rollResult.isNatural20) {
      content += ' 🎯 **NATURAL 20!**'
    } else if (rollResult.isNatural1) {
      content += ' 💥 **NATURAL 1!**'
    }
    
    // Add predictions if available
    if (predictions.narrative) {
      content += '\n\n' + this.formatPredictions(predictions.narrative)
    }
    
    return {
      type: 'dice-roll',
      content,
      source: 'dice-system',
      rollResult,
      predictions
    }
  }
  
  formatPredictions(predictions) {
    return `🔮 **Possible Outcomes:**
Success: ${predictions.success}
Failure: ${predictions.failure}
Complication: ${predictions.complication}`
  }
  
  recordRoll(rollResult) {
    this.state.value.history.unshift(rollResult)
    
    // Keep only recent history
    if (this.state.value.history.length > 100) {
      this.state.value.history = this.state.value.history.slice(0, 100)
    }
    
    // Update statistics
    this.updateStatistics()
    
    // Save to storage
    this.saveHistory()
    
    // Emit event
    this.systems.emit('dice:rolled', rollResult)
  }
  
  updateStatistics() {
    this.state.value.statistics = this.statistics.calculate(this.state.value.history)
  }
  
  calculateConfidence(stats, predictions) {
    let confidence = 0.5
    
    if (stats.sampleSize > 10) confidence += 0.2
    if (predictions && predictions.historicalData) confidence += 0.2
    if (stats.consistency > 0.7) confidence += 0.1
    
    return Math.min(confidence, 1.0)
  }
  
  saveHistory() {
    try {
      localStorage.setItem('rpg-narrator-dice-history', 
        JSON.stringify(this.state.value.history.slice(0, 50))
      )
    } catch (error) {
      console.warn('Failed to save dice history:', error)
    }
  }
  
  loadHistory() {
    try {
      const saved = localStorage.getItem('rpg-narrator-dice-history')
      if (saved) {
        this.state.value.history = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load dice history:', error)
    }
  }
}