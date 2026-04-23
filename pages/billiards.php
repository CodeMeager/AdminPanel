<?php require_once __DIR__ . '/../db.php'; $db = getDB(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Бильярд — Гостиница</title>
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
            <a href="billiards.php" class="active">Бильярд</a>
            <a href="about.php">О нас</a>
        </nav>
    </header>

    <main>
        <h2>Бильярд</h2>

        <?php
        $categories = ['12 футов', '8 футов'];
        foreach ($categories as $cat):
            $stmt = $db->prepare("SELECT * FROM billiards WHERE category = :cat ORDER BY id");
            $stmt->bindValue(':cat', $cat);
            $items = $stmt->execute();
        ?>
        <section>
            <h3 style="margin-bottom:0.5rem;"><?= $cat ?></h3>
            <table>
                <thead>
                    <tr>
                        <th>Время</th>
                        <th>Стоимость</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($item = $items->fetchArray(SQLITE3_ASSOC)): ?>
                    <tr>
                        <td><?= htmlspecialchars($item['duration']) ?></td>
                        <td><?= number_format($item['price'], 0, '', ' ') ?> ₽</td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </section>
        <?php endforeach; ?>
    </main>

    <footer>
        <p>Сайт-заглушка | <a href="../admin/">Админка</a></p>
    </footer>
</body>
</html>
