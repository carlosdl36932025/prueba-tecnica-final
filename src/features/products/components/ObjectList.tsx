import { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  TextField,
  Box,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import type { Product, CreateProductDto } from '../types/product';
import { ObjectCard } from './ObjectCard';
import { ObjectForm } from './ObjectForm';
import { productService } from '../services/productService';

interface ObjectListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onCreate: (data: CreateProductDto) => Promise<boolean>;
}

export const ObjectList = ({ products, loading, error, onCreate }: ObjectListProps) => {
  const [filter, setFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleViewDetail = async (id: string) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setSelectedProduct(null);

    try {
      const freshProduct = await productService.getById(id);
      setSelectedProduct(freshProduct);
    } catch (err) {
      console.error('Error al obtener detalle', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, filterable: true },
    {
      field: 'image',
      headerName: 'Imagen',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}
        >
          <Avatar
            variant="rounded"
            src={params.value as string}
            alt="Product"
            sx={{ width: 40, height: 40 }}
          />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Nombre del Producto', flex: 1, minWidth: 200 },
    { field: 'price', headerName: 'Precio', width: 130, type: 'number' },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip
            label={params.value ? 'Activo' : 'Inactivo'}
            color={params.value ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title="Ver Detalle Actualizado">
            <IconButton
              color="primary"
              onClick={() => handleViewDetail(params.row.id)}
              size="small"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const safeProducts = Array.isArray(products) ? products : [];

  const rows = safeProducts.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
  const handleCreateWrapper = async (data: CreateProductDto) => {
    const success = await onCreate(data);
    if (success) {
      setTimeout(() => setIsCreateModalOpen(false), 1500);
    }
    return success;
  };

  if (loading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 3,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flexGrow: 1, maxWidth: 500 }}>
          <TextField
            label="Buscar por nombre..."
            variant="outlined"
            fullWidth
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          size="medium"
          sx={{ boxShadow: 2 }}
        >
          Nuevo Producto
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', minHeight: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          rowHeight={60}
          loading={loading}
          sx={{ border: 0 }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
              printOptions: { disableToolbarButton: true },
            },
          }}
        />
      </Box>

      <Dialog open={isDetailOpen} onClose={() => setIsDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f5f5f5' }}>
          {detailLoading ? 'Cargando información...' : 'Detalle del Producto'}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: 200 }}
        >
          {detailLoading ? (
            <CircularProgress />
          ) : selectedProduct ? (
            <ObjectCard product={selectedProduct} />
          ) : (
            <Alert severity="warning">No se pudo cargar la información.</Alert>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <ObjectForm onSubmit={handleCreateWrapper} isLoading={loading} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
