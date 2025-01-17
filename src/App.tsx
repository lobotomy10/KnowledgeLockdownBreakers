import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Heart, X, Coins, Globe } from "lucide-react"
import CreateCard from './CreateCard'
import NavigationBar from './ui/NavigationBar'
import UserRegistration from './UserRegistration'

type Language = 'en' | 'ja'

const translations = {
  noCards: {
    en: 'No cards to review!',
    ja: 'レビューするカードがありません！'
  },
  createCard: {
    en: 'Create New Card',
    ja: '新しいカードを作成'
  },
  tokenDeduction: {
    en: 'Correct: -2',
    ja: '正解: -2'
  }
}

interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
}

function App() {
  const [tokens, setTokens] = useState(15)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [showRegistration, setShowRegistration] = useState(false)
  
  // Mock data - in production this would come from API
  const cards: KnowledgeCard[] = [
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
      <NavigationBar 
        language={language}
        onRegisterClick={() => setShowRegistration(true)}
      />
      <div className="flex items-center gap-6 fixed top-4 right-4 z-50">
        <button
          onClick={() => setLanguage(prev => prev === 'en' ? 'ja' : 'en')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Globe className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Coins className="text-yellow-500" />
          <span className="font-semibold">{tokens}</span>
          {/* Token change indicator */}
          <span className="text-sm text-gray-500">
            ({translations.tokenDeduction[language]})
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentCardIndex < cards.length ? (
          <div className="max-w-sm mx-auto">
            {/* Knowledge Card */}
            <Card className="w-full aspect-[3/4] relative">
              <div className="p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4">{cards[currentCardIndex].title}</h2>
                <p className="text-gray-600 flex-grow">
                  {cards[currentCardIndex].content}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>{cards[currentCardIndex].author}</p>
                  <p>❤️ {cards[currentCardIndex].likes}</p>
                </div>
              </div>
            </Card>

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
            <p className="text-xl text-gray-600 mb-4">{translations.noCards[language]}</p>
            <Button onClick={() => setShowCreateCard(true)}>
              {translations.createCard[language]}
            </Button>
          </div>
        )}

        {/* Create New Card Button */}
        <div className="fixed bottom-8 right-8">
          <Button 
            size="lg" 
            className="rounded-full p-6"
            onClick={() => setShowCreateCard(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
          {showCreateCard && (
            <CreateCard
              onClose={() => setShowCreateCard(false)}
              onSave={async () => {
                // Card saving is now handled in CreateCard component
                setShowCreateCard(false)
              }}
              language={language}
            />
          )}
        </div>
      </main>

      {/* User Registration Modal */}
      {showRegistration && (
        <UserRegistration
          onClose={() => setShowRegistration(false)}
          onRegister={async () => {
            setShowRegistration(false);
          }}
          language={language}
        />
      )}
    </div>
  )
}

export default App
