/**
 * SymbolIntegration.tsx
 * 
 * This component provides a UI for integrating with Symbol blockchain cards.
 * It allows users to view Symbol cards and convert them to Ethereum NFTs.
 */

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymbolCardComponent from './integration/symbol/SymbolCardComponent';

interface SymbolIntegrationProps {
  ethereumAddress?: string;
  onClose?: () => void;
}

export default function SymbolIntegration({ 
  ethereumAddress = "0x1234...5678", // Default mock address
  onClose 
}: SymbolIntegrationProps) {
  const [activeTab, setActiveTab] = useState("browse");
  const [convertedTokens, setConvertedTokens] = useState<string[]>([]);
  
  const handleConvertSuccess = (tokenId: string) => {
    setConvertedTokens(prev => [...prev, tokenId]);
  };
  
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Symbol Integration</h1>
          <button 
            onClick={onClose}
            className="text-xl p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="browse">Browse Symbol Cards</TabsTrigger>
            <TabsTrigger value="converted">Converted NFTs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold">Symbol Blockchain Integration</h2>
              <p>Browse knowledge cards from the Symbol blockchain and convert them to Ethereum NFTs.</p>
            </div>
            
            <SymbolCardComponent 
              ethereumAddress={ethereumAddress}
              onConvertSuccess={handleConvertSuccess}
            />
          </TabsContent>
          
          <TabsContent value="converted" className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold">Converted NFTs</h2>
              <p>View your knowledge cards that have been converted to Ethereum NFTs.</p>
            </div>
            
            {convertedTokens.length > 0 ? (
              <div className="space-y-4">
                {convertedTokens.map(tokenId => (
                  <Card key={tokenId} className="p-4">
                    <h3 className="text-lg font-semibold">NFT Token ID: {tokenId}</h3>
                    <p className="text-sm text-gray-500">Successfully converted to Ethereum NFT</p>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={() => window.open(`https://etherscan.io/token/${tokenId}`, '_blank')}
                      >
                        View on Etherscan
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <p>No converted NFTs yet. Convert Symbol cards to see them here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
