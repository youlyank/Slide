'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit2, Type, Palette, Layout, Image, Quote, Users, Clock } from 'lucide-react'
import { Slide } from '@/app/page'

interface SlideEditorProps {
  slide: Slide
  onUpdate: (slide: Slide) => void
  isSelected: boolean
  onSelect: () => void
}

export function SlideEditor({ slide, onUpdate, isSelected, onSelect }: SlideEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSlide, setEditedSlide] = useState<Slide>(slide)

  const handleSave = useCallback(() => {
    onUpdate(editedSlide)
    setIsEditing(false)
  }, [editedSlide, onUpdate])

  const handleCancel = useCallback(() => {
    setEditedSlide(slide)
    setIsEditing(false)
  }, [slide])

  const handleStartEdit = useCallback(() => {
    setEditedSlide(slide)
    setIsEditing(true)
    onSelect()
  }, [slide, onSelect])

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'title': return <Type className="h-4 w-4" />
      case 'content': return <Edit2 className="h-4 w-4" />
      case 'two-column': return <Layout className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" aria-label="Image layout" />
      case 'quote': return <Quote className="h-4 w-4" />
      case 'team': return <Users className="h-4 w-4" />
      case 'timeline': return <Clock className="h-4 w-4" />
      default: return <Edit2 className="h-4 w-4" />
    }
  }

  if (isEditing) {
    return (
      <Card className={`w-full h-full ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Edit Slide</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Slide Title</label>
            <Input
              value={editedSlide.title}
              onChange={(e) => setEditedSlide({ ...editedSlide, title: e.target.value })}
              placeholder="Enter slide title"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              value={editedSlide.content}
              onChange={(e) => setEditedSlide({ ...editedSlide, content: e.target.value })}
              placeholder="Enter slide content"
              rows={6}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Layout</label>
            <Select 
              value={editedSlide.layout} 
              onValueChange={(value: Slide['layout']) => setEditedSlide({ ...editedSlide, layout: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Title Slide
                  </div>
                </SelectItem>
                <SelectItem value="content">
                  <div className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Content Slide
                  </div>
                </SelectItem>
                <SelectItem value="two-column">
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    Two Column
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" aria-label="Image slide" />
                    Image Slide
                  </div>
                </SelectItem>
                <SelectItem value="quote">
                  <div className="flex items-center gap-2">
                    <Quote className="h-4 w-4" />
                    Quote Slide
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Slide
                  </div>
                </SelectItem>
                <SelectItem value="timeline">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={`w-full h-full cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleStartEdit}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getLayoutIcon(slide.layout)}
            <CardTitle className="text-lg truncate">{slide.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="capitalize">
            {slide.layout}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg mb-2">{slide.title}</h3>
          </div>
          <div>
            <p className="text-muted-foreground whitespace-pre-wrap">{slide.content}</p>
          </div>
          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layout className="h-3 w-3" />
              <span className="capitalize">{slide.layout} layout</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}