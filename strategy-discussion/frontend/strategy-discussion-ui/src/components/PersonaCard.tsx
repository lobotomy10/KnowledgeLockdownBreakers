import { Persona } from '../types';
import { Card, CardHeader, CardContent } from './ui/card';
import { PersonaSettings } from './PersonaSettings';
import { api, APIError } from '../api/client';
import { toast } from '../lib/toast';

interface PersonaCardProps {
  persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
  const handleUpdatePersona = async (updatedPersona: Persona) => {
    try {
      await api.updatePersona(updatedPersona);
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message,
        });
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
          {persona.image ? (
            <img 
              src={persona.image}
              alt={persona.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-3xl bg-gray-100 w-full h-full flex items-center justify-center">
              {persona.icon}
            </div>
          )}
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
