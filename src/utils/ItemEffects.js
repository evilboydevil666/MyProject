export const ItemEffects = {
  // Healing items
  'potion of cure light wounds': {
    type: 'healing',
    amount: '1d8+1',
    description: 'Heals 1d8+1 hit points'
  },
  'potion of cure moderate wounds': {
    type: 'healing',
    amount: '2d8+3',
    description: 'Heals 2d8+3 hit points'
  },
  'potion of cure serious wounds': {
    type: 'healing',
    amount: '3d8+5',
    description: 'Heals 3d8+5 hit points'
  },
  'potion of cure critical wounds': {
    type: 'healing',
    amount: '4d8+7',
    description: 'Heals 4d8+7 hit points'
  },
  'healing kit': {
    type: 'heal_check',
    bonus: '+2',
    uses: 10,
    description: 'Provides +2 circumstance bonus to Heal checks'
  },
  'antitoxin': {
    type: 'save_bonus',
    save: 'fortitude',
    bonus: '+5',
    duration: '1 hour',
    description: '+5 alchemical bonus on Fortitude saves against poison'
  },
  
  // Light sources
  'torch': {
    type: 'light',
    radius: 20,
    duration: '1 hour',
    description: 'Provides bright light in a 20-foot radius'
  },
  'sunrod': {
    type: 'light',
    radius: 30,
    duration: '6 hours',
    description: 'Provides bright light in a 30-foot radius'
  },
  'candle': {
    type: 'light',
    radius: 5,
    duration: '1 hour',
    description: 'Provides dim light in a 5-foot radius'
  },
  'lantern': {
    type: 'light',
    radius: 30,
    duration: '6 hours per pint',
    description: 'Provides bright light in a 30-foot radius'
  },
  'everburning torch': {
    type: 'light',
    radius: 20,
    duration: 'permanent',
    description: 'Provides permanent bright light in a 20-foot radius'
  },
  
  // Combat items
  'alchemist\'s fire': {
    type: 'attack',
    damage: '1d6',
    damageType: 'fire',
    splash: 1,
    description: 'Thrown weapon that deals 1d6 fire damage, 1 splash'
  },
  'acid flask': {
    type: 'attack',
    damage: '1d6',
    damageType: 'acid',
    splash: 1,
    description: 'Thrown weapon that deals 1d6 acid damage, 1 splash'
  },
  'holy water': {
    type: 'attack',
    damage: '2d4',
    damageType: 'positive',
    targetType: 'undead',
    description: 'Deals 2d4 damage to undead or evil outsiders'
  },
  'tanglefoot bag': {
    type: 'attack',
    effect: 'entangle',
    dc: 15,
    duration: '2d4 rounds',
    description: 'Entangles target, DC 15 Reflex save or be glued to floor'
  },
  'thunderstone': {
    type: 'attack',
    effect: 'deafen',
    dc: 15,
    radius: 10,
    duration: '1 hour',
    description: 'DC 15 Fort save or deafened for 1 hour'
  },
  'smokestick': {
    type: 'utility',
    effect: 'smoke',
    radius: 10,
    duration: '1 round',
    description: 'Creates smoke in 10-ft cube'
  },
  
  // Utility items
  'rope': {
    type: 'utility',
    skill: 'Climb',
    bonus: '+2',
    description: 'Grants +2 circumstance bonus to Climb checks'
  },
  'crowbar': {
    type: 'utility',
    skill: 'Strength',
    bonus: '+2',
    description: 'Grants +2 circumstance bonus to Strength checks to open doors or containers'
  },
  'grappling hook': {
    type: 'utility',
    skill: 'Climb',
    description: 'Allows climbing of walls and surfaces'
  },
  'thieves\' tools': {
    type: 'utility',
    skill: 'Disable Device',
    required: true,
    description: 'Required for Disable Device checks on locks'
  },
  'magnifying glass': {
    type: 'utility',
    skill: 'Appraise',
    bonus: '+2',
    description: '+2 circumstance bonus to Appraise checks for small items'
  },
  
  // Food and drink
  'trail rations': {
    type: 'sustenance',
    duration: '1 day',
    description: 'Provides sustenance for one day'
  },
  'waterskin': {
    type: 'sustenance',
    duration: '1 day',
    description: 'Contains water for one day'
  },
  'ale': {
    type: 'sustenance',
    effect: 'minor_fortitude',
    description: 'Common alcoholic beverage'
  },
  
  // Scrolls
  'scroll': {
    type: 'magic',
    subtype: 'scroll',
    description: 'Single-use magic spell'
  },
  
  // Special materials
  'cold iron': {
    type: 'material',
    effect: 'bypass_dr',
    targetType: 'fey',
    description: 'Bypasses damage reduction of fey creatures'
  },
  'silver': {
    type: 'material',
    effect: 'bypass_dr',
    targetType: 'lycanthrope',
    description: 'Bypasses damage reduction of lycanthropes'
  },
  'adamantine': {
    type: 'material',
    effect: 'bypass_hardness',
    hardness: 20,
    description: 'Bypasses hardness less than 20'
  }
}

export function getItemEffect(itemName) {
  const normalizedName = itemName.toLowerCase().trim()
  
  // Direct match
  if (ItemEffects[normalizedName]) {
    return ItemEffects[normalizedName]
  }
  
  // Partial match - check if item name contains any key
  for (const [key, effect] of Object.entries(ItemEffects)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return effect
    }
  }
  
  // Special case handling for numbered items
  if (normalizedName.includes('potion') && normalizedName.includes('healing')) {
    return ItemEffects['potion of cure light wounds']
  }
  
  if (normalizedName.includes('scroll of')) {
    return {
      type: 'magic',
      subtype: 'scroll',
      spell: normalizedName.replace('scroll of', '').trim(),
      description: 'Single-use magic spell scroll'
    }
  }
  
  return null
}

// Helper function to determine if an item is consumable
export function isConsumable(itemName) {
  const effect = getItemEffect(itemName)
  if (!effect) return false
  
  const consumableTypes = ['healing', 'attack', 'magic', 'sustenance']
  return consumableTypes.includes(effect.type) || 
         itemName.toLowerCase().includes('potion') ||
         itemName.toLowerCase().includes('scroll') ||
         itemName.toLowerCase().includes('wand')
}

// Helper function to get use action description
export function getUseActionDescription(itemName) {
  const normalizedName = itemName.toLowerCase()
  
  if (normalizedName.includes('potion')) {
    return 'drink'
  } else if (normalizedName.includes('scroll')) {
    return 'read'
  } else if (normalizedName.includes('wand')) {
    return 'activate'
  } else if (normalizedName.includes('torch') || normalizedName.includes('lantern')) {
    return 'light'
  } else if (normalizedName.includes('ration') || normalizedName.includes('food')) {
    return 'eat'
  } else if (normalizedName.includes('water') || normalizedName.includes('ale')) {
    return 'drink'
  } else if (normalizedName.includes('oil')) {
    return 'apply'
  } else if (normalizedName.includes('rope')) {
    return 'ready'
  } else if (normalizedName.includes('tools')) {
    return 'prepare'
  }
  
  return 'use'
}