'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Slide } from '@/app/page'

interface PresentationState {
  slides: Slide[]
  selectedSlideIndex: number
  title: string
}

type PresentationAction =
  | { type: 'ADD_SLIDE'; payload: Slide }
  | { type: 'UPDATE_SLIDE'; payload: { index: number; slide: Slide } }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'REORDER_SLIDES'; payload: Slide[] }
  | { type: 'SELECT_SLIDE'; payload: number }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_SLIDES'; payload: Slide[] }
  | { type: 'DUPLICATE_SLIDE'; payload: number }

const initialState: PresentationState = {
  slides: [],
  selectedSlideIndex: 0,
  title: 'Untitled Presentation'
}

function presentationReducer(state: PresentationState, action: PresentationAction): PresentationState {
  switch (action.type) {
    case 'ADD_SLIDE':
      return {
        ...state,
        slides: [...state.slides, action.payload],
        selectedSlideIndex: state.slides.length
      }
    
    case 'UPDATE_SLIDE':
      return {
        ...state,
        slides: state.slides.map((slide, index) =>
          index === action.payload.index ? action.payload.slide : slide
        )
      }
    
    case 'DELETE_SLIDE':
      const newSlides = state.slides.filter(slide => slide.id !== action.payload)
      const newIndex = Math.min(state.selectedSlideIndex, newSlides.length - 1)
      return {
        ...state,
        slides: newSlides,
        selectedSlideIndex: Math.max(0, newIndex)
      }
    
    case 'REORDER_SLIDES':
      return {
        ...state,
        slides: action.payload
      }
    
    case 'SELECT_SLIDE':
      return {
        ...state,
        selectedSlideIndex: action.payload
      }
    
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload
      }
    
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload,
        selectedSlideIndex: Math.min(state.selectedSlideIndex, action.payload.length - 1)
      }
    
    case 'DUPLICATE_SLIDE':
      const slideToDuplicate = state.slides[action.payload]
      if (!slideToDuplicate) return state
      
      const duplicatedSlide: Slide = {
        ...slideToDuplicate,
        id: Date.now().toString(),
        title: `${slideToDuplicate.title} (Copy)`
      }
      
      const newSlidesWithDuplicate = [
        ...state.slides.slice(0, action.payload + 1),
        duplicatedSlide,
        ...state.slides.slice(action.payload + 1)
      ]
      
      return {
        ...state,
        slides: newSlidesWithDuplicate,
        selectedSlideIndex: action.payload + 1
      }
    
    default:
      return state
  }
}

const PresentationContext = createContext<{
  state: PresentationState
  dispatch: React.Dispatch<PresentationAction>
} | null>(null)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState)

  return (
    <PresentationContext.Provider value={{ state, dispatch }}>
      {children}
    </PresentationContext.Provider>
  )
}

export function usePresentation() {
  const context = useContext(PresentationContext)
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider')
  }
  return context
}