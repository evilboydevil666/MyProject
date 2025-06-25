// src/utils/EnhancedChatGPTExport.js

export class EnhancedChatGPTExport {
  constructor() {
    this.sessionContext = this.loadSessionContext()
  }

  // Main export function for world building content
  exportWorldBuildingContent(content, options = {}) {
    const { 
      includeFullContext = true,
      continueConversation = true,
      requestType = 'enhance'
    } = options

    const exportText = this.buildExportText(content, {
      includeFullContext,
      continueConversation,
      requestType
    })

    return this.formatForChatGPT(exportText)
  }

  // Build comprehensive export text
  buildExportText(content, options) {
    const sections = []

    // 1. System Context (if full context requested)
    if (options.includeFullContext) {
      sections.push(this.getSystemContext())
    }

    // 2. Campaign Context
    sections.push(this.getCampaignContext())

    // 3. Generated Content
    sections.push(this.formatGeneratedContent(content))

    // 4. Request/Instructions
    sections.push(this.getRequestInstructions(content, options.requestType))

    // 5. Continuation Prompt (if requested)
    if (options.continueConversation) {
      sections.push(this.getContinuationPrompt(content))
    }

    return sections.join('\n\n---\n\n')
  }

  // System context for ChatGPT
  getSystemContext() {
    return `# 🎮 Pathfinder 1e World Building Assistant

You are now configured as an expert Pathfinder 1e Game Master and world builder. Your role is to help develop, enhance, and expand campaign content while maintaining consistency with established lore and game mechanics.

## Core Guidelines:
- **System**: Pathfinder 1e (with all official content available)
- **Style**: Rich, detailed, immediately usable in play
- **Tone**: Adapt to the campaign's established tone
- **Mechanics**: Always provide complete game statistics
- **Consistency**: Reference and build upon existing campaign elements

## Your Capabilities:
1. **Enhance** existing content with more detail
2. **Expand** ideas into full adventures or campaigns
3. **Connect** disparate elements into cohesive narratives
4. **Balance** game mechanics for fair play
5. **Generate** related content that fits the established world`
  }

  // Campaign-specific context
  getCampaignContext() {
    const campaign = this.sessionContext.campaign || {}
    const character = this.sessionContext.character || {}
    const worldElements = this.sessionContext.worldElements || []

    return `## Campaign Context

**Character Information:**
- Name: ${character.name || 'Unknown Hero'}
- Level: ${character.level || 1}
- Classes: ${character.classes || 'Adventurer'}
- Current Location: ${campaign.currentLocation || 'Unspecified'}

**Campaign Details:**
- Setting: ${campaign.setting || 'Custom Fantasy World'}
- Tone: ${campaign.tone || 'Epic Fantasy'}
- Major Themes: ${campaign.themes || 'Adventure, Mystery, Combat'}
- Current Arc: ${campaign.currentArc || 'Beginning of Adventure'}

**Established World Elements:**
${worldElements.length > 0 ? worldElements.map(el => `- ${el.type}: ${el.name}`).join('\n') : '- No previous world building elements recorded'}

**Important Notes:**
- Maintain consistency with previously generated content
- Reference established NPCs, locations, and lore when relevant
- Build connections between different world elements`
  }

  // Format the generated content
  formatGeneratedContent(content) {
    let formatted = `## Generated Content

**Category:** ${this.getCategoryName(content.category)}
**Type:** ${content.title}
${content.tags ? `**Tags:** ${content.tags.join(', ')}` : ''}
${content.stats ? `**Stats:** ${content.stats}` : ''}

### Content:

${content.content}

### Metadata:
- Generated: ${new Date(content.timestamp).toLocaleString()}
- Content ID: ${content.id}`

    // Add any linked content
    if (content.linkedContent && content.linkedContent.length > 0) {
      formatted += `\n\n### Related Content:
${content.linkedContent.map(link => `- ${link.type}: ${link.name}`).join('\n')}`
    }

    return formatted
  }

  // Get appropriate request instructions
  getRequestInstructions(content, requestType) {
    const instructions = {
      enhance: `## Request: Enhance This Content

Please enhance the above ${content.category} with:
1. **Additional Detail**: Expand descriptions and add sensory details
2. **Mechanical Clarity**: Ensure all game statistics are complete and balanced
3. **Plot Hooks**: Add 2-3 ways this connects to the broader campaign
4. **Secrets**: Include 1-2 hidden elements for the GM
5. **Variants**: Suggest alternative versions or scaling options

Maintain the original concept while making it more engaging and useful.`,

      expand: `## Request: Expand This Content

Transform this ${content.category} into a larger campaign element:
1. **Full Adventure**: Create a 3-5 session adventure featuring this content
2. **Connected Elements**: Generate related NPCs, locations, and encounters
3. **Progressive Challenges**: Scale encounters for character advancement
4. **Branching Paths**: Multiple ways players can approach the content
5. **Long-term Impact**: How this affects the campaign world

Create a comprehensive expansion that could sustain multiple game sessions.`,

      connect: `## Request: Connect to Campaign

Integrate this ${content.category} with the existing campaign:
1. **Lore Connections**: Tie to established world history
2. **NPC Relationships**: Connect to existing characters
3. **Geographic Placement**: Fit into the campaign map
4. **Timeline Integration**: When and how this appears
5. **Player Hooks**: Personal connections to PCs

Make this feel like a natural part of the established world.`,

      refine: `## Request: Refine and Polish

Polish this ${content.category} for immediate use:
1. **Rules Verification**: Ensure Pathfinder 1e compliance
2. **Balance Check**: Appropriate for character level
3. **Clarity Edit**: Remove ambiguity, improve readability
4. **Quick Reference**: Create a summary box for play
5. **GM Notes**: Add running tips and potential issues

Prepare this for tonight's game session.`,

      related: `## Request: Generate Related Content

Create complementary content for this ${content.category}:
1. **Supporting Cast**: NPCs that interact with this element
2. **Connected Locations**: Places where this might appear
3. **Historical Context**: Events that led to this
4. **Future Implications**: How this shapes the world
5. **Alternative Perspectives**: How different factions view this

Build a web of interconnected content around this element.`
    }

    return instructions[requestType] || instructions.enhance
  }

  // Continuation prompt for ongoing conversation
  getContinuationPrompt(content) {
    return `## Continuing the Conversation

After you've processed the above content, I may ask you to:
- Generate specific variations
- Create detailed stat blocks
- Develop full adventure outlines
- Answer questions about integration
- Troubleshoot balance issues

Please maintain this context throughout our conversation and reference the established campaign elements when creating new content.

**First Task**: Please ${this.getFirstTask(content.category)} and then ask what aspect I'd like to explore further.`
  }

  // Get appropriate first task
  getFirstTask(category) {
    const tasks = {
      lore: 'provide a brief timeline of key events in this lore',
      rules: 'create a simple example showing this rule in action',
      items: 'suggest which character classes would most benefit from this item',
      locations: 'describe the first impression characters get when arriving here',
      creatures: 'explain this creature\'s role in the ecosystem and potential encounters'
    }
    
    return tasks[category] || 'enhance the content with additional detail'
  }

  // Format for ChatGPT with proper markdown
  formatForChatGPT(text) {
    // Add ChatGPT-specific formatting
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Ensure bold works
      .replace(/\*(.*?)\*/g, '*$1*') // Ensure italics work
      .replace(/^#/gm, '\n#') // Add spacing before headers
      .trim()

    return formatted
  }

  // Get friendly category name
  getCategoryName(category) {
    const names = {
      lore: '📚 Lore & History',
      rules: '⚖️ Custom Rule',
      items: '⚔️ Item/Equipment',
      locations: '🏰 Location',
      creatures: '🐉 Creature'
    }
    return names[category] || category
  }

  // Save session context for continuity
  saveSessionContext(context) {
    this.sessionContext = { ...this.sessionContext, ...context }
    localStorage.setItem('chatgpt-export-context', JSON.stringify(this.sessionContext))
  }

  // Load saved context
  loadSessionContext() {
    try {
      const saved = localStorage.getItem('chatgpt-export-context')
      return saved ? JSON.parse(saved) : this.getDefaultContext()
    } catch {
      return this.getDefaultContext()
    }
  }

  // Default context structure
  getDefaultContext() {
    return {
      campaign: {
        setting: 'Custom Fantasy World',
        tone: 'Epic Fantasy',
        themes: 'Adventure, Mystery, Combat',
        currentLocation: '',
        currentArc: ''
      },
      character: {
        name: '',
        level: 1,
        classes: ''
      },
      worldElements: []
    }
  }

  // Update world elements tracking
  addWorldElement(element) {
    if (!this.sessionContext.worldElements) {
      this.sessionContext.worldElements = []
    }
    
    this.sessionContext.worldElements.unshift({
      type: element.category,
      name: element.title,
      id: element.id,
      timestamp: element.timestamp
    })
    
    // Keep only last 20 elements
    this.sessionContext.worldElements = this.sessionContext.worldElements.slice(0, 20)
    
    this.saveSessionContext(this.sessionContext)
  }

  // Generate a session briefing for ChatGPT
  generateSessionBriefing(allContent) {
    const byCategory = {}
    allContent.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = []
      }
      byCategory[item.category].push(item.title)
    })

    const briefing = `# 🌍 World Building Session Summary

## Content Created Today:
${Object.entries(byCategory).map(([category, items]) => 
  `\n### ${this.getCategoryName(category)}\n${items.map(item => `- ${item}`).join('\n')}`
).join('\n')}

## Session Statistics:
- Total Items: ${allContent.length}
- Session Duration: ${this.getSessionDuration()}
- Primary Focus: ${this.getPrimaryFocus(byCategory)}

## ChatGPT Assistant Role:
You are now the keeper of this world's lore. Help me:
1. Maintain consistency across all elements
2. Fill in gaps between created content  
3. Answer questions about how elements interact
4. Generate adventures using these elements
5. Create player handouts and references

## Next Steps:
What aspect of this world would you like to explore further? I can:
- Deep dive into any specific element
- Create connections between elements
- Generate an adventure outline
- Develop player-facing content
- Answer worldbuilding questions`

    return briefing
  }

  // Calculate session duration
  getSessionDuration() {
    const start = this.sessionContext.sessionStart || Date.now()
    const duration = Date.now() - start
    const hours = Math.floor(duration / 3600000)
    const minutes = Math.floor((duration % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }

  // Determine primary focus
  getPrimaryFocus(byCategory) {
    let maxCategory = 'General'
    let maxCount = 0
    
    Object.entries(byCategory).forEach(([category, items]) => {
      if (items.length > maxCount) {
        maxCount = items.length
        maxCategory = this.getCategoryName(category)
      }
    })
    
    return maxCategory
  }

  // Create a campaign guide prompt
  generateCampaignGuidePrompt(allContent) {
    return `# 📚 Campaign Guide Generation Request

## Available Content:
${allContent.map(item => `- ${this.getCategoryName(item.category)}: ${item.title}`).join('\n')}

## Request:
Please create a comprehensive campaign guide that weaves all these elements together into a cohesive whole. 

### Include:
1. **Executive Summary** (1 page)
   - Campaign premise and tone
   - Major themes and conflicts
   - Unique selling points

2. **World Overview** (2-3 pages)
   - Geography and key locations
   - Political landscape
   - Economic systems
   - Cultural elements

3. **History & Lore** (2-3 pages)
   - Timeline of major events
   - Creation myths
   - Lost civilizations
   - Current era context

4. **Factions & Organizations** (3-4 pages)
   - Major power groups
   - Goals and methods
   - Key NPCs
   - Relationship dynamics

5. **Locations Gazetteer** (4-5 pages)
   - Settlement descriptions
   - Dungeon summaries
   - Wilderness areas
   - Planar connections

6. **Bestiary** (2-3 pages)
   - Unique creatures
   - Variant monsters
   - Encounter tables
   - Legendary beings

7. **Treasures & Artifacts** (2-3 pages)
   - Magic item catalog
   - Artifact histories
   - Cursed items
   - Treasure generation

8. **Campaign Arcs** (3-4 pages)
   - Low-level (1-5): [Title]
   - Mid-level (6-10): [Title]  
   - High-level (11-15): [Title]
   - Epic-level (16-20): [Title]

9. **GM Resources** (2-3 pages)
   - Random tables
   - Name generators
   - Quick NPC stats
   - Session starters

10. **Player Handouts** (1-2 pages)
    - World map
    - Common knowledge
    - Character hooks
    - House rules summary

Format as a professional RPG supplement with:
- Clear headers and organization
- Sidebars for quick reference
- Cross-references between sections
- "Read aloud" text boxes
- GM secrets in special formatting

Make this feel like a published campaign setting while incorporating all the generated content naturally.`
  }
}

// Singleton instance
export const chatGPTExporter = new EnhancedChatGPTExport()

// Helper function for quick export
export function exportToChatGPT(content, options = {}) {
  const exporter = new EnhancedChatGPTExport()
  
  // Track the world element
  exporter.addWorldElement(content)
  
  // Generate the export text
  const exportText = exporter.exportWorldBuildingContent(content, options)
  
  // Copy to clipboard
  navigator.clipboard.writeText(exportText).then(() => {
    // Success notification
    alert('Content prepared for ChatGPT and copied to clipboard!')
  }).catch(err => {
    console.error('Failed to copy:', err)
    alert('Failed to copy to clipboard. Please try again.')
  })
  
  return exportText
}