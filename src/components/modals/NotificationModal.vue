<template>
  <div class="fixed top-4 right-4 bg-blue-800 border border-blue-600 rounded p-3 z-50 max-w-sm animate-slideIn">
    <div class="flex items-center justify-between mb-2">
      <span class="font-semibold">{{ title }}</span>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white">✕</button>
    </div>
    <p class="text-sm mb-2">{{ message }}</p>
    <div v-if="action" class="flex gap-2">
      <button 
        @click="$emit('action')"
        class="flex-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
      >
        {{ action.label }}
      </button>
      <button 
        @click="$emit('close')"
        class="flex-1 bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-sm"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  action: Object
})

defineEmits(['close', 'action'])
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
</style>