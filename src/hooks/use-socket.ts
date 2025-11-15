'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  autoConnect?: boolean
}

export const useSocket = (options: UseSocketOptions = { autoConnect: true }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!options.autoConnect) return

    const socket = io('/api/socket/io', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to socket server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setIsConnected(false)
    })

    socket.on('user-joined', (data: { activeUsers: string[] }) => {
      setActiveUsers(data.activeUsers)
    })

    socket.on('user-left', (data: { activeUsers: string[] }) => {
      setActiveUsers(data.activeUsers)
    })

    return () => {
      socket.disconnect()
    }
  }, [options.autoConnect])

  const joinPresentation = (presentationId: string) => {
    socketRef.current?.emit('join-presentation', presentationId)
  }

  const leavePresentation = (presentationId: string) => {
    socketRef.current?.emit('leave-presentation', presentationId)
  }

  const emitSlideUpdate = (presentationId: string, slide: any) => {
    socketRef.current?.emit('slide-update', { presentationId, slide })
  }

  const emitSlideAdd = (presentationId: string, slide: any) => {
    socketRef.current?.emit('slide-add', { presentationId, slide })
  }

  const emitSlideDelete = (presentationId: string, slideId: string) => {
    socketRef.current?.emit('slide-delete', { presentationId, slideId })
  }

  const emitPresentationUpdate = (presentationId: string, presentation: any) => {
    socketRef.current?.emit('presentation-update', { presentationId, presentation })
  }

  const emitCursorMove = (presentationId: string, position: any) => {
    socketRef.current?.emit('cursor-move', { presentationId, position })
  }

  const emitTypingStart = (presentationId: string, slideId: string) => {
    socketRef.current?.emit('typing-start', { presentationId, slideId })
  }

  const emitTypingStop = (presentationId: string, slideId: string) => {
    socketRef.current?.emit('typing-stop', { presentationId, slideId })
  }

  const onSlideUpdated = (callback: (slide: any) => void) => {
    socketRef.current?.on('slide-updated', callback)
  }

  const onSlideAdded = (callback: (slide: any) => void) => {
    socketRef.current?.on('slide-added', callback)
  }

  const onSlideDeleted = (callback: (slideId: string) => void) => {
    socketRef.current?.on('slide-deleted', callback)
  }

  const onPresentationUpdated = (callback: (presentation: any) => void) => {
    socketRef.current?.on('presentation-updated', callback)
  }

  const onCursorMoved = (callback: (data: { userId: string; position: any }) => void) => {
    socketRef.current?.on('cursor-moved', callback)
  }

  const onUserTyping = (callback: (data: { userId: string; slideId: string; isTyping: boolean }) => void) => {
    socketRef.current?.on('user-typing', callback)
  }

  return {
    isConnected,
    activeUsers,
    joinPresentation,
    leavePresentation,
    emitSlideUpdate,
    emitSlideAdd,
    emitSlideDelete,
    emitPresentationUpdate,
    emitCursorMove,
    emitTypingStart,
    emitTypingStop,
    onSlideUpdated,
    onSlideAdded,
    onSlideDeleted,
    onPresentationUpdated,
    onCursorMoved,
    onUserTyping,
  }
}