import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Plus, Heart, X, Coins, User } from "lucide-react"
import KnowledgeCard from './components/cards/KnowledgeCard'

interface CardData {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
}

function App() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tokens, setTokens] = useState(15)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  
  // Mock data - in production this would come from API
  const cards: CardData[] = [
    {
      id: '1',
      title: 'React Best Practices',
      content: 'Always use functional components and hooks for better code organization and reusability.',
      author: '@reactdev',
      likes: 123,
    },
    {
      id: '2',
      title: 'TypeScript Tips',
      content: 'Use interfaces over types when you need to extend or implement.',
      author: '@tsexpert',
      likes: 89,
    },
  ]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Correct - save card and deduct tokens
      setTokens(prev => prev - 2)
    }
    setCurrentCardIndex(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CardNote</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-500" />
            <span className="font-semibold">{tokens}</span>
            <span className="text-sm text-gray-500">
              ({t('tokens.correct')})
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentCardIndex < cards.length ? (
          <div className="max-w-sm mx-auto">
            {/* Knowledge Card */}
            <KnowledgeCard
              id={cards[currentCardIndex].id}
              title={cards[currentCardIndex].title}
              content={cards[currentCardIndex].content}
              author={cards[currentCardIndex].author}
              onSwipe={handleSwipe}
            />

            {/* Swipe Actions */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full p-4"
                onClick={() => handleSwipe('left')}
              >
                <X className="h-6 w-6 text-red-500" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full p-4"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="h-6 w-6 text-green-500" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">{t('card.noMoreCards')}</p>
            <Button onClick={() => navigate('/create')}>
              {t('card.createNew')}
            </Button>
          </div>
        )}

        {/* Create New Card Button */}
        <div className="fixed bottom-8 right-8">
          <Button 
            size="lg" 
            className="rounded-full p-6"
            onClick={() => navigate('/create')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  )
}

export default App
