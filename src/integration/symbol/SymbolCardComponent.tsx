/**
 * SymbolCardComponent.tsx
 * 
 * This component displays knowledge cards from the Symbol blockchain
 * and provides functionality to convert them to Ethereum NFTs.
 */

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SymbolBridge, SymbolCard, defaultSymbolConfig } from './SymbolBridge';

interface SymbolCardComponentProps {
  ethereumAddress?: string;
  onConvertSuccess?: (tokenId: string) => void;
}

export default function SymbolCardComponent({ 
  ethereumAddress, 
  onConvertSuccess 
}: SymbolCardComponentProps) {
  const [symbolCards, setSymbolCards] = useState<SymbolCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState<Record<string, boolean>>({});
  
  const symbolBridge = new SymbolBridge(defaultSymbolConfig);
  
  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const cards = await symbolBridge.fetchSymbolCards();
        setSymbolCards(cards);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Symbol cards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCards();
  }, []);
  
  const handleConvertToNFT = async (cardId: string) => {
    if (!ethereumAddress) {
      setError('Ethereum address is required to mint NFT');
      return;
    }
    
    try {
      setConverting(prev => ({ ...prev, [cardId]: true }));
      
      const result = await symbolBridge.convertToNFT(cardId, ethereumAddress);
      
      if (result.success && result.tokenId) {
        if (onConvertSuccess) {
          onConvertSuccess(result.tokenId);
        }
      } else {
        setError(result.error || 'Failed to convert to NFT');
      }
    } catch (err) {
      setError('Failed to convert to NFT');
      console.error(err);
    } finally {
      setConverting(prev => ({ ...prev, [cardId]: false }));
    }
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading Symbol cards...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  
  if (symbolCards.length === 0) {
    return <div className="p-4 text-center">No Symbol cards found</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Symbol Knowledge Cards</h2>
      
      {symbolCards.map(card => (
        <Card key={card.id} className="p-4">
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-sm text-gray-500">By {card.author} ({card.symbolAddress})</p>
          
          {/* Image or Video */}
          {card.imageUrl && (
            <div className="mt-3">
              <img src={card.imageUrl} alt={card.title} className="w-full rounded-md" />
            </div>
          )}
          
          {card.videoUrl && (
            <div className="mt-3">
              <video 
                src={card.videoUrl} 
                controls 
                className="w-full rounded-md"
                poster={card.imageUrl} // Use image as poster if available
              />
            </div>
          )}
          
          {/* Content Preview */}
          <p className="mt-3 text-gray-700">{card.content}</p>
          
          {/* Detailed Content */}
          {card.details && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <h4 className="text-md font-medium mb-2">詳細 / Details</h4>
              <p className="text-sm">{card.details}</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => handleConvertToNFT(card.id)}
              disabled={converting[card.id]}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {converting[card.id] ? 'Converting...' : 'Convert to NFT'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
