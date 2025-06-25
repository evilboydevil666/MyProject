export class AIService {
  constructor() {
    this.apiKey = localStorage.getItem('openai-api-key') || ''
    this.defaultModel = 'gpt-4-turbo-preview'
    this.requestQueue = []
    this.isProcessing = false
  }
  
  async generateNarrative(action, context) {
    const prompt = this.buildNarrativePrompt(action, context)
    
    return this.makeRequest({
      messages: [
        { role: 'system', content: this.getNarrativeSystemPrompt(context) },
        ...this.getRecentMessages(context),
        { role: 'user', content: action }
      ],
      temperature: 0.8,
      max_tokens: 800
    })
  }
  
  getNarrativeSystemPrompt(context) {
    return `You are a Pathfinder 1e Game Master running a game for:
    
${this.formatCharacterContext(context.character)}

${context.memory?.coreContext || ''}

Focus on:
- Vivid, immersive storytelling (2-3 paragraphs max)
- Clear consequences and choices
- Appropriate skill checks and dice rolls
- Ending with options or questions

Be the storyteller bringing this adventure to life!`
  }
  
  formatCharacterContext(character) {
    return `Character: ${character.name} (Level ${character.level})
Classes: ${character.classes}
HP: ${character.hp}, AC: ${character.ac}
Top Skills: ${character.topSkills.map(s => `${s.name} +${s.bonus}`).join(', ')}`
  }
  
  getRecentMessages(context) {
    return context.narrative?.slice(-6).map(msg => ({
      role: msg.role,
      content: msg.content
    })) || []
  }
  
  buildNarrativePrompt(action, context) {
    let prompt = action
    
    // Add relevant memories if available
    if (context.relevantMemories?.length > 0) {
      prompt += '\n\n[Relevant context: '
      prompt += context.relevantMemories.slice(0, 2)
        .map(m => m.summary).join('; ')
      prompt += ']'
    }
    
    return prompt
  }
  
  async makeRequest(config) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }
    
    // Add to queue
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        config,
        resolve,
        reject,
        timestamp: Date.now()
      })
      
      this.processQueue()
    })
  }
  
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return
    
    this.isProcessing = true
    
    try {
      while (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift()
        
        try {
          const result = await this.executeRequest(request.config)
          request.resolve(result)
        } catch (error) {
          request.reject(error)
        }
        
        // Rate limiting
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } finally {
      this.isProcessing = false
    }
  }
  
  async executeRequest(config) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || this.defaultModel,
        messages: config.messages,
        temperature: config.temperature || 0.8,
        max_tokens: config.max_tokens || 1000
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error: ${error.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model,
      source: 'api'
    }
  }
  
  setApiKey(key) {
    this.apiKey = key
    localStorage.setItem('openai-api-key', key)
  }
}