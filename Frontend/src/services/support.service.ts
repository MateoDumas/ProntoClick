import { api } from './api';

export interface DashboardStats {
  totalActiveChats: number;
  chatsNeedingSupport: number;
  pendingReports: number;
  inProgressReports: number;
  totalOrdersWithReports: number;
}

export interface ActiveChat {
  id: string;
  userId: string;
  status: string;
  needsSupport?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  hasSurvey?: boolean;
  surveyRating?: number;
  surveyComment?: string;
  resolvedBy?: {
    id: string;
    name: string;
    email: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: any;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PendingReport {
  id: string;
  userId: string;
  orderId: string;
  type: string;
  reason: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  order: {
    id: string;
    total: number;
    status: string;
    restaurant: {
      id: string;
      name: string;
      image?: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
      };
    }>;
  };
}

export interface OrderWithReports {
  order: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    restaurant: {
      id: string;
      name: string;
      image?: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
      };
    }>;
  };
  reports: Array<{
    id: string;
    type: string;
    reason: string;
    status: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/support/dashboard/stats');
  return response.data;
};

export const getActiveChats = async (): Promise<ActiveChat[]> => {
  const response = await api.get<ActiveChat[]>('/support/chats/active');
  return response.data;
};

export const getResolvedChats = async (): Promise<ActiveChat[]> => {
  const response = await api.get<ActiveChat[]>('/support/chats/resolved');
  return response.data;
};

export const getChatHistory = async (sessionId: string): Promise<ChatHistory> => {
  const response = await api.get<ChatHistory>(`/support/chats/${sessionId}`);
  return response.data;
};

export const sendSupportMessage = async (
  sessionId: string,
  content: string,
): Promise<any> => {
  const response = await api.post(`/support/chats/${sessionId}/message`, { content });
  return response.data;
};

export const getPendingReports = async (): Promise<PendingReport[]> => {
  const response = await api.get<PendingReport[]>('/support/reports/pending');
  return response.data;
};

export const getOrdersWithReports = async (): Promise<OrderWithReports[]> => {
  const response = await api.get<OrderWithReports[]>('/support/orders/with-reports');
  return response.data;
};

export const updateReportStatus = async (
  reportId: string,
  status: string,
  notes?: string,
): Promise<any> => {
  const response = await api.put(`/support/reports/${reportId}/status`, {
    status,
    notes,
  });
  return response.data;
};

export interface SupportSurvey {
  id: string;
  sessionId: string;
  supportUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  resolvedAt?: string;
  session: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  supportUser: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SurveyStats {
  total: number;
  averageRating: number;
  ratingsDistribution: Record<number, number>;
}

export const createSurvey = async (sessionId: string): Promise<SupportSurvey> => {
  const response = await api.post<SupportSurvey>(`/support/chats/${sessionId}/survey`);
  return response.data;
};

export const getSurveyStats = async (): Promise<SurveyStats> => {
  const response = await api.get<SurveyStats>('/support/surveys/stats');
  return response.data;
};

export const getAllSurveys = async (): Promise<SupportSurvey[]> => {
  const response = await api.get<SupportSurvey[]>('/support/surveys');
  return response.data;
};

