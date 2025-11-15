'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Type, 
  Square, 
  Circle, 
  Triangle,
  ArrowRight,
  Star,
  Heart,
  Hexagon,
  Palette,
  Image,
  BarChart3,
  Plus,
  Trash2,
  Copy,
  Move,
  RotateCw,
  Maximize2
} from 'lucide-react'

interface VisualElement {
  id: string
  type: 'text' | 'shape' | 'image' | 'chart'
  x: number
  y: number
  width: number
  height: number
  content?: string
  style: {
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    color?: string
    fontSize?: number
    fontFamily?: string
    rotation?: number
    opacity?: number
  }
  data?: any // For charts, images, etc.
}

interface RichContentEditorProps {
  onContentChange: (elements: VisualElement[]) => void
  initialElements?: VisualElement[]
}

const shapes = [
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'triangle', icon: Triangle, label: 'Triangle' },
  { type: 'star', icon: Star, label: 'Star' },
  { type: 'heart', icon: Heart, label: 'Heart' },
  { type: 'hexagon', icon: Hexagon, label: 'Hexagon' },
  { type: 'arrow', icon: ArrowRight, label: 'Arrow' }
]

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#000000', '#6b7280', '#ffffff'
]

export function RichContentEditor({ onContentChange, initialElements = [] }: RichContentEditorProps) {
  const [elements, setElements] = useState<VisualElement[]>(initialElements)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentTool, setCurrentTool] = useState<string>('select')
  const canvasRef = useRef<HTMLDivElement>(null)

  const addElement = useCallback((type: string, data?: any) => {
    const newElement: VisualElement = {
      id: Date.now().toString(),
      type: type as VisualElement['type'],
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      content: type === 'text' ? 'New Text' : undefined,
      style: {
        backgroundColor: type === 'shape' ? '#3b82f6' : 'transparent',
        borderColor: '#3b82f6',
        borderWidth: 2,
        color: '#000000',
        fontSize: 16,
        fontFamily: 'Arial',
        rotation: 0,
        opacity: 1
      },
      data
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    onContentChange(newElements)
    setSelectedElement(newElement.id)
  }, [elements, onContentChange])

  const updateElement = useCallback((id: string, updates: Partial<VisualElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    )
    setElements(newElements)
    onContentChange(newElements)
  }, [elements, onContentChange])

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id)
    setElements(newElements)
    onContentChange(newElements)
    setSelectedElement(null)
  }, [elements, onContentChange])

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id)
    if (!element) return

    const duplicated: VisualElement = {
      ...element,
      id: Date.now().toString(),
      x: element.x + 20,
      y: element.y + 20
    }

    const newElements = [...elements, duplicated]
    setElements(newElements)
    onContentChange(newElements)
    setSelectedElement(duplicated.id)
  }, [elements, onContentChange])

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault()
    setSelectedElement(elementId)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return

    const element = elements.find(el => el.id === selectedElement)
    if (!element) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    updateElement(selectedElement, {
      x: element.x + deltaX,
      y: element.y + deltaY
    })

    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, selectedElement, dragStart, elements, updateElement])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const renderElement = useCallback((element: VisualElement) => {
    const isSelected = element.id === selectedElement
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.style.rotation || 0}deg)`,
      opacity: element.style.opacity || 1,
      cursor: isDragging ? 'grabbing' : 'grab',
      border: isSelected ? '2px solid #3b82f6' : 'none',
      boxShadow: isSelected ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
    }

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: element.style.backgroundColor,
              color: element.style.color,
              fontSize: `${element.style.fontSize}px`,
              fontFamily: element.style.fontFamily,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '4px',
              border: element.style.borderWidth ? `${element.style.borderWidth}px solid ${element.style.borderColor}` : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => {
              const newText = prompt('Edit text:', element.content || '')
              if (newText !== null) {
                updateElement(element.id, { content: newText })
              }
            }}
          >
            {element.content}
          </div>
        )

      case 'shape':
        const shapeType = element.data?.type || 'rectangle'
        
        if (shapeType === 'circle') {
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                backgroundColor: element.style.backgroundColor,
                borderColor: element.style.borderColor,
                borderWidth: element.style.borderWidth,
                borderRadius: '50%'
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            />
          )
        }

        if (shapeType === 'triangle') {
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderLeft: `${element.width / 2}px solid transparent`,
                borderRight: `${element.width / 2}px solid transparent`,
                borderBottom: `${element.height}px solid ${element.style.backgroundColor}`
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            />
          )
        }

        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: element.style.backgroundColor,
              borderColor: element.style.borderColor,
              borderWidth: element.style.borderWidth,
              borderRadius: shapeType === 'star' ? '50%' : '4px'
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          />
        )

      default:
        return null
    }
  }, [selectedElement, isDragging, handleMouseDown, updateElement])

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tools */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant={currentTool === 'select' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentTool('select')}
            >
              <Move className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setCurrentTool('text')
                addElement('text')
              }}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>

          {/* Shapes */}
          <div className="flex items-center gap-1 border-r pr-2">
            {shapes.map((shape) => (
              <Button
                key={shape.type}
                variant="ghost"
                size="sm"
                onClick={() => addElement('shape', { type: shape.type })}
                title={shape.label}
              >
                <shape.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Visual Elements */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* TODO: Open image manager */}}
              title="Add Image"
            >
              <Image className="h-4 w-4" aria-label="Add Image" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* TODO: Open chart generator */}}
              title="Add Chart"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          {selectedElement && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => duplicateElement(selectedElement)}
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const element = elements.find(el => el.id === selectedElement)
                  if (element) {
                    updateElement(selectedElement, {
                      style: {
                        ...element.style,
                        rotation: ((element.style.rotation || 0) + 45) % 360
                      }
                    })
                  }
                }}
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteElement(selectedElement)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-2 mt-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  if (selectedElement) {
                    const element = elements.find(el => el.id === selectedElement)
                    if (element) {
                      updateElement(selectedElement, {
                        style: {
                          ...element.style,
                          backgroundColor: color
                        }
                      })
                    }
                  }
                }}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative bg-white overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(circle, #f0f0f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (currentTool === 'select' && e.target === e.currentTarget) {
            setSelectedElement(null)
          }
        }}
      >
        {elements.map(renderElement)}

        {/* Empty State */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-4" alt="Add elements" />
              <h3 className="text-lg font-medium mb-2">Start Creating</h3>
              <p className="text-sm">Add text, shapes, images, and charts to create your slide</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}