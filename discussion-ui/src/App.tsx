import * as React from 'react'
import { useState } from 'react'
import { PersonaManager } from './components/PersonaManager'
import { ChatBox } from './components/ChatBox'
import { Alert, AlertDescription } from './components/ui/alert'
import { Button } from './components/ui/button'
import { AlertCircle, MessageCircle, StopCircle } from 'lucide-react'
import { Card } from './components/ui/card'
import { Textarea } from './components/ui/textarea'

interface Persona {
  name: string
  role: string
  icon: string
}

interface Message {
  role: "system" | "user" | "assistant"
  content: string
  timestamp: string
  persona?: string
}

function App() {
  const [personas, setPersonas] = useState<Persona[]>([
    { name: "戦略家", role: "長期的な視点から戦略を提案", icon: "🎯" },
    { name: "実務家", role: "実践的な実装方法を提案", icon: "⚙️" },
    { name: "批評家", role: "リスクと課題を指摘", icon: "🔍" },
  ])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputDocument, setInputDocument] = useState("")
  const [isDiscussing, setIsDiscussing] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const streamResponse = async (messages: Message[]) => {
    try {
      setIsStreaming(true)
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          persona: personas[currentPersonaIndex].name
        }),
      })
      
      if (!response.ok) {
        throw new Error("APIリクエストに失敗しました。")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("レスポンスの読み取りに失敗しました。")
      
      let newMessage = {
        role: "assistant" as const,
        content: "",
        timestamp: new Date().toLocaleTimeString(),
        persona: personas[currentPersonaIndex].name
      }
      setMessages(prev => [...prev, newMessage])
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = new TextDecoder().decode(value)
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + text }
          ]
        })
      }
      setCurrentPersonaIndex((currentPersonaIndex + 1) % personas.length)
    } catch (error) {
      setError(error instanceof Error ? error.message : "エラーが発生しました。もう一度お試しください。")
    } finally {
      setIsStreaming(false)
    }
  }

  const startDiscussion = () => {
    if (!inputDocument.trim()) {
      setError("議論する文書を入力してください。")
      return
    }
    setError(null)
    setIsDiscussing(true)
    setMessages([{
      role: "system",
      content: "議論を開始します。",
      timestamp: new Date().toLocaleTimeString()
    }, {
      role: "user",
      content: inputDocument,
      timestamp: new Date().toLocaleTimeString()
    }])
    streamResponse([{
      role: "user",
      content: inputDocument,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const stopDiscussion = () => {
    setIsDiscussing(false)
    setCurrentPersonaIndex(0)
    setMessages(prev => [...prev, {
      role: "system",
      content: "議論を終了しました。",
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const resetDiscussion = () => {
    setMessages([])
    setInputDocument("")
    setIsDiscussing(false)
    setCurrentPersonaIndex(0)
    setError(null)
  }

  const exportDiscussion = () => {
    const text = messages.map(m => 
      `[${m.timestamp}] ${m.persona || (m.role === "user" ? "ユーザー" : "システム")}\n${m.content}\n`
    ).join("\n")
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `discussion-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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

      <Card className="mt-4 p-4">
        <Textarea
          value={inputDocument}
          onChange={(e) => setInputDocument(e.target.value)}
          placeholder="議論したい文書を入力してください"
          className="h-32 mb-4"
          disabled={isDiscussing}
        />
        <div className="flex justify-center gap-4">
          <Button
            onClick={startDiscussion}
            disabled={isDiscussing || !inputDocument.trim() || personas.length < 2}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            議論開始
          </Button>
          <Button
            onClick={stopDiscussion}
            disabled={!isDiscussing}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <StopCircle className="h-5 w-5" />
            議論終了
          </Button>
          <Button
            onClick={resetDiscussion}
            disabled={isDiscussing || messages.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            リセット
          </Button>
          <Button
            onClick={exportDiscussion}
            disabled={messages.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            履歴を保存
          </Button>
        </div>
      </Card>

      <ChatBox messages={messages} isStreaming={isStreaming} />
    </div>
  )
}

export default App
