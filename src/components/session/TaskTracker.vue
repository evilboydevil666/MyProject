<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Task Tracker & Daily Logs</h2>
    <ul class="list-disc pl-5">
      <li v-for="(task, i) in tasks" :key="i">
        <input type="checkbox" v-model="task.done" class="mr-2" />
        <span :class="task.done ? 'line-through text-gray-400' : ''">{{ task.text }}</span>
      </li>
    </ul>
    <div class="flex space-x-2">
      <input v-model="newTask" placeholder="New task…" class="flex-1" />
      <button @click="addTask" class="bg-blue-600 px-4 py-2 rounded">Add</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const tasks = reactive([
  { text: 'Prepare session notes', done: false },
  { text: 'Track NPC initiative', done: false }
])
const newTask = ref('')

function addTask() {
  if (!newTask.value.trim()) return
  tasks.push({ text: newTask.value.trim(), done: false })
  newTask.value = ''
}
</script>

<style scoped>
/* Inherits global form styling */
</style>