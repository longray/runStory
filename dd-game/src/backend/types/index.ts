/**
 * Backend Type Definitions
 * Shared types for frontend-backend communication
 */

// Game Entities
export interface Character {
  id: string
  name: string
  class: string
  level: number
  stats: CharacterStats
  inventory: string[]
}

export interface CharacterStats {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface NPCMemory {
  type: 'interaction' | 'combat' | 'quest' | 'observation'
  description: string
  timestamp: number
}

export interface NPC {
  id: string
  name: string
  race: string
  class: string
  level: number
  currentHp: number
  maxHp: number
  disposition?: 'friendly' | 'neutral' | 'hostile'
  locationId?: string
  memories: NPCMemory[]
}

export interface NPCCreateData {
  name: string
  race: string
  class: string
  level?: number
  disposition?: 'friendly' | 'neutral' | 'hostile'
}

export interface WorldEvent {
  id: string
  type: 'combat' | 'social' | 'quest' | 'economy' | 'exploration'
  location: string
  timestamp: number
  participants: string[]
  outcomes: Record<string, unknown>
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// WebSocket Events
export interface WSMessage {
  type: string
  payload: unknown
}

export interface WSEventMap {
  'world:update': { events: WorldEvent[] }
  'character:update': { character: Character }
  'combat:start': { combatId: string; participants: string[] }
}

// Quest System Types
export interface QuestObjective {
  type: 'collect' | 'defeat' | 'escort' | 'discover'
  target: string
  destination?: string
  required: number
  current: number
  completed: boolean
}

export interface Quest {
  id: string
  type: 'fetch' | 'kill' | 'escort' | 'discover'
  title: string
  description: string
  giverId: string
  playerId?: string
  status: 'available' | 'active' | 'completed' | 'rewarded' | 'failed'
  difficulty: number
  objectives: QuestObjective[]
  rewardGold: number
  rewardXp: number
  createdAt: number
  completedAt?: number
}
