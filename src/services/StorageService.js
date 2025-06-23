export class StorageService {
  constructor(prefix = 'rpg-narrator') {
    this.prefix = prefix
  }
  
  save(key, data) {
    try {
      const fullKey = `${this.prefix}-${key}`
      localStorage.setItem(fullKey, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Failed to save ${key}:`, error)
      return false
    }
  }
  
  load(key, defaultValue = null) {
    try {
      const fullKey = `${this.prefix}-${key}`
      const saved = localStorage.getItem(fullKey)
      return saved ? JSON.parse(saved) : defaultValue
    } catch (error) {
      console.error(`Failed to load ${key}:`, error)
      return defaultValue
    }
  }
  
  remove(key) {
    try {
      const fullKey = `${this.prefix}-${key}`
      localStorage.removeItem(fullKey)
      return true
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error)
      return false
    }
  }
  
  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }
  
  getSize() {
    let size = 0
    const keys = Object.keys(localStorage)
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        size += localStorage.getItem(key).length
      }
    })
    
    return size
  }
  
  exportData() {
    const data = {}
    const keys = Object.keys(localStorage)
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const shortKey = key.replace(`${this.prefix}-`, '')
        data[shortKey] = this.load(shortKey)
      }
    })
    
    return data
  }
  
  importData(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.save(key, value)
      })
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }
}