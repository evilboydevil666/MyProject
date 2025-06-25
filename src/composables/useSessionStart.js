// src/composables/useSessionStart.js
import { ref, computed } from 'vue'
import { useGameState } from './useGameState'
import { useCharacter } from './useCharacter'

export function useSessionStart() {
  const { gameState, updateGameState } = useGameState()
  const { characterData } = useCharacter()
  
  const worldData = ref(null)
  const selectedLocation = ref(null)
  const startingScene = ref({
    description: '',
    npcs: [],
    hooks: [],
    atmosphere: '',
    initialConditions: {}
  })
  
  // Load world building data from storage or import
  const loadWorldData = async () => {
    try {
      // Check localStorage for saved world data
      const savedWorld = localStorage.getItem('worldBuildingData')
      if (savedWorld) {
        worldData.value = JSON.parse(savedWorld)
      }
    } catch (error) {
      console.error('Error loading world data:', error)
    }
  }
  
  // Generate contextual starting scene based on location
  const generateStartingScene = async (location) => {
    // This would integrate with your AI service
    const prompt = `
      Generate an opening scene for a Pathfinder 1e game:
      Location: ${location.name} (${location.type})
      Description: ${location.description}
      Party Level: ${characterData.value.level || 1}
      
      Include:
      1. Vivid sensory description
      2. 2-3 available NPCs with brief descriptions
      3. 3 potential adventure hooks
      4. Current atmosphere/mood
      5. Time of day and weather
    `
    
    // For now, use template-based generation
    const scene = {
      description: generateLocationDescription(location),
      npcs: location.npcs || generateRandomNPCs(location.type),
      hooks: generateAdventureHooks(location),
      atmosphere: determineAtmosphere(location),
      initialConditions: {
        timeOfDay: 'morning',
        weather: 'clear',
        crowdLevel: location.type === 'Town' ? 'moderate' : 'none'
      }
    }
    
    startingScene.value = scene
    return scene
  }
  
  // Combine world and location data to initialize session
  const initializeSession = () => {
    if (!worldData.value || !selectedLocation.value) {
      throw new Error('World data and location must be selected')
    }
    
    const sessionData = {
      world: {
        name: worldData.value.name,
        setting: worldData.value.setting,
        currentDate: worldData.value.currentDate || 'Moonday, 1st of Desnus'
      },
      location: {
        ...selectedLocation.value,
        explored: false,
        knownNPCs: [],
        completedQuests: []
      },
      scene: startingScene.value,
      session: {
        number: (gameState.value.sessionCount || 0) + 1,
        startTime: new Date().toISOString(),
        realWorldDate: new Date().toLocaleDateString()
      }
    }
    
    // Update game state
    updateGameState({
      currentLocation: selectedLocation.value.name,
      currentScene: startingScene.value.description,
      activeSession: sessionData
    })
    
    // Save to session history
    saveSessionStart(sessionData)
    
    return sessionData
  }
  
  // Helper functions
  const generateLocationDescription = (location) => {
    const templates = {
      Town: `You arrive at ${location.name} as the sun climbs toward its zenith. ${location.description} The sounds of daily life fill the air - merchants calling their wares, the ring of hammer on anvil, and the laughter of children playing in the dusty streets.`,
      Wilderness: `The path leads you to ${location.name}. ${location.description} Nature's symphony surrounds you - the rustling of leaves, distant bird calls, and the whisper of wind through the ${location.terrain || 'trees'}.`,
      Dungeon: `You stand before the entrance to ${location.name}. ${location.description} An ominous silence hangs in the air, broken only by the occasional drip of water echoing from within the darkness.`,
      City: `The gates of ${location.name} loom before you. ${location.description} The urban sprawl stretches as far as the eye can see, a maze of streets, towers, and countless souls going about their business.`,
      tavern: `The warm glow of ${location.name} beckons invitingly. ${location.description || 'The familiar sounds of tavern life drift through the door - clinking mugs, hearty laughter, and the strumming of a bard\'s lute.'}`,
      road: `You travel along ${location.name}. ${location.description || 'The road stretches before and behind you, winding through the landscape like a river of dust and stone.'}`,
      dungeon: `The entrance to ${location.name} yawns before you like a hungry mouth. ${location.description || 'Darkness waits within, pregnant with both danger and the promise of treasure.'}`,
      wilderness: `You find yourself in ${location.name}. ${location.description || 'The wild beauty of untamed nature surrounds you, both serene and potentially deadly.'}`
    }
    
    return templates[location.type] || `You find yourself at ${location.name}. ${location.description}`
  }
  
  const generateRandomNPCs = (locationType) => {
    const npcTemplates = {
      Town: [
        { name: 'Gareth the Innkeeper', role: 'Information broker', attitude: 'Friendly' },
        { name: 'Captain Mira', role: 'Guard captain', attitude: 'Suspicious' },
        { name: 'Old Tom', role: 'Local drunk', attitude: 'Talkative' }
      ],
      Wilderness: [
        { name: 'Ranger Elara', role: 'Wilderness guide', attitude: 'Cautious' },
        { name: 'Hermit Grum', role: 'Crazy hermit', attitude: 'Unpredictable' }
      ],
      Dungeon: [
        { name: 'Ghost of Sir Aldric', role: 'Trapped spirit', attitude: 'Mournful' },
        { name: 'Kobold Prisoner', role: 'Potential ally', attitude: 'Desperate' }
      ],
      City: [
        { name: 'Merchant Vex', role: 'Information dealer', attitude: 'Shrewd' },
        { name: 'Street Urchin Pip', role: 'Guide', attitude: 'Eager' },
        { name: 'Noble Lady Rosanne', role: 'Quest giver', attitude: 'Imperious' }
      ],
      tavern: [
        { name: 'Brix the Barkeep', role: 'Tavern owner', attitude: 'Jovial' },
        { name: 'Mysterious Stranger', role: 'Quest giver', attitude: 'Secretive' },
        { name: 'Drunken Mercenary', role: 'Information source', attitude: 'Boastful' }
      ],
      road: [
        { name: 'Traveling Merchant', role: 'Trader', attitude: 'Wary' },
        { name: 'Patrol Captain', role: 'Law enforcement', attitude: 'Professional' }
      ]
    }
    
    return npcTemplates[locationType] || []
  }
  
  const generateAdventureHooks = (location) => {
    const baseHooks = [
      `Rumors speak of ${location.threats?.[0] || 'strange happenings'} near ${location.name}`,
      `A desperate merchant seeks guards for a journey through ${location.name}`,
      `An ancient map suggests treasure hidden somewhere in ${location.name}`,
      `Local authorities offer a bounty for dealing with problems in ${location.name}`,
      `A mysterious figure was seen entering ${location.name} and never returned`
    ]
    
    const typeSpecificHooks = {
      Town: [
        'The town elder requests help with a supernatural problem',
        'A string of thefts has the merchants offering rewards',
        'Strange lights have been seen in the abandoned mill'
      ],
      Wilderness: [
        'Hunters report seeing unnatural creatures in the area',
        'An expedition went missing last week',
        'Ancient ruins have been uncovered by recent storms'
      ],
      Dungeon: [
        'Screams echo from the depths at midnight',
        'A previous adventuring party never returned',
        'Local legends speak of a powerful artifact within'
      ],
      City: [
        'The thieves guild is recruiting for a special job',
        'A noble family seeks discrete investigators',
        'The city watch needs help with a serial killer'
      ],
      tavern: [
        'A patron offers a treasure map for the price of a drink',
        'The barkeep mentions trouble with the local gang',
        'A bard tells tales of a nearby haunted location'
      ]
    }
    
    const hooks = [...baseHooks]
    if (typeSpecificHooks[location.type]) {
      hooks.push(...typeSpecificHooks[location.type])
    }
    
    // Return 3 random hooks
    return hooks.sort(() => Math.random() - 0.5).slice(0, 3)
  }
  
  const determineAtmosphere = (location) => {
    const atmospheres = {
      Town: 'Bustling and welcoming',
      City: 'Crowded and chaotic',
      Wilderness: 'Serene but watchful',
      Dungeon: 'Oppressive and dangerous',
      Ruins: 'Mysterious and ancient',
      tavern: 'Warm and lively',
      road: 'Open and transitional',
      building: 'Confined and purposeful'
    }
    
    return atmospheres[location.type] || 'Intriguing and full of possibility'
  }
  
  const saveSessionStart = (sessionData) => {
    try {
      // Get existing session history
      const history = JSON.parse(localStorage.getItem('sessionHistory') || '[]')
      history.push({
        id: Date.now(),
        ...sessionData,
        summary: `Session ${sessionData.session.number} began at ${sessionData.location.name}`
      })
      localStorage.setItem('sessionHistory', JSON.stringify(history))
    } catch (error) {
      console.error('Error saving session start:', error)
    }
  }
  
  // Get all available locations from various sources
  const getAvailableLocations = () => {
    const locations = []
    
    // From world data
    if (worldData.value?.locations) {
      locations.push(...worldData.value.locations)
    }
    
    // From session storage (temporary locations)
    try {
      const sessionLocations = JSON.parse(sessionStorage.getItem('sessionPrepLocations') || '[]')
      locations.push(...sessionLocations)
    } catch (error) {
      console.error('Error loading session locations:', error)
    }
    
    // From generated content
    try {
      const worldBuilding = JSON.parse(localStorage.getItem('worldBuildingData') || '{}')
      if (worldBuilding.content) {
        const locationContent = worldBuilding.content.filter(c => c.category === 'locations')
        locationContent.forEach(content => {
          locations.push({
            id: content.id,
            name: content.title,
            type: content.tags.find(tag => ['city', 'town', 'dungeon', 'wilderness'].includes(tag)) || 'location',
            description: content.content.substring(0, 200) + '...',
            fullContent: content.content
          })
        })
      }
    } catch (error) {
      console.error('Error loading world building locations:', error)
    }
    
    return locations
  }
  
  // Export session data for ChatGPT
  const exportSessionForChatGPT = () => {
    const character = characterData.value
    const session = {
      world: worldData.value,
      location: selectedLocation.value,
      scene: startingScene.value,
      character: {
        name: character.name,
        level: character.level,
        classes: character.classes?.map(c => `${c.className} ${c.level}`).join(', ')
      }
    }
    
    const prompt = `# Pathfinder 1e Session Start

**World:** ${session.world?.name || 'Fantasy World'}
**Location:** ${session.location.name} (${session.location.type})
**Character:** ${session.character.name} - Level ${session.character.level} ${session.character.classes}

## Opening Scene
${session.scene.description}

## Available NPCs
${session.scene.npcs.map(npc => `- **${npc.name}** (${npc.role}): ${npc.attitude}`).join('\n')}

## Adventure Hooks
${session.scene.hooks.map((hook, i) => `${i + 1}. ${hook}`).join('\n')}

## Atmosphere
${session.scene.atmosphere}

## Initial Conditions
- Time: ${session.scene.initialConditions.timeOfDay}
- Weather: ${session.scene.initialConditions.weather}
${session.location.type === 'Town' ? `- Crowd Level: ${session.scene.initialConditions.crowdLevel}` : ''}

---
You are the GM for this Pathfinder 1e session. The player character ${session.character.name} has just arrived. Begin the adventure!`

    return prompt
  }
  
  return {
    worldData,
    selectedLocation,
    startingScene,
    loadWorldData,
    generateStartingScene,
    initializeSession,
    getAvailableLocations,
    exportSessionForChatGPT,
    isReady: computed(() => 
      worldData.value && 
      selectedLocation.value && 
      startingScene.value.description
    )
  }
}