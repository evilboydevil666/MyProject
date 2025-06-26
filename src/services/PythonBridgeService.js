// src/services/PythonBridgeService.js
export class PythonBridgeService {
  constructor() {
    this.baseURL = import.meta.env.VITE_PYTHON_API || 'http://localhost:8000';
    this.isConnected = false;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      this.isConnected = data.status === 'healthy';
      console.log('🐍 Python Backend Status:', this.isConnected ? 'Connected' : 'Disconnected');
      return this.isConnected;
    } catch (error) {
      console.warn('Python backend not available:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  async optimizePrompt(prompt, context = {}) {
    if (!this.isConnected) {
      console.warn('Python backend not connected, returning original prompt');
      return { optimizedPrompt: prompt, optimized: false };
    }

    try {
      const response = await fetch(`${this.baseURL}/api/chatgpt/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: {
            character: context.character || null,
            location: context.location || 'Unknown',
            sessionNotes: context.sessionNotes || '',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        // If endpoint doesn't exist yet, return original
        if (response.status === 404) {
          console.log('Optimize endpoint not implemented yet, using fallback');
          return { optimizedPrompt: prompt, optimized: false };
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        optimizedPrompt: data.optimizedPrompt || prompt,
        tokenCount: data.tokenCount || 0,
        optimized: true
      };
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      return { optimizedPrompt: prompt, optimized: false };
    }
  }

  async parseResponse(response) {
    if (!this.isConnected) {
      return { parsed: false, content: response };
    }

    try {
      const result = await fetch(`${this.baseURL}/api/chatgpt/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response })
      });

      if (!result.ok) {
        if (result.status === 404) {
          return { parsed: false, content: response };
        }
        throw new Error(`HTTP ${result.status}`);
      }

      return await result.json();
    } catch (error) {
      console.error('Response parsing failed:', error);
      return { parsed: false, content: response };
    }
  }

  // Test method for Phase 2
  async testConnection() {
    try {
      const health = await this.checkHealth();
      const testResult = await fetch(`${this.baseURL}/api/test`).then(r => r.json());
      
      return {
        connected: true,
        health,
        test: testResult,
        baseURL: this.baseURL
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        baseURL: this.baseURL
      };
    }
  }
}

// Create a singleton instance
let instance = null;

export function getPythonBridge() {
  if (!instance) {
    instance = new PythonBridgeService();
  }
  return instance;
}