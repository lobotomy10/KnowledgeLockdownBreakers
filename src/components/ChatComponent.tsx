import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, Send, Search } from "lucide-react";
import axios from "axios";
import "../index.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Scene {
  timestamp: number;
  description: string;
}

interface ChatResponse {
  response: string;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatComponentProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  mode: "chat" | "scene_search";
  onSceneFound?: (scenes: Scene[]) => void;
  onModeChange?: (mode: "chat" | "scene_search") => void;
  taskId: string;
}

export const ChatComponent = ({ 
  messages, 
  setMessages, 
  mode, 
  onSceneFound, 
  onModeChange, 
  taskId 
}: ChatComponentProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    if (mode === "scene_search") {
      try {
        const response = await axios.get<{ scenes: Scene[] }>(`${API_BASE_URL}/tasks/${taskId}/scene_search`, {
          params: {
            q: input,
            limit: 3
          }
        });
        
        const scenes = response.data.scenes;
        if (scenes.length > 0) {
          onSceneFound?.(scenes);
          const resultMessage: Message = {
            sender: "ai",
            text: `${scenes.length}件のシーンが見つかりました。シーンリストに追加しました。`
          };
          setMessages((prev: Message[]) => [...prev, resultMessage]);
        } else {
          setMessages((prev: Message[]) => [...prev, { sender: "ai", text: "シーンが見つかりませんでした。" }]);
        }
      } catch (error) {
        console.error("Error searching scenes:", error);
        setMessages((prev: Message[]) => [...prev, { sender: "ai", text: "シーンの検索中にエラーが発生しました。" }]);
      }
    } else {
      try {
        const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, {
          message: input
        });
        setMessages((prev: Message[]) => [...prev, { sender: "ai", text: response.data.response }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev: Message[]) => [...prev, { sender: "ai", text: "メッセージの送信中にエラーが発生しました。" }]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <Card className={`p-2 max-w-[80%] ${
                msg.sender === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-foreground"
              }`}>
                {msg.text}
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border">
        <div className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={mode === "chat" ? "メッセージを入力..." : "シーンを検索..."}
            className="flex-1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon"
                className="bg-primary hover:bg-primary/90 flex-shrink-0"
              >
                {mode === "chat" ? <Send className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                onModeChange?.("chat");
                handleSubmit();
              }}>
                <Send className="w-4 h-4 mr-2" />
                メッセージを送信
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                onModeChange?.("scene_search");
                handleSubmit();
              }}>
                <Search className="w-4 h-4 mr-2" />
                シーンを検索
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === "scene_search" ? "検索結果は自動的にシーンリストに追加されます" : ""}
        </p>
      </div>
    </div>
  );
};
