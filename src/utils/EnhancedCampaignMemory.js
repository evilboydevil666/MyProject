// Advanced campaign memory with relationship tracking and continuity management
class EnhancedCampaignMemory {
  constructor() {
    this.coreMemory = {
      worldState: new WorldStateTracker(),
      relationships: new RelationshipGraph(),
      plotThreads: new PlotThreadManager(),
      continuity: new ContinuityChecker(),
      timeline: new CampaignTimeline()
    }
    
    this.memoryLayers = {
      permanent: new Map(), // Core facts that never change
      evolving: new Map(),  // Things that change over time
      temporary: new Map(), // Session-specific context
      inferential: new Map() // AI-derived insights
    }
  }
  
  // Build context-aware prompts with layered memory
  buildContextPrompt(requestType, currentSituation) {
    const relevantMemory = this.extractRelevantMemory(requestType, currentSituation)
    
    return {
      coreContext: this.buildCoreContext(),
      situationalContext: this.buildSituationalContext(currentSituation),
      relationshipContext: this.buildRelationshipContext(currentSituation),
      continuityReminders: this.buildContinuityReminders(requestType),
      priorityFacts: this.getPriorityFacts(requestType)
    }
  }
  
  buildCoreContext() {
    const character = characterState
    return `# Core Campaign Context

**Character:** ${character.name}
- **Level:** ${this.getTotalLevel()} ${character.classes.map(c => `${c.className}`).join('/')}
- **Current Status:** ${character.hp}/${character.hpMax} HP
- **Key Traits:** ${this.getKeyCharacterTraits()}

**World State:**
- **Current Location:** ${this.coreMemory.worldState.getCurrentLocation()}
- **Date/Time:** ${this.coreMemory.timeline.getCurrentDate()}
- **Weather/Conditions:** ${this.coreMemory.worldState.getCurrentConditions()}

**Active Situation:**
- **Primary Goal:** ${this.coreMemory.plotThreads.getPrimaryObjective()}
- **Immediate Challenge:** ${this.coreMemory.plotThreads.getCurrentChallenge()}
- **Complications:** ${this.coreMemory.plotThreads.getActiveComplications()}`
  }
  
  buildRelationshipContext(situation) {
    const relevantNPCs = this.coreMemory.relationships.getRelevantNPCs(situation)
    
    if (relevantNPCs.length === 0) return ''
    
    return `\n**Relationship Context:**
${relevantNPCs.map(npc => 
  `- **${npc.name}:** ${npc.relationship} (${npc.lastInteraction})`
).join('\n')}

**Faction Standing:**
${this.coreMemory.relationships.getFactionStandings().map(faction =>
  `- ${faction.name}: ${faction.standing} (${faction.reason})`
).join('\n')}`
  }
  
  buildContinuityReminders(requestType) {
    const reminders = this.coreMemory.continuity.getRelevantReminders(requestType)
    
    if (reminders.length === 0) return ''
    
    return `\n**Continuity Reminders:**
${reminders.map(reminder => `- ${reminder.fact} (${reminder.source})`).join('\n')}`
  }
  
  // Update memory based on AI responses and player actions
  async updateMemoryFromSession(sessionEvents) {
    // Process each event for memory updates
    for (const event of sessionEvents) {
      await this.processEvent(event)
    }
    
    // Run continuity checks
    const continuityIssues = await this.coreMemory.continuity.checkConsistency()
    
    // Update relationship dynamics
    this.coreMemory.relationships.updateDynamics(sessionEvents)
    
    // Advance plot threads
    this.coreMemory.plotThreads.processEvents(sessionEvents)
    
    return {
      memoryUpdates: this.getRecentUpdates(),
      continuityIssues,
      newInsights: this.generateNewInsights(sessionEvents)
    }
  }
  
  async processEvent(event) {
    switch (event.type) {
      case 'npc-interaction':
        this.coreMemory.relationships.recordInteraction(event)
        break
      case 'location-discovery':
        this.coreMemory.worldState.addLocation(event.location)
        break
      case 'plot-advancement':
        this.coreMemory.plotThreads.advanceThread(event.threadId, event.development)
        break
      case 'faction-change':
        this.coreMemory.relationships.updateFactionStanding(event)
        break
    }
  }
}

class RelationshipGraph {
  constructor() {
    this.npcs = new Map()
    this.factions = new Map()
    this.relationshipMatrix = new Map()
  }
  
  recordInteraction(event) {
    const npcId = event.npcId
    
    if (!this.npcs.has(npcId)) {
      this.npcs.set(npcId, {
        name: event.npcName,
        firstMet: event.timestamp,
        interactions: [],
        reputation: 0,
        trustLevel: 0,
        lastKnownLocation: event.location
      })
    }
    
    const npc = this.npcs.get(npcId)
    npc.interactions.push({
      timestamp: event.timestamp,
      type: event.interactionType,
      outcome: event.outcome,
      location: event.location,
      impact: event.impact || 0
    })
    
    // Update relationship metrics
    this.updateRelationshipMetrics(npcId, event)
  }
  
  updateRelationshipMetrics(npcId, event) {
    const npc = this.npcs.get(npcId)
    
    // Simple relationship scoring
    switch (event.outcome) {
      case 'positive':
        npc.reputation += 1
        npc.trustLevel += 0.1
        break
      case 'negative':
        npc.reputation -= 1
        npc.trustLevel -= 0.2
        break
      case 'neutral':
        // Neutral interactions slowly build familiarity
        npc.trustLevel += 0.05
        break
    }
    
    // Clamp values
    npc.reputation = Math.max(-10, Math.min(10, npc.reputation))
    npc.trustLevel = Math.max(0, Math.min(1, npc.trustLevel))
  }
  
  getRelevantNPCs(situation) {
    const location = situation.location
    const context = situation.context
    
    return Array.from(this.npcs.values())
      .filter(npc => 
        npc.lastKnownLocation === location ||
        npc.interactions.some(interaction => 
          interaction.type === context
        )
      )
      .sort((a, b) => b.trustLevel - a.trustLevel)
      .slice(0, 5) // Top 5 most relevant
  }
}

class PlotThreadManager {
  constructor() {
    this.threads = new Map()
    this.objectives = new Map()
    this.complications = new Map()
  }
  
  addThread(threadId, threadData) {
    this.threads.set(threadId, {
      id: threadId,
      title: threadData.title,
      description: threadData.description,
      status: 'active',
      priority: threadData.priority || 'medium',
      created: Date.now(),
      lastUpdate: Date.now(),
      milestones: [],
      connections: threadData.connections || []
    })
  }
  
  advanceThread(threadId, development) {
    const thread = this.threads.get(threadId)
    if (!thread) return
    
    thread.milestones.push({
      timestamp: Date.now(),
      development: development.description,
      impact: development.impact,
      playerActions: development.playerActions
    })
    
    thread.lastUpdate = Date.now()
    
    // Check for thread completion
    if (development.completesThread) {
      thread.status = 'completed'
      this.resolveConnectedThreads(threadId)
    }
  }
  
  getPrimaryObjective() {
    const activeThreads = Array.from(this.threads.values())
      .filter(thread => thread.status === 'active')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    
    return activeThreads[0]?.title || 'Explore and adventure'
  }
  
  generatePlotSummary() {
    const activeThreads = Array.from(this.threads.values())
      .filter(thread => thread.status === 'active')
    
    return {
      primaryPlots: activeThreads.filter(t => t.priority === 'high'),
      secondaryPlots: activeThreads.filter(t => t.priority === 'medium'),
      backgroundPlots: activeThreads.filter(t => t.priority === 'low'),
      recentDevelopments: this.getRecentDevelopments()
    }
  }
}
async getEnhancedContext(situation) {
  try {
    // Try new enhancement
    const scorer = new MemoryImportanceScorer()
    const scored = scorer.scoreMemory(this.memoryLayers, situation)
    return scored
  } catch (error) {
    // Fallback to existing method
    return this.buildContextPrompt('general', situation)
  }
}