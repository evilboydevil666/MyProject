<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Known Factions & Relationships</h2>
    <ul class="space-y-2">
      <li v-for="(f, i) in factions" :key="i" class="p-2 border rounded flex justify-between">
        <div>
          <div class="font-semibold">{{ f.name }}</div>
          <div class="text-sm">Relationship: {{ f.relationship }}</div>
        </div>
        <button @click="editFaction(i)" class="text-yellow-400 hover:underline">Edit</button>
      </li>
    </ul>
    <button @click="addFaction" class="bg-yellow-600 px-4 py-2 rounded">+ Add Faction</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const factions = reactive([
  { name: 'Silver Hand', relationship: 'Ally' },
  { name: 'Black Rose',  relationship: 'Rival' }
])

function addFaction() {
  factions.push({ name: 'New Faction', relationship: 'Neutral' })
}
function editFaction(i) {
  // stub: open modal or inline edit
  alert(`Edit: ${factions[i].name}`)
}
</script>

<style scoped>
/* Card and list styling inherited */
</style>