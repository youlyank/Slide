'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Briefcase, 
  GraduationCap,
  Heart,
  Zap,
  BarChart3,
  Clock,
  Star
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  slides: number
  color: string
}

const templates: Template[] = [
  {
    id: 'business',
    name: 'Business Presentation',
    description: 'Professional business slides with charts and data',
    icon: <Briefcase className="h-8 w-8" />,
    category: 'Business',
    slides: 8,
    color: 'blue'
  },
  {
    id: 'education',
    name: 'Educational',
    description: 'Teaching and learning presentations',
    icon: <GraduationCap className="h-8 w-8" />,
    category: 'Education',
    slides: 6,
    color: 'green'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Visual showcase for creative work',
    icon: <Star className="h-8 w-8" />,
    category: 'Creative',
    slides: 10,
    color: 'purple'
  },
  {
    id: 'marketing',
    name: 'Marketing Pitch',
    description: 'Persuasive marketing presentations',
    icon: <Target className="h-8 w-8" />,
    category: 'Marketing',
    slides: 7,
    color: 'orange'
  },
  {
    id: 'tech',
    name: 'Tech Demo',
    description: 'Product and technology presentations',
    icon: <Zap className="h-8 w-8" />,
    category: 'Technology',
    slides: 9,
    color: 'indigo'
  },
  {
    id: 'report',
    name: 'Annual Report',
    description: 'Data-driven business reports',
    icon: <BarChart3 className="h-8 w-8" />,
    category: 'Business',
    slides: 12,
    color: 'gray'
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Narrative presentations with impact',
    icon: <Heart className="h-8 w-8" />,
    category: 'Creative',
    slides: 8,
    color: 'pink'
  }
]

export default function TemplatesView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex">
        {/* Left Sidebar - z.ai style */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo and Brand */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Templates</h2>
                <p className="text-xs text-gray-500">Choose a template</p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  className={`w-full justify-start capitalize ${
                    selectedCategory === category ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Templates' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Choose a Template</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${template.color}-100`}>
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className="ml-2">
                            {template.slides} slides
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                            <p className="text-xs text-gray-500">Title Slide</p>
                          </div>
                          <div className="space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                            <p className="text-xs text-gray-500">Content Slide</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                            <p className="text-xs text-gray-500">Two Column</p>
                          </div>
                          <div className="space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                            <p className="text-xs text-gray-500">Image Slide</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-6">{template.description}</p>
                      <div className="pt-6">
                        <Button className="w-full">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Use This Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}