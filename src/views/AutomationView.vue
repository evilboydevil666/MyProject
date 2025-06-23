<template>
  <div class="h-full overflow-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-purple-300">Session Automation</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Combat Tracker</h3>
        <CombatTracker />
      </div>
      
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Quick Tools</h3>
        <p class="text-gray-400">Additional automation tools coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SessionAutomation from '../components/SessionAutomation.vue'
import UnifiedSessionManager from '../components/session/UnifiedSessionManager.vue'
import CombatTracker from '../components/session/CombatTracker.vue'
</script>