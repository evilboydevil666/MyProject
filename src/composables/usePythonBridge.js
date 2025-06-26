// src/composables/usePythonBridge.js
import { ref, onMounted, computed } from 'vue';
import { getPythonBridge } from '@/services/PythonBridgeService';

export function usePythonBridge() {
  const bridge = getPythonBridge();
  const isConnected = ref(false);
  const isLoading = ref(false);
  const lastError = ref(null);
  const stats = ref({
    promptsOptimized: 0,
    responseParsed: 0,
    totalTokensSaved: 0
  });

  onMounted(async () => {
    isLoading.value = true;
    try {
      isConnected.value = await bridge.checkConnection();
      if (isConnected.value) {
        console.log('✅ Python bridge initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Python bridge:', error);
      lastError.value = error.message;
    } finally {
      isLoading.value = false;
    }
  });

  const optimizePrompt = async (prompt, context = {}) => {
    if (!isConnected.value) {
      console.log('Python not connected, using original prompt');
      return prompt;
    }

    isLoading.value = true;
    lastError.value = null;

    try {
      const result = await bridge.optimizePrompt(prompt, context);
      
      if (result.optimized) {
        stats.value.promptsOptimized++;
        if (result.tokenCount) {
          const estimatedOriginalTokens = prompt.length / 4; // rough estimate
          const saved = Math.max(0, estimatedOriginalTokens - result.tokenCount);
          stats.value.totalTokensSaved += saved;
        }
        console.log('✨ Prompt optimized by Python backend');
      }
      
      return result.optimizedPrompt;
    } catch (error) {
      console.error('Prompt optimization error:', error);
      lastError.value = error.message;
      return prompt; // Return original on error
    } finally {
      isLoading.value = false;
    }
  };

  const parseResponse = async (response) => {
    if (!isConnected.value) {
      return { content: response, parsed: false };
    }

    isLoading.value = true;
    lastError.value = null;

    try {
      const result = await bridge.parseResponse(response);
      if (result.parsed) {
        stats.value.responseParsed++;
        console.log('📋 Response parsed by Python backend');
      }
      return result;
    } catch (error) {
      console.error('Response parsing error:', error);
      lastError.value = error.message;
      return { content: response, parsed: false };
    } finally {
      isLoading.value = false;
    }
  };

  const testConnection = async () => {
    isLoading.value = true;
    try {
      const result = await bridge.testConnection();
      isConnected.value = result.connected;
      return result;
    } catch (error) {
      isConnected.value = false;
      lastError.value = error.message;
      return { connected: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Computed for UI
  const statusMessage = computed(() => {
    if (isLoading.value) return 'Connecting to Python backend...';
    if (isConnected.value) return 'Python backend connected';
    if (lastError.value) return `Python error: ${lastError.value}`;
    return 'Python backend disconnected';
  });

  const statusColor = computed(() => {
    if (isLoading.value) return 'text-yellow-500';
    if (isConnected.value) return 'text-green-500';
    return 'text-red-500';
  });

  return {
    // State
    isConnected,
    isLoading,
    lastError,
    stats,
    statusMessage,
    statusColor,
    
    // Methods
    optimizePrompt,
    parseResponse,
    testConnection,
    checkConnection: () => bridge.checkConnection()
  };
}