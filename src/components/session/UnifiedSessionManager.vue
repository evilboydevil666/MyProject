// src/components/session/UnifiedSessionManager.vue
<template>
  <div class="session-manager h-full flex flex-col bg-gray-900 text-white">
    <!-- Header with Status -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold text-blue-300 mb-1">🎯 Session Command Center</h2>
          <p class="text-sm text-gray-400">Unified workflow for world building, campaign start, live support, and post-session processing</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-400">Daily API Budget</div>
          <div class="flex items-center gap-2">
            <div class="w-24 bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all" 
                :style="{ width: budgetUsedPercentage + '%' }"
              ></div>
            </div>
            <span class="text-sm">${{ dailyUsage.toFixed(2) }}/${{ dailyBudget.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Tabs -->
    <div class="flex border-b border-gray-700 overflow-x-auto">
      <button 
        v-for="workflow in workflows" 
        :key="workflow.id"
        @click="currentWorkflow = workflow.id"
        :class="[
          'px-6 py-3 border-b-2 transition-colors whitespace-nowrap',
          currentWorkflow === workflow.id 
            ? 'border-blue-500 bg-gray-800 text-blue-300' 
            : 'border-transparent hover:bg-gray-800'
        ]"
      >
        {{ workflow.icon }} {{ workflow.name }}
      </button>
    </div>

    <!-- Workflow Content -->
    <div class="flex-1 overflow-hidden">
      <!-- World Building -->
      <div v-if="currentWorkflow === 'world'" class="h-full">
        <WorldBuildingPanel 
          ref="worldBuildingPanelRef"
          :api-key="apiKey"
          @content-generated="handleContentGenerated"
          @usage-updated="handleUsageUpdated"
        />
      </div>

      <!-- Campaign Start -->
      <div v-if="currentWorkflow === 'campaign'" class="h-full flex">
        <div class="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4 text-green-300">🚀 Campaign Start</h3>
          
          <!-- World Building Data Indicator -->
          <div v-if="worldBuildingData.loaded" class="bg-green-900 border border-green-600 rounded p-3 mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-sm font-semibold text-green-300">World Data Loaded</span>
            </div>
            <div class="text-xs text-green-200 mt-1">
              <div v-if="worldBuildingData.worldName">World: {{ worldBuildingData.worldName }}</div>
              <div v-if="worldBuildingData.locations > 0">{{ worldBuildingData.locations }} locations available</div>
            </div>
          </div>
          <div v-else class="bg-yellow-900 border border-yellow-600 rounded p-3 mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span class="text-sm font-semibold text-yellow-300">No World Data</span>
            </div>
            <div class="text-xs text-yellow-200 mt-1">Import world data for enhanced content</div>
          </div>
          
          <div class="space-y-4">
            <!-- Campaign Type -->
            <div>
              <label class="block text-sm font-medium mb-2">Campaign Type</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.types.combat" class="rounded bg-gray-700 border-gray-600">
                  <span>⚔️ Combat - Face dangerous foes and epic battles</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.types.exploration" class="rounded bg-gray-700 border-gray-600">
                  <span>🗺️ Exploration - Discover new lands and hidden secrets</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.types.social" class="rounded bg-gray-700 border-gray-600">
                  <span>👥 Social - Navigate politics and relationships</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.types.investigation" class="rounded bg-gray-700 border-gray-600">
                  <span>🔍 Investigation - Solve mysteries and uncover conspiracies</span>
                </label>
              </div>
            </div>

            <!-- Adventure Scale -->
            <div>
              <label class="block text-sm font-medium mb-2">
                Adventure Scale ({{ campaignConfig.adventureScale }})
              </label>
              <input 
                type="range" 
                v-model="campaignConfig.adventureScale" 
                min="1" 
                max="10" 
                class="w-full"
              >
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 - Local Hero</span>
                <span>5 - Regional Champion</span>
                <span>10 - World Savior</span>
              </div>
            </div>

            <!-- Character Role -->
            <div>
              <label class="block text-sm font-medium mb-2">Character Role</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    v-model="campaignConfig.characterRole" 
                    value="hero" 
                    class="bg-gray-700 border-gray-600"
                  >
                  <span>🦸 Destined Hero - Born for greatness</span>
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    v-model="campaignConfig.characterRole" 
                    value="average" 
                    class="bg-gray-700 border-gray-600"
                  >
                  <span>👤 Average Person - Thrust into adventure</span>
                </label>
                <label class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    v-model="campaignConfig.characterRole" 
                    value="reluctant" 
                    class="bg-gray-700 border-gray-600"
                  >
                  <span>😰 Reluctant Adventurer - Forced by circumstances</span>
                </label>
              </div>
            </div>

            <!-- Campaign Themes -->
            <div>
              <label class="block text-sm font-medium mb-2">Campaign Themes</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.themes.darkFantasy" class="rounded bg-gray-700 border-gray-600">
                  <span>🌑 Dark Fantasy - Grim and gritty</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.themes.highFantasy" class="rounded bg-gray-700 border-gray-600">
                  <span>✨ High Fantasy - Magic and wonder</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.themes.political" class="rounded bg-gray-700 border-gray-600">
                  <span>👑 Political Intrigue - Power and betrayal</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="campaignConfig.themes.survival" class="rounded bg-gray-700 border-gray-600">
                  <span>🏕️ Survival - Against the odds</span>
                </label>
              </div>
            </div>

            <!-- Starting Location -->
            <div>
              <label class="block text-sm font-medium mb-1">Starting Location</label>
              <div v-if="worldBuildingData.loaded && availableLocations.length > 0" class="mb-2">
                <select 
                  v-model="campaignConfig.startingLocation" 
                  class="w-full bg-gray-700 border border-gray-600 rounded p-2 max-h-48 overflow-y-auto"
                  size="1"
                  style="max-height: 200px;"
                >
                  <option value="">Custom Location</option>
                  <optgroup v-if="getCitiesAndTowns().length > 0" label="Cities & Towns">
                    <option 
                      v-for="location in getCitiesAndTowns()" 
                      :key="location.id" 
                      :value="location.name"
                    >
                      {{ location.name }} ({{ location.type }})
                    </option>
                  </optgroup>
                  <optgroup v-if="getOtherLocations().length > 0" label="Other Locations">
                    <option 
                      v-for="location in getOtherLocations()" 
                      :key="location.id" 
                      :value="location.name"
                    >
                      {{ location.name }} ({{ location.type }})
                    </option>
                  </optgroup>
                </select>
                <div class="text-xs text-gray-400 mt-1">
                  {{ availableLocations.length }} locations available from world data
                </div>
              </div>
              <input 
                v-if="!campaignConfig.startingLocation"
                v-model="campaignConfig.customLocation" 
                placeholder="e.g., small farming village, bustling port city"
                class="w-full bg-gray-700 border border-gray-600 rounded p-2"
              />
            </div>

            <!-- Starting Situation -->
            <div>
              <label class="block text-sm font-medium mb-1">Starting Situation</label>
              <textarea 
                v-model="campaignConfig.startingSituation" 
                placeholder="What brings the character into the adventure?"
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
              ></textarea>
            </div>

            <button 
              @click="generateCampaignStart"
              :disabled="isGenerating || !isValidCampaignConfig"
              class="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
            >
              {{ isGenerating ? '🤖 Creating Your Adventure...' : '🚀 Generate Campaign Opening' }}
            </button>
          </div>
        </div>

        <div class="flex-1 p-4 overflow-auto">
          <div v-if="campaignStart.opening" class="space-y-4">
            <div class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-yellow-300">🎬 Campaign Opening</h4>
              <div v-html="formatContent(campaignStart.opening)" class="mb-4"></div>
              
              <div v-if="campaignStart.firstScene" class="mt-4 border-t border-gray-700 pt-4">
                <h5 class="font-semibold mb-2 text-blue-300">📍 Opening Scene</h5>
                <div v-html="formatContent(campaignStart.firstScene)"></div>
              </div>
            </div>

            <div v-if="campaignStart.hooks.length > 0" class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-green-300">🎣 Adventure Hooks</h4>
              <div class="space-y-2">
                <div 
                  v-for="hook in campaignStart.hooks" 
                  :key="hook.id"
                  class="bg-gray-900 rounded p-3 border-l-4 border-green-500"
                >
                  <h5 class="font-semibold text-green-200">{{ hook.title }}</h5>
                  <p class="text-sm text-gray-300 mt-1">{{ hook.description }}</p>
                </div>
              </div>
            </div>

            <div v-if="campaignStart.npcs.length > 0" class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-purple-300">👥 Key NPCs</h4>
              <div class="space-y-2">
                <div 
                  v-for="npc in campaignStart.npcs" 
                  :key="npc.id"
                  class="bg-gray-900 rounded p-3 border border-purple-800"
                >
                  <div class="flex justify-between items-start">
                    <h5 class="font-semibold">{{ npc.name }}</h5>
                    <span class="text-xs bg-purple-700 px-2 py-1 rounded">{{ npc.role }}</span>
                  </div>
                  <p class="text-sm text-gray-300 mt-1">{{ npc.description }}</p>
                  <p class="text-xs text-gray-400 mt-2 italic">"{{ npc.greeting }}"</p>
                </div>
              </div>
            </div>

            <div v-if="campaignStart.challenges.length > 0" class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-red-300">⚔️ Initial Challenges</h4>
              <div class="space-y-2">
                <div 
                  v-for="challenge in campaignStart.challenges" 
                  :key="challenge.id"
                  class="bg-gray-900 rounded p-3 border border-red-800"
                >
                  <div class="flex justify-between items-start">
                    <h5 class="font-semibold">{{ challenge.name }}</h5>
                    <span class="text-xs bg-red-700 px-2 py-1 rounded">{{ challenge.type }}</span>
                  </div>
                  <p class="text-sm text-gray-300 mt-1">{{ challenge.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 py-8">
            <h4 class="text-lg mb-2">🌟 Begin Your Adventure</h4>
            <p class="text-sm">Configure your campaign settings and generate an epic opening</p>
          </div>
        </div>
      </div>

      <!-- Live Session Support -->
      <div v-if="currentWorkflow === 'live'" class="h-full flex">
        <div class="w-1/3 border-r border-gray-700 p-4">
          <h3 class="text-lg font-semibold mb-4 text-red-300">⚡ Live Support</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Quick Request</label>
              <select v-model="liveRequest.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
                <option value="npc-reaction">🎭 NPC Reaction</option>
                <option value="encounter">⚔️ Quick Encounter</option>
                <option value="consequence">🎯 Action Consequence</option>
                <option value="description">🏰 Location Description</option>
                <option value="rules">📚 Rules Help</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Current Situation</label>
              <textarea 
                v-model="liveRequest.situation" 
                placeholder="Describe what's happening..."
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-24 resize-none"
              ></textarea>
            </div>

            <button 
              @click="getLiveSupport"
              :disabled="isGenerating || !liveRequest.situation.trim()"
              class="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
            >
              {{ isGenerating ? '🤖 Thinking...' : '🚀 Get Instant Help' }}
            </button>

            <div class="border-t border-gray-700 pt-4">
              <h4 class="font-semibold mb-2">🎲 Quick Rolls</h4>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  v-for="roll in quickRolls" 
                  :key="roll.label"
                  @click="executeQuickRoll(roll)"
                  class="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                >
                  {{ roll.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 p-4 overflow-auto">
          <div v-if="liveResponses.length > 0" class="space-y-3">
            <div 
              v-for="response in liveResponses" 
              :key="response.id"
              class="bg-gray-800 rounded p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="text-sm text-gray-400">{{ formatTime(response.timestamp) }}</span>
                <span class="text-xs bg-blue-700 px-2 py-1 rounded">{{ response.type }}</span>
              </div>
              <div v-html="formatContent(response.content)"></div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 py-8">
            <h4 class="text-lg mb-2">⚡ Live Session Support</h4>
            <p class="text-sm">Get instant help during your game session</p>
          </div>
        </div>
      </div>

      <!-- Post-Session Processing -->
      <div v-if="currentWorkflow === 'post'" class="h-full p-4">
        <h3 class="text-lg font-semibold mb-4 text-purple-300">📊 Session Wrap-up</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="bg-gray-800 rounded p-4">
              <h4 class="font-semibold mb-2">📝 Session Summary</h4>
              <textarea 
                v-model="sessionSummary.events" 
                placeholder="What happened this session?"
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-32 resize-none"
              ></textarea>
            </div>

            <div class="bg-gray-800 rounded p-4">
              <h4 class="font-semibold mb-2">🎯 Plot Threads</h4>
              <textarea 
                v-model="sessionSummary.plotThreads" 
                placeholder="New or advancing storylines..."
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-24 resize-none"
              ></textarea>
            </div>

            <div class="bg-gray-800 rounded p-4">
              <h4 class="font-semibold mb-2">👥 NPCs Encountered</h4>
              <textarea 
                v-model="sessionSummary.npcs" 
                placeholder="New or important NPCs..."
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-24 resize-none"
              ></textarea>
            </div>

            <button 
              @click="processSessionWrapup"
              :disabled="isGenerating"
              class="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
            >
              {{ isGenerating ? '🤖 Processing...' : '🔄 Generate Next Session Hooks' }}
            </button>
          </div>

          <div class="space-y-4">
            <div v-if="nextSessionHooks.length > 0" class="bg-gray-800 rounded p-4">
              <h4 class="font-semibold mb-2 text-green-300">🎣 Next Session Hooks</h4>
              <ul class="space-y-2">
                <li 
                  v-for="hook in nextSessionHooks" 
                  :key="hook.id"
                  class="bg-gray-900 rounded p-2 border-l-4 border-green-500"
                >
                  <div class="text-sm">{{ hook.description }}</div>
                  <div class="text-xs text-gray-400 mt-1">{{ hook.urgency }}</div>
                </li>
              </ul>
            </div>

            <div class="bg-gray-800 rounded p-4">
              <h4 class="font-semibold mb-2 text-yellow-300">📈 Session Analytics</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>API Requests:</span>
                  <span>{{ sessionStats.apiRequests }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Content Generated:</span>
                  <span>{{ sessionStats.itemsGenerated }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Cache Hits:</span>
                  <span>{{ sessionStats.cacheHits }}%</span>
                </div>
                <div class="flex justify-between">
                  <span>Total Cost:</span>
                  <span>${{ sessionStats.totalCost.toFixed(3) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div v-if="isGenerating" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <h3 class="text-lg font-semibold text-blue-300">{{ progressMessage }}</h3>
        </div>
        
        <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        
        <div class="text-sm text-gray-400">{{ progressDetail }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { characterState } from '../../characterState.js'
import { EnhancedAPIManager } from '../../utils/EnhancedAPIManager.js'
import DiceRoller from '../../utils/DiceRoller.js'
import WorldBuildingPanel from './WorldBuildingPanel.vue'

// State
const apiManager = new EnhancedAPIManager()
const currentWorkflow = ref('world')
const isGenerating = ref(false)
const progress = ref(0)
const progressMessage = ref('')
const progressDetail = ref('')

// Component refs
const worldBuildingPanelRef = ref(null)

// API Key for World Building
const apiKey = ref(localStorage.getItem('openai-api-key') || '')

// World Building Data
const worldBuildingData = ref({
  loaded: false,
  worldName: '',
  locations: 0
})

const availableLocations = ref([])

// Workflow configuration
const workflows = [
  { id: 'world', name: 'World Building', icon: '🌍' },
  { id: 'campaign', name: 'Campaign Start', icon: '🚀' },
  { id: 'live', name: 'Live Support', icon: '⚡' },
  { id: 'post', name: 'Post-Session', icon: '📊' }
]

// Campaign configuration
const campaignConfig = ref({
  types: {
    combat: false,
    exploration: false,
    social: false,
    investigation: false
  },
  adventureScale: 1,
  characterRole: 'average',
  themes: {
    darkFantasy: false,
    highFantasy: false,
    political: false,
    survival: false
  },
  startingLocation: '',
  customLocation: '',
  startingSituation: ''
})

const campaignStart = ref({
  opening: '',
  firstScene: '',
  hooks: [],
  npcs: [],
  challenges: []
})

// Computed
const isValidCampaignConfig = computed(() => {
  const hasType = Object.values(campaignConfig.value.types).some(v => v)
  const hasLocation = campaignConfig.value.startingLocation || campaignConfig.value.customLocation
  return hasType && hasLocation
})

// Live support state
const liveRequest = ref({
  type: 'npc-reaction',
  situation: ''
})

const liveResponses = ref([])

const quickRolls = [
  { label: 'd20', expression: '1d20' },
  { label: 'Initiative', expression: '1d20+' + (characterState.init || 0) },
  { label: 'Perception', expression: '1d20+' + getSkillModifier('Perception') },
  { label: 'Stealth', expression: '1d20+' + getSkillModifier('Stealth') }
]

// Post-session state
const sessionSummary = ref({
  events: '',
  plotThreads: '',
  npcs: ''
})

const nextSessionHooks = ref([])
const sessionStats = ref({
  apiRequests: 0,
  itemsGenerated: 0,
  cacheHits: 85,
  totalCost: 0
})

// Budget tracking
const dailyUsage = ref(0)
const dailyBudget = ref(10.00)

const budgetUsedPercentage = computed(() => 
  Math.min((dailyUsage.value / dailyBudget.value) * 100, 100)
)

// Methods
function getSkillModifier(skillName) {
  const skill = characterState.skills.find(s => s.name === skillName)
  if (!skill) return 0
  
  const abilityMod = Math.floor((characterState.abilityScores[skill.ability] - 10) / 2)
  return skill.rank + abilityMod + (skill.misc || 0)
}

function getCitiesAndTowns() {
  const cityTypes = ['city', 'town', 'village', 'settlement', 'metropolis', 'hamlet']
  return availableLocations.value.filter(loc => 
    cityTypes.some(type => loc.type?.toLowerCase().includes(type))
  )
}

function getOtherLocations() {
  const cityTypes = ['city', 'town', 'village', 'settlement', 'metropolis', 'hamlet']
  return availableLocations.value.filter(loc => 
    !cityTypes.some(type => loc.type?.toLowerCase().includes(type))
  )
}

function loadWorldBuildingData() {
  try {
    const worldData = localStorage.getItem('worldBuildingData')
    if (worldData) {
      const parsed = JSON.parse(worldData)
      worldBuildingData.value = {
        loaded: true,
        worldName: parsed.name || 'Unnamed World',
        locations: parsed.locations?.length || 0
      }
      
      // Load all locations, prioritizing towns and cities
      if (parsed.locations && parsed.locations.length > 0) {
        // Sort locations to put towns/cities first
        availableLocations.value = parsed.locations.sort((a, b) => {
          const priorityTypes = ['city', 'town', 'village', 'settlement']
          const aIndex = priorityTypes.findIndex(type => a.type?.toLowerCase().includes(type))
          const bIndex = priorityTypes.findIndex(type => b.type?.toLowerCase().includes(type))
          
          // If both are priority types, sort by index
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
          // If only a is priority, it comes first
          if (aIndex !== -1) return -1
          // If only b is priority, it comes first
          if (bIndex !== -1) return 1
          // Otherwise maintain original order
          return 0
        })
      }
    }
  } catch (error) {
    console.warn('Could not load world building data:', error)
  }
}

async function generateCampaignStart() {
  isGenerating.value = true
  progress.value = 0
  progressMessage.value = 'Creating Your Adventure'
  
  try {
    // Build campaign parameters
    const selectedTypes = Object.entries(campaignConfig.value.types)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(', ')
    
    const selectedThemes = Object.entries(campaignConfig.value.themes)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(', ')
    
    const location = campaignConfig.value.startingLocation || campaignConfig.value.customLocation
    
    // Step 1: Campaign Opening
    progressDetail.value = 'Crafting the perfect opening...'
    progress.value = 20
    
    const openingResponse = await apiManager.makeRequest({
      prompt: `Create an epic campaign opening for Pathfinder 1e:
        Character: ${characterState.name} (Level ${getTotalLevel()})
        Character Role: ${campaignConfig.value.characterRole}
        Campaign Types: ${selectedTypes || 'mixed adventure'}
        Adventure Scale: ${campaignConfig.value.adventureScale}/10
        Themes: ${selectedThemes || 'classic fantasy'}
        Starting Location: ${location}
        Situation: ${campaignConfig.value.startingSituation || 'The adventure begins...'}
        
        Create a compelling opening narrative that:
        1. Sets the tone for the campaign
        2. Introduces the starting location vividly
        3. Explains how the character fits into this world
        4. Hints at the adventures to come
        
        Keep it engaging and about 2-3 paragraphs.`,
      cacheKey: `campaign_opening_${campaignConfig.value.characterRole}_${campaignConfig.value.adventureScale}`,
      priority: 'high',
      maxTokens: 800
    })
    
    campaignStart.value.opening = openingResponse.content
    
    // Step 2: First Scene
    progressDetail.value = 'Setting the opening scene...'
    progress.value = 40
    
    const sceneResponse = await apiManager.makeRequest({
      prompt: `Create the opening scene following this campaign start:
        ${openingResponse.content}
        
        Write a specific scene that:
        1. Places ${characterState.name} in an immediate situation
        2. Provides clear choices for the player
        3. Introduces the first challenge or opportunity
        4. Ends with "What do you do?"
        
        Make it immersive and interactive.`,
      maxTokens: 600
    })
    
    campaignStart.value.firstScene = sceneResponse.content
    
    // Step 3: Adventure Hooks
    progressDetail.value = 'Weaving adventure hooks...'
    progress.value = 60
    
    const hooksResponse = await apiManager.makeRequest({
      prompt: `Create 3 adventure hooks for this campaign:
        Types: ${selectedTypes}
        Scale: ${campaignConfig.value.adventureScale}/10
        Location: ${location}
        
        Each hook should have:
        - title: Catchy name
        - description: 1-2 sentence overview
        
        Format as JSON array. Vary the urgency and approach.`,
      maxTokens: 600
    })
    
    campaignStart.value.hooks = parseJsonSafely(hooksResponse.content, [])
      .map((hook, i) => ({ ...hook, id: i }))
    
    // Step 4: Key NPCs
    progressDetail.value = 'Bringing characters to life...'
    progress.value = 80
    
    const npcsResponse = await apiManager.makeRequest({
      prompt: `Create 3 important NPCs for the campaign opening in ${location}:
        
        For each NPC provide:
        - name: Full name
        - role: Their position/occupation
        - description: Brief physical and personality description
        - greeting: A sample line of dialogue
        
        Make them memorable and relevant to a ${campaignConfig.value.characterRole} starting their adventure.
        Format as JSON array.`,
      maxTokens: 800
    })
    
    campaignStart.value.npcs = parseJsonSafely(npcsResponse.content, [])
      .map((npc, i) => ({ ...npc, id: i }))
    
    // Step 5: Initial Challenges
    progressDetail.value = 'Preparing challenges...'
    progress.value = 90
    
    const challengesResponse = await apiManager.makeRequest({
      prompt: `Create 2-3 initial challenges appropriate for:
        Character Level: ${getTotalLevel()}
        Campaign Types: ${selectedTypes}
        Adventure Scale: ${campaignConfig.value.adventureScale}/10
        
        Mix different types (combat, social, exploration, puzzle).
        For each provide:
        - name: Challenge title
        - type: Challenge category
        - description: What makes it interesting
        
        Format as JSON array.`,
      maxTokens: 600
    })
    
    campaignStart.value.challenges = parseJsonSafely(challengesResponse.content, [])
      .map((challenge, i) => ({ ...challenge, id: i }))
    
    progress.value = 100
    progressDetail.value = 'Your adventure awaits!'
    
  } catch (error) {
    console.error('Campaign generation failed:', error)
    alert('Campaign generation failed: ' + error.message)
  } finally {
    isGenerating.value = false
    updateUsageStats()
  }
}

async function getLiveSupport() {
  isGenerating.value = true
  progressMessage.value = 'Getting Live Support'
  progressDetail.value = 'Analyzing situation...'
  
  try {
    const response = await apiManager.makeRequest({
      prompt: `Provide immediate GM support for this situation:
        Type: ${liveRequest.value.type}
        Situation: ${liveRequest.value.situation}
        Character: ${characterState.name} (Level ${getTotalLevel()}, HP: ${characterState.hp}/${characterState.hpMax})
        
        Give a practical, immediate response that can be used right now in play.`,
      priority: 'high',
      maxTokens: 600,
      temperature: 0.9
    })
    
    liveResponses.value.unshift({
      id: Date.now(),
      type: liveRequest.value.type,
      content: response.content,
      timestamp: Date.now()
    })
    
    liveRequest.value.situation = ''
    
  } catch (error) {
    console.error('Live support failed:', error)
    alert('Live support failed: ' + error.message)
  } finally {
    isGenerating.value = false
    updateUsageStats()
  }
}

async function processSessionWrapup() {
  isGenerating.value = true
  progressMessage.value = 'Processing Session'
  progressDetail.value = 'Analyzing session events...'
  
  try {
    const response = await apiManager.makeRequest({
      prompt: `Based on this session summary, generate 3-4 hooks for the next session:
        Events: ${sessionSummary.value.events}
        Plot Threads: ${sessionSummary.value.plotThreads}
        NPCs: ${sessionSummary.value.npcs}
        Character: ${characterState.name} (Level ${getTotalLevel()})
        
        Each hook should:
        - Connect to this session's events
        - Provide clear next steps
        - Match the character's level
        
        Format as JSON array with fields: description, urgency.`,
      maxTokens: 800
    })
    
    nextSessionHooks.value = parseJsonSafely(response.content, [])
      .map((hook, i) => ({ ...hook, id: i }))
    
  } catch (error) {
    console.error('Session processing failed:', error)
    alert('Session processing failed: ' + error.message)
  } finally {
    isGenerating.value = false
    updateUsageStats()
  }
}

function executeQuickRoll(roll) {
  const result = DiceRoller.rollExpression(roll.expression)
  
  liveResponses.value.unshift({
    id: Date.now(),
    type: 'roll',
    content: `🎲 **${roll.label}**: ${result.total} (${result.diceRoll} + ${result.modifier})${result.isNatural20 ? ' **NATURAL 20!**' : result.isNatural1 ? ' **NATURAL 1!**' : ''}`,
    timestamp: Date.now()
  })
}

function getTotalLevel() {
  return characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
}

function parseJsonSafely(text, fallback = []) {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return fallback
  } catch {
    return fallback
  }
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function updateUsageStats() {
  try {
    const stats = apiManager.getUsageStats ? apiManager.getUsageStats() : {
      requestCount: 0,
      cacheHitRate: 0,
      totalCost: 0,
      dailyBudgetUsed: 0
    }
    
    sessionStats.value = {
      apiRequests: stats.requestCount || 0,
      itemsGenerated: campaignStart.value.hooks.length + campaignStart.value.npcs.length + campaignStart.value.challenges.length,
      cacheHits: Math.round((stats.cacheHitRate || 0) * 100),
      totalCost: stats.totalCost || 0
    }
    
    dailyUsage.value = stats.dailyBudgetUsed || 0
    
  } catch (error) {
    console.warn('Could not update usage stats:', error)
    sessionStats.value = {
      apiRequests: 0,
      itemsGenerated: 0,
      cacheHits: 0,
      totalCost: 0
    }
  }
}

// World Building Handlers
function handleContentGenerated(content) {
  // Update world building data when new content is generated
  if (content.category === 'locations') {
    loadWorldBuildingData() // Refresh location data
  }
  
  // Optionally save to a persistent store
  console.log('World building content generated:', content)
}

function handleUsageUpdated(usage) {
  // Update API usage stats
  if (usage.cost) {
    dailyUsage.value += usage.cost
  }
  updateUsageStats()
}

onMounted(() => {
  loadWorldBuildingData()
  updateUsageStats()
})
</script>

<style scoped>
.session-manager {
  font-family: 'Inter', system-ui, sans-serif;
}

.transition-all {
  transition: all 0.2s ease;
}

/* Custom select dropdown styles */
select {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}

select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Custom checkbox styles */
input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  color: #3b82f6;
  background-color: #374151;
  border-color: #4b5563;
  border-radius: 0.25rem;
}

input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Custom radio styles */
input[type="radio"] {
  width: 1rem;
  height: 1rem;
  color: #3b82f6;
  background-color: #374151;
  border-color: #4b5563;
}

input[type="radio"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Range slider styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #374151;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  margin-top: -0.5rem;
}

input[type="range"]::-moz-range-track {
  background: #374151;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-moz-range-thumb {
  background: #3b82f6;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  border: none;
}
</style>