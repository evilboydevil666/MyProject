<!-- src/views/ChatGPTView.vue -->
<template>
  <div class="chatgpt-view">
    <!-- Tab Navigation -->
    <div class="chat-tabs">
      <button 
        @click="activeTab = 'integrated'" 
        :class="['tab-button', { active: activeTab === 'integrated' }]"
      >
        <span class="icon">🤖</span> Integrated AI
      </button>
      <button 
        @click="activeTab = 'web'" 
        :class="['tab-button', { active: activeTab === 'web' }]"
      >
        <span class="icon">🌐</span> ChatGPT Web
      </button>
    </div>
    
    <!-- Integrated AI Content -->
    <div v-if="activeTab === 'integrated'" class="integrated-content">
      <div class="quick-actions">
        <button @click="generateNPC" class="action-button">
          Generate NPC
        </button>
        <button @click="generateEncounter" class="action-button">
          Generate Encounter
        </button>
        <button @click="generateLocation" class="action-button">
          Generate Location
        </button>
        <button @click="answerRule" class="action-button">
          Answer Rule Question
        </button>
      </div>
      
      <div class="ai-chat">
        <div class="messages" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="['message', message.role]"
          >
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
        
        <div class="input-area">
          <textarea 
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            placeholder="Ask your AI assistant..."
            class="chat-input"
          />
          <button @click="sendMessage" class="send-button">Send</button>
        </div>
      </div>
    </div>
    
    <!-- Web ChatGPT Content -->
    <div v-if="activeTab === 'web'" class="web-content">
      <div class="webview-controls">
        <button @click="goBack" :disabled="!canGoBack" class="nav-button">
          ←
        </button>
        <button @click="goForward" :disabled="!canGoForward" class="nav-button">
          →
        </button>
        <button @click="reload" class="nav-button">
          ⟳
        </button>
        <div class="spacer"></div>
        <button @click="injectContext" class="context-button">
          📋 Insert Game Context
        </button>
        <button @click="copyContext" class="context-button">
          📄 Copy Context
        </button>
      </div>
      
      <webview 
        v-if="isElectron"
        ref="chatWebview"
        src="https://chatgpt.com"
        :preload="preloadScript"
        class="chatgpt-webview"
        @did-finish-load="onWebviewLoad"
        @did-navigate="onNavigate"
        @new-window="handleNewWindow"
      />
      
      <div v-else class="electron-required">
        <p>ChatGPT web integration requires the desktop app.</p>
        <button @click="openInBrowser" class="action-button">
          Open ChatGPT in Browser
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useCharacter } from '@/composables/useCharacter'
import { useGameState } from '@/composables/useGameState'
import { useChatGPT } from '@/composables/useChatGPT'

export default {
  name: 'ChatGPTView',
  setup() {
    const { character } = useCharacter()
    const { currentLocation, sessionNotes } = useGameState()
    const { generateContent } = useChatGPT()
    
    const activeTab = ref('integrated')
    const messages = ref([])
    const userInput = ref('')
    const canGoBack = ref(false)
    const canGoForward = ref(false)
    const messagesContainer = ref(null)
    
    // Check if running in Electron
    const isElectron = computed(() => window.isElectron || false)
    
    // Preload script path
    const preloadScript = computed(() => {
      if (isElectron.value && window.electronPath) {
        return `file://${window.electronPath.join(window.electronPath.dirname, 'preload-chatgpt.js')}`
      }
      return ''
    })
    
    // Integrated AI methods
    const sendMessage = async () => {
      if (!userInput.value.trim()) return
      
      const message = userInput.value
      messages.value.push({ role: 'user', content: message })
      userInput.value = ''
      
      try {
        const response = await generateContent({
          prompt: message,
          context: prepareGameContext()
        })
        
        messages.value.push({ role: 'assistant', content: response })
      } catch (error) {
        messages.value.push({ 
          role: 'assistant', 
          content: `Error: ${error.message}` 
        })
      }
      
      // Scroll to bottom
      await nextTick()
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }
    
    const generateNPC = async () => {
      const prompt = `Generate a Pathfinder 1e NPC for the party to encounter in ${currentLocation.value || 'a tavern'}.`
      userInput.value = prompt
      await sendMessage()
    }
    
    const generateEncounter = async () => {
      const prompt = `Create a balanced encounter for a level ${character.value?.level || 5} party in ${currentLocation.value || 'a dungeon'}.`
      userInput.value = prompt
      await sendMessage()
    }
    
    const generateLocation = async () => {
      const prompt = `Describe an interesting location the party might discover while exploring.`
      userInput.value = prompt
      await sendMessage()
    }
    
    const answerRule = async () => {
      const prompt = `I have a Pathfinder 1e rules question: `
      userInput.value = prompt
      // Don't send, let user complete the question
    }
    
    // WebView methods
    const onWebviewLoad = () => {
      const webview = chatWebview.value
      if (!webview) return
      
      // Update navigation state
      canGoBack.value = webview.canGoBack()
      canGoForward.value = webview.canGoForward()
      
      // Optional: Hide ChatGPT sidebar for more space
      webview.insertCSS(`
        /* Custom styles for embedded ChatGPT */
        .dark .bg-gray-950 { background-color: #1a1a1a !important; }
      `)
    }
    
    const onNavigate = () => {
      const webview = chatWebview.value
      if (!webview) return
      
      canGoBack.value = webview.canGoBack()
      canGoForward.value = webview.canGoForward()
    }
    
    const goBack = () => {
      const webview = chatWebview.value
      if (webview && webview.canGoBack()) {
        webview.goBack()
      }
    }
    
    const goForward = () => {
      const webview = chatWebview.value
      if (webview && webview.canGoForward()) {
        webview.goForward()
      }
    }
    
    const reload = () => {
      const webview = chatWebview.value
      if (webview) {
        webview.reload()
      }
    }
    
    const handleNewWindow = (e) => {
      // Prevent pop-ups, load in same webview
      e.preventDefault()
      const webview = chatWebview.value
      if (webview) {
        webview.loadURL(e.url)
      }
    }
    
    const prepareGameContext = () => {
      const context = {
        character: character.value ? {
          name: character.value.name,
          level: character.value.level,
          class: character.value.class,
          race: character.value.race,
          hp: `${character.value.currentHp}/${character.value.maxHp}`
        } : null,
        location: currentLocation.value || 'Unknown Location',
        sessionNotes: sessionNotes.value || '',
        timestamp: new Date().toLocaleString()
      }
      
      return `Current Pathfinder 1e Session Context:
      
Character: ${context.character ? `${context.character.name} (Level ${context.character.level} ${context.character.race} ${context.character.class})` : 'No character loaded'}
HP: ${context.character?.hp || 'N/A'}
Location: ${context.location}
Time: ${context.timestamp}

Recent Session Notes:
${context.sessionNotes || 'No recent notes'}

GM Request: `
    }
    
    const copyContext = async () => {
      const context = prepareGameContext()
      
      try {
        await navigator.clipboard.writeText(context)
        // You might want to show a notification here
        console.log('Context copied to clipboard')
      } catch (error) {
        console.error('Failed to copy context:', error)
      }
    }
    
    const injectContext = () => {
      const webview = chatWebview.value
      if (!webview) return
      
      const context = prepareGameContext()
      
      // Escape backticks and newlines for JavaScript
      const escapedContext = context
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\n/g, '\\n')
      
      webview.executeJavaScript(`
        (function() {
          // Try multiple selectors for ChatGPT's textarea
          const selectors = [
            'textarea[id="prompt-textarea"]',
            'textarea[data-id]',
            'textarea[placeholder*="Message"]',
            'textarea.m-0',
            'textarea'
          ];
          
          let textarea = null;
          for (const selector of selectors) {
            textarea = document.querySelector(selector);
            if (textarea) break;
          }
          
          if (textarea) {
            // Set the value
            textarea.value = \`${escapedContext}\`;
            
            // Trigger input event for React
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            
            // Focus the textarea
            textarea.focus();
            
            // Adjust height if needed
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
            
            console.log('Context injected successfully');
          } else {
            console.error('Could not find ChatGPT textarea');
          }
        })();
      `)
    }
    
    const getWebview = () => {
      return isElectron.value && chatWebview.value ? chatWebview.value : null
    }
    
    const openInBrowser = () => {
      window.open('https://chatgpt.com', '_blank')
    }
    
    // Refs
    const chatWebview = ref(null)
    
    // Welcome message
    onMounted(() => {
      messages.value.push({
        role: 'assistant',
        content: 'Welcome to the AI Assistant! I can help you generate NPCs, encounters, locations, and answer Pathfinder 1e rules questions. Use the quick action buttons above or type your request below.'
      })
    })
    
    return {
      // Data
      activeTab,
      messages,
      userInput,
      canGoBack,
      canGoForward,
      isElectron,
      preloadScript,
      messagesContainer,
      chatWebview,
      
      // Methods
      sendMessage,
      generateNPC,
      generateEncounter,
      generateLocation,
      answerRule,
      onWebviewLoad,
      onNavigate,
      goBack,
      goForward,
      reload,
      handleNewWindow,
      copyContext,
      injectContext,
      openInBrowser
    }
  }
}
</script>

<style scoped>
.chatgpt-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
}

/* Tab Navigation */
.chat-tabs {
  display: flex;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button:hover {
  background: #333;
  color: #ccc;
}

.tab-button.active {
  background: #1a1a1a;
  color: #4CAF50;
  border-bottom: 2px solid #4CAF50;
}

.icon {
  font-size: 18px;
}

/* Integrated AI Content */
.integrated-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.quick-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.action-button:hover {
  background: #45a049;
}

.ai-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background: #4CAF50;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background: #3a3a3a;
  color: #e0e0e0;
}

.input-area {
  display: flex;
  padding: 20px;
  gap: 10px;
  background: #333;
  border-top: 1px solid #444;
}

.chat-input {
  flex: 1;
  padding: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  resize: none;
  font-family: inherit;
  font-size: 14px;
}

.chat-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.send-button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.send-button:hover {
  background: #45a049;
}

/* Web Content */
.web-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.webview-controls {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  gap: 10px;
}

.nav-button {
  width: 36px;
  height: 36px;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.nav-button:hover:not(:disabled) {
  background: #444;
  color: white;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spacer {
  flex: 1;
}

.context-button {
  padding: 8px 16px;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #ccc;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.context-button:hover {
  background: #444;
  color: white;
}

.chatgpt-webview {
  flex: 1;
  width: 100%;
  background: white;
}

.electron-required {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.electron-required p {
  color: #888;
  margin-bottom: 20px;
  font-size: 16px;
}

/* Scrollbar styling */
.messages::-webkit-scrollbar,
.chat-input::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track,
.chat-input::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.messages::-webkit-scrollbar-thumb,
.chat-input::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover,
.chat-input::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>