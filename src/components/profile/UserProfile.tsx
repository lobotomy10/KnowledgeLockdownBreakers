import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Coins, Image as ImageIcon, Heart, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

interface UserProfileProps {
  username: string;
  profileImage?: string;
  tokenBalance: number;
  createdCards: any[];
  correctCards: any[];
  unnecessaryCards: any[];
}

export default function UserProfile({
  username,
  profileImage,
  tokenBalance,
  createdCards = [],
  correctCards = [],
  unnecessaryCards = [],
}: UserProfileProps) {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
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
              <div className="flex items-center gap-2 text-yellow-500">
                <Coins />
                <span className="font-semibold">{tokenBalance}</span>
                <span className="text-sm text-gray-500">{t('profile.tokenBalance')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cards Tabs */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="flex space-x-2 mb-4">
          <TabsTrigger value="created" className="flex-1 py-2">
            {t('profile.createdCards')} ({createdCards.length})
          </TabsTrigger>
          <TabsTrigger value="correct" className="flex-1 py-2">
            <Heart className="w-4 h-4 mr-2" />
            {t('profile.correctCards')} ({correctCards.length})
          </TabsTrigger>
          <TabsTrigger value="unnecessary" className="flex-1 py-2">
            <X className="w-4 h-4 mr-2" />
            {t('profile.unnecessaryCards')} ({unnecessaryCards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdCards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="correct">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {correctCards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unnecessary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unnecessaryCards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{card.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
