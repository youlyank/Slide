'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SlideTransitionProps {
  children: React.ReactNode
  isVisible: boolean
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
}

export function SlideTransition({ 
  children, 
  isVisible, 
  direction = 'left',
  className = '' 
}: SlideTransitionProps) {
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0,
      scale: 0.9
    })
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center z-50',
            className
          )}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={{
            duration: 200,
            ease: 'easeInOut'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}