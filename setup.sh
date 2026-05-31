#!/bin/bash

echo "🚀 Setup Frontend-Backend Integration"
echo "======================================"

# Instalación frontend
echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

# Crear .env si no existe
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creando archivo .env..."
  cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
EOF
  echo "✅ .env creado"
fi

# Verificar estructura de carpetas
echo ""
echo "📁 Verificando estructura..."
mkdir -p src/hooks src/pages src/styles

# Resumen
echo ""
echo "======================================"
echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Terminal 1 (Backend): cd backend && python app.py"
echo "2. Terminal 2 (Frontend): cd frontend && npm start"
echo "3. Abrir: http://localhost:3000"
echo ""
echo "======================================"
