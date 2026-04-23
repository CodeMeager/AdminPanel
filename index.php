<?php require_once 'db.php'; $db = getDB(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Гостиница — Сайт-заглушка</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>🏨 Гостиница</h1>
        <nav>
            <a href="index.php" class="active">Главная</a>
            <a href="pages/menu.php">Меню</a>
            <a href="pages/business_lunch.php">Бизнес-ланч</a>
            <a href="pages/rooms.php">Номера</a>
            <a href="pages/billiards.php">Бильярд</a>
            <a href="pages/about.php">О нас</a>
        </nav>
    </header>

    <main>
        <section class="hero">
            <h2>Добро пожаловать</h2>
            <p>Это сайт-заглушка для тестирования админ-панели. Все данные на страницах подгружаются из базы данных SQLite.</p>
        </section>

        <section>
            <h2>Наши номера</h2>
            <div class="cards">
                <?php
                $rooms = $db->query("
                    SELECT r.*, rt.name as type_name 
                    FROM rooms r 
                    JOIN room_types rt ON r.room_type_id = rt.id 
                    ORDER BY r.sort_order, r.id
                ");
                while ($room = $rooms->fetchArray(SQLITE3_ASSOC)):
                    $amenities = $db->query("
                        SELECT a.name FROM amenities a 
                        JOIN room_amenities ra ON a.id = ra.amenity_id 
                        WHERE ra.room_id = {$room['id']}
                    ");
                    $amenityList = [];
                    while ($a = $amenities->fetchArray(SQLITE3_ASSOC)) {
                        $amenityList[] = $a['name'];
                    }
                ?>
                <div class="card">
                    <div class="card-img">
                        <?php if ($room['photo']): ?>
                            <img src="<?= htmlspecialchars($room['photo']) ?>" alt="<?= htmlspecialchars($room['name']) ?>">
                        <?php else: ?>
                            <div class="placeholder-img">📷 Фото</div>
                        <?php endif; ?>
                    </div>
                    <div class="card-body">
                        <span class="badge"><?= htmlspecialchars($room['type_name']) ?></span>
                        <h3><a href="pages/room_detail.php?id=<?= $room['id'] ?>"><?= htmlspecialchars($room['name']) ?></a></h3>
                        <p><?= htmlspecialchars($room['short_description']) ?></p>
                        <div class="room-meta">
                            <span>📐 <?= $room['area'] ?> м²</span>
                            <span>🚪 <?= $room['room_count'] ?> шт.</span>
                        </div>
                        <div class="amenities">
                            <?php foreach ($amenityList as $am): ?>
                                <span class="amenity-tag"><?= htmlspecialchars($am) ?></span>
                            <?php endforeach; ?>
                        </div>
                        <div class="price"><?= number_format($room['price_per_night'], 0, '', ' ') ?> ₽/сутки</div>
                    </div>
                </div>
                <?php endwhile; ?>
            </div>
        </section>
    </main>

    <footer>
        <p>Сайт-заглушка для тестирования админ-панели | <a href="admin/">Войти в админку</a></p>
    </footer>
</body>
</html>
