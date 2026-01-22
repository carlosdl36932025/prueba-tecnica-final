import axiosInstance from '../../../config/axios';
import type { Product, CreateProductDto } from '../types/product';

const PRODUCTS_ENDPOINT = '/products';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>(PRODUCTS_ENDPOINT);
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await axiosInstance.post<Product>(PRODUCTS_ENDPOINT, data);
    return response.data;
  },
};
