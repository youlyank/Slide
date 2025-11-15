import { NextRequest, NextResponse } from 'next/server'

interface Slide {
  id: string
  title: string
  content: string
  layout: string
  order: number
}

interface Presentation {
  id: string
  title: string
  description: string
  slides: Slide[]
}

export async function POST(request: NextRequest) {
  try {
    const { presentation, format } = await request.json()

    if (!presentation || !format) {
      return NextResponse.json(
        { error: 'Presentation and format are required' },
        { status: 400 }
      )
    }

    switch (format) {
      case 'json':
        return NextResponse.json({
          data: JSON.stringify(presentation, null, 2),
          filename: `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.json`,
          mimeType: 'application/json'
        })

      case 'html':
        const htmlContent = generateHTMLPresentation(presentation)
        return NextResponse.json({
          data: htmlContent,
          filename: `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.html`,
          mimeType: 'text/html'
        })

      case 'txt':
        const textContent = generateTextPresentation(presentation)
        return NextResponse.json({
          data: textContent,
          filename: `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.txt`,
          mimeType: 'text/plain'
        })

      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error exporting presentation:', error)
    return NextResponse.json(
      { error: 'Failed to export presentation' },
      { status: 500 }
    )
  }
}

function generateHTMLPresentation(presentation: Presentation): string {
  const slides = presentation.slides.map((slide, index) => {
    let slideContent = ''
    
    switch (slide.layout) {
      case 'title':
        slideContent = `
          <div class="slide title-slide">
            <h1>${slide.title}</h1>
            <p>${slide.content}</p>
          </div>
        `
        break
      case 'two-column':
        slideContent = `
          <div class="slide two-column-slide">
            <div class="column">
              <h2>${slide.title}</h2>
              <p>${slide.content}</p>
            </div>
            <div class="column">
              <div class="placeholder">Image placeholder</div>
            </div>
          </div>
        `
        break
      case 'quote':
        slideContent = `
          <div class="slide quote-slide">
            <div class="quote">"${slide.content}"</div>
            <div class="attribution">— ${slide.title}</div>
          </div>
        `
        break
      default:
        slideContent = `
          <div class="slide content-slide">
            <h2>${slide.title}</h2>
            <p>${slide.content}</p>
          </div>
        `
    }

    return slideContent
  }).join('\n')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .slide {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: always;
            background: white;
            margin: 0;
            padding: 40px;
            box-sizing: border-box;
        }
        .title-slide {
            flex-direction: column;
            text-align: center;
        }
        .title-slide h1 {
            font-size: 3em;
            margin-bottom: 20px;
            color: #333;
        }
        .title-slide p {
            font-size: 1.5em;
            color: #666;
        }
        .content-slide {
            flex-direction: column;
            text-align: left;
            max-width: 800px;
        }
        .content-slide h2 {
            font-size: 2em;
            margin-bottom: 30px;
            color: #333;
        }
        .content-slide p {
            font-size: 1.2em;
            line-height: 1.6;
            color: #666;
        }
        .two-column-slide {
            gap: 40px;
        }
        .two-column-slide .column {
            flex: 1;
        }
        .two-column-slide h2 {
            font-size: 1.8em;
            margin-bottom: 20px;
            color: #333;
        }
        .two-column-slide .placeholder {
            background: #f0f0f0;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            border: 2px dashed #ccc;
            border-radius: 8px;
        }
        .quote-slide {
            flex-direction: column;
            text-align: center;
        }
        .quote {
            font-size: 2.5em;
            font-style: italic;
            margin-bottom: 30px;
            color: #333;
            line-height: 1.4;
        }
        .attribution {
            font-size: 1.2em;
            color: #666;
        }
        @media print {
            .slide {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    ${slides}
</body>
</html>
  `
}

function generateTextPresentation(presentation: Presentation): string {
  let text = `${presentation.title}\n`
  text += `${'='.repeat(presentation.title.length)}\n\n`
  text += `${presentation.description}\n\n`
  
  presentation.slides.forEach((slide, index) => {
    text += `Slide ${index + 1}: ${slide.title}\n`
    text += `${'-'.repeat(slide.title.length + 10)}\n`
    text += `${slide.content}\n\n`
  })

  return text
}