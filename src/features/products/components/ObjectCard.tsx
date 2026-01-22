import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import type { Product } from '../types/product';

interface ObjectCardProps {
  product: Product;
}

export const ObjectCard = ({ product }: ObjectCardProps) => {
  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia component="img" height="140" image={product.image} alt={product.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {product.id}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          ${product.price}
        </Typography>
        <Chip
          label={product.status ? 'Activo' : 'Inactivo'}
          color={product.status ? 'success' : 'default'}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
