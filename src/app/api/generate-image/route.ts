import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

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

    const imageResponse = await zai.images.generations.create({
      prompt: prompt,
      size: '1024x1024'
    })

    if (!imageResponse.data || imageResponse.data.length === 0) {
      throw new Error('No image generated')
    }

    const imageBase64 = imageResponse.data[0].base64

    return NextResponse.json({
      image: `data:image/png;base64,${imageBase64}`,
      success: true
    })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}