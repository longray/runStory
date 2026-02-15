import { ref } from 'vue'
import type { WorldStateData } from '../backend/models/WorldState'
import type { WorldEvent } from '../backend/types'
import type { PlayerCharacter } from '../stores/playerStore'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string
  private isLoading = ref(false)
  private error = ref<string | null>(null)

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }

  get isLoadingState() {
    return this.isLoading.value
  }

  get errorState() {
    return this.error.value
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    this.isLoading.value = true
    this.error.value = null

    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      this.error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      this.isLoading.value = false
    }
  }

  // World API
  async getWorldState(): Promise<ApiResponse<WorldStateData>> {
    return this.request('/api/world')
  }

  // Events API
  async injectEvent(event: WorldEvent): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(event)
    })
  }

  // Players API
  async createPlayer(player: Omit<PlayerCharacter, 'id'>): Promise<ApiResponse<PlayerCharacter>> {
    return this.request('/api/players', {
      method: 'POST',
      body: JSON.stringify(player)
    })
  }

  async getPlayer(playerId: string): Promise<ApiResponse<PlayerCharacter>> {
    return this.request(`/api/players/${playerId}`)
  }

  // Utility methods for store integration
  async initializeWorld(): Promise<WorldStateData | null> {
    const response = await this.getWorldState()
    if (response.success && response.data) {
      return response.data
    }
    return null
  }

  async createAndSetPlayer(player: Omit<PlayerCharacter, 'id'>): Promise<PlayerCharacter | null> {
    const response = await this.createPlayer(player)
    if (response.success && response.data) {
      return response.data
    }
    return null
  }
}

// Create a singleton instance
export const api = new ApiClient()

// Helper composable for Vue components
export function useApi() {
  return {
    api,
    isLoading: api.isLoadingState,
    error: api.errorState
  }
}