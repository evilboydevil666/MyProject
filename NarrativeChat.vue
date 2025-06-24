<template>
  <div class="narrative-chat">
    <!-- Header -->
    <div class="chat-header">
      <div class="header-content">
        <h3 class="header-title">🎭 Narrative Chat</h3>
        <p class="header-status">{{ statusMessage }}</p>
      </div>
      <div class="header-actions">
        <NarrativeChatActions 
          @action="handleAction"
          :synced="lastSync ? new Date(lastSync) : null"
          :predictions-available="predictionsAvailable"
        />
      </div>
    </div>
    
    <!-- Messages -->
    <div class="chat-messages">
      <NarrativeMessages 
        ref="messagesComponent"
        :messages="messages"
        @transfer-to-web="handleTransferToWeb"
        @use-prediction="handleUsePrediction"
      />
    </div>
    
    <!-- Footer Section -->
    <div class="chat-footer">
      <!-- Quick Actions -->
      <NarrativeQuickActions 
        @roll="handleQuickRoll"
        :character-context="characterContext"
      />
      
      <!-- Input -->
      <NarrativeInput
        v-model="currentInput"
        :suggestions="inputSuggestions"
        :loading="isLoading"
        :disabled="!hasApiKey"
        @submit="handleSubmit"
        @input-change="handleInputChange"
      />
      
      <!-- Character Status -->
      <CharacterQuickStatus 
        :character="characterContext"
        :insights="characterInsights"
      />
    </div>

    <!-- Transfer Success Notification -->
    <div 
      v-if="showTransferNotification" 
      class="fixed bottom-4 right-4 bg-purple-800 border border-purple-600 rounded-lg p-3 z-50 transition-all"
    >
      {{ transferNotificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useNarrativeChat } from '../composables/useNarrativeChat'
import { useCharacterContext } from '../composables/useCharacterContext'
import { useAIPredictor } from '../composables/useAIPredictor'
import NarrativeChatActions from './narrative/NarrativeChatActions.vue'
import NarrativeMessages from './narrative/NarrativeMessages.vue'
import NarrativeQuickActions from './narrative/NarrativeQuickActions.vue'
import NarrativeInput from './narrative/NarrativeInput.vue'
import CharacterQuickStatus from './narrative/CharacterQuickStatus.vue'

// Props
const props = defineProps({
  characterState: {
    type: Object,
    required: true
  }
})

// Component refs
const messagesComponent = ref(null)

// Core chat functionality
const {
  messages,
  currentInput,
  isLoading,
  hasApiKey,
  sendMessage,
  clearMessages,
  exportChat
} = useNarrativeChat()

// Character context
const {
  characterContext,
  characterInsights,
  updateContext
} = useCharacterContext(props.characterState)

// AI predictions
const {
  predictions,
  predictionsAvailable,
  generatePredictions,
  clearPredictions
} = useAIPredictor()

// Local state
const lastSync = ref(null)
const inputSuggestions = ref([])
const chatGptProjectId = ref('')
const showTransferNotification = ref(false)
const transferNotificationMessage = ref('')

// Computed
const statusMessage = computed(() => {
  if (!hasApiKey.value) {
    return 'API key required - Set in Settings'
  }
  if (isLoading.value) {
    return 'Generating narrative...'
  }
  if (lastSync.value) {
    const minutes = Math.floor((Date.now() - lastSync.value) / 60000)
    if (minutes < 1) return 'Synced just now'
    if (minutes === 1) return 'Synced 1 minute ago'
    return `Synced ${minutes} minutes ago`
  }
  return 'Ready to narrate'
})

// Methods
async function handleSubmit(text) {
  const messageText = text || currentInput.value
  if (!messageText.trim()) return
  
  // Add character context to the message
  const contextualMessage = {
    text: messageText,
    context: {
      character: characterContext.value,
      recentActions: messages.value.slice(-3)
    }
  }
  
  await sendMessage(contextualMessage)
  lastSync.value = Date.now()
  
  // Scroll to bottom after message
  await nextTick()
  if (messagesComponent.value) {
    messagesComponent.value.scrollToBottom()
  }
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      if (confirm('Clear all messages?')) {
        clearMessages()
        clearPredictions()
      }
      break
    case 'export':
      exportChat()
      break
    case 'predict':
      generatePredictions(characterContext.value, messages.value)
      break
    case 'sync':
      syncWithGameState()
      break
    case 'open-chatgpt':
      openChatGPTProject()
      break
  }
}

function handleTransferToWeb(message) {
  // Create a formatted context for ChatGPT
  const context = `🎭 **NARRATIVE CONTINUATION**

**Previous Narrative:**
${message.content}

**Character Status:**
- ${characterContext.value.name} (Level ${characterContext.value.level})
- HP: ${characterContext.value.hp}/${characterContext.value.maxHp}
- Location: ${characterContext.value.location || '[Current location]'}

Continue this narrative scene...`

  // Copy to clipboard
  copyToClipboard(context, 'Narrative transferred to clipboard!')
  
  // Check if project is configured
  const projectId = localStorage.getItem('chatgpt-project-id')
  if (!projectId) {
    // Still open ChatGPT, just without project
    transferNotificationMessage.value = 'Narrative copied! Opening ChatGPT (no project configured)'
    showTransferNotification.value = true
    setTimeout(() => showTransferNotification.value = false, 4000)
  }
  
  // Open ChatGPT project (with or without project ID)
  openChatGPTProject()
}

function handleUsePrediction(prediction) {
  currentInput.value = prediction.text
  clearPredictions()
}

function handleQuickRoll(rollData) {
  const rollMessage = `Rolling ${rollData.dice} for ${rollData.reason}`
  handleSubmit(rollMessage)
}

function handleInputChange(value) {
  // Generate suggestions based on input
  if (value.length > 2) {
    generateInputSuggestions(value)
  } else {
    inputSuggestions.value = []
  }
}

function generateInputSuggestions(input) {
  const suggestions = []
  
  // Action suggestions
  if (input.toLowerCase().includes('attack')) {
    suggestions.push('I attack with my longsword')
    suggestions.push('I cast Magic Missile at the target')
  }
  
  // Movement suggestions
  if (input.toLowerCase().includes('move') || input.toLowerCase().includes('go')) {
    suggestions.push('I move cautiously forward')
    suggestions.push('I sneak through the shadows')
  }
  
  // Investigation suggestions
  if (input.toLowerCase().includes('look') || input.toLowerCase().includes('search')) {
    suggestions.push('I search the room carefully')
    suggestions.push('I examine the mysterious object')
  }
  
  inputSuggestions.value = suggestions.slice(0, 3)
}

function syncWithGameState() {
  updateContext(props.characterState)
  lastSync.value = Date.now()
}

function openChatGPTProject() {
  let url = 'https://chat.openai.com'
  
  // Always check localStorage for the most up-to-date project ID
  const projectId = localStorage.getItem('chatgpt-project-id')
  if (projectId) {
    url += `/?project=${projectId}`
  }
  
  window.open(url, '_blank')
}

function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showTransferNotification.value = true
    transferNotificationMessage.value = successMessage || 'Copied to clipboard!'
    
    setTimeout(() => {
      showTransferNotification.value = false
    }, 3000)
  }).catch(err => {
    console.error('Failed to copy:', err)
    transferNotificationMessage.value = 'Failed to copy - please try again'
    showTransferNotification.value = true
    
    setTimeout(() => {
      showTransferNotification.value = false
    }, 3000)
  })
}

function loadProjectId() {
  const savedId = localStorage.getItem('chatgpt-project-id')
  if (savedId) {
    chatGptProjectId.value = savedId
  }
}

// Watchers
watch(() => props.characterState, (newState) => {
  updateContext(newState)
}, { deep: true })

// Listen for project ID changes
window.addEventListener('storage', (e) => {
  if (e.key === 'chatgpt-project-id') {
    loadProjectId()
  }
})

// Lifecycle
onMounted(() => {
  // Initial sync
  syncWithGameState()
  
  // Load ChatGPT project ID
  loadProjectId()
  
  // Check for API key
  const apiKey = localStorage.getItem('openai-api-key')
  if (!apiKey) {
    console.warn('No OpenAI API key found. Narrative features will be limited.')
  }
})
</script>

<style scoped>
/* Main container - fills the entire sidebar */
.narrative-chat {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: white;
  overflow: hidden;
}

/* Header section */
.chat-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #86efac; /* green-300 */
}

.header-status {
  font-size: 0.75rem;
  color: #9ca3af; /* gray-400 */
}

.header-actions {
  display: flex;
  gap: 0.25rem;
}

/* Messages section - main scrollable area */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  min-height: 0; /* Critical for proper flex scrolling */
}

/* Footer section */
.chat-footer {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Custom scrollbar for messages */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Ensure child components blend well */
.narrative-chat :deep(.bg-gray-800) {
  background-color: rgba(31, 41, 55, 0.5);
}

.narrative-chat :deep(.bg-gray-700) {
  background-color: rgba(55, 65, 81, 0.5);
}

.narrative-chat :deep(.border-gray-600) {
  border-color: rgba(75, 85, 99, 0.5);
}

/* Notification animation */
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

.fixed {
  animation: slideInRight 0.3s ease-out;
}
</style>