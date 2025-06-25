// electron/main.cjs
const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')

// Keep a global reference of the window objects
let mainWindow
let chatGPTWindow

// Enable live reload for Electron in development
const isDev = process.argv.includes('--dev')

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../build/icon.png'),
    titleBarStyle: 'default',
    show: false
  })

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
    if (chatGPTWindow && !chatGPTWindow.isDestroyed()) {
      chatGPTWindow.close()
    }
  })
}

// Create app menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Session',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu-new-session')
        },
        {
          label: 'Open Session',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu-open-session')
        },
        {
          label: 'Save Session',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-save-session')
        },
        { type: 'separator' },
        {
          label: 'Export Character',
          click: () => mainWindow.webContents.send('menu-export-character')
        },
        {
          label: 'Import Character',
          click: () => mainWindow.webContents.send('menu-import-character')
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Open ChatGPT',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            if (!chatGPTWindow || chatGPTWindow.isDestroyed()) {
              createChatGPTWindow()
            } else {
              chatGPTWindow.focus()
            }
          }
        },
        {
          label: 'Dice Roller',
          accelerator: 'CmdOrCtrl+D',
          click: () => mainWindow.webContents.send('menu-open-dice-roller')
        },
        {
          label: 'Combat Tracker',
          accelerator: 'CmdOrCtrl+T',
          click: () => mainWindow.webContents.send('menu-open-combat-tracker')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://github.com/evilboydevil666/MyProject/wiki')
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/evilboydevil666/MyProject/issues')
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About RPG Narrator',
              message: 'RPG Narrator',
              detail: 'A Pathfinder 1e Digital Game Master Assistant\n\nVersion: 0.0.0\n\nBuilt with Vue.js, Vite, and Electron',
              buttons: ['OK']
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createChatGPTWindow() {
  chatGPTWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: mainWindow.getBounds().x + mainWindow.getBounds().width,
    y: mainWindow.getBounds().y,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  
  chatGPTWindow.loadURL('https://chat.openai.com')
  
  chatGPTWindow.on('closed', () => {
    chatGPTWindow = null
  })
}

// App event handlers
app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers
// Handle direct ChatGPT injection
ipcMain.handle('inject-to-chatgpt', async (event, content) => {
  try {
    // Create or focus ChatGPT window
    if (!chatGPTWindow || chatGPTWindow.isDestroyed()) {
      createChatGPTWindow()
      
      // Wait for page to load
      await new Promise(resolve => {
        chatGPTWindow.webContents.once('did-finish-load', resolve)
      })
      
      // Additional wait for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Inject content directly
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

// Auto-send the message
ipcMain.handle('auto-send-chatgpt', async () => {
  if (!chatGPTWindow || chatGPTWindow.isDestroyed()) {
    return { success: false, message: 'ChatGPT window not open' }
  }
  
  try {
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
  } catch (error) {
    console.error('Auto-send error:', error)
    return { success: false, message: error.message }
  }
})

// File system operations
ipcMain.handle('save-file', async (event, { fileName, content, filters }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: fileName,
      filters: filters || [{ name: 'JSON Files', extensions: ['json'] }]
    })
    
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, content, 'utf-8')
      return { success: true, path: result.filePath }
    }
    
    return { success: false, canceled: true }
  } catch (error) {
    console.error('Save file error:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('open-file', async (event, { filters }) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: filters || [{ name: 'JSON Files', extensions: ['json'] }]
    })
    
    if (!result.canceled) {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8')
      return { success: true, content, path: result.filePaths[0] }
    }
    
    return { success: false, canceled: true }
  } catch (error) {
    console.error('Open file error:', error)
    return { success: false, error: error.message }
  }
})

// Get app version
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

// Open external links
ipcMain.handle('open-external', async (event, url) => {
  shell.openExternal(url)
})