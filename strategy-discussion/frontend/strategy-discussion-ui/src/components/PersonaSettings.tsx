import { useState, useEffect } from 'react';
import { Persona } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FileInput } from './ui/file-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from '../lib/toast';

interface PersonaSettingsProps {
  persona: Persona;
  onUpdate: (updatedPersona: Persona) => Promise<void>;
}

export function PersonaSettings({ persona, onUpdate }: PersonaSettingsProps) {
  const [editedPersona, setEditedPersona] = useState<Persona>(persona);
  const [isOpen, setIsOpen] = useState(false);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (editedPersona.image && editedPersona.image.startsWith('blob:')) {
        URL.revokeObjectURL(editedPersona.image);
      }
    };
  }, [editedPersona.image]);

  const handleSubmit = async () => {
    try {
      await onUpdate(editedPersona);
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "画像のアップロードに失敗しました",
      });
    }
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
          <div>
            <label className="text-sm font-medium">発言スタイル：</label>
            <Input
              value={editedPersona.speaking_style}
              onChange={(e) => setEditedPersona({ ...editedPersona, speaking_style: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">アイコン：</label>
            <Input
              value={editedPersona.icon}
              onChange={(e) => setEditedPersona({ ...editedPersona, icon: e.target.value })}
            />
          </div>
          <div className="space-y-2">
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
            {editedPersona.image && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={editedPersona.image} 
                  alt={editedPersona.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-violet-100"
                />
              </div>
            )}
          </div>
          <Button onClick={handleSubmit} className="w-full mt-4">保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
