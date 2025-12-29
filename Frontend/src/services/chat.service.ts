import { api } from './api';

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface SendMessageDto {
  content: string;
  sessionId?: string;
}

export const createChatSession = async (): Promise<ChatSession> => {
  const response = await api.post<ChatSession>('/chat/sessions');
  return response.data;
};

export const getUserSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get<ChatSession[]>('/chat/sessions');
  return response.data;
};

export const getSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await api.get<ChatSession>(`/chat/sessions/${sessionId}`);
  return response.data;
};

export const sendMessage = async (
  dto: SendMessageDto,
): Promise<{
  userMessage: ChatMessage;
  assistantMessage: ChatMessage | null; // Puede ser null cuando está conectado con soporte humano
  sessionId: string;
}> => {
  const response = await api.post<{
    userMessage: ChatMessage;
    assistantMessage: ChatMessage | null;
    sessionId: string;
  }>('/chat/messages', dto);
  return response.data;
};

export const closeSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await api.post<ChatSession>(`/chat/sessions/${sessionId}/close`);
  return response.data;
};

export const submitSurvey = async (
  sessionId: string,
  rating: number,
  comment?: string,
): Promise<any> => {
  const response = await api.post(`/chat/sessions/${sessionId}/survey`, {
    rating,
    comment,
  });
  return response.data;
};

