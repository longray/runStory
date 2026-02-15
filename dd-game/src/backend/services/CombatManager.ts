/**
 * Combat Manager
 * Manages turn-based combat with damage calculation and death handling
 */

import type { WorldState } from '../models/WorldState'
import type { NPC, NPCCreateData } from '../types'

export interface CombatSession {
  id: string
  participants: string[]
  locationId: string
  currentRound: number
  isActive: boolean
  startTime: number
  endTime?: number
}

export interface CombatAction {
  actorId: string
  targetId?: string
  type: 'attack' | 'defend' | 'spell' | 'item'
  damage?: number
}

export interface CombatResult {
  sessionId: string
  round: number
  actionsProcessed: number
}

export interface DamageResult {
  hit: boolean
  damage: number
  isCritical: boolean
  immunity: boolean
}

export interface AttackResult extends DamageResult {
  attackerId: string
  defenderId: string
  damageType: 'slashing' | 'piercing' | 'bludgeoning' | 'fire' | 'cold' | 'lightning' | 'thunder' | 'acid' | 'poison'
}

export interface CombatLogEntry {
  type: 'damage' | 'death'
  attackerId: string
  defenderId: string
  damage: number
  round: number
}

export interface CombatEndResult {
  sessionId: string
  victors: string[]
  survivors: string[]
  goldReward?: number
  experienceReward?: number
}

export class CombatManager {
  public readonly world: WorldState
  private sessions: Map<string, CombatSession> = new Map()
  private combatLogs: Map<string, CombatLogEntry[]> = new Map()
  private currentSessionId = 0

  constructor(world: WorldState) {
    this.world = world
  }

  // === Session Management ===

  initCombat(participantIds: string[], locationId: string): CombatSession | null {
    if (participantIds.length === 0) {
      return null
    }

    const session: CombatSession = {
      id: `combat-${this.currentSessionId++}-${crypto.randomUUID()}`,
      participants: participantIds,
      locationId,
      currentRound: 0,
      isActive: true,
      startTime: this.world.currentTime
    }

    this.sessions.set(session.id, session)
    return session
  }

  getSession(id: string): CombatSession | undefined {
    return this.sessions.get(id)
  }

  endCombat(sessionId: string, result: CombatEndResult): void {
    const session = this.sessions.get(sessionId)

    if (session) {
      session.isActive = false
      session.endTime = this.world.currentTime

      // Log combat end
      for (const participant of session.participants) {
        if (result.survivors.includes(participant)) {
          this.addLogEntry(sessionId, {
            type: 'death',
            attackerId: participant,
            defenderId: participant,
            damage: 0,
            round: session.currentRound
          })
        }
      }

      this.sessions.set(sessionId, session)
    }
  }

  // === Combat Execution ===

  executeRound(sessionId: string): CombatResult {
    const session = this.sessions.get(sessionId)

    if (!session || !session.isActive) {
      throw new Error('Cannot execute round: invalid or inactive session')
    }

    session.currentRound++

    // Process all participant actions
    const actionsProcessed = this.processParticipantActions(session)

    return {
      sessionId: session.id,
      round: session.currentRound,
      actionsProcessed
    }
  }

  private processParticipantActions(session: CombatSession): number {
    let processed = 0

    for (const participantId of session.participants) {
      const action = this.getParticipantAction(session, participantId)
      if (action) {
        this.executeAction(session, participantId, action)
        processed++
      }
    }

    return processed
  }

  private getParticipantAction(session: CombatSession, participantId: string): CombatAction | null {
    // For now, all participants auto-attack (can be extended with AI)
    const targets = session.participants.filter(p => p !== participantId)
    if (targets.length === 0) {
      return null
    }

    return {
      actorId: participantId,
      targetId: targets[Math.floor(Math.random() * targets.length)],
      type: 'attack'
    }
  }

  private executeAction(session: CombatSession, actorId: string, action: CombatAction): void {
    switch (action.type) {
      case 'attack':
        if (action.targetId) {
          this.resolveAttack(session.id, actorId, action.targetId, {
            attackRoll: Math.floor(Math.random() * 20) + 1
          })
        }
        break
      case 'defend':
        this.resolveDefend(session.id, actorId)
        break
      case 'spell':
        if (action.targetId) {
          this.resolveSpell(session.id, actorId, action.targetId)
        }
        break
      case 'item':
        if (action.targetId) {
          this.resolveItemUse(session.id, actorId, action.targetId)
        }
        break
    }
  }

  // === Damage Calculation ===

  resolveAttack(sessionId: string, attackerId: string, defenderId: string, params: {
    attackRoll: number
    damageBonus?: number
  }): DamageResult & AttackResult {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Combat session not found')
    }
    const attacker = this.getParticipant(session, attackerId)
    const defender = this.getParticipant(session, defenderId)

    if (!attacker || !defender) {
      throw new Error('Invalid attacker or defender ID')
    }

    const d20Roll = params.attackRoll ?? Math.floor(Math.random() * 20) + 1

    // Get defender AC from stats or equipment
    const defenderAC = this.getDefenderAC(defender)
    const hit = d20Roll >= defenderAC

    // Get damage type from weapon or attacker class
    const damageType = this.getDamageType(attacker)
    
    // Check for immunity
    const immunity = this.checkImmunity(defender, damageType)

    const damage = this.calculateDamage(attacker, hit, immunity, params.damageBonus, damageType)

    this.addLogEntry(sessionId, {
      type: 'damage',
      attackerId,
      defenderId,
      damage,
      round: session.currentRound
    })

    return {
      hit,
      damage,
      isCritical: hit && damage > 0 && !immunity,
      immunity,
      attackerId,
      defenderId,
      damageType
    }
  }

  private getDefenderAC(defender: NPC): number {
    // Calculate AC based on D&D 5e rules: 10 + Dexterity modifier + armor bonus
    // For now, use a reasonable default with some variation
    const baseAC = 10
    
    // If defender has stats, calculate dex modifier
    if ('stats' in defender && (defender as any).stats?.dexterity) {
      const dex = (defender as any).stats.dexterity
      const dexModifier = Math.floor((dex - 10) / 2)
      return baseAC + dexModifier
    }
    
    // Default AC based on class
    const classACBonuses: Record<string, number> = {
      'fighter': 2,
      'paladin': 2,
      'ranger': 1,
      'cleric': 1,
      'rogue': 1,
      'wizard': 0,
      'sorcerer': 0,
      'bard': 0,
      'druid': 0,
      'monk': 1
    }
    
    return baseAC + (classACBonuses[defender.class] ?? 0)
  }

  private getDamageType(attacker: NPC): 'slashing' | 'piercing' | 'bludgeoning' | 'fire' | 'cold' | 'lightning' | 'thunder' | 'acid' | 'poison' {
    // Get damage type from weapon or class
    const classDamageTypes: Record<string, ReturnType<CombatManager['getDamageType']>> = {
      'fighter': 'slashing',
      'paladin': 'slashing',
      'ranger': 'piercing',
      'rogue': 'piercing',
      'cleric': 'bludgeoning',
      'wizard': 'fire',
      'sorcerer': 'fire',
      'bard': 'thunder',
      'druid': 'poison',
      'monk': 'bludgeoning'
    }
    
    return classDamageTypes[attacker.class] ?? 'slashing'
  }

  private checkImmunity(npc: NPC, damageType: string): boolean {
    // Check for immunities in npc properties
    if ('immunities' in npc && Array.isArray((npc as any).immunities)) {
      return (npc as any).immunities.includes(damageType)
    }
    
    // Default immunities by race
    const raceImmunities: Record<string, string[]> = {
      'dragonborn': ['fire'],
      'tiefling': ['fire'],
      'dwarf': ['poison'],
      'elf': ['sleep']
    }
    
    return (raceImmunities[npc.race] ?? []).includes(damageType)
  }

  private calculateDamage(attacker: NPC, hit: boolean, immunity: boolean, bonus?: number, damageType?: string): number {
    if (!hit || immunity) {
      return 0
    }

    // Get base damage from weapon or class
    const baseDamage = this.getBaseDamage(attacker, damageType)
    
    // Apply bonus
    const totalDamage = baseDamage + (bonus ?? 0)
    
    return totalDamage
  }

  private getBaseDamage(attacker: NPC, damageType?: string): number {
    // Base damage dice by class (D&D 5e standard)
    const classDamageDice: Record<string, number> = {
      'fighter': 8, // d8
      'paladin': 8,
      'ranger': 8,
      'rogue': 6, // d6 with sneak attack bonus
      'cleric': 6,
      'wizard': 4, // d4 cantrip
      'sorcerer': 4,
      'bard': 6,
      'druid': 6,
      'monk': 6
    }
    
    // Roll the damage die
    const dieSize = classDamageDice[attacker.class] ?? 6
    const baseDamage = Math.floor(Math.random() * dieSize) + 1
    
    // Add ability modifier
    if ('stats' in attacker && (attacker as any).stats) {
      const stats = (attacker as any).stats
      let abilityModifier = 0
      
      // Use strength for melee, dexterity for ranged/finesse
      if (damageType === 'piercing' || damageType === 'fire' || damageType === 'lightning' || damageType === 'thunder') {
        // Ranged/finesse/spell attacks use dexterity or intelligence
        abilityModifier = Math.floor((stats.dexterity - 10) / 2) || Math.floor((stats.intelligence - 10) / 2)
      } else {
        // Melee attacks use strength
        abilityModifier = Math.floor((stats.strength - 10) / 2)
      }
      
      return Math.max(1, baseDamage + abilityModifier)
    }
    
    return baseDamage
  }

  resolveDefend(sessionId: string, defenderId: string): void {
    // Implement defend action - could grant temporary HP or advantage on next defense
    const session = this.sessions.get(sessionId)
    if (!session) return
    
    const defender = this.getParticipant(session, defenderId)
    if (!defender) return
    
    // For now, just log the defend action
    this.addLogEntry(sessionId, {
      type: 'damage',
      attackerId: defenderId,
      defenderId: defenderId,
      damage: 0,
      round: session.currentRound
    })
  }

  resolveSpell(sessionId: string, casterId: string, targetId: string): void {
    // Implement basic spell resolution
    const session = this.sessions.get(sessionId)
    if (!session) return
    
    const caster = this.getParticipant(session, casterId)
    const target = this.getParticipant(session, targetId)
    if (!caster || !target) return
    
    // Simple spell: fire bolt equivalent
    const spellDamage = Math.floor(Math.random() * 10) + 1 // 1d10
    this.applyDamage(sessionId, targetId, spellDamage)
    
    this.addLogEntry(sessionId, {
      type: 'damage',
      attackerId: casterId,
      defenderId: targetId,
      damage: spellDamage,
      round: session.currentRound
    })
  }

  resolveItemUse(sessionId: string, userId: string, targetId: string): void {
    // Implement basic item usage (healing potion, etc.)
    const session = this.sessions.get(sessionId)
    if (!session) return
    
    const user = this.getParticipant(session, userId)
    const target = this.getParticipant(session, targetId)
    if (!user || !target) return
    
    // Assume healing potion for now
    const healAmount = 10
    target.currentHp = Math.min(target.maxHp, (target.currentHp ?? target.maxHp) + healAmount)
    
    this.addLogEntry(sessionId, {
      type: 'damage',
      attackerId: userId,
      defenderId: targetId,
      damage: -healAmount, // Negative damage = healing
      round: session.currentRound
    })
  }

  applyDamage(sessionId: string, targetId: string, damage: number): void {
    const session = this.sessions.get(sessionId)
    if (!session) return
    const target = this.getParticipant(session, targetId)

    if (target) {
      // Apply damage to current/max HP
      target.currentHp = Math.max(0, (target.currentHp ?? target.maxHp) - damage)

      // Check for death
      if (target.currentHp === 0) {
        // Mark as dead - remove from active combat
        this.addLogEntry(sessionId, {
          type: 'death',
          attackerId: targetId,
          defenderId: targetId,
          damage: 0,
          round: session.currentRound
        })

        // Don't end session yet - let endCombat handle it
      }
    }
  }

  // === Death Handling ===

  private getParticipant(session: CombatSession, participantId: string): NPC | null {
    // Get from world state
    return this.world.getNPC(participantId)
  }

  // === Combat Logging ===

  addLogEntry(sessionId: string, entry: CombatLogEntry): void {
    const logs = this.combatLogs.get(sessionId) ?? []
    logs.push(entry)
    this.combatLogs.set(sessionId, logs)
  }

  getCombatLog(sessionId: string): CombatLogEntry[] {
    return this.combatLogs.get(sessionId) ?? []
  }

  // === Economy Integration ===


  // === NPC Management (for creating combat NPCs) ===

  createNPC(data: NPCCreateData): NPC {
    const npc: NPC = {
      id: `npc-${crypto.randomUUID()}`,
      ...data,
      level: 1,
      currentHp: this.calculateBaseHp(data.class),
      maxHp: this.calculateBaseHp(data.class),
      disposition: 'hostile' as const,
      locationId: undefined as const,
      memories: []
    }

    this.world.addNPC(npc)
    return npc
  }

  addNPC(npc: NPC): void {
    this.world.addNPC(npc)
  }

  private calculateBaseHp(characterClass: string): number {
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
}
