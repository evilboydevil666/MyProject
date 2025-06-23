// src/utils/inventoryParser.js - ENHANCED VERSION with Rarity, Weight, Value
// Compatible with Character Builder Integration

import { characterState } from '../characterState.js'

export class InventoryParser {
  
  // === EXISTING PATTERNS (from your original) ===
  static acquisitionPatterns = [
    /(?:you|the party|[a-zA-Z]+)\s+(?:gain|receive|find|discover|obtain|acquire|get|take|pick up|loot|collect)\s+([^.!?]+)/gi,
    /(?:gives?|hands?|offers?|presents?|grants?)\s+(?:you|the party)\s+([^.!?]+)/gi,
    /(?:the\s+)?(?:bandit|orc|goblin|skeleton|zombie|guard|soldier|merchant|wizard|priest|thief|assassin|warrior|knight|dragon|giant|troll|ogre|dwarf|elf|human|creature|enemy|foe|monster)\s+(?:drops?|leaves?|loses?)\s+([^.!?]+)/gi,
    /(?:upon\s+(?:death|defeat|killing)|after\s+(?:defeating|killing))\s+.*?(?:drops?|leaves?|contains?)\s+([^.!?]+)/gi,
    /(?:treasure|loot|reward|payment|prize)\s+(?:includes?|contains?|is|has)\s+([^.!?]+)/gi,
    /(?:you|the party)\s+(?:buy|purchase|acquire)\s+([^.!?]+)/gi,
    /(?:trade|exchange|swap|barter).*?(?:for|in exchange for|to get)\s+([^.!?]+)/gi,
    /(?:in|inside|within)\s+(?:the|a|an)\s+(?:chest|bag|pouch|container|box|barrel|crate|sack)\s+(?:you|there|is|are)\s+(?:find|discover|see)\s+([^.!?]+)/gi,
    /(?:adds?|places?)\s+([^.!?]+)\s+(?:to|into)\s+(?:your|the)\s+(?:inventory|pack|bag|pouch)/gi,
    /(?:there|here)\s+(?:is|are)\s+([^.!?]+)\s+(?:on|in|near|by)\s+(?:the|a|an)/gi,
    /(?:after|upon)\s+(?:defeating|killing|victory|success)\s+.*(?:you|the party)\s+(?:gain|find|receive)\s+([^.!?]+)/gi
  ]

  static lossPatterns = [
    /(?:you|the party)\s+(?:lose|drop|discard|sell|give away|throw away|abandon|sacrifice)\s+([^.!?]+)/gi,
    /(?:your|a)\s+([^.!?]+)\s+(?:is|are|was|were)\s+(?:lost|destroyed|broken|consumed|used up|stolen|taken|damaged beyond repair)/gi,
    /(?:your)\s+([^.!?]+)\s+(?:falls|drops|disappears|vanishes|breaks|shatters)/gi,
    /(?:consumes?|uses?|drinks?|eats?)\s+([^.!?]+)/gi,
    /(?:you|the party)\s+(?:trade|exchange|swap|barter|give)\s+([^.!?]+?)\s+(?:for|in exchange for|to get)/gi,
    /(?:you|the party)\s+(?:sell)\s+([^.!?]+)/gi
  ]

  static moneyGainPatterns = [
    /(?:gain|receive|find|earn|get|obtain|acquire)\s+(\d+)\s+(gold|silver|copper|platinum)\s+(?:pieces?|coins?)/gi,
    /(\d+)\s+(gp|sp|cp|pp)(?:\s|$|[^a-zA-Z])/gi,
    /(?:treasure|loot|reward|payment)\s+(?:of|includes?|contains?)\s+(\d+)\s+(gold|silver|copper|platinum|gp|sp|cp|pp)/gi
  ]

  static moneyLossPatterns = [
    /(?:pays?|spends?|loses?|costs?)\s+(\d+)\s+(gold|silver|copper|platinum|gp|sp|cp|pp)/gi,
    /(?:for|costs?)\s+(\d+)\s+(gold|silver|copper|platinum|gp|sp|cp|pp)/gi
  ]

  // === NEW: RARITY DETECTION SYSTEM ===
  static rarityKeywords = {
    mundane: ['simple', 'basic', 'standard', 'common', 'ordinary', 'plain', 'crude', 'poor quality'],
    masterwork: ['masterwork', 'fine', 'quality', 'well-made', 'expert', 'superior'],
    minor: ['minor', 'lesser', '+1', 'slight', 'weak'],
    moderate: ['moderate', '+2', 'greater', 'improved'],
    major: ['major', '+3', 'powerful', 'potent', 'strong'],
    legendary: ['legendary', 'artifact', 'unique', '+4', '+5', 'mythic', 'epic', 'divine', 'ancient']
  }

  static detectRarity(itemName) {
    const lowerName = itemName.toLowerCase()
    
    // Check for explicit bonuses first
    const bonusMatch = lowerName.match(/\+(\d+)/)
    if (bonusMatch) {
      const bonus = parseInt(bonusMatch[1])
      if (bonus === 1) return 'minor'
      if (bonus === 2) return 'moderate'
      if (bonus === 3) return 'major'
      if (bonus >= 4) return 'legendary'
    }
    
    // Check rarity keywords
    for (const [rarity, keywords] of Object.entries(this.rarityKeywords)) {
      if (keywords.some(keyword => lowerName.includes(keyword))) {
        return rarity
      }
    }
    
    // Check if it's magical
    if (lowerName.includes('magic') || lowerName.includes('enchanted') || 
        lowerName.includes('blessed') || lowerName.includes('cursed')) {
      return 'minor' // Default magic items to minor
    }
    
    return 'mundane'
  }

  // === NEW: PATHFINDER 1E WEIGHT DATABASE ===
  static itemWeights = {
    // Weapons
    'dagger': 1, 'kukri': 2, 'punching dagger': 1, 'spiked gauntlet': 1,
    'light mace': 4, 'sickle': 2, 'club': 3, 'shortspear': 3,
    'heavy mace': 8, 'morningstar': 6, 'quarterstaff': 4, 'spear': 6,
    'crossbow': 4, 'light crossbow': 4, 'heavy crossbow': 8, 'hand crossbow': 2,
    'dart': 0.5, 'javelin': 2, 'sling': 0, 'throwing axe': 2,
    'light hammer': 2, 'handaxe': 3, 'short sword': 2, 'rapier': 2,
    'scimitar': 4, 'longsword': 4, 'battleaxe': 6, 'flail': 5,
    'heavy flail': 10, 'warhammer': 5, 'greatsword': 8, 'greataxe': 12,
    'glaive': 10, 'greatclub': 8, 'guisarme': 12, 'halberd': 12,
    'lance': 10, 'longspear': 9, 'ranseur': 12, 'scythe': 10,
    'trident': 4, 'whip': 2, 'longbow': 3, 'shortbow': 2,
    'composite longbow': 3, 'composite shortbow': 2,
    'arrow': 0.15, 'arrows': 0.15, 'bolt': 0.1, 'bolts': 0.1,
    'sling bullet': 0.5, 'sling bullets': 0.5,
    
    // Armor
    'padded armor': 10, 'leather armor': 15, 'studded leather': 20,
    'chain shirt': 25, 'hide armor': 25, 'scale mail': 30, 'chainmail': 40,
    'breastplate': 30, 'splint mail': 45, 'banded mail': 35, 'half-plate': 50,
    'full plate': 50, 'buckler': 5, 'light shield': 5, 'light wooden shield': 5,
    'light steel shield': 6, 'heavy shield': 10, 'heavy wooden shield': 10,
    'heavy steel shield': 15, 'tower shield': 45,
    
    // Adventuring Gear
    'backpack': 2, 'bedroll': 5, 'blanket': 3, 'winter blanket': 3,
    'candle': 0, 'chain': 2, 'crowbar': 5, 'flask': 0.03, 'empty flask': 0.03,
    'flint and steel': 0, 'grappling hook': 4, 'hammer': 2, 'ink': 0,
    'lamp': 1, 'lantern': 2, 'hooded lantern': 2, 'bullseye lantern': 3,
    'lock': 1, 'manacles': 2, 'mirror': 0.5, 'small mirror': 0.5,
    'oil': 1, 'flask of oil': 1, 'paper': 0, 'parchment': 0,
    'piton': 0.5, 'pitons': 0.5, 'pole': 8, '10-foot pole': 8,
    'pot': 10, 'iron pot': 10, 'pouch': 0.5, 'belt pouch': 0.5,
    'rations': 1, 'trail rations': 1, 'rope': 10, 'silk rope': 5,
    'hempen rope': 10, 'sack': 0.5, 'empty sack': 0.5,
    'shovel': 8, 'spade': 8, 'signal whistle': 0, 'signet ring': 0,
    'sledge': 10, 'soap': 0, 'spellbook': 3, 'tent': 20,
    'torch': 1, 'torches': 1, 'vial': 0, 'empty vial': 0,
    'waterskin': 4, 'whetstone': 0.02,
    
    // Tools
    'thieves tools': 1, "thieves' tools": 1, 'artisan tools': 5,
    'alchemist lab': 40, 'climbers kit': 5, 'disguise kit': 8,
    'healers kit': 1, 'holy symbol': 1, 'wooden holy symbol': 0,
    'silver holy symbol': 1, 'hourglass': 1, 'magnifying glass': 0,
    'musical instrument': 3, 'scale': 2, 'merchants scale': 2,
    
    // Magic Items (base weights)
    'potion': 0.1, 'scroll': 0, 'wand': 0.1, 'rod': 5,
    'staff': 5, 'ring': 0, 'amulet': 0, 'cloak': 1,
    'boots': 1, 'gloves': 0, 'bracers': 1, 'belt': 1,
    'headband': 0, 'periapt': 0, 'phylactery': 0, 'brooch': 0,
    'medallion': 0, 'necklace': 0, 'scarab': 0,
    
    // Coins and Gems (per unit)
    'copper piece': 0.02, 'silver piece': 0.02, 'gold piece': 0.02,
    'platinum piece': 0.02, 'gem': 0, 'small gem': 0, 'large gem': 0.1,
    
    // Consumables
    'healing potion': 0.1, 'antidote': 0, 'antitoxin': 0,
    'acid': 1, 'flask of acid': 1, 'alchemist fire': 1,
    "alchemist's fire": 1, 'holy water': 1, 'flask of holy water': 1,
    'smokestick': 0.5, 'sunrod': 1, 'tanglefoot bag': 4,
    'thunderstone': 1, 'tindertwig': 0,
    
    // Food & Drink
    'ale': 8, 'gallon of ale': 8, 'mug of ale': 1, 'bread': 0.5,
    'loaf of bread': 0.5, 'cheese': 0.5, 'chunk of cheese': 0.5,
    'meat': 0.5, 'chunk of meat': 0.5, 'wine': 1.5, 'bottle of wine': 1.5,
    'common wine': 1.5, 'fine wine': 1.5,
    
    // Special Materials (modifiers)
    'mithral': 0.5, // multiply normal weight by 0.5
    'adamantine': 1, // same weight as normal
    'darkwood': 0.5, // multiply normal weight by 0.5
    'cold iron': 1, // same weight as normal
    'silver': 1, // same weight as normal
    'alchemical silver': 1 // same weight as normal
  }

  // === NEW: PATHFINDER 1E VALUE DATABASE ===
  static itemValues = {
    // Weapons (in gp)
    'dagger': 2, 'kukri': 8, 'punching dagger': 2, 'spiked gauntlet': 5,
    'light mace': 5, 'sickle': 6, 'club': 0, 'shortspear': 1,
    'heavy mace': 12, 'morningstar': 8, 'quarterstaff': 0, 'spear': 2,
    'crossbow': 35, 'light crossbow': 35, 'heavy crossbow': 50,
    'hand crossbow': 100, 'dart': 0.5, 'javelin': 1, 'sling': 0,
    'throwing axe': 8, 'light hammer': 1, 'handaxe': 6, 'short sword': 10,
    'rapier': 20, 'scimitar': 15, 'longsword': 15, 'battleaxe': 10,
    'flail': 8, 'heavy flail': 15, 'warhammer': 12, 'greatsword': 50,
    'greataxe': 20, 'glaive': 8, 'greatclub': 5, 'guisarme': 9,
    'halberd': 10, 'lance': 10, 'longspear': 5, 'ranseur': 10,
    'scythe': 18, 'trident': 15, 'whip': 1, 'longbow': 75,
    'shortbow': 30, 'composite longbow': 100, 'composite shortbow': 75,
    'arrow': 0.05, 'arrows': 0.05, 'bolt': 0.1, 'bolts': 0.1,
    'sling bullet': 0.01, 'sling bullets': 0.01,
    
    // Armor (in gp)
    'padded armor': 5, 'leather armor': 10, 'studded leather': 25,
    'chain shirt': 100, 'hide armor': 15, 'scale mail': 50,
    'chainmail': 150, 'breastplate': 200, 'splint mail': 200,
    'banded mail': 250, 'half-plate': 600, 'full plate': 1500,
    'buckler': 5, 'light wooden shield': 3, 'light steel shield': 9,
    'heavy wooden shield': 7, 'heavy steel shield': 20, 'tower shield': 30,
    
    // Adventuring Gear (in gp)
    'backpack': 2, 'bedroll': 0.1, 'blanket': 0.5, 'winter blanket': 0.5,
    'candle': 0.01, 'chain': 30, 'crowbar': 2, 'flask': 0.03,
    'flint and steel': 1, 'grappling hook': 1, 'hammer': 0.5,
    'ink': 8, 'vial of ink': 8, 'lamp': 0.1, 'lantern': 7,
    'hooded lantern': 7, 'bullseye lantern': 12, 'lock': 20,
    'manacles': 15, 'mirror': 10, 'small steel mirror': 10,
    'oil': 0.1, 'flask of oil': 0.1, 'paper': 0.4, 'sheet of paper': 0.4,
    'parchment': 0.2, 'sheet of parchment': 0.2, 'piton': 0.1,
    'pitons': 0.1, 'pole': 0.05, '10-foot pole': 0.05,
    'pot': 0.8, 'iron pot': 0.8, 'pouch': 1, 'belt pouch': 1,
    'rations': 0.5, 'trail rations': 0.5, 'rope': 1, 'hempen rope': 1,
    'silk rope': 10, 'sack': 0.1, 'shovel': 2, 'spade': 2,
    'signal whistle': 0.8, 'signet ring': 5, 'sledge': 1,
    'soap': 0.5, 'spellbook': 15, 'tent': 10, 'torch': 0.01,
    'torches': 0.01, 'vial': 1, 'waterskin': 1, 'whetstone': 0.02,
    
    // Tools (in gp)
    'thieves tools': 30, "thieves' tools": 30, 'masterwork thieves tools': 100,
    'artisan tools': 5, 'masterwork artisan tools': 55,
    'alchemist lab': 200, 'climbers kit': 80, 'disguise kit': 50,
    'healers kit': 50, 'holy symbol': 1, 'wooden holy symbol': 1,
    'silver holy symbol': 25, 'hourglass': 25, 'magnifying glass': 100,
    'musical instrument': 5, 'masterwork musical instrument': 100,
    'scale': 2, 'merchants scale': 2,
    
    // Potions (in gp)
    'potion': 50, 'healing potion': 50, 'potion of cure light wounds': 50,
    'potion of cure moderate wounds': 300, 'potion of cure serious wounds': 750,
    'antidote': 50, 'antitoxin': 50, 'potion of bulls strength': 300,
    'potion of cats grace': 300, 'potion of bears endurance': 300,
    
    // Scrolls (in gp)
    'scroll': 25, 'scroll of magic missile': 25, 'scroll of cure light wounds': 25,
    'scroll of identify': 25, 'scroll of mage armor': 25,
    
    // Consumables (in gp)
    'acid': 10, 'flask of acid': 10, 'alchemist fire': 20,
    "alchemist's fire": 20, 'holy water': 25, 'flask of holy water': 25,
    'smokestick': 20, 'sunrod': 2, 'tanglefoot bag': 50,
    'thunderstone': 30, 'tindertwig': 1,
    
    // Food & Drink (in gp)
    'ale': 0.04, 'gallon of ale': 0.2, 'mug of ale': 0.04,
    'bread': 0.02, 'loaf of bread': 0.02, 'cheese': 0.1,
    'chunk of cheese': 0.1, 'meat': 0.3, 'chunk of meat': 0.3,
    'wine': 0.2, 'common wine': 0.2, 'bottle of wine': 2, 'fine wine': 10,
    
    // Gems (in gp)
    'gem': 50, 'small gem': 10, 'large gem': 100, 'tiny gem': 5,
    'agate': 10, 'azurite': 10, 'quartz': 10, 'hematite': 10,
    'lapis lazuli': 10, 'malachite': 10, 'obsidian': 10,
    'rhodochrosite': 10, 'tiger eye': 10, 'turquoise': 10,
    'bloodstone': 50, 'carnelian': 50, 'chalcedony': 50,
    'chrysoprase': 50, 'citrine': 50, 'jasper': 50, 'moonstone': 50,
    'onyx': 50, 'peridot': 50, 'rock crystal': 50, 'sard': 50,
    'sardonyx': 50, 'rose quartz': 50, 'smoky quartz': 50,
    'star rose quartz': 50, 'zircon': 50, 'amber': 100, 'amethyst': 100,
    'chrysoberyl': 100, 'coral': 100, 'garnet': 100, 'jade': 100,
    'jet': 100, 'pearl': 100, 'spinel': 100, 'tourmaline': 100,
    'alexandrite': 500, 'aquamarine': 500, 'violet garnet': 500,
    'black pearl': 500, 'deep blue spinel': 500, 'golden yellow topaz': 500,
    'emerald': 1000, 'white opal': 1000, 'black opal': 1000,
    'fire opal': 1000, 'sapphire': 1000, 'star ruby': 1000,
    'star sapphire': 1000, 'diamond': 5000
  }

  /**
   * Calculate item weight based on Pathfinder 1e rules
   * @param {Object} item - Item object with name and quantity
   * @returns {number} - Total weight in pounds
   */
  static calculateWeight(item) {
    const itemName = item.name.toLowerCase()
    let baseWeight = 0
    let multiplier = 1
    
    // Check for special materials that modify weight
    if (itemName.includes('mithral') || itemName.includes('darkwood')) {
      multiplier = 0.5
    }
    
    // First try exact match
    if (this.itemWeights[itemName]) {
      baseWeight = this.itemWeights[itemName]
    } else {
      // Try to find partial matches
      for (const [key, weight] of Object.entries(this.itemWeights)) {
        if (itemName.includes(key) || key.includes(itemName)) {
          baseWeight = weight
          break
        }
      }
      
      // If still not found, estimate by category
      if (baseWeight === 0) {
        const category = item.category || this.categorizeItem(itemName)
        const categoryWeights = {
          'weapons': 4,      // Average weapon weight
          'armor': 25,       // Average armor weight
          'consumables': 0.5, // Average consumable weight
          'tools': 2,        // Average tool weight
          'magic': 1,        // Average magic item weight
          'valuables': 0,    // Gems/jewelry have negligible weight
          'miscellaneous': 1 // Default weight
        }
        baseWeight = categoryWeights[category] || 1
      }
    }
    
    // Apply special material multiplier and quantity
    const totalWeight = baseWeight * multiplier * (item.quantity || 1)
    
    // Round to 2 decimal places
    return Math.round(totalWeight * 100) / 100
  }

  /**
   * Estimate item value based on Pathfinder 1e rules
   * @param {Object} item - Item object
   * @returns {number} - Estimated value in gold pieces
   */
  static estimateValue(item) {
    const itemName = item.name.toLowerCase()
    const rarity = item.rarity || this.detectRarity(itemName)
    let baseValue = 0
    
    // First try exact match
    if (this.itemValues[itemName]) {
      baseValue = this.itemValues[itemName]
    } else {
      // Try to find partial matches
      for (const [key, value] of Object.entries(this.itemValues)) {
        if (itemName.includes(key) || key.includes(itemName)) {
          baseValue = value
          break
        }
      }
      
      // If still not found, estimate by category and rarity
      if (baseValue === 0) {
        const category = item.category || this.categorizeItem(itemName)
        const categoryBaseValues = {
          'weapons': 15,
          'armor': 50,
          'consumables': 25,
          'tools': 10,
          'magic': 100,
          'valuables': 50,
          'miscellaneous': 5
        }
        baseValue = categoryBaseValues[category] || 5
      }
    }
    
    // Apply rarity multipliers
    const rarityMultipliers = {
      'mundane': 1,
      'masterwork': 3,  // Masterwork items are typically +300gp
      'minor': 10,      // Minor magic items start around 1000gp
      'moderate': 50,   // Moderate magic items around 5000gp
      'major': 200,     // Major magic items around 20000gp
      'legendary': 1000 // Legendary items 100000gp+
    }
    
    // Special handling for weapons/armor with enhancement bonuses
    const bonusMatch = itemName.match(/\+(\d+)/)
    if (bonusMatch && (item.category === 'weapons' || item.category === 'armor')) {
      const bonus = parseInt(bonusMatch[1])
      const enhancementValue = Math.pow(bonus, 2) * 2000 // Standard formula
      baseValue = Math.max(baseValue, 50) + enhancementValue // Base item + enhancement
    } else {
      baseValue *= rarityMultipliers[rarity] || 1
    }
    
    // Apply special material modifiers
    if (itemName.includes('mithral')) baseValue += 500
    if (itemName.includes('adamantine')) baseValue += 3000
    if (itemName.includes('cold iron')) baseValue *= 2
    if (itemName.includes('silver') || itemName.includes('alchemical silver')) baseValue += 90
    if (itemName.includes('darkwood')) baseValue += 10 // per pound saved
    
    // Apply quantity
    const totalValue = baseValue * (item.quantity || 1)
    
    // Round to nearest gold piece
    return Math.round(totalValue)
  }

  /**
   * Calculate total inventory weight
   * @param {Array} inventory - Array of inventory items
   * @returns {Object} - Weight summary
   */
  static calculateTotalWeight(inventory) {
    let totalWeight = 0
    const breakdown = {}
    
    inventory.forEach(item => {
      const weight = this.calculateWeight(item)
      totalWeight += weight
      
      const category = item.category || this.categorizeItem(item.name)
      if (!breakdown[category]) {
        breakdown[category] = 0
      }
      breakdown[category] += weight
    })
    
    return {
      total: Math.round(totalWeight * 100) / 100,
      breakdown: breakdown,
      encumbrance: this.calculateEncumbrance(totalWeight)
    }
  }

  /**
   * Calculate encumbrance level based on character strength
   * @param {number} totalWeight - Total weight carried
   * @param {number} strength - Character strength score
   * @returns {Object} - Encumbrance details
   */
  static calculateEncumbrance(totalWeight, strength = 10) {
    // Pathfinder 1e carrying capacity
    const lightLoad = this.getCarryingCapacity(strength, 'light')
    const mediumLoad = this.getCarryingCapacity(strength, 'medium')
    const heavyLoad = this.getCarryingCapacity(strength, 'heavy')
    
    let level = 'unencumbered'
    let speedPenalty = 0
    let checkPenalty = 0
    let maxDex = null
    
    if (totalWeight <= lightLoad) {
      level = 'light'
    } else if (totalWeight <= mediumLoad) {
      level = 'medium'
      speedPenalty = 10 // reduced speed
      checkPenalty = -3
      maxDex = 3
    } else if (totalWeight <= heavyLoad) {
      level = 'heavy'
      speedPenalty = 20 // severely reduced speed
      checkPenalty = -6
      maxDex = 1
    } else {
      level = 'overloaded'
      speedPenalty = 30 // can barely move
      checkPenalty = -10
      maxDex = 0
    }
    
    return {
      level,
      currentWeight: totalWeight,
      lightLoad,
      mediumLoad,
      heavyLoad,
      speedPenalty,
      checkPenalty,
      maxDex,
      canRun: level !== 'heavy' && level !== 'overloaded'
    }
  }

  /**
   * Get carrying capacity based on strength
   * @param {number} strength - Character strength score
   * @param {string} loadType - 'light', 'medium', or 'heavy'
   * @returns {number} - Maximum weight for load type
   */
  static getCarryingCapacity(strength, loadType) {
    // Pathfinder 1e carrying capacity table
    const capacityTable = {
      1: { light: 3, medium: 6, heavy: 10 },
      2: { light: 6, medium: 13, heavy: 20 },
      3: { light: 10, medium: 20, heavy: 30 },
      4: { light: 13, medium: 26, heavy: 40 },
      5: { light: 16, medium: 33, heavy: 50 },
      6: { light: 20, medium: 40, heavy: 60 },
      7: { light: 23, medium: 46, heavy: 70 },
      8: { light: 26, medium: 53, heavy: 80 },
      9: { light: 30, medium: 60, heavy: 90 },
      10: { light: 33, medium: 66, heavy: 100 },
      11: { light: 38, medium: 76, heavy: 115 },
      12: { light: 43, medium: 86, heavy: 130 },
      13: { light: 50, medium: 100, heavy: 150 },
      14: { light: 58, medium: 116, heavy: 175 },
      15: { light: 66, medium: 133, heavy: 200 },
      16: { light: 76, medium: 153, heavy: 230 },
      17: { light: 86, medium: 173, heavy: 260 },
      18: { light: 100, medium: 200, heavy: 300 },
      19: { light: 116, medium: 233, heavy: 350 },
      20: { light: 133, medium: 266, heavy: 400 },
      21: { light: 153, medium: 306, heavy: 460 },
      22: { light: 173, medium: 346, heavy: 520 },
      23: { light: 200, medium: 400, heavy: 600 },
      24: { light: 233, medium: 466, heavy: 700 },
      25: { light: 266, medium: 533, heavy: 800 },
      26: { light: 306, medium: 613, heavy: 920 },
      27: { light: 346, medium: 693, heavy: 1040 },
      28: { light: 400, medium: 800, heavy: 1200 },
      29: { light: 466, medium: 933, heavy: 1400 }
    }
    
    const capacity = capacityTable[Math.min(29, Math.max(1, strength))]
    return capacity[loadType] || 0
  }

  /**
   * Enhanced create item object with weight and value
   * @param {string} itemName - Name of the item
   * @param {number} quantity - Quantity of the item
   * @returns {Object} - Enhanced item object
   */
  static createItemObject(itemName, quantity = 1) {
    const cleanedName = this.cleanItemName(itemName)
    const category = this.categorizeItem(cleanedName)
    const rarity = this.detectRarity(cleanedName)
    
    const item = {
      name: cleanedName,
      quantity: quantity,
      category: category,
      rarity: rarity,
      source: 'auto-detected',
      timestamp: Date.now(),
      notes: ''
    }
    
    // Add weight and value
    item.weight = this.calculateWeight(item)
    item.totalWeight = item.weight * item.quantity
    item.value = this.estimateValue(item)
    item.totalValue = item.value * item.quantity
    
    return item
  }

  /**
   * Character Builder Integration - Export inventory for character sheet
   * @param {Array} inventory - Current inventory
   * @returns {Object} - Character builder compatible format
   */
  static exportForCharacterBuilder(inventory) {
    const processed = inventory.map(item => {
      // Ensure all items have required fields
      if (!item.weight) item.weight = this.calculateWeight(item)
      if (!item.value) item.value = this.estimateValue(item)
      if (!item.rarity) item.rarity = this.detectRarity(item.name)
      
      return {
        id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        displayName: this.formatDisplayName(item),
        quantity: item.quantity || 1,
        category: item.category || this.categorizeItem(item.name),
        rarity: item.rarity,
        weight: item.weight,
        totalWeight: item.weight * (item.quantity || 1),
        value: item.value,
        totalValue: item.value * (item.quantity || 1),
        equipped: item.equipped || false,
        identified: item.identified !== false, // Default to identified
        notes: item.notes || '',
        source: item.source || 'manual',
        tags: this.generateItemTags(item),
        properties: this.extractItemProperties(item)
      }
    })
    
    // Calculate totals
    const totals = {
      weight: processed.reduce((sum, item) => sum + item.totalWeight, 0),
      value: processed.reduce((sum, item) => sum + item.totalValue, 0),
      items: processed.length,
      uniqueItems: new Set(processed.map(i => i.name)).size
    }
    
    return {
      inventory: processed,
      totals: totals,
      encumbrance: this.calculateEncumbrance(totals.weight),
      categories: this.categorizeInventory(processed)
    }
  }

  /**
   * Format display name with rarity indicator
   * @param {Object} item - Item object
   * @returns {string} - Formatted display name
   */
  static formatDisplayName(item) {
    const rarityPrefixes = {
      'masterwork': 'MW',
      'minor': '✦',
      'moderate': '✦✦',
      'major': '✦✦✦',
      'legendary': '★'
    }
    
    const prefix = rarityPrefixes[item.rarity] || ''
    return prefix ? `${prefix} ${item.name}` : item.name
  }

  /**
   * Generate searchable tags for an item
   * @param {Object} item - Item object
   * @returns {Array} - Array of tags
   */
  static generateItemTags(item) {
    const tags = []
    
    // Add category
    tags.push(item.category)
    
    // Add rarity
    if (item.rarity !== 'mundane') {
      tags.push(item.rarity)
    }
    
    // Add material tags
    const materials = ['mithral', 'adamantine', 'cold iron', 'silver', 'darkwood']
    materials.forEach(material => {
      if (item.name.toLowerCase().includes(material)) {
        tags.push(material)
      }
    })
    
    // Add magic tags
    if (item.name.toLowerCase().includes('magic') || item.name.includes('+')) {
      tags.push('magical')
    }
    
    // Add consumable tag
    if (['consumables', 'potions', 'scrolls'].includes(item.category)) {
      tags.push('consumable')
    }
    
    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Extract mechanical properties from item name
   * @param {Object} item - Item object
   * @returns {Object} - Item properties
   */
  static extractItemProperties(item) {
    const properties = {}
    const name = item.name.toLowerCase()
    
    // Extract enhancement bonus
    const bonusMatch = name.match(/\+(\d+)/)
    if (bonusMatch) {
      properties.enhancementBonus = parseInt(bonusMatch[1])
    }
    
    // Extract damage for weapons
    const weaponDamage = {
      'dagger': '1d4', 'shortsword': '1d6', 'longsword': '1d8',
      'greatsword': '2d6', 'battleaxe': '1d8', 'greataxe': '1d12',
      'mace': '1d8', 'club': '1d6', 'quarterstaff': '1d6',
      'spear': '1d8', 'longbow': '1d8', 'shortbow': '1d6',
      'light crossbow': '1d8', 'heavy crossbow': '1d10'
    }
    
    for (const [weapon, damage] of Object.entries(weaponDamage)) {
      if (name.includes(weapon)) {
        properties.damage = damage
        break
      }
    }
    
    // Extract armor bonus
    const armorBonus = {
      'padded': 1, 'leather': 2, 'studded leather': 3,
      'chain shirt': 4, 'hide': 4, 'scale mail': 5,
      'chainmail': 6, 'breastplate': 6, 'splint mail': 7,
      'banded mail': 7, 'half-plate': 8, 'full plate': 9
    }
    
    for (const [armor, bonus] of Object.entries(armorBonus)) {
      if (name.includes(armor)) {
        properties.armorBonus = bonus + (properties.enhancementBonus || 0)
        break
      }
    }
    
    // Extract special abilities
    const abilities = [
      'flaming', 'frost', 'shock', 'keen', 'vorpal',
      'defending', 'dancing', 'speed', 'brilliant energy',
      'holy', 'unholy', 'anarchic', 'axiomatic'
    ]
    
    properties.abilities = abilities.filter(ability => name.includes(ability))
    
    return properties
  }

  /**
   * Categorize inventory for character builder
   * @param {Array} inventory - Processed inventory
   * @returns {Object} - Categorized inventory
   */
  static categorizeInventory(inventory) {
    const categories = {}
    
    inventory.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = {
          items: [],
          totalWeight: 0,
          totalValue: 0,
          count: 0
        }
      }
      
      categories[item.category].items.push(item)
      categories[item.category].totalWeight += item.totalWeight
      categories[item.category].totalValue += item.totalValue
      categories[item.category].count += item.quantity
    })
    
    return categories
  }

  // === EXISTING METHODS (from your original) ===
  
  static parseInventoryChanges(response) {
    const changes = {
      itemsGained: [],
      itemsLost: [],
      moneyGained: { gp: 0, sp: 0, cp: 0, pp: 0 },
      moneyLost: { gp: 0, sp: 0, cp: 0, pp: 0 }
    }

    console.log('🔍 Parsing response:', response)

    // Parse item gains
    this.acquisitionPatterns.forEach((pattern, index) => {
      const matches = [...response.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`✅ Acquisition pattern ${index + 1} matched ${matches.length} times:`)
        console.log('Pattern:', pattern.source)
      }
      matches.forEach(match => {
        const itemText = match[1]?.trim()
        console.log(`  📦 Found gain text: "${itemText}"`)
        if (itemText) {
          const items = this.parseItemText(itemText)
          console.log(`  🎁 Parsed gain items:`, items)
          changes.itemsGained.push(...items)
        }
      })
    })

    // Parse item losses
    this.lossPatterns.forEach((pattern, index) => {
      const matches = [...response.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`❌ Loss pattern ${index + 1} matched ${matches.length} times:`)
        console.log('Pattern:', pattern.source)
      }
      matches.forEach(match => {
        const itemText = match[1]?.trim()
        console.log(`  📦 Found loss text: "${itemText}"`)
        if (itemText) {
          const items = this.parseItemText(itemText)
          console.log(`  💸 Parsed loss items:`, items)
          changes.itemsLost.push(...items)
        }
      })
    })

    // Parse money gains
    this.moneyGainPatterns.forEach((pattern, index) => {
      const matches = [...response.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`💰 Money gain pattern ${index + 1} matched:`, matches.length)
      }
      matches.forEach(match => {
        const amount = parseInt(match[1])
        const currency = this.normalizeCurrency(match[2])
        console.log(`  💰 Found money gain: ${amount} ${currency}`)
        if (currency && amount > 0) {
          changes.moneyGained[currency] += amount
        }
      })
    })

    // Parse money losses
    this.moneyLossPatterns.forEach((pattern, index) => {
      const matches = [...response.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`💸 Money loss pattern ${index + 1} matched:`, matches.length)
      }
      matches.forEach(match => {
        const amount = parseInt(match[1])
        const currency = this.normalizeCurrency(match[2])
        console.log(`  💸 Found money loss: ${amount} ${currency}`)
        if (currency && amount > 0) {
          changes.moneyLost[currency] += amount
        }
      })
    })

    console.log('🎯 Final changes:', changes)
    return changes
  }

  static parseItemText(itemText) {
    const items = []
    
    let cleanText = itemText
      .replace(/^(a|an|the|some|your)\s+/i, '')
      .replace(/\s+from\s+(the\s+)?(merchant|vendor|shop|store|trader|dealer).*$/i, '')
      .replace(/\s+for\s+\d+\s+(gold|silver|copper|platinum|gp|sp|cp|pp).*$/i, '')
      .replace(/\s+at\s+(the\s+)?(shop|store|market).*$/i, '')
      .replace(/\s+in\s+(the\s+)?(chest|bag|pouch|container|box|barrel|crate|sack).*$/i, '')
      .replace(/\s+/g, ' ')
      .trim()

    console.log(`📝 Parsing item text: "${itemText}" -> cleaned: "${cleanText}"`)

    const itemPhrases = this.splitItemText(cleanText)
    
    console.log(`📄 Split into phrases:`, itemPhrases)
    
    itemPhrases.forEach((phrase, phraseIndex) => {
      if (!phrase || phrase.length < 2) {
        console.log(`❌ Skipping empty phrase ${phraseIndex + 1}`)
        return
      }
      
      console.log(`📄 Processing phrase ${phraseIndex + 1}: "${phrase}"`)
      
      const parsedItem = this.parseIndividualItem(phrase)
      if (parsedItem) {
        console.log(`✅ Created item object:`, parsedItem)
        items.push(parsedItem)
      }
    })

    console.log(`🎯 Final parsed items:`, items)
    return items
  }

  static splitItemText(text) {
    if (text.includes(',')) {
      return text.split(/,\s*(?:and\s+)?/)
        .map(part => part.replace(/^\s*and\s+/, '').trim())
        .filter(part => part.length > 0)
    }
    
    return text.split(/\s+and\s+/)
      .map(part => part.trim())
      .filter(part => part.length > 0)
  }

  static parseIndividualItem(phrase) {
    phrase = phrase.trim()
    if (!phrase || phrase.length < 2) return null
    
    let quantity = 1
    let itemName = phrase
    
    console.log(`🔍 Raw phrase: "${phrase}"`)
    
    const numericMatch = phrase.match(/^(\d+)\s+(.+)$/)
    if (numericMatch) {
      quantity = parseInt(numericMatch[1])
      itemName = numericMatch[2]
      console.log(`🔢 Found numeric quantity: ${quantity}, item: "${itemName}"`)
    } else {
      const quantityWords = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'a couple of': 2, 'couple of': 2, 'a few': 3, 'few': 3, 
        'several': 3, 'some': 2, 'many': 5
      }
      
      for (const [word, qty] of Object.entries(quantityWords)) {
        const wordPattern = new RegExp(`^(${word.replace(/\s+/g, '\\s+')})\\s+(.+)$`, 'i')
        const wordMatch = phrase.match(wordPattern)
        if (wordMatch) {
          quantity = qty
          itemName = wordMatch[2]
          console.log(`📝 Found quantity word "${word}": ${quantity}, item: "${itemName}"`)
          break
        }
      }
      
      if (quantity === 1) {
        const articleMatch = phrase.match(/^(?:a|an|the|some)\s+(.+)$/i)
        if (articleMatch) {
          itemName = articleMatch[1]
          console.log(`📰 Removed article, item: "${itemName}"`)
        }
      }
    }

    itemName = itemName
      .replace(/^(of\s+)?/, '')
      .replace(/\s+/g, ' ')
      .trim()

    const singularName = this.singularizeItemName(itemName)
    console.log(`🔄 Singular conversion: "${itemName}" -> "${singularName}"`)

    const skipWords = ['it', 'them', 'this', 'that', 'here', 'there', 'now', 'then', 'very', 'quite', 'rather', 'pieces', 'coins']
    if (skipWords.includes(singularName.toLowerCase()) || singularName.length < 2) {
      console.log(`❌ Skipped invalid item: "${singularName}"`)
      return null
    }

    const result = this.createItemObject(singularName, quantity)
    console.log(`✅ Final item: ${quantity}x ${singularName} (${result.category}, ${result.rarity}, ${result.weight}lbs, ${result.value}gp)`)
    return result
  }

  static singularizeItemName(itemName) {
    const lowerName = itemName.toLowerCase()
    
    const pluralMap = {
      'magic rings': 'magic ring',
      'healing potions': 'healing potion',
      'thieves tools': 'thieves tools',
      'trail rations': 'trail ration',
      'cure light wounds': 'cure light wounds',
      'magic missiles': 'magic missile',
      'potions': 'potion',
      'scrolls': 'scroll',
      'arrows': 'arrow',
      'bolts': 'bolt',
      'daggers': 'dagger',
      'swords': 'sword',
      'gems': 'gem',
      'rings': 'ring',
      'coins': 'coin',
      'pieces': 'piece',
      'torches': 'torch',
      'ropes': 'rope',
      'rations': 'ration',
      'keys': 'key',
      'books': 'book',
      'wands': 'wand',
      'staffs': 'staff',
      'staves': 'staff',
      'shields': 'shield',
      'boots': 'boot',
      'gloves': 'glove',
      'bracers': 'bracer',
      'gauntlets': 'gauntlet'
    }

    if (pluralMap[lowerName]) {
      return this.capitalizeFirstLetter(pluralMap[lowerName])
    }
    
    let singular = itemName
    
    if (lowerName.endsWith('ies') && lowerName.length > 4) {
      singular = itemName.slice(0, -3) + 'y'
    } else if (lowerName.endsWith('ves') && lowerName.length > 4) {
      singular = itemName.slice(0, -3) + 'f'
    } else if (lowerName.endsWith('es') && lowerName.length > 3) {
      if (lowerName.endsWith('ches') || lowerName.endsWith('shes') || lowerName.endsWith('xes')) {
        singular = itemName.slice(0, -2)
      } else if (!lowerName.endsWith('ss')) {
        singular = itemName.slice(0, -1)
      }
    } else if (lowerName.endsWith('s') && lowerName.length > 2 && !lowerName.endsWith('ss')) {
      singular = itemName.slice(0, -1)
    }
    
    return this.capitalizeFirstLetter(singular)
  }

  static capitalizeFirstLetter(str) {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  static categorizeItem(itemName) {
    const lowerName = itemName.toLowerCase()
    
    if (lowerName.includes('magic ') || lowerName.includes('enchanted') || 
        lowerName.includes('blessed') || lowerName.includes('cursed') ||
        this.itemCategories.magic.some(keyword => lowerName.includes(keyword))) {
      return 'magic'
    }
    
    for (const [category, keywords] of Object.entries(this.itemCategories)) {
      if (category === 'magic') continue
      if (keywords.some(keyword => lowerName.includes(keyword))) {
        return category
      }
    }
    
    if (lowerName.includes('gem') || lowerName.includes('jewel') || 
        lowerName.includes('diamond') || lowerName.includes('ruby') || 
        lowerName.includes('emerald') || lowerName.includes('sapphire')) {
      return 'valuables'
    }
    
    return 'miscellaneous'
  }

  static itemCategories = {
    weapons: [
      'sword', 'dagger', 'knife', 'blade', 'bow', 'crossbow', 'axe', 'hatchet', 'mace', 'club', 
      'staff', 'wand', 'spear', 'javelin', 'hammer', 'scimitar', 'rapier', 'longsword', 'shortsword', 
      'greatsword', 'bastard sword', 'falchion', 'katana', 'scythe', 'whip', 'flail', 'morningstar',
      'lance', 'pike', 'halberd', 'glaive', 'sling', 'dart', 'shuriken', 'arrow', 'bolt', 'quarrel'
    ],
    armor: [
      'armor', 'armour', 'shield', 'helm', 'helmet', 'breastplate', 'chainmail', 'chain mail',
      'leather armor', 'studded leather', 'scale mail', 'splint mail', 'plate mail', 'full plate',
      'buckler', 'gauntlets', 'bracers', 'vambraces', 'pauldrons'
    ],
    consumables: [
      'potion', 'scroll', 'elixir', 'antidote', 'healing potion', 'cure', 'remedy', 'draught',
      'tincture', 'salve', 'ointment', 'food', 'rations', 'bread', 'water', 'ale', 'wine',
      'trail rations', 'hardtack', 'jerky', 'cheese', 'fruit'
    ],
    tools: [
      'rope', 'torch', 'lantern', 'lamp', 'candle', 'bedroll', 'blanket', 'waterskin', 'backpack', 
      'pouch', 'bag', 'sack', 'thieves tools', 'lockpicks', 'crowbar', 'hammer', 'chisel',
      'grappling hook', 'piton', 'spike', 'tent', 'flint', 'tinder', 'oil', 'chain', 'manacles',
      'mirror', 'spyglass', 'compass', 'map', 'ink', 'quill', 'parchment', 'paper', 'bell'
    ],
    magic: [
      'magic ring', 'magic sword', 'magic armor', 'magic shield', 'magic weapon', 'magic item',
      'enchanted', 'blessed', 'cursed', 'magic amulet', 'magic necklace', 'magic cloak', 
      'magic robe', 'magic boots', 'magic gloves', 'magic bracers', 'magic circlet', 
      'magic crown', 'magic talisman', 'magic charm', 'magic orb', 'magic tome', 'magic spellbook', 
      'magic wand', 'magic rod', 'magic staff'
    ],
    valuables: [
      'gem', 'jewel', 'diamond', 'ruby', 'emerald', 'sapphire', 'pearl', 'artwork', 'statue', 
      'painting', 'jewelry', 'treasure', 'coin', 'coins', 'gold', 'silver', 'copper', 'platinum',
      'ingot', 'bar', 'nugget', 'crystal', 'stone', 'precious stone'
    ]
  }

  static cleanItemName(itemName) {
    return itemName
      .replace(/^(a|an|the|some|your)\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  static normalizeCurrency(currency) {
    const currencyMap = {
      'gold': 'gp',
      'silver': 'sp', 
      'copper': 'cp',
      'platinum': 'pp',
      'gp': 'gp',
      'sp': 'sp',
      'cp': 'cp',
      'pp': 'pp'
    }
    
    return currencyMap[currency.toLowerCase()] || null
  }

  // === ENHANCED METHODS FOR CHARACTER BUILDER ===

  /**
   * Apply inventory changes with enhanced character builder support
   * @param {Object} changes - Inventory changes from parseInventoryChanges
   * @param {boolean} autoApply - Whether to apply automatically
   * @param {Object} characterData - Character data for weight calculations
   */
  static async applyInventoryChanges(changes, autoApply = false, characterData = null) {
    if (!this.hasChanges(changes)) {
      return { applied: false, message: 'No inventory changes detected' }
    }

    if (!autoApply) {
      const shouldApply = await this.confirmChanges(changes)
      if (!shouldApply) {
        return { applied: false, message: 'Changes rejected by user' }
      }
    }

    let appliedChanges = []
    const strength = characterData?.abilities?.strength || 10

    // Apply item gains
    changes.itemsGained.forEach(item => {
      this.addItemToInventory(item)
      appliedChanges.push(`+${item.quantity} ${item.name} (${item.weight * item.quantity}lbs, ${item.value * item.quantity}gp)`)
    })

    // Apply item losses
    changes.itemsLost.forEach(item => {
      this.removeItemFromInventory(item)
      appliedChanges.push(`-${item.quantity} ${item.name}`)
    })

    // Apply money changes
    Object.entries(changes.moneyGained).forEach(([currency, amount]) => {
      if (amount > 0) {
        characterState.money[currency] += amount
        appliedChanges.push(`+${amount} ${currency}`)
      }
    })

    Object.entries(changes.moneyLost).forEach(([currency, amount]) => {
      if (amount > 0) {
        characterState.money[currency] = Math.max(0, characterState.money[currency] - amount)
        appliedChanges.push(`-${amount} ${currency}`)
      }
    })

    // Calculate new encumbrance
    const weightSummary = this.calculateTotalWeight(characterState.inventory)
    const encumbrance = this.calculateEncumbrance(weightSummary.total, strength)

    return {
      applied: true,
      message: `Applied changes: ${appliedChanges.join(', ')}`,
      changes: appliedChanges,
      weightSummary,
      encumbrance,
      exportData: this.exportForCharacterBuilder(characterState.inventory)
    }
  }

  /**
   * Enhanced add item to inventory
   * @param {Object} item - Item to add
   */
  static addItemToInventory(item) {
    const existingIndex = characterState.inventory.findIndex(inv => 
      inv.name.toLowerCase() === item.name.toLowerCase()
    )

    if (existingIndex >= 0) {
      const existingQuantity = parseInt(characterState.inventory[existingIndex].quantity) || 1
      characterState.inventory[existingIndex].quantity = existingQuantity + item.quantity
      
      // Update weight and value
      characterState.inventory[existingIndex].totalWeight = 
        characterState.inventory[existingIndex].weight * characterState.inventory[existingIndex].quantity
      characterState.inventory[existingIndex].totalValue = 
        characterState.inventory[existingIndex].value * characterState.inventory[existingIndex].quantity
      
      const currentNotes = characterState.inventory[existingIndex].notes || ''
      characterState.inventory[existingIndex].notes = currentNotes + 
        (currentNotes ? '; ' : '') + `+${item.quantity} (auto-detected)`
    } else {
      characterState.inventory.push(item)
    }
  }

  /**
   * Enhanced remove item from inventory
   * @param {Object} item - Item to remove
   */
  static removeItemFromInventory(item) {
    const existingIndex = characterState.inventory.findIndex(inv => 
      inv.name.toLowerCase() === item.name.toLowerCase()
    )

    if (existingIndex >= 0) {
      const existingQuantity = parseInt(characterState.inventory[existingIndex].quantity) || 1
      const newQuantity = Math.max(0, existingQuantity - item.quantity)
      
      if (newQuantity === 0) {
        characterState.inventory.splice(existingIndex, 1)
      } else {
        characterState.inventory[existingIndex].quantity = newQuantity
        
        // Update weight and value
        characterState.inventory[existingIndex].totalWeight = 
          characterState.inventory[existingIndex].weight * newQuantity
        characterState.inventory[existingIndex].totalValue = 
          characterState.inventory[existingIndex].value * newQuantity
        
        const currentNotes = characterState.inventory[existingIndex].notes || ''
        characterState.inventory[existingIndex].notes = currentNotes + 
          (currentNotes ? '; ' : '') + `-${item.quantity} (auto-detected)`
      }
    }
  }

  static hasChanges(changes) {
    return changes.itemsGained.length > 0 || 
           changes.itemsLost.length > 0 || 
           Object.values(changes.moneyGained).some(amount => amount > 0) ||
           Object.values(changes.moneyLost).some(amount => amount > 0)
  }

  static async confirmChanges(changes) {
    const changesList = []
    
    changes.itemsGained.forEach(item => {
      changesList.push(`✅ Gain: ${item.quantity}x ${item.name} (${item.rarity}, ${item.weight * item.quantity}lbs, ${item.value * item.quantity}gp)`)
    })
    
    changes.itemsLost.forEach(item => {
      changesList.push(`❌ Lose: ${item.quantity}x ${item.name}`)
    })
    
    Object.entries(changes.moneyGained).forEach(([currency, amount]) => {
      if (amount > 0) changesList.push(`💰 Gain: ${amount} ${currency}`)
    })
    
    Object.entries(changes.moneyLost).forEach(([currency, amount]) => {
      if (amount > 0) changesList.push(`💸 Lose: ${amount} ${currency}`)
    })

    const message = `Detected inventory changes:\n\n${changesList.join('\n')}\n\nApply these changes?`
    
    return confirm(message)
  }

  static debugTradePattern(text) {
    console.log('🧪 DEBUG: Testing trade pattern with text:', text)
    
    console.log('\n--- TESTING LOSS PATTERNS ---')
    this.lossPatterns.forEach((pattern, index) => {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`❌ Loss pattern ${index + 1} matched:`)
        console.log(`Pattern: ${pattern.source}`)
        matches.forEach(match => {
          console.log(`  Captured: "${match[1]}"`)
          const items = this.parseItemText(match[1])
          console.log(`  Parsed items:`, items)
        })
      }
    })
    
    console.log('\n--- TESTING GAIN PATTERNS ---')
    this.acquisitionPatterns.forEach((pattern, index) => {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`✅ Gain pattern ${index + 1} matched:`)
        console.log(`Pattern: ${pattern.source}`)
        matches.forEach(match => {
          console.log(`  Captured: "${match[1]}"`)
          const items = this.parseItemText(match[1])
          console.log(`  Parsed items:`, items)
        })
      }
    })
    
    console.log('\n--- FULL PARSE RESULT ---')
    const result = this.parseInventoryChanges(text)
    console.log('Final result:', result)
    return result
  }

  static getTestCases() {
    return [
      // Original test cases
      "You trade 5 daggers and 3 gems for 2 magic rings.",
      "You exchange 3 healing potions for a magic sword and 50 gold pieces.",
      "You swap your old armor for 2 new shields.",
      "You find a healing potion and 50 gold pieces in the chest.",
      "The merchant gives you 3 arrows and a rope for 15 gp.",
      "You discover a +1 dagger hidden under the floorboards.",
      "Your reward includes 2 scrolls of magic missile and 100 gp.",
      "You loot a torch and some rations from the fallen orc.",
      "There is a shiny gem on the altar.",
      "Inside the bag you find 5 silver pieces and a small knife.",
      "You lose your torch in the acid trap.",
      "Your rope breaks during the climb.",
      "The orc destroys your shield with his axe.",
      "You consume a healing potion during the fight.",
      "You pay 25 gold pieces for the information.",
      "You spend 10 gp on supplies.",
      "Your lantern is stolen by the pickpocket.",
      "You earn 75 gold pieces for completing the quest.",
      "The treasure contains 500 gp and 50 pp.",
      "You find 25 silver coins in the drawer.",
      "After defeating the dragon, you find its hoard containing 1000 gold pieces, 3 magic rings, a +2 longsword, and 5 healing potions.",
      
      // New test cases for enhanced features
      "You find a masterwork longsword in the armory.",
      "The wizard gives you a +3 flaming greatsword.",
      "You purchase 50 feet of silk rope and a grappling hook.",
      "In the chest you discover a suit of mithral chainmail.",
      "The merchant trades you an adamantine dagger for your old sword.",
      "You find several gems: 2 rubies, 3 emeralds, and a large diamond.",
      "Your backpack now contains 3 days of trail rations and 2 waterskins.",
      "You acquire a complete set of masterwork thieves' tools.",
      "The dragon's hoard contains a legendary artifact: the Crown of Stars.",
      "You find a potion of cure moderate wounds and a scroll of fireball."
    ]
  }
}

export default InventoryParser