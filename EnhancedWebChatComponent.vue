<template>
  <div class="enhanced-web-chat bg-gray-800 text-white p-4 rounded-lg">
    <div class="chat-header mb-4">
      <h2 class="text-xl font-bold mb-2">ChatGPT Integration</h2>
      <div class="flex gap-2">
        <button 
          @click="startNewSession"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          New Session
        </button>
        <button 
          @click="toggleContextPanel"
          class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          {{ showContext ? 'Hide' : 'Show' }} Context
        </button>
        <button 
          @click="exportConversation"
          class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Export
        </button>
        <button 
          @click="openInProject"
          class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
          :title="chatGptProjectId ? 'Open in your RPG project' : 'Configure project first'"
        >
          Open in ChatGPT
        </button>
      </div>
    </div>

    <!-- Project Configuration -->
    <div v-if="!chatGptProjectId" class="bg-indigo-900 border border-indigo-600 rounded p-3 mb-4">
      <h3 class="font-semibold mb-2">📁 Configure ChatGPT Project</h3>
      <div class="flex gap-2">
        <input 
          v-model="tempProjectId" 
          placeholder="Enter project ID or URL" 
          class="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
          @keyup.enter="setProjectId"
        />
        <button @click="setProjectId" class="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded">
          Set Project
        </button>
      </div>
    </div>
    <div v-else class="bg-indigo-900 border border-indigo-600 rounded p-3 mb-4">
      <div class="flex justify-between items-center">
        <div>
          <span class="font-semibold">📁 Project Connected:</span>
          <span class="text-sm ml-2">{{ chatGptProjectId }}</span>
        </div>
        <button @click="clearProjectId" class="text-indigo-300 hover:text-white text-sm">
          Change
        </button>
      </div>
    </div>

    <!-- Context Panel -->
    <div v-if="showContext" class="context-panel bg-gray-700 p-4 rounded mb-4">
      <h3 class="text-lg font-semibold mb-2">Current Context</h3>
      <div class="space-y-2">
        <div class="context-item">
          <label class="font-medium">Location:</label>
          <input 
            v-model="gameContext.location"
            @change="updateContext"
            class="ml-2 bg-gray-600 px-2 py-1 rounded"
          />
        </div>
        <div class="context-item">
          <label class="font-medium">Party Level:</label>
          <input 
            v-model.number="gameContext.partyLevel"
            @change="updateContext"
            type="number"
            class="ml-2 bg-gray-600 px-2 py-1 rounded w-20"
          />
        </div>
        <div class="context-item">
          <label class="font-medium">Active Quest:</label>
          <input 
            v-model="gameContext.activeQuest"
            @change="updateContext"
            class="ml-2 bg-gray-600 px-2 py-1 rounded flex-1"
          />
        </div>
        <div class="context-item">
          <label class="font-medium">Session Notes:</label>
          <textarea 
            v-model="gameContext.sessionNotes"
            @change="updateContext"
            class="ml-2 bg-gray-600 px-2 py-1 rounded w-full h-20"
          />
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <button 
        v-for="action in quickActions" 
        :key="action.id"
        @click="executeQuickAction(action)"
        class="bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm"
      >
        {{ action.label }}
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages bg-gray-700 rounded p-4 h-96 overflow-y-auto mb-4">
      <div v-if="messages.length === 0" class="text-gray-400 text-center">
        <p class="mb-4">No messages yet. Start a conversation!</p>
        <button 
          v-if="chatGptProjectId"
          @click="openInProject('new')"
          class="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
        >
          Open ChatGPT Project
        </button>
      </div>
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message mb-4"
        :class="message.role === 'user' ? 'text-right' : 'text-left'"
      >
        <div 
          class="inline-block p-3 rounded-lg max-w-3/4"
          :class="{
            'bg-blue-600': message.role === 'user',
            'bg-gray-600': message.role === 'assistant',
            'bg-purple-600': message.role === 'system'
          }"
        >
          <div class="font-semibold text-sm mb-1">
            {{ message.role === 'user' ? 'You' : 
               message.role === 'system' ? 'System' : 'ChatGPT' }}
          </div>
          <div class="whitespace-pre-wrap">{{ message.content }}</div>
          <div class="text-xs text-gray-300 mt-1">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
      <div v-if="isTyping" class="text-gray-400 italic">
        ChatGPT is typing...
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <div class="flex gap-2">
        <textarea 
          v-model="currentMessage"
          @keydown.enter.prevent="sendMessage"
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          class="flex-1 bg-gray-700 text-white p-3 rounded resize-none h-20"
        />
        <div class="flex flex-col gap-2">
          <button 
            @click="sendMessage"
            :disabled="!currentMessage.trim() || isTyping"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Send
          </button>
          <button 
            @click="attachContext"
            class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm"
          >
            + Context
          </button>
        </div>
      </div>
    </div>

    <!-- Templates Dropdown -->
    <div class="templates-section mt-4">
      <select 
        v-model="selectedTemplate"
        @change="applyTemplate"
        class="bg-gray-700 text-white p-2 rounded w-full"
      >
        <option value="">Select a prompt template...</option>
        <option v-for="template in promptTemplates" :key="template.id" :value="template.id">
          {{ template.name }}
        </option>
      </select>
    </div>

    <!-- Export History -->
    <div v-if="exportHistory.length > 0" class="export-history mt-4 bg-gray-700 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Export History</h3>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <div 
          v-for="(exportItem, index) in exportHistory" 
          :key="index"
          class="flex justify-between items-center bg-gray-600 p-2 rounded"
        >
          <span>{{ exportItem.type }} - {{ formatTime(exportItem.timestamp) }}</span>
          <div class="flex gap-2">
            <button 
              @click="copyExport(exportItem)" 
              class="bg-gray-500 hover:bg-gray-400 px-2 py-1 rounded text-xs"
            >
              Copy
            </button>
            <button 
              @click="openWithExport(exportItem)" 
              class="bg-indigo-500 hover:bg-indigo-400 px-2 py-1 rounded text-xs"
              v-if="chatGptProjectId"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'EnhancedWebChatComponent',
  
  setup() {
    // State
    const messages = ref([])
    const currentMessage = ref('')
    const isTyping = ref(false)
    const showContext = ref(false)
    const selectedTemplate = ref('')
    const exportHistory = ref([])
    
    // Project integration
    const chatGptProjectId = ref('')
    const tempProjectId = ref('')
    
    // Game Context
    const gameContext = ref({
      location: '',
      partyLevel: 1,
      activeQuest: '',
      sessionNotes: '',
      recentEvents: [],
      npcRelationships: {}
    })
    
    // Quick Actions
    const quickActions = ref([
      { id: 'npc', label: 'Generate NPC', prompt: 'Generate a detailed NPC for the current location' },
      { id: 'encounter', label: 'Create Encounter', prompt: 'Create a balanced encounter for the party' },
      { id: 'description', label: 'Describe Scene', prompt: 'Provide a vivid description of the current scene' },
      { id: 'rules', label: 'Rules Check', prompt: 'I need clarification on a Pathfinder 1e rule' },
      { id: 'loot', label: 'Generate Loot', prompt: 'Generate appropriate treasure for this encounter' },
      { id: 'puzzle', label: 'Create Puzzle', prompt: 'Design a puzzle appropriate for the party level' },
      { id: 'dialogue', label: 'NPC Dialogue', prompt: 'Help me roleplay this NPC conversation' },
      { id: 'plot', label: 'Plot Development', prompt: 'Suggest plot developments based on recent events' }
    ])
    
    // Prompt Templates
    const promptTemplates = ref([
      {
        id: 'session_start',
        name: 'Session Start',
        template: 'Help me start today\'s session. Last time: {sessionNotes}. The party is at {location}.'
      },
      {
        id: 'combat_tactics',
        name: 'Combat Tactics',
        template: 'The party (level {partyLevel}) is fighting {enemy}. Suggest tactical options for the enemies.'
      },
      {
        id: 'world_reaction',
        name: 'World Reaction',
        template: 'The players just {playerAction}. How would the world/NPCs realistically react?'
      },
      {
        id: 'improvise_content',
        name: 'Improvise Content',
        template: 'I need to quickly improvise {contentType} for {location}. Party level: {partyLevel}'
      }
    ])
    
    // Computed
    const chatGptUrl = computed(() => {
      let url = 'https://chat.openai.com'
      if (chatGptProjectId.value) {
        url += `/?project=${chatGptProjectId.value}`
      }
      return url
    })
    
    // Methods
    const sendMessage = async () => {
      if (!currentMessage.value.trim() || isTyping.value) return
      
      const userMessage = {
        role: 'user',
        content: currentMessage.value,
        timestamp: new Date(),
        context: { ...gameContext.value }
      }
      
      messages.value.push(userMessage)
      const messageToSend = currentMessage.value
      currentMessage.value = ''
      
      // Add to export history
      addToExportHistory('Conversation', messageToSend)
      
      // Since this is a simulated chat, add a system message
      messages.value.push({
        role: 'system',
        content: 'This is a preview. Click "Open in ChatGPT" to continue with real ChatGPT.',
        timestamp: new Date()
      })
    }
    
    const setProjectId = () => {
      const projectId = tempProjectId.value.trim()
      if (!projectId) return
      
      // Extract project ID if full URL was pasted
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
    }
    
    const clearProjectId = () => {
      if (confirm('Remove ChatGPT project configuration?')) {
        chatGptProjectId.value = ''
        localStorage.removeItem('chatgpt-project-id')
      }
    }
    
    const openInProject = (mode = 'continue') => {
      let url = chatGptUrl.value
      
      if (mode === 'new') {
        // This might work for starting a new chat
        url += url.includes('?') ? '&new=true' : '?new=true'
      }
      
      // Copy latest message if available
      if (messages.value.length > 0) {
        const lastUserMessage = [...messages.value]
          .reverse()
          .find(m => m.role === 'user')
        
        if (lastUserMessage) {
          copyToClipboard(lastUserMessage.content)
        }
      }
      
      window.open(url, '_blank')
    }
    
    const openWithExport = (exportItem) => {
      copyToClipboard(exportItem.content)
      setTimeout(() => openInProject('new'), 100)
    }
    
    const executeQuickAction = (action) => {
      currentMessage.value = action.prompt
      if (gameContext.value.location) {
        currentMessage.value += ` Current location: ${gameContext.value.location}.`
      }
      if (gameContext.value.partyLevel) {
        currentMessage.value += ` Party level: ${gameContext.value.partyLevel}.`
      }
    }
    
    const applyTemplate = () => {
      const template = promptTemplates.value.find(t => t.id === selectedTemplate.value)
      if (!template) return
      
      let prompt = template.template
      // Replace template variables with actual values
      prompt = prompt.replace('{location}', gameContext.value.location || '[location]')
      prompt = prompt.replace('{partyLevel}', gameContext.value.partyLevel || '[level]')
      prompt = prompt.replace('{sessionNotes}', gameContext.value.sessionNotes || '[notes]')
      
      currentMessage.value = prompt
      selectedTemplate.value = ''
    }
    
    const attachContext = () => {
      const contextString = `\n\n[Context: Location: ${gameContext.value.location}, Party Level: ${gameContext.value.partyLevel}, Active Quest: ${gameContext.value.activeQuest}]`
      currentMessage.value += contextString
    }
    
    const updateContext = () => {
      // Save context to localStorage
      localStorage.setItem('rpg-narrator-context', JSON.stringify(gameContext.value))
    }
    
    const toggleContextPanel = () => {
      showContext.value = !showContext.value
    }
    
    const startNewSession = () => {
      if (confirm('Start a new chat session? Current conversation will be saved to history.')) {
        if (messages.value.length > 0) {
          exportConversation()
        }
        messages.value = []
        currentMessage.value = ''
      }
    }
    
    const exportConversation = () => {
      const exportData = {
        type: 'ChatGPT Conversation',
        timestamp: new Date(),
        messages: [...messages.value],
        context: { ...gameContext.value },
        content: messages.value.map(m => `${m.role}: ${m.content}`).join('\n\n')
      }
      
      addToExportHistory('Full Conversation', exportData.content)
      copyToClipboard(exportData.content)
    }
    
    const addToExportHistory = (type, content) => {
      exportHistory.value.unshift({
        type,
        content,
        timestamp: new Date()
      })
      
      if (exportHistory.value.length > 10) {
        exportHistory.value = exportHistory.value.slice(0, 10)
      }
      
      // Save to localStorage
      localStorage.setItem('rpg-narrator-export-history', JSON.stringify(exportHistory.value))
    }
    
    const copyExport = (exportItem) => {
      copyToClipboard(exportItem.content)
    }
    
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Copied to clipboard')
        })
        .catch(err => {
          console.error('Failed to copy:', err)
        })
    }
    
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    // Initialize
    onMounted(() => {
      // Load project ID
      const savedProjectId = localStorage.getItem('chatgpt-project-id')
      if (savedProjectId) {
        chatGptProjectId.value = savedProjectId
      }
      
      // Load saved context
      const savedContext = localStorage.getItem('rpg-narrator-context')
      if (savedContext) {
        try {
          const parsed = JSON.parse(savedContext)
          Object.assign(gameContext.value, parsed)
        } catch (error) {
          console.error('Failed to load saved context:', error)
        }
      }
      
      // Load export history
      const savedHistory = localStorage.getItem('rpg-narrator-export-history')
      if (savedHistory) {
        try {
          exportHistory.value = JSON.parse(savedHistory)
        } catch (error) {
          console.error('Failed to load export history:', error)
        }
      }
    })
    
    return {
      messages,
      currentMessage,
      isTyping,
      showContext,
      gameContext,
      quickActions,
      promptTemplates,
      selectedTemplate,
      exportHistory,
      chatGptProjectId,
      tempProjectId,
      sendMessage,
      executeQuickAction,
      applyTemplate,
      attachContext,
      updateContext,
      toggleContextPanel,
      startNewSession,
      exportConversation,
      copyExport,
      formatTime,
      setProjectId,
      clearProjectId,
      openInProject,
      openWithExport
    }
  }
}
</script>

<style scoped>
.enhanced-web-chat {
  max-width: 1200px;
  margin: 0 auto;
}

.chat-messages {
  scroll-behavior: smooth;
}

.message {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

textarea {
  min-height: 80px;
}

.max-w-3\/4 {
  max-width: 75%;
}
</style>