import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Heart, X, Coins, Menu, Check, User, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CreateCard from './CreateCard'

interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
}

function App() {
  const [tokens, setTokens] = useState(50)
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
      setTokens((prev: number) => prev - 2)
    }
    setCurrentCardIndex((prev: number) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-40">
        <h1 className="text-xl font-bold">CardNote</h1>
        <div className="flex items-center gap-2">
          <Coins className="text-yellow-500" />
          <span className="font-semibold">{tokens}</span>
          {/* Token change indicator */}
          <span className="text-sm text-gray-500">
            (Correct: -2)
          </span>

          {/* Hamburger Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <nav className="flex flex-col space-y-4">
                <button className="text-lg font-semibold flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                  <Check className="w-5 h-5" />
                  Correct済みカード
                </button>
                <button className="text-lg font-semibold flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                  <User className="w-5 h-5" />
                  プロフィール
                </button>
                <button className="text-lg font-semibold flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5" />
                  作成したカード
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 mt-16">
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
            <p className="text-xl text-gray-600 mb-4">レビューするカードがありません！</p>
            <Button onClick={() => setCurrentCardIndex(0)}>
              最初からやり直す
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
              onSave={() => {
                // TODO: Implement card saving logic
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
