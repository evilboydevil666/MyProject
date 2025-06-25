<template>
  <div class="bg-gray-700 rounded p-3">
    <h4 class="text-sm font-semibold mb-2 text-gray-300">
      {{ character.name || 'Character' }}
    </h4>
    <div class="grid grid-cols-2 gap-1 text-xs">
      <div>HP: {{ character.hp }}</div>
      <div>AC: {{ character.ac }}</div>
      <div>Level: {{ character.level }}</div>
      <div>Initiative: +{{ character.initiative || 0 }}</div>
    </div>
    
    <div v-if="insights.length > 0" class="mt-2 pt-2 border-t border-gray-600">
      <div class="text-xs text-blue-300 mb-1">💡 Insights:</div>
      <div 
        v-for="insight in insights" 
        :key="insight.id" 
        class="text-xs text-gray-400"
      >
        {{ insight.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  },
  insights: {
    type: Array,
    default: () => []
  }
})
</script>