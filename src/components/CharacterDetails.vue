<template>
  <div class="character-details-container">
    <!-- Builder Buttons -->
    <div class="mb-6">
      <div v-if="!characterExists" class="text-center py-12">
        <p class="text-gray-400 mb-4">No character created yet</p>
        <button 
          @click="$emit('show-builder', 'create')"
          class="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-500/30"
        >
          🎭 Create Character
        </button>
      </div>
      
      <div v-else class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-300">{{ characterState.name || 'Unnamed Hero' }}</h2>
        <button 
          @click="$emit('show-builder', 'levelup')"
          class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-all hover:shadow-md"
        >
          📈 Level Up
        </button>
      </div>
    </div>

    <!-- Character Information -->
    <div v-if="characterExists" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Basic Information</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span class="text-gray-400">Race:</span>
            <span class="ml-2">{{ characterState.race }}</span>
          </div>
          <div>
            <span class="text-gray-400">Classes:</span>
            <span class="ml-2">{{ formatClasses() }}</span>
          </div>
          <div>
            <span class="text-gray-400">Level:</span>
            <span class="ml-2">{{ totalLevel }}</span>
          </div>
          <div>
            <span class="text-gray-400">Alignment:</span>
            <span class="ml-2">{{ characterState.alignment }}</span>
          </div>
          <div>
            <span class="text-gray-400">Deity:</span>
            <span class="ml-2">{{ characterState.deity || 'None' }}</span>
          </div>
          <div>
            <span class="text-gray-400">Size:</span>
            <span class="ml-2">{{ characterState.size || 'Medium' }}</span>
          </div>
        </div>
      </div>

      <!-- Ability Scores -->
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Ability Scores</h3>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <div v-for="(score, ability) in characterState.abilityScores" :key="ability" class="bg-gray-700 p-3 rounded">
            <div class="text-xs text-gray-400">{{ ability }}</div>
            <div class="text-2xl font-bold">{{ score }}</div>
            <div class="text-sm text-green-300">
              {{ getModifier(score) >= 0 ? '+' : '' }}{{ getModifier(score) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Combat Stats -->
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Combat Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span class="text-gray-400">Hit Points:</span>
            <span class="ml-2 font-semibold">{{ characterState.hp }} / {{ characterState.hpMax }}</span>
          </div>
          <div>
            <span class="text-gray-400">Initiative:</span>
            <span class="ml-2">{{ characterState.init >= 0 ? '+' : '' }}{{ characterState.init }}</span>
          </div>
          <div>
            <span class="text-gray-400">AC:</span>
            <span class="ml-2">{{ characterState.ac }}</span>
          </div>
          <div>
            <span class="text-gray-400">BAB:</span>
            <span class="ml-2">{{ characterState.bab >= 0 ? '+' : '' }}{{ characterState.bab }}</span>
          </div>
          <div>
            <span class="text-gray-400">CMB:</span>
            <span class="ml-2">{{ characterState.cmb >= 0 ? '+' : '' }}{{ characterState.cmb }}</span>
          </div>
          <div>
            <span class="text-gray-400">CMD:</span>
            <span class="ml-2">{{ characterState.cmd }}</span>
          </div>
        </div>
      </div>

      <!-- Saving Throws -->
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Saving Throws</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-xs text-gray-400">Fortitude</div>
            <div class="text-xl font-bold">
              {{ characterState.saves.fort >= 0 ? '+' : '' }}{{ characterState.saves.fort }}
            </div>
          </div>
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-xs text-gray-400">Reflex</div>
            <div class="text-xl font-bold">
              {{ characterState.saves.ref >= 0 ? '+' : '' }}{{ characterState.saves.ref }}
            </div>
          </div>
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-xs text-gray-400">Will</div>
            <div class="text-xl font-bold">
              {{ characterState.saves.will >= 0 ? '+' : '' }}{{ characterState.saves.will }}
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Summary -->
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Trained Skills</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div v-for="skill in trainedSkills" :key="skill.name" class="flex justify-between">
            <span>{{ skill.name }}:</span>
            <span class="font-semibold">{{ skill.bonus >= 0 ? '+' : '' }}{{ skill.bonus }}</span>
          </div>
        </div>
        <p v-if="trainedSkills.length === 0" class="text-gray-400 text-sm">No trained skills</p>
      </div>

      <!-- Feats -->
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Feats</h3>
        <div class="space-y-1">
          <div v-for="feat in characterState.feats" :key="feat.name" class="text-sm">
            <span class="font-semibold">{{ feat.name }}</span>
            <span v-if="feat.desc" class="text-gray-400 ml-2">- {{ feat.desc }}</span>
          </div>
        </div>
        <p v-if="characterState.feats.length === 0" class="text-gray-400 text-sm">No feats</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { characterState } from '@/characterState.js'

// Emit for showing character builder
const emit = defineEmits(['show-builder'])

// Computed properties
const characterExists = computed(() => {
  return characterState.name && characterState.race && characterState.classes.length > 0
})

const totalLevel = computed(() => {
  return characterState.classes.reduce((sum, cls) => sum + cls.level, 0)
})

const trainedSkills = computed(() => {
  return characterState.skills
    .filter(skill => skill.rank > 0)
    .map(skill => ({
      name: skill.name,
      bonus: skill.bonus
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

// Methods
function getModifier(score) {
  return Math.floor((score - 10) / 2)
}

function formatClasses() {
  return characterState.classes
    .map(cls => `${cls.className} ${cls.level}`)
    .join(' / ')
}
</script>

<style scoped>
.character-details-container {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}

.character-details-container::-webkit-scrollbar {
  width: 8px;
}

.character-details-container::-webkit-scrollbar-track {
  background: #1F2937;
  border-radius: 4px;
}

.character-details-container::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.character-details-container::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>