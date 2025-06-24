<template>
  <div>
    <h2 class="text-2xl mb-4">Spells</h2>
    <!-- Spell Slots -->
    <div v-for="lvl in 9" :key="'slot'+lvl" class="mb-6">
      <div class="flex items-center mb-2">
        <h3 class="text-xl font-semibold mr-4">{{ lvl }}<sup>{{ ["th","st","nd","rd"][lvl]||"th" }}</sup> Level</h3>
        <label class="inline-flex items-center mr-4">
          Used:
          <input
            type="number"
            min="0"
            v-model.number="characterState.spellSlots[lvl].used"
            class="w-16 border p-1 rounded ml-1 text-center"
          />
        </label>
        <label class="inline-flex items-center">
          Max:
          <input
            type="number"
            min="0"
            v-model.number="characterState.spellSlots[lvl].max"
            class="w-16 border p-1 rounded ml-1 text-center"
          />
        </label>
      </div>
      <!-- Spells at this level -->
      <div v-for="(sp, idx) in spellsByLevel[lvl]" :key="lvl+','+idx" class="flex items-center space-x-2 mb-2">
        <input
          v-model="sp.name"
          placeholder="Spell name"
          class="flex-1 border p-1 rounded"
        />
        <label class="inline-flex items-center">
          Prep
          <input type="checkbox" v-model="sp.prep" class="ml-1"/>
        </label>
        <input
          v-model.number="sp.dc"
          type="number"
          placeholder="DC"
          class="w-16 border p-1 rounded text-center"
        />
        <button
          @click="removeSpell(lvl, idx)"
          class="px-2 py-1 bg-red-600 text-white rounded"
        >Remove</button>
      </div>
      <button
        @click="addSpell(lvl)"
        class="bg-blue-600 text-white px-3 py-1 rounded text-xs"
      >+ Add Spell</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { characterState } from '../characterState.js'

// Ensure spellSlots exists in state
if (!characterState.spellSlots) {
  characterState.spellSlots = {}
  for (let i = 1; i <= 9; i++) {
    characterState.spellSlots[i] = { used: 0, max: 0 }
  }
}

// Ensure spells array exists
if (!characterState.spells) {
  characterState.spells = []
}

// Compute spells grouped by level
const spellsByLevel = computed(() => {
  const groups = {}
  for (let lvl = 1; lvl <= 9; lvl++) {
    groups[lvl] = characterState.spells
      .filter(s => s.level === lvl)
  }
  return groups
})

function addSpell(level) {
  characterState.spells.push({
    name: '',
    level,
    prep: false,
    dc: 0
  })
}

function removeSpell(level, idx) {
  // find the global index of the nth spell at this level
  let count = 0
  for (let i = 0; i < characterState.spells.length; i++) {
    if (characterState.spells[i].level === level) {
      if (count === idx) {
        characterState.spells.splice(i, 1)
        return
      }
      count++
    }
  }
}
</script>
