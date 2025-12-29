import { api } from './api';

export interface SavedListItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    restaurantId: string;
  };
}

export interface SavedList {
  id: string;
  name: string;
  description?: string | null;
  items: SavedListItem[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedListDto {
  name: string;
  description?: string;
  items: SavedListItem[];
}

export const savedListService = {
  async getAll(): Promise<SavedList[]> {
    const response = await api.get<SavedList[]>('/saved-lists');
    return response.data;
  },

  async getOne(id: string): Promise<SavedList> {
    const response = await api.get<SavedList>(`/saved-lists/${id}`);
    return response.data;
  },

  async create(data: CreateSavedListDto): Promise<SavedList> {
    const response = await api.post<SavedList>('/saved-lists', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateSavedListDto>): Promise<SavedList> {
    const response = await api.put<SavedList>(`/saved-lists/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/saved-lists/${id}`);
  },

  async toggleFavorite(id: string): Promise<SavedList> {
    const response = await api.post<SavedList>(`/saved-lists/${id}/favorite`);
    return response.data;
  },
};

