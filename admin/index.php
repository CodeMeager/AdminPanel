<?php
// Заглушка для будущей React-админки
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель — Гостиница</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; margin: 0; background: #f0f2f5;
        }
        .placeholder {
            text-align: center; background: white;
            padding: 3rem; border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        .placeholder h1 { color: #2c3e50; margin-bottom: 1rem; }
        .placeholder p { color: #666; line-height: 1.6; }
        .placeholder .icon { font-size: 3rem; margin-bottom: 1rem; }
        a { color: #3498db; }
    </style>
</head>
<body>
    <div class="placeholder">
        <div class="icon">⚙️</div>
        <h1>Админ-панель</h1>
        <p>Здесь будет React-приложение админ-панели.</p>
        <p>После сборки (npm run build) файлы из папки <code>dist/</code> нужно поместить сюда.</p>
        <br>
        <a href="../index.php">← Вернуться на сайт</a>
    </div>
</body>
</html>
