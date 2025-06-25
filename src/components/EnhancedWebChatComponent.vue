<template>
  <div class="narrative-suggestions">
    <!-- Floating Suggestion Panel -->
    <transition name="slide-fade">
      <div 
        v-if="showSuggestions && (contextualActions.length > 0 || aiPredictions.length > 0)"
        class="suggestion-panel"
      >
        <!-- Contextual Actions Section -->
        <div v-if="contextualActions.length > 0" class="suggestion-section">
          <h4 class="section-title">
            <span class="icon">⚡</span> Quick Actions
          </h4>
          <div class="action-grid">
            <button
              v-for="action in contextualActions"
              :key="action.id"
              @click="executeAction(action)"
              :class="['action-button', `priority-${action.priority}`]"
              :title="action.tooltip"
            >
              <span class="action-icon">{{ action.icon }}</span>
              <span class="action-text">{{ action.label }}</span>
              <span v-if="action.modifier" class="action-modifier">
                {{ formatModifier(action.modifier) }}
              </span>
            </button>
          </div>
        </div>

        <!-- AI Predictions Section -->
        <div v-if="aiPredictions.length > 0" class="suggestion-section">
          <h4 class="section-title">
            <span class="icon">🤖</span> AI Suggestions
            <button @click="refreshPredictions" class="refresh-btn" title="Refresh suggestions">
              🔄
            </button>
          </h4>
          <div class="prediction-list">
            <div
              v-for="prediction in aiPredictions"
              :key="prediction.id"
              @click="usePrediction(prediction)"
              class="prediction-item"
            >
              <div class="prediction-content">
                <span class="prediction-text">{{ prediction.text }}</span>
                <span class="confidence-indicator" :style="{ width: `${prediction.confidence * 100}%` }"></span>
              </div>
              <span class="prediction-type">{{ prediction.type }}</span>
            </div>
          </div>
        </div>

        <!-- Environmental Awareness -->
        <div v-if="environmentalHints.length > 0" class="suggestion-section">
          <h4 class="section-title">
            <span class="icon">🗺️</span> Environment
          </h4>
          <div class="hint-list">
            <div
              v-for="hint in environmentalHints"
              :key="hint.id"
              class="hint-item"
              @click="exploreHint(hint)"
            >
              <span class="hint-icon">{{ hint.icon }}</span>
              <span class="hint-text">{{ hint.text }}</span>
            </div>
          </div>
        </div>

        <!-- Smart Roll Suggestions -->
        <div v-if="suggestedRolls.length > 0" class="suggestion-section">
          <h4 class="section-title">
            <span class="icon">🎲</span> Suggested Rolls
          </h4>
          <div class="roll-grid">
            <button
              v-for="roll in suggestedRolls"
              :key="roll.id"
              @click="performRoll(roll)"
              class="roll-button"
            >
              <span class="roll-dice">{{ roll.dice }}</span>
              <span class="roll-reason">{{ roll.reason }}</span>
              <span v-if="roll.dc" class="roll-dc">DC {{ roll.dc }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Toggle Button -->
    <button
      @click="toggleSuggestions"
      class="suggestion-toggle"
      :class="{ active: showSuggestions }"
      title="Toggle action suggestions"
    >
      <span v-if="!showSuggestions">💡</span>
      <span v-else>✖️</span>
      <span v-if="suggestionCount > 0" class="suggestion-badge">
        {{ suggestionCount }}
      </span>
    </button>

    <!-- Inline Action Strip (Always Visible) -->
    <div class="inline-actions">
      <button
        v-for="action in topActions"
        :key="action.id"
        @click="executeAction(action)"
        class="inline-action"
        :title="action.tooltip"
      >
        {{ action.icon }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCharacterContext } from '@/composables/useCharacterContext'
import { usePredictiveContentEngine } from '@/composables/usePredictiveContentEngine'
import { useSmartRollPredictor } from '@/composables/useSmartRollPredictor'

const props = defineProps({
  characterState: Object,
  narrativeContext: Object,
  recentMessages: Array
})

const emit = defineEmits(['action', 'roll', 'input-suggestion'])

// State
const showSuggestions = ref(false)
const contextualActions = ref([])
const aiPredictions = ref([])
const environmentalHints = ref([])
const suggestedRolls = ref([])

// Composables
const { analyzeContext } = useCharacterContext()
const { generateSuggestions } = usePredictiveContentEngine()
const { predictRolls } = useSmartRollPredictor()

// Computed
const suggestionCount = computed(() => {
  return contextualActions.value.length + 
         aiPredictions.value.length + 
         environmentalHints.value.length +
         suggestedRolls.value.length
})

const topActions = computed(() => {
  // Show the 3 most relevant actions in the inline strip
  return [...contextualActions.value, ...aiPredictions.value]
    .sort((a, b) => (b.priority || b.confidence || 0) - (a.priority || a.confidence || 0))
    .slice(0, 3)
})

// Methods
function toggleSuggestions() {
  showSuggestions.value = !showSuggestions.value
  if (showSuggestions.value) {
    updateSuggestions()
  }
}

async function updateSuggestions() {
  // Extract narrative text from the context object
  let narrativeText = ''
  if (props.narrativeContext) {
    if (typeof props.narrativeContext === 'string') {
      narrativeText = props.narrativeContext
    } else if (props.narrativeContext && typeof props.narrativeContext === 'object') {
      // Try different possible properties
      narrativeText = props.narrativeContext.text || 
                     props.narrativeContext.content || 
                     props.narrativeContext.message ||
                     props.narrativeContext.lastMessage ||
                     ''
    }
  }
  
  // Analyze current context
  const analysis = analyzeContext({
    character: props.characterState,
    narrative: narrativeText,  // Pass the extracted string
    recentMessages: props.recentMessages
  })

  // Generate contextual actions based on character abilities
  contextualActions.value = generateContextualActions(analysis)

  // Get AI predictions if available
  if (analysis.shouldUseAI) {
    const predictions = await generateSuggestions({
      context: analysis,
      limit: 3
    })
    aiPredictions.value = predictions
  }

  // Environmental awareness
  environmentalHints.value = extractEnvironmentalHints(analysis)

  // Smart roll predictions
  suggestedRolls.value = predictRolls(analysis)
}

function generateContextualActions(analysis) {
  const actions = []
  
  // Combat-related actions
  if (analysis.inCombat) {
    actions.push({
      id: 'attack-primary',
      label: 'Attack',
      icon: '⚔️',
      tooltip: `Attack with ${analysis.primaryWeapon || 'weapon'}`,
      modifier: analysis.attackBonus,
      priority: 'high',
      action: 'attack'
    })
    
    if (analysis.canCastSpells) {
      actions.push({
        id: 'cast-spell',
        label: 'Cast Spell',
        icon: '✨',
        tooltip: 'Cast a spell',
        priority: 'high',
        action: 'cast'
      })
    }
    
    actions.push({
      id: 'defend',
      label: 'Total Defense',
      icon: '🛡️',
      tooltip: '+4 AC, no other actions',
      priority: 'medium',
      action: 'defend'
    })
  }
  
  // Skill-based actions
  if (analysis.topSkills) {
    analysis.topSkills.forEach(skill => {
      if (skill.name === 'Perception' && !analysis.recentlySearched) {
        actions.push({
          id: 'perception-check',
          label: 'Search Area',
          icon: '👁️',
          tooltip: `Perception check (+${skill.modifier})`,
          modifier: skill.modifier,
          priority: 'medium',
          action: 'skill',
          skill: 'Perception'
        })
      }
      
      if (skill.name === 'Stealth' && !analysis.inCombat) {
        actions.push({
          id: 'stealth-check',
          label: 'Sneak',
          icon: '🥷',
          tooltip: `Stealth check (+${skill.modifier})`,
          modifier: skill.modifier,
          priority: 'medium',
          action: 'skill',
          skill: 'Stealth'
        })
      }
    })
  }
  
  // Conditional actions
  if (analysis.lowHealth) {
    actions.push({
      id: 'heal-self',
      label: 'Use Healing',
      icon: '❤️',
      tooltip: 'Drink potion or use healing',
      priority: 'urgent',
      action: 'heal'
    })
  }
  
  return actions
}

function extractEnvironmentalHints(analysis) {
  const hints = []
  
  if (analysis.lastNarrativeContains('door')) {
    hints.push({
      id: 'door-hint',
      icon: '🚪',
      text: 'A door was mentioned',
      actions: ['Listen', 'Check for traps', 'Open carefully']
    })
  }
  
  if (analysis.lastNarrativeContains('dark')) {
    hints.push({
      id: 'darkness-hint',
      icon: '🕯️',
      text: 'Darkness affects vision',
      actions: ['Light source', 'Darkvision', 'Proceed carefully']
    })
  }
  
  if (analysis.lastNarrativeContains(['chest', 'container', 'box'])) {
    hints.push({
      id: 'container-hint',
      icon: '📦',
      text: 'Container detected',
      actions: ['Check for traps', 'Examine lock', 'Open']
    })
  }
  
  return hints
}

function executeAction(action) {
  switch (action.action) {
    case 'attack':
      emit('action', {
        type: 'roll',
        dice: `1d20+${action.modifier || 0}`,
        reason: 'Attack roll',
        followUp: 'damage'
      })
      break
      
    case 'skill':
      emit('action', {
        type: 'roll',
        dice: `1d20+${action.modifier || 0}`,
        reason: `${action.skill} check`
      })
      break
      
    case 'cast':
      emit('input-suggestion', `I cast ${action.spell || '[spell name]'}`)
      break
      
    case 'defend':
      emit('input-suggestion', 'I take a total defense action (+4 AC)')
      break
      
    case 'heal':
      emit('input-suggestion', 'I drink a healing potion')
      break
      
    default:
      emit('input-suggestion', action.label)
  }
  
  // Close panel after action
  showSuggestions.value = false
}

function usePrediction(prediction) {
  emit('input-suggestion', prediction.text)
  showSuggestions.value = false
}

function exploreHint(hint) {
  // Show hint actions as input suggestions
  const suggestion = `What about the ${hint.text.toLowerCase()}?`
  emit('input-suggestion', suggestion)
}

function performRoll(roll) {
  emit('roll', {
    dice: roll.dice,
    reason: roll.reason,
    dc: roll.dc
  })
  showSuggestions.value = false
}

function refreshPredictions() {
  updateSuggestions()
}

function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

// Watch for context changes
watch(() => props.narrativeContext, () => {
  if (showSuggestions.value) {
    updateSuggestions()
  }
}, { deep: true })

// Auto-update suggestions periodically when panel is open
let updateInterval
watch(showSuggestions, (newVal) => {
  if (newVal) {
    updateInterval = setInterval(updateSuggestions, 30000) // Every 30 seconds
  } else {
    clearInterval(updateInterval)
  }
})

onMounted(() => {
  // Initial suggestion generation
  updateSuggestions()
})
</script>

<style scoped>
.narrative-suggestions {
  position: relative;
}

/* Floating Panel */
.suggestion-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 0.5rem;
  background: rgba(17, 24, 39, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
  backdrop-filter: blur(8px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

/* Toggle Button */
.suggestion-toggle {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 0.375rem;
  color: white;
  font-size: 1.25rem;
  transition: all 0.2s;
  cursor: pointer;
}

.suggestion-toggle:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: scale(1.05);
}

.suggestion-toggle.active {
  background: rgba(59, 130, 246, 0.5);
}

.suggestion-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: bold;
}

/* Sections */
.suggestion-section {
  margin-bottom: 1rem;
}

.suggestion-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
}

.section-title .icon {
  font-size: 1rem;
}

.refresh-btn {
  margin-left: auto;
  padding: 0.125rem 0.25rem;
  background: transparent;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  transition: transform 0.2s;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

/* Action Grid */
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(55, 65, 81, 0.5);
  border-radius: 0.375rem;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

.action-button.priority-urgent {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.1);
}

.action-button.priority-high {
  border-color: rgba(251, 191, 36, 0.5);
}

.action-icon {
  font-size: 1.5rem;
}

.action-modifier {
  font-size: 0.625rem;
  color: #60a5fa;
  font-weight: bold;
}

/* Predictions */
.prediction-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prediction-item {
  padding: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(55, 65, 81, 0.5);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.prediction-item:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
}

.prediction-content {
  position: relative;
}

.prediction-text {
  font-size: 0.875rem;
  color: white;
}

.confidence-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #60a5fa;
  transition: width 0.3s;
}

.prediction-type {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.625rem;
  color: #9ca3af;
  text-transform: uppercase;
}

/* Environmental Hints */
.hint-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.hint-item:hover {
  background: rgba(16, 185, 129, 0.2);
}

/* Roll Grid */
.roll-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.roll-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.375rem;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.roll-button:hover {
  background: rgba(139, 92, 246, 0.2);
  transform: translateY(-1px);
}

.roll-dice {
  font-weight: bold;
  font-size: 0.875rem;
}

.roll-dc {
  font-size: 0.625rem;
  color: #fbbf24;
}

/* Inline Actions */
.inline-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.inline-action {
  padding: 0.375rem 0.5rem;
  background: rgba(55, 65, 81, 0.3);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.25rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.inline-action:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Scrollbar */
.suggestion-panel::-webkit-scrollbar {
  width: 6px;
}

.suggestion-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.suggestion-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 640px) {
  .suggestion-panel {
    max-height: 300px;
  }
  
  .action-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>