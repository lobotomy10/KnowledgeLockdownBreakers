import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Heart, X, Coins, Languages } from "lucide-react"
import CreateCard from './CreateCard'
import { translations, type Language } from '@/lib/translations'
import { TutorialOverlay } from './components/TutorialOverlay'
import { Signup } from '@/components/Signup'

interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  author_id: string;
  media_urls?: string[];
  tags?: string[];
  correct_count: number;
  created_at: string;
}

function App() {
  const [showTutorial, setShowTutorial] = useState(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    return !hasSeenTutorial
  })
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language')
    return (savedLanguage === 'ja' ? 'ja' : 'en') as Language
  })
  const t = translations[language]

  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const userData = localStorage.getItem('user')
    return !!userData
  })
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  })
  
  // Use token balance from authenticated user
  const [tokens, setTokens] = useState(() => user?.token_balance ?? 15)

  // Fetch user's token balance
  useEffect(() => {
    if (!user) return;

    const fetchTokenBalance = async () => {
      try {
        const response = await fetch(`https://cardnote-backend-wbgoevjh.fly.dev/api/tokens/balance/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch token balance');
        }
        const data = await response.json();
        setTokens(data.balance);
      } catch (err) {
        console.error('Failed to fetch token balance:', err);
      }
    };

    fetchTokenBalance();
  }, [user]);
  
  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    setTokens(15)
  }
  
  const [cards, setCards] = useState<KnowledgeCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://cardnote-backend-wbgoevjh.fly.dev/api/cards/feed')
        if (!response.ok) {
          throw new Error('Failed to fetch cards')
        }
        const data = await response.json()
        setCards(data.sort((a: KnowledgeCard, b: KnowledgeCard) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCards()
  }, [])

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!user) return;

    try {
      const response = await fetch(`https://cardnote-backend-wbgoevjh.fly.dev/api/cards/${cards[currentCardIndex].id}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interaction_type: direction === 'right' ? 'correct' : 'unnecessary',
          user_id: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process interaction');
      }

      const data = await response.json();
      setTokens(data.new_balance);
    } catch (err) {
      console.error('Failed to process swipe:', err);
    }

    setCurrentCardIndex(prev => prev + 1);
  }

  if (!isAuthenticated) {
    return <Signup 
      setIsAuthenticated={setIsAuthenticated}
      setUser={setUser}
      setTokens={setTokens}
      language={language}
    />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{t.appName}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-500" />
            <span className="font-semibold">{tokens}</span>
            {/* Token change indicator */}
            <span className="text-sm text-gray-500">
              {t.correctSwipe}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newLang = language === 'en' ? 'ja' : 'en'
              setLanguage(newLang)
              localStorage.setItem('language', newLang)
            }}
          >
            <Languages className="h-4 w-4 mr-2" />
            {language.toUpperCase()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            {t.logout}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : currentCardIndex < cards.length ? (
          <div className="max-w-sm mx-auto">
            {/* Knowledge Card */}
            <Card className="w-full aspect-[3/4] relative">
              <div className="p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4">{cards[currentCardIndex].title}</h2>
                <p className="text-gray-600 flex-grow">
                  {cards[currentCardIndex].content}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>By: {cards[currentCardIndex].author_id}</p>
                  <p>❤️ {cards[currentCardIndex].correct_count}</p>
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
            <p className="text-xl text-gray-600 mb-4">{t.noCards}</p>
            <Button onClick={() => setShowCreateCard(true)}>
              {t.createNewCard}
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

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay
          onClose={() => {
            setShowTutorial(false)
            localStorage.setItem('hasSeenTutorial', 'true')
          }}
          language={language}
        />
      )}
    </div>
  )
}

export default App
