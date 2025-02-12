import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatComponent } from "./ChatComponent";
import { PdfViewer } from "./PdfViewer";

interface Scene {
  timestamp: number;
  description: string;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatWithPdfTabsProps {
  taskId: string;
  onSceneFound: (scenes: Scene[]) => void;
}

export const ChatWithPdfTabs = ({ taskId, onSceneFound }: ChatWithPdfTabsProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMode, setChatMode] = useState<"chat" | "scene_search">("chat");
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
      <TabsList className="flex-none w-full p-1 bg-muted/50 backdrop-blur-sm">
        <TabsTrigger value="chat" className="flex-1 transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground">チャット</TabsTrigger>
        <TabsTrigger value="pdf" className="flex-1 transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground">PDFビューア</TabsTrigger>
      </TabsList>
      <TabsContent value="chat" className="flex-1 mt-0 border rounded-lg border-border/50 overflow-hidden">
        <ChatComponent
          messages={messages}
          setMessages={setMessages}
          mode={chatMode}
          onSceneFound={onSceneFound}
          onModeChange={setChatMode}
          taskId={taskId}
        />
      </TabsContent>
      <TabsContent value="pdf" className="flex-1 mt-0 border rounded-lg border-border/50 overflow-hidden">
        <PdfViewer taskId={taskId} />
      </TabsContent>
    </Tabs>
  );
};
