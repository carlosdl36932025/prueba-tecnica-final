import axios from 'axios';
import { productService } from './productService';
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  };
});

const axiosInstance = (axios.create as jest.Mock).mock.results[0].value;

describe('productService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAll debería devolver una lista de productos', async () => {
    const mockData = [{ id: '1', name: 'Test' }];

    axiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await productService.getAll();

    expect(result).toEqual(mockData);
    expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/products'));
  });

  it('getById debería devolver un solo producto', async () => {
    const mockData = { id: '1', name: 'Test' };

    axiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await productService.getById('1');

    expect(result).toEqual(mockData);
    expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/products/1'));
  });

  it('create debería enviar datos y devolver el producto creado', async () => {
    const mockProduct = {
      name: 'New',
      price: '100',
      image: 'test.png',
      status: true,
      description: 'test',
    };
    const mockResponse = { id: '123', createdAt: new Date().toISOString(), ...mockProduct };

    axiosInstance.post.mockResolvedValue({ data: mockResponse });

    const result = await productService.create(mockProduct);

    expect(result).toEqual(mockResponse);
    expect(axiosInstance.post).toHaveBeenCalled();
  });
});
