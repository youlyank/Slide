'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Square, 
  Maximize2, 
  Minimize2,
  Timer,
  Eye,
  Settings
} from 'lucide-react'
import { Slide } from '@/app/page'
import { SlideRenderer } from './slide-renderer'

interface PresentationModeProps {
  slides: Slide[]
  startIndex?: number
  onClose?: () => void
}

export function PresentationMode({ slides, startIndex = 0, onClose }: PresentationModeProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPresenterView, setShowPresenterView] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [transitionClass, setTransitionClass] = useState('')

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext()
      }, 5000) // 5 seconds per slide
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
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlideIndex, isFullscreen, isPlaying])

  const handleNext = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setTransitionClass('slide-out-left')
      setTimeout(() => {
        setCurrentSlideIndex(prev => prev + 1)
        setTransitionClass('slide-in-right')
        setTimeout(() => setTransitionClass(''), 50)
      }, 300)
    } else {
      setIsPlaying(false)
    }
  }, [currentSlideIndex, slides.length])

  const handlePrevious = useCallback(() => {
    if (currentSlideIndex > 0) {
      setTransitionClass('slide-out-right')
      setTimeout(() => {
        setCurrentSlideIndex(prev => prev - 1)
        setTransitionClass('slide-in-left')
        setTimeout(() => setTransitionClass(''), 50)
      }, 300)
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
  const nextSlide = slides[currentSlideIndex + 1]
  const progress = ((currentSlideIndex + 1) / slides.length) * 100

  if (showPresenterView) {
    return (
      <div className="h-screen bg-black text-white flex">
        {/* Current Slide */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <SlideRenderer slide={currentSlide} isPreview={false} />
          </div>
        </div>

        {/* Presenter Panel */}
        <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Presenter View</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPresenterView(false)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                {formatTime(elapsedTime)}
              </div>
              <Badge variant="secondary">
                {currentSlideIndex + 1} / {slides.length}
              </Badge>
            </div>
          </div>

          {/* Next Slide Preview */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h4 className="font-semibold mb-4 text-sm text-gray-400">Next Slide</h4>
            {nextSlide ? (
              <div className="bg-white rounded-lg p-4 text-black">
                <SlideRenderer slide={nextSlide} isPreview={true} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                End of presentation
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="p-4 border-t border-gray-800">
            <h4 className="font-semibold mb-2 text-sm text-gray-400">Notes</h4>
            <div className="text-sm text-gray-300">
              {currentSlide?.title || 'Slide ' + (currentSlideIndex + 1)}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevious}
                disabled={currentSlideIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen bg-black relative overflow-hidden ${transitionClass}`}>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide Content */}
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          <SlideRenderer slide={currentSlide} isPreview={false} />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 rounded-full px-6 py-3 backdrop-blur-sm">
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

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="bg-gray-900/90 rounded-full px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-white text-sm">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              {formatTime(elapsedTime)}
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentSlideIndex + 1} / {slides.length}
            </Badge>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPresenterView(true)}
          className="text-white hover:bg-white/20 bg-gray-900/90 backdrop-blur-sm"
          title="Presenter View (P)"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/20 bg-gray-900/90 backdrop-blur-sm"
          title="Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 bg-gray-900/90 backdrop-blur-sm"
            title="Exit (Esc)"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Slide Number Indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-gray-900/90 rounded-full px-3 py-1 backdrop-blur-sm">
          <span className="text-white text-sm font-medium">
            {currentSlideIndex + 1}
          </span>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-gray-900/90 rounded-lg px-3 py-2 backdrop-blur-sm">
          <div className="text-white text-xs space-y-1">
            <div>← → Navigate</div>
            <div>Space Play/Pause</div>
            <div>F Fullscreen</div>
            <div>Esc Exit</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .slide-out-left {
          animation: slideOutLeft 0.3s ease-out;
        }
        .slide-out-right {
          animation: slideOutRight 0.3s ease-out;
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}