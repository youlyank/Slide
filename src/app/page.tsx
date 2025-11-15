'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Download,
  Play,
  Settings,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Eye,
  Layers,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  BarChart3,
  Zap
} from 'lucide-react'
import { ZAIPresentationMode } from '@/components/zai-presentation-mode'
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
      title: 'Welcome to Z.AI Slides',
      content: '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 40px; border-radius: 16px; min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1);"><h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.2; text-align: center;">Welcome to Z.AI Slides</h1><p style="font-size: 1.8rem; opacity: 0.95; max-width: 800px; line-height: 1.6; text-align: center;">Transform your ideas into stunning presentations with AI</p><div style="margin-top: 2rem; padding: 1rem 2rem; background: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);"><span style="font-size: 1.1rem; font-weight: 500;">✨ Powered by Advanced AI Technology</span></div></div>',
      layout: 'title',
      order: 0
    }
  ])
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [presentationTitle, setPresentationTitle] = useState('Untitled Presentation')
  const [isPresentationMode, setIsPresentationMode] = useState(false)

  const handleGeneratePresentation = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic for your presentation')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) throw new Error('Failed to generate')

      const presentation = await response.json()
      setSlides(presentation.slides)
      setPresentationTitle(presentation.title)
      setSelectedSlideIndex(0)
      toast.success('Presentation generated successfully!')
    } catch (error) {
      toast.error('Failed to generate presentation')
    } finally {
      setIsGenerating(false)
    }
  }

  const addNewSlide = useCallback(() => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${slides.length + 1}`,
      content: '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); color: #1a202c; padding: 60px 40px; border-radius: 12px; min-height: 400px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"><div style="text-align: center; max-width: 600px;"><h2 style="font-size: 2rem; font-weight: 600; color: #1a202c; margin-bottom: 1rem; line-height: 1.2;">New Slide</h2><p style="font-size: 1.1rem; color: #4a5568; line-height: 1.6;">Add your content here or use AI to generate professional slides</p><div style="margin-top: 2rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px; border: 1px solid rgba(102, 126, 234, 0.2);"><span style="font-size: 0.9rem; color: #667eea; font-weight: 500;">💡 Pro Tip:</span><span style="font-size: 0.9rem; color: #4a5568; margin-left: 0.5rem;">Use AI generator to create stunning presentations instantly</span></div></div></div>',
      layout: 'content',
      order: slides.length
    }
    setSlides([...slides, newSlide])
    setSelectedSlideIndex(slides.length)
  }, [slides])

  const duplicateSlide = useCallback(() => {
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
    }
  }, [selectedSlideIndex, slides])

  const deleteSlide = useCallback(() => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, index) => index !== selectedSlideIndex)
      setSlides(newSlides)
      setSelectedSlideIndex(Math.max(0, selectedSlideIndex - 1))
    }
  }, [slides, selectedSlideIndex])

  const handleStartPresentation = useCallback(() => {
    setIsPresentationMode(true)
  }, [])

  const exportPresentation = useCallback(async () => {
    try {
      const response = await fetch('/api/export-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: presentationTitle, slides })
      })

      if (!response.ok) throw new Error('Export failed')

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
      toast.error('Failed to export presentation')
    }
  }, [presentationTitle, slides])

  const currentSlide = slides[selectedSlideIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Z.AI Presentation Mode Overlay */}
      {isPresentationMode && (
        <ZAIPresentationMode
          slides={slides}
          startIndex={selectedSlideIndex}
          onClose={() => setIsPresentationMode(false)}
        />
      )}

      {/* Header - Z.AI Style */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 zai-bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 zai-brand-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold zai-text-primary">Z.AI Slides</h1>
            </div>
            <Input
              value={presentationTitle}
              onChange={(e) => setPresentationTitle(e.target.value)}
              className="w-64 zai-input"
              placeholder="Presentation title"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="zai-btn-secondary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={exportPresentation} className="zai-btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleStartPresentation} className="zai-btn-primary">
              <Play className="w-4 h-4 mr-2" />
              Present
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Slide Thumbnails */}
        <div className="w-80 zai-bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold zai-text-primary">Slides</h2>
              <span className="text-sm zai-text-muted">{slides.length}</span>
            </div>
            <Button onClick={addNewSlide} className="w-full zai-btn-primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {slides.map((slide, index) => (
              <Card 
                key={slide.id}
                className={`cursor-pointer transition-all zai-card ${
                  index === selectedSlideIndex 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:zai-hover-shadow'
                }`}
                onClick={() => setSelectedSlideIndex(index)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium zai-text-primary truncate">
                      {slide.title}
                    </span>
                    {index === selectedSlideIndex && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full zai-pulse"></div>
                    )}
                  </div>
                  <div 
                    className="h-24 bg-gray-100 rounded border border-gray-200 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: slide.content }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Slide Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full zai-btn-secondary"
              onClick={duplicateSlide}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-red-600 hover:text-red-700 zai-btn-secondary"
              onClick={deleteSlide}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content - Canvas + AI Generator */}
        <div className="flex-1 flex flex-col">
          {/* AI Generator */}
          <div className="zai-bg-white border-b border-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to create a presentation about... (e.g., 'Introduction to Machine Learning', 'Q4 Business Review', 'Product Launch Strategy')"
                    rows={3}
                    className="resize-none zai-input"
                  />
                </div>
                <Button 
                  onClick={handleGeneratePresentation}
                  disabled={isGenerating || !prompt.trim()}
                  className="px-8 py-6 h-auto zai-btn-primary"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 zai-canvas p-8 overflow-auto">
            <div className="max-w-6xl mx-auto h-full">
              {currentSlide ? (
                <div 
                  className="bg-white rounded-lg shadow-lg overflow-hidden zai-card zai-fade-in"
                  style={{ minHeight: '600px' }}
                  dangerouslySetInnerHTML={{ __html: currentSlide.content }}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 zai-text-muted" />
                    <h3 className="text-xl font-semibold zai-text-primary mb-2">
                      No slides yet
                    </h3>
                    <p className="zai-text-muted mb-6">
                      Generate a presentation with AI or add slides manually
                    </p>
                    <Button onClick={addNewSlide} className="zai-btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Slide
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools */}
        <div className="w-80 zai-bg-white border-l border-gray-200 p-4">
          <h3 className="font-semibold zai-text-primary mb-4">Tools</h3>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium zai-text-secondary mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-12 flex flex-col zai-btn-secondary">
                  <Type className="w-4 h-4 mb-1" />
                  <span className="text-xs">Text</span>
                </Button>
                <Button variant="outline" size="sm" className="h-12 flex flex-col zai-btn-secondary">
                  <ImageIcon className="w-4 h-4 mb-1" />
                  <span className="text-xs">Image</span>
                </Button>
                <Button variant="outline" size="sm" className="h-12 flex flex-col zai-btn-secondary">
                  <BarChart3 className="w-4 h-4 mb-1" />
                  <span className="text-xs">Chart</span>
                </Button>
                <Button variant="outline" size="sm" className="h-12 flex flex-col zai-btn-secondary">
                  <Layout className="w-4 h-4 mb-1" />
                  <span className="text-xs">Layout</span>
                </Button>
              </div>
            </div>

            {/* Templates */}
            <div>
              <h4 className="text-sm font-medium zai-text-secondary mb-3">Templates</h4>
              <div className="space-y-2">
                {['Title', 'Content', 'Two Column', 'Image', 'Quote', 'Team', 'Timeline'].map((template) => (
                  <Button key={template} variant="outline" size="sm" className="w-full justify-start zai-btn-secondary">
                    <Layers className="w-4 h-4 mr-2" />
                    {template} Slide
                  </Button>
                ))}
              </div>
            </div>

            {/* Design */}
            <div>
              <h4 className="text-sm font-medium zai-text-secondary mb-3">Design</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start zai-btn-secondary">
                  <Palette className="w-4 h-4 mr-2" />
                  Themes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start zai-btn-secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}