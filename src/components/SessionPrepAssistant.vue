<template>
  <div class="h-full flex flex-col bg-gray-900 text-white">
    <!-- Header -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <h2 class="text-2xl font-bold text-blue-300 mb-2">🎯 Session Prep Assistant</h2>
      <p class="text-sm text-gray-400">AI-powered session preparation using your existing API setup</p>
    </div>

    <!-- Quick Prep Form -->
    <div class="p-4 border-b border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Session Type</label>
          <select v-model="sessionType" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="exploration">🗺️ Exploration</option>
            <option value="combat">⚔️ Combat</option>
            <option value="social">👥 Social</option>
            <option value="mystery">🔍 Mystery</option>
            <option value="mixed">🎭 Mixed</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Duration</label>
          <select v-model="sessionDuration" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="short">Short (2-3 hours)</option>
            <option value="medium">Medium (3-4 hours)</option>
            <option value="long">Long (4+ hours)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Difficulty</label>
          <select v-model="difficulty" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
            <option value="deadly">Deadly</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Session Theme/Location</label>
        <input 
          v-model="sessionTheme" 
          placeholder="e.g., haunted mansion, underground caverns, noble's court"
          class="w-full bg-gray-700 border border-gray-600 rounded p-2"
        />
      </div>

      <div class="flex gap-2">
        <button 
          @click="generateQuickEncounter" 
          :disabled="isGenerating"
          class="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          {{ isGenerating ? '⚔️ Generating...' : '⚔️ Quick Encounter' }}
        </button>
        <button 
          @click="generateQuickNPC" 
          :disabled="isGenerating"
          class="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          {{ isGenerating ? '👤 Generating...' : '👤 Quick NPC' }}
        </button>
        <button 
          @click="generateSessionOutline" 
          :disabled="isGenerating"
          class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          {{ isGenerating ? '📝 Generating...' : '📝 Session Outline' }}
        </button>
      </div>
    </div>

    <!-- Generated Content -->
    <div class="flex-1 overflow-auto p-4">
      <div v-if="generatedContent.length === 0" class="text-center text-gray-500 py-8">
        <h3 class="text-lg mb-2">🎲 Ready to Prep Your Session</h3>
        <p class="text-sm">Use the buttons above to generate encounters, NPCs, or complete session outlines</p>
      </div>

      <div v-for="(content, index) in generatedContent" :key="index" class="mb-6">
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold" :class="content.typeColor">
              {{ content.icon }} {{ content.title }}
            </h3>
            <div class="flex gap-2">
              <button 
                @click="copyToClipboard(content.fullText, content.title)"
                class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
              >
                📋 Copy
              </button>
              <button 
                @click="exportToChatGPT(content)"
                class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs"
              >
                🌐 To ChatGPT
              </button>
              <button 
                @click="removeContent(index)"
                class="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div class="text-sm bg-gray-900 rounded p-3" v-html="formatContent(content.content)"></div>
          
          <div v-if="content.stats" class="mt-3 text-xs text-gray-400">
            <strong>Stats:</strong> {{ content.stats }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-400">
          Generated {{ generatedContent.length }} items this session
        </span>
        <div class="flex gap-2">
          <button 
            @click="clearAllContent"
            v-if="generatedContent.length > 0"
            class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs"
          >
            Clear All
          </button>
          <button 
            @click="exportSessionPrep"
            v-if="generatedContent.length > 0"
            class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs"
          >
            📤 Export Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterState } from '../characterState.js'

// State
const sessionType = ref('mixed')
const sessionDuration = ref('medium')
const difficulty = ref('moderate')
const sessionTheme = ref('')
const isGenerating = ref(false)
const generatedContent = ref([])

// Computed
const totalLevel = computed(() => 
  characterState.classes.reduce((sum, c) => sum + (c.level || 0), 0)
)

// Character context for AI
const getCharacterContext = () => ({
  name: characterState.name || 'Character',
  level: totalLevel.value,
  classes: characterState.classes.map(c => `${c.className} ${c.level}`).join(', '),
  hp: `${characterState.hp}/${characterState.hpMax}`,
  ac: characterState.ac
})

// Content generation functions
async function generateQuickEncounter() {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const character = getCharacterContext()
    const prompt = `Generate a balanced Pathfinder 1e encounter for a Level ${character.level} character:

**Character:** ${character.name} (${character.classes})
**Session Type:** ${sessionType.value}
**Difficulty:** ${difficulty.value}
**Theme:** ${sessionTheme.value || 'fantasy adventure'}

**Provide:**
1. Encounter name and brief setup
2. Enemy stats (AC, HP, attacks, special abilities)
3. Tactical notes for running the encounter
4. Environmental factors or special rules
5. Appropriate treasure/XP

Format for easy reference during play.`

    const content = await callChatGPT(prompt)
    
    addGeneratedContent({
      type: 'encounter',
      title: 'Combat Encounter',
      icon: '⚔️',
      typeColor: 'text-red-400',
      content: content,
      fullText: content
    })

  } catch (error) {
    console.error('Error generating encounter:', error)
    alert('Error generating encounter. Check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

async function generateQuickNPC() {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const character = getCharacterContext()
    const prompt = `Create an interesting NPC for a Pathfinder 1e session:

**Campaign Context:**
- Character Level: ${character.level}
- Session Type: ${sessionType.value}
- Theme: ${sessionTheme.value || 'fantasy adventure'}

**NPC Details Needed:**
1. Name, race, and appearance
2. Personality and mannerisms
3. Role in the story/session
4. Motivation and secrets
5. Sample dialogue
6. Relevant stats if needed for interaction
7. Plot hooks they might provide

Make them memorable and useful for the current session type.`

    const content = await callChatGPT(prompt)
    
    addGeneratedContent({
      type: 'npc',
      title: 'NPC Character',
      icon: '👤',
      typeColor: 'text-green-400',
      content: content,
      fullText: content
    })

  } catch (error) {
    console.error('Error generating NPC:', error)
    alert('Error generating NPC. Check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

async function generateSessionOutline() {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const character = getCharacterContext()
    const prompt = `Create a session outline for Pathfinder 1e:

**Session Parameters:**
- Character: ${character.name} (Level ${character.level} ${character.classes})
- Type: ${sessionType.value}
- Duration: ${sessionDuration.value}
- Difficulty: ${difficulty.value}
- Theme: ${sessionTheme.value || 'fantasy adventure'}

**Outline Structure:**
1. **Opening Hook** (5-10 minutes)
2. **Main Activities** (2-3 major scenes)
3. **Encounters** (combat, social, exploration as appropriate)
4. **Pacing Notes** (when to have breaks, tension points)
5. **Contingency Plans** (if players go off-script)
6. **Session Conclusion** (hooks for next time)

Tailor everything for a solo Level ${character.level} character.`

    const content = await callChatGPT(prompt)
    
    addGeneratedContent({
      type: 'outline',
      title: 'Session Outline',
      icon: '📝',
      typeColor: 'text-blue-400',
      content: content,
      fullText: content
    })

  } catch (error) {
    console.error('Error generating session outline:', error)
    alert('Error generating session outline. Check your API key and try again.')
  } finally {
    isGenerating.value = false
  }
}

// Utility functions
async function callChatGPT(prompt) {
  const apiKey = localStorage.getItem('openai-api-key')
  if (!apiKey) {
    throw new Error('No OpenAI API key found. Please set it in Settings.')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo', // Use your existing model preference
      messages: [
        {
          role: 'system',
          content: 'You are an expert Pathfinder 1e Game Master. Create practical, ready-to-use content for actual play.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function addGeneratedContent(content) {
  generatedContent.value.unshift({
    ...content,
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString()
  })
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/\n/g, '<br>')
}

function copyToClipboard(text, title) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${title} copied to clipboard!`)
  }).catch(err => {
    console.error('Copy failed:', err)
    alert('Copy failed - please copy manually')
  })
}

function exportToChatGPT(content) {
  const character = getCharacterContext()
  const exportText = `# Pathfinder 1e ${content.title}

**Character Context:**
- ${character.name} (Level ${character.level})
- Classes: ${character.classes}
- Current HP: ${character.hp}

**Generated Content:**
${content.fullText}

---
Continue this Pathfinder session with this ${content.type}. What happens next?`

  copyToClipboard(exportText, `${content.title} for ChatGPT`)
}

function exportSessionPrep() {
  const character = getCharacterContext()
  const sessionSummary = `# Pathfinder 1e Session Prep

**Character:** ${character.name} (Level ${character.level})
**Session Type:** ${sessionType.value}
**Duration:** ${sessionDuration.value}
**Theme:** ${sessionTheme.value || 'Fantasy Adventure'}

## Generated Content:

${generatedContent.value.map(content => `
### ${content.icon} ${content.title}
${content.fullText}
`).join('\n---\n')}

---
Ready to run this Pathfinder session! Use ChatGPT Plus for live support during play.`

  copyToClipboard(sessionSummary, 'Complete Session Prep')
}

function removeContent(index) {
  generatedContent.value.splice(index, 1)
}

function clearAllContent() {
  if (confirm('Clear all generated content?')) {
    generatedContent.value = []
  }
}
</script>

<style scoped>
/* Smooth transitions for generated content */
.bg-gray-800 {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>