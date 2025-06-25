// src/utils/WorldBuildingImportParser.js

export class WorldBuildingImportParser {
  constructor() {
    this.patterns = this.initializePatterns()
  }

  // Initialize detection patterns
  initializePatterns() {
    return {
      // Location patterns
      location: {
        city: /(?:Pop\.|Population:|pop\s*[:.]?\s*)[\s]*(\d+[,\d]*)/gi,
        capital: /\(Capital\)|Capital:|capital city/gi,
        wealth: /Wealth:\s*(Rich|Poor|In-between)/gi,
        traits: /Traits:\s*([^.]+(?:\.[^.]+)*)/gi,
        description: /–\s*([^.]+(?:\.[^.]+)*)/g
      },
      
      // Lore patterns
      lore: {
        timeline: /(\d+)\s*years?\s*ago|Age of|Era of|Period of/gi,
        faction: /(?:Order|Guild|Consortium|Cartel|Compact|Alliance|League) of/gi,
        mythology: /(?:God|Goddess|Deity|Divine|Sacred|Holy)/gi,
        history: /(?:founded|established|created|built|destroyed|fell|conquered)/gi
      },
      
      // Creature patterns
      creature: {
        cr: /CR\s*(\d+(?:\/\d+)?)/gi,
        type: /\b(beast|humanoid|undead|construct|aberration|dragon|outsider|fey)\b/gi,
        abilities: /(?:Special Abilities|Abilities|Special Attacks):\s*([^.]+)/gi
      },
      
      // Item patterns
      item: {
        magic: /\+\d+|(?:minor|major|legendary|artifact|cursed)/gi,
        type: /(?:sword|armor|shield|staff|wand|ring|amulet|potion|scroll)/gi,
        rarity: /(?:common|uncommon|rare|very rare|legendary)/gi
      },
      
      // Rule patterns
      rule: {
        mechanics: /(?:roll|check|save|DC|modifier|bonus|penalty)/gi,
        category: /(?:combat|magic|skill|social|environmental)/gi
      }
    }
  }

  // Main parsing function
  async parseWorldBuildingContent(text) {
    const results = {
      locations: [],
      lore: [],
      creatures: [],
      items: [],
      rules: [],
      unmatched: []
    }

    // Clean and normalize text
    const normalizedText = this.normalizeText(text)
    
    // Try to detect document structure
    const documentType = this.detectDocumentType(normalizedText)
    
    if (documentType === 'comprehensive') {
      // Parse comprehensive world document
      return this.parseComprehensiveDocument(normalizedText)
    } else {
      // Parse individual sections
      const sections = this.splitIntoSections(normalizedText)
      
      for (const section of sections) {
        const parsed = this.parseSection(section)
        if (parsed) {
          results[parsed.category].push(parsed.content)
        } else {
          results.unmatched.push(section.substring(0, 100) + '...')
        }
      }
    }
    
    return results
  }

  // Detect document type
  detectDocumentType(text) {
    const indicators = {
      comprehensive: [
        'World Building Document',
        'Campaign Setting',
        'World Overview',
        'Geographical Structure'
      ],
      locationList: [
        'Cities:', 'Settlements:', 'Locations:',
        /\d+\.\s*\w+.*Pop\./g
      ],
      loreDocument: [
        'History:', 'Timeline:', 'Age of', 'Era of'
      ]
    }
    
    // Check for comprehensive world doc
    if (indicators.comprehensive.some(ind => text.includes(ind))) {
      return 'comprehensive'
    }
    
    // Check for location list
    if (indicators.locationList.some(ind => 
      ind instanceof RegExp ? ind.test(text) : text.includes(ind)
    )) {
      return 'locations'
    }
    
    return 'mixed'
  }

  // Parse comprehensive world document
  parseComprehensiveDocument(text) {
    const results = {
      worldInfo: {},
      regions: [],
      cities: [],
      lore: [],
      rules: [],
      tradeSystems: [],
      legendaryLocations: [],
      pirateCities: []
    }
    
    // Extract world info
    results.worldInfo = this.extractWorldInfo(text)
    
    // Extract regions and their cities
    const regionMatches = text.match(/\d+\.\s*([^:]+)\n([^]*?)(?=\d+\.\s*\w+|$)/g)
    if (regionMatches) {
      regionMatches.forEach(match => {
        const region = this.parseRegion(match)
        if (region) {
          results.regions.push(region)
          results.cities.push(...region.cities)
        }
      })
    }
    
    // Extract legendary sites
    const legendarySection = text.match(/Legendary Sites[^]*?(?=\n[A-Z]|$)/i)
    if (legendarySection) {
      results.legendaryLocations = this.parseLegendarySites(legendarySection[0])
    }
    
    // Extract pirate cities
    const pirateSection = text.match(/Free Pirate Cities[^]*?(?=\n[A-Z]|$)/i)
    if (pirateSection) {
      results.pirateCities = this.parsePirateCities(pirateSection[0])
    }
    
    // Extract lore sections
    const loreIndicators = ['Cultural & Temporal Depth', 'Ethnic Groups', 'Seasonal Cycles', 'Cold War']
    loreIndicators.forEach(indicator => {
      const section = text.match(new RegExp(`${indicator}[^]*?(?=\\n[A-Z]|$)`, 'i'))
      if (section) {
        results.lore.push({
          title: indicator,
          content: this.cleanText(section[0]),
          type: 'world-history'
        })
      }
    })
    
    return results
  }

  // Parse individual region
  parseRegion(regionText) {
    const lines = regionText.split('\n')
    const titleMatch = lines[0].match(/\d+\.\s*(.+)/)
    if (!titleMatch) return null
    
    const region = {
      name: titleMatch[1].trim(),
      cities: [],
      description: ''
    }
    
    // Parse cities
    const cityPattern = /^([^:]+)(?:\s*\(Capital\))?\s*:\s*Pop\.\s*([\d,]+)\s*–\s*(.+?)(?:\s*Wealth:\s*(Rich|Poor|In-between))?$/gm
    let cityMatch
    
    while ((cityMatch = cityPattern.exec(regionText)) !== null) {
      region.cities.push({
        name: cityMatch[1].trim(),
        isCapital: regionText.includes(`${cityMatch[1]} (Capital)`),
        population: parseInt(cityMatch[2].replace(/,/g, '')),
        description: cityMatch[3].trim(),
        wealth: cityMatch[4] || 'Unknown',
        region: region.name
      })
    }
    
    return region
  }

  // Parse legendary sites
  parseLegendarySites(text) {
    const sites = []
    const sitePattern = /([^(]+)\s*\(([^)]+)\)\s*–\s*(.+)/g
    let match
    
    while ((match = sitePattern.exec(text)) !== null) {
      sites.push({
        name: match[1].trim(),
        location: match[2].trim(),
        description: match[3].trim(),
        type: 'legendary'
      })
    }
    
    return sites
  }

  // Parse pirate cities
  parsePirateCities(text) {
    const cities = []
    const cityPattern = /\d+\.\s*([^\n]+)\n\s*Pop\.\s*([\d,]+)\n\s*Traits:\s*([^\n]+)\n\s*Wealth:\s*(\w+)/g
    let match
    
    while ((match = cityPattern.exec(text)) !== null) {
      cities.push({
        name: match[1].trim(),
        population: parseInt(match[2].replace(/,/g, '')),
        traits: match[3].trim(),
        wealth: match[4].trim(),
        type: 'pirate-city'
      })
    }
    
    return cities
  }

  // Extract world info
  extractWorldInfo(text) {
    const info = {
      name: 'Untitled World',
      system: 'Pathfinder 1e',
      tone: '',
      magicLevel: '',
      technology: '',
      calendar: {}
    }
    
    // Extract tone
    const toneMatch = text.match(/Tone:\s*([^\n]+)/i)
    if (toneMatch) info.tone = toneMatch[1].trim()
    
    // Extract magic level
    const magicMatch = text.match(/Magic Level:\s*([^\n]+)/i)
    if (magicMatch) info.magicLevel = magicMatch[1].trim()
    
    // Extract technology
    const techMatch = text.match(/Technology:\s*([^\n]+)/i)
    if (techMatch) info.technology = techMatch[1].trim()
    
    // Extract calendar info
    const calendarSection = text.match(/Calendar:[^]*?(?=\n[A-Z])/i)
    if (calendarSection) {
      info.calendar = {
        system: 'Golarion',
        months: 12,
        specialEvents: this.extractSpecialEvents(calendarSection[0])
      }
    }
    
    return info
  }

  // Extract special events from calendar
  extractSpecialEvents(calendarText) {
    const events = []
    const eventPattern = /([^:]+)\s*\(([^)]+)\)\s*:\s*([^\n]+)/g
    let match
    
    while ((match = eventPattern.exec(calendarText)) !== null) {
      events.push({
        name: match[1].trim(),
        timing: match[2].trim(),
        description: match[3].trim()
      })
    }
    
    return events
  }

  // Parse individual section
  parseSection(section) {
    const text = section.trim()
    
    // Try to detect section type
    if (this.isLocation(text)) {
      return {
        category: 'locations',
        content: this.parseLocation(text)
      }
    }
    
    if (this.isLore(text)) {
      return {
        category: 'lore',
        content: this.parseLore(text)
      }
    }
    
    if (this.isCreature(text)) {
      return {
        category: 'creatures',
        content: this.parseCreature(text)
      }
    }
    
    if (this.isItem(text)) {
      return {
        category: 'items',
        content: this.parseItem(text)
      }
    }
    
    if (this.isRule(text)) {
      return {
        category: 'rules',
        content: this.parseRule(text)
      }
    }
    
    return null
  }

  // Detection functions
  isLocation(text) {
    const indicators = [
      this.patterns.location.city,
      this.patterns.location.capital,
      /\bcity\b|\btown\b|\bvillage\b|\bfortress\b|\bcitadel\b/i
    ]
    
    return indicators.some(pattern => pattern.test(text))
  }

  isLore(text) {
    const indicators = [
      this.patterns.lore.timeline,
      this.patterns.lore.faction,
      /history of|legend of|story of|founded in/i
    ]
    
    return indicators.some(pattern => pattern.test(text))
  }

  isCreature(text) {
    return this.patterns.creature.cr.test(text) || 
           this.patterns.creature.type.test(text)
  }

  isItem(text) {
    return this.patterns.item.magic.test(text) || 
           this.patterns.item.type.test(text)
  }

  isRule(text) {
    return this.patterns.rule.mechanics.test(text) && 
           text.length < 2000 // Rules tend to be shorter
  }

  // Individual parsers
  parseLocation(text) {
    const location = {
      name: '',
      type: 'city',
      size: 'medium',
      population: 0,
      wealth: 'In-between',
      description: '',
      features: []
    }
    
    // Extract name (usually first line or before colon)
    const nameMatch = text.match(/^([^:\n]+)/);
    if (nameMatch) location.name = nameMatch[1].trim()
    
    // Extract population
    const popMatch = text.match(/(?:Pop\.|Population:|pop\s*[:.]?\s*)([\d,]+)/i)
    if (popMatch) location.population = parseInt(popMatch[1].replace(/,/g, ''))
    
    // Determine size based on population
    if (location.population > 25000) location.size = 'huge'
    else if (location.population > 10000) location.size = 'large'
    else if (location.population > 5000) location.size = 'medium'
    else location.size = 'small'
    
    // Extract wealth
    const wealthMatch = text.match(/Wealth:\s*(Rich|Poor|In-between)/i)
    if (wealthMatch) location.wealth = wealthMatch[1]
    
    // Extract traits/features
    const traitsMatch = text.match(/Traits:\s*([^.]+(?:\.[^.]+)*)/i)
    if (traitsMatch) {
      location.features = traitsMatch[1].split(',').map(t => t.trim())
    }
    
    // Extract description
    const descMatch = text.match(/–\s*(.+)/);
    if (descMatch) location.description = descMatch[1]
    
    return location
  }

  parseLore(text) {
    const lore = {
      title: '',
      type: 'world-history',
      content: text,
      timePeriod: '',
      themes: []
    }
    
    // Extract title
    const titleMatch = text.match(/^([^\n:]+)/);
    if (titleMatch) lore.title = titleMatch[1].trim()
    
    // Detect lore type
    if (this.patterns.lore.faction.test(text)) lore.type = 'organization'
    else if (this.patterns.lore.mythology.test(text)) lore.type = 'mythology'
    else if (this.patterns.lore.timeline.test(text)) lore.type = 'timeline'
    
    // Extract time period
    const timeMatch = text.match(/(\d+)\s*years?\s*ago/i)
    if (timeMatch) lore.timePeriod = timeMatch[0]
    
    return lore
  }

  parseCreature(text) {
    const creature = {
      name: '',
      cr: 1,
      type: 'beast',
      description: text
    }
    
    // Extract CR
    const crMatch = text.match(/CR\s*(\d+(?:\/\d+)?)/i)
    if (crMatch) creature.cr = crMatch[1]
    
    // Extract type
    const typeMatch = text.match(this.patterns.creature.type)
    if (typeMatch) creature.type = typeMatch[0].toLowerCase()
    
    // Extract name (usually first line)
    const nameMatch = text.match(/^([^\n]+)/)
    if (nameMatch) creature.name = nameMatch[1].trim()
    
    return creature
  }

  parseItem(text) {
    const item = {
      name: '',
      type: 'magic',
      rarity: 'uncommon',
      description: text
    }
    
    // Extract item type
    const typeMatch = text.match(this.patterns.item.type)
    if (typeMatch) item.type = typeMatch[0].toLowerCase()
    
    // Extract rarity
    const rarityMatch = text.match(this.patterns.item.rarity)
    if (rarityMatch) item.rarity = rarityMatch[0].toLowerCase()
    
    // Extract name
    const nameMatch = text.match(/^([^\n]+)/)
    if (nameMatch) item.name = nameMatch[1].trim()
    
    return item
  }

  parseRule(text) {
    const rule = {
      name: '',
      category: 'general',
      description: text
    }
    
    // Extract category
    const categoryMatch = text.match(this.patterns.rule.category)
    if (categoryMatch) rule.category = categoryMatch[0].toLowerCase()
    
    // Extract name
    const nameMatch = text.match(/^([^\n:]+)/)
    if (nameMatch) rule.name = nameMatch[1].trim()
    
    return rule
  }

  // Helper functions
  normalizeText(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ')
      .trim()
  }

  cleanText(text) {
    return text
      .replace(/^\s*[-*]\s*/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  splitIntoSections(text) {
    // Split by double newlines or numbered sections
    return text.split(/\n\n+|\n(?=\d+\.\s)/)
      .filter(section => section.trim().length > 50)
  }

  // Convert parsed data to form data
  convertToFormData(parsed, category) {
    const converters = {
      locations: (location) => ({
        type: location.type || 'city',
        name: location.name,
        size: location.size || 'medium',
        features: location.features ? location.features.join(', ') : location.description,
        includeMap: true,
        includeNPCs: location.population > 5000
      }),
      
      lore: (lore) => ({
        type: lore.type || 'world-history',
        subject: lore.title,
        timePeriod: lore.timePeriod || 'Current era',
        themes: lore.themes.join(', '),
        connections: ''
      }),
      
      creatures: (creature) => ({
        type: creature.type,
        cr: creature.cr,
        concept: creature.description,
        abilities: creature.abilities || '',
        includeVariants: false
      }),
      
      items: (item) => ({
        type: item.type,
        mode: 'single',
        rarity: item.rarity,
        theme: '',
        properties: item.description
      }),
      
      rules: (rule) => ({
        category: rule.category,
        name: rule.name,
        purpose: 'Imported rule',
        concept: rule.description,
        includeExamples: false
      })
    }
    
    return converters[category] ? converters[category](parsed) : null
  }
}

// Export singleton instance
export const importParser = new WorldBuildingImportParser()