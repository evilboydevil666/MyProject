import { ref, computed } from 'vue'

export function useNarrativeChat() {
  // State
  const messages = ref([])
  const currentInput = ref('')
  const isLoading = ref(false)
  
  // Check for API key
  const hasApiKey = computed(() => {
    const key = localStorage.getItem('openai-api-key')
    return !!key && key.startsWith('sk-')
  })
  
  // Build system prompt based on context
  function buildSystemPrompt(context) {
    let prompt = "You are a Pathfinder 1e game narrator. Respond to player actions with vivid, immersive narration."
    
    if (context?.action === 'cast_spell') {
      prompt += "\nThe player is casting a spell. Describe the magical effects dramatically."
      prompt += `\nSpell: ${context.spell} (${context.school || 'Unknown'} school)`
      if (context.description) {
        prompt += `\nEffect: ${context.description}`
      }
    } else if (context?.action === 'use_item') {
      prompt += "\nThe player is using an item. Describe the action and its immediate effects."
      prompt += `\nItem: ${context.item}`
      if (context.effect) {
        prompt += `\nMechanical effect: ${JSON.stringify(context.effect)}`
      }
    } else if (context?.action === 'spell_failed') {
      prompt += "\nThe player attempted to cast a spell but failed."
      prompt += `\nSpell: ${context.spell}`
      prompt += `\nReason: ${context.reason}`
    } else if (context?.action === 'equip_item') {
      prompt += "\nThe player is equipping an item."
      prompt += `\nItem: ${context.item}`
    }
    
    if (context?.character) {
      prompt += `\n\nCharacter: ${context.character.name || 'Unknown'}, Level ${context.character.level || 1} ${context.character.class || 'Adventurer'}`
      prompt += `\nHP: ${context.character.currentHp || 0}/${context.character.maxHp || 10}`
    }
    
    return prompt
  }
  
  // Send message to AI
  async function sendMessage(messageData) {
    const text = typeof messageData === 'string' ? messageData : messageData.text
    const context = typeof messageData === 'object' ? messageData.context : null
    
    if (!text.trim() || !hasApiKey.value) return
    
    // Add user message
    messages.value.push({
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      context
    })
    
    currentInput.value = ''
    isLoading.value = true
    
    try {
      const apiKey = localStorage.getItem('openai-api-key')
      
      // Build the prompt with context
      let systemPrompt = buildSystemPrompt(context)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.value.slice(-10).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: text }
          ],
          temperature: 0.8,
          max_tokens: 300
        })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      
      // Add AI response
      messages.value.push({
        id: Date.now(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      })
      
    } catch (error) {
      console.error('Failed to get AI response:', error)
      messages.value.push({
        id: Date.now(),
        role: 'assistant',
        content: 'The mystical connection falters... (Error: ' + error.message + ')',
        timestamp: new Date(),
        error: true
      })
    } finally {
      isLoading.value = false
    }
  }
  
  // Clear all messages
  function clearMessages() {
    messages.value = []
  }
  
  // Export chat as text
  function exportChat() {
    const text = messages.value
      .map(m => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join('\n\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `narrative-chat-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // Generate contextual narrative for common actions
  function generateActionNarrative(action, details = {}) {
    const narratives = {
      'rest': 'You settle down to rest, taking a moment to recover your strength.',
      'search': 'You carefully examine the area, looking for anything of interest.',
      'listen': 'You pause and focus your senses, straining to hear any sounds.',
      'hide': 'You quickly seek cover, trying to remain unseen.',
      'sneak': 'Moving as quietly as possible, you advance with caution.',
      'intimidate': 'You put on your most menacing expression and stance.',
      'persuade': 'You speak with conviction, choosing your words carefully.',
      'defend': 'You raise your guard, preparing for incoming attacks.',
      'charge': 'With a battle cry, you rush forward at full speed!',
      'retreat': 'You carefully withdraw from the engagement.',
    }
    
    return narratives[action] || `You ${action}.`
  }
  
  // Quick action buttons data
  const quickActions = [
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'listen', label: 'Listen', icon: '👂' },
    { id: 'rest', label: 'Rest', icon: '🏕️' },
    { id: 'hide', label: 'Hide', icon: '🫥' },
    { id: 'defend', label: 'Defend', icon: '🛡️' },
  ]
  
  return {
    messages,
    currentInput,
    isLoading,
    hasApiKey,
    sendMessage,
    clearMessages,
    exportChat,
    generateActionNarrative,
    quickActions
  }
}