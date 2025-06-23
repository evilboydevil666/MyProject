<template>
  <div class="feats-container space-y-6 text-white">
    <h2 class="text-2xl mb-4">Feats & Abilities</h2>
    
    <!-- Feats Summary -->
    <div class="bg-gray-800 p-4 rounded border border-gray-600 mb-4">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-400">Total Feats</label>
          <div class="text-xl font-bold">{{ totalFeats }}</div>
        </div>
        <div>
          <label class="block text-sm text-gray-400">Combat Feats</label>
          <div class="text-xl font-bold text-red-400">{{ combatFeats }}</div>
        </div>
        <div>
          <label class="block text-sm text-gray-400">Other Feats</label>
          <div class="text-xl font-bold text-blue-400">{{ otherFeats }}</div>
        </div>
      </div>
    </div>

    <!-- Feats List -->
    <div class="space-y-4">
      <div class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3">Feats</h3>
        
        <div v-if="characterState.feats.length === 0" class="text-gray-400 italic text-center py-4">
          No feats selected
        </div>
        
        <div v-else class="space-y-3">
          <div v-for="(feat, index) in characterState.feats" :key="index"
               class="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold text-lg">{{ feat.name }}</h4>
                <p class="text-sm text-gray-400 mt-1">{{ feat.desc || 'No description available' }}</p>
                
                <!-- Feat type badges -->
                <div class="flex gap-2 mt-2">
                  <span v-if="isCombatFeat(feat.name)" 
                        class="text-xs bg-red-600 px-2 py-1 rounded">
                    Combat
                  </span>
                  <span v-if="isMetamagicFeat(feat.name)" 
                        class="text-xs bg-purple-600 px-2 py-1 rounded">
                    Metamagic
                  </span>
                  <span v-if="isItemCreationFeat(feat.name)" 
                        class="text-xs bg-yellow-600 px-2 py-1 rounded">
                    Item Creation
                  </span>
                  <span v-if="isTeamworkFeat(feat.name)" 
                        class="text-xs bg-green-600 px-2 py-1 rounded">
                    Teamwork
                  </span>
                </div>
              </div>
              
              <!-- Feat actions/info -->
              <div class="ml-4">
                <button 
                  @click="showFeatDetails(feat)"
                  class="bg-gray-600 hover:bg-gray-500 p-2 rounded"
                  title="View full feat details"
                >
                  <span class="text-lg">ℹ️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Traits -->
      <div v-if="characterState.traits?.length > 0" class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3">Traits</h3>
        
        <div class="space-y-3">
          <div v-for="(trait, index) in characterState.traits" :key="index"
               class="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors">
            <h4 class="font-semibold">{{ trait.name }}</h4>
            <p class="text-sm text-gray-400 mt-1">{{ trait.desc || 'No description available' }}</p>
            
            <div class="flex gap-2 mt-2">
              <span class="text-xs bg-blue-600 px-2 py-1 rounded">
                {{ trait.type || 'General' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Special Abilities -->
      <div v-if="characterState.specialAbilities?.length > 0" class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3">Special Abilities</h3>
        
        <div class="space-y-3">
          <div v-for="(ability, index) in characterState.specialAbilities" :key="index"
               class="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold">{{ ability.name }}</h4>
                <p class="text-sm text-gray-400 mt-1">{{ ability.desc || 'No description available' }}</p>
                
                <div v-if="ability.source" class="text-xs text-gray-500 mt-2">
                  Source: {{ ability.source }}
                </div>
              </div>
              
              <div v-if="ability.usesPerDay" class="ml-4 text-center">
                <div class="text-xs text-gray-400">Uses/Day</div>
                <div class="text-lg font-bold">{{ ability.usesRemaining || 0 }} / {{ ability.usesPerDay }}</div>
                <button 
                  @click="useAbility(ability)"
                  :disabled="!ability.usesRemaining || ability.usesRemaining <= 0"
                  class="mt-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-sm"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Languages -->
      <div class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3">Languages</h3>
        
        <div v-if="characterState.languages.length === 0" class="text-gray-400 italic">
          No languages known
        </div>
        
        <div v-else class="flex flex-wrap gap-2">
          <span v-for="(language, index) in characterState.languages" :key="index"
                class="bg-gray-700 px-3 py-1 rounded">
            {{ language }}
          </span>
        </div>
      </div>
    </div>

    <!-- Feat Details Modal -->
    <div v-if="selectedFeat" 
         class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
         @click.self="selectedFeat = null">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold">{{ selectedFeat.name }}</h3>
          <button @click="selectedFeat = null" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        
        <div class="space-y-4">
          <div v-if="selectedFeat.type" class="flex gap-2">
            <span class="text-xs bg-gray-600 px-2 py-1 rounded">{{ selectedFeat.type }}</span>
          </div>
          
          <div>
            <h4 class="font-semibold mb-2">Description</h4>
            <p class="text-sm whitespace-pre-wrap">{{ selectedFeat.desc || 'No detailed description available.' }}</p>
          </div>
          
          <div v-if="selectedFeat.prerequisites">
            <h4 class="font-semibold mb-2">Prerequisites</h4>
            <p class="text-sm text-yellow-400">{{ selectedFeat.prerequisites }}</p>
          </div>
          
          <div v-if="selectedFeat.benefit">
            <h4 class="font-semibold mb-2">Benefit</h4>
            <p class="text-sm">{{ selectedFeat.benefit }}</p>
          </div>
          
          <div v-if="selectedFeat.normal">
            <h4 class="font-semibold mb-2">Normal</h4>
            <p class="text-sm text-gray-400">{{ selectedFeat.normal }}</p>
          </div>
          
          <div v-if="selectedFeat.special">
            <h4 class="font-semibold mb-2">Special</h4>
            <p class="text-sm text-blue-400">{{ selectedFeat.special }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterState } from '../../characterState.js'

// Props
const props = defineProps({
  readonly: {
    type: Boolean,
    default: true
  }
})

// State
const selectedFeat = ref(null)

// Computed
const totalFeats = computed(() => characterState.feats.length)

const combatFeats = computed(() => {
  return characterState.feats.filter(feat => isCombatFeat(feat.name)).length
})

const otherFeats = computed(() => {
  return totalFeats.value - combatFeats.value
})

// Methods - Feat categorization
function isCombatFeat(featName) {
  const combatFeats = [
    'Power Attack', 'Weapon Focus', 'Weapon Specialization', 'Combat Reflexes',
    'Improved Initiative', 'Dodge', 'Mobility', 'Spring Attack', 'Whirlwind Attack',
    'Combat Expertise', 'Improved Trip', 'Improved Disarm', 'Improved Sunder',
    'Cleave', 'Great Cleave', 'Vital Strike', 'Improved Vital Strike',
    'Point-Blank Shot', 'Precise Shot', 'Rapid Shot', 'Manyshot',
    'Two-Weapon Fighting', 'Improved Two-Weapon Fighting'
  ]
  
  return combatFeats.some(cf => featName.includes(cf))
}

function isMetamagicFeat(featName) {
  const metamagicFeats = [
    'Empower Spell', 'Enlarge Spell', 'Extend Spell', 'Heighten Spell',
    'Maximize Spell', 'Quicken Spell', 'Silent Spell', 'Still Spell',
    'Widen Spell', 'Persistent Spell', 'Selective Spell'
  ]
  
  return metamagicFeats.some(mf => featName.includes(mf))
}

function isItemCreationFeat(featName) {
  const itemCreationFeats = [
    'Brew Potion', 'Craft Magic Arms and Armor', 'Craft Rod',
    'Craft Staff', 'Craft Wand', 'Craft Wondrous Item',
    'Forge Ring', 'Scribe Scroll'
  ]
  
  return itemCreationFeats.some(icf => featName.includes(icf))
}

function isTeamworkFeat(featName) {
  return featName.toLowerCase().includes('teamwork') || 
         featName.includes('Coordinated') ||
         featName.includes('Team')
}

function showFeatDetails(feat) {
  selectedFeat.value = feat
  
  // Could fetch additional details from API here if needed
}

function useAbility(ability) {
  if (ability.usesRemaining > 0) {
    ability.usesRemaining--
    
    // Could emit an event for narrative system
    console.log(`Using ${ability.name}`)
  }
}
</script>

<style scoped>
.feats-container {
  max-width: 100%;
}
</style>