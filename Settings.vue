<template>
  <div class="settings-container h-full overflow-y-auto bg-gray-900 text-white p-6">
    <h1 class="text-3xl font-bold mb-6 text-blue-300">⚙️ Settings</h1>
    
    <!-- Tab Navigation -->
    <div class="flex mb-6 border-b border-gray-700">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-semibold transition-colors',
          activeTab === tab.id 
            ? 'text-blue-400 border-b-2 border-blue-400' 
            : 'text-gray-400 hover:text-white'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-300">General Settings</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Character Name</label>
            <input 
              v-model="settings.characterName" 
              @change="saveSettings"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              placeholder="Enter character name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Default Dice Color</label>
            <select 
              v-model="settings.diceColor" 
              @change="saveSettings"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            >
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="yellow">Yellow</option>
            </select>
          </div>
          
          <div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                v-model="settings.autoSave" 
                @change="saveSettings"
                class="rounded"
              />
              <span>Enable auto-save</span>
            </label>
          </div>
          
          <div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                v-model="settings.confirmRolls" 
                @change="saveSettings"
                class="rounded"
              />
              <span>Confirm before rolling dice</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Settings -->
    <div v-if="activeTab === 'ai'" class="space-y-6">
      <!-- OpenAI API Settings -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-300">OpenAI API Settings</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">API Key</label>
            <div class="flex gap-2">
              <input 
                :type="showApiKey ? 'text' : 'password'"
                v-model="settings.openaiApiKey" 
                @change="saveSettings"
                class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="sk-..."
              />
              <button 
                @click="showApiKey = !showApiKey"
                class="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded"
              >
                {{ showApiKey ? '🙈' : '👁️' }}
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Your API key is stored locally and never sent to our servers</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Default Model</label>
            <select 
              v-model="settings.defaultModel" 
              @change="saveSettings"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            >
              <option value="gpt-4.1-nano">GPT-4.1 Nano (Fastest)</option>
              <option value="gpt-4.1-mini">GPT-4.1 Mini (Balanced)</option>
              <option value="gpt-4.1">GPT-4.1 (Best Quality)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Temperature: {{ settings.temperature }}</label>
            <input 
              type="range" 
              v-model.number="settings.temperature" 
              @change="saveSettings"
              min="0" 
              max="1" 
              step="0.1" 
              class="w-full"
            />
            <p class="text-xs text-gray-400">Higher = more creative, Lower = more focused</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Daily Budget Limit ($)</label>
            <input 
              type="number" 
              v-model.number="settings.dailyBudget" 
              @change="saveSettings"
              min="0" 
              step="0.5"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <!-- ChatGPT Integration -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-purple-300">ChatGPT Integration</h2>
        
        <div class="space-y-4">
          <!-- Input Section -->
          <div>
            <label class="block text-sm font-medium mb-2">ChatGPT Project or Custom GPT</label>
            <div class="flex gap-2">
              <input 
                v-model="tempProjectUrl" 
                @keyup.enter="extractAndSetProjectId"
                class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="Paste URL, project ID (proj_xxx), or GPT ID (g-xxx)"
              />
              <button 
                @click="extractAndSetProjectId"
                class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded"
              >
                Connect
              </button>
            </div>
            
            <!-- Help Text -->
            <div class="mt-2 text-xs text-gray-400 space-y-1">
              <p>📁 <strong>Projects:</strong> https://chat.openai.com/?project=proj_ABC123xyz</p>
              <p>🤖 <strong>Custom GPTs:</strong> https://chat.openai.com/g/g-ABC123xyz</p>
            </div>
          </div>
          
          <!-- Connected Status -->
          <div v-if="settings.chatGptProjectId" class="bg-purple-900 border border-purple-600 rounded p-3">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-semibold flex items-center gap-2">
                  <span v-if="settings.chatGptProjectType === 'custom-gpt'">🤖</span>
                  <span v-else>📁</span>
                  {{ settings.chatGptProjectType === 'custom-gpt' ? 'Custom GPT' : 'Project' }} Connected
                </p>
                <p class="text-sm text-purple-300">ID: {{ settings.chatGptProjectId }}</p>
                <p v-if="settings.chatGptProjectType === 'custom-gpt'" class="text-xs text-purple-400 mt-1">
                  Custom GPTs provide specialized RPG assistance with persistent instructions
                </p>
              </div>
              <button 
                @click="clearProjectId"
                class="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm"
              >
                Remove
              </button>
            </div>
          </div>
          
          <!-- Quick Setup Guides -->
          <div class="bg-gray-700 rounded p-3">
            <h4 class="font-semibold text-sm mb-2">Quick Setup:</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Projects Guide -->
              <div class="bg-gray-800 rounded p-2">
                <h5 class="font-medium text-sm text-purple-300 mb-1">📁 ChatGPT Projects</h5>
                <ol class="text-xs text-gray-300 space-y-1">
                  <li>1. Go to <a href="https://chat.openai.com" target="_blank" class="text-blue-400 hover:underline">ChatGPT</a></li>
                  <li>2. Click "ChatGPT" → "My Projects"</li>
                  <li>3. Create "RPG Campaign" project</li>
                  <li>4. Copy the URL and paste above</li>
                </ol>
                <p class="text-xs text-gray-400 mt-2">Best for: Organizing chats & files</p>
              </div>
              
              <!-- Custom GPT Guide -->
              <div class="bg-gray-800 rounded p-2">
                <h5 class="font-medium text-sm text-purple-300 mb-1">🤖 Custom GPTs</h5>
                <ol class="text-xs text-gray-300 space-y-1">
                  <li>1. Go to <a href="https://chat.openai.com/gpts" target="_blank" class="text-blue-400 hover:underline">Explore GPTs</a></li>
                  <li>2. Click "Create" button</li>
                  <li>3. Set up RPG Game Master GPT</li>
                  <li>4. Share → Copy link → Paste above</li>
                </ol>
                <p class="text-xs text-gray-400 mt-2">Best for: Specialized RPG assistant</p>
              </div>
            </div>
          </div>
          
          <!-- Test Connection -->
          <div>
            <button 
              @click="testProjectConnection"
              :disabled="!settings.chatGptProjectId"
              class="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 px-4 py-2 rounded w-full"
            >
              {{ settings.chatGptProjectId ? 'Test Connection' : 'Connect a Project or GPT First' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Display Settings -->
    <div v-if="activeTab === 'display'" class="space-y-6">
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-300">Display Settings</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Theme</label>
            <select 
              v-model="settings.theme" 
              @change="saveSettings"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            >
              <option value="dark">Dark</option>
              <option value="midnight">Midnight</option>
              <option value="forest">Forest</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Font Size</label>
            <select 
              v-model="settings.fontSize" 
              @change="saveSettings"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                v-model="settings.showAnimations" 
                @change="saveSettings"
                class="rounded"
              />
              <span>Enable animations</span>
            </label>
          </div>
          
          <div>
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                v-model="settings.compactMode" 
                @change="saveSettings"
                class="rounded"
              />
              <span>Compact mode</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Automation Settings -->
    <div v-if="activeTab === 'automation'" class="space-y-6">
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-300">Automation Settings</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold mb-2">Inventory Management</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  v-model="settings.autoInventory.enabled" 
                  @change="saveSettings"
                  class="rounded"
                />
                <span>Enable automatic inventory tracking</span>
              </label>
              
              <div v-if="settings.autoInventory.enabled" class="ml-6 space-y-2">
                <div>
                  <label class="block text-sm font-medium mb-1">Auto-apply delay (seconds)</label>
                  <input 
                    type="number" 
                    v-model.number="settings.autoInventory.autoApplyDelay" 
                    @change="saveSettings"
                    min="5" 
                    max="60"
                    class="w-32 bg-gray-700 border border-gray-600 rounded px-2 py-1"
                  />
                </div>
                
                <label class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    v-model="settings.autoInventory.showNotifications" 
                    @change="saveSettings"
                    class="rounded"
                  />
                  <span>Show change notifications</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Combat Automation</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  v-model="settings.autoCombat.rollInitiative" 
                  @change="saveSettings"
                  class="rounded"
                />
                <span>Auto-roll initiative at combat start</span>
              </label>
              
              <label class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  v-model="settings.autoCombat.trackConditions" 
                  @change="saveSettings"
                  class="rounded"
                />
                <span>Auto-track condition durations</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Session Management</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  v-model="settings.autoSession.createBackups" 
                  @change="saveSettings"
                  class="rounded"
                />
                <span>Auto-backup session data</span>
              </label>
              
              <label class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  v-model="settings.autoSession.generateSummaries" 
                  @change="saveSettings"
                  class="rounded"
                />
                <span>Generate session summaries</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div v-if="activeTab === 'data'" class="space-y-6">
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-green-300">Data Management</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold mb-2">Export Data</h3>
            <div class="flex gap-2">
              <button 
                @click="exportData('character')"
                class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              >
                Export Character
              </button>
              <button 
                @click="exportData('all')"
                class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              >
                Export All Data
              </button>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Import Data</h3>
            <input 
              type="file" 
              @change="importData"
              accept=".json"
              class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Clear Data</h3>
            <div class="flex gap-2">
              <button 
                @click="clearData('cache')"
                class="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded"
              >
                Clear Cache
              </button>
              <button 
                @click="clearData('all')"
                class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
              >
                Clear All Data
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-2">⚠️ Clearing data cannot be undone</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Status -->
    <div v-if="saveStatus" class="fixed bottom-6 right-6 bg-green-800 text-white px-4 py-2 rounded shadow-lg">
      ✅ {{ saveStatus }}
    </div>
    
    <!-- Error Notification -->
    <div v-if="errorMessage" class="fixed bottom-6 right-6 bg-red-800 text-white px-4 py-2 rounded shadow-lg">
      ❌ {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { characterState } from '../characterState.js'

// Tab management
const tabs = [
  { id: 'general', name: 'General' },
  { id: 'ai', name: 'AI & API' },
  { id: 'display', name: 'Display' },
  { id: 'automation', name: 'Automation' },
  { id: 'data', name: 'Data' }
]
const activeTab = ref('general')

// Settings state
const settings = reactive({
  // General
  characterName: '',
  diceColor: 'blue',
  autoSave: true,
  confirmRolls: false,
  
  // AI
  openaiApiKey: '',
  defaultModel: 'gpt-4.1-nano',
  temperature: 0.7,
  dailyBudget: 10,
  chatGptProjectId: '',
  chatGptProjectType: 'project', // 'project' or 'custom-gpt'
  
  // Display
  theme: 'dark',
  fontSize: 'medium',
  showAnimations: true,
  compactMode: false,
  
  // Automation
  autoInventory: {
    enabled: true,
    autoApplyDelay: 10,
    showNotifications: true
  },
  autoCombat: {
    rollInitiative: false,
    trackConditions: true
  },
  autoSession: {
    createBackups: true,
    generateSummaries: false
  }
})

// UI state
const showApiKey = ref(false)
const saveStatus = ref('')
const errorMessage = ref('')
const tempProjectUrl = ref('')

// Load settings on mount
onMounted(() => {
  loadSettings()
})

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('rpg-narrator-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(settings, parsed)
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
  
  // Load character name from characterState
  settings.characterName = characterState.name || ''
  
  // Load API key separately for security
  const apiKey = localStorage.getItem('openai-api-key')
  if (apiKey) {
    settings.openaiApiKey = apiKey
  }
  
  // Load ChatGPT project ID and type
  const projectId = localStorage.getItem('chatgpt-project-id')
  if (projectId) {
    settings.chatGptProjectId = projectId
  }
  
  const projectType = localStorage.getItem('chatgpt-project-type')
  if (projectType) {
    settings.chatGptProjectType = projectType
  }
}

// Save settings
function saveSettings() {
  // Save main settings
  const settingsToSave = { ...settings }
  delete settingsToSave.openaiApiKey // Don't save API key with other settings
  localStorage.setItem('rpg-narrator-settings', JSON.stringify(settingsToSave))
  
  // Save API key separately
  if (settings.openaiApiKey) {
    localStorage.setItem('openai-api-key', settings.openaiApiKey)
  }
  
  // Save character name to characterState
  if (settings.characterName) {
    characterState.name = settings.characterName
  }
  
  // Save project ID and type
  if (settings.chatGptProjectId) {
    localStorage.setItem('chatgpt-project-id', settings.chatGptProjectId)
    localStorage.setItem('chatgpt-project-type', settings.chatGptProjectType)
  }
  
  // Show save confirmation
  showSuccess('Settings saved!')
}

// Extract project ID from URL with improved parsing
function extractAndSetProjectId() {
  const input = tempProjectUrl.value.trim()
  if (!input) return
  
  let projectId = ''
  let projectType = 'project'
  
  // Method 1: Direct project ID (starts with proj_)
  if (input.startsWith('proj_')) {
    projectId = input
    projectType = 'project'
  }
  // Method 2: Direct Custom GPT ID
  else if (input.match(/^[gG]-[a-zA-Z0-9_-]+$/)) {
    projectId = input
    projectType = 'custom-gpt'
  }
  // Method 3: Full URLs
  else if (input.includes('chat.openai.com') || input.includes('chatgpt.com')) {
    // Project URL
    let match = input.match(/[?&]project=([^&\s#/]+)/)
    if (match && match[1]) {
      projectId = match[1]
      projectType = 'project'
    } else {
      // Custom GPT URL
      match = input.match(/\/g\/([gG]-[a-zA-Z0-9_-]+)/)
      if (match && match[1]) {
        projectId = match[1]
        projectType = 'custom-gpt'
      } else {
        // Conversation URL with project
        match = input.match(/\/c\/[^?]+.*[?&]project=([^&\s#/]+)/)
        if (match && match[1]) {
          projectId = match[1]
          projectType = 'project'
        } else if (input.includes('/c/')) {
          showError(`This appears to be a conversation URL without a project ID.

To find your project:
1. Go to ChatGPT.com
2. Click "ChatGPT" logo → "My Projects" 
3. Select your RPG project
4. Copy the URL (it should contain "?project=proj_xxx")`)
          return
        }
      }
    }
  }
  // Method 4: Extract from any text
  else {
    let match = input.match(/(proj_[a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      projectId = match[1]
      projectType = 'project'
    } else {
      match = input.match(/([gG]-[a-zA-Z0-9_-]+)/)
      if (match && match[1]) {
        projectId = match[1]
        projectType = 'custom-gpt'
      }
    }
  }
  
  if (projectId) {
    settings.chatGptProjectId = projectId
    settings.chatGptProjectType = projectType
    localStorage.setItem('chatgpt-project-id', projectId)
    localStorage.setItem('chatgpt-project-type', projectType)
    tempProjectUrl.value = ''
    
    const typeLabel = projectType === 'custom-gpt' ? 'Custom GPT' : 'Project'
    showSuccess(`ChatGPT ${typeLabel} connected successfully!`)
  } else {
    showError(`Could not extract a project or GPT ID.

**Accepted formats:**
• Direct project ID: proj_ABC123xyz
• Direct GPT ID: g-ABC123xyz
• Project URL: https://chat.openai.com/?project=proj_ABC123xyz
• GPT URL: https://chat.openai.com/g/g-ABC123xyz`)
  }
}

// Clear project ID
function clearProjectId() {
  if (confirm('Remove ChatGPT configuration?')) {
    settings.chatGptProjectId = ''
    settings.chatGptProjectType = 'project'
    localStorage.removeItem('chatgpt-project-id')
    localStorage.removeItem('chatgpt-project-type')
    saveSettings()
  }
}

// Test project connection
function testProjectConnection() {
  if (!settings.chatGptProjectId) return
  
  let url = 'https://chat.openai.com'
  
  if (settings.chatGptProjectType === 'custom-gpt') {
    url = `${url}/g/${settings.chatGptProjectId}`
  } else {
    url = `${url}/?project=${settings.chatGptProjectId}`
  }
  
  window.open(url, '_blank')
}

// Show success message
function showSuccess(message) {
  saveStatus.value = message
  setTimeout(() => {
    saveStatus.value = ''
  }, 3000)
}

// Show error message
function showError(message) {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

// Export data
function exportData(type) {
  let data = {}
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  let filename = ''
  
  if (type === 'character') {
    data = {
      character: characterState,
      settings: { characterName: settings.characterName }
    }
    filename = `rpg-narrator-character-${timestamp}.json`
  } else if (type === 'all') {
    data = {
      character: characterState,
      settings: settings,
      timestamp: timestamp
    }
    filename = `rpg-narrator-backup-${timestamp}.json`
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  
  showSuccess(`${type === 'character' ? 'Character' : 'All data'} exported!`)
}

// Import data
function importData(event) {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      if (data.character) {
        Object.assign(characterState, data.character)
      }
      
      if (data.settings) {
        Object.assign(settings, data.settings)
        saveSettings()
      }
      
      showSuccess('Data imported successfully!')
    } catch (error) {
      console.error('Import failed:', error)
      showError('Failed to import data. Please check the file format.')
    }
  }
  reader.readAsText(file)
}

// Clear data
function clearData(type) {
  if (type === 'cache') {
    if (confirm('Clear all cached AI responses?')) {
      localStorage.removeItem('rpg-narrator-content-cache')
      localStorage.removeItem('rpg-narrator-recent-exports')
      showSuccess('Cache cleared!')
    }
  } else if (type === 'all') {
    if (confirm('⚠️ This will delete ALL data including your character, settings, and history. Are you sure?')) {
      if (confirm('This action cannot be undone. Please confirm again.')) {
        localStorage.clear()
        location.reload()
      }
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
}

input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

/* Custom range slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #4B5563;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3B82F6;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  margin-top: -0.5rem;
}

input[type="range"]::-moz-range-track {
  background: #4B5563;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-moz-range-thumb {
  background: #3B82F6;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  border: none;
}

/* Save status animation */
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
</style>