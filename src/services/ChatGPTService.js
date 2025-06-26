// src/services/ChatGPTService.js
import { ref } from 'vue'

class ChatGPTService {
  constructor() {
    this.webviewRef = ref(null)
    this.messageQueue = []
  }

  setWebviewRef(ref) {
    this.webviewRef.value = ref
    // Process any queued messages
    this.processQueue()
  }

  async sendToChatGPT(content, options = {}) {
    if (!this.webviewRef.value) {
      // Queue the message if webview isn't ready
      this.messageQueue.push({ content, options })
      console.log('ChatGPT webview not ready, message queued')
      return false
    }

    try {
      // Send to webview in background
      await this.webviewRef.value.executeJavaScript(`
        (function() {
          const textarea = document.querySelector('textarea[data-id="root"]');
          if (textarea) {
            textarea.value = ${JSON.stringify(content)};
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Only auto-submit if specified
            ${options.autoSubmit ? `
              const sendButton = textarea.parentElement.querySelector('button[data-testid="send-button"]');
              if (sendButton && !sendButton.disabled) {
                setTimeout(() => sendButton.click(), 100);
              }
            ` : ''}
            
            return true;
          }
          return false;
        })()
      `)

      // Show notification instead of switching tabs
      if (options.showNotification !== false) {
        this.showNotification('Content sent to ChatGPT! 🌐')
      }

      return true
    } catch (error) {
      console.error('Failed to send to ChatGPT:', error)
      return false
    }
  }

  processQueue() {
    while (this.messageQueue.length > 0) {
      const { content, options } = this.messageQueue.shift()
      this.sendToChatGPT(content, options)
    }
  }

  showNotification(message) {
    // Create a toast notification
    const notification = document.createElement('div')
    notification.className = 'chatgpt-notification'
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #10a37f;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
}

export const chatGPTService = new ChatGPTService()

// Add CSS for animations
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)