import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Heart, X, Coins } from "lucide-react"
import CreateCard from './CreateCard'
import { useTranslation } from 'react-i18next'

interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
}

function App() {
  const { t, i18n } = useTranslation()
  const [tokens, setTokens] = useState(15)

  const handleLanguageChange = (lang: "en" | "ja") => {
    i18n.changeLanguage(lang)
  }
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showCreateCard, setShowCreateCard] = useState(false)
  
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
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">{t("CardNote")}</h1>
          {showCreateCard && (
            <span className="text-lg text-gray-600">{t("Preview")}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-500" />
            <span className="font-semibold">{tokens}</span>
            {/* Token change indicator */}
            <span className="text-sm text-gray-500">
              (Correct: -2)
            </span>
          </div>
          <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-3 py-1 text-sm transition-colors ${
                i18n.language === "en" ? "bg-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange("ja")}
              className={`px-3 py-1 text-sm transition-colors ${
                i18n.language === "ja" ? "bg-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              JA
            </button>
          </div>
        </div>
      </header>

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
            <p className="text-xl text-gray-600 mb-4">{t("No cards to review!")}</p>
            <Button onClick={() => setShowCreateCard(true)}>
              {t("Create New Card")}
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
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
