#!/bin/bash

# ============================================
# Servidor de Desarrollo - Similar a GoDaddy
# ============================================

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}┌─────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  🚀 Servidor PHP - Ambiente GoDaddy         │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────┘${NC}"
echo ""

# Verificar PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP no está instalado.${NC}"
    echo -e "${YELLOW}Instala PHP con: brew install php${NC}"
    exit 1
fi

# Mostrar versión de PHP
PHP_VERSION=$(php -v | head -n 1 | cut -d ' ' -f 2)
echo -e "${GREEN}✅ PHP $PHP_VERSION detectado${NC}"
echo ""

# Verificar puerto disponible
PORT=8000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Puerto $PORT ocupado. Deteniendo proceso...${NC}"
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
fi

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo -e "${YELLOW}📁 Directorio: $PROJECT_DIR${NC}"
echo ""

# Información importante
echo -e "${GREEN}┌─────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│  📋 Información del Servidor                │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${BLUE}🌐 URL Local:${NC}       http://localhost:$PORT/okko/"
echo -e "${BLUE}🎯 URL Raíz:${NC}        http://localhost:$PORT/okko/index.html"
echo -e "${BLUE}🎨 URL KOI:${NC}         http://localhost:$PORT/okko/koi"
echo -e "${BLUE}🖤 URL KOA:${NC}         http://localhost:$PORT/okko/koa"
echo ""
echo -e "${YELLOW}💡 Simula la estructura de GoDaddy: /okko/${NC}"
echo -e "${YELLOW}💡 Presiona ${RED}Ctrl+C${YELLOW} para detener el servidor${NC}"
echo ""
echo -e "${GREEN}┌─────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│  ▶️  Iniciando servidor...                   │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────┘${NC}"
echo ""

# Iniciar servidor PHP
cd "$PROJECT_DIR"
php -S localhost:$PORT -t "$PROJECT_DIR" router.php

# Mensaje al cerrar
echo ""
echo -e "${RED}🛑 Servidor detenido${NC}"
echo ""
