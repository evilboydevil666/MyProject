<template>
  <div class="h-full flex flex-col bg-gray-800 text-white">
    <!-- Header -->
    <div class="bg-gray-700 p-3 border-b border-gray-600">
      <h3 class="text-lg font-semibold text-green-300">🎭 Narrative Chat</h3>
      <p class="text-xs text-gray-400">In-game actions, combat, and storytelling</p>
    </div>

    <!-- Chat Messages - Narrative Only -->
    <div class="flex-1 overflow-y-auto p-3 space-y-3" ref="narrativeContainer">
      <div v-if="narrativeMessages.length === 0" class="text-center text-gray-500 py-4">
        <h4 class="text-sm mb-2">🗡️ Ready for Adventure!</h4>
        <p class="text-xs mb-3">Describe what you want to do in-game:</p>
        <div class="space-y-1">
          <button v-for="action in quickActions" :key="action" 
                  @click="narrativeInput = action; sendNarrativeMessage()" 
                  class="block w-full bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs">
            {{ action }}
          </button>
        </div>
      </div>

      <div v-for="(message, index) in narrativeMessages" :key="index" class="flex" 
           :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
        <div class="max-w-[90%] rounded-lg p-2" 
             :class="{
               'bg-blue-600 text-white': message.role === 'user',
               'bg-gray-700 text-gray-100': message.role === 'assistant',
               'bg-green-800 text-green-100 border border-green-600': message.type === 'dice-roll'
             }">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold">
              {{ message.role === 'user' ? '🧙‍♂️' : 
                 message.type === 'dice-roll' ? '🎲' : '📖' }}
            </span>
            <span class="text-xs opacity-60">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div v-html="formatMessage(message.content)" class="text-sm"></div>
        </div>
      </div>

      <div v-if="isNarrativeLoading" class="flex justify-start">
        <div class="bg-gray-700 text-gray-100 rounded-lg p-2">
          <div class="flex items-center gap-2">
            <div class="animate-spin h-3 w-3 border-2 border-green-400 border-t-transparent rounded-full"></div>
            <span class="text-sm">GM is thinking...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Roll Buttons -->
    <div class="bg-gray-700 p-2 border-t border-gray-600">
      <div class="grid grid-cols-2 gap-1 mb-2">
        <button @click="quickRoll('1d20')" class="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-xs">
          d20
        </button>
        <button @click="quickRoll('1d20+' + characterMod('STR'))" class="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-xs">
          STR Check
        </button>
        <button @click="quickRoll('1d20+' + characterMod('DEX'))" class="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-xs">
          DEX Check
        </button>
        <button @click="quickRoll('1d6')" class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs">
          d6
        </button>
      </div>

      <!-- Custom Roll Input -->
      <div class="flex gap-1 mb-2">
        <input
          v-model="customRoll"
          placeholder="1d20+5"
          class="flex-1 bg-gray-600 border border-gray-500 rounded p-1 text-white text-xs"
          @keyup.enter="quickRoll(customRoll)"
        />
        <button @click="quickRoll(customRoll)" class="bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded text-xs">
          Roll
        </button>
      </div>
    </div>

    <!-- Narrative Input -->
    <div class="bg-gray-700 p-2 border-t border-gray-600">
      <div class="flex gap-1">
        <input 
          v-model="narrativeInput" 
          @keyup.enter="sendNarrativeMessage"
          :disabled="!hasApiKey || isNarrativeLoading"
          placeholder="I want to search the room..."
          class="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-white text-xs placeholder-gray-400 disabled:opacity-50"
        />
        <button 
          @click="sendNarrativeMessage" 
          :disabled="!hasApiKey || isNarrativeLoading || !narrativeInput.trim()"
          class="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-2 rounded text-xs font-semibold">
          Act
        </button>
      </div>
    </div>

    <!-- Character Quick Stats -->
    <div class="bg-gray-700 p-2 border-t border-gray-600">
      <h5 class="text-xs font-semibold mb-1 text-gray-300">{{ characterState.name || 'Character' }}</h5>
      <div class="grid grid-cols-2 gap-1 text-xs">
        <div>HP: {{ characterState.hp }}/{{ characterState.hpMax }}</div>
        <div>AC: {{ characterState.ac }}</div>
        <div>Level: {{ totalLevel }}</div>
        <div>Initiative: +{{ characterState.init }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { characterState } from '../characterState.js'
import InventoryParser from '../utils/inventoryParser.js'

// State
const narrativeMessages = ref([])
const narrativeInput = ref('')
const isNarrativeLoading = ref(false)
const customRoll = ref('')
const narrativeContainer = ref(null)

// Quick actions for narrative
const quickActions = [
  'I search the room for hidden doors',
  'I listen at the door',
  'I examine the mysterious object',
  'I ready my weapon and advance',
  'I cast a spell',
  'I try to sneak past the guards'
]

// Computed
const hasApiKey = computed(() => !!localStorage.getItem('openai-api-key'))
const totalLevel = computed(() => 
  characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
)

// Props/emits for coordination with main chat
const emit = defineEmits(['inventory-changes-detected'])

onMounted(() => {
  addWelcomeMessage()
})

function addWelcomeMessage() {
  if (hasApiKey.value) {
    narrativeMessages.value.push({
      role: 'assistant',
      content: `🎭 **Welcome to the adventure!**\n\nI'm here to handle your in-game actions, combat, and storytelling. Tell me what you want to do and I'll narrate what happens.\n\n*This chat focuses purely on gameplay - use the main AI Assistant tab for rules questions and campaign management.*`,
      timestamp: Date.now(),
      type: 'narrative'
    })
  }
}

// System prompt specifically for narrative interactions
const getNarrativeSystemPrompt = () => `You are a Pathfinder 1e Game Master handling in-game narrative and combat for a single player character. Your role is to:

**FOCUS ON:**
- Narrating immediate game action and consequences
- Describing environments, NPCs, and situations vividly 
- Managing combat encounters step-by-step
- Calling for appropriate skill checks and saving throws
- Creating immersive, engaging storytelling
- Responding to player actions with realistic outcomes

**CHARACTER CONTEXT:**
- Name: ${characterState.name || 'Adventurer'}
- Race: ${characterState.race || 'Unknown'}
- Classes: ${characterState.classes.map(c => `${c.className} ${c.level}`).join(', ') || 'Level 1'}
- Current HP: ${characterState.hp}/${characterState.hpMax}
- AC: ${characterState.ac}
- Key Skills: ${characterState.skills.filter(s => s.rank > 0).map(s => `${s.name} +${s.rank}`).join(', ') || 'None'}

**RESPONSE STYLE:**
- Keep responses focused on immediate game action (2-3 paragraphs max)
- Use vivid, immersive descriptions
- End with clear options or ask for the player's next action
- Include dice rolls when appropriate ("Make a Perception check" etc.)
- When describing loot/treasure, be specific about quantities
- Maintain narrative flow and tension

**DO NOT:**
- Explain rules or mechanics in detail (that's for the main assistant)
- Generate content unrelated to immediate gameplay
- Make major campaign decisions without player input
- Provide extensive rules clarifications

You are the in-the-moment storyteller bringing the adventure to life!`

async function sendNarrativeMessage() {
  if (!narrativeInput.value.trim() || isNarrativeLoading.value) return

  const userMessage = narrativeInput.value.trim()
  narrativeInput.value = ''

  // Add user message
  narrativeMessages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now(),
    type: 'action'
  })

  // Check for dice roll commands
  if (userMessage.startsWith('/roll')) {
    handleDiceRoll(userMessage)
    scrollToBottom()
    return
  }

  isNarrativeLoading.value = true

 try {
    const apiKey = localStorage.getItem('openai-api-key')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1', // Updated to use GPT-4.1 for narrative consistency
        messages: [
          { role: 'system', content: getNarrativeSystemPrompt() },
          ...narrativeMessages.value.slice(-8).map(m => ({ 
            role: m.role, 
            content: m.content,
            // Filter out dice rolls from context to keep narrative flow
          })).filter(m => m.role !== 'system')
        ],
        temperature: 0.8, // Slightly more creative for storytelling
        max_tokens: 800   // Shorter responses for narrative flow
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    
    narrativeMessages.value.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now(),
      type: 'narrative'
    })

    // Check for inventory changes but don't show notifications in narrative chat
    const changes = InventoryParser.parseInventoryChanges(aiResponse)
    if (InventoryParser.hasChanges(changes)) {
      // Emit to parent to handle in main interface
      emit('inventory-changes-detected', changes)
    }

  } catch (error) {
    console.error('Narrative API Error:', error)
    narrativeMessages.value.push({
      role: 'assistant',
      content: `❌ *Error connecting to GM assistant. Check your connection and try again.*`,
      timestamp: Date.now(),
      type: 'error'
    })
  } finally {
    isNarrativeLoading.value = false
    scrollToBottom()
  }
}

function handleDiceRoll(command) {
  // Parse dice notation (e.g., /roll 1d20+5, /roll 3d6, /roll d20)
  const match = command.match(/\/roll\s+(\d+)?d(\d+)([+-]\d+)?/i)
  
  if (!match) {
    narrativeMessages.value.push({
      role: 'assistant',
      content: '❌ **Invalid dice format**\n\nUse: `/roll XdY+Z`\n\nExamples: `/roll 1d20+5`, `/roll 3d6`, `/roll d20`',
      timestamp: Date.now(),
      type: 'dice-roll'
    })
    return
  }

  const numDice = parseInt(match[1]) || 1
  const dieSize = parseInt(match[2])
  const modifier = parseInt(match[3]) || 0
  
  const rolls = []
  let total = 0
  
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * dieSize) + 1
    rolls.push(roll)
    total += roll
  }
  
  total += modifier
  
  const rollText = rolls.join(', ')
  const modText = modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''
  const critInfo = dieSize === 20 && rolls.includes(20) ? ' 🎯 **NATURAL 20!**' : 
                   dieSize === 20 && rolls.includes(1) ? ' 💥 **NATURAL 1!**' : ''
  
  narrativeMessages.value.push({
    role: 'assistant',
    content: `🎲 **${numDice}d${dieSize}${modText}**\n\n**Rolls:** [${rollText}]${modText}\n**Total:** **${total}**${critInfo}`,
    timestamp: Date.now(),
    type: 'dice-roll'
  })
}

function quickRoll(diceExpression) {
  if (!diceExpression.trim()) return
  handleDiceRoll(`/roll ${diceExpression}`)
  customRoll.value = ''
}

function characterMod(ability) {
  const score = characterState.abilityScores[ability] || 10
  return Math.floor((score - 10) / 2)
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
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (narrativeContainer.value) {
      narrativeContainer.value.scrollTop = narrativeContainer.value.scrollHeight
    }
  })
}
</script>