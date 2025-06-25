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
    version: '1.0.0',
    
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
      // Find the main textarea
      findTextarea: () => {
        const selectors = [
          'textarea[id="prompt-textarea"]',
          'textarea[data-id]',
          'textarea[placeholder*="Message"]',
          'textarea.m-0',
          'textarea'
        ]
        
        for (const selector of selectors) {
          const textarea = document.querySelector(selector)
          if (textarea) return textarea
        }
        
        return null
      },
      
      // Find the send button
      findSendButton: () => {
        const selectors = [
          'button[data-testid="send-button"]',
          'button[aria-label*="Send"]',
          'button svg[width="32"]', // The send icon
          'form button:last-child'
        ]
        
        for (const selector of selectors) {
          const button = document.querySelector(selector)
          if (button) return button.closest('button') || button
        }
        
        return null
      },
      
      // Insert text into ChatGPT
      insertText: (text) => {
        const textarea = window.pathfinderBridge.helpers.findTextarea()
        if (!textarea) {
          console.error('Could not find ChatGPT textarea')
          return false
        }
        
        // Set the value
        textarea.value = text
        
        // Trigger events to update React state
        const inputEvent = new Event('input', { bubbles: true })
        textarea.dispatchEvent(inputEvent)
        
        // Also try other event types that might be needed
        const changeEvent = new Event('change', { bubbles: true })
        textarea.dispatchEvent(changeEvent)
        
        // Focus the textarea
        textarea.focus()
        
        // Adjust height if it's auto-resizing
        if (textarea.style.height) {
          textarea.style.height = 'auto'
          textarea.style.height = textarea.scrollHeight + 'px'
        }
        
        return true
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
        
        // Try to find message containers
        const messageContainers = document.querySelectorAll('[data-message-id]')
        
        messageContainers.forEach(container => {
          const role = container.querySelector('[data-message-author-role]')?.getAttribute('data-message-author-role') || 'unknown'
          const content = container.querySelector('.markdown')?.textContent || container.textContent || ''
          
          messages.push({
            role: role,
            content: content.trim()
          })
        })
        
        return messages
      },
      
      // Monitor for new messages
      observeMessages: (callback) => {
        const targetNode = document.querySelector('main') || document.body
        
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              // Check if new messages were added
              const newMessages = window.pathfinderBridge.helpers.getConversation()
              if (newMessages.length > 0) {
                callback(newMessages)
              }
            }
          }
        })
        
        observer.observe(targetNode, {
          childList: true,
          subtree: true
        })
        
        return observer
      }
    }
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
  `
  document.head.appendChild(style)
  
  // Listen for messages from the parent window
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PATHFINDER_INJECT') {
      const { action, data } = event.data
      
      switch (action) {
        case 'insertText':
          window.pathfinderBridge.helpers.insertText(data)
          break
        case 'sendMessage':
          window.pathfinderBridge.helpers.sendMessage()
          break
        case 'getConversation':
          const conversation = window.pathfinderBridge.helpers.getConversation()
          window.pathfinderBridge.sendToApp({
            action: 'conversationData',
            data: conversation
          })
          break
      }
    }
  })
  
  // Notify that the bridge is ready
  console.log('Pathfinder Bridge initialized:', window.pathfinderBridge)
})