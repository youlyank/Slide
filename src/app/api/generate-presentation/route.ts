import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface Slide {
  id: string
  title: string
  content: string
  layout: 'title' | 'content' | 'two-column' | 'image' | 'quote' | 'team' | 'timeline'
  order: number
}

interface Presentation {
  id: string
  title: string
  description: string
  slides: Slide[]
  createdAt: string
  updatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Generate images first - Z.AI style
    const imagePrompts = [
      `Professional business presentation with modern gradient background, clean design, blue and purple colors, corporate style`,
      `Team collaboration scene with diverse professionals, modern office environment, professional business setting`,
      `Data visualization and analytics chart, growth graph, business metrics dashboard, modern design`,
      `Technology and innovation concept, digital transformation, futuristic design with tech elements`,
      `Success and achievement concept, professional milestone celebration, corporate success story`
    ]

    const generatedImages = []
    for (let i = 0; i < imagePrompts.length; i++) {
      try {
        const imageResponse = await zai.images.generations.create({
          prompt: imagePrompts[i],
          size: '1024x1024'
        })
        if (imageResponse.data && imageResponse.data[0]) {
          generatedImages.push(imageResponse.data[0].base64)
        }
      } catch (error) {
        console.log(`Failed to generate image ${i}:`, error)
        // Continue without image if generation fails
      }
    }

    // Create comprehensive AI prompt for Z.AI style presentation
    const aiPrompt = `You are Z.AI's advanced presentation generator. Create a complete, professional presentation about "${prompt}" following these exact specifications:

STRUCTURE:
{
  "title": "Compelling, professional presentation title",
  "description": "Brief, engaging description of the presentation",
  "slides": [
    {
      "title": "Slide 1 Title",
      "content": "Complete HTML with inline CSS for professional slide",
      "layout": "title"
    },
    {
      "title": "Slide 2 Content", 
      "content": "Rich HTML content with professional styling",
      "layout": "content"
    }
  ]
}

Z.AI STYLE REQUIREMENTS:
1. MODERN DESIGN: Use gradients, shadows, and modern typography
2. PROFESSIONAL COLORS: Blue (#3b82f6), Purple (#8b5cf6), White, Gray gradients
3. CLEAN LAYOUTS: Proper spacing, alignment, visual hierarchy
4. RICH CONTENT: Include bullet points, icons, visual elements
5. CORPORATE STYLE: Business-appropriate, polished, impressive
6. RESPONSIVE: Mobile-friendly design principles

CONTENT GUIDELINES:
- Create 5-7 comprehensive slides
- Each slide must be presentation-ready with full styling
- Use semantic HTML5 elements
- Include CSS animations and transitions
- Add professional backgrounds and borders
- Use readable fonts with proper sizing
- Include relevant data visualizations

LAYOUT OPTIONS:
- "title": Hero slide with main title and subtitle
- "content": Information slide with bullet points and details
- "two-column": Split content side by side
- "image": Slide focused on visual content
- "quote": Emphasized quote with attribution
- "team": Team member or group information
- "timeline": Sequential events or process flow

IMAGE INTEGRATION:
- Use these generated images in relevant slides:
${generatedImages.map((img, i) => `Image ${i + 1}: data:image/png;base64,${img.substring(0, 50)}...`).join('\n')}

For image slides, embed: <img src="data:image/png;base64,${image}" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />

EXAMPLE SLIDE STRUCTURE:
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px; border-radius: 16px; min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
  <h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2;">Slide Title</h1>
  <p style="font-size: 1.5rem; opacity: 0.9; max-width: 800px; line-height: 1.6;">Engaging subtitle content</p>
</div>

Generate a complete, impressive presentation that showcases "${prompt}" professionally. Focus on clarity, visual appeal, and business impact.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are Z.AI\'s advanced presentation generator. Create professional, visually stunning presentations with modern design and comprehensive content.'
        },
        {
          role: 'user',
          content: aiPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    const messageContent = completion.choices[0]?.message?.content
    if (!messageContent) {
      throw new Error('No content generated')
    }

    // Extract JSON from response
    const jsonMatch = messageContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const presentationData = JSON.parse(jsonMatch[0])

    // Create presentation with Z.AI style
    const presentation: Presentation = {
      id: Date.now().toString(),
      title: presentationData.title || `Professional Presentation: ${prompt}`,
      description: presentationData.description || `AI-generated presentation about ${prompt}`,
      slides: presentationData.slides.map((slide: any, index: number) => ({
        id: (index + 1).toString(),
        title: slide.title || `Slide ${index + 1}`,
        content: slide.content || '',
        layout: slide.layout || 'content',
        order: index
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(presentation)

  } catch (error) {
    console.error('Error generating Z.AI presentation:', error)
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    )
  }
}