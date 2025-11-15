import { cn } from '@/lib/utils'

interface SlideTemplate {
  id: string
  name: string
  description: string
  preview: string
  layout: 'title' | 'content' | 'two-column' | 'image' | 'quote' | 'team' | 'timeline'
}

export const slideTemplates: SlideTemplate[] = [
  {
    id: 'title',
    name: 'Title Slide',
    description: 'Perfect for introducing your presentation',
    preview: 'Large title with subtitle',
    layout: 'title'
  },
  {
    id: 'content',
    name: 'Content Slide',
    description: 'Great for detailed information',
    preview: 'Title with bullet points',
    layout: 'content'
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Split content side by side',
    preview: 'Text on left, visual on right',
    layout: 'two-column'
  },
  {
    id: 'image',
    name: 'Image Focus',
    description: 'Highlight important visuals',
    preview: 'Large image with caption',
    layout: 'image'
  },
  {
    id: 'quote',
    name: 'Quote Slide',
    description: 'Feature impactful quotes',
    preview: 'Large quote with attribution',
    layout: 'quote'
  },
  {
    id: 'team',
    name: 'Team Slide',
    description: 'Introduce team members',
    preview: 'Team member profiles',
    layout: 'team'
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Show progression or history',
    preview: 'Chronological events',
    layout: 'timeline'
  }
]

interface SlideRendererProps {
  slide: {
    title: string
    content: string // Can be HTML or plain text
    layout: SlideTemplate['layout']
  }
  className?: string
}

export function SlideRenderer({ slide, className }: SlideRendererProps) {
  const isHTMLContent = (content: string) => {
    return content.includes('<') && content.includes('>') && content.includes('</')
  }

  const renderContent = () => {
    switch (slide.layout) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-12">
            {isHTMLContent(slide.content) ? (
              <div 
                dangerouslySetInnerHTML={{ __html: slide.content }}
                className="w-full h-full"
              />
            ) : (
              <>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl">
                  {slide.content}
                </p>
              </>
            )}
          </div>
        )
      
      case 'two-column':
        return (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 h-full p-4 sm:p-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{slide.title}</h2>
              <div className="prose prose-sm sm:prose-lg max-w-none">
                {isHTMLContent(slide.content) ? (
                  <div dangerouslySetInnerHTML={{ __html: slide.content }} />
                ) : (
                  slide.content.split('\n').map((line, index) => (
                    <p key={index} className="mb-3 sm:mb-4 text-muted-foreground">
                      {line}
                    </p>
                  ))
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/20">
              <div className="text-center p-4 sm:p-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Visual content</p>
              </div>
            </div>
          </div>
        )
      
      case 'image':
        return (
          <div className="flex flex-col h-full p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{slide.title}</h2>
            <div className="flex-1 bg-muted rounded-lg flex items-center justify-center mb-4 sm:mb-6 overflow-hidden">
              {isHTMLContent(slide.content) ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: slide.content }}
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">Image placeholder</p>
                </div>
              )}
            </div>
            <p className="text-base sm:text-lg text-muted-foreground text-center">
              {isHTMLContent(slide.content) ? (
                <div dangerouslySetInnerHTML={{ __html: slide.content }} />
              ) : (
                slide.content
              )}
            </p>
          </div>
        )
      
      case 'quote':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <div className="text-6xl md:text-8xl font-bold text-primary/20 mb-8">"</div>
            <p className="text-2xl md:text-3xl font-medium mb-8 max-w-4xl leading-relaxed">
              {slide.content}
            </p>
            <p className="text-xl text-muted-foreground">— {slide.title}</p>
          </div>
        )
      
      case 'team':
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">{slide.title}</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Team Member {i}</h3>
                  <p className="text-sm text-muted-foreground">Position {i}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'timeline':
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold mb-8">{slide.title}</h2>
            <div className="max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 mb-8 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    {i < 3 && <div className="w-0.5 h-16 bg-primary/20 mt-2"></div>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Milestone {i}</h3>
                    <p className="text-muted-foreground">Description of milestone {i} and its impact</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold mb-6">{slide.title}</h2>
            <div className="prose prose-lg max-w-none">
              {slide.content.split('\n').map((line, index) => (
                <p key={index} className="mb-4 text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
      className
    )}>
      {renderContent()}
    </div>
  )
}