export class ContentFormatter {
  formatForExport(messages) {
    let output = '# RPG Narrator Session Log\n\n'
    output += `**Date:** ${new Date().toLocaleString()}\n\n`
    output += '---\n\n'
    
    messages.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString()
      const role = msg.role === 'user' ? 'Player' : 'GM'
      
      output += `**[${time}] ${role}:**\n`
      output += `${msg.content}\n\n`
    })
    
    return output
  }
  
  formatForWebChat(data) {
    let output = '## 🎲 RPG Narrator Context Transfer\n\n'
    
    if (data.character) {
      output += `### Character Information\n`
      output += `**Name:** ${data.character.name}\n`
      output += `**Level:** ${data.character.level}\n`
      output += `**Classes:** ${data.character.classes}\n`
      output += `**HP:** ${data.character.hp}\n`
      output += `**AC:** ${data.character.ac}\n\n`
    }
    
    if (data.narrative && data.narrative.length > 0) {
      output += `### Recent Narrative\n`
      data.narrative.forEach(msg => {
        const role = msg.role === 'user' ? '🧙‍♂️ Player' : '📖 GM'
        output += `**${role}:** ${msg.content}\n\n`
      })
    }
    
    if (data.context) {
      output += `### Current Context\n`
      output += `${JSON.stringify(data.context, null, 2)}\n\n`
    }
    
    output += '---\n'
    output += `*Transferred at ${new Date().toLocaleString()}*`
    
    return output
  }
  
  formatDiceResult(result) {
    let output = `🎲 **${result.expression}**\n`
    
    if (result.rolls) {
      output += `Rolls: [${result.rolls.join(', ')}]`
      if (result.modifier !== 0) {
        output += ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}`
      }
      output += '\n'
    }
    
    output += `**Total: ${result.total}**`
    
    if (result.isNatural20) {
      output += ' 🎯 **NATURAL 20!**'
    } else if (result.isNatural1) {
      output += ' 💥 **NATURAL 1!**'
    }
    
    return output
  }
}