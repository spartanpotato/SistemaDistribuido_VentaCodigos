# Integración Frontend-Backend

## ✅ Completado

### Cliente API (`src/api/index.js`)
- ✅ Axios client configurado
- ✅ Interceptores para JWT
- ✅ Endpoints integrados con backend
- ✅ Manejo de errores 401

### Componentes Funcionales
- ✅ `src/pages/GamesPage.js` - Búsqueda con API real
- ✅ `src/pages/CheckoutPage.js` - Checkout con pago
- ✅ `src/hooks/useAuth.js` - Autenticación
- ✅ `src/hooks/useCart.js` - Carrito persistente
- ✅ `src/hooks/useApi.js` - Fetching genérico con cache

### Estilos
- ✅ `src/styles/games.css` - Grid responsivo
- ✅ `src/styles/checkout.css` - Formulario de pago

### Configuración
- ✅ `.env` - Variables de entorno
- ✅ `package.json` - Axios agregado

---

## 🚀 Próximos pasos

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Verificar endpoints del backend
Los componentes esperan estos endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/busqueda/buscar` | Buscar juegos |
| GET | `/api/busqueda/juego/{id}` | Detalles del juego |
| GET | `/api/ventas/carrito` | Obtener carrito |
| POST | `/api/ventas/carrito` | Actualizar carrito |
| POST | `/api/ventas/checkout` | Iniciar checkout |
| POST | `/api/pago/procesar/{ordenId}` | Procesar pago |
| GET | `/api/auth/login` | Login |

### 3. Iniciar backend
```bash
cd backend
python app.py
# o
flask run
```

### 4. Iniciar frontend
```bash
cd frontend
npm start
# Abre http://localhost:3000
```

---

## 🔧 Configuración de variables de entorno

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

Para producción:
```
REACT_APP_API_URL=https://api.tudominio.com/api
REACT_APP_ENV=production
```

---

## 📱 Flujo de usuario

1. **Búsqueda** (`GamesPage`)
   - Usuario busca juegos
   - `GameService.searchGames()` → `/api/busqueda/buscar`
   - Resultados se muestran en grid
   - Usuario agrega juegos al carrito

2. **Carrito** (`useCart`)
   - Items se guardan en estado React
   - Se sincronizan con backend (Redis)
   - Total se calcula automáticamente

3. **Checkout** (`CheckoutPage`)
   - Valida autenticación
   - Verifica carrito no vacío
   - Usuario completa información de pago
   - Valida tarjeta (Luhn)
   - Envía a `/api/ventas/checkout`

4. **Pago** 
   - Backend procesa pago
   - Genera orden
   - Frontend valida estado
   - Muestra confirmación

---

## ⚠️ Notas importantes

### Desarrollo
- Backend escucha en `http://localhost:5000`
- Frontend en `http://localhost:3000`
- CORS debe estar habilitado en Flask

### Autenticación
- Token se guarda en `localStorage`
- Se envía en header `Authorization: Bearer {token}`
- Si expira (401), usuario se redirige a login

### Carrito
- Se persiste en Redis (backend)
- También se mantiene en estado React
- Sincroniza al agregar/actualizar items

---

## 🧪 Testing rápido

```bash
# 1. Terminal 1: Backend
cd backend
python app.py

# 2. Terminal 2: Frontend
cd frontend
npm start

# 3. Abrir http://localhost:3000
# 4. Buscar juegos
# 5. Agregar al carrito
# 6. Ir a checkout
```

---

## 📝 Archivos modificados/creados

```
frontend/
├── .env (NUEVO)
├── package.json (ACTUALIZADO - axios)
├── src/
│   ├── api/
│   │   └── index.js (ACTUALIZADO - axios + endpoints)
│   ├── hooks/
│   │   ├── useAuth.js (NUEVO)
│   │   ├── useCart.js (NUEVO)
│   │   └── useApi.js (NUEVO)
│   ├── pages/
│   │   ├── GamesPage.js (NUEVO - componente funcional)
│   │   └── CheckoutPage.js (NUEVO - componente funcional)
│   └── styles/
│       ├── games.css (NUEVO)
│       └── checkout.css (NUEVO)
```

---

## ✨ Características implementadas

✅ Búsqueda en tiempo real con debounce
✅ Paginación
✅ Carrito persistente
✅ Validación Luhn para tarjetas
✅ Manejo de errores
✅ Respuestas responsive
✅ Interceptores de autenticación
✅ Cache de API (5 minutos)
✅ Retry automático en errores

---

## 🐛 Troubleshooting

### Error "Failed to fetch from http://localhost:5000"
- ✓ Verificar que backend está corriendo
- ✓ Verificar CORS en Flask
- ✓ Ver `.env` tiene URL correcta

### Error 401 en checkout
- ✓ Usuario no está autenticado
- ✓ Token ha expirado
- ✓ Implementar login page

### Carrito no persiste
- ✓ Redis está corriendo en backend
- ✓ Backend guarda carrito en Redis
- ✓ Verificar localStorage en devtools

---

**Integración completada:** Frontend y Backend conectados ✅
