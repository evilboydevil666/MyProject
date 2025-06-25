<template>
  <div class="inventory-container space-y-6 text-white">
    <h2 class="text-2xl mb-4 text-white">Inventory</h2>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="bg-gray-800 p-3 rounded border border-gray-600">
        <label class="block text-sm text-gray-400">Total Weight</label>
        <div class="text-xl font-bold text-white">{{ totalWeight }} lbs</div>
      </div>
      <div class="bg-gray-800 p-3 rounded border border-gray-600">
        <label class="block text-sm text-gray-400">Encumbrance</label>
        <div class="text-xl font-bold" :class="encumbranceClass">{{ encumbranceStatus }}</div>
      </div>
      <div class="bg-gray-800 p-3 rounded border border-gray-600">
        <label class="block text-sm text-gray-400">Total Value</label>
        <div class="text-xl font-bold text-yellow-400">{{ totalValue }} gp</div>
      </div>
    </div>

    <!-- Money Display -->
    <div class="bg-gray-800 p-4 rounded border border-gray-600">
      <h3 class="text-lg font-semibold mb-3 text-white">Wealth</h3>
      <div class="grid grid-cols-4 gap-3">
        <div class="text-center">
          <label class="block text-xs text-gray-400">Platinum</label>
          <div class="text-2xl font-bold text-white">{{ characterState.money.pp || 0 }}</div>
        </div>
        <div class="text-center">
          <label class="block text-xs text-gray-400">Gold</label>
          <div class="text-2xl font-bold text-yellow-400">{{ characterState.money.gp || 0 }}</div>
        </div>
        <div class="text-center">
          <label class="block text-xs text-gray-400">Silver</label>
          <div class="text-2xl font-bold text-gray-300">{{ characterState.money.sp || 0 }}</div>
        </div>
        <div class="text-center">
          <label class="block text-xs text-gray-400">Copper</label>
          <div class="text-2xl font-bold text-orange-700">{{ characterState.money.cp || 0 }}</div>
        </div>
      </div>
      <div class="mt-2 text-sm text-gray-400 text-center">
        Total in GP: {{ totalMoneyInGP }} gp
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-gray-800 p-4 rounded border border-gray-600">
      <h3 class="text-lg font-semibold mb-3 text-white">Inventory & Combat Actions</h3>
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-gray-700">
            <th class="p-2 text-left">Item</th>
            <th class="p-2 text-center">Weight</th>
            <th class="p-2 text-center">Attack</th>
            <th class="p-2 text-center">Damage</th>
            <th class="p-2 text-center">DC</th>
            <th class="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in characterState.inventory" :key="index" class="even:bg-gray-750 hover:bg-gray-700">
            <td class="p-2 font-medium">
              {{ item.name }}
              <span v-if="item.equipped" class="text-green-400 text-xs ml-1">(Equipped)</span>
              <span v-if="item.quantity > 1" class="text-gray-400 text-xs ml-1">(×{{ item.quantity }})</span>
            </td>
            <td class="p-2 text-center text-gray-400">
              {{ getItemWeight(item) }} lbs
            </td>
            <td class="p-2 text-center">{{ getItemAttackBonus(item) || '—' }}</td>
            <td class="p-2 text-center">{{ getItemDamage(item) || '—' }}</td>
            <td class="p-2 text-center">{{ item.dc || '—' }}</td>
            <td class="p-2 text-center space-x-1">
              <button 
                v-if="isWeapon(item)"
                @click="attackWithWeapon(item)"
                class="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
              >
                Attack
              </button>
              <button 
                v-if="isWeapon(item)"
                @click="rollWeaponDamage(item)"
                class="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
              >
                Damage
              </button>
              <button 
                @click="useItem(item)"
                class="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
              >
                Use
              </button>
              <button 
                @click="toggleEquipItem(item)"
                class="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs"
              >
                {{ item.equipped ? 'Unequip' : 'Equip' }}
              </button>
              <button 
                @click="dropItem(index)"
                class="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-xs"
              >
                Drop
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Inventory Notification Component -->
    <InventoryNotification 
      ref="inventoryNotifications"
      :auto-apply-enabled="true"
      :auto-apply-delay="10"
      @changes-applied="onInventoryChangesApplied"
      @changes-rejected="onInventoryChangesRejected"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { characterState } from '../../characterState.js'
import InventoryNotification from '../InventoryNotification.vue'
import { useNarrativeChat } from '@/composables/useNarrativeChat'
import { InventoryParser } from '@/utils/InventoryParser'
import { DiceRoller } from '@/utils/DiceRoller'

// Composables
const { sendMessage } = useNarrativeChat()

// Props
const props = defineProps({
  readonly: {
    type: Boolean,
    default: true
  }
})

// Refs
const inventoryNotifications = ref(null)

// Provide inventory notification handler for child components
provide('addInventoryChange', (changes) => {
  inventoryNotifications.value?.addPendingChange(changes)
})

// Default weights for common items if weight is missing
const defaultWeights = {
  'backpack': 2,
  'bedroll': 5,
  'trail rations': 1, // per day
  'rope': 10,
  'torch': 1,
  'waterskin': 4,
  'potion': 0.1,
  'scroll': 0.1,
  'longsword': 4,
  'shortsword': 2,
  'dagger': 1,
  'leather armor': 15,
  'studded leather': 20,
  'chain shirt': 25,
  'scale mail': 30,
  'shield': 6,
  'arrows': 3, // per 20
  'bolts': 1, // per 10
}

// Helper function to get item weight
function getItemWeight(item) {
  // Use the same logic as in totalWeight
  let weight = item.weight
  if (weight === undefined || weight === null) {
    const itemNameLower = item.name.toLowerCase()
    for (const [key, defaultWeight] of Object.entries(defaultWeights)) {
      if (itemNameLower.includes(key)) {
        weight = defaultWeight
        break
      }
    }
    if (weight === undefined) {
      weight = 0
    }
  }
  
  return (weight * (item.quantity || 1)).toFixed(1)
}

// Computed - Total weight with default handling
const totalWeight = computed(() => {
  return characterState.inventory.reduce((sum, item) => {
    // Get weight from item or try to find default
    let weight = item.weight
    if (weight === undefined || weight === null) {
      // Try to find a default weight based on item name
      const itemNameLower = item.name.toLowerCase()
      for (const [key, defaultWeight] of Object.entries(defaultWeights)) {
        if (itemNameLower.includes(key)) {
          weight = defaultWeight
          break
        }
      }
      // If still no weight found, default to 0
      if (weight === undefined) {
        weight = 0
        console.warn(`No weight found for item: ${item.name}`)
      }
    }
    
    return sum + (weight * (item.quantity || 1))
  }, 0).toFixed(1)
})

const totalValue = computed(() => {
  return characterState.inventory.reduce((sum, item) => {
    const value = item.value || 0
    return sum + (value * (item.quantity || 1))
  }, 0)
})

const totalMoneyInGP = computed(() => {
  const { pp = 0, gp = 0, sp = 0, cp = 0 } = characterState.money
  return pp * 10 + gp + sp / 10 + cp / 100
})

// Encumbrance calculation
const strScore = computed(() => characterState.abilityScores.STR || 10)

const carryingCapacity = computed(() => {
  const str = strScore.value
  return {
    light: str * 3.33,
    medium: str * 6.66,
    heavy: str * 10,
    max: str * 20
  }
})

const encumbranceStatus = computed(() => {
  const weight = parseFloat(totalWeight.value)
  const capacity = carryingCapacity.value
  
  if (weight <= capacity.light) return 'Light Load'
  if (weight <= capacity.medium) return 'Medium Load'
  if (weight <= capacity.heavy) return 'Heavy Load'
  return 'Overloaded!'
})

const encumbranceClass = computed(() => {
  const status = encumbranceStatus.value
  if (status === 'Light Load') return 'text-green-400'
  if (status === 'Medium Load') return 'text-yellow-400'
  if (status === 'Heavy Load') return 'text-orange-400'
  return 'text-red-400'
})

// Helper methods
function isWeapon(item) {
  return item.category === 'weapons' || 
         item.type === 'weapon' ||
         item.name.toLowerCase().includes('sword') ||
         item.name.toLowerCase().includes('bow') ||
         item.name.toLowerCase().includes('dagger') ||
         item.name.toLowerCase().includes('axe') ||
         item.name.toLowerCase().includes('mace') ||
         item.name.toLowerCase().includes('spear') ||
         item.damage // If it has damage property, it's likely a weapon
}

function getItemAttackBonus(item) {
  if (item.attackBonus !== undefined) return `+${item.attackBonus}`
  
  // Default attack bonuses for common weapons
  const weaponBonuses = {
    'longsword': characterState.bab + (characterState.abilityMods?.STR || 0),
    'shortsword': characterState.bab + (characterState.abilityMods?.STR || 0),
    'dagger': characterState.bab + (characterState.abilityMods?.STR || 0),
    'shortbow': characterState.bab + (characterState.abilityMods?.DEX || 0),
    'longbow': characterState.bab + (characterState.abilityMods?.DEX || 0)
  }
  
  const itemName = item.name.toLowerCase()
  for (const [weapon, bonus] of Object.entries(weaponBonuses)) {
    if (itemName.includes(weapon)) {
      return bonus >= 0 ? `+${bonus}` : `${bonus}`
    }
  }
  
  return null
}

function getItemDamage(item) {
  if (item.damage) return item.damage
  
  // Default damage for common weapons
  const weaponDamage = {
    'longsword': '1d8',
    'shortsword': '1d6',
    'dagger': '1d4',
    'greataxe': '1d12',
    'greatsword': '2d6',
    'mace': '1d8',
    'shortbow': '1d6',
    'longbow': '1d8'
  }
  
  const itemName = item.name.toLowerCase()
  for (const [weapon, damage] of Object.entries(weaponDamage)) {
    if (itemName.includes(weapon)) {
      const strMod = characterState.abilityMods?.STR || 0
      return strMod !== 0 ? `${damage}${strMod >= 0 ? '+' : ''}${strMod}` : damage
    }
  }
  
  return null
}

// Action methods
async function attackWithWeapon(item) {
  const attackBonus = parseInt(getItemAttackBonus(item)) || 0
  const d20 = DiceRoller.roll('1d20')
  const total = d20.total + attackBonus
  
  await sendMessage({
    text: `I attack with my ${item.name}! Attack roll: ${d20.rolls[0]} + ${attackBonus} = ${total}`,
    context: {
      action: 'attack',
      item: item.name,
      roll: d20,
      bonus: attackBonus,
      total: total,
      character: {
        name: characterState.name,
        class: characterState.classes[0]?.className,
        level: characterState.classes[0]?.level
      }
    }
  })
}

async function rollWeaponDamage(item) {
  const damage = getItemDamage(item)
  if (!damage) {
    await sendMessage(`I cannot determine the damage for ${item.name}.`)
    return
  }
  
  // Parse damage string (e.g., "1d8+3")
  const match = damage.match(/(\d+)d(\d+)([+-]\d+)?/)
  if (match) {
    const [_, numDice, dieSize, modifier] = match
    const diceStr = `${numDice}d${dieSize}`
    const roll = DiceRoller.roll(diceStr)
    const mod = modifier ? parseInt(modifier) : 0
    const total = roll.total + mod
    
    await sendMessage({
      text: `Damage with ${item.name}: ${roll.rolls.join(', ')}${mod !== 0 ? ` ${mod >= 0 ? '+' : ''}${mod}` : ''} = ${total}`,
      context: {
        action: 'damage',
        item: item.name,
        roll: roll,
        modifier: mod,
        total: total
      }
    })
  }
}

async function useItem(item) {
  if (!item.quantity || item.quantity <= 0) return
  
  // Determine item effect based on name
  let effect = ''
  let mechanicalEffect = null
  
  if (item.name.toLowerCase().includes('healing potion') || item.name.toLowerCase().includes('cure')) {
    effect = 'drink the healing potion, feeling warmth spread through my body'
    mechanicalEffect = {
      type: 'healing',
      amount: '1d8+1',
      target: 'self'
    }
  } else if (item.name.toLowerCase().includes('torch')) {
    effect = 'light the torch, illuminating the area around me'
    mechanicalEffect = {
      type: 'light',
      radius: '20 feet',
      duration: '1 hour'
    }
  } else if (item.name.toLowerCase().includes('ration')) {
    effect = 'consume some trail rations'
    mechanicalEffect = {
      type: 'sustenance',
      duration: '1 day'
    }
  } else if (item.name.toLowerCase().includes('rope')) {
    effect = 'ready the rope for use'
    mechanicalEffect = {
      type: 'equipment_ready',
      item: 'rope'
    }
  } else {
    effect = `use the ${item.name}`
  }
  
  // Send to narrative system
  await sendMessage({
    text: `I ${effect}.`,
    context: {
      action: 'use_item',
      item: item.name,
      effect: mechanicalEffect,
      character: {
        name: characterState.name,
        class: characterState.classes[0]?.className,
        level: characterState.classes[0]?.level,
        currentHp: characterState.hp,
        maxHp: characterState.hpMax
      }
    }
  })
  
  // Apply inventory change for consumables
  if (item.category === 'consumables' || item.name.toLowerCase().includes('potion')) {
    const change = {
      itemsLost: [{
        name: item.name,
        quantity: 1
      }]
    }
    inventoryNotifications.value?.addPendingChange(change)
  }
}

async function toggleEquipItem(item) {
  item.equipped = !item.equipped
  
  await sendMessage({
    text: `I ${item.equipped ? 'equip' : 'unequip'} the ${item.name}.`,
    context: {
      action: item.equipped ? 'equip_item' : 'unequip_item',
      item: item.name,
      character: {
        name: characterState.name
      }
    }
  })
}

async function dropItem(index) {
  const item = characterState.inventory[index]
  if (!item) return
  
  await sendMessage({
    text: `I drop the ${item.name}.`,
    context: {
      action: 'drop_item',
      item: item.name,
      quantity: item.quantity || 1
    }
  })
  
  // Remove from inventory
  const change = {
    itemsLost: [{
      name: item.name,
      quantity: item.quantity || 1
    }]
  }
  inventoryNotifications.value?.addPendingChange(change)
}

// Event handlers
function onInventoryChangesApplied({ change, result }) {
  console.log('Inventory changes applied:', change, result)
}

function onInventoryChangesRejected(changeId) {
  console.log('Inventory changes rejected:', changeId)
}

// Add custom styles for consistent appearance
const customStyles = `
.even\\:bg-gray-750:nth-child(even) {
  background-color: rgb(45 45 55);
}
`

// Lifecycle
onMounted(() => {
  // Add custom styles
  const style = document.createElement('style')
  style.textContent = customStyles
  document.head.appendChild(style)
})
</script>

<style scoped>
.inventory-container {
  @apply text-white;
}
</style>