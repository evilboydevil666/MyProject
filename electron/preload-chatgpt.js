// electron/preload-chatgpt.js
// This preload script is injected into the ChatGPT webview
// It provides a secure bridge for communication

window.addEventListener('DOMContentLoaded', () => {
  console.log('ChatGPT preload script loaded')
  
  // Remove access to Node.js APIs for security
  delete window.require
  delete window.exports
  delete window.module
  
  // Create a safe communication bridge
  window.pathfinderBridge = {
    // Version info
    version: '1.0.1',
    
    // Receive context from the main app
    receiveContext: null,
    
    // Send messages back to the app
    sendToApp: (message) => {
      window.postMessage({
        type: 'PATHFINDER_MESSAGE',
        data: message
      }, '*')
    },
    
    // Helper to find and interact with ChatGPT elements
    helpers: {
      // Find the main textarea with better error handling
      findTextarea: () => {
        const selectors = [
          'textarea[id="prompt-textarea"]',
          'textarea[data-id="prompt-textarea"]',
          'textarea[placeholder*="Message"]',
          'div[contenteditable="true"][role="textbox"]',
          'textarea.m-0.w-full',
          'textarea'
        ]
        
        for (const selector of selectors) {
          try {
            const element = document.querySelector(selector)
            if (element) {
              console.log('Found textarea with selector:', selector)
              return element
            }
          } catch (e) {
            console.error('Selector error:', e)
          }
        }
        
        return null
      },
      
      // Find the send button
      findSendButton: () => {
        const selectors = [
          'button[data-testid="send-button"]',
          'button[aria-label*="Send"]',
          'button svg[width="32"]', // The send icon
          'form button:last-child',
          'button:has(svg)'
        ]
        
        for (const selector of selectors) {
          try {
            const element = document.querySelector(selector)
            if (element) {
              const button = element.closest('button') || element
              if (button && button.tagName === 'BUTTON') {
                return button
              }
            }
          } catch (e) {
            // :has() selector might not be supported
            continue
          }
        }
        
        return null
      },
      
      // Insert text into ChatGPT with better handling
      insertText: (text) => {
        const element = window.pathfinderBridge.helpers.findTextarea()
        if (!element) {
          console.error('Could not find ChatGPT input element')
          return false
        }
        
        try {
          if (element.tagName === 'TEXTAREA') {
            // Handle textarea
            element.value = text
            
            // Trigger various events to ensure React updates
            const inputEvent = new Event('input', { bubbles: true, cancelable: true })
            element.dispatchEvent(inputEvent)
            
            const changeEvent = new Event('change', { bubbles: true, cancelable: true })
            element.dispatchEvent(changeEvent)
            
            // Focus the textarea
            element.focus()
            
            // Adjust height if it's auto-resizing
            if (element.style.height) {
              element.style.height = 'auto'
              element.style.height = element.scrollHeight + 'px'
            }
          } else if (element.contentEditable === 'true') {
            // Handle contenteditable div
            element.textContent = text
            element.focus()
            
            // For contenteditable, we need different events
            const inputEvent = new InputEvent('input', { 
              bubbles: true,
              cancelable: true,
              inputType: 'insertText',
              data: text
            })
            element.dispatchEvent(inputEvent)
            
            // Move cursor to end
            const range = document.createRange()
            const sel = window.getSelection()
            range.selectNodeContents(element)
            range.collapse(false)
            sel.removeAllRanges()
            sel.addRange(range)
          }
          
          console.log('Text inserted successfully')
          return true
        } catch (error) {
          console.error('Error inserting text:', error)
          return false
        }
      },
      
      // Send the current message
      sendMessage: () => {
        const button = window.pathfinderBridge.helpers.findSendButton()
        if (!button) {
          console.error('Could not find send button')
          return false
        }
        
        // Check if button is disabled
        if (button.disabled) {
          console.warn('Send button is disabled')
          return false
        }
        
        button.click()
        return true
      },
      
      // Get the current conversation
      getConversation: () => {
        const messages = []
        
        // Try multiple strategies to find messages
        const strategies = [
          // Strategy 1: Look for data-message-id
          () => {
            const containers = document.querySelectorAll('[data-message-id]')
            containers.forEach(container => {
              const role = container.querySelector('[data-message-author-role]')?.getAttribute('data-message-author-role') || 'unknown'
              const content = container.querySelector('.markdown')?.textContent || container.textContent || ''
              messages.push({ role, content: content.trim() })
            })
          },
          
          // Strategy 2: Look for specific class patterns
          () => {
            const containers = document.querySelectorAll('.group.w-full')
            containers.forEach(container => {
              const isUser = container.querySelector('.bg-gray-50') !== null
              const role = isUser ? 'user' : 'assistant'
              const content = container.querySelector('.prose')?.textContent || container.textContent || ''
              if (content.trim()) {
                messages.push({ role, content: content.trim() })
              }
            })
          }
        ]
        
        // Try each strategy
        for (const strategy of strategies) {
          try {
            strategy()
            if (messages.length > 0) break
          } catch (e) {
            console.error('Strategy failed:', e)
          }
        }
        
        return messages
      },
      
      // Monitor for new messages
      observeMessages: (callback) => {
        const targetNode = document.querySelector('main') || document.body
        let lastMessageCount = 0
        
        const observer = new MutationObserver((mutations) => {
          // Debounce to avoid too many callbacks
          clearTimeout(observer.debounceTimer)
          observer.debounceTimer = setTimeout(() => {
            const messages = window.pathfinderBridge.helpers.getConversation()
            if (messages.length !== lastMessageCount) {
              lastMessageCount = messages.length
              callback(messages)
            }
          }, 500)
        })
        
        observer.observe(targetNode, {
          childList: true,
          subtree: true,
          characterData: true
        })
        
        return observer
      }
    }
  }
  
  // Enhanced session management
  try {
    // Override visibility API to prevent session timeout
    if (typeof document !== 'undefined') {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false
      })
      
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => 'visible'
      })
      
      // Override the visibilitychange event
      const originalAddEventListener = document.addEventListener
      document.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange') {
          console.log('Blocked visibilitychange listener')
          return
        }
        return originalAddEventListener.call(this, type, listener, options)
      }
    }
  } catch (e) {
    console.warn('Could not override visibility API:', e)
  }
  
  // Auto-inject styles to improve embedded experience
  const style = document.createElement('style')
  style.textContent = `
    /* Hide elements that aren't needed in embedded mode */
    .md\\:pl-60 { padding-left: 0 !important; } /* Remove sidebar padding */
    
    /* Improve dark mode appearance */
    .dark { background-color: #1a1a1a !important; }
    
    /* Make the interface more compact */
    .pt-6 { padding-top: 1rem !important; }
    .pb-6 { padding-bottom: 1rem !important; }
    
    /* Hide promotional banners */
    [data-testid="plus-upgrade-button"] { display: none !important; }
    
    /* Custom scrollbar for better integration */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #2a2a2a;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
    
    /* Pathfinder session indicator */
    #pathfinder-session-indicator {
      position: fixed !important;
      top: 10px !important;
      right: 10px !important;
      background: rgba(76, 175, 80, 0.95) !important;
      color: white !important;
      padding: 6px 12px !important;
      border-radius: 20px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      z-index: 999999 !important;
      pointer-events: none !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }
  `
  document.head.appendChild(style)
  
  // Add session indicator with retry logic
  const addSessionIndicator = () => {
    if (document.getElementById('pathfinder-session-indicator')) return
    
    const indicator = document.createElement('div')
    indicator.id = 'pathfinder-session-indicator'
    indicator.innerHTML = '🎮 GM Session Active'
    
    if (document.body) {
      document.body.appendChild(indicator)
      console.log('Session indicator added')
    }
  }
  
  // Try to add indicator with retries
  let retries = 0
  const tryAddIndicator = () => {
    if (retries >= 10) return
    
    if (document.body) {
      addSessionIndicator()
    } else {
      retries++
      setTimeout(tryAddIndicator, 1000)
    }
  }
  
  tryAddIndicator()
  
  // Listen for messages from the parent window
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PATHFINDER_INJECT') {
      const { action, data } = event.data
      
      switch (action) {
        case 'insertText':
          const success = window.pathfinderBridge.helpers.insertText(data)
          window.pathfinderBridge.sendToApp({
            action: 'insertResult',
            success: success
          })
          break
          
        case 'sendMessage':
          const sent = window.pathfinderBridge.helpers.sendMessage()
          window.pathfinderBridge.sendToApp({
            action: 'sendResult',
            success: sent
          })
          break
          
        case 'getConversation':
          const conversation = window.pathfinderBridge.helpers.getConversation()
          window.pathfinderBridge.sendToApp({
            action: 'conversationData',
            data: conversation
          })
          break
          
        case 'ping':
          window.pathfinderBridge.sendToApp({
            action: 'pong',
            timestamp: Date.now()
          })
          break
      }
    }
  })
  
  // Periodic activity simulation to prevent timeout
  setInterval(() => {
    try {
      // Simulate mouse movement
      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: Math.random() * window.innerWidth,
        clientY: Math.random() * window.innerHeight
      }))
      
      // Update session indicator
      const indicator = document.getElementById('pathfinder-session-indicator')
      if (indicator) {
        indicator.innerHTML = `🎮 GM Session Active • ${new Date().toLocaleTimeString()}`
      }
    } catch (e) {
      // Silent fail
    }
  }, 30000) // Every 30 seconds
  
  // Notify that the bridge is ready
  console.log('Pathfinder Bridge initialized:', window.pathfinderBridge)
  
  // Send ready message
  window.pathfinderBridge.sendToApp({
    action: 'bridgeReady',
    version: window.pathfinderBridge.version
  })
})