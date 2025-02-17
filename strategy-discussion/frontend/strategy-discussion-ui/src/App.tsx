import { useState, useEffect } from 'react';
import { Persona, Discussion } from './types';
import { PersonaCard } from './components/PersonaCard';
import { ChatMessage } from './components/ChatMessage';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card } from './components/ui/card';
import { ScrollArea } from './components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

import { api, APIError } from './api/client';
import { ToastProvider, ToastViewport } from './components/ui/toast';
import { useToast } from './components/ui/use-toast';

const { toast } = useToast();

function App() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [strategyDocument, setStrategyDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const personas = await api.getPersonas();
      setPersonas(personas);
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

  const startDiscussion = async () => {
    if (!strategyDocument.trim()) return;

    setIsLoading(true);
    try {
      const discussion = await api.startDiscussion(strategyDocument);
      setDiscussion(discussion);
      await getNextMessage();
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message,
        });
      }
    }
    setIsLoading(false);
  };

  const getNextMessage = async () => {
    if (!discussion?.is_active) return;

    setIsLoading(true);
    try {
      const message = await api.getNextMessage();
      setDiscussion(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
      } : null);
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message,
        });
      }
    }
    setIsLoading(false);
  };

  const stopDiscussion = async () => {
    try {
      await api.stopDiscussion();
      setDiscussion(prev => prev ? { ...prev, is_active: false } : null);
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

  const getPersonaIcon = (personaName: string) => {
    return personas.find(p => p.name === personaName)?.icon || '👤';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">戦略文書の議論プログラム</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {personas.map((persona) => (
            <PersonaCard key={persona.name} persona={persona} />
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">戦略文書を入力</h2>
          <Textarea
            placeholder="ここに戦略文書を入力してください..."
            value={strategyDocument}
            onChange={(e) => setStrategyDocument(e.target.value)}
            className="min-h-[150px] mb-4"
          />
          <div className="flex justify-end space-x-4">
            <Button
              onClick={startDiscussion}
              disabled={isLoading || !strategyDocument.trim() || discussion?.is_active}
            >
              議論を開始
            </Button>
            {discussion?.is_active && (
              <Button
                variant="destructive"
                onClick={stopDiscussion}
                disabled={isLoading}
              >
                議論を終了
              </Button>
            )}
          </div>
        </Card>

        {discussion && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">議論</h2>
            <ScrollArea className="h-[400px] pr-4">
              {discussion.messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  icon={getPersonaIcon(message.persona_name)}
                />
              ))}
            </ScrollArea>
            {discussion.is_active && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={getNextMessage}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      応答を生成中...
                    </>
                  ) : (
                    '次の意見を聞く'
                  )}
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default App
