// electron/preload-minimal.js
const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods
contextBridge.exposeInMainWorld('electronAPI', {
  // Basic functionality
  platform: process.platform,
  
  // IPC communication
  send: (channel, data) => {
    const validChannels = [
      'menu-new-session',
      'menu-open-session', 
      'menu-save-session',
      'menu-export-character',
      'menu-import-character',
      'menu-open-dice-roller',
      'menu-open-combat-tracker',
      'menu-open-chatgpt-tab'
    ]
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  
  receive: (channel, func) => {
    const validChannels = [
      'menu-new-session',
      'menu-open-session',
      'menu-save-session',
      'menu-export-character',
      'menu-import-character',
      'menu-open-dice-roller',
      'menu-open-combat-tracker',
      'menu-open-chatgpt-tab'
    ]
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  
  // File operations
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  openFile: (options) => ipcRenderer.invoke('open-file', options),
  
  // ChatGPT operations
  injectToChatGPT: (content) => ipcRenderer.invoke('inject-to-chatgpt', content),
  autoSendChatGPT: () => ipcRenderer.invoke('auto-send-chatgpt'),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getPreloadPath: () => ipcRenderer.invoke('get-preload-path')
})

// Flag to indicate Electron environment
contextBridge.exposeInMainWorld('isElectron', true)

// Expose the directory path for webview preload resolution
contextBridge.exposeInMainWorld('electronPath', {
  dirname: __dirname
})