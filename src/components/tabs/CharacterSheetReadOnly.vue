<template>
  <div class="overview-container space-y-6 text-white">

    <!-- Overview Header -->
    <div class="border border-green-500 p-4 rounded">
      <h2 class="text-2xl font-semibold">Character Overview</h2>
    </div>

    <!-- Identity Fields (Read-Only) -->
    <div class="grid grid-cols-2 gap-4">
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Name</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.name || 'No name set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Race</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.race || 'No race selected' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Age</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.age }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Alignment</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.alignment || 'Not set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Deity</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.deity || 'None' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Homeland</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.homeland || 'Unknown' }}
        </div>
      </div>
    </div>

    <!-- Physical Attributes -->
    <div class="grid grid-cols-3 gap-4">
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Height</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.height || 'Not set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Weight</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.weight || 'Not set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Appearance</label>
        <div class="text-sm space-y-1">
          <div class="bg-gray-700 border border-gray-600 p-1 rounded">
            Hair: {{ characterState.hair || 'Not set' }}
          </div>
          <div class="bg-gray-700 border border-gray-600 p-1 rounded">
            Eyes: {{ characterState.eyes || 'Not set' }}
          </div>
          <div class="bg-gray-700 border border-gray-600 p-1 rounded">
            Skin: {{ characterState.skin || 'Not set' }}
          </div>
        </div>
      </div>
    </div>

 <!-- Physical Attributes (Updated to include Gender) -->
    <div class="grid grid-cols-4 gap-4">
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Gender</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.gender || 'Not set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Height</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.height || 'Not set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Weight</label>
        <div class="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white">
          {{ characterState.weight || 'Not set' }}
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Appearance</label>
        <div class="text-sm space-y-1">
          <div class="bg-gray-700 border border-gray-600 p-1 rounded">
            Hair: {{ characterState.hair || 'Not set' }}
          </div>
          <div class="bg-gray-700 border border-gray-600 p-1 rounded">
            Eyes: {{ characterState.eyes || 'Not set' }}
          </div>
          <div class="bg-gray-700 border border-gray-600 p-1 rounded">
            Skin: {{ characterState.skin || 'Not set' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Personality & Background -->
    <div class="border border-green-500 p-4 rounded">
      <h3 class="text-lg font-semibold mb-3">Personality & Background</h3>
      <div class="grid grid-cols-1 gap-4">
        <div v-if="characterState.personalityTraits" class="bg-gray-800 p-3 rounded">
          <label class="block mb-1 text-sm font-bold text-blue-300">Personality Traits</label>
          <div class="text-white">{{ characterState.personalityTraits }}</div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div v-if="characterState.ideals" class="bg-gray-800 p-3 rounded">
            <label class="block mb-1 text-sm font-bold text-green-300">Ideals</label>
            <div class="text-white">{{ characterState.ideals }}</div>
          </div>
          <div v-if="characterState.bonds" class="bg-gray-800 p-3 rounded">
            <label class="block mb-1 text-sm font-bold text-yellow-300">Bonds</label>
            <div class="text-white">{{ characterState.bonds }}</div>
          </div>
          <div v-if="characterState.flaws" class="bg-gray-800 p-3 rounded">
            <label class="block mb-1 text-sm font-bold text-red-300">Flaws</label>
            <div class="text-white">{{ characterState.flaws }}</div>
          </div>
        </div>
        <div v-if="characterState.distinguishingFeatures" class="bg-gray-800 p-3 rounded">
          <label class="block mb-1 text-sm font-bold text-purple-300">Distinguishing Features</label>
          <div class="text-white">{{ characterState.distinguishingFeatures }}</div>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div class="border border-green-500 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Languages</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="(lang, idx) in characterState.languages" 
              :key="idx" 
              class="bg-gray-700 px-3 py-1 rounded text-sm">
          {{ lang }}
        </span>
        <span v-if="!characterState.languages || characterState.languages.length === 0" 
              class="text-gray-400 italic">
          No languages known
        </span>
      </div>
    </div>

    <!-- Experience & Level -->
    <div class="border border-green-500 p-4 rounded">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold">Experience & Level</h3>
        <span class="text-xl font-bold text-yellow-400">Level {{ characterLevel }}</span>
      </div>
      <div class="mb-2">
        <div class="flex justify-between text-sm">
          <span>Current XP:</span>
          <span class="font-bold">{{ characterState.experience || 0 }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>Next Level:</span>
          <span class="font-bold">{{ nextLevelXP }}</span>
        </div>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-3">
        <div 
          class="bg-yellow-500 h-3 rounded-full transition-all duration-300"
          :style="{ width: `${xpProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Classes -->
    <div class="border border-green-500 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Classes</h3>
      <div class="space-y-2">
        <template v-for="(cls, idx) in (characterState.classes || [])" :key="cls?.id || idx">
          <div v-if="cls?.className"
               class="bg-gray-700 p-2 rounded flex justify-between items-center">
            <span class="font-medium">{{ cls.className }}</span>
            <span class="text-yellow-400 font-bold">Level {{ cls.level || 1 }}</span>
          </div>
        </template>
        <div v-if="!characterState.classes?.length || !characterState.classes.some(c => c?.className)" 
             class="text-gray-400 italic">
          No classes selected
        </div>
      </div>
    </div>

    <!-- Combat Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="border border-green-500 p-4 rounded bg-blue-900 text-center">
        <label class="block mb-1 text-sm">Armor Class</label>
        <div class="text-2xl font-bold">{{ characterState.ac }}</div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 text-center">
        <label class="block mb-1 text-sm">Touch AC</label>
        <div class="text-2xl font-bold">{{ characterState.touchAC }}</div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 text-center">
        <label class="block mb-1 text-sm">Flat-Footed</label>
        <div class="text-2xl font-bold">{{ characterState.flatAC }}</div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 text-center">
        <label class="block mb-1 text-sm">Initiative</label>
        <div class="flex items-center justify-center gap-2">
          <span class="text-2xl font-bold">{{ characterState.init >= 0 ? '+' : '' }}{{ characterState.init }}</span>
          <button @click="rollInitiative" 
                  class="bg-green-700 hover:bg-green-600 text-white p-1 rounded" 
                  title="Roll Initiative">🎲</button>
        </div>
      </div>
    </div>

    <!-- HP Bar -->
    <div class="border border-green-500 p-4 rounded bg-red-900">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold">Hit Points</h3>
        <span class="text-xl font-bold">{{ characterState.hp }} / {{ characterState.hpMax }}</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-6">
        <div 
          class="bg-red-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold"
          :style="{ width: `${hpPercentage}%` }"
        >
          {{ hpPercentage }}%
        </div>
      </div>
      <div v-if="characterState.tempHp > 0" class="mt-2 text-sm">
        <span class="text-blue-300">Temp HP: {{ characterState.tempHp }}</span>
      </div>
    </div>

    <!-- Saving Throws -->
    <div class="grid grid-cols-3 gap-4">
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1 text-sm">Fortitude Save</label>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold">{{ characterState.saves.fort >= 0 ? '+' : '' }}{{ characterState.saves.fort }}</span>
          <button @click="rollFort" 
                  class="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm" 
                  title="Roll Fortitude Save">🎲 Roll</button>
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1 text-sm">Reflex Save</label>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold">{{ characterState.saves.ref >= 0 ? '+' : '' }}{{ characterState.saves.ref }}</span>
          <button @click="rollRef" 
                  class="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm" 
                  title="Roll Reflex Save">🎲 Roll</button>
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1 text-sm">Will Save</label>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold">{{ characterState.saves.will >= 0 ? '+' : '' }}{{ characterState.saves.will }}</span>
          <button @click="rollWill" 
                  class="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm" 
                  title="Roll Will Save">🎲 Roll</button>
        </div>
      </div>
    </div>

    <!-- Combat Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="border border-green-500 p-4 rounded bg-gray-800 text-center">
        <label class="block mb-1 text-sm">Base Attack Bonus</label>
        <div class="text-xl font-bold">{{ characterState.bab >= 0 ? '+' : '' }}{{ characterState.bab }}</div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-gray-800 text-center">
        <label class="block mb-1 text-sm">CMB</label>
        <div class="text-xl font-bold">{{ characterState.cmb >= 0 ? '+' : '' }}{{ characterState.cmb }}</div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-gray-800 text-center">
        <label class="block mb-1 text-sm">CMD</label>
        <div class="text-xl font-bold">{{ characterState.cmd }}</div>
      </div>
    </div>

    <!-- Ability Scores -->
    <div class="border border-green-500 p-4 rounded">
      <h3 class="text-lg font-semibold mb-3">Ability Scores</h3>
      <div class="grid grid-cols-6 gap-3">
        <div v-for="(score, ab) in characterState.abilityScores" :key="ab" 
             class="bg-gray-800 p-3 rounded text-center">
          <label class="block mb-1 text-sm font-bold">{{ ab }}</label>
          <div class="text-2xl font-bold">{{ score }}</div>
          <div class="text-sm text-gray-300">
            {{ abilityMod(ab) >= 0 ? '+' : '' }}{{ abilityMod(ab) }}
          </div>
          <button @click="rollAbilityCheck(ab)" 
                  class="mt-2 bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-xs" 
                  :title="`Roll ${ab} Check`">🎲</button>
        </div>
      </div>
    </div>

    <!-- Money -->
    <div class="border border-green-500 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Wealth</h3>
      <div class="grid grid-cols-4 gap-3">
        <div class="bg-gray-800 p-2 rounded text-center">
          <label class="block text-xs">Platinum</label>
          <div class="font-bold">{{ characterState.money.pp || 0 }}</div>
        </div>
        <div class="bg-gray-800 p-2 rounded text-center">
          <label class="block text-xs">Gold</label>
          <div class="font-bold text-yellow-400">{{ characterState.money.gp || 0 }}</div>
        </div>
        <div class="bg-gray-800 p-2 rounded text-center">
          <label class="block text-xs">Silver</label>
          <div class="font-bold text-gray-300">{{ characterState.money.sp || 0 }}</div>
        </div>
        <div class="bg-gray-800 p-2 rounded text-center">
          <label class="block text-xs">Copper</label>
          <div class="font-bold text-orange-700">{{ characterState.money.cp || 0 }}</div>
        </div>
      </div>
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

// Computed - FIXED: Added null safety
const characterLevel = computed(() =>
  (characterState.classes || []).reduce((sum, c) => sum + (c?.level || 0), 0)
)

const hpPercentage = computed(() => {
  if (!characterState.hpMax) return 0
  return Math.round((characterState.hp / characterState.hpMax) * 100)
})

const xpTable = [
  0, 2000, 5000, 9000, 15000, 23000, 35000, 51000, 75000, 105000,
  155000, 220000, 315000, 445000, 635000, 890000, 1300000, 1800000, 2550000, 3600000
]

const nextLevelXP = computed(() => {
  const nextLevel = characterLevel.value + 1
  return xpTable[nextLevel - 1] || 0
})

const xpProgress = computed(() => {
  if (!nextLevelXP.value) return 100
  const currentLevelXP = xpTable[characterLevel.value - 1] || 0
  const xpIntoLevel = characterState.experience - currentLevelXP
  const xpNeededForLevel = nextLevelXP.value - currentLevelXP
  return Math.round((xpIntoLevel / xpNeededForLevel) * 100)
})

// Methods
function abilityMod(ab) {
  return Math.floor((characterState.abilityScores[ab] - 10) / 2)
}

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

function rollInitiative() {
  roll(characterState.init, 'initiative', 'Initiative Roll')
}

function rollFort() {
  roll(characterState.saves.fort, 'saving-throw', 'Fortitude Save')
}

function rollRef() {
  roll(characterState.saves.ref, 'saving-throw', 'Reflex Save')
}

function rollWill() {
  roll(characterState.saves.will, 'saving-throw', 'Will Save')
}

function rollAbilityCheck(ability) {
  const mod = abilityMod(ability)
  roll(mod, 'ability-check', `${ability} Check`)
}
</script>

<style scoped>
/* Read-only field styling */
.bg-gray-700 {
  cursor: default;
  user-select: text;
}
</style>