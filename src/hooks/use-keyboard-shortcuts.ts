'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface KeyboardShortcuts {
  [key: string]: {
    description: string
    action: () => void
  }
}

const keyboardShortcuts: KeyboardShortcuts = {
  'Ctrl+S': {
    description: 'Save current slide',
    action: () => {
      // This will be connected to save functionality
      toast.success('Slide saved (Ctrl+S)')
    }
  },
  'Ctrl+Z': {
    description: 'Undo last action',
    action: () => {
      toast.info('Undo (Ctrl+Z)')
    }
  },
  'Ctrl+Y': {
    description: 'Redo last action',
    action: () => {
      toast.info('Redo (Ctrl+Y)')
    }
  },
  'Ctrl+N': {
    description: 'Add new slide',
    action: () => {
      toast.info('New slide (Ctrl+N)')
    }
  },
  'Ctrl+D': {
    description: 'Duplicate current slide',
    action: () => {
      toast.info('Duplicate slide (Ctrl+D)')
    }
  },
  'Delete': {
    description: 'Delete current slide',
    action: () => {
      toast.info('Delete slide (Delete)')
    }
  },
  'Ctrl+C': {
    description: 'Copy slide content',
    action: () => {
      toast.info('Copied slide (Ctrl+C)')
    }
  },
  'Ctrl+V': {
    description: 'Paste slide content',
    action: () => {
      toast.info('Pasted slide (Ctrl+V)')
    }
  },
  'ArrowLeft': {
    description: 'Previous slide',
    action: () => {
      toast.info('Previous slide (←)')
    }
  },
  'ArrowRight': {
    description: 'Next slide',
    action: () => {
      toast.info('Next slide (→)')
    }
  },
  'Escape': {
    description: 'Exit edit mode',
    action: () => {
      toast.info('Exit edit mode (Escape)')
    }
  },
  'Enter': {
    description: 'Start presentation',
    action: () => {
      toast.info('Start presentation (Enter)')
    }
  },
  'F11': {
    description: 'Toggle fullscreen',
    action: () => {
      toast.info('Fullscreen (F11)')
    }
  }
}

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
      // Prevent default browser behavior for our shortcuts
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        
        const key = event.key
        const shortcut = keyboardShortcuts[key as keyof typeof keyboardShortcuts]
        
        if (shortcut) {
          shortcut.action()
        }
      }
    }, [])

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return keyboardShortcuts
}