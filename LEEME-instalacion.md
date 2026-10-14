# Instalar "Cards Medicación Urgente · HUSA" como app en Chrome

## Archivos de este paquete
- `index.html` — la app
- `manifest.webmanifest` — nombre, icono y color de la app instalada
- `sw.js` — service worker (permite que funcione sin conexión una vez instalada)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon-32.png`, `favicon-48.png`

**Importante:** los 4 primeros archivos deben estar **en la misma carpeta**, con esos
nombres exactos, para que la app los encuentre.

## Por qué no basta con abrir el archivo haciendo doble clic
Chrome solo ofrece "Instalar app" cuando la página se sirve por `http://` o `https://`
(o `http://localhost`). Si abres el HTML directamente desde el disco (`file://...`),
el navegador bloquea el service worker por seguridad y el botón de instalar no aparece,
aunque el manifest y los iconos estén bien configurados. Hay que "servir" la carpeta.

## Opción más simple: servidor local (para probarlo tú mismo)
1. Abre una terminal en la carpeta donde están estos archivos.
2. Ejecuta (si tienes Python instalado):
   ```
   python3 -m http.server 8080
   ```
3. Abre Chrome en `http://localhost:8080/index.html`.
4. Aparecerá el icono de instalar en la barra de direcciones (⊕ o el icono de
   "Instalar app"), o en el menú ⋮ → "Instalar Cards Medicación Urgente…".

## Opción para uso real en el servicio: alojarlo en un sitio estático
Sube esta misma carpeta (los 4 archivos + iconos) a cualquier alojamiento estático
con HTTPS, por ejemplo:
- GitHub Pages
- Netlify o Vercel (arrastrar y soltar la carpeta)
- Un servidor interno del hospital con HTTPS

Una vez accesible por `https://...`, cualquiera que la abra en Chrome (móvil o
escritorio) verá la opción de instalarla como app, con icono propio y funcionando
sin conexión tras el primer uso.

## Actualizar la app más adelante
Si cambias `index.html`, sube la nueva versión con el mismo nombre.
El service worker detectará el cambio y actualizará la app instalada la siguiente
vez que se abra (puede tardar una recarga en aplicarse del todo).
