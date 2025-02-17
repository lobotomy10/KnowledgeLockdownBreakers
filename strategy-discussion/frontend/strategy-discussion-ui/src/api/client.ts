import { Persona, Discussion, Message } from '../types';

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8000';

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(
      `APIエラー: ${response.status} - ${errorText || '不明なエラーが発生しました'}`
    );
  }
  return response.json();
}

export const api = {
  async getPersonas(): Promise<Persona[]> {
    try {
      const response = await fetch(`${API_URL}/personas`);
      const data = await handleResponse<{ personas: Persona[] }>(response);
      return data.personas;
    } catch (error) {
      console.error('Error fetching personas:', error);
      throw new APIError('ペルソナの取得に失敗しました');
    }
  },

  async updatePersona(persona: Persona): Promise<Persona> {
    try {
      const formData = new FormData();
      Object.entries(persona).forEach(([key, value]) => {
        if (key === 'imageFile' && value instanceof File) {
          if (value.size > 300 * 1024 * 1024) {
            throw new APIError('ファイルサイズが大きすぎます（300MB以下）');
          }
          formData.append('image', value);
        } else if (value !== undefined && !(value instanceof File)) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        body: formData,
      });
      const data = await handleResponse<{ persona: Persona }>(response);
      return data.persona;
    } catch (error) {
      console.error('Error updating persona:', error);
      throw new APIError('ペルソナの更新に失敗しました');
    }
  },

  async startDiscussion(content: string): Promise<Discussion> {
    try {
      const response = await fetch(`${API_URL}/discussion/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await handleResponse<{ discussion: Discussion }>(response);
      return data.discussion;
    } catch (error) {
      console.error('Error starting discussion:', error);
      throw new APIError('議論の開始に失敗しました');
    }
  },

  async getNextMessage(): Promise<Message> {
    try {
      const response = await fetch(`${API_URL}/discussion/next`, {
        method: 'POST',
      });
      const data = await handleResponse<{ message: Message }>(response);
      return data.message;
    } catch (error) {
      console.error('Error getting next message:', error);
      throw new APIError('次のメッセージの取得に失敗しました');
    }
  },

  async stopDiscussion(): Promise<{ message_count: number }> {
    try {
      const response = await fetch(`${API_URL}/discussion/stop`, {
        method: 'POST',
      });
      return handleResponse<{ status: string; message_count: number }>(response);
    } catch (error) {
      console.error('Error stopping discussion:', error);
      throw new APIError('議論の停止に失敗しました');
    }
  },
};
