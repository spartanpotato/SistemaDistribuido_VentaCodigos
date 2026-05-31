import axios from 'axios';

// URLs de los microservicios distribuidos (redirigidos por nginx)
const SEARCH_API_URL = process.env.REACT_APP_SEARCH_API_URL || 'http://localhost/api';
const VENTAS_API_URL = process.env.REACT_APP_VENTAS_API_URL || 'http://localhost/api';

// Cliente para búsqueda (Microservicio mod_busqueda en puerto 5002)
const searchClient = axios.create({
  baseURL: SEARCH_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente para ventas/carrito (Microservicio en puerto 5050)
const ventasClient = axios.create({
  baseURL: VENTAS_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
const addAuthInterceptor = (client) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(searchClient);
addAuthInterceptor(ventasClient);

export const api = {
  // ============ BÚSQUEDA (mod_busqueda en puerto 5002) ============
  searchGames: async (query = '*', page = 1, limit = 20) => {
    try {
      const res = await searchClient.get('/buscarPorTitulo', {
        params: { t: query },
      });
      return {
        resultados: res.data.resultados || [],
        cantidad_encontrada: res.data.cantidad_encontrada || 0,
        total: res.data.cantidad_encontrada || 0,
      };
    } catch (e) {
      console.error('Search failed:', e.message);
      return { resultados: [], cantidad_encontrada: 0, total: 0 };
    }
  },

  getGameDetails: async (id) => {
    try {
      const res = await searchClient.get(`/juego/${id}`);
      return res.data;
    } catch (e) {
      console.error('Get game details failed:', e.message);
      return null;
    }
  },

  // ============ CARRITO (mod_ventas en puerto 5050) ============
  getCart: async () => {
    try {
      const res = await ventasClient.get('/cart');
      return res.data;
    } catch (e) {
      console.error('Failed to fetch cart:', e.message);
      return { items: [], total_estimado: 0, region_compra: 'LATAM' };
    }
  },

  updateCart: async (cartData) => {
    try {
      const res = await ventasClient.post('/cart', cartData);
      return res.data;
    } catch (e) {
      console.error('Failed to update cart:', e.message);
      return null;
    }
  },

  // ============ CHECKOUT Y PAGO ============
  checkout: async (usuarioId, email) => {
    try {
      const res = await ventasClient.post('/ventas/comprar', {
        usuario_id: usuarioId,
        email,
      });
      return res.data;
    } catch (e) {
      console.error('Checkout failed:', e.message);
      throw e;
    }
  },

  processPayment: async (ordenId, paymentData) => {
    try {
      const res = await ventasClient.post(`/pago/procesar/${ordenId}`, paymentData);
      return res.data;
    } catch (e) {
      console.error('Payment failed:', e.message);
      throw e;
    }
  },

  getOrderStatus: async (ordenId) => {
    try {
      const res = await ventasClient.get(`/ventas/ordenes/status/${ordenId}`);
      return res.data;
    } catch (e) {
      console.error('Failed to get order status:', e.message);
      return null;
    }
  },

  // ============ AUTENTICACIÓN ============
  login: async (usuario, contrasena) => {
    try {
      // TODO: Apuntar al microservicio de autenticación cuando esté listo
      // Por ahora es un mock
      const token = 'mock_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      return { usuario, token };
    } catch (e) {
      console.error('Login failed:', e.message);
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  // ============ INVENTARIO ============
  getInventory: async (gameId, region = 'LATAM') => {
    try {
      const res = await ventasClient.get(`/inventario/${gameId}/disponibles`, {
        params: { region },
      });
      return res.data;
    } catch (e) {
      console.error('Failed to get inventory:', e.message);
      return { disponibles: 0 };
    }
  },

  getUserKeys: async (userId, region = 'LATAM') => {
    try {
      const res = await ventasClient.get(`/usuario/${userId}/claves`, {
        params: { region },
      });
      return res.data;
    } catch (e) {
      console.error('Failed to get user keys:', e.message);
      return { claves: [] };
    }
  },
};
