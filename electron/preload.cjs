// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // ChatGPT Integration
  injectToChatGPT: (content) => ipcRenderer.invoke('inject-to-chatgpt', content),
  autoSendChatGPT: () => ipcRenderer.invoke('auto-send-chatgpt'),
  
  // File operations
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  openFile: (options) => ipcRenderer.invoke('open-file', options),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // Menu events (from main to renderer)
  onMenuAction: (callback) => {
    const events = [
      'menu-new-session',
      'menu-open-session',
      'menu-save-session',
      'menu-export-character',
      'menu-import-character',
      'menu-open-dice-roller',
      'menu-open-combat-tracker',
      'menu-open-chatgpt-tab'
    ]
    
    events.forEach(event => {
      ipcRenderer.on(event, (_, ...args) => callback(event, ...args))
    })
  },
  
  // Remove listeners
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners()
  }
})

// Add a flag to indicate we're running in Electron
contextBridge.exposeInMainWorld('isElectron', true)

// Expose path utilities for the renderer to use
contextBridge.exposeInMainWorld('electronPath', {
  join: (...args) => path.join(...args),
  dirname: __dirname,
  resolve: (...args) => path.resolve(...args),
  relative: (from, to) => path.relative(from, to)
})