import { InventoryParser } from './inventoryParser.js'
import { characterState } from '../characterState.js'

export class InventoryHelpers {
  /**
   * Update inventory metadata after changes
   */
  static updateInventoryMetadata() {
    const weightSummary = InventoryParser.calculateTotalWeight(characterState.inventory)
    const strength = characterState.abilities.strength
    const encumbrance = InventoryParser.calculateEncumbrance(weightSummary.total, strength)
    
    characterState.inventoryMetadata = {
      totalWeight: weightSummary.total,
      totalValue: characterState.inventory.reduce((sum, item) => 
        sum + (item.totalValue || item.value * item.quantity || 0), 0
      ),
      encumbranceLevel: encumbrance.level,
      lastUpdated: Date.now()
    }
    
    // Update speed based on encumbrance
    const baseSpeed = characterState.physical.baseSpeed
    characterState.physical.currentSpeed = Math.max(5, baseSpeed - encumbrance.speedPenalty)
    
    return encumbrance
  }
  
  /**
   * Equip an item to a slot
   */
  static equipItem(item, slot = null) {
    // Auto-detect slot if not provided
    if (!slot) {
      slot = this.getDefaultSlot(item)
    }
    
    if (!slot) return false
    
    // Unequip current item in slot if any
    if (characterState.equipped[slot]) {
      this.unequipItem(slot)
    }
    
    // Equip new item
    characterState.equipped[slot] = item.id || item.name
    item.equipped = true
    item.equippedSlot = slot
    
    // Apply item bonuses
    this.applyItemBonuses(item)
    
    return true
  }
  
  /**
   * Unequip an item from a slot
   */
  static unequipItem(slot) {
    const itemId = characterState.equipped[slot]
    if (!itemId) return false
    
    const item = characterState.inventory.find(i => 
      (i.id || i.name) === itemId
    )
    
    if (item) {
      item.equipped = false
      delete item.equippedSlot
      this.removeItemBonuses(item)
    }
    
    characterState.equipped[slot] = null
    return true
  }
  
  /**
   * Get default equipment slot for an item
   */
  static getDefaultSlot(item) {
    const slotMap = {
      'weapons': 'mainHand',
      'armor': 'armor',
      'shields': 'offHand'
    }
    
    // Check category first
    if (slotMap[item.category]) {
      return slotMap[item.category]
    }
    
    // Check item name for specific slots
    const name = item.name.toLowerCase()
    if (name.includes('helmet') || name.includes('helm')) return 'head'
    if (name.includes('amulet') || name.includes('necklace')) return 'neck'
    if (name.includes('cloak') || name.includes('cape')) return 'shoulders'
    if (name.includes('belt') || name.includes('girdle')) return 'belt'
    if (name.includes('bracers') || name.includes('wristbands')) return 'wrists'
    if (name.includes('gloves') || name.includes('gauntlets')) return 'hands'
    if (name.includes('boots') || name.includes('shoes')) return 'feet'
    if (name.includes('ring')) return characterState.equipped.ring1 ? 'ring2' : 'ring1'
    
    return null
  }
  
  /**
   * Apply item bonuses to character stats
   */
  static applyItemBonuses(item) {
    if (!item.properties) return
    
    // Apply armor bonus
    if (item.properties.armorBonus) {
      characterState.ac.armor += item.properties.armorBonus
      this.recalculateAC()
    }
    
    // Apply enhancement bonus to attacks (for weapons)
    if (item.properties.enhancementBonus && item.category === 'weapons') {
      // This would update attack bonuses - implement based on your combat system
    }
    
    // Apply other magical properties
    // This is where you'd add special ability effects
  }
  
  /**
   * Remove item bonuses from character stats
   */
  static removeItemBonuses(item) {
    if (!item.properties) return
    
    if (item.properties.armorBonus) {
      characterState.ac.armor -= item.properties.armorBonus
      this.recalculateAC()
    }
    
    // Remove other bonuses...
  }
  
  /**
   * Recalculate AC after equipment changes
   */
  static recalculateAC() {
    const dexMod = Math.floor((characterState.abilities.dexterity - 10) / 2)
    const maxDex = this.getMaxDexBonus()
    const effectiveDexMod = maxDex !== null ? Math.min(dexMod, maxDex) : dexMod
    
    characterState.ac.dex = effectiveDexMod
    characterState.ac.total = 10 + 
      characterState.ac.armor + 
      characterState.ac.shield + 
      effectiveDexMod + 
      characterState.ac.size + 
      characterState.ac.natural + 
      characterState.ac.deflection + 
      characterState.ac.misc
    
    characterState.ac.touch = 10 + effectiveDexMod + characterState.ac.size + 
      characterState.ac.deflection + characterState.ac.misc
    
    characterState.ac.flatFooted = characterState.ac.total - effectiveDexMod
  }
  
  /**
   * Get maximum dexterity bonus from armor and encumbrance
   */
  static getMaxDexBonus() {
    let maxDex = null
    
    // Check armor
    const armorId = characterState.equipped.armor
    if (armorId) {
      const armor = characterState.inventory.find(i => (i.id || i.name) === armorId)
      if (armor) {
        // Get max dex from armor type - you'd need to expand this
        const armorMaxDex = this.getArmorMaxDex(armor.name)
        if (armorMaxDex !== null) {
          maxDex = maxDex !== null ? Math.min(maxDex, armorMaxDex) : armorMaxDex
        }
      }
    }
    
    // Check encumbrance
    const encumbrance = InventoryParser.calculateEncumbrance(
      characterState.inventoryMetadata.totalWeight,
      characterState.abilities.strength
    )
    
    if (encumbrance.maxDex !== null) {
      maxDex = maxDex !== null ? Math.min(maxDex, encumbrance.maxDex) : encumbrance.maxDex
    }
    
    return maxDex
  }
  
  /**
   * Get armor max dex bonus
   */
  static getArmorMaxDex(armorName) {
    const armorMaxDexMap = {
      'padded': 8,
      'leather': 6,
      'studded leather': 5,
      'chain shirt': 4,
      'hide': 4,
      'scale mail': 3,
      'chainmail': 2,
      'breastplate': 3,
      'splint mail': 0,
      'banded mail': 1,
      'half-plate': 0,
      'full plate': 1
    }
    
    const lowerName = armorName.toLowerCase()
    for (const [armor, maxDex] of Object.entries(armorMaxDexMap)) {
      if (lowerName.includes(armor)) return maxDex
    }
    
    return null
  }
}
