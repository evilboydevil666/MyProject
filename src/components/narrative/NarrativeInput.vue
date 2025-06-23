<template>
  <div>
    <label class="block text-sm font-medium mb-1">What do you do?</label>
    <div class="flex gap-2">
      <input 
        :value="modelValue"
        @input="handleInput"
        @keyup.enter="$emit('submit')"
        :disabled="disabled"
        placeholder="I search the room..."
        class="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm placeholder-gray-400 disabled:opacity-50"
      />
      <button 
        @click="$emit('submit')" 
        :disabled="disabled || !modelValue.trim()"
        class="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-semibold"
      >
        {{ loading ? 'Thinking...' : 'Act' }}
      </button>
    </div>
    
    <div v-if="suggestions.length > 0" class="mt-1 space-y-1">
      <button 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        @click="$emit('update:modelValue', suggestion)"
        class="block w-full text-left text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  suggestions: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit', 'input-change'])

let inputTimer = null

function handleInput(event) {
  const value = event.target.value
  emit('update:modelValue', value)
  
  // Debounce input changes
  clearTimeout(inputTimer)
  inputTimer = setTimeout(() => {
    emit('input-change', value)
  }, 300)
}
</script>