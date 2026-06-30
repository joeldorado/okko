#!/bin/bash

# ============================================
# Script de Optimización de Imágenes - OKKO
# ============================================

echo "🚀 Iniciando optimización de imágenes..."
echo ""

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si ImageMagick está instalado
if ! command -v mogrify &> /dev/null; then
    echo -e "${RED}❌ ImageMagick no está instalado.${NC}"
    echo -e "${YELLOW}Instalando ImageMagick...${NC}"

    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo -e "${RED}Error: Homebrew no está instalado.${NC}"
        echo "Instala ImageMagick manualmente desde: https://imagemagick.org/script/download.php"
        exit 1
    fi
fi

# Crear backup
echo -e "${YELLOW}📦 Creando backup de imágenes originales...${NC}"
if [ ! -d "./images-backup" ]; then
    cp -r ./images ./images-backup
    echo -e "${GREEN}✅ Backup creado en ./images-backup${NC}"
else
    echo -e "${YELLOW}⚠️  Backup ya existe, saltando...${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Optimizando imágenes...${NC}"
echo ""

# Contador
count=0

# Optimizar JPGs
echo "📸 Optimizando archivos JPG/JPEG..."
while IFS= read -r -d '' file; do
    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

    # Optimizar: calidad 85%, ancho máximo 1920px
    mogrify -quality 85 -resize '1920x1920>' -strip "$file"

    new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    saved=$((original_size - new_size))
    saved_mb=$(echo "scale=2; $saved / 1048576" | bc)

    echo "  ✓ $(basename "$file") - Reducido: ${saved_mb} MB"
    ((count++))
done < <(find ./images -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

# Optimizar PNGs
echo ""
echo "🎨 Optimizando archivos PNG..."
while IFS= read -r -d '' file; do
    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

    # Optimizar: calidad 85%, ancho máximo 1920px
    mogrify -quality 85 -resize '1920x1920>' -strip "$file"

    new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    saved=$((original_size - new_size))
    saved_mb=$(echo "scale=2; $saved / 1048576" | bc)

    echo "  ✓ $(basename "$file") - Reducido: ${saved_mb} MB"
    ((count++))
done < <(find ./images -type f -iname "*.png" -print0)

echo ""
echo -e "${GREEN}✅ Optimización completada!${NC}"
echo -e "${GREEN}📊 Total de imágenes optimizadas: $count${NC}"
echo ""

# Calcular tamaño total
total_size=$(du -sh ./images | awk '{print $1}')
echo -e "${YELLOW}💾 Tamaño total de carpeta images: $total_size${NC}"

echo ""
echo -e "${GREEN}🎉 ¡Listo! Ahora sube las imágenes optimizadas a producción.${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Para restaurar originales, usa: cp -r ./images-backup/* ./images/${NC}"
