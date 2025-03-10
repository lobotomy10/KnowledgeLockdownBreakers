import { useState } from 'react'
import CreateCard from './CreateCard'
import ChatComponent from './components/chat/ChatComponent'
import TestNewChat from './TestNewChat'

// Define temporary components to fix build errors
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, variant, size, className, onClick }: { 
  children: React.ReactNode, 
  variant?: string, 
  size?: string, 
  className?: string, 
  onClick?: () => void 
}) => (
  <button className={className} onClick={onClick}>{children}</button>
);

// Define temporary icons
const Plus = ({ className }: { className?: string }) => <span className={className}>+</span>;
const Heart = ({ className }: { className?: string }) => <span className={className}>❤️</span>;
const X = ({ className }: { className?: string }) => <span className={className}>✕</span>;
const Coins = ({ className }: { className?: string }) => <span className={className}>🪙</span>;

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
  const [showNewUI, setShowNewUI] = useState(true)
  
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
      {showNewUI ? (
        <>
          <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
            <button 
              onClick={() => setShowNewUI(!showNewUI)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#4a5568', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              従来のUIに切り替え
            </button>
          </div>
          <TestNewChat />
        </>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white/95 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CardNote</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNewUI(!showNewUI)}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#4a5568', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                新しいUIに切り替え
              </button>
              <Coins className="text-yellow-500" />
              <span className="font-semibold">{tokens}</span>
              {/* Token change indicator */}
              <span className="text-sm text-gray-500">
                (Correct: -2)
              </span>
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
            <p className="text-xl text-gray-600 mb-4">レビューするカードがありません！</p>
            <Button onClick={() => setShowCreateCard(true)}>
              新しいカードを作成
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
    </>
      )}
    </div>
  )
}

export default App
