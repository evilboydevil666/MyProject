<template>
  <div class="space-y-4 text-white h-full flex flex-col">
    <!-- Section Tabs -->
    <nav class="flex space-x-4 bg-gray-800 p-2 rounded">
      <button
        v-for="section in sections"
        :key="section"
        @click="currentSection = section"
        :class="[
          'px-4 py-2 rounded cursor-pointer',
          currentSection===section
            ? 'bg-blue-600 font-semibold'
            : 'hover:bg-gray-700'
        ]"
      >
        {{ section }}
      </button>
    </nav>

    <!-- Section Content -->
    <div class="flex-1 overflow-auto">
      <component :is="componentForSection" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PartyRoster from '@/components/party/PartyRoster.vue'
import UnifiedSessionManager from '@/components/session/UnifiedSessionManager.vue'

const sections = ['Roster', 'Tasks', 'Journal', 'Factions']
const currentSection = ref('Roster')

const componentForSection = computed(() => ({
  Roster:   RosterView,
  Tasks:    TaskTracker,
  Journal:  JournalEntries,
  Factions: FactionsList
}[currentSection.value]))
</script>

<style scoped>
/* styling for party/session management container */
</style>