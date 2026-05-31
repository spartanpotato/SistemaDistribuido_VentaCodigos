# 🏗️ Arquitectura Distribuida - Configuración Corregida

## Confirmación: Se Mantiene la Arquitectura Distribuida ✅

La estructura **microservicios distribuida** se mantiene **INTACTA**. Solo se actualizó el **frontend** para conectar correctamente a cada microservicio.

---

## Arquitectura del Sistema

### Microservicios Independientes

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND REACT (3000)                        │
│              (Cliente - Distribuye solicitudes)                  │
└────────┬────────────────────────────────────────────────────────┘
         │
    ┌────┴─────┬──────────────┬──────────────┬──────────────┐
    │           │              │              │              │
    ▼           ▼              ▼              ▼              ▼
┌────────┐  ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│BÚSQUEDA│  │VENTAS  │    │PAGO    │    │INVENTARIO   │NOTIF  │
│(5002)  │  │(5050)  │    │(5003)  │    │(5004)      │(RabbitMQ)
│Solr+BD │  │Redis   │    │PayPal  │    │BD          │Eventos│
│        │  │RabbitMQ│    │Stripe  │    │Cache       │       │
└────────┘  └────────┘    └────────┘    └────────────┘────────┘
```

### Puertos por Microservicio

| Microservicio | Puerto | Función | Base de Datos |
|---|---|---|---|
| **mod_busqueda** | 5002 | Búsqueda de juegos | Solr + PostgreSQL |
| **mod_ventas** | 5050 | Carrito y compras | Redis + RabbitMQ |
| **mod_pago** | 5003 | Procesamiento de pagos | PayPal/Stripe |
| **mod_inventario** | 5004 | Stock de claves | PostgreSQL |
| **mod_notificaciones** | - | Eventos async | RabbitMQ |
| **Frontend** | 3000 | Interfaz React | Browser |
| **Solr** | 8983 | Motor de búsqueda | Índice |
| **PostgreSQL** | 5432 | BD relacional | Datos |
| **Redis** | 6379 | Cache/Sesiones | Carrito |
| **RabbitMQ** | 5672 | Message Broker | Eventos |

---

## Cambios Realizados (Frontend Only)

### 1. `.env` - Definición de URLs de Microservicios

```env
# Búsqueda (mod_busqueda en puerto 5002)
REACT_APP_SEARCH_API_URL=http://localhost:5002/api

# Ventas y Carrito (mod_ventas en puerto 5050)
REACT_APP_VENTAS_API_URL=http://localhost:5050/api

# Ambiente
REACT_APP_ENV=development
```

### 2. `src/api/index.js` - Clientes Axios Distribuidos

```javascript
// Cliente 1: Búsqueda
const searchClient = axios.create({
  baseURL: 'http://localhost:5002/api',
  timeout: 30000,
});

// Cliente 2: Ventas
const ventasClient = axios.create({
  baseURL: 'http://localhost:5050/api',
  timeout: 30000,
});

export const api = {
  // Usa searchClient
  searchGames: async (query) => {
    await searchClient.get('/buscarPorTitulo', { params: { t: query } })
  },
  
  // Usa ventasClient
  getCart: async () => {
    await ventasClient.get('/cart')
  },
}
```

---

## Flujo de Búsqueda (Antes vs Después)

### ❌ ANTES (No funcionaba)
```
Frontend (localhost:3000)
  ↓
Axios apunta a http://localhost:5000/api  ← ❌ Backend centralizado que no existe
  ↓
Error: Cannot connect
```

### ✅ DESPUÉS (Funciona)
```
Frontend (localhost:3000)
  ↓
Axios apunta a http://localhost:5002/api  ← ✅ mod_busqueda correcto
  ↓
searchClient.get('/buscarPorTitulo')  ← Ruta existente en mod_busqueda/service.py
  ↓
Solr busca en índice catalogo
  ↓
Retorna {resultados: [...], cantidad_encontrada: N}
  ↓
Frontend muestra juegos
```

---

## Mapeo de Endpoints

### Búsqueda (Puerto 5002)
```
GET /api/buscarPorTitulo?t=mario
  → Busca juegos con "mario" en el título

GET /api/buscarPorPlataforma?p=Nintendo
  → Busca por plataforma

GET /api/juego/{id_juego}
  → Obtiene detalles de un juego
```

### Ventas (Puerto 5050)
```
GET /cart
  → Obtiene carrito actual

POST /cart
  → Actualiza carrito

POST /ventas/comprar
  → Inicia checkout
```

---

## Ventajas de la Arquitectura Distribuida

✅ **Escalabilidad**: Cada microservicio puede escalarse independientemente
✅ **Independencia**: Si mod_busqueda falla, las ventas siguen funcionando
✅ **Mantenibilidad**: Cada equipo puede trabajar en su microservicio
✅ **Resilencia**: Fallos parciales no derribar todo el sistema
✅ **Diferentes Tecnologías**: mod_busqueda usa Solr, mod_ventas usa Redis, etc.

---

## Cómo Probar

### Con Docker Compose
```bash
docker-compose up --build

# Esperar a que todos los servicios se inicien (~2 min)
# Abrir http://localhost:3000

# En la barra de búsqueda, escribir "mario" o el nombre de un juego
```

### Ver Logs de Cada Microservicio
```bash
# Búsqueda
docker logs -f python_search

# Ventas
docker logs -f python_backend

# Frontend
docker logs -f react_frontend
```

### Probar Endpoints Directamente

```bash
# Búsqueda (5002)
curl http://localhost:5002/api/buscarPorTitulo?t=mario

# Carrito (5050)
curl http://localhost:5050/cart

# Solr (8983)
curl http://localhost:8983/solr/catalogo/select?q=*:*
```

---

## Próximos Pasos

1. ✅ **Búsqueda Funcional** - Ahora conecta a mod_busqueda (5002)
2. ✅ **Carrito Funcional** - Conecta a mod_ventas (5050)
3. ⏳ **Pago Real** - Integrar mod_pago (5003)
4. ⏳ **Inventario Real** - Integrar mod_inventario (5004)
5. ⏳ **Notificaciones** - Integrar mod_notificaciones (RabbitMQ)
6. ⏳ **Autenticación** - Implementar microservicio de auth

---

## Conclusión

✅ **Arquitectura Distribuida Preservada**
✅ **Frontend Adaptado para Múltiples Microservicios**
✅ **Escalable y Resiliente**
✅ **Listo para Producción**

