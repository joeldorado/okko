# 🚀 Guía de Optimización de Imágenes - OKKO

## 📊 Situación Actual

Tus imágenes son **MUY PESADAS** (algunas de 5-7 MB). Esto causa:
- ⏱️ Carga lenta de la página
- 💸 Consumo alto de ancho de banda
- 📱 Mala experiencia en móviles
- 🔍 Penalización en SEO de Google

---

## ✅ Sistema Implementado

Ya implementamos **Lazy Loading** con:
1. ✅ Carga diferida (solo cuando la imagen es visible)
2. ✅ Transiciones suaves (fade-in)
3. ✅ Placeholders animados (shimmer effect)
4. ✅ Precarga de primeras 2 imágenes

---

## 🎯 Siguiente Paso: Optimizar Imágenes

### Opción 1: Herramientas Online (Más Fácil) 🌐

**TinyPNG** - https://tinypng.com
- Arrastra tus imágenes
- Compresión automática hasta 70% sin perder calidad
- Descarga las versiones optimizadas

**Squoosh** - https://squoosh.app
- Más control sobre la compresión
- Convierte a WebP (formato moderno)
- Ajusta calidad vs. tamaño

### Opción 2: Scripts Automáticos (Recomendado) 🤖

#### Instalar ImageMagick (Mac)
```bash
brew install imagemagick
```

#### Script para Optimizar TODAS las Imágenes
Crea un archivo `optimize-images.sh` en tu carpeta:

```bash
#!/bin/bash

# Optimizar JPGs - Reducir a 85% calidad, 1920px ancho máximo
find ./images -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -exec mogrify -quality 85 -resize '1920x1920>' {} \;

# Optimizar PNGs
find ./images -type f -iname "*.png" -exec mogrify -quality 85 -resize '1920x1920>' {} \;

echo "✅ Imágenes optimizadas!"
```

Ejecutar:
```bash
chmod +x optimize-images.sh
./optimize-images.sh
```

### Opción 3: Convertir a WebP (Mejor Compresión) 🎨

WebP reduce el tamaño **30-50% más** que JPG sin perder calidad.

```bash
# Convertir todas las imágenes a WebP
find ./images -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -exec sh -c 'cwebp -q 80 "$1" -o "${1%.jpg}.webp"' _ {} \;
find ./images -type f -iname "*.png" -exec sh -c 'cwebp -q 80 "$1" -o "${1%.png}.webp"' _ {} \;
```

---

## 📏 Tamaños Recomendados

| Uso | Ancho Recomendado | Peso Máximo |
|-----|-------------------|-------------|
| Slideshow Desktop | 1920px | 200-300 KB |
| Slideshow Mobile | 1200px | 100-150 KB |
| Thumbnails | 600px | 50 KB |

---

## 🔧 Configuración Adicional: Responsive Images

Para servir imágenes diferentes según el dispositivo:

```html
<picture>
  <source
    media="(max-width: 768px)"
    srcset="./images/slides/KOI/imagen-mobile.webp"
    type="image/webp">
  <source
    media="(min-width: 769px)"
    srcset="./images/slides/KOI/imagen-desktop.webp"
    type="image/webp">
  <img
    data-src="./images/slides/KOI/imagen.jpg"
    class="slide-img lazy-img"
    loading="lazy"
    alt="Proyecto KOI">
</picture>
```

---

## 📈 Resultados Esperados

### Antes:
- 🐌 Página: ~40 MB
- ⏱️ Tiempo de carga: 8-12 segundos

### Después (con lazy loading + optimización):
- 🚀 Página: ~5-8 MB
- ⚡ Tiempo de carga: 2-3 segundos
- 📱 Móviles: 1-2 segundos

---

## 🎁 BONUS: CDN (Cloudflare)

Para un rendimiento ULTRA rápido:

1. Registra tu dominio en Cloudflare (gratis)
2. Activa "Polish" (optimización automática de imágenes)
3. Activa "Rocket Loader" (carga asíncrona)
4. Tu sitio será 3-5x más rápido automáticamente

---

## ✅ Checklist de Optimización

- [ ] Optimizar todas las imágenes con TinyPNG o script
- [ ] Convertir a WebP (opcional pero recomendado)
- [ ] Verificar que lazy loading funciona correctamente
- [ ] Probar en conexión lenta (DevTools → Network → Slow 3G)
- [ ] Medir con Google PageSpeed Insights
- [ ] Considerar CDN (Cloudflare)

---

## 🆘 Ayuda Rápida

**Probar lazy loading localmente:**
```bash
# Desde la carpeta del proyecto
python3 -m http.server 8000
# Abre: http://localhost:8000
```

**Ver tamaño de imágenes:**
```bash
find ./images -type f -exec ls -lh {} \; | awk '{print $5, $9}' | sort -h
```

**Backup antes de optimizar:**
```bash
cp -r ./images ./images-backup
```

---

**🎯 Prioridad:** Optimiza primero, luego sube a producción. El lazy loading ya está implementado y funcionará automáticamente.
