import { render, screen, waitFor } from '@testing-library/react';
import { ObjectForm } from './ObjectForm';
import userEvent from '@testing-library/user-event';

jest.mock('../services/uploadService', () => ({
  uploadService: {
    uploadImage: jest.fn().mockResolvedValue('http://fake-url.com/img.jpg'),
  },
}));

describe('ObjectForm Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('debería mostrar errores de validación si se envía vacío', async () => {
    const user = userEvent.setup();
    render(<ObjectForm onSubmit={mockSubmit} isLoading={false} />);

    const submitBtn = screen.getByRole('button', { name: /Crear Producto/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/El nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/Debes subir una imagen válida/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('debería permitir escribir y enviar datos válidos', async () => {
    const user = userEvent.setup();
    mockSubmit.mockResolvedValue(true);

    const { container } = render(<ObjectForm onSubmit={mockSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText(/Nombre/i), 'Producto Jest');
    await user.type(screen.getByLabelText(/Precio/i), '150.00');
    await user.type(screen.getByLabelText(/Descripción/i), 'Test con Jest oficial');

    const checkbox = screen.getByLabelText(/Producto Activo/i);
    await user.click(checkbox);

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(fileInput, file);

    const submitBtn = screen.getByRole('button', { name: /Crear Producto/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Producto Jest',
        image: 'http://fake-url.com/img.jpg',
      })
    );
  });
});
