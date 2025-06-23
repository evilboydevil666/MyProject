<template>
  <div v-if="pendingChanges.length > 0" class="inventory-notifications fixed top-4 right-4 z-50 space-y-2">
    <div 
      v-for="change in pendingChanges" 
      :key="change.id"
      class="bg-gray-800 border border-blue-500 rounded-lg p-4 text-white shadow-lg max-w-sm"
      :class="change.type === 'success' ? 'border-green-500' : 'border-blue-500'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ change.type === 'success' ? '✅' : '🎒' }}</span>
          <h4 class="font-semibold">
            {{ change.type === 'success' ? 'Changes Applied' : 'Inventory Changes Detected' }}
          </h4>
        </div>
        <button @click="dismissChange(change.id)" class="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <!-- Change List -->
      <div class="space-y-1 mb-3">
        <div v-for="item in change.itemsGained" :key="'gain-' + item.name" 
             class="flex items-center gap-2 text-sm">
          <span class="text-green-400">+</span>
          <span class="font-medium">{{ item.quantity }}x</span>
          <span>{{ item.name }}</span>
          <span class="text-xs bg-gray-700 px-1 rounded">{{ item.category }}</span>
        </div>
        
        <div v-for="item in change.itemsLost" :key="'lose-' + item.name" 
             class="flex items-center gap-2 text-sm">
          <span class="text-red-400">-</span>
          <span class="font-medium">{{ item.quantity }}x</span>
          <span>{{ item.name }}</span>
        </div>

        <div v-for="[currency, amount] in Object.entries(change.moneyGained)" :key="'gain-' + currency"
             v-if="amount > 0"
             class="flex items-center gap-2 text-sm">
          <span class="text-yellow-400">💰</span>
          <span class="font-medium">+{{ amount }} {{ currency.toUpperCase() }}</span>
        </div>

        <div v-for="[currency, amount] in Object.entries(change.moneyLost)" :key="'lose-' + currency"
             v-if="amount > 0"
             class="flex items-center gap-2 text-sm">
          <span class="text-red-400">💸</span>
          <span class="font-medium">-{{ amount }} {{ currency.toUpperCase() }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="change.type === 'pending'" class="flex gap-2">
        <button 
          @click="approveChanges(change)"
          class="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm font-medium"
        >
          Apply All
        </button>
        <button 
          @click="showDetailedReview(change)"
          class="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium"
        >
          Review
        </button>
        <button 
          @click="rejectChanges(change.id)"
          class="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm"
        >
          ✕
        </button>
      </div>

      <!-- Auto-apply countdown -->
      <div v-if="change.type === 'pending' && autoApplyEnabled" class="mt-2">
        <div class="text-xs text-gray-400 text-center">
          Auto-applying in {{ change.countdown }}s
        </div>
        <div class="w-full bg-gray-700 rounded-full h-1 mt-1">
          <div 
            class="bg-blue-500 h-1 rounded-full transition-all duration-1000"
            :style="{ width: `${(change.countdown / autoApplyDelay) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Detailed Review Modal -->
  <div v-if="reviewingChange" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 text-white">
      <h3 class="text-xl font-bold mb-4">Review Inventory Changes</h3>
      
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <!-- Items to Gain -->
        <div v-if="reviewingChange.itemsGained.length > 0">
          <h4 class="font-semibold text-green-400 mb-2">Items to Add:</h4>
          <div class="space-y-2">
            <div v-for="(item, index) in reviewingChange.itemsGained" :key="index"
                 class="flex items-center gap-2 p-2 bg-gray-700 rounded">
              <input 
                type="checkbox" 
                :id="'gain-' + index"
                v-model="item.selected"
                class="rounded"
              />
              <label :for="'gain-' + index" class="flex-1 flex items-center gap-2">
                <input 
                  v-model.number="item.quantity" 
                  type="number" 
                  min="1" 
                  class="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-center"
                />
                <span>×</span>
                <input 
                  v-model="item.name" 
                  class="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1"
                />
                <select 
                  v-model="item.category"
                  class="bg-gray-600 border border-gray-500 rounded px-2 py-1"
                >
                  <option value="weapons">Weapons</option>
                  <option value="armor">Armor</option>
                  <option value="consumables">Consumables</option>
                  <option value="tools">Tools</option>
                  <option value="magic">Magic Items</option>
                  <option value="valuables">Valuables</option>
                  <option value="miscellaneous">Miscellaneous</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <!-- Money Changes -->
        <div v-if="Object.values(reviewingChange.moneyGained).some(amount => amount > 0)">
          <h4 class="font-semibold text-yellow-400 mb-2">Money to Add:</h4>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="currency in ['pp', 'gp', 'sp', 'cp']" :key="currency" class="flex items-center gap-2">
              <label :for="currency" class="w-8 text-sm font-medium">{{ currency.toUpperCase() }}:</label>
              <input 
                :id="currency"
                v-model.number="reviewingChange.moneyGained[currency]"
                type="number"
                min="0"
                class="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="flex gap-2 mt-6">
        <button 
          @click="applySelectedChanges"
          class="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-medium"
        >
          Apply Selected
        </button>
        <button 
          @click="reviewingChange = null"
          class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import InventoryParser from '../utils/inventoryParser.js'

// Props
const props = defineProps({
  autoApplyEnabled: {
    type: Boolean,
    default: false
  },
  autoApplyDelay: {
    type: Number,
    default: 10 // seconds
  }
})

// Emits
const emit = defineEmits(['changes-applied', 'changes-rejected'])

// State
const pendingChanges = ref([])
const reviewingChange = ref(null)
let changeIdCounter = 0
let autoApplyTimers = new Map()

// Methods
function addPendingChange(changes) {
  const changeId = ++changeIdCounter
  
  const change = {
    id: changeId,
    type: 'pending',
    timestamp: Date.now(),
    countdown: props.autoApplyDelay,
    ...changes
  }

  // Mark all items as selected by default
  change.itemsGained.forEach(item => {
    item.selected = true
  })

  pendingChanges.value.push(change)

  // Start auto-apply timer if enabled
  if (props.autoApplyEnabled) {
    startAutoApplyTimer(change)
  }
}

function startAutoApplyTimer(change) {
  const timer = setInterval(() => {
    change.countdown--
    
    if (change.countdown <= 0) {
      clearInterval(timer)
      autoApplyTimers.delete(change.id)
      approveChanges(change)
    }
  }, 1000)
  
  autoApplyTimers.set(change.id, timer)
}

async function approveChanges(change) {
  try {
    // Clear any auto-apply timer
    if (autoApplyTimers.has(change.id)) {
      clearInterval(autoApplyTimers.get(change.id))
      autoApplyTimers.delete(change.id)
    }

    // Apply the changes
    const result = await InventoryParser.applyInventoryChanges(change, true)
    
    if (result.applied) {
      // Update change to success state
      change.type = 'success'
      change.countdown = 3 // Show success for 3 seconds
      
      // Auto-dismiss success notification
      setTimeout(() => {
        dismissChange(change.id)
      }, 3000)
      
      emit('changes-applied', { change, result })
    }
  } catch (error) {
    console.error('Error applying inventory changes:', error)
    alert('Error applying inventory changes: ' + error.message)
  }
}

function rejectChanges(changeId) {
  // Clear any auto-apply timer
  if (autoApplyTimers.has(changeId)) {
    clearInterval(autoApplyTimers.get(changeId))
    autoApplyTimers.delete(changeId)
  }
  
  dismissChange(changeId)
  emit('changes-rejected', changeId)
}

function dismissChange(changeId) {
  const index = pendingChanges.value.findIndex(c => c.id === changeId)
  if (index >= 0) {
    pendingChanges.value.splice(index, 1)
  }
  
  // Clear any associated timer
  if (autoApplyTimers.has(changeId)) {
    clearInterval(autoApplyTimers.get(changeId))
    autoApplyTimers.delete(changeId)
  }
}

function showDetailedReview(change) {
  // Clear auto-apply timer when reviewing
  if (autoApplyTimers.has(change.id)) {
    clearInterval(autoApplyTimers.get(change.id))
    autoApplyTimers.delete(change.id)
  }
  
  reviewingChange.value = { ...change }
}

function applySelectedChanges() {
  if (!reviewingChange.value) return

  // Filter only selected items
  const filteredChanges = {
    ...reviewingChange.value,
    itemsGained: reviewingChange.value.itemsGained.filter(item => item.selected)
  }

  // Apply the filtered changes
  approveChanges(filteredChanges)
  reviewingChange.value = null
}

// Cleanup timers on unmount
onUnmounted(() => {
  autoApplyTimers.forEach(timer => clearInterval(timer))
  autoApplyTimers.clear()
})

// Expose methods for parent components
defineExpose({
  addPendingChange,
  clearAllChanges: () => {
    autoApplyTimers.forEach(timer => clearInterval(timer))
    autoApplyTimers.clear()
    pendingChanges.value = []
  }
})
</script>

<style scoped>
.inventory-notifications {
  max-height: 80vh;
  overflow-y: auto;
}

/* Smooth animations */
.inventory-notifications > div {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>