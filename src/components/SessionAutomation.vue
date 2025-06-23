<template>
  <div class="session-automation h-full flex flex-col bg-gray-900 text-white">
    <!-- Header -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <h2 class="text-2xl font-bold text-blue-300 mb-2">🎯 Session Automation</h2>
      <p class="text-sm text-gray-400">AI-powered session preparation and management</p>
    </div>

    <!-- Quick Session Generator -->
    <div class="p-4 border-b border-gray-700">
      <h3 class="text-lg font-semibold mb-3 text-green-300">⚡ Quick Session Generator</h3>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Session Type</label>
          <select v-model="sessionType" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="exploration">🗺️ Exploration</option>
            <option value="combat">⚔️ Combat Heavy</option>
            <option value="social">👥 Social/Intrigue</option>
            <option value="mystery">🔍 Mystery/Investigation</option>
            <option value="mixed">🎭 Mixed Adventure</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Difficulty</label>
          <select v-model="difficulty" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="easy">Easy (Roleplay Focus)</option>
            <option value="moderate">Moderate (Balanced)</option>
            <option value="hard">Hard (Challenging)</option>
            <option value="deadly">Deadly (High Stakes)</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Location Theme</label>
        <input 
          v-model="locationTheme" 
          placeholder="e.g., haunted mansion, bustling marketplace, ancient ruins"
          class="w-full bg-gray-700 border border-gray-600 rounded p-2"
        />
      </div>

      <button 
        @click="generateQuickSession" 
        :disabled="isGenerating"
        class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
      >
        {{ isGenerating ? '🤖 Generating Session...' : '🚀 Generate Complete Session' }}
      </button>
    </div>

    <!-- Session Components -->
    <div class="flex-1 overflow-auto p-4">
      <div class="space-y-4">
        <!-- Session Overview -->
        <div v-if="currentSession.overview" class="bg-gray-800 rounded p-4">
          <h3 class="text-lg font-semibold mb-2 text-yellow-300">📋 Session Overview</h3>
          <div class="text-sm bg-gray-900 rounded p-3">
            <div v-html="formatContent(currentSession.overview)"></div>
          </div>
        </div>

        <!-- Encounters -->
        <div v-if="currentSession.encounters.length > 0" class="bg-gray-800 rounded p-4">
          <h3 class="text-lg font-semibold mb-2 text-red-300">⚔️ Encounters</h3>
          <div class="space-y-3">
            <div 
              v-for="(encounter, index) in currentSession.encounters" 
              :key="index"
              class="bg-gray-900 rounded p-3 border border-red-800"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-red-200">{{ encounter.name }}</h4>
                <span class="text-xs bg-red-700 px-2 py-1 rounded">CR {{ encounter.cr }}</span>
              </div>
              <div class="text-sm text-gray-300" v-html="formatContent(encounter.description)"></div>
              <div v-if="encounter.tactics" class="mt-2 text-xs text-yellow-200">
                <strong>Tactics:</strong> {{ encounter.tactics }}
              </div>
            </div>
          </div>
        </div>

        <!-- NPCs -->
        <div v-if="currentSession.npcs.length > 0" class="bg-gray-800 rounded p-4">
          <h3 class="text-lg font-semibold mb-2 text-purple-300">👥 NPCs</h3>
          <div class="space-y-3">
            <div 
              v-for="(npc, index) in currentSession.npcs" 
              :key="index"
              class="bg-gray-900 rounded p-3 border border-purple-800"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-purple-200">{{ npc.name }}</h4>
                <span class="text-xs bg-purple-700 px-2 py-1 rounded">{{ npc.role }}</span>
              </div>
              <div class="text-sm text-gray-300">{{ npc.description }}</div>
              <div v-if="npc.personality" class="mt-1 text-xs text-green-200">
                <strong>Personality:</strong> {{ npc.personality }}
              </div>
              <div v-if="npc.secrets" class="mt-1 text-xs text-yellow-200">
                <strong>Secrets:</strong> {{ npc.secrets }}
              </div>
            </div>
          </div>
        </div>

        <!-- Locations -->
        <div v-if="currentSession.locations.length > 0" class="bg-gray-800 rounded p-4">
          <h3 class="text-lg font-semibold mb-2 text-green-300">🏰 Locations</h3>
          <div class="space-y-3">
            <div 
              v-for="(location, index) in currentSession.locations" 
              :key="index"
              class="bg-gray-900 rounded p-3 border border-green-800"
            >
              <h4 class="font-semibold text-green-200 mb-2">{{ location.name }}</h4>
              <div class="text-sm text-gray-300" v-html="formatContent(location.description)"></div>
              <div v-if="location.secrets" class="mt-2 text-xs text-yellow-200">
                <strong>Hidden Elements:</strong> {{ location.secrets }}
              </div>
            </div>
          </div>
        </div>

        <!-- Plot Hooks -->
        <div v-if="currentSession.plotHooks.length > 0" class="bg-gray-800 rounded p-4">
          <h3 class="text-lg font-semibold mb-2 text-yellow-300">🎣 Plot Hooks</h3>
          <ul class="space-y-2">
            <li 
              v-for="(hook, index) in currentSession.plotHooks" 
              :key="index"
              class="text-sm bg-gray-900 rounded p-2 border-l-4 border-yellow-500"
            >
              {{ hook }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Export Controls -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex gap-2">
        <button 
          @click="exportToChatGPT" 
          v-if="hasGeneratedContent"
          class="flex-1 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm"
        >
          🌐 Export to ChatGPT
        </button>
        <button 
          @click="saveSession" 
          v-if="hasGeneratedContent"
          class="flex-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
        >
          💾 Save Session
        </button>
        <button 
          @click="clearSession" 
          v-if="hasGeneratedContent"
          class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm"
        >
          🗑️ Clear
        </button>
      </div>
    </div>

    <!-- Progress Modal -->
    <div v-if="showProgress" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-blue-300">🤖 Generating Session Content</h3>
        
        <div class="space-y-3">
          <div v-for="step in generationSteps" :key="step.id" class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <div v-if="step.status === 'completed'" class="text-green-400">✅</div>
              <div v-else-if="step.status === 'working'" class="text-blue-400">
                <div class="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              </div>
              <div v-else class="text-gray-500">⏳</div>
            </div>
            <div class="flex-1">
              <div class="text-sm">{{ step.name }}</div>
              <div v-if="step.status === 'working'" class="text-xs text-gray-400">{{ step.detail }}</div>
            </div>
          </div>
        </div>

        <div class="mt-4 bg-gray-900 rounded p-2">
          <div class="text-xs text-gray-400 mb-1">Progress</div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: generationProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterState } from '../characterState.js'
import CombatTracker from '@/components/session/CombatTracker.vue'
import TaskTracker from '@/components/session/TaskTracker.vue'
import UnifiedSessionManager from '@/components/session/UnifiedSessionManager.vue'

// State
const sessionType = ref('mixed')
const difficulty = ref('moderate')
const locationTheme = ref('')
const isGenerating = ref(false)
const showProgress = ref(false)

const currentSession = ref({
  overview: '',
  encounters: [],
  npcs: [],
  locations: [],
  plotHooks: []
})

const generationSteps = ref([
  { id: 1, name: 'Session Overview', status: 'pending', detail: '' },
  { id: 2, name: 'Encounters', status: 'pending', detail: '' },
  { id: 3, name: 'NPCs', status: 'pending', detail: '' },
  { id: 4, name: 'Locations', status: 'pending', detail: '' },
  { id: 5, name: 'Plot Integration', status: 'pending', detail: '' }
])

// Computed
const hasGeneratedContent = computed(() => 
  currentSession.value.overview || 
  currentSession.value.encounters.length > 0 ||
  currentSession.value.npcs.length > 0 ||
  currentSession.value.locations.length > 0
)

const generationProgress = computed(() => {
  const completed = generationSteps.value.filter(step => step.status === 'completed').length
  return Math.round((completed / generationSteps.value.length) * 100)
})

const totalLevel = computed(() => 
  characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
)

// Main Functions
async function generateQuickSession() {
  isGenerating.value = true
  showProgress.value = true
  
  // Reset progress
  generationSteps.value.forEach(step => {
    step.status = 'pending'
    step.detail = ''
  })
  
  clearSession()
  
  try {
    const context = {
      characterLevel: totalLevel.value,
      characterClass: characterState.classes.map(c => c.className).join(', '),
      sessionType: sessionType.value,
      difficulty: difficulty.value,
      locationTheme: locationTheme.value,
      characterName: characterState.name
    }

    // Step 1: Session Overview
    await updateStep(1, 'working', 'Creating session structure...')
    currentSession.value.overview = await generateSessionOverview(context)
    await updateStep(1, 'completed')
    
    // Step 2: Encounters
    await updateStep(2, 'working', 'Designing encounters...')
    currentSession.value.encounters = await generateEncounters(context)
    await updateStep(2, 'completed')
    
    // Step 3: NPCs
    await updateStep(3, 'working', 'Creating NPCs...')
    currentSession.value.npcs = await generateNPCs(context)
    await updateStep(3, 'completed')
    
    // Step 4: Locations
    await updateStep(4, 'working', 'Building locations...')
    currentSession.value.locations = await generateLocations(context)
    await updateStep(4, 'completed')
    
    // Step 5: Plot Integration
    await updateStep(5, 'working', 'Weaving plot threads...')
    currentSession.value.plotHooks = await generatePlotHooks(context)
    await updateStep(5, 'completed')
    
  } catch (error) {
    console.error('Session generation failed:', error)
    alert('Session generation failed. Please check your API key and try again.')
  } finally {
    isGenerating.value = false
    setTimeout(() => {
      showProgress.value = false
    }, 2000)
  }
}

async function updateStep(stepId, status, detail = '') {
  const step = generationSteps.value.find(s => s.id === stepId)
  if (step) {
    step.status = status
    step.detail = detail
  }
  
  // Small delay for visual feedback
  await new Promise(resolve => setTimeout(resolve, 500))
}

// AI Generation Functions
async function generateSessionOverview(context) {
  const prompt = `Create a session overview for a Pathfinder 1e adventure:

Character: ${context.characterName} (Level ${context.characterLevel} ${context.characterClass})
Session Type: ${context.sessionType}
Difficulty: ${context.difficulty}
Theme: ${context.locationTheme}

Provide a 2-paragraph overview with:
1. Session goals and main story beats
2. Expected challenges and pacing

Keep it concise but engaging.`

  return await callChatGPT(prompt)
}

async function generateEncounters(context) {
  const prompt = `Design 2-3 encounters for a Level ${context.characterLevel} Pathfinder 1e character:

Session Type: ${context.sessionType}
Difficulty: ${context.difficulty}
Theme: ${context.locationTheme}

For each encounter, provide:
- Name and brief description
- Challenge Rating (CR)
- Enemy stats or challenge mechanics
- Tactical notes

Format as JSON array.`

  const response = await callChatGPT(prompt)
  return parseEncounters(response)
}

async function generateNPCs(context) {
  const prompt = `Create 2-3 NPCs for a Pathfinder 1e session:

Theme: ${context.locationTheme}
Session Type: ${context.sessionType}
Character Level: ${context.characterLevel}

For each NPC, provide:
- Name and role
- Physical description
- Personality traits
- Motivation/secrets
- How they interact with the story

Format as JSON array.`

  const response = await callChatGPT(prompt)
  return parseNPCs(response)
}

async function generateLocations(context) {
  const prompt = `Design 2-3 locations for a Pathfinder 1e session:

Theme: ${context.locationTheme}
Session Type: ${context.sessionType}
Difficulty: ${context.difficulty}

For each location, provide:
- Name and type
- Detailed description
- Notable features
- Hidden elements or secrets

Format as JSON array.`

  const response = await callChatGPT(prompt)
  return parseLocations(response)
}

async function generatePlotHooks(context) {
  const prompt = `Create 3-4 plot hooks for future sessions based on:

Current Session: ${context.sessionType} in ${context.locationTheme}
Character: Level ${context.characterLevel} ${context.characterClass}

Each hook should:
- Connect to the current session
- Provide future adventure opportunities
- Match the character's capabilities

Return as a simple array of hooks.`

  const response = await callChatGPT(prompt)
  return parsePlotHooks(response)
}

// Helper Functions
async function callChatGPT(prompt) {
  const apiKey = localStorage.getItem('openai-api-key')
  if (!apiKey) {
    throw new Error('OpenAI API key not found')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Pathfinder 1e GM. Create engaging, balanced content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function parseEncounters(response) {
  try {
    // Try to parse as JSON first
    if (response.trim().startsWith('[')) {
      return JSON.parse(response)
    }
    
    // Fallback: parse from text
    const encounters = []
    const lines = response.split('\n')
    let currentEncounter = {}
    
    for (const line of lines) {
      if (line.includes('Name:') || line.includes('**')) {
        if (currentEncounter.name) {
          encounters.push(currentEncounter)
        }
        currentEncounter = {
          name: line.replace(/[*#\-]/g, '').replace('Name:', '').trim(),
          description: '',
          cr: 'TBD',
          tactics: ''
        }
      } else if (line.includes('CR')) {
        currentEncounter.cr = line.match(/CR (\d+)/)?.[1] || 'TBD'
      } else if (line.trim()) {
        currentEncounter.description += line.trim() + ' '
      }
    }
    
    if (currentEncounter.name) {
      encounters.push(currentEncounter)
    }
    
    return encounters
  } catch (error) {
    console.error('Failed to parse encounters:', error)
    return []
  }
}

function parseNPCs(response) {
  try {
    if (response.trim().startsWith('[')) {
      return JSON.parse(response)
    }
    
    // Fallback parsing
    return [
      {
        name: 'Generated NPC',
        role: 'Supporting Character',
        description: response.substring(0, 200) + '...',
        personality: 'To be determined',
        secrets: 'Hidden motivations'
      }
    ]
  } catch (error) {
    return []
  }
}

function parseLocations(response) {
  try {
    if (response.trim().startsWith('[')) {
      return JSON.parse(response)
    }
    
    return [
      {
        name: locationTheme.value || 'Generated Location',
        description: response.substring(0, 300) + '...',
        secrets: 'Hidden elements to discover'
      }
    ]
  } catch (error) {
    return []
  }
}

function parsePlotHooks(response) {
  try {
    if (response.trim().startsWith('[')) {
      return JSON.parse(response)
    }
    
    return response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.?\s*/, '').replace(/^[\-*]\s*/, '').trim())
      .filter(hook => hook.length > 10)
      .slice(0, 4)
  } catch (error) {
    return ['Continue the adventure...']
  }
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

function exportToChatGPT() {
  const sessionExport = `# 🎲 Generated Pathfinder Session

## 📋 Session Overview
${currentSession.value.overview}

## ⚔️ Encounters
${currentSession.value.encounters.map(enc => `
**${enc.name}** (CR ${enc.cr})
${enc.description}
${enc.tactics ? `Tactics: ${enc.tactics}` : ''}
`).join('\n')}

## 👥 NPCs
${currentSession.value.npcs.map(npc => `
**${npc.name}** - ${npc.role}
${npc.description}
Personality: ${npc.personality}
${npc.secrets ? `Secrets: ${npc.secrets}` : ''}
`).join('\n')}

## 🏰 Locations
${currentSession.value.locations.map(loc => `
**${loc.name}**
${loc.description}
${loc.secrets ? `Hidden: ${loc.secrets}` : ''}
`).join('\n')}

## 🎣 Plot Hooks
${currentSession.value.plotHooks.map((hook, i) => `${i + 1}. ${hook}`).join('\n')}

---
Ready to run this session! What would you like to adjust or expand?`

  navigator.clipboard.writeText(sessionExport).then(() => {
    alert('📋 Session exported to clipboard! Paste into ChatGPT.')
  })
}

function saveSession() {
  const sessions = JSON.parse(localStorage.getItem('rpg-narrator-saved-sessions') || '[]')
  const newSession = {
    id: Date.now(),
    name: `${sessionType.value} Session - ${new Date().toLocaleDateString()}`,
    date: new Date().toISOString(),
    type: sessionType.value,
    difficulty: difficulty.value,
    theme: locationTheme.value,
    content: currentSession.value
  }
  
  sessions.unshift(newSession)
  localStorage.setItem('rpg-narrator-saved-sessions', JSON.stringify(sessions.slice(0, 20))) // Keep last 20
  
  alert('💾 Session saved!')
}

function clearSession() {
  currentSession.value = {
    overview: '',
    encounters: [],
    npcs: [],
    locations: [],
    plotHooks: []
  }
}
</script>

<style scoped>
.session-automation {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>