// src/utils/IntelligentRequestRouter.js

export default class IntelligentRequestRouter {
  constructor() {
    // Define routing rules and patterns
    this.complexPatterns = [
      'create a detailed',
      'generate a complete',
      'design an entire',
      'full campaign',
      'comprehensive',
      'analyze all',
      'compare multiple',
      'deep dive'
    ]
    
    this.simplePatterns = [
      'roll',
      'what is',
      'quick',
      'simple',
      'basic',
      'check'
    ]
    
    this.hybridPatterns = [
      'help me understand',
      'explain in detail',
      'walk me through',
      'strategic advice',
      'optimization'
    ]
  }

  /**
   * Routes a request to the appropriate handler (API, web, or hybrid)
   * @param {Object} request - The request object
   * @param {string} request.prompt - The user's prompt
   * @param {Object} request.context - Additional context
   * @returns {Object} Routing decision with target and reasoning
   */
  async routeRequest(request) {
    const { prompt, context } = request
    const lowerPrompt = prompt.toLowerCase()
    
    // Check for complex patterns that need web interface
    for (const pattern of this.complexPatterns) {
      if (lowerPrompt.includes(pattern)) {
        return {
          target: 'web',
          reasoning: `This request involves ${pattern}, which benefits from the web interface's extended context capabilities.`,
          confidence: 0.9
        }
      }
    }
    
    // Check for simple patterns that work well with API
    for (const pattern of this.simplePatterns) {
      if (lowerPrompt.includes(pattern)) {
        return {
          target: 'api',
          reasoning: `Simple ${pattern} request - API can handle this efficiently.`,
          confidence: 0.95
        }
      }
    }
    
    // Check for hybrid patterns
    for (const pattern of this.hybridPatterns) {
      if (lowerPrompt.includes(pattern)) {
        return {
          target: 'hybrid',
          reasoning: `This "${pattern}" request could benefit from web chat for deeper exploration.`,
          confidence: 0.7
        }
      }
    }
    
    // Analyze based on length and complexity
    const wordCount = prompt.split(' ').length
    const hasMultipleParts = prompt.includes('and') || prompt.includes('also') || prompt.includes('then')
    
    if (wordCount > 50 || hasMultipleParts) {
      return {
        target: 'hybrid',
        reasoning: 'Complex multi-part request detected. Consider web chat for better results.',
        confidence: 0.6
      }
    }
    
    // Context-based routing
    if (context.type === 'narrative' && context.urgency === 'high') {
      return {
        target: 'api',
        reasoning: 'In-game narrative requires immediate response.',
        confidence: 0.85
      }
    }
    
    // Default to API for most requests
    return {
      target: 'api',
      reasoning: 'Standard request suitable for API handling.',
      confidence: 0.8
    }
  }

  /**
   * Analyzes if a response suggests need for web transfer
   * @param {string} response - The API response
   * @returns {boolean} Whether to suggest web transfer
   */
  shouldSuggestWebTransfer(response) {
    // Check if response seems truncated or incomplete
    const indicators = [
      'I can provide more detail',
      'This is a simplified',
      'For a complete',
      'There are many aspects',
      'This topic is complex'
    ]
    
    return indicators.some(indicator => 
      response.toLowerCase().includes(indicator.toLowerCase())
    )
  }

  /**
   * Gets routing statistics for optimization
   * @returns {Object} Routing statistics
   */
  getRoutingStats() {
    return {
      totalRequests: this.totalRequests || 0,
      apiRequests: this.apiRequests || 0,
      webRequests: this.webRequests || 0,
      hybridRequests: this.hybridRequests || 0
    }
  }
}