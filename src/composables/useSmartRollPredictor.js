// src/composables/useSmartRollPredictor.js
import { ref, computed } from 'vue'

export function useSmartRollPredictor() {
  const recentRolls = ref([])
  const rollPatterns = ref(new Map())
  
  // Predict rolls based on context
  function predictRolls(analysis) {
    const predictions = []
    
    // Combat roll predictions
    if (analysis.inCombat) {
      // Attack rolls
      if (analysis.attackBonus !== undefined) {
        predictions.push({
          id: 'attack_roll',
          dice: `1d20+${analysis.attackBonus}`,
          reason: 'Attack roll',
          dc: analysis.enemyAC || null,
          confidence: 0.9
        })
      }
      
      // Damage rolls based on weapon
      if (analysis.primaryWeapon) {
        const damageRoll = getWeaponDamage(analysis.primaryWeapon)
        if (damageRoll) {
          predictions.push({
            id: 'damage_roll',
            dice: damageRoll.dice,
            reason: `${analysis.primaryWeapon} damage`,
            confidence: 0.8
          })
        }
      }
      
      // Saving throws if threatened
      if (analysis.threatened) {
        predictions.push({
          id: 'fort_save',
          dice: `1d20+${analysis.saves?.fortitude || 0}`,
          reason: 'Fortitude save',
          confidence: 0.7
        })
      }
    }
    
    // Skill check predictions
    if (analysis.environmentRequiresSkill) {
      const relevantSkills = getRelevantSkills(analysis)
      
      relevantSkills.forEach((skill, index) => {
        predictions.push({
          id: `skill_${skill.name}`,
          dice: `1d20+${skill.modifier}`,
          reason: `${skill.name} check`,
          dc: skill.estimatedDC || null,
          confidence: 0.8 - (index * 0.1)
        })
      })
    }
    
    // Initiative prediction
    if (analysis.combatStarting) {
      predictions.push({
        id: 'initiative',
        dice: `1d20+${analysis.initiative || 0}`,
        reason: 'Initiative',
        confidence: 1.0
      })
    }
    
    // Ability check predictions
    if (analysis.narrativeIndicatesCheck) {
      const ability = detectRequiredAbility(analysis.narrative)
      if (ability) {
        predictions.push({
          id: `ability_${ability.name}`,
          dice: `1d20+${ability.modifier}`,
          reason: `${ability.name} check`,
          confidence: 0.7
        })
      }
    }
    
    return sortByRelevance(predictions, analysis)
  }
  
  // Get weapon damage dice
  function getWeaponDamage(weaponName) {
    const weaponDamage = {
      'longsword': { dice: '1d8', type: 'slashing' },
      'greatsword': { dice: '2d6', type: 'slashing' },
      'rapier': { dice: '1d6', type: 'piercing' },
      'dagger': { dice: '1d4', type: 'piercing' },
      'battleaxe': { dice: '1d8', type: 'slashing' },
      'shortbow': { dice: '1d6', type: 'piercing' },
      'longbow': { dice: '1d8', type: 'piercing' },
      'quarterstaff': { dice: '1d6', type: 'bludgeoning' },
      'mace': { dice: '1d8', type: 'bludgeoning' },
      'crossbow': { dice: '1d8', type: 'piercing' }
    }
    
    const weapon = weaponName.toLowerCase()
    for (const [key, value] of Object.entries(weaponDamage)) {
      if (weapon.includes(key)) {
        return value
      }
    }
    
    // Default damage
    return { dice: '1d6', type: 'unknown' }
  }
  
  // Get relevant skills based on context
  function getRelevantSkills(analysis) {
    const skills = []
    
    // Environmental checks
    if (analysis.lastNarrativeContains) {
      if (analysis.lastNarrativeContains(['trap', 'mechanism', 'device'])) {
        if (analysis.skills?.disableDevice) {
          skills.push({
            name: 'Disable Device',
            modifier: analysis.skills.disableDevice,
            estimatedDC: 20
          })
        }
      }
      
      if (analysis.lastNarrativeContains(['hidden', 'concealed', 'secret'])) {
        if (analysis.skills?.perception) {
          skills.push({
            name: 'Perception',
            modifier: analysis.skills.perception,
            estimatedDC: 15
          })
        }
      }
      
      if (analysis.lastNarrativeContains(['climb', 'wall', 'cliff'])) {
        if (analysis.skills?.climb) {
          skills.push({
            name: 'Climb',
            modifier: analysis.skills.climb,
            estimatedDC: 15
          })
        }
      }
      
      if (analysis.lastNarrativeContains(['jump', 'leap', 'chasm'])) {
        if (analysis.skills?.acrobatics) {
          skills.push({
            name: 'Acrobatics',
            modifier: analysis.skills.acrobatics,
            estimatedDC: 10
          })
        }
      }
      
      if (analysis.lastNarrativeContains(['knowledge', 'identify', 'recall'])) {
        // Add relevant knowledge skills
        Object.entries(analysis.skills || {}).forEach(([skill, modifier]) => {
          if (skill.toLowerCase().includes('knowledge')) {
            skills.push({
              name: skill,
              modifier: modifier,
              estimatedDC: 15
            })
          }
        })
      }
    }
    
    return skills
  }
  
  // Detect required ability from narrative
  function detectRequiredAbility(narrative) {
    if (!narrative) return null
    
    const lowerNarrative = narrative.toLowerCase()
    
    // Strength checks
    if (lowerNarrative.match(/\b(push|pull|lift|break|force|strength)\b/)) {
      return { name: 'Strength', modifier: 0 } // Would need actual modifier
    }
    
    // Dexterity checks
    if (lowerNarrative.match(/\b(balance|dodge|reflex|quick|agile)\b/)) {
      return { name: 'Dexterity', modifier: 0 }
    }
    
    // Constitution checks
    if (lowerNarrative.match(/\b(endure|resist|stamina|fortitude|tough)\b/)) {
      return { name: 'Constitution', modifier: 0 }
    }
    
    // Intelligence checks
    if (lowerNarrative.match(/\b(figure out|understand|deduce|analyze|intelligence)\b/)) {
      return { name: 'Intelligence', modifier: 0 }
    }
    
    // Wisdom checks
    if (lowerNarrative.match(/\b(notice|sense|intuition|willpower|wisdom)\b/)) {
      return { name: 'Wisdom', modifier: 0 }
    }
    
    // Charisma checks
    if (lowerNarrative.match(/\b(persuade|intimidate|bluff|diplomacy|charisma)\b/)) {
      return { name: 'Charisma', modifier: 0 }
    }
    
    return null
  }
  
  // Sort predictions by relevance
  function sortByRelevance(predictions, analysis) {
    return predictions.sort((a, b) => {
      // Priority factors
      let aScore = a.confidence
      let bScore = b.confidence
      
      // Boost combat rolls if in combat
      if (analysis.inCombat) {
        if (a.id.includes('attack') || a.id.includes('damage')) aScore += 0.2
        if (b.id.includes('attack') || b.id.includes('damage')) bScore += 0.2
      }
      
      // Boost saves if threatened
      if (analysis.threatened) {
        if (a.reason.includes('save')) aScore += 0.15
        if (b.reason.includes('save')) bScore += 0.15
      }
      
      // Boost initiative if combat starting
      if (analysis.combatStarting && a.id === 'initiative') aScore = 1.5
      if (analysis.combatStarting && b.id === 'initiative') bScore = 1.5
      
      return bScore - aScore
    })
  }
  
  // Track roll history for pattern analysis
  function recordRoll(roll) {
    recentRolls.value.push({
      ...roll,
      timestamp: Date.now()
    })
    
    // Keep only last 50 rolls
    if (recentRolls.value.length > 50) {
      recentRolls.value.shift()
    }
    
    // Update patterns
    updateRollPatterns(roll)
  }
  
  // Update roll patterns
  function updateRollPatterns(roll) {
    const key = `${roll.reason}_${roll.dice}`
    const pattern = rollPatterns.value.get(key) || { count: 0, lastUsed: 0 }
    
    pattern.count++
    pattern.lastUsed = Date.now()
    
    rollPatterns.value.set(key, pattern)
  }
  
  // Get frequently used rolls
  function getFrequentRolls() {
    const patterns = Array.from(rollPatterns.value.entries())
      .map(([key, data]) => {
        const [reason, dice] = key.split('_')
        return { reason, dice, ...data }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    return patterns
  }
  
  // Suggest roll based on time of day (for regular events)
  function getTimeBasedSuggestions() {
    const hour = new Date().getHours()
    const suggestions = []
    
    // Morning perception checks
    if (hour >= 6 && hour <= 9) {
      suggestions.push({
        dice: '1d20',
        reason: 'Morning perception check',
        confidence: 0.3
      })
    }
    
    // Evening watch rolls
    if (hour >= 20 || hour <= 2) {
      suggestions.push({
        dice: '1d20',
        reason: 'Watch duty check',
        confidence: 0.3
      })
    }
    
    return suggestions
  }
  
  return {
    predictRolls,
    recordRoll,
    getFrequentRolls,
    getTimeBasedSuggestions,
    recentRolls: computed(() => recentRolls.value),
    rollPatterns: computed(() => rollPatterns.value)
  }
}