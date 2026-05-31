import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar carrito al montar
  useEffect(() => {
    loadCart();
  }, []);

  // Recalcular total cuando cambien items
  useEffect(() => {
    const newTotal = items.reduce(
      (sum, item) => sum + item.precio_unitario * item.cantidad,
      0
    );
    setTotal(newTotal);
  }, [items]);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getCart();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(async (game) => {
    try {
      const newItem = {
        usuario_id: localStorage.getItem('usuario_id') || 'default',
        juego_id: game.id_juego,
        cantidad: 1,
        precio_unitario: game.precio_base,
        titulo: game.titulo,
      };

      // Verificar si ya existe
      const existingItem = items.find((item) => item.juego_id === game.id_juego);
      let updatedItems;

      if (existingItem) {
        updatedItems = items.map((item) =>
          item.juego_id === game.id_juego
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        updatedItems = [...items, newItem];
      }

      setItems(updatedItems);
      await api.updateCart({ items: updatedItems });
    } catch (err) {
      setError(err.message);
    }
  }, [items]);

  const removeItem = useCallback(
    async (gameId) => {
      try {
        const updatedItems = items.filter((item) => item.juego_id !== gameId);
        setItems(updatedItems);
        await api.updateCart({ items: updatedItems });
      } catch (err) {
        setError(err.message);
      }
    },
    [items]
  );

  const updateQuantity = useCallback(
    async (gameId, cantidad) => {
      try {
        const updatedItems = items.map((item) =>
          item.juego_id === gameId ? { ...item, cantidad } : item
        );
        setItems(updatedItems);
        await api.updateCart({ items: updatedItems });
      } catch (err) {
        setError(err.message);
      }
    },
    [items]
  );

  const clear = useCallback(async () => {
    try {
      setItems([]);
      await api.updateCart({ items: [] });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const getItem = useCallback((gameId) => {
    return items.find((item) => item.juego_id === gameId);
  }, [items]);

  return {
    items,
    total,
    itemCount: items.length,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    getItem,
    loadCart,
  };
};
