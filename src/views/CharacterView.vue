<template>
  <div class="character-view relative h-full">
    <!-- Session Start Message (NEW) -->
    <div 
      v-if="sessionStartMessage" 
      class="bg-blue-900 bg-opacity-90 text-white p-4 rounded-lg mb-4 mx-4 shadow-lg"
    >
      <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
        <span class="text-2xl">🎮</span>
        Session Started!
      </h3>
      <p class="whitespace-pre-wrap text-sm">{{ sessionStartMessage }}</p>
      <button 
        @click="sessionStartMessage = ''"
        class="mt-3 bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm"
      >
        Dismiss
      </button>
    </div>

    <!-- Character Builder Wizard Overlay - FIXED: Now only covers this view -->
    <div 
      v-if="showWizard" 
      class="absolute inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center overflow-y-auto p-4"
    >
      <CharacterBuilderWizard 
        :mode="wizardMode"
        @complete="onWizardComplete"
        @cancel="onWizardCancel"
      />
    </div>

    <!-- Level Up Notification -->
    <div 
      v-if="canLevelUp && !showWizard" 
      class="absolute top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-30 animate-pulse"
    >
      <h3 class="font-bold text-lg mb-2">🎉 Level Up Available!</h3>
      <p class="text-sm mb-3">You have enough XP to reach level {{ nextLevel }}</p>
      <button 
        @click="startLevelUp"
        class="bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
      >
        Level Up Now
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-4 border-b border-gray-300">
      <nav class="flex space-x-4 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="currentTab = tab"
          :class="[
            'px-4 py-2 border-b-2 transition-colors whitespace-nowrap',
            currentTab === tab
              ? 'border-blue-500 text-blue-500 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content h-full overflow-y-auto pb-20">
      <component 
        :is="currentComponent" 
        :readonly="true"
        @character-roll="handleCharacterRoll"
      />
    </div>

    <!-- New Campaign Button -->
    <button
      v-if="characterExists"
      @click="confirmNewCampaign"
      class="absolute bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      🔄 New Campaign
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { characterState } from '../characterState.js'

// Tab Components - Updated to be read-only
import CharacterSheetReadOnly from '../components/tabs/CharacterSheetReadOnly.vue'
import InventoryReadOnly from '../components/tabs/InventoryReadOnly.vue'
import SkillsReadOnly from '../components/tabs/SkillsReadOnly.vue'
import FeatsReadOnly from '../components/tabs/FeatsReadOnly.vue'
import SpellsReadOnly from '../components/tabs/SpellsReadOnly.vue'
import CharacterBuilderWizard from '../components/CharacterBuilderWizard.vue'

// Initialize route
const route = useRoute()

// Props & Emits
const props = defineProps({
  currentTab: String
})

const emit = defineEmits(['update:current-tab', 'character-roll', 'session-start'])

// State
const currentTab = ref(props.currentTab || 'Overview')
const showWizard = ref(false)
const wizardMode = ref('create')
const sessionStartMessage = ref('')
const currentLocation = ref('')

// Tab configuration
const tabs = ['Overview', 'Inventory', 'Skills', 'Feats', 'Spells']
const components = {
  'Overview': CharacterSheetReadOnly,
  'Inventory': InventoryReadOnly,
  'Skills': SkillsReadOnly,
  'Feats': FeatsReadOnly,
  'Spells': SpellsReadOnly
}

// Computed
const currentComponent = computed(() => components[currentTab.value] || CharacterSheetReadOnly)

const characterExists = computed(() => {
  return characterState.name && characterState.race && 
         characterState.classes.some(c => c.className && c.level > 0)
})

const totalLevel = computed(() => {
  return characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
})

const nextLevel = computed(() => totalLevel.value + 1)

const xpForNextLevel = computed(() => {
  const xpTable = [
    0, 2000, 5000, 9000, 15000, 23000, 35000, 51000, 75000, 105000,
    155000, 220000, 315000, 445000, 635000, 890000, 1300000, 1800000, 2550000, 3600000
  ]
  return xpTable[nextLevel.value - 1] || 0
})

const canLevelUp = computed(() => {
  return characterState.experience >= xpForNextLevel.value && nextLevel.value <= 20
})

// Methods
function startLevelUp() {
  wizardMode.value = 'levelup'
  showWizard.value = true
}

function confirmNewCampaign() {
  if (confirm('Are you sure you want to start a new campaign? This will clear all character data.')) {
    clearCharacterData()
    wizardMode.value = 'create'
    showWizard.value = true
  }
}

function clearCharacterData() {
  // Reset all character data
  Object.assign(characterState, {
    name: '',
    race: '',
    age: 18,
    gender: '',
    alignment: '',
    deity: '',
    homeland: '',
    background: '',
    occupation: '',
    height: '',
    weight: '',
    hair: '',
    eyes: '',
    skin: '',
    portrait: '',
    
    classes: [{ className: '', level: 1 }],
    favoredClass: '',
    archetypes: [],
    experience: 0,
    nextLevelXP: 0,
    
    abilityScores: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    abilityMods: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    
    hp: 8,
    hpMax: 8,
    tempHp: 0,
    nonlethal: 0,
    wounds: 0,
    ac: 10,
    touchAC: 10,
    flatAC: 10,
    
    inventory: [],
    money: { cp: 0, sp: 0, gp: 0, pp: 0 },
    
    spells: [],
    feats: [],
    
    skills: characterState.skills.map(s => ({ ...s, rank: 0, misc: 0 })),
    knowledgeSkills: [],
    craftSkills: [],
    professionSkills: [],
    loreSkills: []
  })
}

// Updated onWizardComplete function for CharacterView.vue
function onWizardComplete(data) {
  // Apply character data from wizard
  if (data.mode === 'create') {
    // New character creation
    characterState.name = data.name || 'New Hero'
    characterState.race = data.race?.name || ''
    characterState.classes = [{ 
      className: data.class?.name || '', 
      level: 1 
    }]
    
    // Apply all character details
    characterState.age = data.age || 18
    characterState.gender = data.gender || ''
    characterState.height = data.height || ''
    characterState.weight = data.weight || ''
    characterState.hair = data.hair || ''
    characterState.eyes = data.eyes || ''
    characterState.skin = data.skin || ''
    characterState.alignment = data.alignment || 'TN'
    characterState.deity = data.deity || ''
    characterState.homeland = data.homeland || ''
    
    // Apply languages
    if (data.languages && Array.isArray(data.languages)) {
      characterState.languages = [...data.languages]
    }
    
    // Apply personality traits (these need to be added to characterState)
    if (data.personalityTraits) {
      characterState.personalityTraits = data.personalityTraits
    }
    if (data.ideals) {
      characterState.ideals = data.ideals
    }
    if (data.bonds) {
      characterState.bonds = data.bonds
    }
    if (data.flaws) {
      characterState.flaws = data.flaws
    }
    if (data.distinguishingFeatures) {
      characterState.distinguishingFeatures = data.distinguishingFeatures
    }
    
    // Apply ability scores
    if (data.finalAbilityScores) {
      Object.assign(characterState.abilityScores, data.finalAbilityScores)
      // Calculate modifiers
      for (const ability in characterState.abilityScores) {
        characterState.abilityMods[ability] = Math.floor((characterState.abilityScores[ability] - 10) / 2)
      }
    }
    
    // Apply skills
    if (data.skills) {
      for (const [skillName, ranks] of Object.entries(data.skills)) {
        const skill = characterState.skills.find(s => s.name === skillName)
        if (skill) skill.rank = ranks
      }
    }
    
    // Apply feats
    if (data.feats) {
      characterState.feats = data.feats.map(f => ({
        name: f.name || f,
        desc: f.description || ''
      }))
    }
    
    // Apply starting equipment
    if (data.equipment) {
      characterState.inventory = data.equipment.map(item => ({
        name: item.name,
        notes: `Worth ${item.cost} gp`,
        quantity: 1,
        weight: 0
      }))
    }
    
    // Apply starting gold
    if (data.remainingGold) {
      characterState.money.gp = data.remainingGold
    }
    
    // Calculate starting HP
    const conMod = characterState.abilityMods.CON || 0
    const hitDie = data.class?.hitDie || 'd8'
    const maxHP = parseInt(hitDie.substring(1)) + conMod
    characterState.hp = maxHP
    characterState.hpMax = maxHP
    
    // Set initial XP for level 1
    characterState.experience = 0
    characterState.nextLevelXP = 2000
    
  } else if (data.mode === 'levelup') {
    // Level up existing character
    if (data.class) {
      const existingClass = characterState.classes.find(c => c.className === data.class.name)
      if (existingClass) {
        existingClass.level += 1
      } else {
        characterState.classes.push({
          className: data.class.name,
          level: 1
        })
      }
    }
    
    // Apply HP gain
    if (data.hitPointsGained) {
      characterState.hpMax += data.hitPointsGained
      characterState.hp += data.hitPointsGained
    }
    
    // Apply new skills
    if (data.skills) {
      for (const [skillName, ranks] of Object.entries(data.skills)) {
        const skill = characterState.skills.find(s => s.name === skillName)
        if (skill) skill.rank += ranks
      }
    }
    
    // Apply new feats
    if (data.feats) {
      const newFeats = data.feats.map(f => ({
        name: f.name || f,
        desc: f.description || ''
      }))
      characterState.feats.push(...newFeats)
    }
  }
  
  showWizard.value = false
}

function onWizardCancel() {
  showWizard.value = false
  
  // If no character exists after cancel, keep wizard open
  if (!characterExists.value) {
    setTimeout(() => {
      showWizard.value = true
    }, 100)
  }
}

function handleCharacterRoll(rollData) {
  emit('character-roll', rollData)
}

// NEW: Handle session start
function handleSessionStart() {
  const openingScene = sessionStorage.getItem('openingScene')
  const location = sessionStorage.getItem('currentLocation')
  
  if (openingScene) {
    // Set the session start message
    sessionStartMessage.value = openingScene
    currentLocation.value = location || 'Unknown Location'
    
    // Load active session data
    const activeSession = localStorage.getItem('activeSession')
    if (activeSession) {
      const sessionData = JSON.parse(activeSession)
      console.log('Session started:', sessionData)
      
      // Update character state with session info if needed
      if (sessionData.location) {
        characterState.currentLocation = sessionData.location.name
      }
      
      // Emit event for other components that might need to know
      emit('session-start', {
        location: sessionData.location,
        scene: sessionData.scene,
        world: sessionData.world
      })
    }
    
    // Clear session storage
    sessionStorage.removeItem('openingScene')
    sessionStorage.removeItem('currentLocation')
    
    // Log for debugging
    console.log('=== SESSION START ===')
    console.log('Location:', location)
    console.log('Opening Scene:', openingScene)
  }
}

// Watchers
watch(currentTab, (newTab) => {
  emit('update:current-tab', newTab)
})

watch(() => props.currentTab, (newTab) => {
  if (newTab) currentTab.value = newTab
})

// On mount - check for character and session start
onMounted(() => {
  // Check for character first
  if (!characterExists.value) {
    wizardMode.value = 'create'
    showWizard.value = true
  }
  
  // Check for session start
  if (route.query.sessionStart === 'true') {
    handleSessionStart()
  }
})
</script>

<style scoped>
.character-view {
  min-height: 100%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth fade-in for session message */
.bg-blue-900 {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>