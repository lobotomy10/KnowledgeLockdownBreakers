import { useEffect } from "react";
import { Card } from "@/components/ui/card";

interface LogoSplashProps {
  onFinish: () => void;
}

export const LogoSplash = ({ onFinish }: LogoSplashProps) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Card className="fixed inset-0 flex items-center justify-center bg-background">
      <img src="/fujitsu-logo.png" alt="Fujitsu Logo" className="h-16" />
    </Card>
  );
};
