import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WorldEvent, WorldLocation, NPC } from '../backend/types'
import type { WorldStateData } from '../backend/models/WorldState'

export interface WorldState {
  id: string
  name: string
  locations: WorldLocation[]
  activeEvents: WorldEvent[]
  eventHistory: WorldEvent[]
  currentTime: number
  version: number
}

export const useWorldStore = defineStore('world', () => {
  const worldState = ref<WorldState | null>(null)
  const npcs = ref<NPC[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentLocation = computed(() => {
    if (!worldState.value) return null
    return worldState.value.locations[0] || null
  })

  const activeEvents = computed(() => {
    return worldState.value?.activeEvents || []
  })

  const recentEvents = computed(() => {
    if (!worldState.value) return []
    return worldState.value.eventHistory.slice(-10)
  })

  const currentTime = computed(() => {
    return worldState.value?.currentTime || 0
  })

  const isDayTime = computed(() => {
    if (!worldState.value) return true
    const hour = Math.floor(worldState.value.currentTime / 60) % 24
    return hour >= 6 && hour < 18
  })

  function setWorldState(state: WorldStateData): void {
    worldState.value = state
  }

  function updateWorldState(updates: Partial<WorldState>): void {
    if (!worldState.value) return
    
    worldState.value = {
      ...worldState.value,
      ...updates
    }
  }

  function addLocation(location: WorldLocation): void {
    if (!worldState.value) return
    
    const newLocations = [...worldState.value.locations, location]
    updateWorldState({ locations: newLocations })
  }

  function updateLocation(id: string, updates: Partial<WorldLocation>): void {
    if (!worldState.value) return
    
    const newLocations = worldState.value.locations.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    )
    updateWorldState({ locations: newLocations })
  }

  function addEvent(event: WorldEvent): void {
    if (!worldState.value) return
    
    const newActiveEvents = [...worldState.value.activeEvents, event]
    updateWorldState({ activeEvents: newActiveEvents })
  }

  function resolveEvent(eventId: string): void {
    if (!worldState.value) return
    
    const eventIndex = worldState.value.activeEvents.findIndex(e => e.id === eventId)
    if (eventIndex === -1) return
    
    const resolvedEvent = { ...worldState.value.activeEvents[eventIndex], resolved: true }
    const newActiveEvents = worldState.value.activeEvents.filter((_, i) => i !== eventIndex)
    const newEventHistory = [...worldState.value.eventHistory, resolvedEvent]
    
    updateWorldState({ 
      activeEvents: newActiveEvents, 
      eventHistory: newEventHistory 
    })
  }

  function setNpcs(newNpcs: NPC[]): void {
    npcs.value = newNpcs
  }

  function addNpc(npc: NPC): void {
    npcs.value = [...npcs.value, npc]
  }

  function updateNpc(id: string, updates: Partial<NPC>): void {
    npcs.value = npcs.value.map(npc => 
      npc.id === id ? { ...npc, ...updates } : npc
    )
  }

  function getNpcById(id: string): NPC | undefined {
    return npcs.value.find(npc => npc.id === id)
  }

  function getNpcsByLocation(locationId: string): NPC[] {
    return npcs.value.filter(npc => npc.locationId === locationId)
  }

  function getNpcsByDisposition(disposition: 'friendly' | 'neutral' | 'hostile'): NPC[] {
    return npcs.value.filter(npc => npc.disposition === disposition)
  }

  function clearWorld(): void {
    worldState.value = null
    npcs.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    worldState,
    npcs,
    isLoading,
    error,
    currentLocation,
    activeEvents,
    recentEvents,
    currentTime,
    isDayTime,
    setWorldState,
    updateWorldState,
    addLocation,
    updateLocation,
    addEvent,
    resolveEvent,
    setNpcs,
    addNpc,
    updateNpc,
    getNpcById,
    getNpcsByLocation,
    getNpcsByDisposition,
    clearWorld
  }
})