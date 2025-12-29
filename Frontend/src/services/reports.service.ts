import { api } from './api';

export interface Report {
  id: string;
  userId: string;
  orderId: string;
  type: string;
  reason: string;
  fee: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    total: number;
    status: string;
    restaurant: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}

export const getReports = async (): Promise<Report[]> => {
  const { data } = await api.get<Report[]>('/reports');
  return data;
};

export const getReportById = async (id: string): Promise<Report> => {
  const { data } = await api.get<Report>(`/reports/${id}`);
  return data;
};

export const createReport = async (data: {
  orderId: string;
  type: string;
  reason: string;
  description?: string;
}): Promise<Report> => {
  const response = await api.post<Report>('/reports', data);
  return response.data;
};

