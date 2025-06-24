import { computed } from 'vue'
import { characterState } from '../characterState.js'

export function useCharacter() {
  const totalLevel = computed(() => 
    characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1
  )
  
  const characterSummary = computed(() => ({
    name: characterState.name || 'Unnamed Character',
    race: characterState.race || 'Unknown',
    classes: characterState.classes?.map(c => `${c.className} ${c.level}`).join(', ') || 'None',
    level: totalLevel.value,
    hp: characterState.hp,
    hpMax: characterState.hpMax,
    ac: characterState.ac
  }))
  
  function getAbilityModifier(ability) {
    const score = characterState.abilityScores?.[ability] || 10
    return Math.floor((score - 10) / 2)
  }
  
  function getSkillBonus(skillName) {
    const skill = characterState.skills?.find(s => s.name === skillName)
    if (!skill) return 0
    
    const abilityMod = getAbilityModifier(skill.ability)
    return skill.rank + abilityMod + (skill.misc || 0)
  }
  
  function getSaveBonus(saveType) {
    const saves = characterState.saves
    return saves?.[saveType] || 0
  }
  
  return {
    characterState,
    totalLevel,
    characterSummary,
    getAbilityModifier,
    getSkillBonus,
    getSaveBonus
  }
}