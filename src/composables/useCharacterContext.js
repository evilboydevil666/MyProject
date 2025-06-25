import { ref, computed, watch } from 'vue'

export function useCharacterContext(characterState) {
  // Character context data
  const characterContext = ref({
    name: '',
    class: '',
    level: 1,
    currentHp: 10,
    maxHp: 10,
    hp: 10, // Add duplicate for compatibility
    hpMax: 10, // Add duplicate for compatibility
    conditions: [],
    activeEffects: [],
    resources: {}
  })
  
  // Character insights derived from state
  const characterInsights = computed(() => {
    const insights = []
    const ctx = characterContext.value
    
    // Health status
    const hpPercent = (ctx.currentHp / ctx.maxHp) * 100
    if (hpPercent <= 25) {
      insights.push({ type: 'danger', text: 'Critically wounded!' })
    } else if (hpPercent <= 50) {
      insights.push({ type: 'warning', text: 'Badly hurt' })
    }
    
    // Conditions
    if (ctx.conditions.length > 0) {
      insights.push({ 
        type: 'info', 
        text: `Conditions: ${ctx.conditions.join(', ')}` 
      })
    }
    
    // Resources
    if (ctx.resources.spellSlots) {
      const totalSlots = Object.values(ctx.resources.spellSlots).reduce((a, b) => a + b.current, 0)
      if (totalSlots === 0) {
        insights.push({ type: 'warning', text: 'No spell slots remaining' })
      }
    }
    
    return insights
  })
  
  // Update context from character state
  function updateContext(state) {
    if (!state) return
    
    // Calculate total level from classes array
    const totalLevel = state.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || state.level || 1
    
    // Get primary class name
    const primaryClass = state.classes?.[0]?.className || state.class || 'Adventurer'
    
    characterContext.value = {
      name: state.name || 'Unknown Hero',
      class: primaryClass,
      level: totalLevel,
      currentHp: state.hp || state.currentHp || 10,
      maxHp: state.hpMax || state.maxHp || 10,
      hp: state.hp || state.currentHp || 10, // Duplicate for compatibility
      hpMax: state.hpMax || state.maxHp || 10, // Duplicate for compatibility
      conditions: state.conditions || [],
      activeEffects: state.activeEffects || [],
      resources: {
        spellSlots: state.spellSlots || {},
        abilities: state.abilities || {},
        items: state.consumables || {}
      },
      // Add additional fields for enhanced suggestions
      equipment: state.equipment || {},
      skills: state.skills || [],
      spells: state.spells || [],
      bab: state.bab || 0,
      saves: {
        fort: state.saves?.fort || 0,
        ref: state.saves?.ref || 0,
        will: state.saves?.will || 0
      },
      abilities: state.abilities || {},
      initiative: calculateInitiative(state),
      spellsKnown: state.spells || []
    }
  }
  
  // NEW: Analyze context for suggestions
  function analyzeContext(options) {
    const { character, narrative, recentMessages } = options
    
    // Use the characterContext if character not provided
    const char = character || characterContext.value
    
    // Extract narrative text if it's an object
    let narrativeText = ''
    if (narrative) {
      if (typeof narrative === 'string') {
        narrativeText = narrative
      } else if (narrative && typeof narrative === 'object') {
        // If narrative is an object, try to extract the text
        narrativeText = narrative.text || narrative.content || narrative.message || ''
      }
    }
    
    // Analyze narrative for combat indicators
    const combatWords = ['attack', 'combat', 'fight', 'enemy', 'hostile', 'initiative', 'damage']
    const inCombat = narrativeText ? combatWords.some(word => 
      narrativeText.toLowerCase().includes(word)
    ) : false
    
    // Check if combat is just starting
    const combatStarting = narrativeText ? 
      narrativeText.toLowerCase().includes('roll initiative') || 
      narrativeText.toLowerCase().includes('combat begins') : false
    
    // Detect threats
    const threatWords = ['threatens', 'hostile', 'aggressive', 'dangerous', 'menacing']
    const threatened = narrativeText ? threatWords.some(word => 
      narrativeText.toLowerCase().includes(word)
    ) : false
    
    // Check for environmental requirements
    const environmentRequiresSkill = detectSkillRequirements(narrativeText)
    
    // Detect if narrative indicates an ability check
    const narrativeIndicatesCheck = narrativeText ? 
      narrativeText.toLowerCase().includes('make a') || 
      narrativeText.toLowerCase().includes('roll a') ||
      narrativeText.toLowerCase().includes('test your') : false
    
    return {
      // Combat status
      inCombat,
      combatStarting,
      threatened,
      
      // Character status
      lowHealth: char.currentHp < char.maxHp * 0.5,
      hasHealing: checkHealingAvailable(char),
      
      // Skills and abilities  
      topSkills: getTopCharacterSkills(char),
      canCastSpells: (char.spellsKnown?.length > 0) || (char.spells?.length > 0),
      
      // Environmental
      lastNarrativeContains: (terms) => checkNarrativeContent(narrativeText, terms),
      environmentRequiresSkill,
      narrativeIndicatesCheck,
      
      // Equipment
      primaryWeapon: char.equipment?.mainHand?.name || 'weapon',
      attackBonus: calculateAttackBonus(char),
      enemyAC: extractEnemyAC(narrativeText),
      
      // Recent actions
      recentlySearched: checkRecentAction(recentMessages, 'search'),
      
      // Saves and defenses
      saves: {
        fortitude: char.saves?.fort || 0,
        reflex: char.saves?.ref || 0,
        will: char.saves?.will || 0
      },
      
      // Skills object for specific checks
      skills: {
        perception: getSkillModifier(char, 'Perception'),
        stealth: getSkillModifier(char, 'Stealth'),
        disableDevice: getSkillModifier(char, 'Disable Device'),
        climb: getSkillModifier(char, 'Climb'),
        acrobatics: getSkillModifier(char, 'Acrobatics'),
        // Add more skills as needed
      },
      
      // Initiative
      initiative: char.initiative || calculateInitiative(char),
      
      // Narrative content
      narrative: narrativeText || '',
      
      // Should use AI
      shouldUseAI: checkShouldUseAI()
    }
  }
  
  // Helper function to get top skills
  function getTopCharacterSkills(character) {
    if (!character.skills || !Array.isArray(character.skills)) return []
    
    return character.skills
      .filter(skill => skill.ranks > 0 || skill.total > 0)
      .sort((a, b) => (b.total || 0) - (a.total || 0))
      .slice(0, 3)
      .map(skill => ({
        name: skill.name,
        modifier: skill.total || 0
      }))
  }
  
  // Helper function to get specific skill modifier
  function getSkillModifier(character, skillName) {
    if (!character.skills || !Array.isArray(character.skills)) return 0
    
    const skill = character.skills.find(s => 
      s.name?.toLowerCase() === skillName.toLowerCase()
    )
    return skill?.total || 0
  }
  
  // Helper function to calculate attack bonus
  function calculateAttackBonus(character) {
    const bab = character.bab || 0
    const strMod = character.abilities?.str?.modifier || 0
    // Could add weapon enhancement bonus, other modifiers
    return bab + strMod
  }
  
  // Helper function to calculate initiative
  function calculateInitiative(character) {
    const dexMod = character.abilities?.dex?.modifier || 0
    // Could add improved initiative feat bonus
    return dexMod
  }
  
  // Helper function to check healing availability
  function checkHealingAvailable(character) {
    // Check for healing potions in inventory
    if (character.inventory) {
      const healingItems = ['healing potion', 'potion of healing', 'cure wounds']
      // This would need to check actual inventory structure
      return true // Placeholder
    }
    
    // Check for healing spells
    if (character.spells && Array.isArray(character.spells)) {
      const healingSpells = ['cure light wounds', 'cure moderate wounds', 'heal']
      return character.spells.some(spell => 
        healingSpells.some(heal => spell.name?.toLowerCase().includes(heal))
      )
    }
    
    return false
  }
  
  // Helper function to check narrative content
  function checkNarrativeContent(narrative, terms) {
    if (!narrative || typeof narrative !== 'string') return false
    
    const lowerNarrative = narrative.toLowerCase()
    
    if (Array.isArray(terms)) {
      return terms.some(term => {
        if (typeof term === 'string') {
          return lowerNarrative.includes(term.toLowerCase())
        }
        return false
      })
    }
    
    if (typeof terms === 'string') {
      return lowerNarrative.includes(terms.toLowerCase())
    }
    
    return false
  }
  
  // Helper function to detect skill requirements
  function detectSkillRequirements(narrative) {
    if (!narrative || typeof narrative !== 'string') return false
    
    const skillIndicators = [
      'check', 'test', 'roll', 'attempt', 'try to',
      'search', 'examine', 'investigate', 'listen',
      'climb', 'jump', 'sneak', 'hide', 'detect'
    ]
    
    const lowerNarrative = narrative.toLowerCase()
    return skillIndicators.some(indicator => lowerNarrative.includes(indicator))
  }
  
  // Helper function to check recent actions
  function checkRecentAction(recentMessages, action) {
    if (!recentMessages || !Array.isArray(recentMessages)) return false
    
    const recentPlayerMessages = recentMessages
      .filter(msg => msg.role === 'user')
      .slice(-3) // Last 3 player messages
    
    return recentPlayerMessages.some(msg => 
      msg.content?.toLowerCase().includes(action.toLowerCase())
    )
  }
  
  // Helper function to extract enemy AC from narrative
  function extractEnemyAC(narrative) {
    if (!narrative || typeof narrative !== 'string') return null
    
    // Look for AC mentions in narrative
    const acMatch = narrative.match(/AC\s*[:=]?\s*(\d+)/i)
    if (acMatch) {
      return parseInt(acMatch[1])
    }
    
    return null
  }
  
  // Helper function to check if AI should be used
  function checkShouldUseAI() {
    // Check if API key is available
    const hasApiKey = !!localStorage.getItem('openai-api-key')
    
    // Could add more logic here (rate limiting, user preferences, etc.)
    return hasApiKey
  }
  
  // Watch for changes in character state
  if (characterState) {
    watch(() => characterState, updateContext, { 
      immediate: true, 
      deep: true 
    })
  }
  
  return {
    characterContext,
    characterInsights,
    updateContext,
    analyzeContext // Export the new function
  }
}