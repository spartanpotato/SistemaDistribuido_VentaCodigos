import React, { useState } from 'react';
import { api } from '../api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import '../styles/checkout.css';

export const CheckoutPage = ({ onSuccess, onError }) => {
  const cart = useCart();
  const auth = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);

  if (!auth.isAuthenticated) {
    return (
      <div className="checkout-page">
        <div className="error-message">
          ❌ Debe estar autenticado para hacer una compra
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="error-message">
          ⚠️ Su carrito está vacío
        </div>
      </div>
    );
  }

  const validateLuhn = (num) => {
    let sum = 0;
    let isEven = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Validar tarjeta si es método seleccionado
      if (paymentMethod === 'card') {
        const cardNumber = formData.cardNumber.replace(/\s/g, '');
        if (!validateLuhn(cardNumber)) {
          throw new Error('Número de tarjeta inválido');
        }
        if (!formData.expiry || !formData.cvv) {
          throw new Error('Faltan datos de tarjeta');
        }
      }

      // Obtener usuario ID (en producción vendría del contexto de autenticación)
      const usuarioId = localStorage.getItem('usuario_id') || 'default';

      // Realizar checkout
      const checkoutResponse = await api.checkout(usuarioId, formData.email || auth.user?.email);
      const ordenId = checkoutResponse.id_orden_compra;

      // Procesar pago
      const paymentResponse = await api.processPayment(ordenId, {
        metodo: paymentMethod,
        ...formData,
      });

      setOrderStatus({
        success: true,
        orderId: ordenId,
        message: paymentResponse.mensaje || 'Pago procesado exitosamente',
      });

      // Limpiar carrito
      cart.clear();

      if (onSuccess) onSuccess(ordenId);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Error en checkout';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderStatus?.success) {
    return (
      <div className="checkout-page">
        <div className="success-message">
          <h2>✅ ¡Compra Exitosa!</h2>
          <p>Orden: #{orderStatus.orderId}</p>
          <p>{orderStatus.message}</p>
          <p>Recibirá un email con sus claves digitales.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>🛒 Finalizar Compra</h1>

        {error && <div className="error-message">❌ {error}</div>}

        <div className="checkout-layout">
          {/* Resumen del carrito */}
          <div className="order-summary">
            <h2>Resumen de Orden</h2>
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item.juego_id} className="order-item">
                  <span>{item.titulo}</span>
                  <span>x{item.cantidad}</span>
                  <span className="item-price">
                    ${(item.precio_unitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: ${cart.total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Formulario de pago */}
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Información de Pago</h2>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                defaultValue={auth.user?.email || ''}
              />
            </div>

            {/* Método de pago */}
            <div className="form-group">
              <label>Método de Pago</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">💳 Tarjeta de Crédito/Débito</option>
                <option value="paypal">🅿️ PayPal</option>
              </select>
            </div>

            {/* Datos de tarjeta */}
            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label>Número de Tarjeta</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="4532 0151 1283 0366"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vencimiento</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      maxLength="4"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-checkout"
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Procesando...' : `💰 Pagar $${cart.total.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
