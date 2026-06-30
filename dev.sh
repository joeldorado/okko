#!/bin/bash

# ============================================
# Servidor de Desarrollo con Live Reload
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

PHP_PORT=8000
BS_PORT=3000
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${BLUE}┌─────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  🔄 Servidor con Live Reload                │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────┘${NC}"
echo ""

# Verificar PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP no encontrado.${NC}"
    exit 1
fi

# Liberar puertos si están ocupados
for PORT in $PHP_PORT $BS_PORT; do
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Liberando puerto $PORT...${NC}"
        lsof -ti:$PORT | xargs kill -9 2>/dev/null
        sleep 0.5
    fi
done

# Iniciar PHP en segundo plano
echo -e "${GREEN}▶ Iniciando PHP en puerto $PHP_PORT...${NC}"
php -S localhost:$PHP_PORT -t "$PROJECT_DIR" "$PROJECT_DIR/router.php" &>/dev/null &
PHP_PID=$!
sleep 1

# Verificar que PHP arrancó
if ! kill -0 $PHP_PID 2>/dev/null; then
    echo -e "${RED}❌ No se pudo iniciar el servidor PHP.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ PHP corriendo (PID: $PHP_PID)${NC}"
echo ""
echo -e "${BLUE}🌐 Abre en el navegador:${NC}"
echo -e "   ${YELLOW}http://localhost:$BS_PORT/okko/${NC}"
echo ""
echo -e "${YELLOW}💡 El navegador se recarga solo al guardar archivos${NC}"
echo -e "${YELLOW}💡 Presiona ${RED}Ctrl+C${YELLOW} para detener todo${NC}"
echo ""

# Matar PHP al salir
trap "echo ''; echo -e '${RED}🛑 Deteniendo servidores...${NC}'; kill $PHP_PID 2>/dev/null; exit 0" INT TERM

# Iniciar browser-sync como proxy
npx --yes browser-sync start \
    --proxy "localhost:$PHP_PORT" \
    --files "**/*.html,**/*.css,**/*.js,**/*.php" \
    --port $BS_PORT \
    --no-notify \
    --open

# Si browser-sync termina, matar PHP también
kill $PHP_PID 2>/dev/null
