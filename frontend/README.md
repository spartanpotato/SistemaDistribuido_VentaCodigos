# Frontend - Sistema Distribuido de Venta de Códigos Digitales

## 📋 Descripción

Frontend de React que integra con el backend distribuido para búsqueda de juegos, gestión de carrito, checkout y procesamiento de pagos.

## 🎯 Módulos Integrados

### mod_busqueda
- **Componente**: `src/pages/GamesPage.js`
- **Endpoint**: `GET /api/busqueda/buscar`
- **Features**: Búsqueda en tiempo real, paginación, grid responsivo

### mod_ventas
- **Componente**: `src/pages/CheckoutPage.js`
- **Endpoints**: 
  - `GET /api/ventas/carrito`
  - `POST /api/ventas/carrito`
  - `POST /api/ventas/checkout`
- **Features**: Carrito persistente, resumen de orden

### mod_pago
- **Componente**: `src/pages/CheckoutPage.js`
- **Endpoint**: `POST /api/pago/procesar/{id}`
- **Features**: Validación Luhn, múltiples métodos de pago

### mod_inventario
- **Hook**: `src/hooks/useApi.js`
- **Endpoints**: 
  - `GET /api/inventario/{id}/disponibles`
  - `GET /api/usuario/{id}/claves`

### mod_notificaciones
- **Status**: Autónomo en backend (RabbitMQ)
- **No requiere integración en frontend**

## 🚀 Quick Start

```bash
# 1. Instalar
npm install

# 2. Configurar
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# 3. Backend
cd ../backend
python app.py

# 4. Frontend (en otra terminal)
cd ../frontend
npm start
```

## 📁 Estructura

```
frontend/
├── .env                          # Configuración
├── package.json                  # Dependencias (+ axios)
├── src/
│   ├── api/
│   │   └── index.js             # Axios client con endpoints
│   ├── hooks/
│   │   ├── useAuth.js           # Autenticación
│   │   ├── useCart.js           # Carrito persistente
│   │   └── useApi.js            # Fetch genérico + cache
│   ├── pages/
│   │   ├── GamesPage.js         # Búsqueda
│   │   └── CheckoutPage.js      # Compra
│   └── styles/
│       ├── games.css            # Grid de juegos
│       └── checkout.css         # Formulario pago
├── INTEGRACION.md               # Guía completa
└── INTEGRACION_RAPIDO.md        # Resumen ejecutivo
```

## 🔗 API Endpoints

| Método | Endpoint | Componente | Status |
|--------|----------|-----------|--------|
| GET | `/api/busqueda/buscar` | GamesPage | ✅ |
| GET | `/api/busqueda/juego/{id}` | - | ✅ |
| GET | `/api/ventas/carrito` | useCart | ✅ |
| POST | `/api/ventas/carrito` | useCart | ✅ |
| POST | `/api/ventas/checkout` | CheckoutPage | ✅ |
| GET | `/api/ventas/ordenes/status/{id}` | CheckoutPage | ✅ |
| POST | `/api/pago/procesar/{id}` | CheckoutPage | ✅ |
| GET | `/api/usuario/{id}/claves` | - | ✅ |

## ✨ Features

- ✅ Búsqueda en tiempo real (debounce 500ms)
- ✅ Carrito con persistencia Redis
- ✅ Paginación automática
- ✅ Validación Luhn (tarjetas)
- ✅ Autenticación JWT
- ✅ Cache 5 minutos
- ✅ Retry automático en errores
- ✅ Manejo global de errores
- ✅ Responsive design
- ✅ Interceptores Axios

## 🧪 Testing

```bash
# Test rápido
node QUICK_TEST.js

# En navegador
npm start
# http://localhost:3000
```

## ⚙️ Configuración

### Variables de Entorno

```env
# .env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Requisitos Backend

- Flask escuchando en `http://localhost:5000`
- Redis corriendo
- PostgreSQL disponible
- RabbitMQ disponible

## 📚 Documentación

- **INTEGRACION.md**: Guía técnica completa
- **INTEGRACION_RAPIDO.md**: Resumen ejecutivo
- **INTEGRACION_ESTADO.txt**: Estado de integración

## 🛠️ Stack

- React 19.2.6
- Axios 1.6.0
- JavaScript (no TypeScript)
- CSS Grid + Flexbox
- React Hooks

## ✅ Checklist

- [x] API Client con Axios
- [x] Componentes integrados
- [x] Hooks personalizados
- [x] Estilos responsive
- [x] Validaciones
- [x] Autenticación JWT
- [x] Manejo de errores
- [x] Documentación
- [x] Setup automático

---

**Status**: ✅ LISTO PARA PRODUCCIÓN

Integración completada y validada con todos los módulos del backend.
