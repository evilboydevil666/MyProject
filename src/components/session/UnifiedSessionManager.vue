// src/components/session/UnifiedSessionManager.vue
<template>
  <div class="session-manager h-full flex flex-col bg-gray-900 text-white">
    <!-- Header with Status -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold text-blue-300 mb-1">🎯 Session Command Center</h2>
          <p class="text-sm text-gray-400">Unified workflow for session prep, world building, live support, and post-session processing</p>
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
      <!-- Pre-Session Planning -->
      <div v-if="currentWorkflow === 'prep'" class="h-full flex">
        <div class="w-1/3 border-r border-gray-700 p-4">
          <h3 class="text-lg font-semibold mb-4 text-green-300">📋 Session Setup</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Session Type</label>
              <select v-model="sessionConfig.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
                <option value="exploration">🗺️ Exploration</option>
                <option value="combat">⚔️ Combat</option>
                <option value="social">👥 Social</option>
                <option value="mystery">🔍 Investigation</option>
                <option value="mixed">🎭 Mixed Adventure</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Expected Duration</label>
              <select v-model="sessionConfig.duration" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5+ hours</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Primary Location</label>
              <input 
                v-model="sessionConfig.location" 
                placeholder="e.g., haunted mansion, dragon's lair"
                class="w-full bg-gray-700 border border-gray-600 rounded p-2"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Story Goals</label>
              <textarea 
                v-model="sessionConfig.goals" 
                placeholder="What should happen this session?"
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
              ></textarea>
            </div>

            <button 
              @click="generateSessionPlan"
              :disabled="isGenerating"
              class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
            >
              {{ isGenerating ? '🤖 Generating...' : '🚀 Generate Session Plan' }}
            </button>
          </div>
        </div>

        <div class="flex-1 p-4 overflow-auto">
          <div v-if="sessionPlan.overview" class="space-y-4">
            <div class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-yellow-300">📖 Session Overview</h4>
              <div v-html="formatContent(sessionPlan.overview)"></div>
            </div>

            <div v-if="sessionPlan.encounters.length > 0" class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-red-300">⚔️ Encounters</h4>
              <div class="space-y-2">
                <div 
                  v-for="encounter in sessionPlan.encounters" 
                  :key="encounter.id"
                  class="bg-gray-900 rounded p-3 border border-red-800"
                >
                  <div class="flex justify-between items-start">
                    <h5 class="font-semibold">{{ encounter.name }}</h5>
                    <span class="text-xs bg-red-700 px-2 py-1 rounded">CR {{ encounter.cr }}</span>
                  </div>
                  <p class="text-sm text-gray-300 mt-1">{{ encounter.description }}</p>
                </div>
              </div>
            </div>

            <div v-if="sessionPlan.npcs.length > 0" class="bg-gray-800 rounded p-4">
              <h4 class="text-lg font-semibold mb-2 text-purple-300">👥 NPCs</h4>
              <div class="space-y-2">
                <div 
                  v-for="npc in sessionPlan.npcs" 
                  :key="npc.id"
                  class="bg-gray-900 rounded p-3 border border-purple-800"
                >
                  <div class="flex justify-between items-start">
                    <h5 class="font-semibold">{{ npc.name }}</h5>
                    <span class="text-xs bg-purple-700 px-2 py-1 rounded">{{ npc.role }}</span>
                  </div>
                  <p class="text-sm text-gray-300 mt-1">{{ npc.personality }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 py-8">
            <h4 class="text-lg mb-2">📝 Session Planning</h4>
            <p class="text-sm">Configure your session and generate a complete plan</p>
          </div>
        </div>
      </div>

      <!-- World Building -->
      <div v-if="currentWorkflow === 'world'" class="h-full">
        <WorldBuildingPanel 
          :api-key="apiKey"
          @content-generated="handleWorldBuildingContent"
          @usage-updated="handleUsageUpdate"
        />
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
                  <span>World Building Items:</span>
                  <span>{{ worldBuildingStats.totalItems }}</span>
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
const currentWorkflow = ref('prep')
const isGenerating = ref(false)
const progress = ref(0)
const progressMessage = ref('')
const progressDetail = ref('')
const apiKey = ref('')

// Workflow configuration - Updated to include World Building
const workflows = [
  { id: 'prep', name: 'Pre-Session', icon: '📋' },
  { id: 'world', name: 'World Building', icon: '🌍' },
  { id: 'live', name: 'Live Support', icon: '⚡' },
  { id: 'post', name: 'Post-Session', icon: '📊' }
]

// Session planning state
const sessionConfig = ref({
  type: 'mixed',
  duration: '3',
  location: '',
  goals: ''
})

const sessionPlan = ref({
  overview: '',
  encounters: [],
  npcs: [],
  locations: []
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

// World building stats
const worldBuildingStats = ref({
  totalItems: 0,
  categories: {}
})

// Budget tracking
const dailyUsage = ref(0)
const dailyBudget = ref(10.00)

const budgetUsedPercentage = computed(() => 
  Math.min((dailyUsage.value / dailyBudget.value) * 100, 100)
)

// Methods
function getSkillModifier(skillName) {
  const skill = characterState.skills?.find(s => s.name === skillName)
  if (!skill) return 0
  
  const abilityMod = characterState.abilities?.[skill.ability]?.modifier || 0
  return skill.ranks + abilityMod + (skill.misc || 0)
}

async function generateSessionPlan() {
  isGenerating.value = true
  progress.value = 0
  progressMessage.value = 'Generating Session Plan'
  
  try {
    // Step 1: Overview
    progressDetail.value = 'Creating session overview...'
    progress.value = 20
    
    const overviewResponse = await apiManager.makeRequest({
      prompt: `Create a session overview for Pathfinder 1e:
        Type: ${sessionConfig.value.type}
        Duration: ${sessionConfig.value.duration} hours
        Location: ${sessionConfig.value.location}
        Goals: ${sessionConfig.value.goals}
        Character: ${characterState.name} (Level ${getTotalLevel()})
        
        Provide a compelling session structure with 3-4 major scenes.`,
      cacheKey: `session_overview_${sessionConfig.value.type}_${getTotalLevel()}`,
      priority: 'high',
      maxTokens: 800
    })
    
    sessionPlan.value.overview = overviewResponse.content
    
    // Step 2: Encounters
    progressDetail.value = 'Designing encounters...'
    progress.value = 50
    
    const encountersResponse = await apiManager.makeRequest({
      prompt: `Design 2-3 encounters for a ${sessionConfig.value.type} session:
        Character Level: ${getTotalLevel()}
        Location: ${sessionConfig.value.location}
        
        For each encounter, provide: name, CR, brief description.
        Format as JSON array with fields: name, cr, description.`,
      cacheKey: `encounters_${sessionConfig.value.type}_${getTotalLevel()}`,
      maxTokens: 1000
    })
    
    sessionPlan.value.encounters = parseJsonSafely(encountersResponse.content, [])
      .map((enc, i) => ({ ...enc, id: i }))
    
    // Step 3: NPCs
    progressDetail.value = 'Creating NPCs...'
    progress.value = 80
    
    const npcsResponse = await apiManager.makeRequest({
      prompt: `Create 2-3 NPCs for this session:
        Location: ${sessionConfig.value.location}
        Session Type: ${sessionConfig.value.type}
        
        For each NPC, provide: name, role, personality.
        Format as JSON array.`,
      cacheKey: `npcs_${sessionConfig.value.type}_location`,
      maxTokens: 800
    })
    
    sessionPlan.value.npcs = parseJsonSafely(npcsResponse.content, [])
      .map((npc, i) => ({ ...npc, id: i }))
    
    progress.value = 100
    progressDetail.value = 'Complete!'
    
  } catch (error) {
    console.error('Session generation failed:', error)
    alert('Session generation failed: ' + error.message)
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
      temperature: 0.9 // Higher creativity for live support
    })
    
    liveResponses.value.unshift({
      id: Date.now(),
      type: liveRequest.value.type,
      content: response.content,
      timestamp: Date.now()
    })
    
    // Clear the request
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

function handleWorldBuildingContent(content) {
  // Track world building content
  worldBuildingStats.value.totalItems++
  if (!worldBuildingStats.value.categories[content.category]) {
    worldBuildingStats.value.categories[content.category] = 0
  }
  worldBuildingStats.value.categories[content.category]++
  
  updateUsageStats()
}

function handleUsageUpdate(usage) {
  // Update daily usage from world building
  dailyUsage.value += usage.cost || 0
  sessionStats.value.totalCost += usage.cost || 0
}

function getTotalLevel() {
  return characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1
}

function parseJsonSafely(text, fallback = []) {
  try {
    // Try to extract JSON from the response
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
    // Get stats from the API manager if it has the method
    const stats = apiManager.getUsageStats ? apiManager.getUsageStats() : {
      requestCount: 0,
      cacheHitRate: 0,
      totalCost: 0,
      dailyBudgetUsed: 0
    }
    
    // Update session stats with safe access
    sessionStats.value = {
      apiRequests: stats.requestCount || 0,
      itemsGenerated: sessionPlan.value.encounters.length + sessionPlan.value.npcs.length + worldBuildingStats.value.totalItems,
      cacheHits: Math.round((stats.cacheHitRate || 0) * 100),
      totalCost: stats.totalCost || 0
    }
    
    // Update daily usage
    dailyUsage.value = stats.dailyBudgetUsed || 0
    
  } catch (error) {
    console.warn('Could not update usage stats:', error)
    // Set default values on error
    sessionStats.value = {
      apiRequests: 0,
      itemsGenerated: sessionPlan.value.encounters.length + sessionPlan.value.npcs.length,
      cacheHits: 0,
      totalCost: 0
    }
  }
}

onMounted(() => {
  // Load API key
  apiKey.value = localStorage.getItem('openai-api-key') || ''
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

/* Hide scrollbars in world building panel for cleaner look */
.session-manager :deep(.world-building-panel) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>