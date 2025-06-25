// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow
let chatGPTWindow

// Handle direct ChatGPT injection
ipcMain.handle('inject-to-chatgpt', async (event, content) => {
  try {
    // Create or focus ChatGPT window
    if (!chatGPTWindow || chatGPTWindow.isDestroyed()) {
      chatGPTWindow = new BrowserWindow({
        width: 800,
        height: 600,
        x: mainWindow.getBounds().x + mainWindow.getBounds().width,
        y: mainWindow.getBounds().y
      })
      
      // Load ChatGPT
      await chatGPTWindow.loadURL('https://chat.openai.com')
      
      // Wait a bit for page to fully load
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Inject content directly - NO CLIPBOARD NEEDED!
    const injected = await chatGPTWindow.webContents.executeJavaScript(`
      (function() {
        // Find the textarea (ChatGPT might change selectors)
        const selectors = [
          'textarea[id="prompt-textarea"]',
          'textarea[data-id]',
          'textarea[placeholder*="Message"]',
          'textarea.m-0'
        ];
        
        let textarea = null;
        for (const selector of selectors) {
          textarea = document.querySelector(selector);
          if (textarea) break;
        }
        
        if (textarea) {
          // Clear existing content
          textarea.value = '';
          
          // Set new content
          textarea.value = ${JSON.stringify(content)};
          
          // Trigger React's onChange
          const inputEvent = new Event('input', { bubbles: true });
          textarea.dispatchEvent(inputEvent);
          
          // Also trigger a change event
          const changeEvent = new Event('change', { bubbles: true });
          textarea.dispatchEvent(changeEvent);
          
          // Focus the textarea
          textarea.focus();
          
          // Enable send button if needed
          const sendButton = document.querySelector('button[data-testid="send-button"]');
          if (sendButton && sendButton.disabled) {
            sendButton.disabled = false;
          }
          
          return { success: true, message: 'Content injected successfully' };
        } else {
          return { success: false, message: 'Could not find ChatGPT input field' };
        }
      })()
    `)
    
    return injected
    
  } catch (error) {
    console.error('Injection error:', error)
    return { success: false, message: error.message }
  }
})

// Optional: Auto-send the message
ipcMain.handle('auto-send-chatgpt', async () => {
  if (!chatGPTWindow || chatGPTWindow.isDestroyed()) {
    return { success: false, message: 'ChatGPT window not open' }
  }
  
  const sent = await chatGPTWindow.webContents.executeJavaScript(`
    (function() {
      const sendButton = document.querySelector('button[data-testid="send-button"]');
      if (sendButton && !sendButton.disabled) {
        sendButton.click();
        return { success: true };
      }
      return { success: false, message: 'Send button not found or disabled' };
    })()
  `)
  
  return sent
})