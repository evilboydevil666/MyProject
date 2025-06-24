// src/composables/useChatGPT.js
import { ref } from 'vue'
import WebChatModal from '@/components/modals/WebChatModal.vue'

// Configuration
const config = ref({
  apiKey: localStorage.getItem('openai-api-key') || '',
  model: 'gpt-4',
  temperature: 0.8,
  maxTokens: 1000,
  systemPrompt: `You are an expert Pathfinder 1e Game Master assistant. You help GMs create engaging content, manage rules, and run smooth game sessions. Always consider game balance, player fun, and narrative coherence. Provide specific Pathfinder 1e mechanics when relevant.`
})

export function useChatGPT() {
  const isLoading = ref(false)
  const error = ref(null)
  
  // Set API key
  const setApiKey = (key) => {
    config.value.apiKey = key
    localStorage.setItem('openai-api-key', key)
  }
  
  // Format game context for GPT
  const formatForGPT = (context) => {
    const contextParts = []
    
    if (context.location) {
      contextParts.push(`Current Location: ${context.location}`)
    }
    if (context.partyLevel) {
      contextParts.push(`Party Level: ${context.partyLevel}`)
    }
    if (context.activeQuest) {
      contextParts.push(`Active Quest: ${context.activeQuest}`)
    }
    if (context.sessionNotes) {
      contextParts.push(`Recent Events: ${context.sessionNotes}`)
    }
    if (context.characters && context.characters.length > 0) {
      const charList = context.characters.map(c => `${c.name} (${c.class} ${c.level})`).join(', ')
      contextParts.push(`Party Composition: ${charList}`)
    }
    
    return contextParts.length > 0 
      ? `\n\nGame Context:\n${contextParts.join('\n')}` 
      : ''
  }
  
  // Send message to ChatGPT
  const sendToChatGPT = async (message, context = {}, options = {}) => {
    if (!config.value.apiKey) {
      throw new Error('OpenAI API key not configured')
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const messages = [
        {
          role: 'system',
          content: options.systemPrompt || config.value.systemPrompt
        }
      ]
      
      // Add context if provided
      if (Object.keys(context).length > 0) {
        messages.push({
          role: 'system',
          content: formatForGPT(context)
        })
      }
      
      // Add conversation history if provided
      if (options.history && options.history.length > 0) {
        messages.push(...options.history)
      }
      
      // Add current message
      messages.push({
        role: 'user',
        content: message
      })
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.value.apiKey}`
        },
        body: JSON.stringify({
          model: options.model || config.value.model,
          messages: messages,
          temperature: options.temperature || config.value.temperature,
          max_tokens: options.maxTokens || config.value.maxTokens,
          ...(options.additionalParams || {})
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'API request failed')
      }
      
      const data = await response.json()
      return data.choices[0].message.content
      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Specialized generation functions
  const generateNPC = async (context) => {
    const prompt = `Generate a detailed NPC for a Pathfinder 1e game. Include:
    - Name, race, class, and level
    - Ability scores and key skills
    - Personality traits and motivations
    - A secret or plot hook
    - Combat tactics if relevant
    - 2-3 sample dialogue lines
    
    Make the NPC appropriate for the current context.`
    
    return sendToChatGPT(prompt, context, {
      temperature: 0.9,
      systemPrompt: config.value.systemPrompt + '\nFormat the NPC in a clear, organized manner.'
    })
  }
  
  const generateEncounter = async (context) => {
    const prompt = `Create a balanced combat encounter for a Pathfinder 1e party. Include:
    - Appropriate CR for the party level
    - Enemy composition with specific creatures
    - Tactical setup and terrain features
    - Combat tactics for the enemies
    - Potential complications or twists
    - Treasure appropriate to the CR
    
    Ensure the encounter is challenging but fair.`
    
    return sendToChatGPT(prompt, context, {
      temperature: 0.7
    })
  }
  
  const generateLocation = async (locationType, context) => {
    const prompt = `Describe a ${locationType} for a Pathfinder 1e game. Include:
    - Vivid sensory details (sights, sounds, smells)
    - Notable features or landmarks
    - Potential hazards or interesting elements
    - 2-3 NPCs that might be found here
    - Plot hooks or adventure opportunities
    - Any relevant game mechanics (skill checks, etc.)`
    
    return sendToChatGPT(prompt, context, {
      temperature: 0.8
    })
  }
  
  const clarifyRules = async (question) => {
    const prompt = `Explain this Pathfinder 1e rule clearly and concisely: ${question}
    
    Include:
    - The basic rule explanation
    - Common examples or applications
    - Any important exceptions or edge cases
    - Page references if you know them`
    
    return sendToChatGPT(prompt, {}, {
      temperature: 0.3,
      systemPrompt: 'You are a Pathfinder 1e rules expert. Be precise and accurate.'
    })
  }
  
  const generateTreasure = async (cr, context) => {
    const prompt = `Generate treasure appropriate for a CR ${cr} encounter in Pathfinder 1e.
    
    Include:
    - Coins (following standard treasure tables)
    - Magic items (if appropriate for CR)
    - Mundane valuable items
    - Plot-relevant items or clues
    
    Make it interesting and appropriate for the party.`
    
    return sendToChatGPT(prompt, context, {
      temperature: 0.7
    })
  }
  
  // Batch generation for session prep
  const prepareSession = async (sessionPlan, context) => {
    const prompt = `Help me prepare for a Pathfinder 1e session with this plan:
    ${sessionPlan}
    
    Provide:
    1. Session opening/recap text
    2. 3 potential encounters (combat, social, exploration)
    3. NPC personalities for key interactions
    4. Contingency plans for likely player actions
    5. Memorable descriptions for key moments
    6. Session ending hooks`
    
    return sendToChatGPT(prompt, context, {
      maxTokens: 2000,
      temperature: 0.8
    })
  }
  
  return {
    config,
    isLoading,
    error,
    setApiKey,
    sendToChatGPT,
    formatForGPT,
    generateNPC,
    generateEncounter,
    generateLocation,
    clarifyRules,
    generateTreasure,
    prepareSession
  }
}