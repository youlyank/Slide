'use client'

import { useState, useCallback } from 'react'

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useHistory<T>(initialPresent: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: []
  })

  const undo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState

      if (past.length === 0) {
        return currentState
      }

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      const newFuture = [present, ...future]

      return {
        past: newPast,
        present: previous,
        future: newFuture
      }
    })
  }, [])

  const redo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState

      if (future.length === 0) {
        return currentState
      }

      const next = future[0]
      const newPast = [...past, present]
      const newFuture = future.slice(1)

      return {
        past: newPast,
        present: next,
        future: newFuture
      }
    })
  }, [])

  const set = useCallback((newPresent: T) => {
    setState(currentState => {
      const { past, present } = currentState

      // Only add to history if the value actually changed
      if (present === newPresent) {
        return currentState
      }

      return {
        past: [...past, present],
        present: newPresent,
        future: []
      }
    })
  }, [])

  const reset = useCallback((newPresent: T) => {
    setState({
      past: [],
      present: newPresent,
      future: []
    })
  }, [])

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  return {
    state: state.present,
    setState: set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historySize: state.past.length + state.future.length + 1
  }
}