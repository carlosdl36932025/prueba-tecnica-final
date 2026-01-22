import { Box, Container, AppBar, Toolbar, Typography, Paper, Grid } from '@mui/material';
import { ObjectList } from './features/products/components/ObjectList';
import { useProducts } from './features/products/hooks/useProducts';

function App() {
  const { products, loading, error, createProduct } = useProducts();

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        pb: 4,
        overflowX: 'hidden',
      }}
    >
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Panel de Administración de Productos
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Prueba Técnica Senior v1.0
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
                <Typography variant="h5" color="text.primary" fontWeight="500">
                  Inventario
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestión centralizada de productos.
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <ObjectList
                  products={products}
                  loading={loading}
                  error={error}
                  onCreate={createProduct}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
