<template>
  <div class="h-full overflow-auto">
    <h2 class="text-2xl font-bold mb-6 text-blue-300">Party & Session Management</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PartyRoster />
      <FactionsList />
    </div>
    
    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TaskTracker />
      <JournalEntries />
    </div>
  </div>
</template>

<script setup>
import PartyRoster from '../components/party/PartyRoster.vue'
import FactionsList from '../components/party/FactionsList.vue'
import PartySessionManagement from '../components/PartySessionManagement.vue'
import TaskTracker from '@/components/session/TaskTracker.vue'
import JournalEntries from '@/components/session/JournalEntries.vue'
</script>