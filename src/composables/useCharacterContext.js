import { ref, computed, watch } from 'vue'

export function useCharacterContext(characterState) {
  // Character context data
  const characterContext = ref({
    name: '',
    class: '',
    level: 1,
    currentHp: 10,
    maxHp: 10,
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
    
    characterContext.value = {
      name: state.name || 'Unknown Hero',
      class: state.class || 'Adventurer',
      level: state.level || 1,
      currentHp: state.hp?.current || state.currentHp || 10,
      maxHp: state.hp?.max || state.maxHp || 10,
      conditions: state.conditions || [],
      activeEffects: state.activeEffects || [],
      resources: {
        spellSlots: state.spellSlots || {},
        abilities: state.abilities || {},
        items: state.consumables || {}
      }
    }
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
    updateContext
  }
}