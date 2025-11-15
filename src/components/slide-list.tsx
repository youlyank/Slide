'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { Slide } from '@/app/page'
import { SlideThumbnail } from './slide-thumbnail'
import { SlideEditor } from './slide-editor'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SortableSlideItemProps {
  slide: Slide
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
  onEdit: (slide: Slide) => void
  onDelete: (slideId: string) => void
}

function SortableSlideItem({ slide, index, isSelected, onSelect, onEdit, onDelete }: SortableSlideItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <div className="relative group">
        <SlideThumbnail
          slide={slide}
          isSelected={isSelected}
          onClick={() => onSelect(index)}
          onDoubleClick={() => onEdit(slide)}
          index={index}
        />
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(slide)
            }}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(slide.id)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute left-0 top-0 bottom-0 w-4 cursor-grab active:cursor-grabbing flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
        >
          <div className="w-1 h-8 bg-primary/50 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

interface SlideListProps {
  slides: Slide[]
  selectedSlideIndex: number
  onSlideSelect: (index: number) => void
  onSlideUpdate: (slide: Slide, index: number) => void
  onSlideDelete: (slideId: string) => void
  onSlideAdd: () => void
  onSlideReorder: (slides: Slide[]) => void
}

export function SlideList({ 
  slides, 
  selectedSlideIndex, 
  onSlideSelect, 
  onSlideUpdate, 
  onSlideDelete, 
  onSlideAdd,
  onSlideReorder 
}: SlideListProps) {
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex((slide) => slide.id === active.id)
      const newIndex = slides.findIndex((slide) => slide.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedSlides = arrayMove(slides, oldIndex, newIndex)
        onSlideReorder(reorderedSlides)
      }
    }
  }

  const handleSlideEdit = (slide: Slide) => {
    setEditingSlide(slide)
  }

  const handleSlideSave = (updatedSlide: Slide) => {
    const index = slides.findIndex(s => s.id === updatedSlide.id)
    if (index !== -1) {
      onSlideUpdate(updatedSlide, index)
    }
    setEditingSlide(null)
  }

  const handleSlideCancel = () => {
    setEditingSlide(null)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Slides ({slides.length})
            </CardTitle>
            <Button size="sm" onClick={onSlideAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {editingSlide ? (
              <div className="mb-3">
                <SlideEditor
                  slide={editingSlide}
                  onUpdate={handleSlideSave}
                  isSelected={true}
                  onSelect={() => {}}
                />
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {slides.map((slide, index) => (
                    <SortableSlideItem
                      key={slide.id}
                      slide={slide}
                      index={index}
                      isSelected={index === selectedSlideIndex}
                      onSelect={onSlideSelect}
                      onEdit={handleSlideEdit}
                      onDelete={onSlideDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}