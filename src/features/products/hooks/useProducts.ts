import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import type { Product, CreateProductDto } from '../types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (data: CreateProductDto) => {
    setLoading(true);
    try {
      await productService.create(data);
      await fetchProducts();
      return true;
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Error al crear el producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, createProduct, refresh: fetchProducts };
};
