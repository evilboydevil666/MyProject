<template>
  <div class="inventory-container space-y-6">
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

    <!-- Inventory Categories -->
    <div class="space-y-4">
      <!-- Weapons -->
      <div class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-white">Weapons</h3>
        <div v-if="weapons.length === 0" class="text-gray-400 italic">No weapons equipped</div>
        <div v-else class="space-y-2">
          <div v-for="(item, index) in weapons" :key="index" 
               class="bg-gray-700 p-2 rounded flex justify-between items-center">
            <div>
              <span class="font-medium text-white">{{ item.name }}</span>
              <span v-if="item.quantity > 1" class="text-gray-400 ml-2">(×{{ item.quantity }})</span>
            </div>
            <div class="text-sm text-gray-400">{{ item.notes }}</div>
          </div>
        </div>
      </div>

      <!-- Armor -->
      <div class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-white">Armor & Shields</h3>
        <div v-if="armor.length === 0" class="text-gray-400 italic">No armor equipped</div>
        <div v-else class="space-y-2">
          <div v-for="(item, index) in armor" :key="index" 
               class="bg-gray-700 p-2 rounded flex justify-between items-center">
            <div>
              <span class="font-medium text-white">{{ item.name }}</span>
              <span v-if="item.quantity > 1" class="text-gray-400 ml-2">(×{{ item.quantity }})</span>
            </div>
            <div class="text-sm text-gray-400">{{ item.notes }}</div>
          </div>
        </div>
      </div>

      <!-- Consumables -->
      <div class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-white">Consumables</h3>
        <div v-if="consumables.length === 0" class="text-gray-400 italic">No consumables</div>
        <div v-else class="space-y-2">
          <div v-for="(item, index) in consumables" :key="index" 
               class="bg-gray-700 p-2 rounded flex justify-between items-center">
            <div>
              <span class="font-medium text-white">{{ item.name }}</span>
              <span v-if="item.quantity > 1" class="text-gray-400 ml-2">(×{{ item.quantity }})</span>
            </div>
            <div class="text-sm text-gray-400">{{ item.notes }}</div>
          </div>
        </div>
      </div>

      <!-- General Equipment -->
      <div class="bg-gray-800 p-4 rounded border border-gray-600">
        <h3 class="text-lg font-semibold mb-3 text-white">Equipment & Gear</h3>
        <div v-if="equipment.length === 0" class="text-gray-400 italic">No equipment</div>
        <div v-else class="space-y-2">
          <div v-for="(item, index) in equipment" :key="index" 
               class="bg-gray-700 p-2 rounded flex justify-between items-center">
            <div>
              <span class="font-medium text-white">{{ item.name }}</span>
              <span v-if="item.quantity > 1" class="text-gray-400 ml-2">(×{{ item.quantity }})</span>
            </div>
            <div class="text-sm text-gray-400">{{ item.notes }}</div>
          </div>
        </div>
      </div>

      <!-- All Items (Legacy) -->
      <details class="bg-gray-800 p-4 rounded border border-gray-600">
        <summary class="cursor-pointer text-gray-400 hover:text-white">All Items (Unsorted)</summary>
        <div class="mt-3 space-y-2">
          <div v-for="(item, index) in characterState.inventory" :key="index" 
               class="bg-gray-700 p-2 rounded flex justify-between items-center">
            <div>
              <span class="font-medium text-white">{{ item.name }}</span>
              <span v-if="item.quantity > 1" class="text-gray-400 ml-2">(×{{ item.quantity }})</span>
            </div>
            <div class="text-sm text-gray-400">{{ item.notes }}</div>
          </div>
        </div>
      </details>
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

// Computed - Categorize items
const weapons = computed(() => {
  return characterState.inventory.filter(item => 
    item.category === 'weapons' || 
    item.name.toLowerCase().includes('sword') ||
    item.name.toLowerCase().includes('bow') ||
    item.name.toLowerCase().includes('dagger') ||
    item.name.toLowerCase().includes('axe') ||
    item.name.toLowerCase().includes('mace') ||
    item.name.toLowerCase().includes('spear')
  )
})

const armor = computed(() => {
  return characterState.inventory.filter(item => 
    item.category === 'armor' || 
    item.name.toLowerCase().includes('armor') ||
    item.name.toLowerCase().includes('shield') ||
    item.name.toLowerCase().includes('mail') ||
    item.name.toLowerCase().includes('plate')
  )
})

const consumables = computed(() => {
  return characterState.inventory.filter(item => 
    item.category === 'consumables' || 
    item.name.toLowerCase().includes('potion') ||
    item.name.toLowerCase().includes('scroll') ||
    item.name.toLowerCase().includes('wand') ||
    item.name.toLowerCase().includes('ration') ||
    item.name.toLowerCase().includes('torch')
  )
})

const equipment = computed(() => {
  return characterState.inventory.filter(item => 
    !weapons.value.includes(item) && 
    !armor.value.includes(item) && 
    !consumables.value.includes(item)
  )
})

// Calculate totals
const totalWeight = computed(() => {
  return characterState.inventory.reduce((sum, item) => {
    return sum + ((item.weight || 0) * (item.quantity || 1))
  }, 0).toFixed(1)
})

const totalValue = computed(() => {
  // Extract value from notes if present (e.g., "Worth 10 gp")
  return characterState.inventory.reduce((sum, item) => {
    const match = item.notes?.match(/(\d+)\s*gp/i)
    const value = match ? parseInt(match[1]) : 0
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

// Event handlers
function onInventoryChangesApplied({ change, result }) {
  console.log('Inventory changes applied:', change, result)
}

function onInventoryChangesRejected(changeId) {
  console.log('Inventory changes rejected:', changeId)
}

// Example: Expose method to add test inventory changes
function addTestInventoryChange() {
  inventoryNotifications.value?.addPendingChange({
    itemsGained: [
      { name: 'Healing Potion', quantity: 2, category: 'consumables' },
      { name: 'Longsword +1', quantity: 1, category: 'weapons' }
    ],
    itemsLost: [],
    moneyGained: { gp: 50, sp: 25 },
    moneyLost: {}
  })
}

// Lifecycle
onMounted(() => {
  // Any initialization needed
})

// Expose for testing
defineExpose({
  addTestInventoryChange
})
</script>

<style scoped>
.inventory-container {
  @apply text-white;
}

details summary {
  user-select: none;
}

details[open] summary {
  @apply text-white mb-2;
}
</style>