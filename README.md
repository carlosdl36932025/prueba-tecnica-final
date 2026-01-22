# 📦 Prueba Técnica - Gestión de Productos

Aplicación web desarrollada con **React + TypeScript + Vite** para la gestión CRUD de productos. Incluye subida de imágenes real, validaciones robustas, diseño responsive y una arquitectura orientada a la mantenibilidad y calidad de código.

## 🚀 Demo y Acceso Rápido

Para facilitar la evaluación, se proporcionan las credenciales de API necesarias para probar la funcionalidad completa (incluyendo la subida de imágenes).

**Variables de Entorno necesarias (`.env`):**

```env
VITE_API_URL=[https://6972398232c6bacb12c63e4f.mockapi.io/api/v1](https://6972398232c6bacb12c63e4f.mockapi.io/api/v1)
VITE_IMGBB_API_KEY=504a0d417321e200af233ffd4008b857
```

## Stack Tecnológico
Core: React 19, TypeScript, Vite.
UI: Material UI (MUI).
Estado & Datos: Axios, Custom Hooks.
Formularios: React Hook Form + Zod (Validación de esquemas).
Testing: Jest, React Testing Library (RTL), Identity Obj Proxy.
Calidad: ESLint, Prettier, Husky, Commitlint (Conventional Commits).
Infraestructura: Docker (Multi-stage build), Nginx.

## Ejecución Local (Recomendado)

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:
Clonar el repositorio e instalar dependencias con npm run install
Configurar el archivo .env con las variables de entorno
Crear archivo .prettierrc en la raiz del proyecto con el siguiente codigo:
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "endOfLine": "auto"
}
Ejecutar npm run dev

## Ejecución con Docker (Producción)
El proyecto incluye un Dockerfile optimizado (multi-stage) que utiliza Nginx para servir los estáticos.
Configurar el archivo .env
Construir la imagen de Docker: docker build -t react-prueba-tecnica .
docker run -d -p 8080:80 react-prueba-tecnica
Abre tu navegador en http://localhost:8080

## Testing y Calidad

Ejecutar todos los tests: npm run test
Ver reporte de cobertura: npm run coverage