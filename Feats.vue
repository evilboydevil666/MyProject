<template>
  <div>
    <h2 class="text-2xl mb-4">Feats</h2>
    <div v-for="(ft, i) in characterState.feats" :key="i" class="flex space-x-2 mb-2">
      <input v-model="ft.name" placeholder="Feat name" class="flex-1 border p-1 rounded"/>
      <input v-model="ft.desc" placeholder="Description" class="flex-1 border p-1 rounded"/>
      <button @click="removeFeat(i)" class="px-2 bg-red-600 text-white rounded">Remove</button>
    </div>
    <button @click="addFeat" class="px-3 py-1 bg-purple-500 text-white rounded">+ Add Feat</button>
  </div>
</template>

<script setup>
import { characterState } from '../characterState.js'
function addFeat() {
  characterState.feats.push({ name: '', desc: '' })
}
function removeFeat(i) {
  characterState.feats.splice(i, 1)
}
</script>
