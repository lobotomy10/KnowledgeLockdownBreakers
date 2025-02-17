
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Plus } from "lucide-react"
import { PersonaCard } from "./PersonaCard"

interface Persona {
  name: string
  role: string
  icon: string
}

interface PersonaManagerProps {
  personas: Persona[]
  onPersonasChange: (personas: Persona[]) => void
  disabled: boolean
}

const defaultIcons = ["🎯", "⚙️", "🔍", "💡", "📊", "🎨"]

export function PersonaManager({
  personas,
  onPersonasChange,
  disabled
}: PersonaManagerProps) {
  const addPersona = () => {
    if (personas.length >= 6) {
      return
    }
    const newIcon = defaultIcons[personas.length % defaultIcons.length]
    onPersonasChange([
      ...personas,
      { name: `ペルソナ${personas.length + 1}`, role: "役割を入力", icon: newIcon }
    ])
  }

  const removePersona = (index: number) => {
    if (personas.length <= 2) {
      return
    }
    onPersonasChange(personas.filter((_, i) => i !== index))
  }

  const updatePersona = (index: number, updates: Partial<Persona>) => {
    const newPersonas = [...personas]
    newPersonas[index] = { ...newPersonas[index], ...updates }
    onPersonasChange(newPersonas)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">ペルソナ設定</h2>
        <Button
          onClick={addPersona}
          disabled={disabled || personas.length >= 6}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          ペルソナを追加
        </Button>
      </div>

      {personas.length <= 2 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ペルソナは最低2人必要です。
          </AlertDescription>
        </Alert>
      )}

      {personas.length >= 6 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ペルソナは最大6人までです。
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map((persona, index) => (
          <PersonaCard
            key={index}
            {...persona}
            onNameChange={(name) => updatePersona(index, { name })}
            onRoleChange={(role) => updatePersona(index, { role })}
            onDelete={() => removePersona(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
