<?php
/**
 * Router PHP - Simula ambiente GoDaddy
 * =====================================
 * Este router maneja las peticiones para simular
 * la estructura /okko/ como en GoDaddy
 */

// Obtener la URI solicitada
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Remover /okko/ del inicio si existe
$uri = preg_replace('#^/okko/#', '/', $uri);

// Si la URI es raíz, servir index.html
if ($uri === '/' || $uri === '/okko' || $uri === '/okko/') {
    $uri = '/index.html';
}

// Si la URI es /koi o /koa, servir index.html
if ($uri === '/koi' || $uri === '/koa') {
    $uri = '/index.html';
}

// Construir la ruta del archivo
$file = __DIR__ . $uri;

// Si el archivo existe y NO es el router mismo
if (file_exists($file) && $file !== __FILE__) {
    // Determinar el tipo MIME
    $extension = pathinfo($file, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'htm' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'mp3' => 'audio/mpeg',
        'mp4' => 'video/mp4',
        'pdf' => 'application/pdf',
        'txt' => 'text/plain',
        'xml' => 'application/xml',
    ];

    $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

    // Establecer headers
    header('Content-Type: ' . $mimeType);
    header('X-Powered-By: PHP/' . PHP_VERSION);

    // Cache headers para imágenes
    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
        header('Cache-Control: public, max-age=31536000'); // 1 año
    }

    // Leer y servir el archivo
    readfile($file);
    return;
}

// Si no existe, devolver 404
http_response_code(404);
echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>404 - Página No Encontrada</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 120px;
            margin: 0;
            font-weight: 700;
        }
        h2 {
            font-size: 24px;
            margin: 20px 0;
        }
        p {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        a {
            display: inline-block;
            padding: 12px 30px;
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            text-decoration: none;
            border-radius: 50px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }
        a:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>404</h1>
        <h2>Página No Encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <a href='/okko/'>Volver al Inicio</a>
    </div>
</body>
</html>";
?>
