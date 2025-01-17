import * as React from 'react';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, X, Lock } from 'lucide-react';
import SpecialContent from "./SpecialContent";

interface KnowledgeCardProps {
  id: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  author: string;
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function KnowledgeCard({
  id,
  title,
  content,
  mediaUrls = [],
  author,
  onSwipe,
}: KnowledgeCardProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - startX.current;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > 100) {
      onSwipe(dragOffset > 0 ? 'right' : 'left');
    }
    setDragOffset(0);
  };

  const getSwipeStyle = () => {
    if (!isDragging) return {};
    const rotate = dragOffset * 0.1;
    return {
      transform: `translateX(${dragOffset}px) rotate(${rotate}deg)`,
      transition: isDragging ? 'none' : 'transform 0.3s',
    };
  };

  const [showSpecialContent, setShowSpecialContent] = useState(false);

  return (
    <>
      <Card
      className="w-full aspect-[9/16] max-w-sm mx-auto relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={getSwipeStyle()}
    >
      <CardHeader className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/50 to-transparent text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm opacity-90">@{author}</p>
      </CardHeader>

      <CardContent className="h-full p-0">
        {mediaUrls.length > 0 ? (
          <div className="w-full h-full">
            <img
              src={mediaUrls[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 p-6">
            <p className="text-gray-600">{content}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent text-white">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <X className="w-6 h-6 mr-2" />
            <span>{t('card.swipeUnnecessary')}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSpecialContent(true);
              }}
              className="flex items-center text-white hover:text-yellow-300 transition-colors"
            >
              <Lock className="w-6 h-6 mr-2" />
              <span>{t('tokens.specialContent')}</span>
            </button>
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              <span>{t('card.swipeCorrect')}</span>
            </div>
          </div>
        </div>
      </CardFooter>

      {/* Swipe Indicators */}
      <div
        className={`absolute inset-0 bg-red-500/20 transition-opacity ${
          dragOffset < -50 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <X className="w-12 h-12 text-white" />
        </div>
      </div>
      <div
        className={`absolute inset-0 bg-green-500/20 transition-opacity ${
          dragOffset > 50 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Heart className="w-12 h-12 text-white" />
        </div>
      </div>
    </Card>

      <Dialog open={showSpecialContent} onOpenChange={setShowSpecialContent}>
        <DialogContent>
          <SpecialContent
            cardId={id}
            title={title}
            previewContent={content.substring(0, 100) + '...'}
            fullContent={content}
            onUnlock={() => setShowSpecialContent(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
