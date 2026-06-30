#!/bin/bash

# ============================================
# Crear ZIP de Producción para GoDaddy
# ============================================

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}┌─────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  📦 Creando ZIP de Producción - GoDaddy     │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────┘${NC}"
echo ""

# Nombre del ZIP
ZIP_NAME="okko.zip"
TEMP_DIR="okko_temp"

# Limpiar archivos anteriores
if [ -f "$ZIP_NAME" ]; then
    echo -e "${YELLOW}🗑️  Eliminando ZIP anterior...${NC}"
    rm "$ZIP_NAME"
fi

if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

# Crear directorio temporal
mkdir -p "$TEMP_DIR"

echo -e "${GREEN}📋 Copiando archivos de producción...${NC}"
echo ""

# Copiar archivos HTML
echo "  ✓ index.html"
cp index.html "$TEMP_DIR/"

# Copiar archivos CSS
echo "  ✓ styles.css"
echo "  ✓ proyectos.css"
echo "  ✓ contacto.css"
cp *.css "$TEMP_DIR/" 2>/dev/null

# Copiar archivos JavaScript
echo "  ✓ script.js"
echo "  ✓ proyectos.js"
echo "  ✓ contacto.js"
cp script.js "$TEMP_DIR/"
cp proyectos.js "$TEMP_DIR/"
cp contacto.js "$TEMP_DIR/"

# Copiar configuración Apache
if [ -f ".htaccess" ]; then
    echo "  ✓ .htaccess"
    cp .htaccess "$TEMP_DIR/"
fi

# Copiar favicon
if [ -f "favicon.ico" ]; then
    echo "  ✓ favicon.ico"
    cp favicon.ico "$TEMP_DIR/"
fi

# Copiar PHP (si existe)
if [ -f "config.php" ]; then
    echo "  ✓ config.php"
    cp config.php "$TEMP_DIR/"
fi

if [ -f "send-email.php" ]; then
    echo "  ✓ send-email.php"
    cp send-email.php "$TEMP_DIR/"
fi

# Copiar carpeta images (excluyendo backups)
if [ -d "images" ]; then
    echo "  ✓ images/ (carpeta completa)"
    mkdir -p "$TEMP_DIR/images"
    rsync -av --exclude='images-backup' --exclude='.DS_Store' images/ "$TEMP_DIR/images/"
fi

# Copiar carpeta music (si existe)
if [ -d "music" ]; then
    echo "  ✓ music/ (carpeta completa)"
    mkdir -p "$TEMP_DIR/music"
    cp -r music/* "$TEMP_DIR/music/" 2>/dev/null
fi

echo ""
echo -e "${GREEN}📦 Comprimiendo archivos...${NC}"

# Crear ZIP
cd "$TEMP_DIR" && zip -r "../$ZIP_NAME" . -x "*.DS_Store" "*/\.*" && cd ..

# Limpiar directorio temporal
rm -rf "$TEMP_DIR"

# Calcular tamaño
ZIP_SIZE=$(du -h "$ZIP_NAME" | awk '{print $1}')

echo ""
echo -e "${GREEN}┌─────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│  ✅ ZIP de Producción Creado                │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${BLUE}📦 Archivo:${NC}      $ZIP_NAME"
echo -e "${BLUE}💾 Tamaño:${NC}       $ZIP_SIZE"
echo -e "${BLUE}📍 Ubicación:${NC}    $(pwd)/$ZIP_NAME"
echo ""
echo -e "${YELLOW}📋 Contenido del ZIP:${NC}"
echo ""
unzip -l "$ZIP_NAME" | head -20
echo ""
echo -e "${GREEN}🚀 Listo para subir a GoDaddy!${NC}"
echo ""
echo -e "${YELLOW}📌 Instrucciones de Subida:${NC}"
echo "   1. Accede a tu cPanel de GoDaddy"
echo "   2. Abre el File Manager"
echo "   3. Navega a public_html/okko/"
echo "   4. Sube el archivo okko.zip"
echo "   5. Extrae el contenido (opción Extract)"
echo "   6. Elimina el archivo okko.zip después de extraer"
echo ""
echo -e "${RED}⚠️  IMPORTANTE:${NC}"
echo "   - Asegúrate de optimizar las imágenes primero: ./optimize-images.sh"
echo "   - Verifica que el archivo .htaccess se haya subido (puede estar oculto)"
echo "   - Prueba el sitio después de subir: https://impulsodigitaldorado.com/okko/"
echo ""
