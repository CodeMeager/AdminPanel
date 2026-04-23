<?php require_once __DIR__ . '/../db.php'; $db = getDB();

$roomId = intval($_GET['id'] ?? 0);
if (!$roomId) { header('Location: rooms.php'); exit; }

$stmt = $db->prepare("
    SELECT r.*, rt.name as type_name, rp.gallery, rp.description as full_description, rp.bed_type
    FROM rooms r 
    JOIN room_types rt ON r.room_type_id = rt.id 
    LEFT JOIN room_pages rp ON rp.room_id = r.id
    WHERE r.id = :id
");
$stmt->bindValue(':id', $roomId);
$room = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

if (!$room) { header('Location: rooms.php'); exit; }

$gallery = json_decode($room['gallery'] ?: '[]', true);

// Оснащение «В номере»
$inRoom = $db->query("
    SELECT e.name FROM equipment e
    JOIN room_equipment re ON e.id = re.equipment_id
    WHERE re.room_id = $roomId AND e.category = 'in_room'
");
$inRoomList = [];
while ($e = $inRoom->fetchArray(SQLITE3_ASSOC)) { $inRoomList[] = $e['name']; }

// Оснащение «Одноразовая продукция»
$disposable = $db->query("
    SELECT e.name FROM equipment e
    JOIN room_equipment re ON e.id = re.equipment_id
    WHERE re.room_id = $roomId AND e.category = 'disposable'
");
$disposableList = [];
while ($e = $disposable->fetchArray(SQLITE3_ASSOC)) { $disposableList[] = $e['name']; }
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($room['name']) ?> — Гостиница</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <h1>🏨 Гостиница</h1>
        <nav>
            <a href="../index.php">Главная</a>
            <a href="menu.php">Меню</a>
            <a href="business_lunch.php">Бизнес-ланч</a>
            <a href="rooms.php" class="active">Номера</a>
            <a href="billiards.php">Бильярд</a>
            <a href="about.php">О нас</a>
        </nav>
    </header>

    <main>
        <a href="rooms.php" class="back-link">← Все номера</a>

        <div class="room-detail">
            <span class="badge"><?= htmlspecialchars($room['type_name']) ?></span>
            <h2><?= htmlspecialchars($room['name']) ?></h2>

            <div class="room-meta" style="margin-bottom:1rem;">
                <span>📐 <?= $room['area'] ?> м²</span>
                <span>🛏 <?= htmlspecialchars($room['bed_type'] ?: 'Не указан') ?></span>
                <span class="price"><?= number_format($room['price_per_night'], 0, '', ' ') ?> ₽/сутки</span>
            </div>

            <!-- Галерея -->
            <div class="room-gallery">
                <?php if (!empty($gallery)): ?>
                    <?php foreach ($gallery as $img): ?>
                        <img src="../<?= htmlspecialchars($img) ?>" alt="Фото номера" style="width:100%;height:150px;object-fit:cover;border-radius:4px;">
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="placeholder-img">📷 Фото 1</div>
                    <div class="placeholder-img">📷 Фото 2</div>
                    <div class="placeholder-img">📷 Фото 3</div>
                <?php endif; ?>
            </div>

            <!-- Описание -->
            <p><?= nl2br(htmlspecialchars($room['full_description'] ?: $room['short_description'])) ?></p>

            <!-- Оснащение -->
            <?php if (!empty($inRoomList)): ?>
            <div class="equipment-section">
                <h4>🏠 В номере</h4>
                <div class="equipment-list">
                    <?php foreach ($inRoomList as $item): ?>
                        <span class="equipment-tag"><?= htmlspecialchars($item) ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($disposableList)): ?>
            <div class="equipment-section">
                <h4>🧴 Одноразовая продукция</h4>
                <div class="equipment-list">
                    <?php foreach ($disposableList as $item): ?>
                        <span class="equipment-tag"><?= htmlspecialchars($item) ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </main>

    <footer>
        <p>Сайт-заглушка | <a href="../admin/">Админка</a></p>
    </footer>
</body>
</html>
