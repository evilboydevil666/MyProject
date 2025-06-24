import { ref, computed } from 'vue'

export function useAIPredictor() {
  // Predictions state
  const predictions = ref([])
  const isGenerating = ref(false)
  
  // Check if predictions are available
  const predictionsAvailable = computed(() => predictions.value.length > 0)
  
  // Generate predictions based on context
  async function generatePredictions(characterContext, recentMessages) {
    if (isGenerating.value) return
    
    isGenerating.value = true
    predictions.value = []
    
    try {
      // For now, generate some static predictions
      // In a real implementation, this would call an AI API
      const basePredictions = []
      
      // Combat predictions
      if (characterContext.currentHp < characterContext.maxHp) {
        basePredictions.push({
          id: 'heal',
          text: 'I drink a healing potion',
          type: 'action',
          confidence: 0.8
        })
      }
      
      // Context-based predictions
      const lastMessage = recentMessages[recentMessages.length - 1]
      if (lastMessage?.content.toLowerCase().includes('door')) {
        basePredictions.push(
          {
            id: 'check-door',
            text: 'I check the door for traps',
            type: 'action',
            confidence: 0.9
          },
          {
            id: 'open-door',
            text: 'I carefully open the door',
            type: 'action',
            confidence: 0.7
          },
          {
            id: 'listen-door',
            text: 'I listen at the door',
            type: 'action',
            confidence: 0.8
          }
        )
      }
      
      // General predictions
      if (basePredictions.length === 0) {
        basePredictions.push(
          {
            id: 'look-around',
            text: 'I look around the area',
            type: 'action',
            confidence: 0.7
          },
          {
            id: 'move-forward',
            text: 'I move forward cautiously',
            type: 'action',
            confidence: 0.6
          },
          {
            id: 'ready-weapon',
            text: 'I ready my weapon',
            type: 'action',
            confidence: 0.5
          }
        )
      }
      
      // Sort by confidence and take top 3
      predictions.value = basePredictions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
      
    } catch (error) {
      console.error('Failed to generate predictions:', error)
    } finally {
      isGenerating.value = false
    }
  }
  
  // Clear all predictions
  function clearPredictions() {
    predictions.value = []
  }
  
  return {
    predictions,
    predictionsAvailable,
    isGenerating,
    generatePredictions,
    clearPredictions
  }
}