import axios from 'axios';
import { uploadService } from './uploadService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('uploadService', () => {
  const mockFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería subir una imagen exitosamente y devolver la URL', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { success: true, data: { url: 'https://i.ibb.co/exito.png' } },
    });

    const url = await uploadService.uploadImage(mockFile);
    expect(url).toBe('https://i.ibb.co/exito.png');
  });

  it('debería lanzar error si ImgBB responde success: false', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: false } });
    await expect(uploadService.uploadImage(mockFile)).rejects.toThrow(
      'No se pudo subir la imagen al servidor'
    );
  });

  it('debería lanzar error si la conexión falla (Network Error)', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));
    await expect(uploadService.uploadImage(mockFile)).rejects.toThrow(
      'No se pudo subir la imagen al servidor'
    );
  });
});
