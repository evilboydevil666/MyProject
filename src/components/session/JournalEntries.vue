<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Journal Entries</h2>
    <div v-for="(entry, i) in entries" :key="i" class="border-b pb-2">
      <div class="text-sm text-gray-400">{{ entry.date }}</div>
      <div>{{ entry.text }}</div>
    </div>
    <textarea v-model="newEntry" rows="4" placeholder="Write new entry…" class="w-full"></textarea>
    <button @click="addEntry" class="bg-indigo-600 px-4 py-2 rounded">Save Entry</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const entries = reactive([
  { date: '2025-06-21', text: 'Arrived at the ancient ruins.' }
])
const newEntry = ref('')

function addEntry() {
  if (!newEntry.value.trim()) return
  const today = new Date().toISOString().split('T')[0]
  entries.unshift({ date: today, text: newEntry.value.trim() })
  newEntry.value = ''
}
</script>

<style scoped>
/* Uses global textarea styling */
</style>