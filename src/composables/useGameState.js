// src/composables/useGameState.js
import { ref, computed, watch } from 'vue'

// Global game state
const gameState = ref({
  // Character & Party Info
  partyLevel: 1,
  characters: [],
  
  // Location & World
  currentLocation: '',
  visitedLocations: [],
  worldMap: {},
  
  // Quest & Story
  activeQuest: '',
  completedQuests: [],
  storyFlags: {},
  
  // NPCs & Relationships
  npcs: {},
  npcRelationships: {},
  
  // Session Management
  sessionNotes: '',
  sessionHistory: [],
  lastSessionDate: null,
  
  // Resources & Inventory
  partyGold: 0,
  partyInventory: [],
  
  // Combat & Encounters
  currentEncounter: null,
  encounterHistory: [],
  
  // Custom Data
  customData: {}
})

export function useGameState() {
  // Load state from localStorage on init
  const loadState = () => {
    const saved = localStorage.getItem('rpg-narrator-game-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.assign(gameState.value, parsed)
      } catch (error) {
        console.error('Failed to load game state:', error)
      }
    }
  }
  
  // Save state to localStorage
  const saveState = () => {
    localStorage.setItem('rpg-narrator-game-state', JSON.stringify(gameState.value))
  }
  
  // Auto-save on changes
  watch(gameState, saveState, { deep: true })
  
  // Update game state
  const updateGameState = (updates) => {
    Object.assign(gameState.value, updates)
  }
  
  // Character management
  const addCharacter = (character) => {
    gameState.value.characters.push(character)
  }
  
  const updateCharacter = (id, updates) => {
    const index = gameState.value.characters.findIndex(c => c.id === id)
    if (index !== -1) {
      Object.assign(gameState.value.characters[index], updates)
    }
  }
  
  // Location management
  const setLocation = (location) => {
    gameState.value.currentLocation = location
    if (!gameState.value.visitedLocations.includes(location)) {
      gameState.value.visitedLocations.push(location)
    }
  }
  
  // Quest management
  const startQuest = (questId) => {
    gameState.value.activeQuest = questId
  }
  
  const completeQuest = (questId) => {
    gameState.value.completedQuests.push({
      id: questId,
      completedDate: new Date(),
      activeQuest: gameState.value.activeQuest
    })
    if (gameState.value.activeQuest === questId) {
      gameState.value.activeQuest = ''
    }
  }
  
  // NPC management
  const addNPC = (npc) => {
    gameState.value.npcs[npc.id] = npc
  }
  
  const updateNPCRelationship = (npcId, change) => {
    if (!gameState.value.npcRelationships[npcId]) {
      gameState.value.npcRelationships[npcId] = 0
    }
    gameState.value.npcRelationships[npcId] += change
  }
  
  // Session management
  const startSession = () => {
    gameState.value.lastSessionDate = new Date()
  }
  
  const endSession = (notes) => {
    gameState.value.sessionHistory.push({
      date: gameState.value.lastSessionDate,
      endDate: new Date(),
      notes: notes,
      snapshot: { ...gameState.value }
    })
    gameState.value.sessionNotes = ''
  }
  
  // Computed properties
  const currentPartyLevel = computed(() => {
    if (gameState.value.characters.length === 0) return gameState.value.partyLevel
    const totalLevels = gameState.value.characters.reduce((sum, char) => sum + (char.level || 1), 0)
    return Math.round(totalLevels / gameState.value.characters.length)
  })
  
  const activeNPCs = computed(() => {
    return Object.values(gameState.value.npcs).filter(npc => 
      npc.location === gameState.value.currentLocation || npc.isGlobal
    )
  })
  
  // Initialize
  loadState()
  
  return {
    gameState,
    updateGameState,
    addCharacter,
    updateCharacter,
    setLocation,
    startQuest,
    completeQuest,
    addNPC,
    updateNPCRelationship,
    startSession,
    endSession,
    currentPartyLevel,
    activeNPCs,
    saveState,
    loadState
  }
}