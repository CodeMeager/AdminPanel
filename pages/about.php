<?php require_once __DIR__ . '/../db.php'; $db = getDB(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>О нас — Гостиница</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <h1>🏨 Гостиница</h1>
        <nav>
            <a href="../index.php">Главная</a>
            <a href="menu.php">Меню</a>
            <a href="business_lunch.php">Бизнес-ланч</a>
            <a href="rooms.php">Номера</a>
            <a href="billiards.php">Бильярд</a>
            <a href="about.php" class="active">О нас</a>
        </nav>
    </header>

    <main>
        <section class="hero">
            <h2>О нашей гостинице</h2>
            <p>Мы рады приветствовать вас в нашей гостинице. Здесь вы найдёте уют, комфорт и отличный сервис.</p>
        </section>

        <section>
            <h2>Документы</h2>
            <?php
            $docs = $db->query("SELECT * FROM documents ORDER BY uploaded_at DESC");
            $hasDocs = false;
            ?>
            <div class="doc-list">
                <?php while ($doc = $docs->fetchArray(SQLITE3_ASSOC)): $hasDocs = true; ?>
                <div class="doc-item">
                    <span class="doc-icon">📄</span>
                    <a href="../<?= htmlspecialchars($doc['file_path']) ?>" target="_blank">
                        <?= htmlspecialchars($doc['name']) ?>
                    </a>
                </div>
                <?php endwhile; ?>
            </div>
            <?php if (!$hasDocs): ?>
                <p class="empty">Документы пока не добавлены</p>
            <?php endif; ?>
        </section>
    </main>

    <footer>
        <p>Сайт-заглушка | <a href="../admin/">Админка</a></p>
    </footer>
</body>
</html>
