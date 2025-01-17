import { useTranslation } from 'react-i18next';
import { Card as UICard, CardHeader, CardContent } from "../ui/card";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import TransferTokens from "../tokens/TransferTokens";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Coins, Image as ImageIcon, Heart, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import type { Card as CardType } from '@/services/api';

interface UserProfileProps {
  username: string;
  profileImage?: string;
  tokenBalance: number;
  createdCards?: CardType[];
  correctCards?: CardType[];
  unnecessaryCards?: CardType[];
}

import { useEffect, useState } from 'react';
import { cardAPI, tokenAPI } from '@/services/api';

export default function UserProfile({
  username,
  profileImage,
  tokenBalance: initialBalance,
  createdCards: initialCreatedCards = [],
  correctCards: initialCorrectCards = [],
  unnecessaryCards: initialUnnecessaryCards = [],
}: UserProfileProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [cards, setCards] = useState({
    created: initialCreatedCards,
    correct: initialCorrectCards,
    unnecessary: initialUnnecessaryCards,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceData, cardsData] = await Promise.all([
          tokenAPI.getBalance(),
          cardAPI.getFeed(),
        ]);
        setBalance(balanceData.balance);
        
        // Filter cards by type
        const created = cardsData.filter(card => card.author_id === localStorage.getItem('user_id'));
        const correct = cardsData.filter(card => localStorage.getItem('correct_cards')?.includes(card.id));
        const unnecessary = cardsData.filter(card => localStorage.getItem('unnecessary_cards')?.includes(card.id));
        
        setCards({
          created,
          correct,
          unnecessary,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchData();
  }, []);
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <UICard className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={username} />
              ) : (
                <AvatarFallback>
                  <ImageIcon className="h-10 w-10" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">@{username}</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex items-center gap-2 text-yellow-500 cursor-pointer hover:opacity-80">
                    <Coins />
                    <span className="font-semibold">{balance}</span>
                    <span className="text-sm text-gray-500">{t('profile.tokenBalance')}</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <TransferTokens 
                    onClose={() => {}} 
                    onTransfer={async () => {
                      const balanceData = await tokenAPI.getBalance();
                      setBalance(balanceData.balance);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </UICard>

      {/* Cards Tabs */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="flex space-x-2 mb-4">
          <TabsTrigger value="created" className="flex-1 py-2">
            {t('profile.createdCards')} ({cards.created.length})
          </TabsTrigger>
          <TabsTrigger value="correct" className="flex-1 py-2">
            <Heart className="w-4 h-4 mr-2" />
            {t('profile.correctCards')} ({cards.correct.length})
          </TabsTrigger>
          <TabsTrigger value="unnecessary" className="flex-1 py-2">
            <X className="w-4 h-4 mr-2" />
            {t('profile.unnecessaryCards')} ({cards.unnecessary.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.created.map((card) => (
              <UICard key={card.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
                </CardContent>
              </UICard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="correct">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.correct.map((card) => (
              <UICard key={card.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
                </CardContent>
              </UICard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unnecessary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.unnecessary.map((card) => (
              <UICard key={card.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
                </CardContent>
              </UICard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
