<template>
  <div 
    ref="container"
    class="flex-1 overflow-y-auto border border-gray-600 rounded p-3 bg-gray-900"
  >
    <div v-if="messages.length === 0" class="text-gray-500 text-sm text-center py-4">
      <h4 class="mb-2">🗡️ Ready for Adventure!</h4>
      <p class="text-xs mb-3">Tell me what you want to do:</p>
      <div class="space-y-1">
        <button 
          v-for="action in defaultActions" 
          :key="action"
          @click="$emit('use-suggestion', { suggestedAction: action })"
          class="block w-full bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
        >
          {{ action }}
        </button>
      </div>
    </div>

    <div 
      v-for="(message, index) in messages" 
      :key="message.id || index" 
      class="text-sm mb-3 p-2 rounded"
      :class="{
        'bg-blue-800': message.role === 'user',
        'bg-gray-800': message.role === 'assistant',
        'bg-green-800 border border-green-600': message.type === 'dice-roll',
        'bg-purple-800 border border-purple-600': message.type === 'prediction'
      }"
    >
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold">
          {{ getRoleIcon(message) }}
        </span>
        <span class="text-xs opacity-60">{{ formatTime(message.timestamp) }}</span>
        <span v-if="message.confidence" class="text-xs bg-gray-700 px-1 rounded">
          {{ Math.round(message.confidence * 100) }}% confident
        </span>
      </div>
      <div v-html="formatMessage(message.content)"></div>
      
      <div v-if="shouldShowTransferButton(message)" class="mt-2 flex items-center gap-2">
        <button 
          @click="handleDirectTransfer(message)"
          class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs"
        >
          🌐 Expand in Web Chat
        </button>
        <span v-if="!hasProjectId" class="text-xs text-gray-400">
          (No project configured)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['transfer-to-web', 'use-suggestion'])

const container = ref(null)
const hasProjectId = ref(false)

const defaultActions = [
  'I search the room for hidden doors',
  'I listen at the door',
  'I examine the mysterious object',
  'I ready my weapon and advance'
]

// Check for project ID on mount and when storage changes
onMounted(() => {
  checkProjectId()
  
  // Listen for project ID changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'chatgpt-project-id') {
      checkProjectId()
    }
  })
})

function checkProjectId() {
  hasProjectId.value = !!localStorage.getItem('chatgpt-project-id')
}

function getRoleIcon(message) {
  if (message.role === 'user') return '🧙‍♂️'
  if (message.type === 'dice-roll') return '🎲'
  if (message.type === 'prediction') return '🔮'
  return '📖'
}

function shouldShowTransferButton(message) {
  return message.role === 'assistant' && 
         message.type !== 'dice-roll' &&
         message.content.length > 200
}

function handleDirectTransfer(message) {
  // Create context
  const context = `🎭 **NARRATIVE CONTINUATION**

**Previous Narrative:**
${message.content}

Continue this narrative scene in our Pathfinder campaign...`

  // Copy to clipboard
  navigator.clipboard.writeText(context).then(() => {
    console.log('Narrative copied to clipboard')
  }).catch(err => {
    console.error('Failed to copy:', err)
  })
  
  // Open ChatGPT directly
  let url = 'https://chat.openai.com'
  const projectId = localStorage.getItem('chatgpt-project-id')
  
  if (projectId) {
    url += `/?project=${projectId}`
  }
  
  window.open(url, '_blank')
  
  // Also emit the event for parent handling if needed
  emit('transfer-to-web', message)
}

function formatMessage(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-2 rounded mt-1 overflow-x-auto text-xs"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded text-xs">$1</code>')
    .replace(/\n/g, '<br>')
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

async function scrollToBottom() {
  await nextTick()
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight
  }
}

defineExpose({ scrollToBottom })
</script>