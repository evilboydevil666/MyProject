<!--
  NARRATIVE COMPONENTS COLLECTION
  ===============================
  This file contains templates for all narrative components.
  Each component below should be saved as a separate .vue file for proper usage.
  
  Files to create:
  - src/components/narrative/NarrativeChatActions.vue (Component 1)
  - src/components/narrative/NarrativeMessages.vue (Component 2)
  - src/components/narrative/NarrativeQuickActions.vue (Component 3)
  - src/components/narrative/NarrativeInput.vue (Component 4)
  - src/components/narrative/CharacterQuickStatus.vue (Component 5)
-->

<template>
  <!-- This is the main NarrativeChatActions component -->
  <div class="flex gap-1">
    <button
      @click="$emit('action', 'clear')"
      class="p-1 rounded hover:bg-gray-700"
      title="Clear chat"
    >
      🗑️
    </button>
    <button
      @click="$emit('action', 'export')"
      class="p-1 rounded hover:bg-gray-700"
      title="Export chat"
    >
      📥
    </button>
    <button
      v-if="predictionsAvailable"
      @click="$emit('action', 'predict')"
      class="p-1 rounded hover:bg-gray-700"
      title="AI predictions"
    >
      🤖
    </button>
    <button
      @click="$emit('action', 'sync')"
      class="p-1 rounded hover:bg-gray-700"
      title="Sync with game"
    >
      🔄
    </button>
  </div>
</template>

<script setup>
defineProps({
  synced: Date,
  predictionsAvailable: Boolean
})
defineEmits(['action'])
</script>

<!-- 
=====================================================
ADDITIONAL COMPONENT TEMPLATES (Save as separate files)
=====================================================

--- NarrativeMessages.vue ---
<template>
  <div class="space-y-3">
    <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
      <p>No messages yet. Start your adventure!</p>
    </div>
    <div
      v-for="message in messages"
      :key="message.id"
      :class="[
        'p-3 rounded-lg',
        message.role === 'user' ? 'bg-blue-900 ml-4' : 'bg-gray-800 mr-4'
      ]"
    >
      <div class="flex justify-between items-start mb-1">
        <span class="text-xs text-gray-400">
          {{ message.role === 'user' ? 'You' : 'Narrator' }}
        </span>
        <button
          v-if="message.role === 'assistant'"
          @click="$emit('transfer-to-web', message)"
          class="text-xs text-blue-400 hover:text-blue-300"
        >
          Transfer to Web →
        </button>
      </div>
      <div class="text-white">{{ message.content }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})
defineEmits(['transfer-to-web', 'use-prediction'])

function scrollToBottom() {
  // Implementation for parent to call
  console.log('Scrolling to bottom')
}

defineExpose({ scrollToBottom })
</script>

--- NarrativeQuickActions.vue ---
<template>
  <div class="flex gap-2">
    <button
      @click="roll('1d20', 'skill check')"
      class="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
    >
      🎲 d20
    </button>
    <button
      @click="roll('1d20+modifier', 'attack')"
      class="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
    >
      ⚔️ Attack
    </button>
    <button
      @click="roll('1d20+modifier', 'save')"
      class="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
    >
      🛡️ Save
    </button>
  </div>
</template>

<script setup>
defineProps({
  characterContext: Object
})
const emit = defineEmits(['roll'])

function roll(dice, reason) {
  emit('roll', { dice, reason })
}
</script>

--- NarrativeInput.vue ---
<template>
  <div class="relative">
    <form @submit.prevent="handleSubmit" class="flex gap-2">
      <input
        :value="modelValue"
        @input="updateValue"
        :disabled="disabled"
        :placeholder="disabled ? 'API key required' : 'Describe your action...'"
        class="flex-1 px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        :disabled="disabled || loading || !modelValue.trim()"
        class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? '...' : 'Send' }}
      </button>
    </form>
    <div v-if="suggestions.length > 0" class="absolute bottom-full mb-2 w-full bg-gray-800 rounded-lg p-2">
      <div
        v-for="(suggestion, i) in suggestions"
        :key="i"
        @click="selectSuggestion(suggestion)"
        class="p-2 hover:bg-gray-700 rounded cursor-pointer text-sm"
      >
        {{ suggestion }}
      </div>
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

function updateValue(event) {
  emit('update:modelValue', event.target.value)
  emit('input-change', event.target.value)
}

function handleSubmit() {
  emit('submit', props.modelValue)
}

function selectSuggestion(suggestion) {
  emit('update:modelValue', suggestion)
  emit('submit', suggestion)
}
</script>

--- CharacterQuickStatus.vue ---
<template>
  <div class="text-xs space-y-1">
    <div v-if="character" class="flex justify-between text-gray-400">
      <span>{{ character.name }} (Lvl {{ character.level }})</span>
      <span>HP: {{ character.currentHp }}/{{ character.maxHp }}</span>
    </div>
    <div v-if="insights.length > 0" class="space-y-1">
      <div
        v-for="(insight, i) in insights"
        :key="i"
        :class="[
          'px-2 py-1 rounded text-xs',
          insight.type === 'danger' ? 'bg-red-900 text-red-200' :
          insight.type === 'warning' ? 'bg-yellow-900 text-yellow-200' :
          'bg-blue-900 text-blue-200'
        ]"
      >
        {{ insight.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  character: Object,
  insights: {
    type: Array,
    default: () => []
  }
})
</script>
-->