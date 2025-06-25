<template>
  <div class="spells-container space-y-6 text-white">
    <h2 class="text-2xl mb-4">Spells</h2>

    <!-- Spellcasting Summary -->
    <div class="bg-gray-800 p-4 rounded border border-gray-600">
      <h3 class="text-lg font-semibold mb-3">Spellcasting Summary</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="text-center">
          <label class="block text-xs text-gray-400">Caster Level</label>
          <div class="text-xl font-bold">{{ casterLevel || 0 }}</div>
        </div>
        <div class="text-center">
          <label class="block text-xs text-gray-400">Spell DC Base</label>
          <div class="text-xl font-bold">{{ baseSpellDC }}</div>
        </div>
        <div class="text-center">
          <label class="block text-xs text-gray-400">Primary Ability</label>
          <div class="text-xl font-bold">{{ primaryCastingAbility || 'None' }}</div>
        </div>
        <div class="text-center">
          <label class="block text-xs text-gray-400">Ability Mod</label>
          <div class="text-xl font-bold">{{ castingAbilityMod >= 0 ? '+' : '' }}{{ castingAbilityMod }}</div>
        </div>
      </div>
    </div>

    <!-- Spell Slots by Level -->
    <template v-for="spellLevel in 10" :key="'level' + spellLevel">
      <div v-if="spellLevel === 0 || (spellSlots[spellLevel] && spellSlots[spellLevel].max > 0)"
           class="bg-gray-800 p-4 rounded border border-gray-600">
        
        <!-- Level Header -->
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold">
            {{ spellLevel === 0 ? (isClericOrDruid ? 'Orisons' : 'Cantrips') : `${spellLevel}${getOrdinalSuffix(spellLevel)} Level` }}
          </h3>
          <div class="flex items-center gap-4">
            <div class="text-sm">
              <span class="text-gray-400">DC:</span>
              <span class="font-bold text-yellow-400">{{ 10 + spellLevel + castingAbilityMod }}</span>
            </div>
            <div v-if="spellLevel > 0" class="text-sm">
              <span class="text-gray-400">Slots:</span>
              <span class="font-bold">{{ spellSlots[spellLevel].used }} / {{ spellSlots[spellLevel].max }}</span>
            </div>
          </div>
        </div>

        <!-- Spell Slot Tracker (visual) -->
        <div v-if="spellLevel > 0 && spellSlots[spellLevel].max > 0" class="mb-3">
          <div class="flex gap-1">
            <div v-for="slot in spellSlots[spellLevel].max" :key="slot"
                 :class="[
                   'w-8 h-8 rounded-full border-2 cursor-pointer transition-all',
                   slot <= spellSlots[spellLevel].used 
                     ? 'bg-gray-600 border-gray-500' 
                     : 'bg-blue-500 border-blue-400 hover:bg-blue-400'
                 ]"
                 @click="toggleSlotUsed(spellLevel, slot)"
                 :title="slot <= spellSlots[spellLevel].used ? 'Used' : 'Available'"
            ></div>
          </div>
        </div>

        <!-- Spell List -->
        <div class="space-y-2">
          <div v-for="spell in getSpellsForLevel(spellLevel)" :key="spell.name"
               class="bg-gray-700 p-2 rounded flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ spell.name }}</span>
                <span v-if="spell.prepared" class="text-xs bg-green-600 px-2 py-0.5 rounded">Prepared</span>
                <span v-if="spell.domain" class="text-xs bg-purple-600 px-2 py-0.5 rounded">{{ spell.domain }}</span>
                <span v-if="spell.school" class="text-xs text-gray-400">({{ spell.school }})</span>
              </div>
              <div v-if="spell.description" class="text-sm text-gray-400 mt-1">
                {{ spell.description.substring(0, 100) }}{{ spell.description.length > 100 ? '...' : '' }}
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button 
                @click="castSpell(spell, spellLevel)"
                :disabled="spellLevel > 0 && spellSlots[spellLevel].used >= spellSlots[spellLevel].max"
                class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-sm"
              >
                Cast
              </button>
              <button 
                @click="showSpellDetails(spell)"
                class="bg-gray-600 hover:bg-gray-500 p-1 rounded"
                title="View spell details"
              >
                ?
              </button>
            </div>
          </div>
          
          <div v-if="getSpellsForLevel(spellLevel).length === 0" class="text-gray-400 italic text-center py-2">
            No spells known at this level
          </div>
        </div>
      </div>
    </template>

    <!-- Spell Details Modal -->
    <div v-if="selectedSpell" 
         class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
         @click.self="selectedSpell = null">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold">{{ selectedSpell.name }}</h3>
          <button @click="selectedSpell = null" class="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        
        <div v-if="loadingSpellDetails" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-400">Loading spell details...</p>
        </div>
        
        <div v-else-if="selectedSpellDetails" class="space-y-3">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">School:</span>
              <span class="ml-2">{{ selectedSpellDetails.school || 'Unknown' }}</span>
            </div>
            <div>
              <span class="text-gray-400">Level:</span>
              <span class="ml-2">{{ formatSpellLevels(selectedSpellDetails.level) }}</span>
            </div>
            <div>
              <span class="text-gray-400">Casting Time:</span>
              <span class="ml-2">{{ selectedSpellDetails.castingTime || '1 standard action' }}</span>
            </div>
            <div>
              <span class="text-gray-400">Range:</span>
              <span class="ml-2">{{ selectedSpellDetails.range || 'Varies' }}</span>
            </div>
            <div>
              <span class="text-gray-400">Duration:</span>
              <span class="ml-2">{{ selectedSpellDetails.duration || 'Instantaneous' }}</span>
            </div>
            <div>
              <span class="text-gray-400">Save:</span>
              <span class="ml-2">{{ selectedSpellDetails.savingThrow || 'None' }}</span>
            </div>
          </div>
          
          <div v-if="selectedSpellDetails.components" class="text-sm">
            <span class="text-gray-400">Components:</span>
            <span class="ml-2">{{ selectedSpellDetails.components.join(', ') }}</span>
          </div>
          
          <div class="border-t border-gray-600 pt-3">
            <h4 class="font-semibold mb-2">Description</h4>
            <p class="text-sm whitespace-pre-wrap">{{ selectedSpellDetails.description }}</p>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-400">
          Failed to load spell details
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { characterState } from '../../characterState.js'
import spellDataManager from '../../data/spellDataManager.js'
import { useNarrativeChat } from '@/composables/useNarrativeChat'

// Props
const props = defineProps({
  readonly: {
    type: Boolean,
    default: true
  }
})

// State
const selectedSpell = ref(null)
const selectedSpellDetails = ref(null)
const loadingSpellDetails = ref(false)
const { sendMessage } = useNarrativeChat()

// Initialize spell data manager with API key if available
onMounted(() => {
  const apiKey = localStorage.getItem('openai-api-key')
  if (apiKey) {
    spellDataManager.initialize(apiKey)
  }
})

// Computed
const spellSlots = computed(() => characterState.spellSlots || {})

const casterLevel = computed(() => {
  // Calculate based on class levels
  const casterClasses = ['wizard', 'sorcerer', 'cleric', 'druid', 'bard', 'paladin', 'ranger']
  let level = 0
  
  for (const cls of characterState.classes) {
    if (casterClasses.includes(cls.className?.toLowerCase())) {
      // Paladin and Ranger cast at level - 3
      if (['paladin', 'ranger'].includes(cls.className.toLowerCase())) {
        level += Math.max(0, cls.level - 3)
      } else {
        level += cls.level
      }
    }
  }
  
  return level
})

const primaryCastingAbility = computed(() => {
  // Determine primary casting ability based on class
  const abilities = {
    wizard: 'INT',
    sorcerer: 'CHA',
    cleric: 'WIS',
    druid: 'WIS',
    bard: 'CHA',
    paladin: 'CHA',
    ranger: 'WIS',
    witch: 'INT',
    oracle: 'CHA',
    magus: 'INT'
  }
  
  for (const cls of characterState.classes) {
    const ability = abilities[cls.className?.toLowerCase()]
    if (ability) return ability
  }
  
  return null
})

const castingAbilityMod = computed(() => {
  const ability = primaryCastingAbility.value
  if (!ability) return 0
  
  const score = characterState.abilityScores[ability] || 10
  return Math.floor((score - 10) / 2)
})

const baseSpellDC = computed(() => {
  return 10 + castingAbilityMod.value
})

const isClericOrDruid = computed(() => {
  return characterState.classes.some(cls => 
    ['cleric', 'druid'].includes(cls.className?.toLowerCase())
  )
})

// Methods
function getOrdinalSuffix(num) {
  const j = num % 10
  const k = num % 100
  
  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}

function getSpellsForLevel(level) {
  // First check if we have properly formatted spells
  if (characterState.spells && characterState.spells.length > 0) {
    return characterState.spells.filter(spell => spell.level === level) || []
  }
  
  // Fallback: Convert spellsKnown to spell objects if needed
  if (characterState.spellsKnown && characterState.spellsKnown.length > 0 && level === 1) {
    // For now, assume all known spells are 1st level (can be improved)
    return characterState.spellsKnown.map(spellName => ({
      name: spellName,
      level: 1,
      school: 'Unknown',
      description: ''
    }))
  }
  
  return []
}

function toggleSlotUsed(level, slot) {
  if (!spellSlots.value[level]) return
  
  if (slot <= spellSlots.value[level].used) {
    // Unuse the slot
    spellSlots.value[level].used = slot - 1
  } else {
    // Use up to this slot
    spellSlots.value[level].used = slot
  }
}

async function castSpell(spell, level) {
  // Handle spell casting
  if (level > 0 && spellSlots.value[level].used >= spellSlots.value[level].max) {
    // No spell slots available
    await sendMessage({
      text: `I attempt to cast ${spell.name}, but I have no ${level}${getOrdinalSuffix(level)} level spell slots remaining.`,
      context: {
        action: 'spell_failed',
        spell: spell.name,
        reason: 'no_slots'
      }
    })
    return
  }
  
  if (level > 0) {
    // Use a spell slot
    spellSlots.value[level].used++
  }
  
  // Send to narrative system
  let castingMessage = `I cast ${spell.name}`
  if (spell.school) {
    castingMessage += ` (${spell.school})`
  }
  
  await sendMessage({
    text: castingMessage,
    context: {
      action: 'cast_spell',
      spell: spell.name,
      level: level,
      school: spell.school,
      description: spell.description,
      character: {
        name: characterState.name,
        class: characterState.classes[0]?.className,
        level: characterState.classes[0]?.level,
        currentHp: characterState.hp,
        maxHp: characterState.hpMax
      }
    }
  })
}

async function showSpellDetails(spell) {
  selectedSpell.value = spell
  selectedSpellDetails.value = null
  loadingSpellDetails.value = true
  
  try {
    // First check if we have the spell in our data
    let details = spellDataManager.findSpellByName(spell.name)
    
    // If not found or incomplete, fetch from GPT
    if (!details || !details.description) {
      details = await spellDataManager.getSpellDetails(spell.name)
    }
    
    selectedSpellDetails.value = details
  } catch (error) {
    console.error('Error loading spell details:', error)
    selectedSpellDetails.value = {
      name: spell.name,
      description: 'Failed to load spell details. Please check your OpenAI API key.'
    }
  } finally {
    loadingSpellDetails.value = false
  }
}

function formatSpellLevels(levels) {
  if (!levels) return 'Unknown'
  
  if (typeof levels === 'object') {
    return Object.entries(levels)
      .map(([cls, lvl]) => `${cls} ${lvl}`)
      .join(', ')
  }
  
  return levels.toString()
}
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>