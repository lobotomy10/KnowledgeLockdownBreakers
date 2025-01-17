import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";
import { tokenAPI } from '../../services/api';

interface SpecialContentProps {
  cardId: string;
  title: string;
  previewContent: string;
  fullContent: string;
  onUnlock?: () => void;
}

export default function SpecialContent({
  cardId,
  title,
  previewContent,
  fullContent,
  onUnlock,
}: SpecialContentProps) {
  const { t } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    try {
      setError('');
      await tokenAPI.processSpecialContent(cardId);
      setIsUnlocked(true);
      if (onUnlock) {
        onUnlock();
      }
    } catch (error) {
      console.error('Failed to unlock content:', error);
      setError(t('tokens.insufficient'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-xl font-bold">{title}</h3>
      </CardHeader>
      <CardContent>
        {isUnlocked ? (
          <div className="prose">
            <p>{fullContent}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose opacity-50">
              <p>{previewContent}</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Lock className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {t('tokens.specialContent')}
              </p>
              <Button onClick={handleUnlock}>
                {t('card.unlock')}
              </Button>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
