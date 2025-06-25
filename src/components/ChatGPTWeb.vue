<template>
  <div class="h-full flex flex-col bg-gray-900 text-white">
    <!-- Gameplay Mode Toggle -->
    <div class="bg-gray-700 p-2 border-b border-gray-600 flex justify-between items-center">
      <h2 class="text-lg font-bold text-green-300">🤖 AI Game Master Assistant</h2>
      <label class="flex items-center gap-2">
        <input 
          type="checkbox" 
          v-model="gameplayMode"
          class="rounded"
        />
        <span class="text-sm">Gameplay Mode (Hide AI)</span>
      </label>
    </div>

    <!-- Main Content (Hidden in Gameplay Mode) -->
    <div v-if="!gameplayMode" class="flex-1 flex flex-col">
      <!-- Enhanced Header with Mode Toggle -->
      <div class="bg-gray-800 p-4 border-b border-gray-700">
        <div class="flex justify-between items-center mb-3">
          <!-- Mode Toggle -->
          <div class="flex bg-gray-700 rounded-lg p-1">
            <button
              @click="setMode('local')"
              :class="[
                'px-3 py-1 rounded text-sm transition-all',
                currentMode === 'local' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              ]"
            >
              🔧 Local API
            </button>
            <button
              @click="setMode('web-plus')"
              :class="[
                'px-3 py-1 rounded text-sm transition-all',
                currentMode === 'web-plus' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              ]"
            >
              🧠 ChatGPT Plus
            </button>
            <button
              @click="setMode('embedded')"
              :class="[
                'px-3 py-1 rounded text-sm transition-all',
                currentMode === 'embedded' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              ]"
            >
              🌐 Embedded ChatGPT
            </button>
          </div>

          <!-- Quick Actions for All Modes -->
          <div class="flex gap-2">
            <button 
              @click="sendToNarrative"
              v-if="lastAIResponse"
              class="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm"
              title="Send last response to Narrative Chat"
            >
              📖 To Narrative
            </button>
          </div>
        </div>

        <!-- Mode-specific Header Content -->
        <div v-if="currentMode === 'local'">
          <!-- API Key Setup -->
          <div v-if="!hasApiKey" class="bg-yellow-900 border border-yellow-600 rounded p-3 mb-4">
            <h3 class="font-semibold mb-2">⚙️ Setup Required</h3>
            <p class="text-sm mb-2">Enter your OpenAI API key for local processing:</p>
            <div class="flex gap-2">
              <input 
                v-model="tempApiKey" 
                type="password" 
                placeholder="sk-..." 
                class="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-white"
                @keyup.enter="setApiKey"
              />
              <button @click="setApiKey" class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded">
                Set Key
              </button>
            </div>
          </div>

          <!-- Local API Settings -->
          <div v-if="hasApiKey" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label class="block mb-1">Model:</label>
              <select v-model="selectedModel" class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1">
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fastest)</option>
                <option value="gpt-4">GPT-4 (Best Quality)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo (Balanced)</option>
              </select>
            </div>
            <div>
              <label class="block mb-1">Temperature: {{ temperature }}</label>
              <input 
                v-model.number="temperature" 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                class="w-full"
              />
            </div>
            <div>
              <label class="flex items-center gap-2 mb-1">
                <input 
                  type="checkbox" 
                  v-model="autoInventoryEnabled"
                  class="rounded"
                />
                <span>Auto Inventory</span>
              </label>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400">
                Cost: ${{ apiCost.toFixed(4) }}
              </div>
              <button @click="clearApiKey" class="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs">
                Clear Key
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="currentMode === 'web-plus'">
          <div class="bg-purple-900 border border-purple-600 rounded p-3">
            <p class="text-sm text-purple-200 mb-2">
              <strong>ChatGPT Plus Mode:</strong> Use structured exports to leverage persistent memory and unlimited context
            </p>
            
            <!-- ChatGPT Project Configuration -->
            <div v-if="!chatGptProjectId" class="bg-purple-800 border border-purple-500 rounded p-2 mt-2">
              <h4 class="font-semibold text-sm mb-1">📁 Configure ChatGPT Project</h4>
              <div class="flex gap-2">
                <input 
                  v-model="tempProjectId" 
                  placeholder="Enter your project ID (e.g., proj_ABC123xyz)" 
                  class="flex-1 p-1 bg-purple-900 border border-purple-600 rounded text-sm text-white"
                  @keyup.enter="setProjectId"
                />
                <button @click="setProjectId" class="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm">
                  Set Project
                </button>
              </div>
              <p class="text-xs text-purple-300 mt-1">
                Get your project ID from the URL when viewing your RPG project in ChatGPT
              </p>
            </div>
            
            <div v-else class="bg-purple-800 border border-purple-500 rounded p-2 mt-2">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-semibold text-sm">📁 RPG Project Connected</h4>
                  <p class="text-xs text-purple-300">ID: {{ chatGptProjectId }}</p>
                </div>
                <button @click="clearProjectId" class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentMode === 'embedded'">
          <div class="bg-green-900 border border-green-600 rounded p-3">
            <p class="text-sm text-green-200 mb-2">
              <strong>Embedded Mode:</strong> ChatGPT interface embedded below
            </p>
            <div class="flex gap-2">
              <button 
                @click="refreshEmbedded"
                class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
              >
                🔄 Refresh
              </button>
              <button 
                @click="openInNewTab"
                class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
              >
                🔗 Open in New Tab
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LOCAL API MODE -->
      <div v-if="currentMode === 'local'" class="flex-1 flex flex-col">
        <!-- Chat Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatContainer">
          <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
            <h3 class="text-lg mb-2">🎲 Welcome to your AI Game Master!</h3>
            <p class="mb-4">I can help with Pathfinder 1e rules, encounters, NPCs, and more.</p>
            <div class="flex flex-wrap gap-2 justify-center">
              <button v-for="starter in starterPrompts" :key="starter" 
                      @click="quickPrompt(starter)" 
                      class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm">
                {{ starter }}
              </button>
            </div>
          </div>

          <div v-for="(message, index) in messages" :key="index" class="flex" 
               :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[80%] rounded-lg p-3" 
                 :class="{
                   'bg-blue-600 text-white': message.role === 'user',
                   'bg-gray-700 text-gray-100': message.role === 'assistant',
                   'bg-green-800 text-green-100 border border-green-600': message.role === 'system'
                 }">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold">
                  {{ message.role === 'user' ? '🧙‍♂️ You' : 
                     message.role === 'system' ? '⚙️ System' : '🤖 GM Assistant' }}
                </span>
                <span class="text-xs opacity-60">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div v-html="formatMessage(message.content)"></div>
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-start">
            <div class="bg-gray-700 text-gray-100 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <div class="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="bg-gray-800 p-4 border-t border-gray-700">
          <!-- Quick Action Buttons -->
          <div v-if="hasApiKey" class="flex flex-wrap gap-2 mb-3">
            <button v-for="action in quickActions" :key="action.label"
                    @click="quickPrompt(action.prompt)" 
                    :class="action.color + ' hover:opacity-80 px-2 py-1 rounded text-xs'"
                    :title="action.desc">
              {{ action.label }}
            </button>
            <button @click="clearChat" class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs">
              Clear Chat
            </button>
          </div>

          <!-- Input -->
          <div class="flex gap-2">
            <input 
              v-model="userInput" 
              @keyup.enter="sendMessage"
              :disabled="!hasApiKey || isLoading"
              placeholder="Ask about Pathfinder rules, request NPCs, encounters..."
              class="flex-1 p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 disabled:opacity-50"
            />
            <button 
              @click="sendMessage" 
              :disabled="!hasApiKey || isLoading || !userInput.trim()"
              class="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded font-semibold">
              Send
            </button>
          </div>
        </div>
      </div>

      <!-- CHATGPT PLUS MODE -->
      <div v-else-if="currentMode === 'web-plus'" class="flex-1 flex flex-col">
        <!-- Campaign Memory Section -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold mb-3 text-purple-300">🧠 Campaign Memory</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button 
              @click="setupCampaignMemory" 
              class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded"
            >
              🎲 Initialize Campaign Memory
            </button>
            <button 
              @click="updateCampaignMemory" 
              class="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded"
            >
              📊 Update Session Progress
            </button>
          </div>
          
          <div class="text-xs text-gray-400 bg-gray-800 p-2 rounded">
            <strong>Setup once:</strong> Initialize creates persistent memory in ChatGPT Plus. 
            Update after each session to maintain continuity.
          </div>
        </div>

        <!-- Quick Context Exports -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold mb-3 text-green-300">⚡ Quick Context</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button 
              @click="exportQuickContext" 
              class="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
              title="Current character status"
            >
              📤 Current Status
            </button>
            <button 
              @click="exportLastAction" 
              class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm"
              title="Recent narrative action"
            >
              🎬 Last Action
            </button>
            <button 
              @click="exportFullCharacter" 
              class="bg-yellow-600 hover:bg-yellow-500 px-3 py-2 rounded text-sm"
              title="Complete character sheet"
            >
              📋 Full Character
            </button>
            <button 
              @click="exportInventoryContext" 
              class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm"
              title="Current inventory and wealth"
            >
              🎒 Inventory
            </button>
          </div>
        </div>

        <!-- Conversation Starters -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold mb-3 text-blue-300">🎯 Conversation Starters</h3>
          
          <div class="grid grid-cols-1 gap-2">
            <button 
              @click="startConversation('session-planning')" 
              class="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm text-left"
            >
              📝 <strong>Session Planning</strong> - Design encounters, NPCs, story progression
            </button>
            <button 
              @click="startConversation('live-support')" 
              class="bg-red-600 hover:bg-red-500 px-3 py-2 rounded text-sm text-left"
            >
              ⚡ <strong>Live Game Support</strong> - Quick help during actual play
            </button>
            <button 
              @click="startConversation('character-development')" 
              class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm text-left"
            >
              📈 <strong>Character Development</strong> - Advancement and roleplay growth
            </button>
            <button 
              @click="startConversation('world-building')" 
              class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm text-left"
            >
              🌍 <strong>World Building</strong> - Locations, politics, lore development
            </button>
          </div>
        </div>

        <!-- Scenario Templates -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold mb-3 text-yellow-300">🎪 Content Templates</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button 
              @click="useTemplate('encounter-design')" 
              class="bg-red-600 hover:bg-red-500 px-3 py-2 rounded text-sm text-left"
            >
              ⚔️ Design Encounter
            </button>
            <button 
              @click="useTemplate('npc-creation')" 
              class="bg-yellow-600 hover:bg-yellow-500 px-3 py-2 rounded text-sm text-left"
            >
              👤 Create NPC
            </button>
            <button 
              @click="useTemplate('location-building')" 
              class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm text-left"
            >
              🏰 Build Location
            </button>
            <button 
              @click="useTemplate('mystery-creation')" 
              class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm text-left"
            >
              🔍 Create Mystery
            </button>
          </div>
        </div>

        <!-- Recent Exports History -->
        <div class="flex-1 p-4 overflow-y-auto">
          <h3 class="text-lg font-semibold mb-3 text-gray-300">📋 Recent Exports</h3>
          
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div 
              v-for="exportItem in recentExports" 
              :key="exportItem.id"
              class="flex justify-between items-center bg-gray-800 p-3 rounded"
            >
              <div>
                <div class="font-medium">{{ exportItem.type }}</div>
                <div class="text-xs text-gray-400">{{ formatTime(exportItem.timestamp) }}</div>
              </div>
              <button 
                @click="copyExport(exportItem)" 
                class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
              >
                📋 Copy
              </button>
            </div>
          </div>
          
          <div v-if="recentExports.length === 0" class="text-gray-500 text-center py-8">
            No exports yet. Use the buttons above to create structured prompts for ChatGPT Plus.
          </div>
        </div>

        <!-- ChatGPT Plus Link -->
        <div class="p-4 border-t border-gray-700 text-center">
          <div class="flex gap-2 justify-center">
            <button 
              @click="openChatGPTProject('new')"
              class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-6 py-3 rounded-lg inline-block text-lg font-semibold transition-all"
            >
              🌐 New Chat in Project
            </button>
            <button 
              @click="openChatGPTProject('continue')"
              class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-lg inline-block text-lg font-semibold transition-all"
            >
              📝 Continue in Project
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2">
            {{ chatGptProjectId ? 'Opens directly in your RPG project' : 'Opens ChatGPT Plus (configure project above)' }}
          </p>
        </div>
      </div>

      <!-- EMBEDDED CHATGPT MODE -->
      <div v-if="currentMode === 'embedded'" class="flex-1 flex flex-col">
        <div class="flex-1 relative">
          <iframe
            ref="chatGPTFrame"
            src="https://chat.openai.com"
            class="w-full h-full"
            :style="{ 
              border: 'none',
              filter: gameplayMode ? 'blur(8px)' : 'none'
            }"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
          
          <!-- Overlay when iframe can't load -->
          <div v-if="embedError" class="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div class="text-center p-8">
              <p class="text-red-400 mb-4">⚠️ Cannot embed ChatGPT directly due to security restrictions</p>
              <button 
                @click="openInNewTab"
                class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded"
              >
                Open ChatGPT in New Tab
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gameplay Mode Message -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <p class="text-2xl mb-4">🎮 Gameplay Mode Active</p>
        <p class="text-gray-400 mb-6">AI Assistant is hidden during gameplay</p>
        <button 
          @click="gameplayMode = false"
          class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded"
        >
          Return to AI Assistant
        </button>
      </div>
    </div>

    <!-- Success/Error Notifications -->
    <div 
      v-if="showNotification" 
      class="fixed top-4 right-4 border rounded-lg p-3 z-50 transition-all"
      :class="notificationType === 'success' ? 'bg-green-800 border-green-600' : 'bg-red-800 border-red-600'"
    >
      {{ notificationType === 'success' ? '✅' : '❌' }} {{ notificationMessage }}
    </div>

    <!-- Inventory Change Notifications -->
    <InventoryNotification 
      ref="inventoryNotifications"
      :auto-apply-enabled="autoInventoryEnabled"
      :auto-apply-delay="autoInventoryDelay"
      @changes-applied="onInventoryChangesApplied"
      @changes-rejected="onInventoryChangesRejected"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { characterState } from '../characterState.js'
import { InventoryParser } from '../utils/InventoryParser.js'
import InventoryNotification from './inventorynotification.vue'

// ===== NEW STATE =====
const gameplayMode = ref(false)
const currentMode = ref('local') // 'local', 'web-plus', or 'embedded'
const embedError = ref(false)
const chatGPTFrame = ref(null)
const lastAIResponse = ref('')

// ===== EXISTING STATE (keeping all your original state) =====
const hasApiKey = ref(false)
const tempApiKey = ref('')
const selectedModel = ref('gpt-3.5-turbo')
const temperature = ref(0.7)
const autoInventoryEnabled = ref(true)
const autoInventoryDelay = ref(10)

// ChatGPT Project Integration
const chatGptProjectId = ref('')
const tempProjectId = ref('')

// Local API Chat State
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
const inventoryNotifications = ref(null)
const apiCost = ref(0)

// Web Plus State
const recentExports = ref([])
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')

// ===== COMPUTED =====
const totalLevel = computed(() => 
  characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
)

// ===== CONSTANTS =====
const starterPrompts = [
  'Generate a random encounter for my level',
  'Create an interesting NPC',
  'Describe a tavern setting',
  'Explain combat maneuver rules'
]

const quickActions = [
  { label: '🎲 Encounter', prompt: 'Generate a balanced encounter for my current level', color: 'bg-purple-600', desc: 'Generate random encounter' },
  { label: '🏛️ Location', prompt: 'Describe an interesting location for exploration', color: 'bg-blue-600', desc: 'Create location' },
  { label: '👤 NPC', prompt: 'Create a memorable NPC with personality and backstory', color: 'bg-green-600', desc: 'Generate NPC' },
  { label: '💰 Loot', prompt: 'Generate appropriate treasure for my party level', color: 'bg-yellow-600', desc: 'Generate loot' },
  { label: '📖 Rules', prompt: 'I need help with a Pathfinder 1e rule or mechanic', color: 'bg-red-600', desc: 'Rules clarification' }
]

// ===== LIFECYCLE =====
onMounted(() => {
  checkApiKey()
  loadSettings()
  loadRecentExports()
  loadProjectId()
  
  // Load mode preference
  const savedMode = localStorage.getItem('rpg-narrator-chat-mode')
  if (savedMode) {
    currentMode.value = savedMode
  }
  
  // Load gameplay mode preference
  const savedGameplayMode = localStorage.getItem('rpg-narrator-gameplay-mode')
  if (savedGameplayMode) {
    gameplayMode.value = savedGameplayMode === 'true'
  }
  
  // Check if iframe will work
  if (currentMode.value === 'embedded') {
    checkEmbedCapability()
  }
})

// ===== NEW FUNCTIONS =====
function sendToNarrative() {
  if (lastAIResponse.value) {
    // Emit event to parent or use a global event bus to send to NarrativeChat
    const narrativeContent = extractNarrativeContent(lastAIResponse.value)
    
    // You would emit this to your parent component or use a store
    // For now, just show a success message
    showSuccess('Content sent to Narrative Chat')
    
    // Example of how you might emit to parent:
    // emit('send-to-narrative', narrativeContent)
  }
}

function extractNarrativeContent(content) {
  // Extract dialogue, descriptions, and narrative portions
  const narrative = {
    type: 'ai-generated',
    content: content,
    timestamp: Date.now(),
    segments: []
  }
  
  // Extract dialogue
  const dialogueRegex = /"([^"]+)"/g
  let match
  while ((match = dialogueRegex.exec(content)) !== null) {
    narrative.segments.push({
      type: 'dialogue',
      content: match[1]
    })
  }
  
  // Extract descriptions
  const lines = content.split('\n').filter(line => {
    line = line.trim()
    return line.length > 0 && 
           !line.startsWith('*') &&
           !line.includes(':') &&
           !line.match(/^\d+\./)
  })
  
  lines.forEach(line => {
    if (!line.includes('"')) {
      narrative.segments.push({
        type: 'narration',
        content: line
      })
    }
  })
  
  return narrative
}

function refreshEmbedded() {
  if (chatGPTFrame.value) {
    chatGPTFrame.value.src = chatGPTFrame.value.src
  }
}

function openInNewTab() {
  let url = 'https://chat.openai.com'
  if (chatGptProjectId.value) {
    url += `/?project=${chatGptProjectId.value}`
  }
  window.open(url, '_blank')
}

function checkEmbedCapability() {
  // ChatGPT will likely block iframe embedding, but we'll try
  nextTick(() => {
    if (chatGPTFrame.value) {
      chatGPTFrame.value.onload = () => {
        embedError.value = false
      }
      chatGPTFrame.value.onerror = () => {
        embedError.value = true
      }
    }
  })
}

// Watch for mode changes
watch(currentMode, (newMode) => {
  if (newMode === 'embedded') {
    checkEmbedCapability()
  }
})

// Watch for gameplay mode changes
watch(gameplayMode, (newVal) => {
  localStorage.setItem('rpg-narrator-gameplay-mode', newVal.toString())
})

// ===== MODE MANAGEMENT (Updated) =====
function setMode(mode) {
  currentMode.value = mode
  localStorage.setItem('rpg-narrator-chat-mode', mode)
  
  if (mode === 'local' && !hasApiKey.value) {
    showNotification.value = true
    notificationMessage.value = 'API key required for local mode'
    notificationType.value = 'error'
    setTimeout(() => showNotification.value = false, 3000)
  }
  
  if (mode === 'embedded') {
    embedError.value = false
    nextTick(() => checkEmbedCapability())
  }
}

// ===== CHATGPT PLUS MODE FUNCTIONS =====
function setupCampaignMemory() {
  const memoryPrompt = generateCampaignMemoryPrompt()
  copyToClipboard(memoryPrompt, 'Campaign Memory Setup')
  addToRecentExports('Campaign Memory Setup', memoryPrompt)
}

function updateCampaignMemory() {
  const updatePrompt = generateMemoryUpdatePrompt()
  copyToClipboard(updatePrompt, 'Memory Update')
  addToRecentExports('Memory Update', updatePrompt)
}

function exportQuickContext() {
  const context = `🎲 **QUICK STATUS UPDATE**

**Character:** ${characterState.name} - Level ${totalLevel.value}
**Current HP:** ${characterState.hp}/${characterState.hpMax}
**Location:** [Current location]
**Last Action:** [Describe recent action]

Continue our Pathfinder campaign with this context.`

  copyToClipboard(context, 'Quick Context')
  addToRecentExports('Quick Context', context)
}

function exportLastAction() {
  const context = `🎬 **CONTINUING STORY**

**Previous Action:** [Most recent player action]

**Character Status:**
- ${characterState.name}: ${characterState.hp}/${characterState.hpMax} HP
- Equipment: ${characterState.inventory.slice(0, 3).map(i => i.name).join(', ')}

What happens next in our adventure?`

  copyToClipboard(context, 'Story Continuation')
  addToRecentExports('Last Action', context)
}

function exportFullCharacter() {
  const fullContext = generateFullCharacterContext()
  copyToClipboard(fullContext, 'Full Character Sheet')
  addToRecentExports('Full Character', fullContext)
}

function exportInventoryContext() {
  const inventoryContext = `🎒 **INVENTORY & WEALTH**

**Equipment:**
${characterState.inventory.map(item => `- ${item.name}${item.notes ? ' (' + item.notes + ')' : ''}`).join('\n')}

**Wealth:** ${characterState.money.pp}pp, ${characterState.money.gp}gp, ${characterState.money.sp}sp, ${characterState.money.cp}cp

**Character:** ${characterState.name} (Level ${totalLevel.value})

Use this inventory context for our Pathfinder session.`

  copyToClipboard(inventoryContext, 'Inventory Context')
  addToRecentExports('Inventory', inventoryContext)
}

function startConversation(type) {
  const starter = getConversationStarter(type)
  copyToClipboard(starter, `${type} conversation`)
  addToRecentExports(formatExportType(type), starter)
  
  // Open ChatGPT project after copying
  if (chatGptProjectId.value) {
    setTimeout(() => openChatGPTProject('new'), 500)
  }
}

function useTemplate(templateType) {
  const template = getScenarioTemplate(templateType)
  copyToClipboard(template, `${templateType} template`)
  addToRecentExports(formatExportType(templateType), template)
  
  // Open ChatGPT project after copying
  if (chatGptProjectId.value) {
    setTimeout(() => openChatGPTProject('new'), 500)
  }
}

// ===== PROMPT GENERATORS =====
function generateCampaignMemoryPrompt() {
  return `🎲 **PATHFINDER 1E CAMPAIGN - PERSISTENT MEMORY**

Remember these details for ALL future conversations in this project:

**📋 CHARACTER:**
- **Name:** ${characterState.name || 'Unnamed Character'}
- **Race:** ${characterState.race || 'Unknown'}
- **Classes:** ${characterState.classes.map(c => `${c.className} ${c.level}`).join(', ') || 'Level 1'}
- **Total Level:** ${totalLevel.value}
- **Alignment:** ${characterState.alignment || 'Unknown'}

**⚔️ COMBAT STATS:**
- **HP:** ${characterState.hp}/${characterState.hpMax}
- **AC:** ${characterState.ac} (Touch: ${characterState.touchAC}, Flat: ${characterState.flatAC})
- **Saves:** Fort +${characterState.saves.fort}, Ref +${characterState.saves.ref}, Will +${characterState.saves.will}

**🎯 KEY SKILLS:**
${characterState.skills.filter(s => s.rank > 0).map(s => 
  `- ${s.name}: +${s.rank + calculateAbilityMod(s.ability)}`
).join('\n') || '- No skills with ranks'}

**🎒 EQUIPMENT:**
${characterState.inventory.slice(0, 8).map(item => `- ${item.name}`).join('\n')}

**💰 WEALTH:** ${characterState.money.pp}pp, ${characterState.money.gp}gp, ${characterState.money.sp}sp, ${characterState.money.cp}cp

---

**🤖 YOUR ROLE:**
1. Remember this character permanently
2. Generate appropriate challenges for Level ${totalLevel.value}
3. Maintain story continuity across conversations
4. Provide Pathfinder 1e expertise and creative content

Ready to collaborate on our campaign!`
}

function generateMemoryUpdatePrompt() {
  return `📝 **CAMPAIGN MEMORY UPDATE**

Update your memory with recent developments:

**📊 CHARACTER CHANGES:**
- Current Level: ${totalLevel.value}
- Current HP: ${characterState.hp}/${characterState.hpMax}
- New Equipment: [List recent acquisitions]

**🎭 STORY DEVELOPMENTS:**
[Summarize last session events]

**👥 NEW NPCS:**
[Characters encountered]

**🗺️ LOCATIONS VISITED:**
[New places explored]

**📜 PLOT PROGRESS:**
[Story advancement]

Remember these updates for campaign continuity.`
}

function getConversationStarter(type) {
  const starters = {
    'session-planning': `🎯 **SESSION PLANNING**

Planning our next session for ${characterState.name} (Level ${totalLevel.value}).

**Focus Areas:**
- [ ] Balanced encounters for solo character
- [ ] Memorable NPCs with clear motivations
- [ ] Story progression and plot development
- [ ] Environmental challenges and exploration
- [ ] Character growth opportunities

What should we develop first for an engaging session?`,

    'live-support': `⚡ **LIVE GAME SUPPORT**

Currently running our session with ${characterState.name}:

**Current Status:**
- Level ${totalLevel.value}, ${characterState.hp}/${characterState.hpMax} HP
- Situation: [Describe current scene]

**Need help with:**
- [ ] Rules clarification
- [ ] NPC improvisation
- [ ] Consequence suggestions
- [ ] Environmental descriptions
- [ ] Tactical options

Ready for quick GM assistance!`,

    'character-development': `📈 **CHARACTER DEVELOPMENT**

Working on ${characterState.name}'s growth:

**Current Build:**
- Level ${totalLevel.value} ${characterState.classes.map(c => `${c.className}`).join('/')}
- Key strengths: [Character's best abilities]

**Development Goals:**
- [ ] Next level feat selection
- [ ] Roleplay expansion opportunities
- [ ] Equipment upgrade planning
- [ ] Character arc progression
- [ ] Skill development strategy

How can we make this character more engaging?`,

    'world-building': `🌍 **WORLD BUILDING**

Expanding our campaign world:

**Current Setting:**
- Character: ${characterState.name} (Level ${totalLevel.value})
- Established elements: [From previous conversations]

**Development Areas:**
- [ ] Political intrigue and factions
- [ ] Historical events and mysteries
- [ ] Cultural details and societies
- [ ] Economic systems and trade
- [ ] Geographic features and threats

Where should we focus our world-building?`
  }

  return starters[type] || starters['session-planning']
}

function getScenarioTemplate(templateType) {
  const templates = {
    'encounter-design': `🎯 **ENCOUNTER DESIGN**

Create a balanced encounter for:
- **Character:** ${characterState.name} (Level ${totalLevel.value})
- **Environment:** [Describe setting]
- **Purpose:** [Combat/Social/Exploration]
- **Difficulty:** [Easy/Moderate/Hard]

**Requirements:**
- Appropriate CR for solo character
- Tactical depth and interesting mechanics
- Story relevance and consequences
- Environmental factors

Design with full stats and GM notes.`,

    'npc-creation': `👤 **NPC CREATION**

Create a memorable NPC:
- **Role:** [Function in story]
- **Location:** [Where encountered]
- **Relationship:** [To ${characterState.name}]
- **Importance:** [One-time/Recurring/Major]

**Include:**
- Name, appearance, mannerisms
- Personality and motivation
- Secrets and goals
- Dialogue samples
- Relevant stats
- Plot connections

Bring this character to life!`,

    'location-building': `🏰 **LOCATION DESIGN**

Develop a location:
- **Type:** [Settlement/Dungeon/Wilderness]
- **Scale:** [Room/Building/District]
- **Purpose:** [Story function]
- **Atmosphere:** [Mood and tone]

**Details needed:**
- Physical description and layout
- Key inhabitants and dynamics
- Hidden secrets or features
- Encounter possibilities
- Sensory details
- Story connections

Make it memorable and interactive!`,

    'mystery-creation': `🔍 **MYSTERY DESIGN**

Create an intriguing mystery:
- **Type:** [Crime/Disappearance/Ancient secret]
- **Scope:** [Single/Multi-session]
- **Complexity:** [Investigation depth]
- **Stakes:** [What's at risk]

**Structure:**
- Core truth and events
- Clues and red herrings
- Key NPCs involved
- Investigation methods
- Potential complications
- Satisfying resolution

Design a mystery worth solving!`
  }

  return templates[templateType] || templates['encounter-design']
}

function generateFullCharacterContext() {
  return `📋 **COMPLETE CHARACTER SHEET**

**${characterState.name}** - ${characterState.race} ${characterState.classes.map(c => `${c.className} ${c.level}`).join('/')}

**Ability Scores:**
${Object.entries(characterState.abilityScores).map(([ability, score]) => 
  `- ${ability}: ${score} (${calculateAbilityMod(ability) >= 0 ? '+' : ''}${calculateAbilityMod(ability)})`
).join('\n')}

**Combat Stats:**
- HP: ${characterState.hp}/${characterState.hpMax}
- AC: ${characterState.ac} (Touch: ${characterState.touchAC}, Flat: ${characterState.flatAC})
- Saves: Fort +${characterState.saves.fort}, Ref +${characterState.saves.ref}, Will +${characterState.saves.will}
- Initiative: +${characterState.init}, BAB: +${characterState.bab}

**Skills:**
${characterState.skills.filter(s => s.rank > 0).map(s => 
  `- ${s.name}: +${s.rank + calculateAbilityMod(s.ability)}`
).join('\n') || '- No skills with ranks'}

**Equipment:**
${characterState.inventory.map(item => `- ${item.name}${item.notes ? ' (' + item.notes + ')' : ''}`).join('\n')}

**Wealth:** ${characterState.money.pp}pp, ${characterState.money.gp}gp, ${characterState.money.sp}sp, ${characterState.money.cp}cp

Use this complete character for our Pathfinder session!`
}

// ===== UTILITY FUNCTIONS =====
function calculateAbilityMod(ability) {
  const score = characterState.abilityScores[ability] || 10
  return Math.floor((score - 10) / 2)
}

function copyExport(exportItem) {
  copyToClipboard(exportItem.content, exportItem.type)
}

function formatExportType(type) {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function addToRecentExports(type, content) {
  recentExports.value.unshift({
    id: Date.now(),
    type: type,
    content: content,
    timestamp: Date.now()
  })
  
  // Keep only last 15 exports
  if (recentExports.value.length > 15) {
    recentExports.value = recentExports.value.slice(0, 15)
  }
  
  saveRecentExports()
}

function saveRecentExports() {
  try {
    localStorage.setItem('rpg-narrator-recent-exports', JSON.stringify(recentExports.value))
  } catch (error) {
    console.error('Error saving recent exports:', error)
  }
}

// ===== EXISTING FUNCTIONS =====
function loadProjectId() {
  const savedId = localStorage.getItem('chatgpt-project-id')
  if (savedId) {
    chatGptProjectId.value = savedId
  }
}

function setProjectId() {
  const projectId = tempProjectId.value.trim()
  if (!projectId) {
    showError('Please enter a valid project ID')
    return
  }
  
  let cleanId = projectId
  if (projectId.includes('project=')) {
    const match = projectId.match(/project=([^&]+)/)
    if (match) {
      cleanId = match[1]
    }
  }
  
  chatGptProjectId.value = cleanId
  localStorage.setItem('chatgpt-project-id', cleanId)
  tempProjectId.value = ''
  showSuccess('ChatGPT project configured!')
}

function clearProjectId() {
  if (confirm('Remove ChatGPT project configuration?')) {
    chatGptProjectId.value = ''
    localStorage.removeItem('chatgpt-project-id')
    showSuccess('Project configuration cleared')
  }
}

function openChatGPTProject(mode = 'new') {
  let url = 'https://chat.openai.com'
  
  if (chatGptProjectId.value) {
    url += `/?project=${chatGptProjectId.value}`
    
    if (mode === 'new') {
      url += '&new=true'
    }
  }
  
  const chatWindow = window.open(url, '_blank')
  
  if (recentExports.value.length > 0) {
    const latestExport = recentExports.value[0]
    copyToClipboard(latestExport.content, 'Latest export ready to paste')
  }
}

function checkApiKey() {
  const savedKey = localStorage.getItem('openai-api-key')
  hasApiKey.value = !!savedKey
  if (hasApiKey.value) {
    addWelcomeMessage()
  }
}

function setApiKey() {
  if (!tempApiKey.value.trim().startsWith('sk-')) {
    showError('Please enter a valid OpenAI API key (starts with "sk-")')
    return
  }
  
  localStorage.setItem('openai-api-key', tempApiKey.value.trim())
  hasApiKey.value = true
  tempApiKey.value = ''
  addWelcomeMessage()
  showSuccess('API key saved successfully!')
}

function clearApiKey() {
  if (confirm('Clear your API key? This will disable local AI features.')) {
    localStorage.removeItem('openai-api-key')
    hasApiKey.value = false
    messages.value = []
    showSuccess('API key cleared')
  }
}

function addWelcomeMessage() {
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: `Welcome! I'm your Pathfinder 1e GM assistant, ready to help with rules, encounters, NPCs, and more.

**Current Character**: ${characterState.name || 'Unnamed'} (Level ${totalLevel.value})

What can I help you with today?`,
      timestamp: Date.now()
    })
  }
}

function getSystemPrompt() {
  return `You are an expert Pathfinder 1e Game Master assistant helping with:

**Character Context:**
- Name: ${characterState.name || 'Unnamed Character'}  
- Race: ${characterState.race || 'Unknown'}
- Classes: ${characterState.classes.map(c => `${c.className} ${c.level}`).join(', ') || 'Level 1'}
- Total Level: ${totalLevel.value}
- Current HP: ${characterState.hp}/${characterState.hpMax}

**Core Functions:**
1. Rules clarification and mechanics help
2. Balanced encounter generation 
3. NPC creation with personality and stats
4. Location descriptions and world building
5. Treasure suggestions appropriate for level

Provide accurate Pathfinder 1e information and engaging, game-ready content.`
}

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  userInput.value = ''

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  })

  if (userMessage.startsWith('/roll')) {
    handleDiceRoll(userMessage)
    scrollToBottom()
    return
  }

  isLoading.value = true

  try {
    const apiKey = localStorage.getItem('openai-api-key')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel.value,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          ...messages.value.slice(-10).map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: temperature.value,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    
    messages.value.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    })
    
    // Store last AI response
    lastAIResponse.value = aiResponse

    trackApiCost(data.usage)

    if (autoInventoryEnabled.value) {
      detectAndProcessInventoryChanges(aiResponse)
    }

  } catch (error) {
    console.error('API Error:', error)
    messages.value.push({
      role: 'assistant',
      content: `❌ **Error**: ${error.message}\n\nPlease check your API key and connection.`,
      timestamp: Date.now()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

function trackApiCost(usage) {
  if (!usage) return
  
  const costs = {
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 }
  }
  
  const modelCosts = costs[selectedModel.value] || costs['gpt-3.5-turbo']
  const inputCost = (usage.prompt_tokens / 1000) * modelCosts.input
  const outputCost = (usage.completion_tokens / 1000) * modelCosts.output
  
  apiCost.value += inputCost + outputCost
}

function quickPrompt(prompt) {
  userInput.value = prompt
  sendMessage()
}

function clearChat() {
  if (confirm('Clear all chat messages?')) {
    messages.value = []
    addWelcomeMessage()
  }
}

function handleDiceRoll(command) {
  const match = command.match(/\/roll\s+(\d+)?d(\d+)([+-]\d+)?/i)
  
  if (!match) {
    messages.value.push({
      role: 'assistant',
      content: '❌ **Invalid dice format**\n\nUse: `/roll XdY+Z`',
      timestamp: Date.now()
    })
    return
  }

  const numDice = parseInt(match[1]) || 1
  const dieSize = parseInt(match[2])
  const modifier = parseInt(match[3]) || 0
  
  const rolls = []
  let total = 0
  
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * dieSize) + 1
    rolls.push(roll)
    total += roll
  }
  
  total += modifier
  
  const rollText = rolls.join(', ')
  const modText = modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''
  const critInfo = dieSize === 20 && rolls.includes(20) ? ' 🎯 **NATURAL 20!**' : 
                   dieSize === 20 && rolls.includes(1) ? ' 💥 **NATURAL 1!**' : ''
  
  messages.value.push({
    role: 'assistant',
    content: `🎲 **${numDice}d${dieSize}${modText}**\n\n**Rolls:** [${rollText}]${modText}\n**Total:** **${total}**${critInfo}`,
    timestamp: Date.now()
  })
}

function detectAndProcessInventoryChanges(aiResponse) {
  try {
    const changes = InventoryParser.parseInventoryChanges(aiResponse)
    
    if (InventoryParser.hasChanges(changes)) {
      if (inventoryNotifications.value) {
        inventoryNotifications.value.addPendingChange(changes)
      }
    }
  } catch (error) {
    console.error('Error detecting inventory changes:', error)
  }
}

function onInventoryChangesApplied(event) {
  const { result } = event
  messages.value.push({
    role: 'system',
    content: `🎒 **Inventory Updated**: ${result.message}`,
    timestamp: Date.now()
  })
  scrollToBottom()
}

function onInventoryChangesRejected(changeId) {
  console.log('Inventory changes rejected:', changeId)
}

function formatMessage(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-2 rounded mt-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded">$1</code>')
    .replace(/\n/g, '<br>')
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function showSuccess(message) {
  notificationMessage.value = message
  notificationType.value = 'success'
  showNotification.value = true
  setTimeout(() => showNotification.value = false, 3000)
}

function showError(message) {
  notificationMessage.value = message
  notificationType.value = 'error'
  showNotification.value = true
  setTimeout(() => showNotification.value = false, 4000)
}

function loadSettings() {
  const settings = localStorage.getItem('rpg-narrator-settings')
  if (settings) {
    try {
      const parsed = JSON.parse(settings)
      if (parsed.autoInventory) {
        autoInventoryEnabled.value = parsed.autoInventory.enabled
        autoInventoryDelay.value = parsed.autoInventory.autoApplyDelay || 10
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
}

function loadRecentExports() {
  try {
    const saved = localStorage.getItem('rpg-narrator-recent-exports')
    if (saved) {
      recentExports.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading recent exports:', error)
  }
}

function copyToClipboard(text, description) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess(`${description} copied to clipboard!`)
  }).catch(err => {
    console.error('Copy failed:', err)
    showError('Copy failed - please copy manually')
  })
}
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

/* Custom scrollbar for chat */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1F2937;
}

/* Notification animation */
.fixed {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Iframe styles */
iframe {
  background: #1F2937;
}
</style>