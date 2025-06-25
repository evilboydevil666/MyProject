import { ref } from 'vue'

export function useElectron() {
  const isElectron = ref(window.isElectron || false)
  
  // ChatGPT integration
  const injectToChatGPT = async (content) => {
    if (!window.electronAPI) return { success: false, message: 'Not in Electron' }
    return await window.electronAPI.injectToChatGPT(content)
  }
  
  const autoSendChatGPT = async () => {
    if (!window.electronAPI) return { success: false, message: 'Not in Electron' }
    return await window.electronAPI.autoSendChatGPT()
  }
  
  // File operations
  const saveFile = async (fileName, content, filters) => {
    if (!window.electronAPI) {
      // Fallback for web - use browser download
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
      return { success: true }
    }
    
    return await window.electronAPI.saveFile({ fileName, content, filters })
  }
  
  const openFile = async (filters) => {
    if (!window.electronAPI) {
      // Fallback for web - use file input
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = filters?.[0]?.extensions?.map(ext => `.${ext}`).join(',') || '*'
        input.onchange = async (e) => {
          const file = e.target.files[0]
          if (file) {
            const content = await file.text()
            resolve({ success: true, content })
          } else {
            resolve({ success: false, canceled: true })
          }
        }
        input.click()
      })
    }
    
    return await window.electronAPI.openFile({ filters })
  }
  
  // Listen for menu actions
  const onMenuAction = (callback) => {
    if (window.electronAPI) {
      window.electronAPI.onMenuAction(callback)
    }
  }
  
  return {
    isElectron,
    injectToChatGPT,
    autoSendChatGPT,
    saveFile,
    openFile,
    onMenuAction
  }
}