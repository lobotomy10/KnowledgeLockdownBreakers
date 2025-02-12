import { useState, useRef } from "react";
import { LogoSplash } from "./LogoSplash";
import { VideoWithScenes } from "./VideoWithScenes";
import { ChatWithPdfTabs } from "./ChatWithPdfTabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import "../index.css";

interface Scene {
  timestamp: number;
  description: string;
}

export const MainLayout = () => {
  const videoWithScenesRef = useRef<{ handleScenesFound: (scenes: Scene[]) => void }>(null);
  const [showMain, setShowMain] = useState(false);
  const [taskId] = useState("sample-task-id"); // In production, this would be passed as a prop

  const handleScenesFound = (scenes: Scene[]) => {
    videoWithScenesRef.current?.handleScenesFound(scenes);
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      {!showMain && <LogoSplash onFinish={() => setShowMain(true)} />}
      {showMain && (
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full transition-all"
        >
          <ResizablePanel defaultSize={60} minSize={45} maxSize={70}>
            <div className="h-full p-4">
              <VideoWithScenes ref={videoWithScenesRef} taskId={taskId} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30} maxSize={55}>
            <div className="h-full p-4">
              <ChatWithPdfTabs taskId={taskId} onSceneFound={handleScenesFound} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};
