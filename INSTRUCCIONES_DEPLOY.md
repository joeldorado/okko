# 🚀 Instrucciones de Despliegue a GoDaddy

## 📦 Archivo Preparado

**Archivo:** `okko.zip` (81 MB)
**Ubicación:** `/Users/joeldoradoaguilus/Desktop/okko/okko.zip`
**Total de archivos:** 42 archivos

---

## ✅ Archivos Incluidos en el ZIP

### Archivos Principales
- ✅ `index.html` (con lazy loading y base tag)
- ✅ `.htaccess` (configuración Apache)
- ✅ `favicon.ico`

### CSS
- ✅ `styles.css`
- ✅ `proyectos.css`
- ✅ `contacto.css`

### JavaScript
- ✅ `script.js` (con validaciones)
- ✅ `proyectos.js` (rutas actualizadas)
- ✅ `contacto.js`

### Backend
- ✅ `config.php` (configuración email)

### Media
- ✅ `images/` (todas las imágenes renombradas)
  - Logo principal
  - Logos KOI/KOA
  - Slides KOI (11 imágenes)
  - Slides KOA (10 imágenes)
- ✅ `music/` (música de fondo)

---

## 🔧 Paso a Paso: Subir a GoDaddy

### 1. Acceder a cPanel
```
1. Ve a: https://godaddy.com
2. My Products → Web Hosting → Manage
3. Click en "cPanel Admin"
```

### 2. Abrir File Manager
```
1. En cPanel, busca "File Manager"
2. Click para abrir
3. Navega a: public_html/
```

### 3. Crear/Limpiar Carpeta okko
```
1. Si existe la carpeta "okko", haz backup:
   - Click derecho → Compress → okko-backup.zip
2. Elimina el contenido viejo de "okko"
3. O crea nueva carpeta "okko" si no existe:
   - New Folder → Nombre: okko
```

### 4. Subir el ZIP
```
1. Entra a la carpeta "okko"
2. Click en "Upload" (arriba)
3. Arrastra okko.zip o selecciónalo
4. Espera a que termine la subida (81 MB)
```

### 5. Extraer el ZIP
```
1. Regresa al File Manager
2. Busca okko.zip dentro de /public_html/okko/
3. Click derecho sobre okko.zip
4. Selecciona "Extract"
5. Confirma la extracción
6. Espera a que termine
```

### 6. Limpiar
```
1. Elimina el archivo okko.zip (ya no se necesita)
2. Verifica que todos los archivos estén ahí
```

### 7. Verificar .htaccess
```
⚠️ IMPORTANTE: El archivo .htaccess puede estar oculto

1. En File Manager, click en "Settings" (arriba derecha)
2. Marca "Show Hidden Files (dotfiles)"
3. Click "Save"
4. Verifica que .htaccess esté en /public_html/okko/
```

---

## 🧪 Probar el Sitio

### URLs de Prueba
```
✓ Página principal: https://impulsodigitaldorado.com/okko/
✓ Vista KOI: https://impulsodigitaldorado.com/okko/koi
✓ Vista KOA: https://impulsodigitaldorado.com/okko/koa
```

### Checklist de Verificación
- [ ] La página carga correctamente
- [ ] Las imágenes se ven (lazy loading)
- [ ] El logo OKKO aparece y anima
- [ ] Los menús Header y Footer funcionan
- [ ] Modal de "Nosotros" abre correctamente
- [ ] Modal de "Contacto" abre correctamente
- [ ] Modal de "Proyectos" funciona
- [ ] La música se puede activar/desactivar
- [ ] Las rutas /koi y /koa funcionan
- [ ] No hay errores en la consola (F12)

---

## 🐛 Solución de Problemas

### Problema: Imágenes no cargan
**Solución:**
1. Verifica en DevTools (F12) → Network
2. Busca errores 404
3. Asegúrate que la carpeta `images/` esté completa
4. Verifica permisos: 755 para carpetas, 644 para archivos

### Problema: .htaccess no funciona
**Solución:**
1. Verifica que esté en la raíz de `/okko/`
2. Permisos: debe ser 644
3. Si no funciona, contacta soporte de GoDaddy

### Problema: Estilos no cargan
**Solución:**
1. Verifica que los archivos CSS estén en `/okko/`
2. Abre DevTools → Console
3. Busca errores de rutas
4. Limpia cache del navegador (Ctrl+Shift+R)

### Problema: "Cannot read properties of null"
**Solución:**
- Este error está corregido en script.js
- Limpia cache del navegador

---

## ⚡ Optimización Adicional (Opcional)

### Si las imágenes aún son pesadas:

1. **Ejecutar Script de Optimización** (ANTES de crear el ZIP):
```bash
cd /Users/joeldoradoaguilus/Desktop/okko
./optimize-images.sh
```

2. **Crear Nuevo ZIP**:
```bash
./create-production-zip.sh
```

3. **Volver a Subir**

---

## 📊 Métricas Esperadas

### Performance
- **Tiempo de carga inicial:** 2-3 segundos
- **Google PageSpeed:** 80-95/100
- **Lazy loading:** Solo cargan 2-3 imágenes inicialmente
- **Datos transferidos:** ~5-8 MB (primera carga)

### Optimizaciones Implementadas
- ✅ Lazy loading de imágenes
- ✅ Cache headers (1 año para imágenes)
- ✅ Compresión Gzip (.htaccess)
- ✅ Minificación (Bootstrap, GSAP desde CDN)
- ✅ Rutas optimizadas con base tag

---

## 🔐 Seguridad

### Headers Configurados (.htaccess)
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Directory browsing: Disabled

---

## 📞 Soporte

### Si algo no funciona:

1. **DevTools (F12):**
   - Console: Ver errores JavaScript
   - Network: Ver archivos que fallan (404)
   - Application: Ver cache y localStorage

2. **Logs de GoDaddy:**
   - cPanel → Error Logs
   - Busca errores recientes

3. **Contactar Soporte GoDaddy:**
   - Si hay problemas con .htaccess
   - Si hay problemas de permisos
   - Si hay problemas con PHP

---

## ✅ Checklist Final

Antes de cerrar:

- [ ] ZIP subido correctamente
- [ ] Archivos extraídos
- [ ] .htaccess visible y configurado
- [ ] Sitio probado en navegador
- [ ] Sitio probado en móvil
- [ ] Sin errores en consola
- [ ] Imágenes cargando con lazy loading
- [ ] Formulario de contacto funciona (si aplica)
- [ ] ZIP eliminado del servidor
- [ ] Cache del navegador limpiado

---

**🎉 ¡Listo! Tu sitio OKKO está en producción.**

**URL Final:** https://impulsodigitaldorado.com/okko/
