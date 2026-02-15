import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CharacterStats } from '../backend/types'
import { api } from '../services/api'

export interface PlayerCharacter {
  id: string
  name: string
  race: string
  class: string
  level: number
  currentHp: number
  maxHp: number
  stats: CharacterStats
  inventory: string[]
  gold: number
  experience: number
}

export const usePlayerStore = defineStore('player', () => {
  const currentPlayer = ref<PlayerCharacter | null>(null)
  const characters = ref<PlayerCharacter[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => currentPlayer.value !== null)
  
  const currentLevel = computed(() => currentPlayer.value?.level || 1)
  
  const currentHealth = computed(() => {
    if (!currentPlayer.value) return { current: 0, max: 0, percentage: 0 }
    const { currentHp, maxHp } = currentPlayer.value
    return {
      current: currentHp,
      max: maxHp,
      percentage: maxHp > 0 ? (currentHp / maxHp) * 100 : 0
    }
  })

  const canAct = computed(() => {
    return isAuthenticated.value && currentHealth.value.current > 0
  })

  function setCurrentPlayer(player: PlayerCharacter): void {
    currentPlayer.value = player
    localStorage.setItem('currentPlayer', JSON.stringify(player))
    if (!characters.value.some(c => c.id === player.id)) {
      characters.value.push(player)
    }
  }

  async function createCharacter(characterData: Omit<PlayerCharacter, 'id' | 'currentHp' | 'maxHp' | 'gold' | 'experience'>): Promise<PlayerCharacter> {
    isLoading.value = true
    error.value = null

    try {
      const baseHp = calculateBaseHp(characterData.class)
      const newCharacter: PlayerCharacter = {
        id: crypto.randomUUID(),
        ...characterData,
        currentHp: baseHp,
        maxHp: baseHp,
        gold: 100,
        experience: 0
      }
      
      const response = await api.createAndSetPlayer(newCharacter)
      if (response) {
        setCurrentPlayer(response)
        return response
      } else {
        setCurrentPlayer(newCharacter)
        return newCharacter
      }
    } catch (err) {
      console.error('Failed to create character:', err)
      error.value = 'Failed to create character'
      const baseHp = calculateBaseHp(characterData.class)
      const fallbackCharacter: PlayerCharacter = {
        id: crypto.randomUUID(),
        ...characterData,
        currentHp: baseHp,
        maxHp: baseHp,
        gold: 100,
        experience: 0
      }
      setCurrentPlayer(fallbackCharacter)
      return fallbackCharacter
    } finally {
      isLoading.value = false
    }
  }

  function updateCharacter(updates: Partial<PlayerCharacter>): void {
    if (!currentPlayer.value) return
    
    currentPlayer.value = {
      ...currentPlayer.value,
      ...updates
    }
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer.value))
  }

  function takeDamage(amount: number): void {
    if (!currentPlayer.value) return
    
    const newHp = Math.max(0, currentPlayer.value.currentHp - amount)
    updateCharacter({ currentHp: newHp })
  }

  function heal(amount: number): void {
    if (!currentPlayer.value) return
    
    const newHp = Math.min(currentPlayer.value.maxHp, currentPlayer.value.currentHp + amount)
    updateCharacter({ currentHp: newHp })
  }

  function addGold(amount: number): void {
    if (!currentPlayer.value) return
    
    updateCharacter({ gold: currentPlayer.value.gold + amount })
  }

  function removeGold(amount: number): void {
    if (!currentPlayer.value) return
    
    const newGold = Math.max(0, currentPlayer.value.gold - amount)
    updateCharacter({ gold: newGold })
  }

  function addExperience(amount: number): void {
    if (!currentPlayer.value) return
    
    const newExp = currentPlayer.value.experience + amount
    // TODO: Implement level up logic
    updateCharacter({ experience: newExp })
  }

  function addToInventory(item: string): void {
    if (!currentPlayer.value) return
    
    const newInventory = [...currentPlayer.value.inventory, item]
    updateCharacter({ inventory: newInventory })
  }

  function removeFromInventory(item: string): void {
    if (!currentPlayer.value) return
    
    const newInventory = currentPlayer.value.inventory.filter(i => i !== item)
    updateCharacter({ inventory: newInventory })
  }

  function clearPlayer(): void {
    currentPlayer.value = null
    isLoading.value = false
    error.value = null
    localStorage.removeItem('currentPlayer')
  }

  function calculateBaseHp(characterClass: string): number {
    const baseHpByClass: Record<string, number> = {
      'fighter': 12,
      'cleric': 10,
      'wizard': 8,
      'rogue': 10,
      'ranger': 11,
      'paladin': 12,
      'bard': 9,
      'monk': 10,
      'druid': 9,
      'sorcerer': 8
    }
    return baseHpByClass[characterClass] ?? 10
  }

  if (typeof window !== 'undefined') {
    const savedPlayer = localStorage.getItem('currentPlayer')
    if (savedPlayer) {
      try {
        currentPlayer.value = JSON.parse(savedPlayer)
      } catch {
        console.warn('Failed to parse saved player')
      }
    }
  }

  return {
    currentPlayer,
    characters,
    isLoading,
    error,
    isAuthenticated,
    currentLevel,
    currentHealth,
    canAct,
    setCurrentPlayer,
    createCharacter,
    updateCharacter,
    takeDamage,
    heal,
    addGold,
    removeGold,
    addExperience,
    addToInventory,
    removeFromInventory,
    clearPlayer
  }
})

  const canAct = computed(() => {
    return isAuthenticated.value && currentHealth.value.current > 0
  })

  // Actions
  function setCurrentPlayer(player: PlayerCharacter): void {
    currentPlayer.value = player
    // Save to localStorage
    localStorage.setItem('currentPlayer', JSON.stringify(player))
    // Add to characters list if not already present
    if (!characters.value.some(c => c.id === player.id)) {
      characters.value.push(player)
    }
  }

  async function createCharacter(characterData: Omit<PlayerCharacter, 'id' | 'currentHp' | 'maxHp' | 'gold' | 'experience'>): Promise<PlayerCharacter> {
    isLoading.value = true
    error.value = null

    try {
      const baseHp = calculateBaseHp(characterData.class)
      const newCharacter: PlayerCharacter = {
        id: crypto.randomUUID(),
        ...characterData,
        currentHp: baseHp,
        maxHp: baseHp,
        gold: 100,
        experience: 0
      }
      
      // Save to backend via API
      const response = await api.createAndSetPlayer(newCharacter)
      if (response) {
        setCurrentPlayer(response)
        return response
      } else {
        // Fallback to local storage if API fails
        setCurrentPlayer(newCharacter)
        return newCharacter
      }
    } catch (err) {
      console.error('Failed to create character:', err)
      error.value = 'Failed to create character'
      // Create locally as fallback
      const baseHp = calculateBaseHp(characterData.class)
      const fallbackCharacter: PlayerCharacter = {
        id: crypto.randomUUID(),
        ...characterData,
        currentHp: baseHp,
        maxHp: baseHp,
        gold: 100,
        experience: 0
      }
      setCurrentPlayer(fallbackCharacter)
      return fallbackCharacter
    } finally {
      isLoading.value = false
    }
  }

  function updateCharacter(updates: Partial<PlayerCharacter>): void {
    if (!currentPlayer.value) return
    
    currentPlayer.value = {
      ...currentPlayer.value,
      ...updates
    }
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer.value))
  }

  function takeDamage(amount: number): void {
    if (!currentPlayer.value) return
    
    const newHp = Math.max(0, currentPlayer.value.currentHp - amount)
    updateCharacter({ currentHp: newHp })
  }

  function heal(amount: number): void {
    if (!currentPlayer.value) return
    
    const newHp = Math.min(currentPlayer.value.maxHp, currentPlayer.value.currentHp + amount)
    updateCharacter({ currentHp: newHp })
  }

  function addGold(amount: number): void {
    if (!currentPlayer.value) return
    
    updateCharacter({ gold: currentPlayer.value.gold + amount })
  }

  function removeGold(amount: number): void {
    if (!currentPlayer.value) return
    
    const newGold = Math.max(0, currentPlayer.value.gold - amount)
    updateCharacter({ gold: newGold })
  }

  function addExperience(amount: number): void {
    if (!currentPlayer.value) return
    
    const newExp = currentPlayer.value.experience + amount
    // TODO: Implement level up logic
    updateCharacter({ experience: newExp })
  }

  function addToInventory(item: string): void {
    if (!currentPlayer.value) return
    
    const newInventory = [...currentPlayer.value.inventory, item]
    updateCharacter({ inventory: newInventory })
  }

  function removeFromInventory(item: string): void {
    if (!currentPlayer.value) return
    
    const newInventory = currentPlayer.value.inventory.filter(i => i !== item)
    updateCharacter({ inventory: newInventory })
  }

  function clearPlayer(): void {
    currentPlayer.value = null
    isLoading.value = false
    error.value = null
    localStorage.removeItem('currentPlayer')
  }

  // Helper functions
  function calculateBaseHp(characterClass: string): number {
    const baseHpByClass: Record<string, number> = {
      'fighter': 12,
      'cleric': 10,
      'wizard': 8,
      'rogue': 10,
      'ranger': 11,
      'paladin': 12,
      'bard': 9,
      'monk': 10,
      'druid': 9,
      'sorcerer': 8
    }
    return baseHpByClass[characterClass] ?? 10
  }

  // Initialize from localStorage on store creation
  if (typeof window !== 'undefined') {
    const savedPlayer = localStorage.getItem('currentPlayer')
    if (savedPlayer) {
      try {
        currentPlayer.value = JSON.parse(savedPlayer)
      } catch {
        console.warn('Failed to parse saved player')
      }
    }
  }

  return {
    // State
    currentPlayer,
    characters,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    currentLevel,
    currentHealth,
    canAct,
    
    // Actions
    setCurrentPlayer,
    createCharacter,
    updateCharacter,
    takeDamage,
    heal,
    addGold,
    removeGold,
    addExperience,
    addToInventory,
    removeFromInventory,
    clearPlayer
  }
})