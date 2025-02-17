import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { X } from "lucide-react"

interface PersonaCardProps {
  name: string
  role: string
  icon: string
  onNameChange: (name: string) => void
  onRoleChange: (role: string) => void
  onDelete: () => void
  disabled: boolean
}

export function PersonaCard({
  name,
  role,
  icon,
  onNameChange,
  onRoleChange,
  onDelete,
  disabled
}: PersonaCardProps) {
  return (
    <Card className="p-4 relative">
      <Button
        onClick={onDelete}
        disabled={disabled}
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="ペルソナ名"
          disabled={disabled}
        />
      </div>
      <Input
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
        placeholder="役割"
        disabled={disabled}
      />
    </Card>
  )
}
