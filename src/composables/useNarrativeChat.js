import { ref, computed } from 'vue'

export function useNarrativeChat() {
  // State
  const messages = ref([])
  const currentInput = ref('')
  const isLoading = ref(false)
  
  // Check for API key
  const hasApiKey = computed(() => {
    const key = localStorage.getItem('openai-api-key') // FIXED: Changed from 'openai_api_key'
    return !!key && key.startsWith('sk-')
  })
  
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
      const apiKey = localStorage.getItem('openai-api-key') // FIXED: Changed from 'openai_api_key'
      
      // Build the prompt with context
      let systemPrompt = "You are a Pathfinder 1e game narrator. Respond to player actions with vivid, immersive narration."
      if (context?.character) {
        systemPrompt += `\n\nCharacter: ${context.character.name || 'Unknown'}, Level ${context.character.level || 1} ${context.character.class || 'Adventurer'}`
        systemPrompt += `\nHP: ${context.character.currentHp || 0}/${context.character.maxHp || 10}`
      }
      
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
  
  return {
    messages,
    currentInput,
    isLoading,
    hasApiKey,
    sendMessage,
    clearMessages,
    exportChat
  }
}