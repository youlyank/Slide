import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    // Store presentation rooms
    const presentationRooms = new Map<string, Set<string>>()

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Join a presentation room for collaboration
      socket.on('join-presentation', (presentationId: string) => {
        socket.join(presentationId)
        
        if (!presentationRooms.has(presentationId)) {
          presentationRooms.set(presentationId, new Set())
        }
        presentationRooms.get(presentationId)!.add(socket.id)
        
        socket.emit('joined-presentation', presentationId)
        
        // Notify others in the room
        socket.to(presentationId).emit('user-joined', { 
          userId: socket.id, 
          activeUsers: Array.from(presentationRooms.get(presentationId) || []) 
        })
      })

      // Leave a presentation room
      socket.on('leave-presentation', (presentationId: string) => {
        socket.leave(presentationId)
        
        if (presentationRooms.has(presentationId)) {
          presentationRooms.get(presentationId)!.delete(socket.id)
          if (presentationRooms.get(presentationId)!.size === 0) {
            presentationRooms.delete(presentationId)
          }
        }
        
        socket.to(presentationId).emit('user-left', { 
          userId: socket.id,
          activeUsers: Array.from(presentationRooms.get(presentationId) || []) 
        })
      })

      // Handle slide updates
      socket.on('slide-update', (data: { presentationId: string; slide: any }) => {
        socket.to(data.presentationId).emit('slide-updated', data.slide)
      })

      // Handle new slides
      socket.on('slide-add', (data: { presentationId: string; slide: any }) => {
        socket.to(data.presentationId).emit('slide-added', data.slide)
      })

      // Handle slide deletion
      socket.on('slide-delete', (data: { presentationId: string; slideId: string }) => {
        socket.to(data.presentationId).emit('slide-deleted', data.slideId)
      })

      // Handle cursor position
      socket.on('cursor-move', (data: { presentationId: string; position: any }) => {
        socket.to(data.presentationId).emit('cursor-moved', {
          userId: socket.id,
          position: data.position
        })
      })

      // Handle presentation title updates
      socket.on('presentation-update', (data: { presentationId: string; presentation: any }) => {
        socket.to(data.presentationId).emit('presentation-updated', data.presentation)
      })

      // Handle typing indicators
      socket.on('typing-start', (data: { presentationId: string; slideId: string }) => {
        socket.to(data.presentationId).emit('user-typing', {
          userId: socket.id,
          slideId: data.slideId,
          isTyping: true
        })
      })

      socket.on('typing-stop', (data: { presentationId: string; slideId: string }) => {
        socket.to(data.presentationId).emit('user-typing', {
          userId: socket.id,
          slideId: data.slideId,
          isTyping: false
        })
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        
        // Remove from all rooms
        presentationRooms.forEach((users, presentationId) => {
          if (users.has(socket.id)) {
            users.delete(socket.id)
            socket.to(presentationId).emit('user-left', { 
              userId: socket.id,
              activeUsers: Array.from(users) 
            })
            
            if (users.size === 0) {
              presentationRooms.delete(presentationId)
            }
          }
        })
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler