<?php
// Если собранный React-app существует — редирект туда.
// Иначе — показываем подсказку для разработчика.
if (file_exists(__DIR__ . '/dist/index.html')) {
    header('Location: dist/');
    exit;
}
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
            min-height: 100vh; margin: 0; background: #f5f0e8;
        }
        .box {
            text-align: center; background: #fff;
            padding: 3rem; border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        .box h1 { color: #2e1f0e; margin-bottom: 1rem; }
        .box p  { color: #7a6a56; line-height: 1.7; }
        code { background: #f0ebe0; padding: 2px 6px; border-radius: 4px; }
        a    { color: #7a5c2e; }
    </style>
</head>
<body>
    <div class="box">
        <div style="font-size:3rem;margin-bottom:1rem">⚙️</div>
        <h1>Админ-панель не собрана</h1>
        <p>Перейдите в папку <code>admin-panel</code> и выполните:</p>
        <p><code>npm run build</code></p>
        <p>После этого страница откроется автоматически.</p>
        <br>
        <a href="../index.php">← Вернуться на сайт</a>
    </div>
</body>
</html>
