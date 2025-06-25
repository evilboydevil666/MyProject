// src/utils/diceRoller.js

/**
 * Pathfinder 1e Dice Rolling Utility
 * Handles all dice rolling functions for the RPG Narrator app
 */

export class DiceRoller {
  /**
   * Roll a single die
   * @param {number} sides - Number of sides on the die
   * @returns {number} - Result of the roll
   */
  static rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
  }

  /**
   * Roll multiple dice
   * @param {number} count - Number of dice to roll
   * @param {number} sides - Number of sides on each die
   * @returns {Array} - Array of individual roll results
   */
  static rollDice(count, sides) {
    const results = []
    for (let i = 0; i < count; i++) {
      results.push(this.rollDie(sides))
    }
    return results
  }

  /**
   * Parse and roll dice expression
   * @param {string} expression - Dice expression (e.g., "1d20+5", "3d6")
   * @returns {Object} - Roll result with details
   */
  static rollExpression(expression) {
    const cleanExpr = expression.replace(/\s/g, '').toLowerCase()
    
    // Match patterns like: 1d20+5, 3d6, d20, 2d8-1
    const match = cleanExpr.match(/^(\d+)?d(\d+)([+-]\d+)?$/)
    
    if (!match) {
      return {
        success: false,
        error: 'Invalid dice expression. Use format: XdY+Z (e.g., 1d20+5)',
        expression
      }
    }

    const numDice = parseInt(match[1]) || 1
    const dieSize = parseInt(match[2])
    const modifier = parseInt(match[3]) || 0

    // Validate limits
    if (numDice > 50) {
      return {
        success: false,
        error: 'Too many dice (max 50)',
        expression
      }
    }

    if (dieSize > 1000) {
      return {
        success: false,
        error: 'Die size too large (max d1000)',
        expression
      }
    }

    if (dieSize < 2) {
      return {
        success: false,
        error: 'Die must have at least 2 sides',
        expression
      }
    }

    // Roll the dice
    const rolls = this.rollDice(numDice, dieSize)
    const rollSum = rolls.reduce((sum, roll) => sum + roll, 0)
    const total = rollSum + modifier

    return {
      success: true,
      expression,
      numDice,
      dieSize,
      modifier,
      rolls,
      rollSum,
      total,
      isNatural20: dieSize === 20 && rolls.includes(20),
      isNatural1: dieSize === 20 && rolls.includes(1),
      timestamp: Date.now()
    }
  }

  /**
   * Roll a d20 with modifier (most common roll in Pathfinder)
   * @param {number} modifier - Modifier to add to the roll
   * @returns {Object} - Roll result
   */
  static rollD20(modifier = 0) {
    return this.rollExpression(`1d20${modifier >= 0 ? '+' : ''}${modifier}`)
  }

  /**
   * Roll ability check
   * @param {number} abilityScore - Ability score value
   * @returns {Object} - Roll result
   */
  static rollAbilityCheck(abilityScore) {
    const modifier = Math.floor((abilityScore - 10) / 2)
    return this.rollD20(modifier)
  }

  /**
   * Roll initiative
   * @param {number} dexMod - Dexterity modifier
   * @param {number} miscMod - Miscellaneous initiative bonuses
   * @returns {Object} - Roll result
   */
  static rollInitiative(dexMod = 0, miscMod = 0) {
    return this.rollD20(dexMod + miscMod)
  }

  /**
   * Roll saving throw
   * @param {number} baseSave - Base saving throw bonus
   * @param {number} abilityMod - Relevant ability modifier
   * @param {number} miscMod - Miscellaneous bonuses
   * @returns {Object} - Roll result
   */
  static rollSavingThrow(baseSave = 0, abilityMod = 0, miscMod = 0) {
    return this.rollD20(baseSave + abilityMod + miscMod)
  }

  /**
   * Roll skill check
   * @param {number} ranks - Skill ranks
   * @param {number} abilityMod - Relevant ability modifier
   * @param {number} classBonus - Class skill bonus (+3 if trained class skill)
   * @param {number} miscMod - Miscellaneous bonuses
   * @returns {Object} - Roll result
   */
  static rollSkillCheck(ranks = 0, abilityMod = 0, classBonus = 0, miscMod = 0) {
    return this.rollD20(ranks + abilityMod + classBonus + miscMod)
  }

  /**
   * Roll attack roll
   * @param {number} bab - Base attack bonus
   * @param {number} abilityMod - Strength or Dexterity modifier
   * @param {number} miscMod - Miscellaneous attack bonuses
   * @returns {Object} - Roll result
   */
  static rollAttack(bab = 0, abilityMod = 0, miscMod = 0) {
    return this.rollD20(bab + abilityMod + miscMod)
  }

  /**
   * Roll damage
   * @param {string} damageExpression - Damage dice expression (e.g., "1d8+3")
   * @returns {Object} - Roll result
   */
  static rollDamage(damageExpression) {
    return this.rollExpression(damageExpression)
  }

  /**
   * Format roll result for display
   * @param {Object} result - Roll result from rollExpression
   * @param {string} label - Label for the roll (e.g., "Attack", "Damage")
   * @returns {string} - Formatted string
   */
  static formatRoll(result, label = 'Roll') {
    if (!result.success) {
      return `❌ ${label}: ${result.error}`
    }

    const { expression, rolls, modifier, total, isNatural20, isNatural1 } = result
    
    let output = `🎲 **${label}**: ${expression}\n`
    output += `**Rolls**: [${rolls.join(', ')}]`
    
    if (modifier !== 0) {
      output += ` ${modifier >= 0 ? '+' : ''}${modifier}`
    }
    
    output += `\n**Total**: **${total}**`
    
    if (isNatural20) {
      output += ' 🎯 **NATURAL 20!**'
    } else if (isNatural1) {
      output += ' 💥 **NATURAL 1!**'
    }
    
    return output
  }

  /**
   * Roll percentile (d100)
   * @returns {Object} - Roll result
   */
  static rollPercentile() {
    return this.rollExpression('1d100')
  }

  /**
   * Roll hit points for level up
   * @param {number} hitDie - Hit die size (d6, d8, d10, d12)
   * @param {number} conMod - Constitution modifier
   * @param {number} favoredClass - 1 if favored class, 0 otherwise
   * @returns {Object} - Roll result
   */
  static rollHitPoints(hitDie, conMod = 0, favoredClass = 0) {
    const hpRoll = this.rollDie(hitDie)
    const total = hpRoll + conMod + favoredClass
    
    return {
      success: true,
      expression: `1d${hitDie}+${conMod}+${favoredClass}`,
      hitDieRoll: hpRoll,
      conMod,
      favoredClassBonus: favoredClass,
      total: Math.max(1, total), // Minimum 1 HP per level
      timestamp: Date.now()
    }
  }
}

// Convenience functions for common rolls
export const roll = {
  d20: (mod = 0) => DiceRoller.rollD20(mod),
  d4: () => DiceRoller.rollExpression('1d4'),
  d6: () => DiceRoller.rollExpression('1d6'),
  d8: () => DiceRoller.rollExpression('1d8'),
  d10: () => DiceRoller.rollExpression('1d10'),
  d12: () => DiceRoller.rollExpression('1d12'),
  d100: () => DiceRoller.rollPercentile(),
  custom: (expr) => DiceRoller.rollExpression(expr)
}

export default DiceRoller