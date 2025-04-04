import './App.css'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Button Component Demo</h1>

      <div className="flex flex-col gap-4 items-start">
        <div className="flex gap-2">
          <Button>Default Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link Button</Button>
        </div>

        <div className="flex gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default Size</Button>
          <Button size="lg">Large</Button>
        </div>

        <div className="flex gap-2">
          <Button size="icon">
            <span>🔍</span>
          </Button>
          <Button size="icon" variant="outline">
            <span>⭐</span>
          </Button>
          <Button size="icon" variant="secondary">
            <span>📝</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
