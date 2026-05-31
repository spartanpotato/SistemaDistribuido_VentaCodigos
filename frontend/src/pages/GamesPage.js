import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useCart } from '../hooks/useCart';
import '../styles/games.css';

export const GamesPage = ({ onSelectGame, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [platform, setPlatform] = useState('');

  const cart = useCart();
  const limit = 20;

  // Función de búsqueda con debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = useCallback(async (query, currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const q = query || '*:*';
      const data = await api.searchGames(q, currentPage, limit);
      setGames(data.resultados || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1);
      performSearch(query, 1);
    }, 500),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleAddToCart = (game) => {
    cart.addItem(game);
    if (onAddToCart) onAddToCart(game);
  };

  const handleGameClick = (game) => {
    if (onSelectGame) onSelectGame(game);
  };

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>🎮 Tienda de Juegos</h1>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar juegos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">❌ Error: {error}</div>}

      {loading && <div className="loading">⏳ Cargando juegos...</div>}

      {!loading && games.length === 0 && !error && (
        <div className="empty-state">
          <p>No se encontraron juegos</p>
        </div>
      )}

      {!loading && games.length > 0 && (
        <>
          <div className="games-grid">
            {games.map((game) => (
              <div key={game.id_juego} className="game-card">
                <div className="game-image">
                  <img
                    src={game.imagen || '/placeholder-game.png'}
                    alt={game.titulo}
                  />
                </div>
                <div className="game-info">
                  <h3>{game.titulo}</h3>
                  <p className="platform">{game.plataforma || 'PC'}</p>
                  <div className="price-section">
                    <span className="price">${game.precio_base?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="game-actions">
                    <button
                      className="btn-details"
                      onClick={() => handleGameClick(game)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="btn-cart"
                      onClick={() => handleAddToCart(game)}
                    >
                      🛒 Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1);
                  performSearch(searchTerm, page - 1);
                }}
              >
                ← Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => {
                  setPage(page + 1);
                  performSearch(searchTerm, page + 1);
                }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {cart.items.length > 0 && (
        <div className="cart-summary">
          <p>🛒 Carrito: {cart.items.length} item(s) - Total: ${cart.total.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};
