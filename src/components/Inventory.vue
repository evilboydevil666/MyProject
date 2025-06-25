<template>
  <div>
    <h2 class="text-2xl mb-4">Inventory</h2>
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">Item</th>
          <th class="p-2">Notes</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(itm, i) in characterState.inventory" :key="i" class="even:bg-gray-50">
          <td class="p-2 font-medium">
            <input v-model="itm.name" class="border p-1 rounded w-full"/>
          </td>
          <td class="p-2">
            <input v-model="itm.notes" class="border p-1 rounded w-full"/>
          </td>
          <td class="p-2 space-x-1">
            <button class="px-2 py-1 bg-red-600 text-white rounded" @click="removeItem(i)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addItem" class="mt-4 px-3 py-1 bg-blue-600 text-white rounded">+ Add Item</button>
  </div>
</template>

<script setup>
import { characterState } from '../characterState.js'
function addItem() {
  characterState.inventory.push({ name: '', notes: '' })
}
function removeItem(i) {
  characterState.inventory.splice(i, 1)
}
</script>
