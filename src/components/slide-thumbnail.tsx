'use client'

import { Slide } from '@/app/page'
import { SlideRenderer } from './slide-renderer'
import { cn } from '@/lib/utils'

interface SlideThumbnailProps {
  slide: Slide
  isSelected: boolean
  onClick: () => void
  onDoubleClick?: () => void
  index: number
}

export function SlideThumbnail({ slide, isSelected, onClick, onDoubleClick, index }: SlideThumbnailProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-200 border-2 rounded-lg overflow-hidden",
        isSelected ? "border-primary shadow-lg" : "border-border hover:border-primary/50 hover:shadow-md"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Slide number indicator */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {index + 1}
        </div>
      </div>

      {/* Mini slide preview */}
      <div className="aspect-video bg-white dark:bg-gray-900 scale-50 origin-top-left">
        <div className="transform scale-50 origin-top-left">
          <SlideRenderer
            slide={{
              ...slide,
              title: slide.title.length > 20 ? slide.title.substring(0, 20) + '...' : slide.title,
              content: slide.content.length > 50 ? slide.content.substring(0, 50) + '...' : slide.content
            }}
            className="h-32 w-56 text-xs"
          />
        </div>
      </div>

      {/* Slide title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-white text-xs truncate font-medium">{slide.title}</p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary pointer-events-none rounded-lg"></div>
      )}
    </div>
  )
}