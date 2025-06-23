// src/utils/ContextBridge.js

export default class ContextBridge {
  constructor() {
    this.transferQueue = []
    this.lastTransferId = null
  }

  /**
   * Formats an API interaction for web chat reference
   * @param {Object} interaction - The interaction to format
   * @param {string} interaction.userInput - What the user said
   * @param {string} interaction.apiResponse - What the API responded
   * @param {Object} interaction.context - Additional context
   * @returns {string} Formatted message for web chat
   */
  formatForWebReference(interaction) {
    const { userInput, apiResponse, context } = interaction
    const timestamp = new Date().toLocaleTimeString()
    
    let formatted = `📋 **[REFERENCE ONLY - DO NOT RESPOND]** 📋\n\n`
    formatted += `This is an automated context update from the RPG Narrator at ${timestamp}.\n`
    formatted += `═══════════════════════════════════════\n\n`
    
    // Add character context if available
    if (context && context.character) {
      formatted += `**Character Context:**\n`
      formatted += `- Name: ${context.character.name}\n`
      formatted += `- Level: ${context.character.level}\n`
      formatted += `- HP: ${context.character.hp}\n`
      formatted += `- AC: ${context.character.ac}\n\n`
    }
    
    // Add the interaction
    formatted += `**Player Action:**\n${userInput}\n\n`
    formatted += `**GM Response:**\n${apiResponse}\n\n`
    formatted += `═══════════════════════════════════════\n`
    formatted += `⚠️ **Instructions**: This is reference information only. Do not respond to this message. Wait for the next player input that requests your assistance.\n\n`
    formatted += `💡 **Purpose**: You now have context about recent game events if the player asks questions or wants to continue from this point.`
    
    return formatted
  }

  /**
   * Prepares context for manual web transfer
   * @param {Object} message - Message to transfer
   * @param {Object} options - Transfer options
   * @returns {Object} Prepared context object
   */
  async prepareWebContext(message, options = {}) {
    const contextId = `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const context = {
      id: contextId,
      timestamp: Date.now(),
      message: message.content,
      options,
      metadata: {
        source: 'narrative_chat',
        transferType: 'manual'
      }
    }
    
    this.transferQueue.push(context)
    this.lastTransferId = contextId
    
    return context
  }

  /**
   * Transfers context to web (via clipboard)
   * @param {Object} context - Context to transfer
   * @returns {string} Transfer ID
   */
  async transferToWeb(context) {
    try {
      await navigator.clipboard.writeText(context.message)
      return context.id
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      throw error
    }
  }

  /**
   * Formats a full conversation for web chat
   * @param {Object} conversation - Conversation data
   * @returns {string} Formatted conversation
   */
  formatForWebChat(conversation) {
    let output = '## 🎲 RPG Narrator Context Transfer\n\n'
    
    // Character info
    if (conversation.character) {
      output += `### Character Information\n`
      output += `**Name**: ${conversation.character.name}\n`
      output += `**Level**: ${conversation.character.level}\n`
      output += `**Classes**: ${conversation.character.classes}\n`
      output += `**Status**: HP ${conversation.character.hp}, AC ${conversation.character.ac}\n`
      output += `**Top Skills**: ${conversation.character.topSkills.join(', ')}\n\n`
    }
    
    // Recent narrative
    if (conversation.narrative && conversation.narrative.length > 0) {
      output += `### Recent Game Narrative\n`
      conversation.narrative.forEach(msg => {
        const role = msg.role === 'user' ? '🧙‍♂️ Player' : '📖 GM'
        output += `**${role}**: ${msg.content}\n\n`
      })
    }
    
    // Last action
    if (conversation.lastAction) {
      output += `### Continue From\n`
      output += `"${conversation.lastAction}"\n\n`
    }
    
    output += `---\n`
    output += `*Transferred from RPG Narrator at ${new Date().toLocaleString()}*`
    
    return output
  }

  /**
   * Creates a reference update for web chat
   * @param {Array} recentMessages - Recent message history
   * @param {Object} characterContext - Current character context
   * @returns {string} Reference update message
   */
  createReferenceUpdate(recentMessages, characterContext) {
    let update = `📋 **[AUTO-SYNC REFERENCE]** 📋\n\n`
    update += `⚠️ DO NOT RESPOND TO THIS MESSAGE - FOR CONTEXT ONLY\n\n`
    
    // Session info
    update += `**Session Time**: ${new Date().toLocaleString()}\n`
    update += `**Sync Type**: Automatic API Interaction\n\n`
    
    // Character status
    if (characterContext) {
      update += `**Current Character Status**:\n`
      update += `- ${characterContext.name} (${characterContext.classes})\n`
      update += `- ${characterContext.hp} HP, ${characterContext.ac} AC\n\n`
    }
    
    // Recent exchanges
    update += `**Recent Game Activity**:\n`
    update += `════════════════════════════\n`
    
    recentMessages.forEach(msg => {
      if (msg.type !== 'dice-roll') {  // Skip dice rolls for brevity
        const prefix = msg.role === 'user' ? '→ Player' : '← GM'
        update += `${prefix}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}\n\n`
      }
    })
    
    update += `════════════════════════════\n`
    update += `This context is automatically synchronized. The player may reference these events in future questions.`
    
    return update
  }

  /**
   * Gets statistics about context transfers
   * @returns {Object} Transfer statistics
   */
  getTransferStats() {
    return {
      queueLength: this.transferQueue.length,
      lastTransferId: this.lastTransferId,
      totalTransfers: this.transferQueue.length
    }
  }

  /**
   * Clears the transfer queue
   */
  clearQueue() {
    this.transferQueue = []
  }
}