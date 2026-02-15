/**
 * World Event Manager
 * Manages world events that persist and impact the world
 */

import type { WorldState } from '../models/WorldState'
import type { WorldEvent, WorldEventType } from '../types'

export interface CombatEventData {
  locationId: string
  description: string
  enemies: string[]
}

export interface QuestEventData {
  locationId: string
  description: string
  questGiverId: string
  reward: { gold: number, experience: number }
}

export interface SocialEventData {
  locationId: string
  description: string
  participants: string[]
  mood: 'friendly' | 'neutral' | 'hostile'
}

export interface EventOutcome {
  outcome: string
  casualties?: number
  loot?: { gold: number, items?: string[] }
}

export class WorldEventManager {
  public readonly world: WorldState
  public pendingEvents: WorldEvent[] = []

  constructor(world: WorldState) {
    this.world = world
  }

  createCombatEvent(data: CombatEventData): WorldEvent {
    return {
      id: `event-${crypto.randomUUID()}`,
      type: 'combat' as WorldEventType,
      description: data.description,
      locationId: data.locationId,
      timestamp: this.world.currentTime,
      resolved: false
    }
  }

  createQuestEvent(data: QuestEventData): WorldEvent {
    return {
      id: `event-${crypto.randomUUID()}`,
      type: 'quest' as WorldEventType,
      description: data.description,
      locationId: data.locationId,
      timestamp: this.world.currentTime,
      resolved: false
    }
  }

  createSocialEvent(data: SocialEventData): WorldEvent {
    return {
      id: `event-${crypto.randomUUID()}`,
      type: 'social' as WorldEventType,
      description: data.description,
      locationId: data.locationId,
      timestamp: this.world.currentTime,
      resolved: false
    }
  }

  addEvent(event: WorldEvent): void {
    this.world.addEvent(event)
  }

  resolveEvent(eventId: string, _outcome: EventOutcome): void {
    this.world.resolveEvent(eventId)
  }

  getActiveEvents(locationId?: string): WorldEvent[] {
    if (!locationId) return this.world.activeEvents
    return this.world.activeEvents.filter(e => e.locationId === locationId)
  }

  getActiveEventsByType(type: WorldEventType): WorldEvent[] {
    return this.world.activeEvents.filter(e => e.type === type)
  }

  toJSON(): { world: WorldStateData, pendingEvents: WorldEvent[] } {
    return {
      world: this.world.toJSON(),
      pendingEvents: this.pendingEvents
    }
  }
}
