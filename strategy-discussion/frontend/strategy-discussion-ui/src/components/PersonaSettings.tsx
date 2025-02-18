import { useState } from 'react';
import { Persona } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { FileInput } from './ui/file-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface PersonaSettingsProps {
  persona: Persona;
  onUpdate: (updatedPersona: Persona) => Promise<void>;
}

export function PersonaSettings({ persona, onUpdate }: PersonaSettingsProps) {
  const [editedPersona, setEditedPersona] = useState<Persona>(persona);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    await onUpdate(editedPersona);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">設定を変更</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ペルソナ設定の変更</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">名前：</label>
            <Input
              value={editedPersona.name}
              onChange={(e) => setEditedPersona({ ...editedPersona, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">役割：</label>
            <Input
              value={editedPersona.role}
              onChange={(e) => setEditedPersona({ ...editedPersona, role: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">立場：</label>
            <Input
              value={editedPersona.position}
              onChange={(e) => setEditedPersona({ ...editedPersona, position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">詳細：</label>
            <Textarea
              value={editedPersona.details}
              onChange={(e) => setEditedPersona({ ...editedPersona, details: e.target.value })}
              placeholder="発言スタイルなど"
              maxLength={200}
              className="h-[150px] min-h-[150px] resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">アイコン：</label>
            <Input
              value={editedPersona.icon}
              onChange={(e) => setEditedPersona({ ...editedPersona, icon: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">画像：</label>
            <FileInput
              onFileSelect={(file) => {
                if (editedPersona.image) {
                  URL.revokeObjectURL(editedPersona.image);
                }
                setEditedPersona({ 
                  ...editedPersona, 
                  imageFile: file || undefined,
                  image: file ? URL.createObjectURL(file) : undefined
                });
              }}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
