jest.mock('../../config/env', () => ({
  API_URL: 'http://localhost:3000/api',
  IMGBB_API_KEY: 'test-key-mock',
  getEnv: (key: string) => process.env[key] || '',
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts } from './useProducts';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
jest.mock('../services/productService');

const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    price: '100',
    image: 'url',
    description: 'desc',
    status: true,
    createdAt: 'date',
  },
];

describe('useProducts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería iniciar con loading true y luego cargar productos', async () => {
    (productService.getAll as jest.Mock).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores en fetchProducts', async () => {
    (productService.getAll as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar los productos');
    expect(result.current.products).toEqual([]);
  });

  it('createProduct debería llamar al servicio y recargar la lista', async () => {
    (productService.getAll as jest.Mock).mockResolvedValue([]);
    (productService.create as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success: boolean | undefined;

    await act(async () => {
      success = await result.current.createProduct({ name: 'New', price: '200', image: 'url', description: 'desc' } as Product);
    });

    expect(success).toBe(true);
    expect(productService.create).toHaveBeenCalledTimes(1);
    expect(productService.getAll).toHaveBeenCalledTimes(2);
  });
});
