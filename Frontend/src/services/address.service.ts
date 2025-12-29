import { api } from './api';

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  zipCode: string;
  notes?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  label: string;
  street: string;
  city: string;
  zipCode: string;
  notes?: string;
  isDefault?: boolean;
}

export const addressService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get('/addresses');
    return response.data;
  },

  async getById(id: string): Promise<Address> {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  async create(data: CreateAddressDto): Promise<Address> {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateAddressDto>): Promise<Address> {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async setDefault(id: string): Promise<Address> {
    const response = await api.put(`/addresses/${id}/default`);
    return response.data;
  },
};

