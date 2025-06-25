<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg w-11/12 h-5/6 flex flex-col">
      <div class="bg-gray-700 p-4 rounded-t-lg flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">🌐 Enhanced Web ChatGPT</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white text-xl">✕</button>
      </div>
      
      <div class="flex-1 p-4">
        <EnhancedWebChatComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import EnhancedWebChatComponent from '../EnhancedWebChatComponent.vue'

defineEmits(['close'])
</script>