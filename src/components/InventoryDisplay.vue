<template>
  <div class="inventory-display">
    <!-- Encumbrance Bar -->
    <div class="encumbrance-bar">
      <h3>Carrying Capacity</h3>
      <div class="weight-info">
        <span>{{ totalWeight }}lbs / {{ heavyLoad }}lbs</span>
        <span :class="encumbranceClass">{{ encumbranceLevel }}</span>
      </div>
      <div class="capacity-bar">
        <div class="weight-bar" :style="{ width: weightPercentage + '%' }"></div>
        <div class="load-markers">
          <div class="light-marker" :style="{ left: lightLoadPercent + '%' }"></div>
          <div class="medium-marker" :style="{ left: mediumLoadPercent + '%' }"></div>
        </div>
      </div>
      <div v-if="penalties" class="penalties">
        <span v-if="speedPenalty">Speed -{{ speedPenalty }}ft</span>
        <span v-if="checkPenalty">Check Penalty {{ checkPenalty }}</span>
        <span v-if="maxDex !== null">Max Dex +{{ maxDex }}</span>
      </div>
    </div>

    <!-- Inventory Categories -->
    <div class="inventory-categories">
      <div v-for="(category, name) in categorizedInventory" 
           :key="name" 
           class="category-section">
        <h4>
          {{ capitalize(name) }} 
          <span class="category-stats">
            ({{ category.count }} items, {{ category.totalWeight }}lbs, {{ category.totalValue }}gp)
          </span>
        </h4>
        
        <div class="item-list">
          <div v-for="item in category.items" 
               :key="item.id || item.name"
               class="item-row"
               :class="{ equipped: item.equipped }">
            <div class="item-main">
              <span class="item-name">{{ item.displayName || item.name }}</span>
              <span class="item-quantity">×{{ item.quantity }}</span>
            </div>
            <div class="item-details">
              <span class="item-weight">{{ item.totalWeight }}lbs</span>
              <span class="item-value">{{ item.totalValue }}gp</span>
              <button v-if="canEquip(item)" 
                      @click="toggleEquip(item)"
                      class="equip-btn">
                {{ item.equipped ? 'Unequip' : 'Equip' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Value -->
    <div class="inventory-totals">
      <div class="total-value">
        Total Value: {{ totalValue }}gp 
        ({{ totalValueInPlatinum }}pp)
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { characterState } from '../characterState.js'
import { InventoryParser } from '../utils/inventoryParser.js'
import { InventoryHelpers } from '../utils/inventoryHelpers.js'

// Computed properties
const categorizedInventory = computed(() => {
  const exported = InventoryParser.exportForCharacterBuilder(characterState.inventory)
  return exported.categories
})

const totalWeight = computed(() => 
  characterState.inventoryMetadata.totalWeight.toFixed(1)
)

const totalValue = computed(() => 
  characterState.inventoryMetadata.totalValue
)

const totalValueInPlatinum = computed(() => 
  Math.floor(totalValue.value / 10)
)

const encumbranceData = computed(() => 
  InventoryParser.calculateEncumbrance(
    characterState.inventoryMetadata.totalWeight,
    characterState.abilities.strength
  )
)

const encumbranceLevel = computed(() => {
  const level = encumbranceData.value.level
  return level.charAt(0).toUpperCase() + level.slice(1)
})

const encumbranceClass = computed(() => ({
  'light-load': encumbranceData.value.level === 'light',
  'medium-load': encumbranceData.value.level === 'medium',
  'heavy-load': encumbranceData.value.level === 'heavy',
  'overloaded': encumbranceData.value.level === 'overloaded'
}))

const lightLoad = computed(() => encumbranceData.value.lightLoad)
const mediumLoad = computed(() => encumbranceData.value.mediumLoad)
const heavyLoad = computed(() => encumbranceData.value.heavyLoad)

const weightPercentage = computed(() => {
  const percent = (characterState.inventoryMetadata.totalWeight / heavyLoad.value) * 100
  return Math.min(100, Math.max(0, percent))
})

const lightLoadPercent = computed(() => (lightLoad.value / heavyLoad.value) * 100)
const mediumLoadPercent = computed(() => (mediumLoad.value / heavyLoad.value) * 100)

const speedPenalty = computed(() => encumbranceData.value.speedPenalty)
const checkPenalty = computed(() => encumbranceData.value.checkPenalty)
const maxDex = computed(() => encumbranceData.value.maxDex)

const penalties = computed(() => 
  speedPenalty.value || checkPenalty.value || maxDex.value !== null
)

// Methods
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function canEquip(item) {
  return ['weapons', 'armor', 'magic'].includes(item.category) && 
         InventoryHelpers.getDefaultSlot(item) !== null
}

function toggleEquip(item) {
  if (item.equipped) {
    InventoryHelpers.unequipItem(item.equippedSlot)
  } else {
    InventoryHelpers.equipItem(item)
  }
}

// Watch for inventory changes
watch(() => characterState.inventory, () => {
  InventoryHelpers.updateInventoryMetadata()
}, { deep: true })
</script>

<style scoped>
.inventory-display {
  padding: 1rem;
}

.encumbrance-bar {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.weight-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.capacity-bar {
  position: relative;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.weight-bar {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #ff9800, #f44336);
  transition: width 0.3s ease;
}

.load-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
}

.light-marker,
.medium-marker {
  position: absolute;
  width: 2px;
  height: 100%;
  background: #333;
}

.penalties {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #d32f2f;
}

.penalties span {
  margin-right: 1rem;
}

.light-load { color: #4caf50; }
.medium-load { color: #ff9800; }
.heavy-load { color: #f44336; }
.overloaded { color: #d32f2f; font-weight: bold; }

.category-section {
  margin-bottom: 1.5rem;
}

.category-section h4 {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.category-stats {
  font-size: 0.8rem;
  color: #666;
  font-weight: normal;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.item-row:hover {
  background-color: #f8f8f8;
}

.item-row.equipped {
  background-color: #e3f2fd;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: #666;
  font-size: 0.9rem;
}

.item-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-weight,
.item-value {
  font-size: 0.85rem;
  color: #666;
}

.equip-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.equip-btn:hover {
  background: #1976d2;
}

.inventory-totals {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.total-value {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>