import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface Slide {
  id: string
  title: string
  content: string
  layout: 'title' | 'content' | 'two-column' | 'image'
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

    // First, generate images for the presentation
    const imagePrompts = [
      `Professional business presentation background with modern design, blue gradient, clean layout`,
      `Team collaboration illustration with diverse professionals working together, modern office setting`,
      `Data visualization chart showing business growth, professional design, blue and green colors`,
      `Technology innovation concept with digital elements, futuristic design, purple and blue gradient`,
      `Success achievement illustration with trophy or milestone, celebratory design, gold and blue colors`
    ]

    const generatedImages = []
    for (let i = 0; i < Math.min(3, imagePrompts.length); i++) {
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

    const aiPrompt = `Create a professional presentation about "${prompt}". Generate a JSON response with following structure:
{
  "title": "Presentation Title",
  "description": "Brief description of the presentation", 
  "slides": [
    {
      "title": "Slide Title",
      "content": "Complete HTML content with inline CSS styling and embedded images",
      "layout": "title|content|two-column|image|quote|team|timeline"
    }
  ]
}

Guidelines:
- Create 5-7 comprehensive slides covering the topic thoroughly
- Each slide should include RICH HTML content with inline CSS for professional styling
- Use modern design with gradients, shadows, typography, and professional layouts
- Include the provided base64 images where appropriate (use ${generatedImages.length > 0 ? generatedImages[0] : 'placeholder'} for first relevant slide)
- Create visually appealing designs with proper color schemes and spacing
- For image slides, embed actual images using <img src="data:image/png;base64,..." />
- Include professional typography and responsive design principles
- Make content engaging with proper visual hierarchy
- Use semantic HTML5 elements for accessibility
- Generate complete, presentation-ready slides with full styling

Example of rich slide content with image:
\`<div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px; border-radius: 15px; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
  <h1 style="font-size: 3em; font-weight: 700; margin-bottom: 20px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Main Title</h1>
  <div style="text-align: center; margin-top: 20px;">
    <img src="data:image/png;base64,\${generatedImages.length > 0 ? generatedImages[0] : 'IMAGE_PLACEHOLDER'}" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);" alt="Professional illustration" />
  </div>
  <p style="font-size: 1.3em; margin-top: 20px; opacity: 0.9; text-align: center;">Engaging subtitle content</p>
</div>\``

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional presentation creator. Generate well-structured, informative presentations in JSON format only.'
        },
        {
          role: 'user',
          content: aiPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const messageContent = completion.choices[0]?.message?.content
    if (!messageContent) {
      throw new Error('No content generated')
    }

    // Extract JSON from the response
    const jsonMatch = messageContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const presentationData = JSON.parse(jsonMatch[0])

    // Create presentation with proper structure and generated images
    const presentation: Presentation = {
      id: Date.now().toString(),
      title: presentationData.title || `Presentation about ${prompt}`,
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
    console.error('Error generating presentation:', error)
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    )
  }
}