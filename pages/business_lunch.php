<?php require_once __DIR__ . '/../db.php'; $db = getDB(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Бизнес-ланч — Гостиница</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <h1>🏨 Гостиница</h1>
        <nav>
            <a href="../index.php">Главная</a>
            <a href="menu.php">Меню</a>
            <a href="business_lunch.php" class="active">Бизнес-ланч</a>
            <a href="rooms.php">Номера</a>
            <a href="billiards.php">Бильярд</a>
            <a href="about.php">О нас</a>
        </nav>
    </header>

    <main>
        <h2>Бизнес-ланч</h2>
        <?php
        $categories = $db->query("SELECT * FROM menu_categories WHERE menu_type = 'business_lunch' ORDER BY sort_order");
        while ($cat = $categories->fetchArray(SQLITE3_ASSOC)):
            $items = $db->query("SELECT * FROM menu_items WHERE category_id = {$cat['id']} ORDER BY sort_order");
        ?>
        <div class="menu-section">
            <h3><?= htmlspecialchars($cat['name']) ?></h3>
            <?php 
            $hasItems = false;
            while ($item = $items->fetchArray(SQLITE3_ASSOC)): $hasItems = true; ?>
            <div class="menu-item">
                <div class="menu-item-info">
                    <h4><?= htmlspecialchars($item['name']) ?></h4>
                    <?php if ($item['description']): ?>
                        <p><?= htmlspecialchars($item['description']) ?></p>
                    <?php endif; ?>
                    <?php if ($item['weight']): ?>
                        <span class="weight"><?= htmlspecialchars($item['weight']) ?></span>
                    <?php endif; ?>
                </div>
                <?php if ($item['price'] > 0): ?>
                    <div class="menu-item-price"><?= number_format($item['price'], 0, '', ' ') ?> ₽</div>
                <?php endif; ?>
            </div>
            <?php endwhile; ?>
            <?php if (!$hasItems): ?>
                <p class="empty">Блюда пока не добавлены</p>
            <?php endif; ?>
        </div>
        <?php endwhile; ?>
    </main>

    <footer>
        <p>Сайт-заглушка | <a href="../admin/">Админка</a></p>
    </footer>
</body>
</html>
