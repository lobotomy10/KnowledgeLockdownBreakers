import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  profileImage?: File;
}

export interface User {
  id: string;
  email: string;
  username: string;
  profile_image: string | null;
  token_balance: number;
  created_at: string;
  created_cards: string[];
  correct_cards: string[];
  unnecessary_cards: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type Card = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author: string;  // Display name for the author
  media_urls?: string[];
  tags?: string[];
  correct_count: number;
  created_at: string;
  nft_status?: any;
};

export const authAPI = {
  signup: async (signupData: SignUpData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', signupData);
    const authResponse = response.data as AuthResponse;
    localStorage.setItem('auth_token', authResponse.token);
    localStorage.setItem('user_id', authResponse.user.id);
    localStorage.setItem('correct_cards', JSON.stringify(authResponse.user.correct_cards));
    localStorage.setItem('unnecessary_cards', JSON.stringify(authResponse.user.unnecessary_cards));
    return authResponse;
  },
};

export const cardAPI = {
  create: async (data: {
    title: string;
    content: string;
    media_urls?: string[];
    tags?: string[];
  }): Promise<Card> => {
    const response = await api.post('/cards', data);
    return response.data as Card;
  },

  getFeed: async (): Promise<Card[]> => {
    const response = await api.get('/cards/feed');
    return response.data as Card[];
  },

  interact: async (cardId: string, type: 'correct' | 'unnecessary'): Promise<{ message: string; token_change?: number }> => {
    const response = await api.post(`/cards/${cardId}/interact`, {
      interaction_type: type,
    });
    const result = response.data as { message: string; token_change?: number };
    
    // Update card classification in localStorage
    const cardType = type === 'correct' ? 'correct_cards' : 'unnecessary_cards';
    const cards = JSON.parse(localStorage.getItem(cardType) || '[]');
    if (!cards.includes(cardId)) {
      cards.push(cardId);
      localStorage.setItem(cardType, JSON.stringify(cards));
    }
    
    return result;
  },
};

export const tokenAPI = {
  getBalance: async (): Promise<{ balance: number }> => {
    const response = await api.get('/tokens/balance');
    return response.data as { balance: number };
  },

  transfer: async (toUserId: string, amount: number) => {
    const response = await api.post('/tokens/transfer', {
      to_user_id: toUserId,
      amount,
    });
    return response.data;
  },

  processSpecialContent: async (cardId: string): Promise<{ success: boolean; message: string; token_change: number }> => {
    interface SpecialContentResponse {
      success: boolean;
      message: string;
      token_change: number;
    }
    const { data } = await api.post<SpecialContentResponse>(`/tokens/special-content/${cardId}`);
    return data;
  },
};

export default api;
