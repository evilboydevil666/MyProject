<template>
  <div class="h-full flex flex-col bg-gray-900 text-white">
    <!-- Header -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <h2 class="text-2xl font-bold text-blue-300 mb-2">🎯 Session Prep Assistant</h2>
      <p class="text-sm text-gray-400">AI-powered session preparation with world building integration</p>
    </div>

    <!-- Session Start Workflow (NEW) -->
    <div v-if="showSessionStartWorkflow" class="flex-1 overflow-auto">
      <div class="p-4 space-y-4">
        <!-- Step 1: Load World Data -->
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700" :class="{ 'border-green-500': worldData }">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <span class="text-2xl">🌍</span>
            Step 1: Load World Data
          </h3>
          
          <div v-if="!worldData" class="space-y-3">
            <button 
              @click="loadWorldBuildingData"
              class="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded w-full"
            >
              📥 Load from World Building
            </button>
            <button 
              @click="loadQuickStart"
              class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded w-full"
            >
              ⚡ Quick Start (No World Data)
            </button>
          </div>
          
          <div v-else class="space-y-2">
            <div class="text-green-400 flex items-center gap-2">
              ✅ World data loaded successfully
            </div>
            <div class="text-sm text-gray-400">
              <div>World: {{ worldData.name }}</div>
              <div>Locations: {{ availableLocations.length }}</div>
              <div>Lore Items: {{ worldData.metadata?.categories?.lore || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Starting Location -->
        <div v-if="worldData || quickStartMode" class="bg-gray-800 rounded-lg p-4 border border-gray-700" :class="{ 'border-green-500': selectedLocation }">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <span class="text-2xl">📍</span>
            Step 2: Select Starting Location
          </h3>
          
          <div v-if="availableLocations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              v-for="location in availableLocations"
              :key="location.id"
              @click="selectLocation(location)"
              :class="[
                'p-3 rounded-lg border-2 text-left transition-all',
                selectedLocation?.id === location.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              ]"
            >
              <h4 class="font-semibold">{{ location.name }}</h4>
              <div class="text-sm text-gray-400 mt-1">
                <span class="capitalize">{{ location.type }}</span>
                <span v-if="location.features?.length" class="ml-2">• {{ location.features.length }} features</span>
              </div>
              <p class="text-xs text-gray-300 mt-2 line-clamp-2">{{ location.description }}</p>
            </button>
          </div>
          
          <div v-else-if="quickStartMode" class="space-y-3">
            <input 
              v-model="customLocation.name"
              placeholder="Location name (e.g., The Rusty Dragon Inn)"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
            <select v-model="customLocation.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="tavern">🍺 Tavern</option>
              <option value="town">🏘️ Town Square</option>
              <option value="wilderness">🌲 Wilderness</option>
              <option value="dungeon">🏚️ Dungeon Entrance</option>
              <option value="road">🛤️ On the Road</option>
            </select>
            <button 
              @click="createCustomLocation"
              :disabled="!customLocation.name"
              class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded w-full"
            >
              Create Location
            </button>
          </div>
        </div>

        <!-- Step 3: Generate Opening Scene -->
        <div v-if="selectedLocation" class="bg-gray-800 rounded-lg p-4 border border-gray-700" :class="{ 'border-green-500': startingScene.description }">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <span class="text-2xl">📜</span>
            Step 3: Generate Opening Scene
          </h3>
          
          <div class="space-y-3">
            <button 
              @click="generateStartingScene"
              :disabled="isGenerating"
              class="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 px-4 py-2 rounded w-full"
            >
              {{ isGenerating ? '✨ Generating Scene...' : '✨ Generate Opening Scene with AI' }}
            </button>
            
            <div v-if="startingScene.description" class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Opening Description</label>
                <textarea
                  v-model="startingScene.description"
                  class="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="6"
                />
              </div>

              <div v-if="startingScene.npcs.length > 0">
                <label class="block text-sm font-medium mb-2">Available NPCs</label>
                <div class="flex flex-wrap gap-2">
                  <div v-for="(npc, idx) in startingScene.npcs" :key="idx" class="px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center gap-1">
                    <span>👤</span>
                    {{ npc.name || npc }}
                  </div>
                </div>
              </div>

              <div v-if="startingScene.hooks.length > 0">
                <label class="block text-sm font-medium mb-2">Adventure Hooks</label>
                <ul class="space-y-1">
                  <li v-for="(hook, idx) in startingScene.hooks" :key="idx" class="text-sm text-gray-300 flex items-start gap-2">
                    <span class="text-blue-400 mt-0.5">•</span>
                    {{ hook }}
                  </li>
                </ul>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Atmosphere</label>
                <input 
                  v-model="startingScene.atmosphere"
                  class="w-full bg-gray-700 border border-gray-600 rounded p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Finalize and Begin -->
        <div v-if="startingScene.description" class="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <span class="text-2xl">🎮</span>
            Step 4: Begin Session
          </h3>
          
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="initializeSession"
                class="bg-green-600 hover:bg-green-500 px-4 py-3 rounded font-semibold"
              >
                🚀 Start Adventure
              </button>
              <button 
                @click="saveSessionSetup"
                class="bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded"
              >
                💾 Save Setup
              </button>
            </div>
            
            <button 
              @click="exportSessionToChatGPT"
              class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded w-full text-sm"
            >
              🌐 Export to ChatGPT for Live Support
            </button>
          </div>
        </div>

        <!-- Session Summary -->
        <div v-if="sessionInitialized" class="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-700/50">
          <h3 class="text-lg font-semibold mb-3 text-green-300">✅ Session Ready!</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">World:</span>
              <span class="ml-2">{{ worldData?.name || 'Custom' }}</span>
            </div>
            <div>
              <span class="text-gray-400">Location:</span>
              <span class="ml-2">{{ selectedLocation.name }}</span>
            </div>
            <div>
              <span class="text-gray-400">Type:</span>
              <span class="ml-2 capitalize">{{ selectedLocation.type }}</span>
            </div>
            <div>
              <span class="text-gray-400">NPCs Ready:</span>
              <span class="ml-2">{{ startingScene.npcs.length }}</span>
            </div>
          </div>
          
          <button 
            @click="goToCharacterView"
            class="mt-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded w-full"
          >
            📖 Go to Character View & Begin
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Prep Tools (Original) -->
    <div v-else>
      <!-- Toggle Button -->
      <div class="p-4 border-b border-gray-700 bg-gray-800/50">
        <button 
          @click="showSessionStartWorkflow = true"
          class="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded w-full font-semibold"
        >
          🌍 Start New Session (World Building Integration)
        </button>
      </div>

      <!-- Quick Prep Form -->
      <div class="p-4 border-b border-gray-700">
        <h3 class="text-lg font-semibold mb-3">⚡ Quick Prep Tools</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Session Type</label>
            <select v-model="sessionType" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="exploration">🗺️ Exploration</option>
              <option value="combat">⚔️ Combat</option>
              <option value="social">👥 Social</option>
              <option value="mystery">🔍 Mystery</option>
              <option value="mixed">🎭 Mixed</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Duration</label>
            <select v-model="sessionDuration" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="short">Short (2-3 hours)</option>
              <option value="medium">Medium (3-4 hours)</option>
              <option value="long">Long (4+ hours)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Difficulty</label>
            <select v-model="difficulty" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="deadly">Deadly</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Session Theme/Location</label>
          <input 
            v-model="sessionTheme" 
            placeholder="e.g., haunted mansion, underground caverns, noble's court"
            class="w-full bg-gray-700 border border-gray-600 rounded p-2"
          />
        </div>

        <div class="flex gap-2">
          <button 
            @click="generateQuickEncounter" 
            :disabled="isGenerating"
            class="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {{ isGenerating ? '⚔️ Generating...' : '⚔️ Quick Encounter' }}
          </button>
          <button 
            @click="generateQuickNPC" 
            :disabled="isGenerating"
            class="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {{ isGenerating ? '👤 Generating...' : '👤 Quick NPC' }}
          </button>
          <button 
            @click="generateSessionOutline" 
            :disabled="isGenerating"
            class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {{ isGenerating ? '📝 Generating...' : '📝 Session Outline' }}
          </button>
        </div>
      </div>

      <!-- Generated Content -->
      <div class="flex-1 overflow-auto p-4">
        <div v-if="generatedContent.length === 0" class="text-center text-gray-500 py-8">
          <h3 class="text-lg mb-2">🎲 Ready to Prep Your Session</h3>
          <p class="text-sm">Use the buttons above to generate encounters, NPCs, or complete session outlines</p>
        </div>

        <div v-for="(content, index) in generatedContent" :key="index" class="mb-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold" :class="content.typeColor">
                {{ content.icon }} {{ content.title }}
              </h3>
              <div class="flex gap-2">
                <button 
                  @click="copyToClipboard(content.fullText, content.title)"
                  class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                >
                  📋 Copy
                </button>
                <button 
                  @click="exportToChatGPT(content)"
                  class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs"
                >
                  🌐 To ChatGPT
                </button>
                <button 
                  @click="removeContent(index)"
                  class="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div class="text-sm bg-gray-900 rounded p-3" v-html="formatContent(content.content)"></div>
            
            <div v-if="content.stats" class="mt-3 text-xs text-gray-400">
              <strong>Stats:</strong> {{ content.stats }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-700">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-400">
            Generated {{ generatedContent.length }} items this session
          </span>
          <div class="flex gap-2">
            <button 
              @click="clearAllContent"
              v-if="generatedContent.length > 0"
              class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs"
            >
              Clear All
            </button>
            <button 
              @click="exportSessionPrep"
              v-if="generatedContent.length > 0"
              class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs"
            >
              📤 Export Session
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { characterState } from '../characterState.js'

// Router
const router = useRouter()
const route = useRoute()

// State
const sessionType = ref('mixed')
const sessionDuration = ref('medium')
const difficulty = ref('moderate')
const sessionTheme = ref('')
const isGenerating = ref(false)
const generatedContent = ref([])

// NEW: Session Start Workflow State
const showSessionStartWorkflow = ref(false)
const worldData = ref(null)
const selectedLocation = ref(null)
const startingScene = ref({
  description: '',
  npcs: [],
  hooks: [],
  atmosphere: ''
})
const sessionInitialized = ref(false)
const quickStartMode = ref(false)
const customLocation = ref({
  name: '',
  type: 'tavern'
})

// Computed
const totalLevel = computed(() => 
  characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
)

const availableLocations = computed(() => {
  if (!worldData.value) return []
  
  // Get locations from world data
  const locations = worldData.value.locations || []
  
  // Add any locations from sessionStorage
  try {
    const sessionLocations = JSON.parse(sessionStorage.getItem('sessionPrepLocations') || '[]')
    locations.push(...sessionLocations)
  } catch (error) {
    console.error('Error loading session locations:', error)
  }
  
  return locations
})

// Character context for AI
const getCharacterContext = () => ({
  name: characterState.name || 'Character',
  level: totalLevel.value,
  classes: characterState.classes.map(c => `${c.className} ${c.level}`).join(', '),
  hp: `${characterState.hp}/${characterState.hpMax}`,
  ac: characterState.ac
})

// Lifecycle
onMounted(() => {
  // Check if coming from World Building
  if (route.query.worldData === 'loaded') {
    showSessionStartWorkflow.value = true
    loadWorldBuildingData()
  }
})

// NEW: Session Start Methods
async function loadWorldBuildingData() {
  try {
    // First check sessionStorage for fresh export
    const exportData = sessionStorage.getItem('worldBuildingExport')
    if (exportData) {
      const parsed = JSON.parse(exportData)
      worldData.value = parsed.worldData
      worldData.value.locations = parsed.locations
      sessionStorage.removeItem('worldBuildingExport') // Clear after use
      return
    }
    
    // Otherwise load from localStorage
    const savedData = localStorage.getItem('worldBuildingData')
    if (savedData) {
      worldData.value = JSON.parse(savedData)
    } else {
      alert('No world data found. Please create content in World Building first.')
    }
  } catch (error) {
    console.error('Error loading world data:', error)
    alert('Error loading world data. Please try again.')
  }
}

function loadQuickStart() {
  quickStartMode.value = true
  worldData.value = {
    name: 'Quick Start Campaign',
    locations: []
  }
}

function selectLocation(location) {
  selectedLocation.value = location
  startingScene.value = {
    description: '',
    npcs: location.npcs || [],
    hooks: [],
    atmosphere: ''
  }
}

function createCustomLocation() {
  if (!customLocation.value.name) return
  
  const location = {
    id: Date.now(),
    name: customLocation.value.name,
    type: customLocation.value.type,
    description: `A ${customLocation.value.type} suitable for starting an adventure`,
    npcs: [],
    features: []
  }
  
  worldData.value.locations.push(location)
  selectLocation(location)
  
  // Reset form
  customLocation.value.name = ''
}

async function generateStartingScene() {
  if (!selectedLocation.value) return
  
  isGenerating.value = true
  
  try {
    const character = getCharacterContext()
    const prompt = `Create an opening scene for a Pathfinder 1e session:

**Character:** ${character.name} (Level ${character.level} ${character.classes})
**Location:** ${selectedLocation.value.name}
**Type:** ${selectedLocation.value.type}
**Description:** ${selectedLocation.value.description}

Provide:
1. **Opening Description** - A vivid 2-3 paragraph scene setting that draws the player in
2. **Available NPCs** - 2-3 NPCs present with names, brief descriptions, and potential roles
3. **Adventure Hooks** - 3 different hooks of varying urgency (immediate, short-term, long-term)
4. **Atmosphere** - The current mood and sensory details (sights, sounds, smells)
5. **Initial Situation** - What's happening as the scene opens

Make it engaging and ready for immediate play.`

    const content = await callChatGPT(prompt)
    
    // Parse the response
    parseStartingScene(content)
    
  } catch (error) {
    console.error('Error generating scene:', error)
    alert('Error generating scene. Please check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

function parseStartingScene(content) {
  // Extract sections from the generated content
  const sections = content.split(/\*\*[^*]+\*\*/g)
  
  // Basic parsing - in production, use more sophisticated parsing
  startingScene.value = {
    description: extractSection(content, 'Opening Description') || content.substring(0, 500),
    npcs: extractNPCs(content),
    hooks: extractHooks(content),
    atmosphere: extractSection(content, 'Atmosphere') || 'Mysterious and inviting'
  }
}

function extractSection(content, sectionName) {
  const regex = new RegExp(`\\*\\*${sectionName}\\*\\*[:\\s]*([^\\*]+)`, 'i')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

function extractNPCs(content) {
  const npcSection = extractSection(content, 'Available NPCs|NPCs')
  if (!npcSection) return []
  
  const npcs = []
  const lines = npcSection.split('\n')
  
  lines.forEach(line => {
    if (line.includes('-') || line.match(/^\d+\./)) {
      const npcText = line.replace(/^[\d\-.\s]+/, '').trim()
      if (npcText) {
        const [name, ...descParts] = npcText.split(/[,-]/)
        npcs.push({
          name: name.trim(),
          description: descParts.join(',').trim()
        })
      }
    }
  })
  
  return npcs.slice(0, 3) // Limit to 3 NPCs
}

function extractHooks(content) {
  const hooksSection = extractSection(content, 'Adventure Hooks|Hooks')
  if (!hooksSection) return []
  
  const hooks = []
  const lines = hooksSection.split('\n')
  
  lines.forEach(line => {
    if (line.includes('-') || line.match(/^\d+\./)) {
      const hookText = line.replace(/^[\d\-.\s]+/, '').trim()
      if (hookText) hooks.push(hookText)
    }
  })
  
  return hooks.slice(0, 3) // Limit to 3 hooks
}

function initializeSession() {
  if (!worldData.value || !selectedLocation.value || !startingScene.value.description) {
    alert('Please complete all steps before starting the session')
    return
  }
  
  const sessionData = {
    world: {
      name: worldData.value.name,
      setting: worldData.value.setting || 'Fantasy'
    },
    location: selectedLocation.value,
    scene: startingScene.value,
    metadata: {
      sessionNumber: (parseInt(localStorage.getItem('sessionCount') || '0') + 1),
      startTime: new Date().toISOString(),
      characterLevel: totalLevel.value
    }
  }
  
  // Save to localStorage
  localStorage.setItem('activeSession', JSON.stringify(sessionData))
  localStorage.setItem('sessionCount', sessionData.metadata.sessionNumber.toString())
  
  // Save to sessionStorage for immediate use
  sessionStorage.setItem('currentLocation', selectedLocation.value.name)
  sessionStorage.setItem('openingScene', startingScene.value.description)
  
  sessionInitialized.value = true
  
  // Update game state
  if (window.gameState) {
    window.gameState.currentLocation = selectedLocation.value.name
    window.gameState.activeSession = sessionData
  }
}

function saveSessionSetup() {
  const setup = {
    worldData: worldData.value,
    selectedLocation: selectedLocation.value,
    startingScene: startingScene.value,
    savedAt: new Date().toISOString()
  }
  
  localStorage.setItem('sessionSetup', JSON.stringify(setup))
  alert('Session setup saved!')
}

async function exportSessionToChatGPT() {
  const character = getCharacterContext()
  const exportText = `# Pathfinder 1e Session Start

**World:** ${worldData.value?.name || 'Custom Campaign'}
**Character:** ${character.name} (Level ${character.level} ${character.classes})
**Location:** ${selectedLocation.value.name} (${selectedLocation.value.type})

## Opening Scene
${startingScene.value.description}

## Available NPCs
${startingScene.value.npcs.map(npc => `- ${npc.name}: ${npc.description || 'Present at location'}`).join('\n')}

## Adventure Hooks
${startingScene.value.hooks.map((hook, i) => `${i + 1}. ${hook}`).join('\n')}

## Atmosphere
${startingScene.value.atmosphere}

---
You are the GM for this Pathfinder 1e session. The player is ready to begin. Start by describing the scene and wait for their action.`

  copyToClipboard(exportText, 'Session Start')
  
  const action = confirm(
    'Session start copied to clipboard!\n\n' +
    'Click OK to open ChatGPT in a new tab.'
  )
  
  if (action) {
    window.open('https://chat.openai.com', '_blank')
  }
}

function goToCharacterView() {
  router.push({
    path: '/',
    query: { sessionStart: 'true' }
  })
}

// Original methods for quick prep
async function generateQuickEncounter() {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const character = getCharacterContext()
    const prompt = `Generate a balanced Pathfinder 1e encounter for a Level ${character.level} character:

**Character:** ${character.name} (${character.classes})
**Session Type:** ${sessionType.value}
**Difficulty:** ${difficulty.value}
**Theme:** ${sessionTheme.value || 'fantasy adventure'}

**Provide:**
1. Encounter name and brief setup
2. Enemy stats (AC, HP, attacks, special abilities)
3. Tactical notes for running the encounter
4. Environmental factors or special rules
5. Appropriate treasure/XP

Format for easy reference during play.`

    const content = await callChatGPT(prompt)
    
    addGeneratedContent({
      type: 'encounter',
      title: 'Combat Encounter',
      icon: '⚔️',
      typeColor: 'text-red-400',
      content: content,
      fullText: content
    })

  } catch (error) {
    console.error('Error generating encounter:', error)
    alert('Error generating encounter. Check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

async function generateQuickNPC() {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const character = getCharacterContext()
    const prompt = `Create an interesting NPC for a Pathfinder 1e session:

**Campaign Context:**
- Character Level: ${character.level}
- Session Type: ${sessionType.value}
- Theme: ${sessionTheme.value || 'fantasy adventure'}

**NPC Details Needed:**
1. Name, race, and appearance
2. Personality and mannerisms
3. Role in the story/session
4. Motivation and secrets
5. Sample dialogue
6. Relevant stats if needed for interaction
7. Plot hooks they might provide

Make them memorable and useful for the current session type.`

    const content = await callChatGPT(prompt)
    
    addGeneratedContent({
      type: 'npc',
      title: 'NPC Character',
      icon: '👤',
      typeColor: 'text-green-400',
      content: content,
      fullText: content
    })

  } catch (error) {
    console.error('Error generating NPC:', error)
    alert('Error generating NPC. Check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

async function generateSessionOutline() {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const character = getCharacterContext()
    const prompt = `Create a session outline for Pathfinder 1e:

**Session Parameters:**
- Character: ${character.name} (Level ${character.level} ${character.classes})
- Type: ${sessionType.value}
- Duration: ${sessionDuration.value}
- Difficulty: ${difficulty.value}
- Theme: ${sessionTheme.value || 'fantasy adventure'}

**Outline Structure:**
1. **Opening Hook** (5-10 minutes)
2. **Main Activities** (2-3 major scenes)
3. **Encounters** (combat, social, exploration as appropriate)
4. **Pacing Notes** (when to have breaks, tension points)
5. **Contingency Plans** (if players go off-script)
6. **Session Conclusion** (hooks for next time)

Tailor everything for a solo Level ${character.level} character.`

    const content = await callChatGPT(prompt)
    
    addGeneratedContent({
      type: 'outline',
      title: 'Session Outline',
      icon: '📝',
      typeColor: 'text-blue-400',
      content: content,
      fullText: content
    })

  } catch (error) {
    console.error('Error generating session outline:', error)
    alert('Error generating session outline. Check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

// Utility functions
async function callChatGPT(prompt) {
  const apiKey = localStorage.getItem('openai-api-key')
  if (!apiKey) {
    throw new Error('No OpenAI API key found. Please set it in Settings.')
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
          content: 'You are an expert Pathfinder 1e Game Master. Create practical, ready-to-use content for actual play.'
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
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function addGeneratedContent(content) {
  generatedContent.value.unshift({
    ...content,
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString()
  })
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/\n/g, '<br>')
}

function copyToClipboard(text, title) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${title} copied to clipboard!`)
  }).catch(err => {
    console.error('Copy failed:', err)
    alert('Copy failed - please copy manually')
  })
}

function exportToChatGPT(content) {
  const character = getCharacterContext()
  const exportText = `# Pathfinder 1e ${content.title}

**Character Context:**
- ${character.name} (Level ${character.level})
- Classes: ${character.classes}
- Current HP: ${character.hp}

**Generated Content:**
${content.fullText}

---
Continue this Pathfinder session with this ${content.type}. What happens next?`

  copyToClipboard(exportText, `${content.title} for ChatGPT`)
}

function exportSessionPrep() {
  const character = getCharacterContext()
  const sessionSummary = `# Pathfinder 1e Session Prep

**Character:** ${character.name} (Level ${character.level})
**Session Type:** ${sessionType.value}
**Duration:** ${sessionDuration.value}
**Theme:** ${sessionTheme.value || 'Fantasy Adventure'}

## Generated Content:

${generatedContent.value.map(content => `
### ${content.icon} ${content.title}
${content.fullText}
`).join('\n---\n')}

---
Ready to run this Pathfinder session! Use ChatGPT for live support during play.`

  copyToClipboard(sessionSummary, 'Complete Session Prep')
}

function removeContent(index) {
  generatedContent.value.splice(index, 1)
}

function clearAllContent() {
  if (confirm('Clear all generated content?')) {
    generatedContent.value = []
  }
}
</script>

<style scoped>
/* Smooth transitions for generated content */
.bg-gray-800 {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>