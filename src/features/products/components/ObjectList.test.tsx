import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ObjectList } from './ObjectList';
import { productService } from '../services/productService';
import type { Product, CreateProductDto } from '../types/product';

jest.mock('../services/productService');
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Producto 1',
    price: '10',
    image: 'img1.jpg',
    description: 'Desc 1',
    status: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Producto 2',
    price: '20',
    image: 'img2.jpg',
    description: 'Desc 2',
    status: false,
    createdAt: '2024-01-02',
  },
];

const mockOnCreate = jest.fn<Promise<boolean>, [CreateProductDto]>();

describe('ObjectList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar la lista y filtrar productos', async () => {
    const user = userEvent.setup();

    render(
      <ObjectList products={mockProducts} loading={false} error={null} onCreate={mockOnCreate} />
    );

    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/buscar por nombre/i);
    await user.type(searchInput, 'Producto 1');

    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.queryByText('Producto 2')).not.toBeInTheDocument();
  });

  it('debería abrir el modal de crear producto', async () => {
    const user = userEvent.setup();

    render(
      <ObjectList products={mockProducts} loading={false} error={null} onCreate={mockOnCreate} />
    );

    const newBtn = screen.getByRole('button', { name: /nuevo producto/i });
    await user.click(newBtn);

    await waitFor(() => {
      expect(screen.getByText(/crear/i)).toBeInTheDocument();
    });
  });

  it('debería cerrar el modal si create es exitoso', async () => {
    const user = userEvent.setup();

    mockOnCreate.mockResolvedValue(true);

    render(
      <ObjectList products={mockProducts} loading={false} error={null} onCreate={mockOnCreate} />
    );

    const newBtn = screen.getByRole('button', { name: /nuevo producto/i });
    await user.click(newBtn);

    const nameInput = await screen.findByLabelText(/nombre/i);
    await user.type(nameInput, 'Nuevo Producto');

    const saveBtn = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByLabelText(/nombre/i)).not.toBeInTheDocument();
    });
  });

  it('debería abrir el detalle y llamar a la API (Fetch on Demand)', async () => {
    const user = userEvent.setup();

    const productDetail: Product = {
      ...mockProducts[0],
      description: 'Detalle fresco de API',
    };

    (productService.getById as jest.Mock).mockResolvedValue(productDetail);

    render(
      <ObjectList products={mockProducts} loading={false} error={null} onCreate={mockOnCreate} />
    );

    const eyeIcons = await screen.findAllByTestId('VisibilityIcon');
    await user.click(eyeIcons[0]);

    await waitFor(() => {
      expect(productService.getById).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(screen.getByText(/detalle fresco de api/i)).toBeInTheDocument();
    });
  });

  it('debería manejar error al cargar detalle', async () => {
    const user = userEvent.setup();

    (productService.getById as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <ObjectList products={mockProducts} loading={false} error={null} onCreate={mockOnCreate} />
    );

    const eyeIcons = await screen.findAllByTestId('VisibilityIcon');
    await user.click(eyeIcons[0]);

    await waitFor(() => {
      expect(productService.getById).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(screen.getByText(/no se pudo cargar la información/i)).toBeInTheDocument();
    });
  });

  it('debería renderizar mensaje de error si error prop existe', () => {
    render(
      <ObjectList products={[]} loading={false} error="Error crítico" onCreate={mockOnCreate} />
    );

    expect(screen.getByText(/error crítico/i)).toBeInTheDocument();
  });

  it('debería mostrar loading cuando loading=true y no hay productos', () => {
    render(<ObjectList products={[]} loading={true} error={null} onCreate={mockOnCreate} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
