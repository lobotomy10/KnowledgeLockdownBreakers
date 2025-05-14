/**
 * SymbolBridge.ts
 * 
 * This module provides a bridge between Symbol blockchain (used in KnowledgeCardToken)
 * and Ethereum blockchain (used in KnowledgeLockdownBreakers).
 * 
 * It allows for:
 * 1. Fetching knowledge cards from Symbol blockchain
 * 2. Converting Symbol cards to Ethereum NFTs
 * 3. Syncing user data between platforms
 */

import axios from 'axios';

export interface SymbolCard {
  id: string;
  title: string;
  content: string;
  author: string;
  symbolAddress: string;
  createdAt: string;
  imageUrl?: string;
  videoUrl?: string;
  details?: string;
}

export interface SymbolUser {
  username: string;
  symbolAddress: string;
}

export interface SymbolBridgeConfig {
  apiUrl: string;
  symbolNode: string;
  network: number;
  metaDataKey: string;
}

/**
 * SymbolBridge class provides methods to interact with the Symbol blockchain
 * and bridge data to the Ethereum blockchain.
 */
export class SymbolBridge {
  private config: SymbolBridgeConfig;
  
  constructor(config: SymbolBridgeConfig) {
    this.config = config;
  }
  
  /**
   * Fetches knowledge cards from the Symbol blockchain
   * @returns Promise<SymbolCard[]> Array of knowledge cards
   */
  async fetchSymbolCards(): Promise<SymbolCard[]> {
    try {
      const response = await axios.get(`${this.config.apiUrl}/api/symbol/cards`);
      return response.data.cards || [];
    } catch (error) {
      console.error('Failed to fetch Symbol cards:', error);
      throw new Error('Failed to fetch Symbol cards');
    }
  }
  
  /**
   * Fetches a specific knowledge card from the Symbol blockchain
   * @param id Card ID
   * @returns Promise<SymbolCard> Knowledge card
   */
  async fetchSymbolCard(id: string): Promise<SymbolCard> {
    try {
      const response = await axios.get(`${this.config.apiUrl}/api/symbol/cards/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Symbol card ${id}:`, error);
      throw new Error(`Failed to fetch Symbol card ${id}`);
    }
  }
  
  /**
   * Converts a Symbol card to an Ethereum NFT
   * @param cardId Symbol card ID
   * @param ethereumAddress Ethereum address to mint the NFT to
   * @returns Promise<{ success: boolean, tokenId?: string, error?: string }>
   */
  async convertToNFT(cardId: string, ethereumAddress: string): Promise<{ success: boolean, tokenId?: string, error?: string }> {
    try {
      const response = await axios.post(`${this.config.apiUrl}/api/symbol/convert-to-nft`, {
        cardId,
        ethereumAddress
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to convert Symbol card ${cardId} to NFT:`, error);
      return {
        success: false,
        error: `Failed to convert Symbol card ${cardId} to NFT`
      };
    }
  }
  
  /**
   * Fetches user data from the Symbol blockchain
   * @param symbolAddress Symbol blockchain address
   * @returns Promise<SymbolUser> User data
   */
  async fetchSymbolUser(symbolAddress: string): Promise<SymbolUser> {
    try {
      const response = await axios.get(`${this.config.apiUrl}/api/symbol/users/${symbolAddress}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Symbol user ${symbolAddress}:`, error);
      throw new Error(`Failed to fetch Symbol user ${symbolAddress}`);
    }
  }
  
  /**
   * Decrypts Symbol card data using the Caesar cipher (+3 shift)
   * This mimics the encryption used in KnowledgeCardToken
   * @param encryptedData Encrypted data
   * @returns Decrypted data
   */
  decryptCardData(encryptedData: string): string {
    return encryptedData
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
          const shift = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - shift - 3 + 26) % 26) + shift);
        }
        return char;
      })
      .join('');
  }
}

export const defaultSymbolConfig: SymbolBridgeConfig = {
  apiUrl: 'http://localhost:8000',
  symbolNode: 'https://sym-test.opening-line.jp:3001',
  network: 152,
  metaDataKey: 'knowledge_card'
};
