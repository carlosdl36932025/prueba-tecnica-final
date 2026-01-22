import axios from 'axios';
import { IMGBB_API_KEY } from '../../../config/env';

interface ImgBBResponse {
  data: {
    id: string;
    url: string;
    display_url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    if (!IMGBB_API_KEY) {
      console.error('Falta la API Key de ImgBB en el archivo .env');
      throw new Error('Configuración del servidor incompleta');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post<ImgBBResponse>(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );

      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error('ImgBB reportó un error en la subida');
      }
    } catch (error) {
      console.error('Error subiendo imagen a ImgBB:', error);
      throw new Error('No se pudo subir la imagen al servidor');
    }
  },
};
