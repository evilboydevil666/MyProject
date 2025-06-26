// electron/main.cjs
const { app, BrowserWindow, ipcMain, Menu, dialog, shell, session } = require('electron')
const path = require('path')
const fs = require('fs')

// Keep a global reference of the window objects
let mainWindow
let chatGPTWindow

// Enable live reload for Electron in development
const isDev = process.argv.includes('--dev')

function createWindow() {
  // Try to use the minimal preload first, fallback to regular preload
  let preloadPath = path.join(__dirname, 'preload-minimal.js')
  
  // If minimal doesn't exist, try the regular one
  if (!fs.existsSync(preloadPath)) {
    preloadPath = path.join(__dirname, 'preload.cjs')
  }
  
  // Log for debugging
  console.log('Using preload:', preloadPath)
  console.log('Preload exists:', fs.existsSync(preloadPath))
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: fs.existsSync(preloadPath) ? preloadPath : undefined,
      webviewTag: true // Enable webview tag for embedded ChatGPT
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
  
  // Handle webview permission requests
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    // Allow webview to load external content
    if (permission === 'media' || permission === 'geolocation' || permission === 'notifications') {
      callback(false) // Deny these permissions for security
    } else {
      callback(true) // Allow other permissions
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
          label: 'Open ChatGPT (External)',
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
          label: 'ChatGPT Tab',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => mainWindow.webContents.send('menu-open-chatgpt-tab')
        },
        { type: 'separator' },
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

// Configure webview settings when app is ready
function configureWebviewSecurity() {
  // Configure the webview partition
  const chatGPTPartition = session.fromPartition('persist:chatgpt')
  
  // Set a custom user agent to avoid detection issues
  chatGPTPartition.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  )
  
  // Handle certificate errors gracefully
  chatGPTPartition.setCertificateVerifyProc((request, callback) => {
    // Only allow OpenAI domains
    const allowedHosts = ['chatgpt.com', 'openai.com', 'auth0.com', 'oaistatic.com', 'oaiusercontent.com']
    const isAllowed = allowedHosts.some(host => request.hostname.endsWith(host))
    callback(isAllowed ? 0 : -2)
  })
  
  // Configure webRequest to handle CORS and cookies
  chatGPTPartition.webRequest.onBeforeSendHeaders((details, callback) => {
    // Ensure proper headers for ChatGPT
    const headers = details.requestHeaders
    headers['Origin'] = 'https://chatgpt.com'
    headers['Referer'] = 'https://chatgpt.com/'
    
    // Remove problematic headers
    delete headers['x-frame-options']
    delete headers['x-content-type-options']
    
    callback({ requestHeaders: headers })
  })
  
  // Handle response headers to allow embedding
  chatGPTPartition.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders
    
    // Remove headers that prevent embedding
    delete headers['x-frame-options']
    delete headers['frame-options']
    delete headers['content-security-policy']
    
    callback({ responseHeaders: headers })
  })
  
  // Handle webview permissions
  chatGPTPartition.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['clipboard-read', 'clipboard-write', 'storage']
    if (allowedPermissions.includes(permission)) {
      callback(true)
    } else {
      callback(false)
    }
  })
  
  // Clear service workers that might interfere
  chatGPTPartition.clearStorageData({
    storages: ['serviceworkers']
  })
}

// App event handlers
app.whenReady().then(() => {
  // Configure webview security settings
  configureWebviewSecurity()
  
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
  // Set up webview preferences with better error handling
  app.on('web-contents-created', (event, contents) => {
    // Handle webview attachment
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      // Delete any default preload that might cause issues
      delete webPreferences.preloadURL
      
      // Set secure defaults
      webPreferences.nodeIntegration = false
      webPreferences.nodeIntegrationInSubFrames = false
      webPreferences.contextIsolation = true
      webPreferences.sandbox = true
      webPreferences.webSecurity = true
      webPreferences.allowRunningInsecureContent = false
      
      // Allow preload scripts from our app for ChatGPT
      if (params.src && (params.src.includes('chatgpt.com') || params.src.includes('chat.openai.com'))) {
        const chatGPTPreloadPath = path.join(__dirname, 'preload-chatgpt.js')
        console.log('ChatGPT webview preload path:', chatGPTPreloadPath)
        console.log('ChatGPT preload exists:', fs.existsSync(chatGPTPreloadPath))
        
        if (fs.existsSync(chatGPTPreloadPath)) {
          webPreferences.preload = chatGPTPreloadPath
          console.log('ChatGPT preload script attached')
        } else {
          console.warn('ChatGPT preload script not found, webview will load without it')
        }
        
        // Set partition for persistent session
        webPreferences.partition = 'persist:chatgpt'
      }
    })
    
    // Monitor webview events
    contents.on('did-attach-webview', (event, webContents) => {
      console.log('Webview attached:', webContents.id)
      
      // Configure webview webContents
      webContents.setWindowOpenHandler(({ url }) => {
        // Handle new window requests from ChatGPT
        if (url.includes('chatgpt.com') || url.includes('openai.com')) {
          return { action: 'deny' } // Load in same webview instead
        }
        return { action: 'deny' }
      })
      
      // Monitor webview events
      webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('Webview load failed:', errorCode, errorDescription, validatedURL)
        
        // Common error codes and their meanings
        const errorMessages = {
          '-3': 'Request aborted',
          '-6': 'Connection failed',
          '-106': 'Internet disconnected',
          '-501': 'SSL certificate error'
        }
        
        const message = errorMessages[errorCode] || errorDescription
        console.error(`Webview error: ${message} (${errorCode})`)
      })
      
      webContents.on('crashed', (event, killed) => {
        console.error('Webview crashed:', killed ? 'killed' : 'crashed')
        
        // Attempt to reload after crash
        if (!killed) {
          setTimeout(() => {
            console.log('Attempting to reload crashed webview...')
            webContents.reload()
          }, 1000)
        }
      })
      
      webContents.on('unresponsive', () => {
        console.error('Webview became unresponsive')
      })
      
      webContents.on('responsive', () => {
        console.log('Webview is responsive again')
      })
      
      // Better console message handling
      webContents.on('console-message', (event, level, message, line, sourceId) => {
        // Filter out noise
        const ignoredMessages = [
          'Intercom',
          'Failed to load resource',
          'Mixed Content',
          'DevTools failed to load',
          'Extension server error'
        ]
        
        const shouldIgnore = ignoredMessages.some(ignored => 
          message.toLowerCase().includes(ignored.toLowerCase())
        )
        
        if (!shouldIgnore) {
          const levels = ['log', 'warn', 'error']
          const levelName = levels[level] || 'info'
          
          if (level === 2 || (isDev && level >= 1)) { // Errors always, warnings in dev
            console.log(`[ChatGPT ${levelName}]:`, message)
            if (sourceId && line) {
              console.log(`  at ${sourceId}:${line}`)
            }
          }
        }
      })
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers
// Handle direct ChatGPT injection (for external window)
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
          'textarea[data-id="prompt-textarea"]',
          'textarea[placeholder*="Message"]',
          'div[contenteditable="true"][role="textbox"]',
          'textarea.m-0.w-full',
          'textarea'
        ];
        
        let element = null;
        for (const selector of selectors) {
          element = document.querySelector(selector);
          if (element) break;
        }
        
        if (element) {
          if (element.tagName === 'TEXTAREA') {
            // Handle textarea
            element.value = ${JSON.stringify(content)};
            
            // Trigger React's onChange
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
            
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(changeEvent);
            
            element.focus();
          } else if (element.contentEditable === 'true') {
            // Handle contenteditable
            element.textContent = ${JSON.stringify(content)};
            element.focus();
            
            const inputEvent = new InputEvent('input', { 
              bubbles: true,
              cancelable: true,
              inputType: 'insertText'
            });
            element.dispatchEvent(inputEvent);
          }
          
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

// Get app directory (for preload scripts)
ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})

// Get preload directory for webview
ipcMain.handle('get-preload-path', () => {
  return __dirname
})

// Handle webview console logs from renderer
ipcMain.on('webview-log', (event, { level, args }) => {
  console.log(`[Webview ${level}]:`, ...args)
})

// Handle webview errors
ipcMain.on('webview-error', (event, error) => {
  console.error('Webview error reported:', error)
})