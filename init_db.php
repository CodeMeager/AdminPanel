<?php
/**
 * Инициализация базы данных SQLite
 * Запустить один раз: php init_db.php
 */

$dbPath = __DIR__ . '/data/database.sqlite';
$dbDir = __DIR__ . '/data';

if (!is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
}

// Создаём папки для загрузок
$uploadDirs = ['uploads/rooms', 'uploads/menu', 'uploads/documents'];
foreach ($uploadDirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

$db = new SQLite3($dbPath);
$db->enableExceptions(true);

// ========== ТАБЛИЦЫ ==========

// Пользователи
$db->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// Категории меню
$db->exec("CREATE TABLE IF NOT EXISTS menu_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    menu_type TEXT NOT NULL CHECK(menu_type IN ('main', 'business_lunch')),
    sort_order INTEGER DEFAULT 0
)");

// Блюда
$db->exec("CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    weight TEXT DEFAULT '',
    image TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
)");

// Типы номеров (фиксированный список)
$db->exec("CREATE TABLE IF NOT EXISTS room_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)");

// Плюшки (фиксированный список)
$db->exec("CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT DEFAULT ''
)");

// Номера (карточка)
$db->exec("CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    photo TEXT DEFAULT '',
    room_count INTEGER DEFAULT 1,
    area REAL DEFAULT 0,
    short_description TEXT DEFAULT '',
    price_per_night REAL NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
)");

// Связь номер <-> плюшки
$db->exec("CREATE TABLE IF NOT EXISTS room_amenities (
    room_id INTEGER NOT NULL,
    amenity_id INTEGER NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id)
)");

// Страница номера (детальная)
$db->exec("CREATE TABLE IF NOT EXISTS room_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER UNIQUE NOT NULL,
    gallery TEXT DEFAULT '[]',
    description TEXT DEFAULT '',
    bed_type TEXT DEFAULT '',
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
)");

// Оснащение номера (фиксированный список)
$db->exec("CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('in_room', 'disposable'))
)");

// Связь страница номера <-> оснащение
$db->exec("CREATE TABLE IF NOT EXISTS room_equipment (
    room_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    PRIMARY KEY (room_id, equipment_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
)");

// Бильярд
$db->exec("CREATE TABLE IF NOT EXISTS billiards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    price REAL NOT NULL
)");

// Документы (страница «О нас»)
$db->exec("CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// ========== ТЕСТОВЫЕ ДАННЫЕ ==========

// Пользователь admin / admin123
$db->exec("INSERT OR IGNORE INTO users (username, password_hash, name) VALUES 
    ('admin', '" . password_hash('admin123', PASSWORD_DEFAULT) . "', 'Администратор')");

// Типы номеров
$roomTypes = ['Стандарт', 'Комфорт', 'Люкс', 'Полулюкс', 'Семейный'];
foreach ($roomTypes as $type) {
    $stmt = $db->prepare("INSERT OR IGNORE INTO room_types (name) VALUES (:name)");
    $stmt->bindValue(':name', $type);
    $stmt->execute();
}

// Плюшки
$amenities = [
    ['Wi-Fi', 'wifi'],
    ['Кондиционер', 'ac'],
    ['Телевизор', 'tv'],
    ['Мини-бар', 'minibar'],
    ['Сейф', 'safe'],
    ['Фен', 'hairdryer'],
    ['Холодильник', 'fridge'],
    ['Чайник', 'kettle'],
    ['Балкон', 'balcony'],
    ['Вид на город', 'city_view'],
    ['Парковка', 'parking'],
    ['Завтрак включён', 'breakfast']
];
foreach ($amenities as $a) {
    $stmt = $db->prepare("INSERT OR IGNORE INTO amenities (name, icon) VALUES (:name, :icon)");
    $stmt->bindValue(':name', $a[0]);
    $stmt->bindValue(':icon', $a[1]);
    $stmt->execute();
}

// Оснащение — «В номере»
$inRoom = [
    'Кровать', 'Шкаф для одежды', 'Письменный стол', 'Кресло',
    'Зеркало', 'Телефон', 'Утюг и гладильная доска', 'Тапочки',
    'Халат', 'Полотенца', 'Постельное бельё'
];
foreach ($inRoom as $item) {
    $stmt = $db->prepare("INSERT OR IGNORE INTO equipment (name, category) VALUES (:name, 'in_room')");
    $stmt->bindValue(':name', $item);
    $stmt->execute();
}

// Оснащение — «Одноразовая продукция»
$disposable = [
    'Шампунь', 'Гель для душа', 'Мыло', 'Зубная щётка',
    'Зубная паста', 'Бритвенный набор', 'Шапочка для душа',
    'Расчёска', 'Ватные палочки', 'Ватные диски'
];
foreach ($disposable as $item) {
    $stmt = $db->prepare("INSERT OR IGNORE INTO equipment (name, category) VALUES (:name, 'disposable')");
    $stmt->bindValue(':name', $item);
    $stmt->execute();
}

// Категории основного меню
$mainCategories = ['Холодные закуски', 'Салаты', 'Супы', 'Горячие блюда', 'Гарниры', 'Десерты', 'Напитки'];
foreach ($mainCategories as $i => $cat) {
    $stmt = $db->prepare("INSERT INTO menu_categories (name, menu_type, sort_order) VALUES (:name, 'main', :sort)");
    $stmt->bindValue(':name', $cat);
    $stmt->bindValue(':sort', $i);
    $stmt->execute();
}

// Категории бизнес-ланча
$blCategories = ['Салат', 'Суп', 'Основное блюдо', 'Напиток'];
foreach ($blCategories as $i => $cat) {
    $stmt = $db->prepare("INSERT INTO menu_categories (name, menu_type, sort_order) VALUES (:name, 'business_lunch', :sort)");
    $stmt->bindValue(':name', $cat);
    $stmt->bindValue(':sort', $i);
    $stmt->execute();
}

// Тестовые блюда
$testDishes = [
    ['Холодные закуски', 'main', 'Сырная тарелка', 'Ассорти из европейских сыров', 450, '200 г'],
    ['Салаты', 'main', 'Цезарь с курицей', 'Классический салат с соусом цезарь', 380, '250 г'],
    ['Супы', 'main', 'Борщ украинский', 'С пампушками и сметаной', 320, '350 мл'],
    ['Горячие блюда', 'main', 'Стейк из говядины', 'Мраморная говядина средней прожарки', 890, '300 г'],
    ['Горячие блюда', 'main', 'Минтай запечённый', 'С овощами и сливочным соусом', 420, '280 г'],
    ['Десерты', 'main', 'Тирамису', 'Классический итальянский десерт', 350, '150 г'],
    ['Напитки', 'main', 'Чай чёрный', 'Цейлонский крупнолистовой', 120, '400 мл'],
    ['Салат', 'business_lunch', 'Винегрет', 'Классический овощной салат', 0, '150 г'],
    ['Суп', 'business_lunch', 'Куриный суп с лапшой', 'Домашняя лапша', 0, '300 мл'],
    ['Основное блюдо', 'business_lunch', 'Котлета по-домашнему', 'С картофельным пюре', 0, '250 г'],
    ['Напиток', 'business_lunch', 'Компот из сухофруктов', '', 0, '200 мл'],
];

foreach ($testDishes as $dish) {
    $catStmt = $db->prepare("SELECT id FROM menu_categories WHERE name = :name AND menu_type = :type LIMIT 1");
    $catStmt->bindValue(':name', $dish[0]);
    $catStmt->bindValue(':type', $dish[1]);
    $catId = $catStmt->execute()->fetchArray(SQLITE3_ASSOC)['id'];

    $stmt = $db->prepare("INSERT INTO menu_items (category_id, name, description, price, weight) VALUES (:cat, :name, :desc, :price, :weight)");
    $stmt->bindValue(':cat', $catId);
    $stmt->bindValue(':name', $dish[2]);
    $stmt->bindValue(':desc', $dish[3]);
    $stmt->bindValue(':price', $dish[4]);
    $stmt->bindValue(':weight', $dish[5]);
    $stmt->execute();
}

// Тестовые номера
$testRooms = [
    ['Стандарт', 'Стандарт одноместный', 5, 18, 'Уютный номер для одного гостя', 2500],
    ['Комфорт', 'Комфорт двухместный', 3, 25, 'Просторный номер для двоих', 4000],
    ['Люкс', 'Люкс с видом на город', 2, 40, 'Премиальный номер с панорамным видом', 7500],
];

foreach ($testRooms as $room) {
    $typeStmt = $db->prepare("SELECT id FROM room_types WHERE name = :name LIMIT 1");
    $typeStmt->bindValue(':name', $room[0]);
    $typeId = $typeStmt->execute()->fetchArray(SQLITE3_ASSOC)['id'];

    $stmt = $db->prepare("INSERT INTO rooms (room_type_id, name, room_count, area, short_description, price_per_night) 
                          VALUES (:type, :name, :count, :area, :desc, :price)");
    $stmt->bindValue(':type', $typeId);
    $stmt->bindValue(':name', $room[1]);
    $stmt->bindValue(':count', $room[2]);
    $stmt->bindValue(':area', $room[3]);
    $stmt->bindValue(':desc', $room[4]);
    $stmt->bindValue(':price', $room[5]);
    $stmt->execute();

    $roomId = $db->lastInsertRowID();

    // Добавляем плюшки
    $amenityIds = $room[0] === 'Стандарт' ? [1,3,7,8] : ($room[0] === 'Комфорт' ? [1,2,3,5,6,7,8] : [1,2,3,4,5,6,7,8,10]);
    foreach ($amenityIds as $aid) {
        $db->exec("INSERT INTO room_amenities (room_id, amenity_id) VALUES ($roomId, $aid)");
    }

    // Создаём страницу номера
    $stmt = $db->prepare("INSERT INTO room_pages (room_id, description, bed_type) VALUES (:rid, :desc, :bed)");
    $stmt->bindValue(':rid', $roomId);
    $stmt->bindValue(':desc', 'Подробное описание номера ' . $room[1]);
    $bedType = $room[0] === 'Стандарт' ? '1,5-спальная' : ($room[0] === 'Комфорт' ? '2-спальная' : 'King-size');
    $stmt->bindValue(':bed', $bedType);
    $stmt->execute();

    // Оснащение
    $eqIds = $room[0] === 'Стандарт' ? [1,2,10,11,12,13,14] : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
    foreach ($eqIds as $eid) {
        $db->exec("INSERT OR IGNORE INTO room_equipment (room_id, equipment_id) VALUES ($roomId, $eid)");
    }
}

// Бильярд
$billiardData = [
    ['12 футов', '1 час', 800],
    ['12 футов', '2 часа', 1400],
    ['12 футов', '3 часа', 1800],
    ['12 футов', 'Ночь', 3000],
    ['8 футов', '1 час', 600],
    ['8 футов', '2 часа', 1000],
    ['8 футов', '3 часа', 1400],
    ['8 футов', 'Ночь', 2200],
];
foreach ($billiardData as $b) {
    $stmt = $db->prepare("INSERT INTO billiards (category, duration, price) VALUES (:cat, :dur, :price)");
    $stmt->bindValue(':cat', $b[0]);
    $stmt->bindValue(':dur', $b[1]);
    $stmt->bindValue(':price', $b[2]);
    $stmt->execute();
}

$db->close();
echo "✅ База данных создана: $dbPath\n";
echo "✅ Тестовые данные загружены\n";
echo "✅ Логин: admin / Пароль: admin123\n";
