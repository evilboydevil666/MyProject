// src/utils/SmartRollPredictor.js
// Enhanced character roll integration with AI predictions

import { characterState } from '../characterState.js'
import DiceRoller from './DiceRoller.js'

export class SmartRollPredictor {
  constructor() {
    this.rollHistory = []
    this.contextEngine = new ContextEngine()
    this.loadHistory()
  }

  /**
   * Enhanced roll with context awareness and AI predictions
   */
  async rollWithContext(rollType, details = {}) {
    const rollResult = this.executeRoll(rollType, details)
    
    // Analyze roll context
    const context = this.contextEngine.analyzeRollContext(rollResult, details)
    
    // Get AI predictions for consequences
    const predictions = await this.generateConsequencePredictions(rollResult, context)
    
    // Store enhanced roll data
    const enhancedRoll = {
      ...rollResult,
      context,
      predictions,
      timestamp: Date.now(),
      sessionId: this.getCurrentSessionId()
    }
    
    this.addToHistory(enhancedRoll)
    
    return enhancedRoll
  }

  /**
   * Execute the actual dice roll
   */
  executeRoll(rollType, details) {
    const character = characterState
    let rollResult = {}

    switch (rollType) {
      case 'skill':
        rollResult = this.rollSkillCheck(details.skillName, details)
        break
      case 'attack':
        rollResult = this.rollAttack(details.weaponType, details)
        break
      case 'save':
        rollResult = this.rollSavingThrow(details.saveType, details)
        break
      case 'ability':
        rollResult = this.rollAbilityCheck(details.ability, details)
        break
      case 'initiative':
        rollResult = this.rollInitiative(details)
        break
      case 'damage':
        rollResult = this.rollDamage(details.damageExpression, details)
        break
      default:
        rollResult = DiceRoller.rollExpression(details.expression || '1d20')
    }

    return {
      ...rollResult,
      rollType,
      character: character.name,
      characterLevel: character.classes.reduce((sum, c) => sum + (c.level || 0), 0),
      details
    }
  }

  /**
   * Enhanced skill check with context
   */
  rollSkillCheck(skillName, details = {}) {
    const skill = characterState.skills.find(s => s.name === skillName)
    if (!skill) {
      return { success: false, error: `Skill ${skillName} not found` }
    }

    const abilityMod = this.getAbilityModifier(skill.ability)
    const classBonus = details.isClassSkill ? 3 : 0
    const totalModifier = skill.rank + abilityMod + classBonus + (skill.misc || 0) + (details.situationalMod || 0)

    const result = DiceRoller.rollD20(totalModifier)
    
    return {
      ...result,
      skillName,
      skillRank: skill.rank,
      abilityMod,
      classBonus,
      situationalMod: details.situationalMod || 0,
      description: `${skillName} Check`,
      difficultyClass: details.dc || null,
      success: details.dc ? result.total >= details.dc : null
    }
  }

  /**
   * Enhanced attack roll
   */
  rollAttack(weaponType, details = {}) {
    const bab = characterState.bab || 0
    const abilityMod = weaponType === 'ranged' ? 
      this.getAbilityModifier('DEX') : 
      this.getAbilityModifier('STR')
    
    const totalModifier = bab + abilityMod + (details.weaponBonus || 0) + (details.situationalMod || 0)
    const result = DiceRoller.rollD20(totalModifier)

    return {
      ...result,
      weaponType,
      bab,
      abilityMod,
      weaponBonus: details.weaponBonus || 0,
      situationalMod: details.situationalMod || 0,
      description: `${weaponType} Attack`,
      targetAC: details.targetAC || null,
      hits: details.targetAC ? result.total >= details.targetAC : null
    }
  }

  /**
   * Enhanced saving throw
   */
  rollSavingThrow(saveType, details = {}) {
    const saves = characterState.saves
    const saveBonus = saves[`${saveType}Base`] || saves[saveType] || 0
    const abilityMod = this.getSaveAbilityMod(saveType)
    const totalModifier = saveBonus + abilityMod + (details.situationalMod || 0)

    const result = DiceRoller.rollD20(totalModifier)

    return {
      ...result,
      saveType,
      saveBonus,
      abilityMod,
      situationalMod: details.situationalMod || 0,
      description: `${saveType.toUpperCase()} Save`,
      difficultyClass: details.dc || null,
      success: details.dc ? result.total >= details.dc : null
    }
  }

  /**
   * Generate AI-powered consequence predictions
   */
  async generateConsequencePredictions(rollResult, context) {
    const prompt = this.buildPredictionPrompt(rollResult, context)
    
    try {
      const response = await this.callChatGPT(prompt)
      return this.parsePredictions(response)
    } catch (error) {
      console.error('Failed to generate predictions:', error)
      return this.getFallbackPredictions(rollResult)
    }
  }

  /**
   * Build contextual prompt for AI predictions
   */
  buildPredictionPrompt(rollResult, context) {
    return `Predict consequences for this Pathfinder 1e roll:

**CHARACTER:** ${rollResult.character} (Level ${rollResult.characterLevel})
**ROLL:** ${rollResult.description}
**RESULT:** ${rollResult.total} (d20: ${rollResult.diceRoll}, mod: +${rollResult.modifier})
**CONTEXT:** ${context.situation}
**DIFFICULTY:** ${rollResult.difficultyClass || 'Unknown'}
**SUCCESS:** ${rollResult.success === true ? 'YES' : rollResult.success === false ? 'NO' : 'Unknown'}

Provide 3 brief consequence scenarios:
1. **Success scenario** (if applicable)
2. **Failure scenario** (if applicable)  
3. **Complication scenario** (interesting twist regardless of success/failure)

Keep each under 50 words. Focus on immediate story consequences, not mechanics.`
  }

  /**
   * Parse AI predictions
   */
  parsePredictions(response) {
    const scenarios = response.split(/\d+\.\s*\*\*/).slice(1)
    
    return {
      success: this.extractScenario(scenarios[0], 'success'),
      failure: this.extractScenario(scenarios[1], 'failure'),
      complication: this.extractScenario(scenarios[2], 'complication'),
      confidence: this.calculatePredictionConfidence()
    }
  }

  extractScenario(text, type) {
    if (!text) return `Standard ${type} outcome`
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .split('\n')[0]
      .trim()
      .substring(0, 150)
  }

  /**
   * Fallback predictions when AI fails
   */
  getFallbackPredictions(rollResult) {
    const rollType = rollResult.rollType
    const total = rollResult.total
    
    const templates = {
      skill: {
        success: "You accomplish the task successfully and gain valuable information or advantage.",
        failure: "The attempt fails, but you might get another chance or partial information.",
        complication: "Something unexpected happens during the attempt, changing the situation."
      },
      attack: {
        success: "Your attack strikes true, dealing damage and potentially creating tactical opportunities.",
        failure: "Your attack misses, but you learn something about your opponent's defenses.",
        complication: "The attack result creates an unexpected tactical situation for both sides."
      },
      save: {
        success: "You resist the effect completely and maintain full control of the situation.",
        failure: "You suffer the full effect but might have options to mitigate consequences.",
        complication: "The save result triggers additional effects or changes the encounter dynamics."
      }
    }

    return templates[rollType] || {
      success: "The roll succeeds with positive consequences.",
      failure: "The roll fails but creates new opportunities.",
      complication: "The result leads to an unexpected development."
    }
  }

  /**
   * Advanced roll analysis and suggestions
   */
  analyzeRollTrends() {
    const recentRolls = this.rollHistory.slice(-20)
    
    return {
      averageRoll: this.calculateAverageRoll(recentRolls),
      criticalFrequency: this.calculateCriticalFrequency(recentRolls),
      skillDistribution: this.getSkillUsageDistribution(recentRolls),
      streaks: this.detectStreaks(recentRolls),
      recommendations: this.generateRollRecommendations(recentRolls)
    }
  }

  /**
   * Predictive roll suggestions based on context
   */
  suggestNextRolls(currentSituation) {
    const context = this.contextEngine.analyzeCurrentSituation(currentSituation)
    const character = characterState
    
    const suggestions = []

    // Suggest skill checks based on context
    if (context.type === 'exploration') {
      suggestions.push({
        type: 'skill',
        skill: 'Perception',
        priority: 'high',
        reason: 'Look for hidden dangers or secrets'
      })
    }

    if (context.type === 'social') {
      suggestions.push({
        type: 'skill',
        skill: 'Sense Motive',
        priority: 'medium',
        reason: 'Read the intentions of NPCs'
      })
    }

    // Suggest saves based on recent patterns
    const recentSaves = this.rollHistory
      .filter(roll => roll.rollType === 'save')
      .slice(-5)

    if (recentSaves.length > 0) {
      const commonSave = this.getMostCommonSave(recentSaves)
      suggestions.push({
        type: 'save',
        saveType: commonSave,
        priority: 'low',
        reason: 'Prepare for similar challenges'
      })
    }

    return suggestions
  }

  // Helper methods
  getAbilityModifier(ability) {
    const score = characterState.abilityScores[ability] || 10
    return Math.floor((score - 10) / 2)
  }

  getSaveAbilityMod(saveType) {
    const abilityMap = {
      fort: 'CON',
      ref: 'DEX', 
      will: 'WIS'
    }
    return this.getAbilityModifier(abilityMap[saveType])
  }

  calculatePredictionConfidence() {
    return Math.random() * 0.3 + 0.7 // 70-100% confidence simulation
  }

  addToHistory(roll) {
    this.rollHistory.unshift(roll)
    if (this.rollHistory.length > 100) {
      this.rollHistory = this.rollHistory.slice(0, 100)
    }
    this.saveHistory()
  }

  saveHistory() {
    try {
      localStorage.setItem('rpg-narrator-roll-history', JSON.stringify(this.rollHistory))
    } catch (error) {
      console.warn('Failed to save roll history:', error)
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('rpg-narrator-roll-history')
      this.rollHistory = saved ? JSON.parse(saved) : []
    } catch (error) {
      this.rollHistory = []
    }
  }

  getCurrentSessionId() {
    return localStorage.getItem('current-session-id') || 'default'
  }

  async callChatGPT(prompt) {
    const apiKey = localStorage.getItem('openai-api-key')
    if (!apiKey) throw new Error('No API key')

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
            content: 'You are an expert Pathfinder 1e GM. Provide creative, story-focused consequences for dice rolls.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    })

    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    
    const data = await response.json()
    return data.choices[0].message.content
  }
}

/**
 * Context Engine for roll analysis
 */
class ContextEngine {
  analyzeRollContext(rollResult, details) {
    return {
      situation: this.inferSituation(rollResult, details),
      urgency: this.calculateUrgency(rollResult, details),
      stakesLevel: this.assessStakes(rollResult, details),
      environmentalFactors: this.identifyEnvironmentalFactors(details)
    }
  }

  inferSituation(rollResult, details) {
    const rollType = rollResult.rollType
    const skillName = rollResult.skillName
    
    if (rollType === 'skill') {
      if (skillName === 'Stealth') return 'Attempting to remain hidden'
      if (skillName === 'Perception') return 'Searching for clues or dangers'
      if (skillName === 'Diplomacy') return 'Negotiating with NPCs'
      if (skillName === 'Disable Device') return 'Dealing with traps or locks'
    }
    
    if (rollType === 'attack') return 'Combat encounter'
    if (rollType === 'save') return 'Resisting harmful effects'
    
    return details.situation || 'General adventure activity'
  }

  calculateUrgency(rollResult, details) {
    if (rollResult.rollType === 'save') return 'high'
    if (rollResult.rollType === 'attack') return 'high'
    if (details.timeLimit) return 'high'
    return 'medium'
  }

  assessStakes(rollResult, details) {
    if (rollResult.isNatural1) return 'critical failure possible'
    if (rollResult.isNatural20) return 'exceptional success possible'
    if (details.lifeOrDeath) return 'life threatening'
    return 'moderate consequences'
  }

  identifyEnvironmentalFactors(details) {
    return details.environment || 'standard conditions'
  }

  analyzeCurrentSituation(situation) {
    const keywords = {
      exploration: ['explore', 'search', 'investigate', 'room', 'area'],
      combat: ['fight', 'attack', 'enemy', 'monster', 'battle'],
      social: ['talk', 'negotiate', 'persuade', 'npc', 'conversation'],
      stealth: ['sneak', 'hide', 'quiet', 'stealth', 'undetected']
    }

    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => situation.toLowerCase().includes(word))) {
        return { type, confidence: 0.8 }
      }
    }

    return { type: 'general', confidence: 0.5 }
  }
}

// Export for use in components
export default SmartRollPredictor