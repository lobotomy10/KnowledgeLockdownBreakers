import * as React from 'react'
import { useState } from 'react'
import { PersonaManager } from './components/PersonaManager'
import { Alert, AlertDescription } from './components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface Persona {
  name: string
  role: string
  icon: string
}

function App() {
  const [personas, setPersonas] = useState<Persona[]>([
    { name: "戦略家", role: "長期的な視点から戦略を提案", icon: "🎯" },
    { name: "実務家", role: "実践的な実装方法を提案", icon: "⚙️" },
    { name: "批評家", role: "リスクと課題を指摘", icon: "🔍" },
  ])
  const [isDiscussing, setIsDiscussing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">戦略議論システム</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PersonaManager
        personas={personas}
        onPersonasChange={setPersonas}
        disabled={isDiscussing}
      />
    </div>
  )
}

export default App
