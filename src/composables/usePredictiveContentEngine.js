// src/composables/usePredictiveContentEngine.js
import { ref, computed } from 'vue'
import PredictiveContentEngine from '../utils/PredictiveContentEngine'

let engine = null

export function usePredictiveContentEngine() {
  const isGenerating = ref(false)
  const predictions = ref([])
  const preGeneratedContent = ref(new Map())
  const analytics = ref({})
  
  // Initialize engine if not already created
  if (!engine) {
    engine = new PredictiveContentEngine()
  }
  
  // Generate suggestions based on context
  async function generateSuggestions(options) {
    const { context, limit = 3 } = options
    isGenerating.value = true
    
    try {
      // Check for pre-generated content first
      const cached = getPreGeneratedSuggestions(context.type)
      if (cached.length > 0) {
        return cached.slice(0, limit)
      }
      
      // Generate new suggestions
      const suggestions = await engine.generateInputSuggestions({
        partialInput: context.currentInput || '',
        context: context.narrative || '',
        characterContext: context.character
      })
      
      // Transform to expected format
      return suggestions.map((text, index) => ({
        id: `suggestion_${Date.now()}_${index}`,
        text: text,
        type: 'action',
        confidence: 0.7 + (index * 0.1), // Higher confidence for earlier suggestions
        source: 'ai'
      }))
      
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
      return getFallbackSuggestions(context)
    } finally {
      isGenerating.value = false
    }
  }
  
  // Get pre-generated suggestions
  function getPreGeneratedSuggestions(type) {
    const content = engine.getPreGeneratedContent(type)
    if (!content) return []
    
    // Transform pre-generated content to suggestions
    if (Array.isArray(content)) {
      return content.map(item => ({
        id: `pre_${Date.now()}_${Math.random()}`,
        text: item.description || item.name,
        type: type,
        confidence: 0.8,
        source: 'pre-generated'
      }))
    }
    
    return []
  }
  
  // Fallback suggestions when AI is unavailable
  function getFallbackSuggestions(context) {
    const suggestions = []
    
    // Combat fallbacks
    if (context.inCombat) {
      suggestions.push(
        { id: 'fb_1', text: 'I attack with my weapon', type: 'action', confidence: 0.6 },
        { id: 'fb_2', text: 'I move to a better position', type: 'action', confidence: 0.5 },
        { id: 'fb_3', text: 'I defend myself', type: 'action', confidence: 0.4 }
      )
    }
    
    // Exploration fallbacks
    else if (context.lastNarrativeContains && context.lastNarrativeContains(['room', 'area', 'chamber'])) {
      suggestions.push(
        { id: 'fb_4', text: 'I search the area carefully', type: 'action', confidence: 0.6 },
        { id: 'fb_5', text: 'I examine my surroundings', type: 'action', confidence: 0.5 },
        { id: 'fb_6', text: 'I listen for any sounds', type: 'action', confidence: 0.4 }
      )
    }
    
    // Generic fallbacks
    else {
      suggestions.push(
        { id: 'fb_7', text: 'I look around', type: 'action', confidence: 0.5 },
        { id: 'fb_8', text: 'I proceed cautiously', type: 'action', confidence: 0.4 },
        { id: 'fb_9', text: 'I ready myself', type: 'action', confidence: 0.3 }
      )
    }
    
    return suggestions
  }
  
  // Predict next content needs
  async function predictNextContent(options) {
    try {
      const predictions = await engine.predictNextContent(options)
      return predictions
    } catch (error) {
      console.error('Content prediction failed:', error)
      return []
    }
  }
  
  // Start background content generation
  function startBackgroundGeneration() {
    engine.startPredictiveGeneration()
  }
  
  // Stop background generation
  function stopBackgroundGeneration() {
    engine.stopPredictiveGeneration()
  }
  
  // Get analytics
  function getAnalytics() {
    analytics.value = engine.getPredictionAnalytics()
    return analytics.value
  }
  
  // Cleanup old content
  function cleanup() {
    engine.cleanup()
  }
  
  return {
    isGenerating,
    predictions,
    generateSuggestions,
    predictNextContent,
    startBackgroundGeneration,
    stopBackgroundGeneration,
    getAnalytics,
    cleanup
  }
}