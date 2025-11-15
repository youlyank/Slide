'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { slideTemplates, SlideRenderer } from './slide-renderer'
import { Check, Plus } from 'lucide-react'

interface SlideTemplateSelectorProps {
  onSelectTemplate: (template: typeof slideTemplates[0]) => void
  selectedTemplate?: string
}

export function SlideTemplateSelector({ onSelectTemplate, selectedTemplate }: SlideTemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose a Slide Template</h3>
        <p className="text-sm text-muted-foreground">Select a template to get started with your slide</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slideTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{template.name}</CardTitle>
                {selectedTemplate === template.id ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <SlideRenderer
                  slide={{
                    title: template.name,
                    content: template.preview,
                    layout: template.layout
                  }}
                  className="h-full scale-75 origin-center"
                />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {template.layout}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}