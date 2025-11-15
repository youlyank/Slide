'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Square, 
  Maximize2, 
  Minimize2,
  Timer,
  Settings,
  Zap
} from 'lucide-react'
import { Slide } from '@/app/page'

interface ZAIPresentationModeProps {
  slides: Slide[]
  startIndex?: number
  onClose?: () => void
}

export function ZAIPresentationMode({ slides, startIndex = 0, onClose }: ZAIPresentationModeProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showControls, setShowControls] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext()
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentSlideIndex])

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying || currentSlideIndex > 0) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentSlideIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          handleNext()
          break
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'Escape':
          if (isFullscreen) {
            handleExitFullscreen()
          } else if (onClose) {
            onClose()
          }
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'p':
        case 'P':
          setIsPlaying(!isPlaying)
          break
        case 'h':
        case 'H':
          setShowControls(!showControls)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlideIndex, isFullscreen, isPlaying, showControls])

  const handleNext = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1)
    } else {
      setIsPlaying(false)
    }
  }, [currentSlideIndex, slides.length])

  const handlePrevious = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1)
    }
  }, [currentSlideIndex])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleExitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentSlide = slides[currentSlideIndex]
  const progress = ((currentSlideIndex + 1) / slides.length) * 100

  return (
    <div className="h-screen bg-black relative overflow-hidden zai-font">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide Content */}
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {currentSlide && (
            <div 
              className="bg-white rounded-lg shadow-2xl zai-slide-up"
              style={{ minHeight: '70vh' }}
              dangerouslySetInnerHTML={{ __html: currentSlide.content }}
            />
          )}
        </div>
      </div>

      {/* Controls - Only show when hovering or always on mobile */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Top Controls */}
      <div className={`absolute top-4 right-4 flex items-center gap-3 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              {formatTime(elapsedTime)}
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
              {currentSlideIndex + 1} / {slides.length}
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/20 bg-gray-900/90 backdrop-blur-sm rounded-full p-2"
          title="Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 bg-gray-900/90 backdrop-blur-sm rounded-full p-2"
            title="Exit (Esc)"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Z.AI Branding */}
      <div className={`absolute top-4 left-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Z.AI</span>
          </div>
        </div>
      </div>

      {/* Slide Number */}
      <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-sm font-medium">
            {currentSlideIndex + 1}
          </span>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className={`absolute bottom-4 left-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-white text-xs space-y-1 zai-text">
            <div>← → Navigate</div>
            <div>Space Play/Pause</div>
            <div>F Fullscreen</div>
            <div>H Toggle Controls</div>
            <div>Esc Exit</div>
          </div>
        </div>
      </div>

      {/* Mouse move to show controls */}
      <style jsx>{`
        .presentation-container {
          cursor: none;
        }
        
        .presentation-container:hover .controls-autohide {
          opacity: 1;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .zai-slide-up {
          animation: slideInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}