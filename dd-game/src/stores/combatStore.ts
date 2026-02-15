import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CombatParticipant, CombatState } from '../components/CombatUI.vue'

export interface CombatSession {
  id: string
  participants: CombatParticipant[]
  currentRound: number
  currentTurn: string
  combatState: CombatState
  combatLog: string[]
}

export const useCombatStore = defineStore('combat', () => {
  const currentSession = ref<CombatSession | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const participants = computed(() => {
    return currentSession.value?.participants || []
  })

  const playerTeam = computed(() => {
    return participants.value.filter(p => p.team === 'player')
  })

  const enemyTeam = computed(() => {
    return participants.value.filter(p => p.team === 'enemy')
  })

  const currentRound = computed(() => {
    return currentSession.value?.currentRound || 1
  })

  const currentTurn = computed(() => {
    return currentSession.value?.currentTurn || 'player'
  })

  const combatState = computed(() => {
    return currentSession.value?.combatState || 'active'
  })

  const combatLog = computed(() => {
    return currentSession.value?.combatLog || []
  })

  const isPlayerTurn = computed(() => {
    return currentTurn.value === 'player'
  })

  const canAct = computed(() => {
    return isPlayerTurn.value && combatState.value === 'active'
  })

  const combatResult = computed(() => {
    switch (combatState.value) {
      case 'victory':
        return { title: '胜利！', message: '你赢得了战斗！', class: 'victory' }
      case 'defeat':
        return { title: '失败...', message: '你被打败了。', class: 'defeat' }
      case 'fled':
        return { title: '逃跑', message: '你成功逃脱了。', class: 'fled' }
      default:
        return null
    }
  })

  function startCombat(session: Omit<CombatSession, 'id'>): void {
    currentSession.value = {
      id: crypto.randomUUID(),
      ...session
    }
  }

  function updateSession(updates: Partial<CombatSession>): void {
    if (!currentSession.value) return
    
    currentSession.value = {
      ...currentSession.value,
      ...updates
    }
  }

  function addLogEntry(entry: string): void {
    if (!currentSession.value) return
    
    const newLog = [...currentSession.value.combatLog, entry]
    updateSession({ combatLog: newLog })
  }

  function setParticipants(participants: CombatParticipant[]): void {
    if (!currentSession.value) return
    
    updateSession({ participants })
  }

  function addParticipant(participant: CombatParticipant): void {
    if (!currentSession.value) return
    
    const newParticipants = [...currentSession.value.participants, participant]
    updateSession({ participants: newParticipants })
  }

  function removeParticipant(participantId: string): void {
    if (!currentSession.value) return
    
    const newParticipants = currentSession.value.participants.filter(p => p.id !== participantId)
    updateSession({ participants: newParticipants })
  }

  function updateParticipant(participantId: string, updates: Partial<CombatParticipant>): void {
    if (!currentSession.value) return
    
    const newParticipants = currentSession.value.participants.map(p => 
      p.id === participantId ? { ...p, ...updates } : p
    )
    updateSession({ participants: newParticipants })
  }

  function setCurrentTurn(turn: string): void {
    if (!currentSession.value) return
    
    updateSession({ currentTurn: turn })
  }

  function advanceRound(): void {
    if (!currentSession.value) return
    
    updateSession({ currentRound: currentSession.value.currentRound + 1 })
  }

  function setCombatState(state: CombatState): void {
    if (!currentSession.value) return
    
    updateSession({ combatState: state })
  }

  function endCombat(result: CombatState): void {
    if (!currentSession.value) return
    
    setCombatState(result)
  }

  function clearCombat(): void {
    currentSession.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    currentSession,
    isLoading,
    error,
    participants,
    playerTeam,
    enemyTeam,
    currentRound,
    currentTurn,
    combatState,
    combatLog,
    isPlayerTurn,
    canAct,
    combatResult,
    startCombat,
    updateSession,
    addLogEntry,
    setParticipants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    setCurrentTurn,
    advanceRound,
    setCombatState,
    endCombat,
    clearCombat
  }
})