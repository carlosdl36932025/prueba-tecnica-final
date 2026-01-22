# Changelog

## [1.0.0] - 2026-01-22

### 🚀 Features (Funcionalidades)
- **Productos:** Implementado listado de productos con `DataGrid` y filtros avanzados.
- **Productos:** Implementado formulario de creación con validaciones `Zod`.
- **Imágenes:** Integración con servicio **ImgBB** para subida de imágenes real.
- **UX:** Añadido "Fetch-on-Demand" para ver detalles frescos del producto al abrir el modal.
- **UI:** Diseño responsive ocupando el 100% del viewport (borde a borde).

### 🐛 Fixes (Correcciones)
- **Tests:** Solucionado conflicto de `import.meta` con Jest usando mocks de entorno.
- **Estilos:** Corregido bug de Vite que limitaba el ancho máximo de la app.
- **Linter:** Eliminadas variables no usadas en `useProducts` y tests.

### 🧪 Tests (Pruebas)
- Configuración completa de **Jest + React Testing Library**.
- Cobertura de código superior al **80%**.
- Tests unitarios para Servicios (`uploadService`, `productService`).
- Tests de integración para Componentes (`ObjectForm`, `ObjectList`).

### ⚙️ Chore (Configuración)
- Configuración de **Prettier** y **ESLint**.
- Configuración de Husky y Commitlint para estandarización de commits.
- Variables de entorno seguras para Vite y Jest.