# Slide - AI-Powered Presentation Generator

A modern, AI-powered presentation generator built with Next.js 15, TypeScript, and Tailwind CSS. Create stunning presentations with real-time collaboration, multiple slide templates, and intelligent content generation.

## 🚀 Features

### Core Features
- **AI-Powered Content Generation**: Generate complete presentations using advanced AI models
- **Real-time Collaboration**: Work together with team members using Socket.io
- **Multiple Slide Templates**: Choose from 7 professional slide layouts
- **Export Options**: Export presentations as HTML, Text, or JSON
- **User Authentication**: Secure sign-in with NextAuth.js
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Work efficiently with comprehensive keyboard shortcuts
- **Professional UI**: Modern interface with three-panel layout

### Slide Templates
1. **Title Slide**: Perfect for introducing your presentation
2. **Content Slide**: Great for detailed information
3. **Two Column**: Split content side by side
4. **Image Focus**: Highlight important visuals
5. **Quote Slide**: Feature impactful quotes
6. **Team Slide**: Introduce team members
7. **Timeline**: Show progression or history

### Collaboration Features
- **Real-time Updates**: See changes as they happen
- **Live User Indicators**: Know who's currently editing
- **Slide Synchronization**: Automatic sync across all connected users
- **Connection Status**: Visual indicators for online/offline status

### Keyboard Shortcuts
- **Ctrl+S**: Save presentation
- **Ctrl+N**: Add new slide
- **Ctrl+D**: Duplicate current slide
- **Delete**: Delete current slide
- **Arrow Left/Right**: Navigate between slides
- **Enter**: Start presentation mode
- **Help Button**: Visual guide to all shortcuts

## 🛠 Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library

### Backend & APIs
- **z-ai-web-dev-sdk** for AI content generation
- **Socket.io** for real-time collaboration
- **NextAuth.js** for authentication
- **Prisma** with SQLite for data persistence

### Frontend Features
- **Framer Motion** for animations
- **Zustand** for state management
- **React Hook Form** for form handling
- **Sonner** for toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/youlyank/Slide.git
   cd Slide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your configuration values to `.env.local`

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started

1. **Sign In**: Use any email and password for demo purposes
2. **Create Presentation**: Choose between blank presentation or AI generation
3. **Add Slides**: Use templates or create custom slides
4. **Collaborate**: Share the presentation link with team members
5. **Export**: Download your presentation in various formats

### AI Generation

Simply describe your topic, and the AI will create a complete presentation with:
- Relevant slide titles
- Engaging content with HTML styling
- Appropriate layouts
- Professional structure
- Embedded images when relevant

Example prompts:
- "Introduction to Machine Learning"
- "Climate Change Impact"
- "Marketing Strategy 2024"

### Real-time Collaboration

- Multiple users can edit the same presentation simultaneously
- Changes are synced in real-time
- User presence indicators show who's currently active
- Automatic conflict resolution

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── socket/       # WebSocket handling
│   │   ├── generate-presentation/ # AI generation
│   │   └── export-presentation/   # Export functionality
│   ├── auth/             # Authentication pages
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── ui/              # shadcn/ui components
│   ├── slide-editor.tsx
│   ├── slide-list.tsx
│   ├── slide-renderer.tsx
│   ├── slide-template-selector.tsx
│   └── slide-thumbnail.tsx
├── hooks/               # Custom React hooks
│   ├── use-socket.ts
│   ├── use-keyboard-shortcuts.ts
│   └── use-toast.ts
├── lib/                 # Utility functions
│   └── socket.ts
└── ...
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient tones
- **Background**: Clean white/dark themes
- **Accent**: Subtle purple highlights
- **Text**: High contrast for readability

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body**: Clean, readable fonts
- **Responsive**: Optimized for all screen sizes

### Components
- **Cards**: Consistent padding and shadows
- **Buttons**: Clear CTAs with hover states
- **Forms**: Accessible and user-friendly
- **Modals**: Clean overlay designs

## 🚀 Deployment

### Environment Setup
1. **Set production environment variables**
2. **Configure authentication providers**
3. **Set up database connections**
4. **Configure WebSocket endpoints**

### Build and Deploy
```bash
npm run build
npm start
```

### Docker Support
```bash
docker build -t slide .
docker run -p 3000:3000 slide
```

## 🔧 Configuration

### Authentication
Configure NextAuth.js providers in `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    // Add your providers here
  ],
  // ... other configuration
}
```

### Database
Update Prisma schema in `prisma/schema.prisma`:
```prisma
model Presentation {
  id        String   @id @default(cuid())
  title     String
  // ... other fields
}
```

### Socket.io
Customize WebSocket handling in `src/lib/socket.ts`:
```typescript
io.on('connection', (socket) => {
  // Custom socket logic
})
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build verification
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the excellent framework
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Socket.io** for real-time capabilities
- **Z.ai** for AI generation services

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Slide** - Transform your ideas into stunning presentations with the power of AI. 🚀