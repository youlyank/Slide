'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Plus,
  Search,
  Grid3X3,
  List,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: string
  category?: string
}

interface ImageManagerProps {
  onImageSelect: (image: UploadedImage) => void
  onClose?: () => void
}

export function ImageManager({ onImageSelect, onClose }: ImageManagerProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Mock uploaded images - in real app, this would come from backend
  const mockImages: UploadedImage[] = [
    {
      id: '1',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDE8L3RleHQ+Cjwvc3ZnPg==',
      name: 'business-presentation.svg',
      size: 45230,
      uploadedAt: '2024-01-15T10:30:00Z',
      category: 'business'
    },
    {
      id: '2', 
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdmM2ZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzAwN2JmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYXJ0IEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
      name: 'chart-graphic.svg',
      size: 38420,
      uploadedAt: '2024-01-14T15:45:00Z',
      category: 'charts'
    }
  ]

  const categories = ['all', 'business', 'charts', 'technology', 'nature', 'abstract']

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      const newImages: UploadedImage[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`)
          continue
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`)
          continue
        }
        
        // Convert to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        
        const newImage: UploadedImage = {
          id: Date.now().toString() + i,
          url: base64,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          category: 'uploaded'
        }
        
        newImages.push(newImage)
      }
      
      setImages(prev => [...prev, ...newImages])
      toast.success(`Successfully uploaded ${newImages.length} image(s)`)
      
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleGenerateImage = useCallback(async () => {
    setUploading(true)
    try {
      // Use z-ai-web-dev-sdk to generate image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Professional business presentation image, modern design, blue gradient'
        })
      })
      
      if (!response.ok) throw new Error('Failed to generate image')
      
      const data = await response.json()
      
      const generatedImage: UploadedImage = {
        id: Date.now().toString(),
        url: data.image,
        name: 'AI Generated Image',
        size: 0,
        uploadedAt: new Date().toISOString(),
        category: 'ai-generated'
      }
      
      setImages(prev => [...prev, generatedImage])
      toast.success('AI image generated successfully!')
      
    } catch (error) {
      toast.error('Failed to generate AI image')
    } finally {
      setUploading(false)
    }
  }, [])

  const filteredImages = mockImages.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Image Manager</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <Button disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            
            {/* AI Generate Button */}
            <Button 
              variant="outline" 
              onClick={handleGenerateImage}
              disabled={uploading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4" />
              <p className="text-lg mb-2">No images found</p>
              <p className="text-sm">Upload images or generate with AI to get started</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-2"
            }>
              {filteredImages.map((image) => (
                <Card 
                  key={image.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={() => onImageSelect(image)}
                >
                  <CardContent className="p-0">
                    {viewMode === 'grid' ? (
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                          <Plus className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{image.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {image.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(image.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-3 gap-4">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{image.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {image.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(image.size)}
                            </span>
                          </div>
                        </div>
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}