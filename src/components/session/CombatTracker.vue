<template>
  <div class="combat-tracker bg-gray-800 p-6 rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Combat Tracker</h2>
    
    <!-- Initiative Order -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Initiative Order</h3>
      <div class="space-y-2">
        <div 
          v-for="(combatant, index) in sortedCombatants" 
          :key="combatant.id"
          class="bg-gray-700 p-3 rounded flex items-center justify-between"
          :class="{ 'ring-2 ring-blue-500': index === currentTurn }"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl font-bold text-gray-400">{{ combatant.initiative }}</span>
            <div>
              <p class="font-semibold">{{ combatant.name }}</p>
              <p class="text-sm text-gray-400">HP: {{ combatant.hp.current }}/{{ combatant.hp.max }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              @click="damageTarget(combatant.id)"
              class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              Damage
            </button>
            <button 
              @click="healTarget(combatant.id)"
              class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
            >
              Heal
            </button>
            <button 
              @click="removeCombatant(combatant.id)"
              class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Combatant -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Add Combatant</h3>
      <div class="flex gap-2">
        <input 
          v-model="newCombatant.name"
          placeholder="Name"
          class="flex-1 bg-gray-700 p-2 rounded"
        />
        <input 
          v-model.number="newCombatant.initiative"
          type="number"
          placeholder="Init"
          class="w-20 bg-gray-700 p-2 rounded"
        />
        <input 
          v-model.number="newCombatant.hp"
          type="number"
          placeholder="HP"
          class="w-20 bg-gray-700 p-2 rounded"
        />
        <button 
          @click="addCombatant"
          :disabled="!newCombatant.name"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Combat Controls -->
    <div class="flex gap-2">
      <button 
        @click="nextTurn"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
      >
        Next Turn
      </button>
      <button 
        @click="rollInitiative"
        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
      >
        Roll Initiative
      </button>
      <button 
        @click="clearCombat"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
      >
        Clear Combat
      </button>
    </div>

    <!-- Damage/Heal Dialog -->
    <div v-if="targetDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg">
        <h3 class="text-lg font-bold mb-4">
          {{ targetDialog.type === 'damage' ? 'Apply Damage' : 'Apply Healing' }} to {{ targetDialog.target?.name }}
        </h3>
        <input 
          v-model.number="targetDialog.amount"
          type="number"
          min="0"
          class="w-full bg-gray-700 p-2 rounded mb-4"
          @keyup.enter="applyHealthChange"
        />
        <div class="flex gap-2">
          <button 
            @click="applyHealthChange"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Apply
          </button>
          <button 
            @click="targetDialog.show = false"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'CombatTracker',
  
  props: {
    party: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['update'],
  
  setup(props, { emit }) {
    // State
    const combatants = ref([])
    const currentTurn = ref(0)
    const roundNumber = ref(1)
    const newCombatant = ref({
      name: '',
      initiative: 0,
      hp: 10
    })
    const targetDialog = ref({
      show: false,
      type: 'damage',
      target: null,
      amount: 0
    })
    
    // Computed
    const sortedCombatants = computed(() => {
      return [...combatants.value].sort((a, b) => b.initiative - a.initiative)
    })
    
    // Methods
    const addCombatant = () => {
      if (!newCombatant.value.name) return
      
      combatants.value.push({
        id: Date.now(),
        name: newCombatant.value.name,
        initiative: newCombatant.value.initiative || 0,
        hp: {
          current: newCombatant.value.hp || 10,
          max: newCombatant.value.hp || 10
        },
        isPC: false
      })
      
      newCombatant.value = {
        name: '',
        initiative: 0,
        hp: 10
      }
      
      emit('update', { combatants: combatants.value })
    }
    
    const removeCombatant = (id) => {
      combatants.value = combatants.value.filter(c => c.id !== id)
      emit('update', { combatants: combatants.value })
    }
    
    const nextTurn = () => {
      currentTurn.value++
      if (currentTurn.value >= sortedCombatants.value.length) {
        currentTurn.value = 0
        roundNumber.value++
      }
    }
    
    const rollInitiative = () => {
      combatants.value.forEach(combatant => {
        // Roll 1d20 + modifier (simplified)
        combatant.initiative = Math.floor(Math.random() * 20) + 1
      })
      currentTurn.value = 0
      roundNumber.value = 1
    }
    
    const clearCombat = () => {
      if (confirm('Clear all combatants?')) {
        combatants.value = []
        currentTurn.value = 0
        roundNumber.value = 1
      }
    }
    
    const damageTarget = (id) => {
      const target = combatants.value.find(c => c.id === id)
      if (target) {
        targetDialog.value = {
          show: true,
          type: 'damage',
          target: target,
          amount: 0
        }
      }
    }
    
    const healTarget = (id) => {
      const target = combatants.value.find(c => c.id === id)
      if (target) {
        targetDialog.value = {
          show: true,
          type: 'heal',
          target: target,
          amount: 0
        }
      }
    }
    
    const applyHealthChange = () => {
      if (!targetDialog.value.target || !targetDialog.value.amount) return
      
      const target = combatants.value.find(c => c.id === targetDialog.value.target.id)
      if (target) {
        if (targetDialog.value.type === 'damage') {
          target.hp.current = Math.max(0, target.hp.current - targetDialog.value.amount)
        } else {
          target.hp.current = Math.min(target.hp.max, target.hp.current + targetDialog.value.amount)
        }
      }
      
      targetDialog.value.show = false
      emit('update', { combatants: combatants.value })
    }
    
    // Initialize with party members
    if (props.party && props.party.length > 0) {
      props.party.forEach(member => {
        combatants.value.push({
          id: Date.now() + Math.random(),
          name: member.name || 'Party Member',
          initiative: 0,
          hp: {
            current: member.hp?.current || 10,
            max: member.hp?.max || 10
          },
          isPC: true
        })
      })
    }
    
    return {
      combatants,
      sortedCombatants,
      currentTurn,
      roundNumber,
      newCombatant,
      targetDialog,
      addCombatant,
      removeCombatant,
      nextTurn,
      rollInitiative,
      clearCombat,
      damageTarget,
      healTarget,
      applyHealthChange
    }
  }
}
</script>

<style scoped>
.combat-tracker {
  max-width: 800px;
  margin: 0 auto;
}
</style>