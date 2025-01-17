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
  if (token) {
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

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    profile_image: string | null;
    token_balance: number;
    created_at: string;
    created_cards: string[];
    correct_cards: string[];
    unnecessary_cards: string[];
  };
  token: string;
}

export interface Card {
  id: string;
  title: string;
  content: string;
  author_id: string;
  media_urls?: string[];
  tags?: string[];
  correct_count: number;
  created_at: string;
  nft_status?: any;
}

export const authAPI = {
  signup: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
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
    return response.data;
  },

  getFeed: async (): Promise<Card[]> => {
    const response = await api.get('/cards/feed');
    return response.data;
  },

  interact: async (cardId: string, type: 'correct' | 'unnecessary') => {
    const response = await api.post(`/cards/${cardId}/interact`, {
      interaction_type: type,
    });
    return response.data;
  },
};

export const tokenAPI = {
  getBalance: async () => {
    const response = await api.get('/tokens/balance');
    return response.data;
  },

  transfer: async (toUserId: string, amount: number) => {
    const response = await api.post('/tokens/transfer', {
      to_user_id: toUserId,
      amount,
    });
    return response.data;
  },
};

export default api;
