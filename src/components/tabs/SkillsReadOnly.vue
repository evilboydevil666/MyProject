<template>
  <div class="skills-container space-y-6 text-white">
    <h2 class="text-2xl mb-4">Skills</h2>
    
    <!-- Skills Summary -->
    <div class="bg-gray-800 p-4 rounded border border-gray-600 mb-4">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-400">Total Skill Ranks</label>
          <div class="text-xl font-bold">{{ totalSkillRanks }}</div>
        </div>
        <div>
          <label class="block text-sm text-gray-400">Class Skills</label>
          <div class="text-xl font-bold text-green-400">{{ totalClassSkills }}</div>
        </div>
        <div>
          <label class="block text-sm text-gray-400">Trained Skills</label>
          <div class="text-xl font-bold text-blue-400">{{ trainedSkills }}</div>
        </div>
      </div>
    </div>

    <!-- Class Skill Indicator -->
    <div class="text-sm text-gray-400 mb-2">
      <span class="text-green-400 font-bold">●</span> = Class Skill (+3 bonus when trained)
    </div>

    <!-- Skills Table -->
    <div class="bg-gray-800 rounded border border-gray-600 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-900 text-gray-300">
            <th class="p-2 text-left">Skill</th>
            <th class="p-2 text-center w-16">Total</th>
            <th class="p-2 text-center w-16">Ranks</th>
            <th class="p-2 text-center w-16">Ability</th>
            <th class="p-2 text-center w-20">Mod</th>
            <th class="p-2 text-center w-16">Misc</th>
            <th class="p-2 text-center w-16">Roll</th>
          </tr>
        </thead>
        <tbody>
          <!-- Standard Skills -->
          <tr v-for="skill in skills" :key="skill.name"
              :class="[
                'border-t border-gray-700 hover:bg-gray-700',
                !canUseUntrained(skill) && skill.rank === 0 ? 'opacity-50' : ''
              ]">
            <td class="p-2">
              <div class="flex items-center gap-2">
                <span v-if="isClassSkill(skill.name)" class="text-green-400">●</span>
                <span>{{ skill.name }}</span>
                <span class="text-xs text-gray-500">({{ skill.ability }})</span>
              </div>
            </td>
            <td class="p-2 text-center font-bold text-lg"
                :class="getSkillTotalClass(skill)">
              {{ getSkillTotal(skill) >= 0 ? '+' : '' }}{{ getSkillTotal(skill) }}
            </td>
            <td class="p-2 text-center">{{ skill.rank }}</td>
            <td class="p-2 text-center text-gray-400">{{ skill.ability }}</td>
            <td class="p-2 text-center">
              {{ getAbilityMod(skill.ability) >= 0 ? '+' : '' }}{{ getAbilityMod(skill.ability) }}
            </td>
            <td class="p-2 text-center">
              {{ skill.misc !== 0 ? (skill.misc > 0 ? '+' : '') + skill.misc : '—' }}
            </td>
            <td class="p-2 text-center">
              <button @click="rollSkill(skill)"
                      :disabled="!canUseUntrained(skill) && skill.rank === 0"
                      class="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs">
                🎲
              </button>
            </td>
          </tr>

          <!-- Knowledge Skills -->
          <template v-if="characterState.knowledgeSkills?.length > 0">
            <tr class="bg-gray-900">
              <td colspan="7" class="p-2 text-sm font-semibold text-gray-400">Knowledge Skills</td>
            </tr>
            <tr v-for="(skill, idx) in characterState.knowledgeSkills" :key="'know-' + idx"
                :class="[
                  'border-t border-gray-700 hover:bg-gray-700',
                  skill.rank === 0 ? 'opacity-50' : ''
                ]">
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span v-if="isClassSkill(`Knowledge (${skill.subskill})`)" class="text-green-400">●</span>
                  <span>Knowledge ({{ skill.subskill }})</span>
                  <span class="text-xs text-gray-500">(INT)</span>
                </div>
              </td>
              <td class="p-2 text-center font-bold text-lg"
                  :class="getKnowledgeSkillClass(skill)">
                {{ getKnowledgeTotal(skill) >= 0 ? '+' : '' }}{{ getKnowledgeTotal(skill) }}
              </td>
              <td class="p-2 text-center">{{ skill.rank }}</td>
              <td class="p-2 text-center text-gray-400">INT</td>
              <td class="p-2 text-center">
                {{ getAbilityMod('INT') >= 0 ? '+' : '' }}{{ getAbilityMod('INT') }}
              </td>
              <td class="p-2 text-center">
                {{ skill.misc !== 0 ? (skill.misc > 0 ? '+' : '') + skill.misc : '—' }}
              </td>
              <td class="p-2 text-center">
                <button @click="rollKnowledgeSkill(skill)"
                        :disabled="skill.rank === 0"
                        class="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs">
                  🎲
                </button>
              </td>
            </tr>
          </template>

          <!-- Craft Skills -->
          <template v-if="characterState.craftSkills?.length > 0">
            <tr class="bg-gray-900">
              <td colspan="7" class="p-2 text-sm font-semibold text-gray-400">Craft Skills</td>
            </tr>
            <tr v-for="(skill, idx) in characterState.craftSkills" :key="'craft-' + idx"
                class="border-t border-gray-700 hover:bg-gray-700">
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span v-if="isClassSkill('Craft')" class="text-green-400">●</span>
                  <span>Craft ({{ skill.subskill }})</span>
                  <span class="text-xs text-gray-500">(INT)</span>
                </div>
              </td>
              <td class="p-2 text-center font-bold text-lg">
                {{ getCraftTotal(skill) >= 0 ? '+' : '' }}{{ getCraftTotal(skill) }}
              </td>
              <td class="p-2 text-center">{{ skill.rank }}</td>
              <td class="p-2 text-center text-gray-400">INT</td>
              <td class="p-2 text-center">
                {{ getAbilityMod('INT') >= 0 ? '+' : '' }}{{ getAbilityMod('INT') }}
              </td>
              <td class="p-2 text-center">
                {{ skill.misc !== 0 ? (skill.misc > 0 ? '+' : '') + skill.misc : '—' }}
              </td>
              <td class="p-2 text-center">
                <button @click="rollCraftSkill(skill)"
                        class="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">
                  🎲
                </button>
              </td>
            </tr>
          </template>

          <!-- Profession Skills -->
          <template v-if="characterState.professionSkills?.length > 0">
            <tr class="bg-gray-900">
              <td colspan="7" class="p-2 text-sm font-semibold text-gray-400">Profession Skills</td>
            </tr>
            <tr v-for="(skill, idx) in characterState.professionSkills" :key="'prof-' + idx"
                :class="[
                  'border-t border-gray-700 hover:bg-gray-700',
                  skill.rank === 0 ? 'opacity-50' : ''
                ]">
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span v-if="isClassSkill('Profession')" class="text-green-400">●</span>
                  <span>Profession ({{ skill.subskill }})</span>
                  <span class="text-xs text-gray-500">(WIS)</span>
                </div>
              </td>
              <td class="p-2 text-center font-bold text-lg">
                {{ getProfessionTotal(skill) >= 0 ? '+' : '' }}{{ getProfessionTotal(skill) }}
              </td>
              <td class="p-2 text-center">{{ skill.rank }}</td>
              <td class="p-2 text-center text-gray-400">WIS</td>
              <td class="p-2 text-center">
                {{ getAbilityMod('WIS') >= 0 ? '+' : '' }}{{ getAbilityMod('WIS') }}
              </td>
              <td class="p-2 text-center">
                {{ skill.misc !== 0 ? (skill.misc > 0 ? '+' : '') + skill.misc : '—' }}
              </td>
              <td class="p-2 text-center">
                <button @click="rollProfessionSkill(skill)"
                        :disabled="skill.rank === 0"
                        class="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs">
                  🎲
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { characterState } from '../../characterState.js'

// Props
const props = defineProps({
  readonly: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['character-roll'])

// Use characterState skills
const skills = characterState.skills

// Computed
const totalSkillRanks = computed(() => {
  let total = 0
  
  // Standard skills
  total += skills.reduce((sum, skill) => sum + (skill.rank || 0), 0)
  
  // Knowledge skills
  if (characterState.knowledgeSkills) {
    total += characterState.knowledgeSkills.reduce((sum, skill) => sum + (skill.rank || 0), 0)
  }
  
  // Craft skills
  if (characterState.craftSkills) {
    total += characterState.craftSkills.reduce((sum, skill) => sum + (skill.rank || 0), 0)
  }
  
  // Profession skills
  if (characterState.professionSkills) {
    total += characterState.professionSkills.reduce((sum, skill) => sum + (skill.rank || 0), 0)
  }
  
  return total
})

const totalClassSkills = computed(() => {
  let count = 0
  
  skills.forEach(skill => {
    if (isClassSkill(skill.name)) count++
  })
  
  // Count knowledge subskills
  if (characterState.knowledgeSkills) {
    characterState.knowledgeSkills.forEach(skill => {
      if (isClassSkill(`Knowledge (${skill.subskill})`)) count++
    })
  }
  
  return count
})

const trainedSkills = computed(() => {
  let count = 0
  
  skills.forEach(skill => {
    if (skill.rank > 0) count++
  })
  
  if (characterState.knowledgeSkills) {
    count += characterState.knowledgeSkills.filter(s => s.rank > 0).length
  }
  
  if (characterState.craftSkills) {
    count += characterState.craftSkills.filter(s => s.rank > 0).length
  }
  
  if (characterState.professionSkills) {
    count += characterState.professionSkills.filter(s => s.rank > 0).length
  }
  
  return count
})

// Methods
function isClassSkill(skillName) {
  return characterState.classes.some(cls => {
    const classSkills = characterState.classSkills[cls.className]
    if (!classSkills) return false
    
    // Check for "Knowledge (all)"
    if (classSkills.includes('Knowledge (All)') && skillName.startsWith('Knowledge')) {
      return true
    }
    
    return classSkills.includes(skillName)
  })
}

function canUseUntrained(skill) {
  return skill.untrained === 'Yes'
}

function getAbilityMod(ability) {
  const score = characterState.abilityScores[ability] || 10
  return Math.floor((score - 10) / 2)
}

function getSkillTotal(skill) {
  const ranks = skill.rank || 0
  const abilityMod = getAbilityMod(skill.ability)
  const classBonus = (isClassSkill(skill.name) && ranks > 0) ? 3 : 0
  const misc = skill.misc || 0
  
  // Add armor check penalty if applicable
  let armorPenalty = 0
  if (skill.armorCheckPenalty === 'Yes') {
    armorPenalty = characterState.skillPenalties || 0
  }
  
  return ranks + abilityMod + classBonus + misc + armorPenalty
}

function getKnowledgeTotal(skill) {
  const ranks = skill.rank || 0
  const abilityMod = getAbilityMod('INT')
  const classBonus = (isClassSkill(`Knowledge (${skill.subskill})`) && ranks > 0) ? 3 : 0
  const misc = skill.misc || 0
  
  return ranks + abilityMod + classBonus + misc
}

function getCraftTotal(skill) {
  const ranks = skill.rank || 0
  const abilityMod = getAbilityMod('INT')
  const classBonus = (isClassSkill('Craft') && ranks > 0) ? 3 : 0
  const misc = skill.misc || 0
  
  return ranks + abilityMod + classBonus + misc
}

function getProfessionTotal(skill) {
  const ranks = skill.rank || 0
  const abilityMod = getAbilityMod('WIS')
  const classBonus = (isClassSkill('Profession') && ranks > 0) ? 3 : 0
  const misc = skill.misc || 0
  
  return ranks + abilityMod + classBonus + misc
}

function getSkillTotalClass(skill) {
  const total = getSkillTotal(skill)
  if (total >= 15) return 'text-green-400'
  if (total >= 10) return 'text-blue-400'
  if (total >= 5) return 'text-yellow-400'
  return 'text-white'
}

function getKnowledgeSkillClass(skill) {
  const total = getKnowledgeTotal(skill)
  if (total >= 15) return 'text-green-400'
  if (total >= 10) return 'text-blue-400'
  if (total >= 5) return 'text-yellow-400'
  return 'text-white'
}

// Roll functions
function roll(modifier = 0, rollType = '', description = '') {
  const d20 = Math.ceil(Math.random() * 20)
  const total = d20 + modifier
  
  const rollResult = {
    type: rollType,
    description: description,
    expression: `1d20${modifier >= 0 ? '+' : ''}${modifier}`,
    diceRoll: d20,
    modifier: modifier,
    total: total,
    isNatural20: d20 === 20,
    isNatural1: d20 === 1,
    character: characterState.name || 'Character'
  }
  
  emit('character-roll', rollResult)
}

function rollSkill(skill) {
  const total = getSkillTotal(skill)
  roll(total, 'skill-check', `${skill.name} Check`)
}

function rollKnowledgeSkill(skill) {
  const total = getKnowledgeTotal(skill)
  roll(total, 'skill-check', `Knowledge (${skill.subskill}) Check`)
}

function rollCraftSkill(skill) {
  const total = getCraftTotal(skill)
  roll(total, 'skill-check', `Craft (${skill.subskill}) Check`)
}

function rollProfessionSkill(skill) {
  const total = getProfessionTotal(skill)
  roll(total, 'skill-check', `Profession (${skill.subskill}) Check`)
}
</script>

<style scoped>
.skills-container {
  max-width: 100%;
}

table {
  border-collapse: collapse;
}

tr:hover {
  transition: background-color 0.2s;
}
</style>