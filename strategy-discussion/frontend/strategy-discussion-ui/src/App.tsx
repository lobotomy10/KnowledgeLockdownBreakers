import { useState, useEffect, useRef } from 'react';
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
import { toast } from './lib/toast';

function App() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [strategyDocument, setStrategyDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageTimer, setMessageTimer] = useState<number | null>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    return () => {
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
  }, [messageTimer]);

  useEffect(() => {
    fetchPersonas();
    setDiscussion(null);
    console.log('App initialized, discussion set to null');
    
    localStorage.removeItem('discussion');
    sessionStorage.removeItem('discussion');
  }, []);
  
  useEffect(() => {
    console.log('Discussion state changed:', discussion);
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (discussion && discussion.is_active) {
      console.log('Setting timer for next message in 10 seconds due to discussion state change');
      const timerId = window.setTimeout(() => {
        console.log('Timer triggered from useEffect, getting next message...');
        getNextMessage();
      }, 10000);
      
      setMessageTimer(timerId);
      
      return () => {
        if (timerId) {
          clearTimeout(timerId);
        }
      };
    }
  }, [discussion]);

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
      console.log('Setting discussion state directly:', discussion);
      
      setDiscussion(discussion);
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getNextMessage = async () => {
    console.log('getNextMessage called, current discussion:', discussion);
    
    if (messageTimer) {
      console.log('Clearing existing timer:', messageTimer);
      clearTimeout(messageTimer);
      setMessageTimer(null);
    }
    
    if (!discussion) {
      console.log('Discussion is null, cannot get next message');
      return;
    }
    
    if (!discussion.is_active) {
      console.log('Discussion is not active, cannot get next message');
      return;
    }
    
    console.log('Discussion is active, proceeding to fetch next message');
    setIsLoading(true);
    
    try {
      console.log('Fetching next message...');
      const message = await api.getNextMessage();
      console.log('Received message:', message);
      
      setDiscussion(prev => {
        if (!prev) {
          console.log('Previous discussion state is null, cannot update');
          return prev;
        }
        
        console.log('Updating discussion with new message');
        const updatedDiscussion = {
          ...prev,
          is_active: true, // Ensure discussion remains active
          messages: [...prev.messages, message],
        };
        
        console.log('Updated discussion:', updatedDiscussion);
        return updatedDiscussion;
      });
      
      console.log('Setting timer for next message in 10 seconds');
      const timerId = window.setTimeout(() => {
        console.log('Timer triggered, getting next message...');
        getNextMessage();
      }, 10000);
      
      console.log('New timer ID:', timerId);
      setMessageTimer(timerId);
    } catch (error) {
      console.error('Error getting next message:', error);
      if (error instanceof APIError) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopDiscussion = async () => {
    if (messageTimer) {
      clearTimeout(messageTimer);
      setMessageTimer(null);
    }
    
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
              onClick={() => {
                console.log('Debug button clicked');
                console.log('isLoading:', isLoading);
                console.log('strategyDocument:', strategyDocument);
                console.log('discussion:', discussion);
                
                if (startButtonRef.current) {
                  startButtonRef.current.disabled = false;
                  console.log('Start button forcibly enabled');
                }
                
                if (strategyDocument.trim()) {
                  startDiscussion();
                }
              }}
              variant="outline"
              className="mr-2"
            >
              デバッグ
            </Button>
            <Button
              ref={startButtonRef}
              onClick={startDiscussion}
              disabled={false} // Always enable the button when there's text
            >
              議論を開始
            </Button>
            {discussion && discussion.is_active && (
              <>
                <Button
                  variant="destructive"
                  onClick={stopDiscussion}
                  disabled={isLoading}
                >
                  議論を終了
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (discussion?.messages.length && window.confirm('議論内容をテキストファイルとして保存しますか？')) {
                      const text = `戦略文書:\n${discussion.strategy_document.content}\n\n議論内容:\n` +
                        discussion.messages
                          .map(m => `${m.persona_name}: ${m.content}`)
                          .join('\n\n');
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `discussion_${new Date().toISOString().split('T')[0]}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                    
                    if (messageTimer) {
                      clearTimeout(messageTimer);
                      setMessageTimer(null);
                    }
                    
                    setDiscussion(null);
                    setStrategyDocument('');
                  }}
                >
                  リセット
                </Button>
              </>
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
            {discussion.is_active && isLoading && (
              <div className="mt-4 flex justify-center">
                <div className="flex items-center text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  応答を生成中...
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default App
