import { Persona } from '../types';
import { Card, CardHeader, CardContent } from './ui/card';
import { PersonaSettings } from './PersonaSettings';

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  const handleUpdatePersona = async (updatedPersona: Persona) => {
    try {
      const response = await fetch(`http://localhost:8000/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPersona),
      });
      if (!response.ok) throw new Error('Failed to update persona');
    } catch (error) {
      console.error('Error updating persona:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gray-100 rounded-full">
          {persona.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{persona.name}</h3>
          <p className="text-sm text-gray-500">{persona.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">立場：</span>
            <span className="text-sm text-gray-600">{persona.position}</span>
          </div>
          <div>
            <span className="text-sm font-medium">発言スタイル：</span>
            <span className="text-sm text-gray-600">{persona.speaking_style}</span>
          </div>
          <div className="pt-2">
            <PersonaSettings persona={persona} onUpdate={handleUpdatePersona} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
