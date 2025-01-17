import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Heart, X } from 'lucide-react';

interface CardListProps {
  cards: Array<{
    id: string;
    title: string;
    content: string;
    author: string;
    mediaUrls?: string[];
    correctCount?: number;
  }>;
  onCardClick?: (cardId: string) => void;
}

export default function CardList({ cards, onCardClick }: CardListProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onCardClick?.(card.id)}
        >
          {card.mediaUrls?.[0] && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={card.mediaUrls[0]}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{card.title}</h3>
              {card.correctCount !== undefined && (
                <div className="flex items-center text-sm text-gray-500">
                  <Heart className="w-4 h-4 mr-1" />
                  {card.correctCount}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">@{card.author}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
