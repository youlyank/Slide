'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Save, 
  Download, 
  Play, 
  Settings, 
  Users, 
  Zap,
  FileText,
  Lightbulb,
  Sparkles,
  Presentation,
  Trash2,
  HelpCircle,
  X
} from 'lucide-react'
import { SlideList } from '@/components/slide-list'
import { SlideRenderer } from '@/components/slide-renderer'
import { SlideTemplateSelector } from '@/components/slide-template-selector'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { toast } from 'sonner'

export interface Slide {
  id: string
  title: string
  content: string
  layout: 'title' | 'content' | 'two-column' | 'image' | 'quote' | 'team' | 'timeline'
  order: number
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Welcome to AI Slides',
      content: '<div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;"><h1 style="color: #2563eb; font-size: 3em; margin-bottom: 20px;">Welcome to AI Slides</h1><p style="font-size: 1.2em; color: #64748b;">Create stunning presentations with AI</p></div>',
      layout: 'title',
      order: 0
    },
    {
      id: '2',
      title: 'Features Overview',
      content: '<div style="font-family: Arial, sans-serif; padding: 40px;"><h2 style="color: #1e293b; margin-bottom: 20px;">Key Features</h2><ul style="font-size: 1.1em; line-height: 1.8; color: #475569;"><li>✨ AI-powered content generation</li><li>🎨 Professional templates</li><li>🔄 Real-time collaboration</li><li>📱 Responsive design</li></ul></div>',
      layout: 'content',
      order: 1
    }
  ])
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0)
  const [presentationTitle, setPresentationTitle] = useState('AI Presentation')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [prompt, setPrompt] = useState('')

  // Initialize keyboard shortcuts
  const shortcuts = useKeyboardShortcuts()

  // Enhanced keyboard shortcuts with actual functionality
  useEffect(() => {
    const enhancedShortcuts = {
      'Ctrl+S': {
        description: 'Save presentation',
        action: () => {
          handleSavePresentation()
        }
      },
      'Ctrl+N': {
        description: 'Add new slide',
        action: () => {
          handleAddSlide()
        }
      },
      'Ctrl+D': {
        description: 'Duplicate current slide',
        action: () => {
          handleDuplicateSlide()
        }
      },
      'Delete': {
        description: 'Delete current slide',
        action: () => {
          handleDeleteSlide(slides[selectedSlideIndex]?.id)
        }
      },
      'ArrowLeft': {
        description: 'Previous slide',
        action: () => {
          if (selectedSlideIndex > 0) {
            setSelectedSlideIndex(selectedSlideIndex - 1)
          }
        }
      },
      'ArrowRight': {
        description: 'Next slide',
        action: () => {
          if (selectedSlideIndex < slides.length - 1) {
            setSelectedSlideIndex(selectedSlideIndex + 1)
          }
        }
      },
      'Enter': {
        description: 'Start presentation',
        action: () => {
          handleStartPresentation()
        }
      }
    }

    // Override the default shortcuts with enhanced functionality
    Object.assign(shortcuts, enhancedShortcuts)
  }, [selectedSlideIndex, slides])

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${slides.length + 1}`,
      content: '<div style="padding: 40px; text-align: center;"><h2>New Slide</h2><p>Add your content here</p></div>',
      layout: 'content',
      order: slides.length
    }
    setSlides([...slides, newSlide])
    setSelectedSlideIndex(slides.length)
    toast.success('New slide added')
  }, [slides])

  const handleDuplicateSlide = useCallback(() => {
    if (selectedSlideIndex >= 0 && selectedSlideIndex < slides.length) {
      const currentSlide = slides[selectedSlideIndex]
      const duplicatedSlide: Slide = {
        ...currentSlide,
        id: Date.now().toString(),
        title: `${currentSlide.title} (Copy)`,
        order: slides.length
      }
      setSlides([...slides, duplicatedSlide])
      setSelectedSlideIndex(slides.length)
      toast.success('Slide duplicated')
    }
  }, [selectedSlideIndex, slides])

  const handleDeleteSlide = useCallback((slideId: string) => {
    if (slides.length > 1) {
      const newSlides = slides.filter(slide => slide.id !== slideId)
      setSlides(newSlides)
      if (selectedSlideIndex >= newSlides.length) {
        setSelectedSlideIndex(newSlides.length - 1)
      }
      toast.success('Slide deleted')
    } else {
      toast.error('Cannot delete the last slide')
    }
  }, [slides, selectedSlideIndex])

  const handleSlideUpdate = useCallback((updatedSlide: Slide, index: number) => {
    const newSlides = [...slides]
    newSlides[index] = updatedSlide
    setSlides(newSlides)
    toast.success('Slide updated')
  }, [slides])

  const handleSlideReorder = useCallback((reorderedSlides: Slide[]) => {
    setSlides(reorderedSlides)
    toast.success('Slides reordered')
  }, [])

  const handleSavePresentation = useCallback(() => {
    const presentationData = {
      title: presentationTitle,
      slides: slides,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem('presentation', JSON.stringify(presentationData))
    toast.success('Presentation saved successfully')
  }, [presentationTitle, slides])

  const handleStartPresentation = useCallback(() => {
    toast.info('Starting presentation mode...')
    // This would open a fullscreen presentation view
  }, [])

  const handleGeneratePresentation = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic for your presentation')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate presentation')
      }

      const presentation = await response.json()
      setSlides(presentation.slides)
      setPresentationTitle(presentation.title)
      setSelectedSlideIndex(0)
      toast.success('Presentation generated successfully!')
    } catch (error) {
      console.error('Error generating presentation:', error)
      toast.error('Failed to generate presentation')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPresentation = async () => {
    try {
      const response = await fetch('/api/export-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: presentationTitle,
          slides: slides
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to export presentation')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${presentationTitle.replace(/\s+/g, '_')}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Presentation exported successfully!')
    } catch (error) {
      console.error('Error exporting presentation:', error)
      toast.error('Failed to export presentation')
    }
  }

  const handleTemplateSelect = (template: any) => {
    // Apply template to current slide or all slides
    toast.success(`Template "${template.name}" applied`)
    setShowTemplates(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Presentation className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">AI Slides</h1>
              </div>
              <Input
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
                className="w-64"
                placeholder="Presentation title"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboardHelp(true)}
                title="Keyboard Shortcuts"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Templates
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePresentation}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPresentation}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                size="sm"
                onClick={handleStartPresentation}
              >
                <Play className="h-4 w-4 mr-2" />
                Present
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* AI Generation Section */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Presentation Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create a presentation about... (e.g., 'Introduction to Machine Learning', 'Q4 Business Review', 'Product Launch Strategy')"
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleGeneratePresentation}
                disabled={isGenerating || !prompt.trim()}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowTemplates(!showTemplates)}
                className="min-w-[140px]"
              >
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Slide List */}
          <div className="lg:col-span-1">
            <SlideList
              slides={slides}
              selectedSlideIndex={selectedSlideIndex}
              onSlideSelect={setSelectedSlideIndex}
              onSlideUpdate={handleSlideUpdate}
              onSlideDelete={handleDeleteSlide}
              onSlideAdd={handleAddSlide}
              onSlideReorder={handleSlideReorder}
            />
          </div>

          {/* Main Canvas - Slide Renderer */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Slide {selectedSlideIndex + 1} of {slides.length}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {slides[selectedSlideIndex]?.layout || 'content'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[520px] p-0">
                {slides[selectedSlideIndex] && (
                  <SlideRenderer
                    slide={slides[selectedSlideIndex]}
                    isPreview={true}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Tools & Settings */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSlide}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Slide (Ctrl+N)
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicateSlide}
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Duplicate (Ctrl+D)
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSlide(slides[selectedSlideIndex]?.id)}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete (Del)
                </Button>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.entries(shortcuts).slice(0, 6).map(([key, shortcut]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{shortcut.description}</span>
                    <Badge variant="secondary" className="text-xs">
                      {key.replace('Ctrl', '⌘')}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Presentation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Presentation Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Slides:</span>
                  <Badge variant="outline">{slides.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current:</span>
                  <Badge variant="outline">{selectedSlideIndex + 1}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layouts:</span>
                  <Badge variant="outline">7 Types</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Choose a Template</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(false)}
              >
                ×
              </Button>
            </div>
            <SlideTemplateSelector onSelect={handleTemplateSelect} />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboardHelp(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(shortcuts).map(([key, shortcut]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">
                      {key.replace('Ctrl', '⌘')}
                    </Badge>
                    <span className="text-sm">{shortcut.description}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Pro tip:</strong> Use these shortcuts to work faster and more efficiently with your presentations.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowKeyboardHelp(false)}>
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}