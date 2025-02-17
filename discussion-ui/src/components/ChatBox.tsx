import * as React from "react"
import { ScrollArea } from "../components/ui/scroll-area"
import { Card } from "../components/ui/card"

interface Message {
  role: "system" | "user" | "assistant"
  content: string
  timestamp: string
  persona?: string
}

interface ChatBoxProps {
  messages: Message[]
  isStreaming: boolean
}

export function ChatBox({ messages, isStreaming }: ChatBoxProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="mt-4">
      <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {message.persona || (message.role === "user" ? "ユーザー" : "システム")}
              </span>
              <span className="text-sm text-gray-500">{message.timestamp}</span>
            </div>
            <p className="ml-8 mt-1 whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-center">
            <div className="animate-pulse">応答を生成中...</div>
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
