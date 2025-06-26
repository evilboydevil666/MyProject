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
        <span v-if="chatStatus === 'active'" class="status-indicator active">●</span>
        <span v-else-if="chatStatus === 'loading'" class="status-indicator loading">○</span>
      </button>
    </div>
    
    <!-- Content Container - Both tabs always rendered -->
    <div class="content-container">
      <!-- Integrated AI Content - Always rendered, visibility controlled by CSS -->
      <div 
        :class="['integrated-content', { 'hidden-tab': activeTab !== 'integrated' }]"
      >
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
      
      <!-- Web ChatGPT Content - Always rendered, visibility controlled by CSS -->
      <div 
        :class="['web-content', { 'hidden-tab': activeTab !== 'web' }]"
      >
        <div class="webview-controls">
          <button @click="goBack" :disabled="!canGoBack" class="nav-button" title="Go Back">
            ←
          </button>
          <button @click="goForward" :disabled="!canGoForward" class="nav-button" title="Go Forward">
            →
          </button>
          <button @click="reload" class="nav-button" title="Reload">
            ⟳
          </button>
          <button 
            v-if="chatUrl && !chatUrl.includes('/c/')" 
            @click="navigateToChat" 
            class="nav-button chat-button"
            title="Go to Active Chat"
          >
            💬
          </button>
          <div class="url-display">
            <span v-if="chatStatus === 'loading'" class="loading-spinner">⟳</span>
            {{ displayUrl }}
          </div>
          <div class="spacer"></div>
          <button @click="injectContext" class="context-button" title="Insert game context into ChatGPT">
            📋 Insert Context
          </button>
          <button @click="copyContext" class="context-button" title="Copy context to clipboard">
            📄 Copy Context
          </button>
          <button 
            @click="keepAlive" 
            class="context-button"
            :class="{ 'active': keepAliveActive }"
            title="Keep session active"
          >
            {{ keepAliveActive ? '🟢' : '⭕' }} Keep Alive
          </button>
        </div>
        
        <!-- Webview Container - Using iframe for web version -->
        <div class="webview-container" ref="webviewContainer">
          <!-- Use iframe in web browser, webview in Electron -->
          <iframe 
            v-if="!isElectron"
            ref="chatIframe"
            :src="webviewUrl"
            class="chatgpt-webview"
            :class="{ 'webview-hidden': !webviewReady }"
            @load="onIframeLoad"
            frameborder="0"
            allow="clipboard-write"
          />
          
          <!-- For Electron, create webview dynamically to avoid Vue warnings -->
          <div 
            v-else
            ref="electronWebviewContainer"
            class="electron-webview-container"
          />
          
          <!-- Loading overlay -->
          <div v-if="!webviewReady" class="webview-loading">
            <div class="loading-content">
              <div class="loading-spinner-large">⟳</div>
              <p>Initializing ChatGPT...</p>
              <p v-if="!isElectron" class="loading-note">
                Note: Full integration requires the desktop app. 
                <button @click="openInBrowser" class="inline-link">Open in new tab</button> for better experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useCharacter } from '@/composables/useCharacter'
import { useGameState } from '@/composables/useGameState'
import { useChatGPT } from '@/composables/useChatGPT'

export default {
  name: 'ChatGPTView',
  setup() {
    const { character } = useCharacter()
    const { currentLocation, sessionNotes } = useGameState()
    const { generateContent } = useChatGPT()
    
    // Tab state
    const activeTab = ref('integrated')
    
    // Integrated AI state
    const messages = ref([])
    const userInput = ref('')
    const messagesContainer = ref(null)
    
    // Webview/iframe state
    const chatIframe = ref(null)
    const electronWebviewContainer = ref(null)
    const webviewContainer = ref(null)
    const webviewReady = ref(false)
    const webviewUrl = ref('https://chatgpt.com')
    const canGoBack = ref(false)
    const canGoForward = ref(false)
    const chatUrl = ref('')
    const savedChatUrl = ref('')
    const chatStatus = ref('loading') // 'loading', 'active', 'inactive'
    const keepAliveActive = ref(false)
    let keepAliveInterval = null
    let electronWebview = null
    
    // Check if running in Electron
    const isElectron = computed(() => {
      return !!(window.electronAPI || window.electron || 
                (typeof process !== 'undefined' && process.versions && process.versions.electron))
    })
    
    // Display URL
    const displayUrl = computed(() => {
      if (chatStatus.value === 'loading') return 'Loading ChatGPT...'
      if (!chatUrl.value) return 'Initializing...'
      if (chatUrl.value.includes('/c/')) {
        return '💬 Active Chat Session'
      }
      return '🏠 ChatGPT Home'
    })
    
    // Load saved chat URL from localStorage
    const loadSavedChatUrl = () => {
      const saved = localStorage.getItem('pathfinder-chatgpt-url')
      if (saved && saved.includes('/c/')) {
        savedChatUrl.value = saved
        webviewUrl.value = saved
      }
    }
    
    // Initialize on mount
    onMounted(async () => {
      // Load saved URL
      loadSavedChatUrl()
      
      // Welcome message for integrated AI
      messages.value.push({
        role: 'assistant',
        content: 'Welcome to the AI Assistant! I can help you generate NPCs, encounters, locations, and answer Pathfinder 1e rules questions. Use the quick action buttons above or type your request below.'
      })
      
      // Initialize webview/iframe
      await nextTick()
      if (isElectron.value) {
        initializeElectronWebview()
      } else {
        // For web browser, iframe will load automatically
        webviewReady.value = false
      }
      
      // Start keep-alive if previously active
      const keepAliveState = localStorage.getItem('pathfinder-keepalive')
      if (keepAliveState === 'true') {
        startKeepAlive()
      }
    })
    
    // Initialize Electron webview with improved error handling
    const initializeElectronWebview = () => {
      if (!electronWebviewContainer.value) {
        setTimeout(initializeElectronWebview, 100)
        return
      }
      
      console.log('Creating Electron webview...')
      
      try {
        // Create webview element dynamically
        const webview = document.createElement('webview')
        webview.src = webviewUrl.value
        webview.className = 'chatgpt-webview'
        
        // Set webview attributes with better security
        webview.setAttribute('partition', 'persist:chatgpt')
        webview.setAttribute('webpreferences', 'contextIsolation=false, nodeIntegration=false, sandbox=true')
        
        // Set preload script if available
        if (window.__dirname) {
          const preloadPath = `file://${window.__dirname}/preload-chatgpt.js`
          webview.setAttribute('preload', preloadPath)
        }
        
        // Add comprehensive event listeners
        webview.addEventListener('did-start-loading', onStartLoading)
        webview.addEventListener('did-stop-loading', onStopLoading)
        webview.addEventListener('dom-ready', onDomReady)
        webview.addEventListener('did-finish-load', onWebviewLoad)
        webview.addEventListener('did-navigate', onNavigate)
        webview.addEventListener('did-navigate-in-page', onNavigateInPage)
        webview.addEventListener('new-window', handleNewWindow)
        webview.addEventListener('console-message', onConsoleMessage)
        
        // Add error event listeners
        webview.addEventListener('did-fail-load', (event) => {
          console.error('Webview failed to load:', event)
          if (event.errorDescription) {
            console.error('Error description:', event.errorDescription)
          }
          chatStatus.value = 'inactive'
          webviewReady.value = false
        })
        
        webview.addEventListener('crashed', () => {
          console.error('Webview crashed')
          chatStatus.value = 'inactive'
          webviewReady.value = false
          // Optionally reload
          setTimeout(() => {
            if (electronWebview) {
              electronWebview.reload()
            }
          }, 1000)
        })
        
        webview.addEventListener('plugin-crashed', (event) => {
          console.error('Plugin crashed:', event)
        })
        
        webview.addEventListener('ipc-message', (event) => {
          console.log('IPC message from webview:', event.channel, event.args)
        })
        
        // Append to container
        electronWebviewContainer.value.appendChild(webview)
        electronWebview = webview
        
      } catch (error) {
        console.error('Failed to create webview:', error)
        webviewReady.value = false
        chatStatus.value = 'inactive'
      }
    }
    
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
      const location = currentLocation || 'a tavern'
      const prompt = `Generate a Pathfinder 1e NPC for the party to encounter in ${location}.`
      userInput.value = prompt
      await sendMessage()
    }
    
    const generateEncounter = async () => {
      const level = character?.level || 5
      const location = currentLocation || 'a dungeon'
      const prompt = `Create a balanced encounter for a level ${level} party in ${location}.`
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
    }
    
    // WebView/iframe event handlers
    const onStartLoading = () => {
      chatStatus.value = 'loading'
    }
    
    const onStopLoading = () => {
      if (chatUrl.value) {
        chatStatus.value = chatUrl.value.includes('/c/') ? 'active' : 'inactive'
      }
    }
    
    // Improved onDomReady with better error handling
    const onDomReady = async () => {
      console.log('ChatGPT DOM ready')
      if (!electronWebview) return
      
      // Add a small delay to ensure the webview is fully ready
      await new Promise(resolve => setTimeout(resolve, 500))
      
      try {
        // First, check if we can execute JavaScript
        const canExecute = await electronWebview.executeJavaScript('true').catch(() => false)
        if (!canExecute) {
          console.warn('Cannot execute JavaScript in webview yet')
          return
        }
        
        // Use a more compatible injection method
        await electronWebview.executeJavaScript(`
          try {
            // Pathfinder GM Assistant - Session Manager
            if (!window.isPathfinderSession) {
              console.log('Initializing Pathfinder session manager...');
              
              // Mark this as a Pathfinder session
              window.isPathfinderSession = true;
              
              // Store session start time
              window.pathfinderSessionStart = Date.now();
              
              // Override page visibility API safely
              if (typeof document !== 'undefined' && document.hidden !== undefined) {
                try {
                  Object.defineProperty(document, 'hidden', {
                    configurable: true,
                    get: function() { return false; }
                  });
                  
                  Object.defineProperty(document, 'visibilityState', {
                    configurable: true,
                    get: function() { return 'visible'; }
                  });
                } catch (e) {
                  console.log('Could not override visibility API:', e);
                }
              }
              
              // Add session indicator when ready
              const addIndicator = function() {
                try {
                  if (document.getElementById('pathfinder-session-indicator')) return;
                  
                  const indicator = document.createElement('div');
                  indicator.id = 'pathfinder-session-indicator';
                  indicator.innerHTML = '🎮 GM Session Active';
                  indicator.style.cssText = [
                    'position: fixed',
                    'top: 10px',
                    'right: 10px',
                    'background: rgba(76, 175, 80, 0.95)',
                    'color: white',
                    'padding: 6px 12px',
                    'border-radius: 20px',
                    'font-size: 11px',
                    'font-weight: 600',
                    'z-index: 10000',
                    'pointer-events: none',
                    'box-shadow: 0 2px 8px rgba(0,0,0,0.2)'
                  ].join(';');
                  
                  if (document.body) {
                    document.body.appendChild(indicator);
                  }
                } catch (e) {
                  console.log('Could not add indicator:', e);
                }
              };
              
              // Try to add indicator with retries
              const tryAddIndicator = function(retries) {
                if (retries <= 0) return;
                
                if (document.body) {
                  addIndicator();
                } else {
                  setTimeout(function() {
                    tryAddIndicator(retries - 1);
                  }, 500);
                }
              };
              
              tryAddIndicator(10); // Try up to 10 times
              
              console.log('Pathfinder session manager active');
            }
          } catch (error) {
            console.error('Session manager error:', error);
          }
        `)
      } catch (error) {
        console.error('Error injecting session manager:', error)
        // Don't throw - the webview can still be used without this enhancement
      }
    }
    
    const onWebviewLoad = () => {
      console.log('ChatGPT webview loaded')
      webviewReady.value = true
      
      if (electronWebview) {
        // Update navigation state
        canGoBack.value = electronWebview.canGoBack()
        canGoForward.value = electronWebview.canGoForward()
        
        // Get current URL
        chatUrl.value = electronWebview.getURL()
        
        // Save chat URL if it's a conversation
        if (chatUrl.value && chatUrl.value.includes('/c/')) {
          savedChatUrl.value = chatUrl.value
          localStorage.setItem('pathfinder-chatgpt-url', chatUrl.value)
          chatStatus.value = 'active'
        }
      }
      
      // Mark that we have a session
      localStorage.setItem('pathfinder-last-session', Date.now())
    }
    
    const onIframeLoad = () => {
      console.log('ChatGPT iframe loaded')
      webviewReady.value = true
      chatStatus.value = 'active'
      
      // Note: iframe has limited functionality due to cross-origin restrictions
      // Can't access content or inject scripts
    }
    
    const onNavigate = (event) => {
      if (!electronWebview) return
      
      chatUrl.value = event.url || electronWebview.getURL()
      canGoBack.value = electronWebview.canGoBack()
      canGoForward.value = electronWebview.canGoForward()
      
      // Update status
      chatStatus.value = chatUrl.value.includes('/c/') ? 'active' : 'inactive'
      
      // Save chat URL if it's a conversation
      if (chatUrl.value && chatUrl.value.includes('/c/')) {
        savedChatUrl.value = chatUrl.value
        localStorage.setItem('pathfinder-chatgpt-url', chatUrl.value)
      }
    }
    
    const onNavigateInPage = (event) => {
      if (event.url && event.url.includes('/c/')) {
        chatUrl.value = event.url
        savedChatUrl.value = event.url
        localStorage.setItem('pathfinder-chatgpt-url', event.url)
        chatStatus.value = 'active'
      }
    }
    
    // Updated onConsoleMessage to filter out non-critical messages
    const onConsoleMessage = (event) => {
      // Filter out known non-critical messages
      const ignoredMessages = [
        'Intercom not booted',
        'Failed to load resource',
        'Mixed Content'
      ]
      
      const shouldIgnore = ignoredMessages.some(msg => 
        event.message.toLowerCase().includes(msg.toLowerCase())
      )
      
      if (!shouldIgnore) {
        if (event.level === 2) { // Error level
          console.error('ChatGPT Console Error:', event.message)
        } else if (event.level === 1) { // Warning level
          console.warn('ChatGPT Console Warning:', event.message)
        } else {
          // Only log info messages in development
          if (process.env.NODE_ENV === 'development') {
            console.log('ChatGPT Console:', event.message)
          }
        }
      }
    }
    
    const handleNewWindow = (e) => {
      e.preventDefault()
      if (electronWebview && e.url) {
        if (e.url.includes('chatgpt.com') || e.url.includes('openai.com')) {
          electronWebview.loadURL(e.url)
        }
      }
    }
    
    // Navigation methods
    const navigateToChat = () => {
      if (electronWebview && savedChatUrl.value) {
        electronWebview.loadURL(savedChatUrl.value)
      } else if (!isElectron.value) {
        openInBrowser()
      }
    }
    
    const goBack = () => {
      if (electronWebview && electronWebview.canGoBack()) {
        electronWebview.goBack()
      }
    }
    
    const goForward = () => {
      if (electronWebview && electronWebview.canGoForward()) {
        electronWebview.goForward()
      }
    }
    
    const reload = () => {
      if (electronWebview) {
        electronWebview.reload()
      } else if (chatIframe.value) {
        chatIframe.value.src = chatIframe.value.src
      }
    }
    
    // Keep alive functionality
    const startKeepAlive = () => {
      if (keepAliveInterval) return
      
      keepAliveActive.value = true
      localStorage.setItem('pathfinder-keepalive', 'true')
      
      // Send keep-alive signal every 30 seconds
      keepAliveInterval = setInterval(() => {
        if (electronWebview) {
          try {
            electronWebview.executeJavaScript(`
              // Simulate activity
              document.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
              }));
              
              // Update indicator
              const indicator = document.getElementById('pathfinder-session-indicator');
              if (indicator) {
                indicator.style.background = 'rgba(76, 175, 80, 0.95)';
                indicator.innerHTML = '🎮 GM Session Active • ' + new Date().toLocaleTimeString();
              }
              
              console.log('Keep-alive signal sent');
            `)
          } catch (error) {
            console.error('Keep-alive error:', error)
          }
        }
      }, 30000)
    }
    
    const stopKeepAlive = () => {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval)
        keepAliveInterval = null
      }
      keepAliveActive.value = false
      localStorage.setItem('pathfinder-keepalive', 'false')
    }
    
    const keepAlive = () => {
      if (keepAliveActive.value) {
        stopKeepAlive()
      } else {
        startKeepAlive()
      }
    }
    
    // Context management
    const prepareGameContext = () => {
      const char = character || null
      const location = currentLocation || 'Unknown Location'
      const notes = sessionNotes || ''
      
      const context = {
        character: char ? {
          name: char.name,
          level: char.level,
          class: char.class,
          race: char.race,
          hp: `${char.currentHp}/${char.maxHp}`
        } : null,
        location: location,
        sessionNotes: notes,
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
        showNotification('✅ Context copied!')
      } catch (error) {
        console.error('Failed to copy context:', error)
      }
    }
    
    // Safer injection method for the context
    const injectContext = async () => {
      if (!electronWebview) {
        copyContext()
        showNotification('📋 Context copied! Paste it into ChatGPT.')
        return
      }
      
      const context = prepareGameContext()
      
      try {
        // First check if we can execute JavaScript
        const canExecute = await electronWebview.executeJavaScript('true').catch(() => false)
        if (!canExecute) {
          console.warn('Cannot execute JavaScript in webview')
          copyContext()
          showNotification('📋 Context copied! Paste it into ChatGPT.')
          return
        }
        
        // Use a safer injection method that doesn't rely on complex string escaping
        const result = await electronWebview.executeJavaScript(`
          (function() {
            try {
              const context = ${JSON.stringify(context)};
              
              // Try multiple selectors
              const selectors = [
                'textarea[id="prompt-textarea"]',
                'textarea[data-id="prompt-textarea"]',
                'textarea[placeholder*="Message"]',
                'div[contenteditable="true"][role="textbox"]',
                'textarea.m-0.w-full',
                'textarea'
              ];
              
              let element = null;
              for (const selector of selectors) {
                try {
                  element = document.querySelector(selector);
                  if (element) {
                    console.log('Found element with selector:', selector);
                    break;
                  }
                } catch (e) {
                  console.error('Selector error:', e);
                }
              }
              
              if (element) {
                if (element.tagName === 'TEXTAREA') {
                  element.value = context;
                  element.dispatchEvent(new Event('input', { bubbles: true }));
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                  element.focus();
                } else if (element.contentEditable === 'true') {
                  element.textContent = context;
                  element.focus();
                  
                  // Trigger input event for contenteditable
                  const inputEvent = new Event('input', { 
                    bubbles: true,
                    cancelable: true,
                  });
                  element.dispatchEvent(inputEvent);
                }
                
                return { success: true, message: 'Context injected' };
              }
              
              return { success: false, message: 'No input element found' };
            } catch (e) {
              return { success: false, message: e.toString() };
            }
          })();
        `)
        
        if (result && result.success) {
          showNotification('📋 Context inserted!')
        } else {
          console.warn('Injection failed:', result?.message)
          copyContext()
          showNotification('📋 Context copied! Paste it into ChatGPT.')
        }
      } catch (error) {
        console.error('Failed to inject context:', error)
        copyContext()
        showNotification('📋 Context copied! Paste it into ChatGPT.')
      }
    }
    
    const showNotification = (message) => {
      const notification = document.createElement('div')
      notification.textContent = message
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 9999;
        animation: fadeInOut 2s ease;
      `
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 2000)
    }
    
    const openInBrowser = () => {
      if (savedChatUrl.value) {
        window.open(savedChatUrl.value, '_blank')
      } else {
        window.open('https://chatgpt.com', '_blank')
      }
    }
    
    // Clean up
    onUnmounted(() => {
      // Stop keep-alive
      stopKeepAlive()
      
      // Save current state
      if (chatUrl.value && chatUrl.value.includes('/c/')) {
        localStorage.setItem('pathfinder-chatgpt-url', chatUrl.value)
      }
      
      // Clean up webview
      if (electronWebview) {
        electronWebview.removeEventListener('did-start-loading', onStartLoading)
        electronWebview.removeEventListener('did-stop-loading', onStopLoading)
        electronWebview.removeEventListener('dom-ready', onDomReady)
        electronWebview.removeEventListener('did-finish-load', onWebviewLoad)
        electronWebview.removeEventListener('did-navigate', onNavigate)
        electronWebview.removeEventListener('did-navigate-in-page', onNavigateInPage)
        electronWebview.removeEventListener('new-window', handleNewWindow)
        electronWebview.removeEventListener('console-message', onConsoleMessage)
      }
    })
    
    return {
      // Data
      activeTab,
      messages,
      userInput,
      canGoBack,
      canGoForward,
      isElectron,
      messagesContainer,
      chatIframe,
      electronWebviewContainer,
      webviewContainer,
      webviewReady,
      webviewUrl,
      chatUrl,
      savedChatUrl,
      displayUrl,
      chatStatus,
      keepAliveActive,
      
      // Methods
      sendMessage,
      generateNPC,
      generateEncounter,
      generateLocation,
      answerRule,
      onIframeLoad,
      navigateToChat,
      goBack,
      goForward,
      reload,
      copyContext,
      injectContext,
      keepAlive,
      openInBrowser
    }
  }
}
</script>

<style scoped>
.chatgpt-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

/* Tab Navigation */
.chat-tabs {
  display: flex;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  position: relative;
  z-index: 10;
  flex-shrink: 0; /* Prevent tabs from shrinking */
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
  position: relative;
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

.status-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 8px;
}

.status-indicator.active {
  color: #4CAF50;
}

.status-indicator.loading {
  color: #ff9800;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.icon {
  font-size: 18px;
}

/* Content Container - Fixed to ensure proper sizing */
.content-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0; /* Important for Firefox flex children */
  width: 100%;
}

/* Tab Content - Always rendered but hidden when not active */
.integrated-content,
.web-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s, visibility 0.2s;
  width: 100%;
  height: 100%;
}

.hidden-tab {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* Integrated AI Content */
.integrated-content {
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

/* Web Content - Ensure proper layout */
.web-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.webview-controls {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  gap: 10px;
  flex-shrink: 0; /* Prevent controls from shrinking */
  min-height: 56px; /* Ensure minimum height */
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
  flex-shrink: 0;
}

.nav-button:hover:not(:disabled) {
  background: #444;
  color: white;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-button {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.chat-button:hover {
  background: #45a049;
}

.url-display {
  padding: 6px 12px;
  background: #1a1a1a;
  border-radius: 4px;
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spacer {
  flex: 1;
  min-width: 0; /* Allow spacer to shrink */
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
  flex-shrink: 0;
  white-space: nowrap;
}

.context-button:hover {
  background: #444;
  color: white;
}

.context-button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

/* Webview Container - Ensure it takes all available space */
.webview-container {
  flex: 1;
  position: relative;
  background: #1a1a1a;
  width: 100%;
  min-height: 0; /* Important for flex children */
  overflow: hidden;
}

.electron-webview-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.chatgpt-webview {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: white;
  opacity: 1;
  transition: opacity 0.3s;
  border: none;
}

webview {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: white;
  border: none;
}

.webview-hidden {
  opacity: 0;
}

.webview-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.loading-content {
  text-align: center;
  color: #888;
}

.loading-spinner-large {
  font-size: 48px;
  animation: spin 2s linear infinite;
  margin-bottom: 20px;
}

.loading-note {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.inline-link {
  background: none;
  border: none;
  color: #4CAF50;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}

.inline-link:hover {
  color: #45a049;
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

/* Fade animation for notifications */
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}
</style>