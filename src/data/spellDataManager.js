// spellDataManager.js - Manages Pathfinder 1e spell data

// Spell class structure
class Spell {
  constructor(data) {
    this.name = data.name
    this.level = data.level // Object with class: level pairs
    this.school = data.school
    this.subschool = data.subschool || null
    this.descriptor = data.descriptor || []
    this.components = data.components || []
    this.castingTime = data.castingTime
    this.range = data.range
    this.target = data.target || null
    this.area = data.area || null
    this.effect = data.effect || null
    this.duration = data.duration
    this.savingThrow = data.savingThrow || 'none'
    this.spellResistance = data.spellResistance || false
    this.description = data.description || ''
    this.source = data.source || 'Core Rulebook'
  }
}

// Sample spell data structure - in production, these would be loaded from files
const spellsByLevel = {
  0: [ // Cantrips/Orisons
    {
      name: "Acid Splash",
      level: { sorcerer: 0, wizard: 0, magus: 0, summoner: 0 },
      school: "conjuration",
      subschool: "creation",
      descriptor: ["acid"],
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "close (25 ft. + 5 ft./2 levels)",
      effect: "one missile of acid",
      duration: "instantaneous",
      savingThrow: "none",
      spellResistance: false
    },
    {
      name: "Detect Magic",
      level: { 
        bard: 0, cleric: 0, druid: 0, sorcerer: 0, wizard: 0, 
        magus: 0, summoner: 0, witch: 0, inquisitor: 0 
      },
      school: "divination",
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "60 ft.",
      area: "cone-shaped emanation",
      duration: "concentration, up to 1 min./level (D)",
      savingThrow: "none",
      spellResistance: false
    },
    {
      name: "Light",
      level: { 
        bard: 0, cleric: 0, druid: 0, sorcerer: 0, wizard: 0,
        magus: 0, summoner: 0, witch: 0, inquisitor: 0 
      },
      school: "evocation",
      descriptor: ["light"],
      components: ["V", "M/DF"],
      castingTime: "1 standard action",
      range: "touch",
      target: "object touched",
      duration: "10 min./level",
      savingThrow: "none",
      spellResistance: false
    },
    {
      name: "Mage Hand",
      level: { bard: 0, sorcerer: 0, wizard: 0, magus: 0, summoner: 0 },
      school: "transmutation",
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "close (25 ft. + 5 ft./2 levels)",
      target: "one non-magical, unattended object weighing up to 5 lbs.",
      duration: "concentration",
      savingThrow: "none",
      spellResistance: false
    },
    {
      name: "Prestidigitation",
      level: { bard: 0, sorcerer: 0, wizard: 0, magus: 0 },
      school: "universal",
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "10 ft.",
      target: "see text",
      duration: "1 hour",
      savingThrow: "see text",
      spellResistance: false
    }
  ],
  1: [ // 1st Level Spells
    {
      name: "Magic Missile",
      level: { sorcerer: 1, wizard: 1, magus: 1, bloodrager: 1 },
      school: "evocation",
      descriptor: ["force"],
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "medium (100 ft. + 10 ft./level)",
      target: "up to five creatures, no two of which can be more than 15 ft. apart",
      duration: "instantaneous",
      savingThrow: "none",
      spellResistance: true
    },
    {
      name: "Shield",
      level: { sorcerer: 1, wizard: 1, magus: 1, bloodrager: 1, alchemist: 1 },
      school: "abjuration",
      descriptor: ["force"],
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "personal",
      target: "you",
      duration: "1 min./level (D)",
      savingThrow: "none",
      spellResistance: false
    },
    {
      name: "Burning Hands",
      level: { sorcerer: 1, wizard: 1, magus: 1, bloodrager: 1 },
      school: "evocation",
      descriptor: ["fire"],
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "15 ft.",
      area: "cone-shaped burst",
      duration: "instantaneous",
      savingThrow: "Reflex half",
      spellResistance: true
    },
    {
      name: "Cure Light Wounds",
      level: { 
        cleric: 1, druid: 1, bard: 1, paladin: 1, ranger: 2, 
        inquisitor: 1, witch: 1, alchemist: 1 
      },
      school: "conjuration",
      subschool: "healing",
      components: ["V", "S"],
      castingTime: "1 standard action",
      range: "touch",
      target: "creature touched",
      duration: "instantaneous",
      savingThrow: "Will half (harmless)",
      spellResistance: true
    },
    {
      name: "Mage Armor",
      level: { sorcerer: 1, wizard: 1, witch: 1, summoner: 1, bloodrager: 1 },
      school: "conjuration",
      subschool: "creation",
      descriptor: ["force"],
      components: ["V", "S", "F"],
      castingTime: "1 standard action",
      range: "touch",
      target: "creature touched",
      duration: "1 hour/level (D)",
      savingThrow: "Will negates (harmless)",
      spellResistance: false
    }
  ]
  // Additional levels would be loaded from separate files
}

// Class spell lists - which classes get which spells at which levels
const classSpellLists = {
  wizard: {
    cantrips: ["Acid Splash", "Detect Magic", "Light", "Mage Hand", "Prestidigitation", /* ... */],
    1: ["Magic Missile", "Shield", "Burning Hands", "Mage Armor", /* ... */],
    2: ["Scorching Ray", "Web", "Invisibility", /* ... */],
    // ... up to level 9
  },
  cleric: {
    orisons: ["Detect Magic", "Light", "Guidance", "Resistance", /* ... */],
    1: ["Cure Light Wounds", "Bless", "Shield of Faith", /* ... */],
    2: ["Cure Moderate Wounds", "Hold Person", /* ... */],
    // ... up to level 9
  },
  sorcerer: {
    cantrips: ["Acid Splash", "Detect Magic", "Light", "Mage Hand", "Prestidigitation", /* ... */],
    1: ["Magic Missile", "Shield", "Burning Hands", "Mage Armor", /* ... */],
    2: ["Scorching Ray", "Web", "Invisibility", /* ... */],
    // ... up to level 9
  }
  // ... other classes
}

// Spells known progression for spontaneous casters
const spellsKnownProgression = {
  sorcerer: {
    // [cantrips, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
    1:  [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    2:  [5, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    3:  [5, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    4:  [6, 3, 1, 0, 0, 0, 0, 0, 0, 0],
    5:  [6, 4, 2, 0, 0, 0, 0, 0, 0, 0],
    6:  [7, 4, 2, 1, 0, 0, 0, 0, 0, 0],
    7:  [7, 5, 3, 2, 0, 0, 0, 0, 0, 0],
    8:  [8, 5, 3, 2, 1, 0, 0, 0, 0, 0],
    9:  [8, 5, 4, 3, 2, 0, 0, 0, 0, 0],
    10: [9, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    // ... up to level 20
  },
  bard: {
    1:  [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    2:  [5, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    3:  [6, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    4:  [6, 4, 2, 0, 0, 0, 0, 0, 0, 0],
    // ... etc
  }
  // ... other spontaneous casters
}

class SpellDataManager {
  constructor() {
    this.spellCache = new Map()
    this.apiKey = null
  }

  // Initialize with API key
  initialize(apiKey) {
    this.apiKey = apiKey
  }

  // Get all spells for a specific level
  getSpellsByLevel(level) {
    return spellsByLevel[level] || []
  }

  // Get spells available to a class at a specific character level
  getAvailableSpells(className, characterLevel, spellLevel) {
    const classList = classSpellLists[className.toLowerCase()]
    if (!classList) return []

    // Get the spell list for the requested spell level
    const levelKey = spellLevel === 0 ? 
      (className === 'cleric' || className === 'druid' ? 'orisons' : 'cantrips') : 
      spellLevel.toString()
    
    const spellNames = classList[levelKey] || []
    
    // Return spell objects
    return spellNames.map(name => {
      const spell = this.findSpellByName(name)
      return spell || { name, level: { [className]: spellLevel }, loading: true }
    })
  }

  // Find a spell by name across all levels
  findSpellByName(name) {
    // Check cache first
    if (this.spellCache.has(name)) {
      return this.spellCache.get(name)
    }

    // Search through all levels
    for (const level in spellsByLevel) {
      const spell = spellsByLevel[level].find(s => s.name === name)
      if (spell) {
        this.spellCache.set(name, spell)
        return spell
      }
    }
    return null
  }

  // Get spell details from GPT API
  async getSpellDetails(spellName) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Check cache first
    const cached = this.spellCache.get(spellName)
    if (cached && cached.description) {
      return cached
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a Pathfinder 1e rules expert. Provide accurate spell information in a structured format. Include:
- School and subschool
- Level for each class
- Components (V, S, M, F, DF)
- Casting time
- Range
- Target/Area/Effect
- Duration
- Saving throw
- Spell resistance
- Full description

Format as JSON for easy parsing.`
            },
            {
              role: 'user',
              content: `Provide complete details for the Pathfinder 1e spell: ${spellName}`
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      // Parse the JSON response
      try {
        const spellData = JSON.parse(content)
        const spell = new Spell(spellData)
        this.spellCache.set(spellName, spell)
        return spell
      } catch (parseError) {
        // If JSON parsing fails, return a basic structure with the description
        const spell = {
          name: spellName,
          description: content,
          loading: false
        }
        this.spellCache.set(spellName, spell)
        return spell
      }
    } catch (error) {
      console.error('Error fetching spell details:', error)
      throw error
    }
  }

  // Get spells known for spontaneous casters
  getSpellsKnownProgression(className, characterLevel) {
    const progression = spellsKnownProgression[className.toLowerCase()]
    if (!progression) return null
    
    return progression[characterLevel] || null
  }

  // Save spell list to local storage (for offline use)
  saveSpellsToLocalStorage() {
    const data = {
      spellsByLevel,
      classSpellLists,
      timestamp: Date.now()
    }
    localStorage.setItem('pathfinder-spells', JSON.stringify(data))
  }

  // Load spell list from local storage
  loadSpellsFromLocalStorage() {
    const stored = localStorage.getItem('pathfinder-spells')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Could check timestamp and update if too old
        return data
      } catch (error) {
        console.error('Error loading spell data:', error)
      }
    }
    return null
  }

  // Export spells to file
  exportSpellsToFile(level) {
    const spells = spellsByLevel[level] || []
    const data = JSON.stringify(spells, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pathfinder-spells-level-${level}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import spells from file
  async importSpellsFromFile(file, level) {
    const text = await file.text()
    try {
      const spells = JSON.parse(text)
      spellsByLevel[level] = spells
      this.saveSpellsToLocalStorage()
      return true
    } catch (error) {
      console.error('Error importing spells:', error)
      return false
    }
  }
}

// Create singleton instance
const spellDataManager = new SpellDataManager()

export default spellDataManager
export { Spell, spellsByLevel, classSpellLists, spellsKnownProgression }