export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  status: boolean;
  price: string;
  createdAt: string;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt'>;
