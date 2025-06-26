// src/utils/WorldBuildingImportParser.js

export class WorldBuildingImportParser {
  constructor() {
    this.patterns = this.initializePatterns()
  }

  // Initialize detection patterns with enhanced detection
  initializePatterns() {
    return {
      // Enhanced Location patterns
      location: {
        // Expanded city/town detection
        cityTypes: /\b(city|cities|town|towns|village|villages|hamlet|hamlets|settlement|settlements|metropolis|capital|port|harbor|fortress|citadel|outpost|trading post|market town|borough|municipality|district)\b/gi,
        population: /(?:Pop\.|Population:|pop\s*[:.]?\s*|inhabitants:|residents:)\s*([\d,]+(?:\s*(?:k|K|thousand|million|M))?)/gi,
        capital: /\(Capital\)|Capital:|capital city|seat of power|throne city|imperial city/gi,
        wealth: /Wealth:\s*(Rich|Poor|In-between|Wealthy|Prosperous|Struggling|Moderate|Impoverished)/gi,
        traits: /Traits:\s*([^.]+(?:\.[^.]+)*)/gi,
        description: /–\s*([^.]+(?:\.[^.]+)*)/g,
        // New: Trade and economy patterns
        trade: /\b(trade|trading|commerce|market|merchant|export|import|goods|caravan|trade route|bazaar|economy|economic|guild|artisan|craftsman|workshop|warehouse|dock|port authority)\b/gi,
        economicStatus: /\b(prosperous|thriving|booming|declining|stagnant|growing economy|economic crisis|trade hub|commercial center|financial district)\b/gi,
        resources: /\b(produces?|exports?|imports?|known for|famous for|specializes in|mines?|farms?|harvest|timber|ore|gems?|spices?|silk|wool|grain|fish|livestock)\b/gi
      },
      
      // New: Politics, Wars, and Diplomacy patterns
      politics: {
        wars: /\b(war|wars|conflict|battle|siege|campaign|invasion|conquest|rebellion|uprising|civil war|border dispute|skirmish|raid|active hostilities|ongoing conflict|at war with|fighting|military campaign)\b/gi,
        warStatus: /\b(active war|current conflict|ongoing battle|recent invasion|under siege|occupied|contested|war-torn|battlefield|front lines|ceasefire|truce)\b/gi,
        alliances: /\b(alliance|allied with|treaty|pact|agreement|diplomatic|diplomacy|ambassador|embassy|peace accord|trade agreement|mutual defense|confederation|league|union|coalition|partner|friendship)\b/gi,
        diplomaticRelations: /\b(friendly|hostile|neutral|tense|cordial|strained relations|diplomatic ties|trade partner|military ally|non-aggression pact)\b/gi,
        governance: /\b(ruled by|governed by|under the rule|democracy|monarchy|republic|empire|theocracy|oligarchy|council|senate|parliament|king|queen|emperor|lord|duke|baron)\b/gi
      },
      
      // Enhanced Lore patterns
      lore: {
        timeline: /(\d+)\s*years?\s*ago|Age of|Era of|Period of|epoch|century|millennium/gi,
        faction: /(?:Order|Guild|Consortium|Cartel|Compact|Alliance|League|Brotherhood|Sisterhood|Circle|Coven|Clan|House|Dynasty) of/gi,
        mythology: /(?:God|Goddess|Deity|Divine|Sacred|Holy|Blessed|Cursed|Prophecy|Legend)/gi,
        history: /(?:founded|established|created|built|destroyed|fell|conquered|discovered|colonized|settled)/gi,
        // New: Historical conflicts
        historicalWars: /(?:Great War|Ancient Conflict|Historic Battle|Legendary Siege|Past Rebellion)/gi
      },
      
      // Enhanced Creature patterns
      creature: {
        cr: /CR\s*(\d+(?:\/\d+)?)/gi,
        type: /\b(beast|humanoid|undead|construct|aberration|dragon|outsider|fey|elemental|ooze|plant|vermin)\b/gi,
        abilities: /(?:Special Abilities|Abilities|Special Attacks):\s*([^.]+)/gi
      },
      
      // Enhanced Item patterns with trade goods
      item: {
        magic: /\+\d+|(?:minor|major|legendary|artifact|cursed|enchanted|magical)/gi,
        type: /(?:sword|armor|shield|staff|wand|ring|amulet|potion|scroll|weapon|helm|boots|cloak|belt|bracers)/gi,
        rarity: /(?:common|uncommon|rare|very rare|legendary|unique|priceless)/gi,
        // New: Trade goods
        tradeGoods: /(?:silk|spices|gems|ore|timber|grain|wine|textiles|pottery|jewelry|artwork|manuscripts|herbs|tea|coffee)/gi
      },
      
      // Rule patterns
      rule: {
        mechanics: /(?:roll|check|save|DC|modifier|bonus|penalty|advantage|disadvantage)/gi,
        category: /(?:combat|magic|skill|social|environmental|economic|political|naval|aerial)/gi
      }
    }
  }

  // Enhanced main parsing function
  async parseWorldBuildingContent(text) {
    const results = {
      locations: [],
      lore: [],
      creatures: [],
      items: [],
      rules: [],
      trade: [],
      wars: [],
      alliances: [],
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
          // Handle multiple categories for a single section
          if (Array.isArray(parsed)) {
            parsed.forEach(p => {
              if (results[p.category]) {
                results[p.category].push(p.content)
              }
            })
          } else {
            if (results[parsed.category]) {
              results[parsed.category].push(parsed.content)
            }
          }
        } else {
          results.unmatched.push(section.substring(0, 100) + '...')
        }
      }
    }
    
    return results
  }

  // Enhanced section parser
  parseSection(section) {
    const text = section.trim()
    const parsedItems = []
    
    // Check for location with enhanced detection
    if (this.isLocation(text)) {
      const location = this.parseLocation(text)
      parsedItems.push({
        category: 'locations',
        content: location
      })
      
      // Also check for trade/economy info in the location
      if (this.hasTradeInfo(text)) {
        const tradeInfo = this.parseTradeInfo(text, location.name)
        if (tradeInfo) {
          parsedItems.push({
            category: 'trade',
            content: tradeInfo
          })
        }
      }
    }
    
    // Check for war/conflict information
    if (this.hasWarInfo(text)) {
      const warInfo = this.parseWarInfo(text)
      if (warInfo) {
        parsedItems.push({
          category: 'wars',
          content: warInfo
        })
      }
    }
    
    // Check for alliance/diplomatic information
    if (this.hasAllianceInfo(text)) {
      const allianceInfo = this.parseAllianceInfo(text)
      if (allianceInfo) {
        parsedItems.push({
          category: 'alliances',
          content: allianceInfo
        })
      }
    }
    
    // Continue with existing checks
    if (this.isLore(text)) {
      parsedItems.push({
        category: 'lore',
        content: this.parseLore(text)
      })
    }
    
    if (this.isCreature(text)) {
      parsedItems.push({
        category: 'creatures',
        content: this.parseCreature(text)
      })
    }
    
    if (this.isItem(text)) {
      parsedItems.push({
        category: 'items',
        content: this.parseItem(text)
      })
    }
    
    if (this.isRule(text)) {
      parsedItems.push({
        category: 'rules',
        content: this.parseRule(text)
      })
    }
    
    return parsedItems.length > 0 ? parsedItems : null
  }

  // Enhanced location detection
  isLocation(text) {
    const indicators = [
      this.patterns.location.cityTypes,
      this.patterns.location.population,
      this.patterns.location.capital,
      /\b(located|situated|found|lies|stands)\s+(in|at|on|near|between)/i
    ]
    
    // Need at least 2 indicators for confidence
    const matchCount = indicators.filter(pattern => pattern.test(text)).length
    return matchCount >= 2 || this.patterns.location.cityTypes.test(text)
  }

  // New detection methods
  hasTradeInfo(text) {
    return this.patterns.location.trade.test(text) || 
           this.patterns.location.economicStatus.test(text) ||
           this.patterns.location.resources.test(text)
  }

  hasWarInfo(text) {
    return this.patterns.politics.wars.test(text) || 
           this.patterns.politics.warStatus.test(text)
  }

  hasAllianceInfo(text) {
    return this.patterns.politics.alliances.test(text) || 
           this.patterns.politics.diplomaticRelations.test(text)
  }

  // Enhanced location parser
  parseLocation(text) {
    const location = {
      name: '',
      type: 'settlement',
      size: 'medium',
      population: 0,
      wealth: 'In-between',
      description: '',
      features: [],
      governance: '',
      economicNotes: [],
      diplomaticStatus: []
    }
    
    // Extract name (usually first line or before colon)
    const nameMatch = text.match(/^([^:\n]+)/);
    if (nameMatch) location.name = nameMatch[1].trim()
    
    // Detect location type
    const typeMatch = text.match(this.patterns.location.cityTypes)
    if (typeMatch) {
      const type = typeMatch[0].toLowerCase()
      if (['city', 'cities', 'metropolis', 'capital'].includes(type)) location.type = 'city'
      else if (['town', 'towns', 'market town', 'borough'].includes(type)) location.type = 'town'
      else if (['village', 'villages', 'hamlet', 'hamlets'].includes(type)) location.type = 'village'
      else if (['fortress', 'citadel', 'outpost'].includes(type)) location.type = 'fortress'
      else if (['port', 'harbor', 'trading post'].includes(type)) location.type = 'port'
      else location.type = 'settlement'
    }
    
    // Extract population with enhanced parsing
    const popMatch = text.match(this.patterns.location.population)
    if (popMatch) {
      let popString = popMatch[1]
      let population = parseInt(popString.replace(/,/g, ''))
      
      // Handle abbreviations
      if (popString.match(/[kK]/)) population *= 1000
      if (popString.match(/[mM]|million/i)) population *= 1000000
      
      location.population = population
    }
    
    // Determine size based on population
    if (location.population > 25000) location.size = 'huge'
    else if (location.population > 10000) location.size = 'large'
    else if (location.population > 5000) location.size = 'medium'
    else location.size = 'small'
    
    // Extract wealth
    const wealthMatch = text.match(this.patterns.location.wealth)
    if (wealthMatch) location.wealth = wealthMatch[1]
    
    // Extract governance
    const govMatch = text.match(this.patterns.politics.governance)
    if (govMatch) location.governance = govMatch[0]
    
    // Extract economic information
    const ecoMatches = text.match(this.patterns.location.economicStatus)
    if (ecoMatches) {
      location.economicNotes = [...new Set(ecoMatches)]
    }
    
    // Extract diplomatic status
    const dipMatches = text.match(this.patterns.politics.diplomaticRelations)
    if (dipMatches) {
      location.diplomaticStatus = [...new Set(dipMatches)]
    }
    
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

  // New parsers for enhanced categories
  parseTradeInfo(text, locationName = '') {
    const trade = {
      name: locationName || 'Trade Information',
      type: 'trade',
      tradeRoutes: [],
      exports: [],
      imports: [],
      economicStatus: '',
      tradePartners: [],
      specialties: []
    }
    
    // Extract trade routes
    const routeMatches = text.match(/trade route(?:s)?\s*(?:to|with|between)\s*([^.,]+)/gi)
    if (routeMatches) {
      trade.tradeRoutes = routeMatches.map(m => m.replace(/trade route(?:s)?\s*(?:to|with|between)\s*/i, '').trim())
    }
    
    // Extract exports
    const exportMatches = text.match(/exports?\s*(?:include|:|are)?\s*([^.,]+)/gi)
    if (exportMatches) {
      trade.exports = this.extractTradeGoods(exportMatches.join(' '))
    }
    
    // Extract imports
    const importMatches = text.match(/imports?\s*(?:include|:|are)?\s*([^.,]+)/gi)
    if (importMatches) {
      trade.imports = this.extractTradeGoods(importMatches.join(' '))
    }
    
    // Extract economic status
    const statusMatch = text.match(this.patterns.location.economicStatus)
    if (statusMatch) {
      trade.economicStatus = statusMatch[0]
    }
    
    // Extract specialties
    const specialtyMatches = text.match(/(?:known for|famous for|specializes in)\s*([^.,]+)/gi)
    if (specialtyMatches) {
      trade.specialties = specialtyMatches.map(m => m.replace(/(?:known for|famous for|specializes in)\s*/i, '').trim())
    }
    
    return trade
  }

  parseWarInfo(text) {
    const war = {
      name: '',
      type: 'conflict',
      status: 'active',
      parties: [],
      description: '',
      location: '',
      duration: ''
    }
    
    // Extract war name or type
    const warMatch = text.match(/(?:([\w\s]+)\s+)?(?:war|conflict|battle|siege|campaign)/i)
    if (warMatch) {
      war.name = warMatch[1] ? warMatch[1].trim() + ' War' : 'Unnamed Conflict'
    }
    
    // Detect conflict type
    if (/civil war/i.test(text)) war.type = 'civil war'
    else if (/rebellion|uprising/i.test(text)) war.type = 'rebellion'
    else if (/invasion|conquest/i.test(text)) war.type = 'invasion'
    else if (/border dispute|skirmish/i.test(text)) war.type = 'border conflict'
    else if (/siege/i.test(text)) war.type = 'siege'
    
    // Extract status
    if (/active|ongoing|current/i.test(text)) war.status = 'active'
    else if (/recent|ended|concluded/i.test(text)) war.status = 'recent'
    else if (/ancient|historical|past/i.test(text)) war.status = 'historical'
    
    // Extract parties involved
    const partiesMatch = text.match(/between\s+([^.]+?)(?:\s+and\s+([^.]+?))?(?:\.|$)/i)
    if (partiesMatch) {
      if (partiesMatch[1]) war.parties.push(partiesMatch[1].trim())
      if (partiesMatch[2]) war.parties.push(partiesMatch[2].trim())
    }
    
    // Alternative party extraction
    const atWarMatch = text.match(/at war with\s+([^.,]+)/i)
    if (atWarMatch) {
      war.parties.push(atWarMatch[1].trim())
    }
    
    // Extract duration
    const durationMatch = text.match(/(?:for|lasted?|ongoing for)\s+(\d+\s*(?:years?|months?|days?))/i)
    if (durationMatch) {
      war.duration = durationMatch[1]
    }
    
    war.description = text.substring(0, 200)
    
    return war
  }

  parseAllianceInfo(text) {
    const alliance = {
      name: '',
      type: 'alliance',
      parties: [],
      status: 'active',
      purpose: '',
      terms: [],
      description: ''
    }
    
    // Extract alliance name or type
    const allianceMatch = text.match(/(?:([\w\s]+)\s+)?(?:alliance|treaty|pact|agreement)/i)
    if (allianceMatch) {
      alliance.name = allianceMatch[1] ? allianceMatch[1].trim() + ' Alliance' : 'Alliance'
    }
    
    // Detect alliance type
    if (/trade agreement|commercial/i.test(text)) alliance.type = 'trade'
    else if (/military|defense|mutual defense/i.test(text)) alliance.type = 'military'
    else if (/peace|non-aggression/i.test(text)) alliance.type = 'peace'
    else if (/diplomatic/i.test(text)) alliance.type = 'diplomatic'
    
    // Extract parties
    const partiesMatch = text.match(/between\s+([^.]+?)(?:\s+and\s+([^.]+?))?(?:\.|$)/i)
    if (partiesMatch) {
      if (partiesMatch[1]) alliance.parties.push(partiesMatch[1].trim())
      if (partiesMatch[2]) alliance.parties.push(partiesMatch[2].trim())
    }
    
    // Alternative party extraction
    const alliedMatch = text.match(/allied with\s+([^.,]+)/i)
    if (alliedMatch) {
      alliance.parties.push(alliedMatch[1].trim())
    }
    
    // Extract purpose
    const purposeMatch = text.match(/(?:for|to|aimed at)\s+([^.,]+)/i)
    if (purposeMatch) {
      alliance.purpose = purposeMatch[1].trim()
    }
    
    alliance.description = text.substring(0, 200)
    
    return alliance
  }

  // Helper to extract trade goods
  extractTradeGoods(text) {
    const goods = []
    const goodsMatch = text.match(this.patterns.item.tradeGoods)
    if (goodsMatch) {
      goods.push(...new Set(goodsMatch))
    }
    
    // Also check for general goods mentioned
    const generalGoods = text.match(/\b\w+(?:s)?\b/g)
    if (generalGoods) {
      const filtered = generalGoods.filter(g => 
        g.length > 3 && 
        !['include', 'are', 'and', 'the', 'from', 'with'].includes(g.toLowerCase())
      )
      goods.push(...filtered.slice(0, 5)) // Limit to prevent noise
    }
    
    return [...new Set(goods)]
  }

  // Enhanced comprehensive document parser
  parseComprehensiveDocument(text) {
    const results = {
      worldInfo: {},
      regions: [],
      cities: [],
      lore: [],
      rules: [],
      trade: [],
      wars: [],
      alliances: [],
      tradeSystems: [],
      legendaryLocations: [],
      pirateCities: []
    }
    
    // Extract world info
    results.worldInfo = this.extractWorldInfo(text)
    
    // Extract regions and their cities with enhanced parsing
    const regionMatches = text.match(/\d+\.\s*([^:]+)\n([^]*?)(?=\d+\.\s*\w+|$)/g)
    if (regionMatches) {
      regionMatches.forEach(match => {
        const region = this.parseRegion(match)
        if (region) {
          results.regions.push(region)
          // Make sure cities are added to the cities array
          if (region.cities && region.cities.length > 0) {
            results.cities.push(...region.cities)
          }
          
          // Check for trade information in region
          if (this.hasTradeInfo(match)) {
            const tradeInfo = this.parseTradeInfo(match, region.name)
            if (tradeInfo) results.trade.push(tradeInfo)
          }
          
          // Check for conflicts in region
          if (this.hasWarInfo(match)) {
            const warInfo = this.parseWarInfo(match)
            if (warInfo) results.wars.push(warInfo)
          }
          
          // Check for alliances in region
          if (this.hasAllianceInfo(match)) {
            const allianceInfo = this.parseAllianceInfo(match)
            if (allianceInfo) results.alliances.push(allianceInfo)
          }
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
    const loreIndicators = ['Cultural & Temporal Depth', 'Ethnic Groups', 'Seasonal Cycles', 'Cold War', 'Trade Networks', 'Political Landscape']
    loreIndicators.forEach(indicator => {
      const section = text.match(new RegExp(`${indicator}[^]*?(?=\\n[A-Z]|$)`, 'i'))
      if (section) {
        const loreContent = {
          title: indicator,
          content: this.cleanText(section[0]),
          type: 'world-history'
        }
        
        results.lore.push(loreContent)
        
        // Check for additional categorization
        if (indicator === 'Trade Networks' && this.hasTradeInfo(section[0])) {
          const tradeInfo = this.parseTradeInfo(section[0], indicator)
          if (tradeInfo) results.trade.push(tradeInfo)
        }
        
        if (indicator === 'Political Landscape') {
          if (this.hasWarInfo(section[0])) {
            const warInfo = this.parseWarInfo(section[0])
            if (warInfo) results.wars.push(warInfo)
          }
          if (this.hasAllianceInfo(section[0])) {
            const allianceInfo = this.parseAllianceInfo(section[0])
            if (allianceInfo) results.alliances.push(allianceInfo)
          }
        }
      }
    })
    
    return results
  }

  // Enhanced parseRegion function with better city detection
  parseRegion(regionText) {
    const lines = regionText.split('\n')
    const titleMatch = lines[0].match(/\d+\.\s*(.+)/)
    if (!titleMatch) return null
    
    const region = {
      name: titleMatch[1].trim(),
      cities: [],
      description: '',
      tradeNotes: [],
      conflicts: [],
      alliances: []
    }
    
    // Debug logging
    console.log('Parsing region:', region.name)
    console.log('Region text preview:', regionText.substring(0, 200))
    
    // Process each line looking for cities
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // Skip if it's another numbered region
      if (line.match(/^\d+\.\s+\w+/)) continue
      
      // Method 1: Try standard city format with flexible patterns
      // Handle various dash characters and spacing
      const cityMatch = line.match(/^([^:]+?)(?:\s*\(Capital\))?\s*:\s*Pop\.?\s*([\d,kKmM]+)\s*[–\-—]\s*(.+?)(?:\s*Wealth:\s*(.+))?$/i)
      
      if (cityMatch) {
        const city = {
          name: cityMatch[1].trim(),
          isCapital: line.includes('(Capital)'),
          population: this.parsePopulation(cityMatch[2]),
          description: cityMatch[3].trim(),
          wealth: cityMatch[4] ? cityMatch[4].trim() : 'Unknown',
          region: region.name,
          type: 'city'
        }
        
        // Determine type based on population
        if (city.population < 1000) city.type = 'village'
        else if (city.population < 5000) city.type = 'town'
        else city.type = 'city'
        
        // Check for trade importance
        if (this.hasTradeInfo(city.description)) {
          city.hasTradeImportance = true
        }
        
        region.cities.push(city)
        console.log('Found city (method 1):', city.name, city.population)
      } 
      // Method 2: Alternative format without colon
      else if (line.match(/Pop\.?\s*\d+/i)) {
        // Try to parse lines that have population but different format
        const nameMatch = line.match(/^([^–\-—]+?)(?:\s*\(Capital\))?\s*[–\-—]?\s*Pop\.?\s*([\d,kKmM]+)/i)
        
        if (nameMatch) {
          const restOfLine = line.substring(nameMatch[0].length).trim()
          const wealthMatch = restOfLine.match(/Wealth:\s*(.+?)(?:\s|$)/i)
          
          const city = {
            name: nameMatch[1].trim(),
            isCapital: line.includes('(Capital)'),
            population: this.parsePopulation(nameMatch[2]),
            description: restOfLine.replace(/Wealth:\s*.+/i, '').replace(/^[–\-—]\s*/, '').trim(),
            wealth: wealthMatch ? wealthMatch[1].trim() : 'Unknown',
            region: region.name,
            type: 'city'
          }
          
          // Determine type based on population
          if (city.population < 1000) city.type = 'village'
          else if (city.population < 5000) city.type = 'town'
          else city.type = 'city'
          
          region.cities.push(city)
          console.log('Found city (method 2):', city.name, city.population)
        }
      }
      // Method 3: Check if line starts with a capitalized name and contains city indicators
      else if (line.match(/^[A-Z]/) && (line.match(/\b\d+[,\d]*\b/) || this.patterns.location.cityTypes.test(line))) {
        // This might be a city in a less structured format
        const possibleName = line.match(/^([^,.:]+)/)?.[1]?.trim()
        const possiblePop = line.match(/(\d+[,\d]*)/)?.[1]
        
        if (possibleName && possiblePop) {
          const city = {
            name: possibleName,
            isCapital: line.includes('(Capital)') || line.includes('capital'),
            population: parseInt(possiblePop.replace(/,/g, '')),
            description: line,
            wealth: 'Unknown',
            region: region.name,
            type: 'settlement'
          }
          
          // Extract wealth if mentioned
          const wealthMatch = line.match(/Wealth:\s*(.+?)(?:\s|$)/i)
          if (wealthMatch) city.wealth = wealthMatch[1].trim()
          
          // Determine type
          if (city.population < 1000) city.type = 'village'
          else if (city.population < 5000) city.type = 'town'
          else city.type = 'city'
          
          region.cities.push(city)
          console.log('Found city (method 3):', city.name, city.population)
        }
      }
    }
    
    console.log(`Found ${region.cities.length} cities in ${region.name}`)
    
    // Extract regional trade notes
    if (this.hasTradeInfo(regionText)) {
      const tradeMatches = regionText.match(this.patterns.location.trade)
      if (tradeMatches) {
        region.tradeNotes = [...new Set(tradeMatches)]
      }
    }
    
    // Extract regional conflicts
    if (this.hasWarInfo(regionText)) {
      const warMatches = regionText.match(this.patterns.politics.wars)
      if (warMatches) {
        region.conflicts = [...new Set(warMatches)]
      }
    }
    
    // Extract regional alliances
    if (this.hasAllianceInfo(regionText)) {
      const allianceMatches = regionText.match(this.patterns.politics.alliances)
      if (allianceMatches) {
        region.alliances = [...new Set(allianceMatches)]
      }
    }
    
    return region
  }

  // Helper to parse population with k/M notation
  parsePopulation(popString) {
    if (!popString) return 0
    
    // Remove commas and convert to string
    let cleanString = popString.toString().replace(/,/g, '')
    let multiplier = 1
    
    // Check for k/K (thousands)
    if (cleanString.match(/[kK]/i)) {
      multiplier = 1000
      cleanString = cleanString.replace(/[kK]/gi, '')
    }
    // Check for m/M (millions)
    else if (cleanString.match(/[mM]/i) || cleanString.match(/million/i)) {
      multiplier = 1000000
      cleanString = cleanString.replace(/[mM]/gi, '').replace(/million/gi, '')
    }
    
    // Parse the number
    const baseNumber = parseFloat(cleanString)
    if (isNaN(baseNumber)) return 0
    
    return Math.round(baseNumber * multiplier)
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

  // Parse pirate cities with enhanced parsing
  parsePirateCities(text) {
    const cities = []
    const cityPattern = /\d+\.\s*([^\n]+)\n\s*Pop\.\s*([\d,kKmM]+)\n\s*Traits:\s*([^\n]+)\n\s*Wealth:\s*(\w+)/g
    let match
    
    while ((match = cityPattern.exec(text)) !== null) {
      const city = {
        name: match[1].trim(),
        population: this.parsePopulation(match[2]),
        traits: match[3].trim(),
        wealth: match[4].trim(),
        type: 'pirate-city',
        hasTradeImportance: true // Pirate cities are inherently trade-related
      }
      
      // Check if traits mention trade
      if (this.hasTradeInfo(city.traits)) {
        city.tradeSpecialties = this.extractTradeGoods(city.traits)
      }
      
      cities.push(city)
    }
    
    return cities
  }

  // Extract world info with enhanced political/economic data
  extractWorldInfo(text) {
    const info = {
      name: 'Untitled World',
      system: 'Pathfinder 1e',
      tone: '',
      magicLevel: '',
      technology: '',
      politicalSystem: '',
      economicSystem: '',
      majorConflicts: [],
      majorAlliances: [],
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
    
    // Extract political system
    const polMatch = text.match(/Political System:\s*([^\n]+)/i)
    if (polMatch) info.politicalSystem = polMatch[1].trim()
    
    // Extract economic system
    const econMatch = text.match(/Economic System:\s*([^\n]+)/i)
    if (econMatch) info.economicSystem = econMatch[1].trim()
    
    // Extract major conflicts
    const conflictSection = text.match(/Major Conflicts:[^]*?(?=\n[A-Z])/i)
    if (conflictSection) {
      const conflicts = conflictSection[0].match(/[-•]\s*([^\n]+)/g)
      if (conflicts) {
        info.majorConflicts = conflicts.map(c => c.replace(/[-•]\s*/, '').trim())
      }
    }
    
    // Extract major alliances
    const allianceSection = text.match(/Major Alliances:[^]*?(?=\n[A-Z])/i)
    if (allianceSection) {
      const alliances = allianceSection[0].match(/[-•]\s*([^\n]+)/g)
      if (alliances) {
        info.majorAlliances = alliances.map(a => a.replace(/[-•]\s*/, '').trim())
      }
    }
    
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

  // Enhanced lore parser
  parseLore(text) {
    const lore = {
      title: '',
      type: 'world-history',
      content: text,
      timePeriod: '',
      themes: [],
      relatedConflicts: [],
      relatedAlliances: []
    }
    
    // Extract title
    const titleMatch = text.match(/^([^\n:]+)/);
    if (titleMatch) lore.title = titleMatch[1].trim()
    
    // Detect lore type
    if (this.patterns.lore.faction.test(text)) lore.type = 'organization'
    else if (this.patterns.lore.mythology.test(text)) lore.type = 'mythology'
    else if (this.patterns.lore.timeline.test(text)) lore.type = 'timeline'
    else if (this.patterns.politics.wars.test(text)) lore.type = 'conflict-history'
    else if (this.patterns.politics.alliances.test(text)) lore.type = 'diplomatic-history'
    
    // Extract time period
    const timeMatch = text.match(/(\d+)\s*years?\s*ago/i)
    if (timeMatch) lore.timePeriod = timeMatch[0]
    
    // Extract related conflicts
    if (this.hasWarInfo(text)) {
      const conflicts = text.match(this.patterns.politics.wars)
      if (conflicts) lore.relatedConflicts = [...new Set(conflicts)]
    }
    
    // Extract related alliances
    if (this.hasAllianceInfo(text)) {
      const alliances = text.match(this.patterns.politics.alliances)
      if (alliances) lore.relatedAlliances = [...new Set(alliances)]
    }
    
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
      description: text,
      isTradeGood: false,
      value: ''
    }
    
    // Extract item type
    const typeMatch = text.match(this.patterns.item.type)
    if (typeMatch) item.type = typeMatch[0].toLowerCase()
    
    // Check if it's a trade good
    const tradeGoodMatch = text.match(this.patterns.item.tradeGoods)
    if (tradeGoodMatch) {
      item.isTradeGood = true
      item.type = 'trade-good'
    }
    
    // Extract rarity
    const rarityMatch = text.match(this.patterns.item.rarity)
    if (rarityMatch) item.rarity = rarityMatch[0].toLowerCase()
    
    // Extract value if mentioned
    const valueMatch = text.match(/(\d+)\s*(?:gp|gold|sp|silver|cp|copper)/i)
    if (valueMatch) item.value = valueMatch[0]
    
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
    
    // Extract category with enhanced categories
    const categoryMatch = text.match(this.patterns.rule.category)
    if (categoryMatch) rule.category = categoryMatch[0].toLowerCase()
    
    // Check if it's an economic or political rule
    if (this.hasTradeInfo(text)) rule.category = 'economic'
    else if (this.hasWarInfo(text) || this.hasAllianceInfo(text)) rule.category = 'political'
    
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

  // Enhanced document type detection
  detectDocumentType(text) {
    const indicators = {
      comprehensive: [
        'World Building Document',
        'Campaign Setting',
        'World Overview',
        'Geographical Structure',
        'Political Landscape',
        'Economic Systems'
      ],
      locationList: [
        'Cities:', 'Settlements:', 'Locations:',
        /\d+\.\s*\w+.*Pop\./g,
        'Towns:', 'Villages:'
      ],
      loreDocument: [
        'History:', 'Timeline:', 'Age of', 'Era of'
      ],
      tradeDocument: [
        'Trade Routes:', 'Economic Report:', 'Market Analysis:'
      ],
      politicalDocument: [
        'Political Situation:', 'Current Conflicts:', 'Diplomatic Relations:'
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
    
    // Check for trade document
    if (indicators.tradeDocument.some(ind => text.includes(ind))) {
      return 'trade'
    }
    
    // Check for political document
    if (indicators.politicalDocument.some(ind => text.includes(ind))) {
      return 'political'
    }
    
    return 'mixed'
  }

  // Convert parsed data to form data with enhanced conversion
  convertToFormData(parsed, category) {
    const converters = {
      locations: (location) => ({
        type: location.type || 'city',
        name: location.name,
        size: location.size || 'medium',
        features: location.features ? location.features.join(', ') : location.description,
        includeMap: true,
        includeNPCs: location.population > 5000,
        governance: location.governance || '',
        economicNotes: location.economicNotes ? location.economicNotes.join(', ') : '',
        diplomaticStatus: location.diplomaticStatus ? location.diplomaticStatus.join(', ') : ''
      }),
      
      lore: (lore) => ({
        type: lore.type || 'world-history',
        subject: lore.title,
        timePeriod: lore.timePeriod || 'Current era',
        themes: lore.themes.join(', '),
        connections: lore.relatedConflicts.concat(lore.relatedAlliances).join(', ')
      }),
      
      trade: (trade) => ({
        type: 'trade-system',
        name: trade.name,
        tradeRoutes: trade.tradeRoutes.join(', '),
        exports: trade.exports.join(', '),
        imports: trade.imports.join(', '),
        economicStatus: trade.economicStatus,
        specialties: trade.specialties.join(', ')
      }),
      
      wars: (war) => ({
        type: 'conflict',
        name: war.name,
        status: war.status,
        parties: war.parties.join(' vs '),
        duration: war.duration,
        description: war.description
      }),
      
      alliances: (alliance) => ({
        type: 'diplomatic',
        name: alliance.name,
        parties: alliance.parties.join(' & '),
        purpose: alliance.purpose,
        terms: alliance.terms.join(', '),
        description: alliance.description
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
        theme: item.isTradeGood ? 'trade goods' : '',
        properties: item.description,
        value: item.value
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