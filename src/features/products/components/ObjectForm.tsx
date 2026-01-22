import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Alert,
  Collapse,
  Avatar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { CreateProductDto } from '../types/product';
import { uploadService } from '../services/uploadService';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe ser detallada'),
  image: z.custom<string | File>(
    (val) => {
      if (val instanceof File) return true;
      if (typeof val === 'string') {
        return z.string().url().safeParse(val).success;
      }
      return false;
    },
    { message: 'Debes subir una imagen válida en formato JPG, PNG o GIF.' }
  ),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Precio inválido (ej: 100.00)'),
  status: z.boolean(),
});

type ProductFormValues = Omit<CreateProductDto, 'image'> & {
  image: string | File;
};

interface ObjectFormProps {
  onSubmit: (data: CreateProductDto) => Promise<boolean>;
  isLoading: boolean;
}

export const ObjectForm = ({ onSubmit, isLoading }: ObjectFormProps) => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: '',
      status: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: ProductFormValues) => {
    setFeedback(null);
    setIsUploading(true);

    try {
      let imageUrl = '';

      if (data.image instanceof File) {
        imageUrl = await uploadService.uploadImage(data.image);
      } else if (typeof data.image === 'string') {
        imageUrl = data.image;
      }

      const finalData: CreateProductDto = {
        ...data,
        image: imageUrl,
      };

      const success = await onSubmit(finalData);

      if (success) {
        setFeedback({ type: 'success', message: '¡Producto creado exitosamente!' });
        reset();
        setPreview(null);
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', message: 'Hubo un problema al crear el producto.' });
      }
    } catch (error) {
      console.error(error);
      setFeedback({
        type: 'error',
        message: 'Error al subir la imagen o conectar con el servidor.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isLoading || isUploading;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}
    >
      <Typography variant="h6" gutterBottom color="text.primary">
        Crear Nuevo Producto
      </Typography>

      <Collapse in={!!feedback}>
        {feedback && (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        )}
      </Collapse>

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            disabled={isBusy}
          />
        )}
      />

      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Precio"
            type="number"
            error={!!errors.price}
            helperText={errors.price?.message}
            fullWidth
            disabled={isBusy}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Descripción"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            disabled={isBusy}
          />
        )}
      />

      <Box
        sx={{
          border: '1px dashed #ccc',
          p: 2,
          borderRadius: 1,
          textAlign: 'center',
          bgcolor: '#fafafa',
        }}
      >
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
          disabled={isBusy}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={isBusy}
          >
            Subir Imagen
          </Button>
        </label>

        {errors.image && (
          <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
            {errors.image.message as string}
          </Typography>
        )}

        {preview && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ mb: 1 }}>
              Vista Previa:
            </Typography>
            <Avatar
              src={preview}
              variant="rounded"
              sx={{ width: 100, height: 100, boxShadow: 3 }}
            />
          </Box>
        )}
      </Box>

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value as boolean} />}
            label="Producto Activo"
            disabled={isBusy}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isBusy}
        sx={{ mt: 1, py: 1.5 }}
      >
        {isUploading ? 'Subiendo Imagen...' : isLoading ? 'Guardando...' : 'Crear Producto'}
      </Button>
    </Box>
  );
};
