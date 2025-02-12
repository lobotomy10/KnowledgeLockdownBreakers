import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface SummaryResponse {
  summary: string;
}

interface Scene {
  timestamp: number;
  description: string;
}

interface VideoWithScenesProps {
  taskId: string;
  ref?: React.RefObject<{ handleScenesFound: (scenes: Scene[]) => void }>;
}

export const VideoWithScenes = forwardRef<{ handleScenesFound: (scenes: Scene[]) => void }, VideoWithScenesProps>(
  ({ taskId }, ref) => {
    const [currentTimestamp, setCurrentTimestamp] = useState(0);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [summary, setSummary] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");

    useEffect(() => {
      const fetchVideoUrl = async () => {
        try {
          const response = await axios.get<{ url: string }>(`${API_BASE_URL}/tasks/${taskId}/movie`);
          setVideoUrl(response.data.url);
        } catch (error) {
          console.error("Error fetching video URL:", error);
        }
      };
      fetchVideoUrl();
    }, [taskId]);

    useImperativeHandle(ref, () => ({
      handleScenesFound: (newScenes: Scene[]) => {
        setScenes(prevScenes => {
          const existingTimestamps = new Set(prevScenes.map(scene => scene.timestamp));
          const uniqueNewScenes = newScenes.filter(scene => !existingTimestamps.has(scene.timestamp));
          return [...prevScenes, ...uniqueNewScenes];
        });
      }
    }));

  useEffect(() => {
    setScenes([
      { timestamp: 10, description: "シーン1: 会話開始" },
      { timestamp: 60, description: "シーン2: 重要な発言" },
    ]);

    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<SummaryResponse>(`${API_BASE_URL}/tasks/${taskId}/summary`);
        setSummary(response.data.summary);
      } catch (err: unknown) {
        const error = err as Error;
        setError("要約の取得に失敗しました。" + (error.message ? `: ${error.message}` : ""));
        console.error("Error fetching summary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [taskId]);

  return (
    <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm shadow-lg border-border/50">
      <CardHeader className="border-b border-border/50 py-2">
        <CardTitle className="text-white">動画プレイヤー</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-2 overflow-hidden">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-md">
          <VideoPlayer videoUrl={videoUrl} startTimestamp={currentTimestamp} />
        </div>
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <div className="flex-1 min-h-0">
            <h3 className="text-lg font-semibold mb-1 text-white">シーンリスト</h3>
            <ScrollArea className="h-[calc(100%-2rem)] pr-2">
              {scenes.map((scene, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start mb-1 transition-colors text-white hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setCurrentTimestamp(scene.timestamp)}
                >
                  {scene.timestamp}秒: {scene.description}
                </Button>
              ))}
            </ScrollArea>
          </div>
          <div className="flex-none">
            <h3 className="text-lg font-semibold mb-1 text-white">動画の要約</h3>
            <Card className="p-2 bg-muted/50 shadow-sm max-h-24 overflow-y-auto">
              {isLoading ? (
                <p className="text-white">要約を読み込み中...</p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                <p className="text-white whitespace-pre-wrap">
                  {summary || "要約はまだありません。"}
                </p>
              )}
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
