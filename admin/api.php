<?php
/**
 * API для админ-панели
 * Все запросы идут сюда с параметром action
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../db.php';

session_start();

// ========== Авторизация ==========
function requireAuth() {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Не авторизован']);
        exit;
    }
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Для PUT/DELETE читаем тело запроса
$input = [];
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
    } else {
        $input = $_POST;
    }
}

$db = getDB();

try {
    switch ($action) {

        // ==================== АВТОРИЗАЦИЯ ====================
        case 'login':
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            $stmt = $db->prepare("SELECT * FROM users WHERE username = :u");
            $stmt->bindValue(':u', $username);
            $user = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                jsonResponse(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name']]]);
            }
            jsonResponse(['error' => 'Неверный логин или пароль'], 401);
            break;

        case 'logout':
            session_destroy();
            jsonResponse(['success' => true]);
            break;

        case 'check_auth':
            if (!empty($_SESSION['user_id'])) {
                jsonResponse(['authenticated' => true, 'user' => ['id' => $_SESSION['user_id'], 'name' => $_SESSION['user_name']]]);
            }
            jsonResponse(['authenticated' => false]);
            break;

        // ==================== МЕНЮ ====================
        case 'get_menu_categories':
            requireAuth();
            $type = $_GET['menu_type'] ?? 'main';
            $stmt = $db->prepare("SELECT * FROM menu_categories WHERE menu_type = :type ORDER BY sort_order");
            $stmt->bindValue(':type', $type);
            $result = $stmt->execute();
            $categories = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $categories[] = $row; }
            jsonResponse($categories);
            break;

        case 'get_menu_items':
            requireAuth();
            $catId = intval($_GET['category_id'] ?? 0);
            $stmt = $db->prepare("SELECT * FROM menu_items WHERE category_id = :cid ORDER BY sort_order");
            $stmt->bindValue(':cid', $catId);
            $result = $stmt->execute();
            $items = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $items[] = $row; }
            jsonResponse($items);
            break;

        case 'save_menu_item':
            requireAuth();
            $id = intval($input['id'] ?? 0);
            if ($id) {
                $stmt = $db->prepare("UPDATE menu_items SET name=:name, description=:desc, price=:price, weight=:weight, category_id=:cat WHERE id=:id");
                $stmt->bindValue(':id', $id);
            } else {
                $stmt = $db->prepare("INSERT INTO menu_items (name, description, price, weight, category_id) VALUES (:name, :desc, :price, :weight, :cat)");
            }
            $stmt->bindValue(':name', $input['name'] ?? '');
            $stmt->bindValue(':desc', $input['description'] ?? '');
            $stmt->bindValue(':price', floatval($input['price'] ?? 0));
            $stmt->bindValue(':weight', $input['weight'] ?? '');
            $stmt->bindValue(':cat', intval($input['category_id'] ?? 0));
            $stmt->execute();
            jsonResponse(['success' => true, 'id' => $id ?: $db->lastInsertRowID()]);
            break;

        case 'delete_menu_item':
            requireAuth();
            $id = intval($input['id'] ?? 0);
            $db->exec("DELETE FROM menu_items WHERE id = $id");
            jsonResponse(['success' => true]);
            break;

        // ==================== НОМЕРА ====================
        case 'get_room_types':
            requireAuth();
            $result = $db->query("SELECT * FROM room_types ORDER BY id");
            $types = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $types[] = $row; }
            jsonResponse($types);
            break;

        case 'get_amenities':
            requireAuth();
            $result = $db->query("SELECT * FROM amenities ORDER BY id");
            $items = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $items[] = $row; }
            jsonResponse($items);
            break;

        case 'get_equipment':
            requireAuth();
            $result = $db->query("SELECT * FROM equipment ORDER BY category, id");
            $items = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $items[] = $row; }
            jsonResponse($items);
            break;

        case 'get_rooms':
            requireAuth();
            $result = $db->query("
                SELECT r.*, rt.name as type_name 
                FROM rooms r JOIN room_types rt ON r.room_type_id = rt.id 
                ORDER BY r.sort_order, r.id
            ");
            $rooms = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                // Получаем плюшки
                $amResult = $db->query("SELECT amenity_id FROM room_amenities WHERE room_id = {$row['id']}");
                $row['amenity_ids'] = [];
                while ($am = $amResult->fetchArray(SQLITE3_ASSOC)) { $row['amenity_ids'][] = intval($am['amenity_id']); }
                $rooms[] = $row;
            }
            jsonResponse($rooms);
            break;

        case 'save_room':
            requireAuth();
            $id = intval($input['id'] ?? 0);

            // Обработка фото
            $photo = $input['photo'] ?? '';
            if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
                $filename = 'room_' . time() . '_' . rand(1000,9999) . '.' . $ext;
                $dest = __DIR__ . '/../uploads/rooms/' . $filename;
                move_uploaded_file($_FILES['photo']['tmp_name'], $dest);
                $photo = 'uploads/rooms/' . $filename;
            }

            if ($id) {
                $stmt = $db->prepare("UPDATE rooms SET room_type_id=:type, name=:name, photo=:photo, room_count=:count, 
                    area=:area, short_description=:desc, price_per_night=:price WHERE id=:id");
                $stmt->bindValue(':id', $id);
            } else {
                $stmt = $db->prepare("INSERT INTO rooms (room_type_id, name, photo, room_count, area, short_description, price_per_night) 
                    VALUES (:type, :name, :photo, :count, :area, :desc, :price)");
            }
            $stmt->bindValue(':type', intval($input['room_type_id'] ?? 1));
            $stmt->bindValue(':name', $input['name'] ?? '');
            $stmt->bindValue(':photo', $photo);
            $stmt->bindValue(':count', intval($input['room_count'] ?? 1));
            $stmt->bindValue(':area', floatval($input['area'] ?? 0));
            $stmt->bindValue(':desc', $input['short_description'] ?? '');
            $stmt->bindValue(':price', floatval($input['price_per_night'] ?? 0));
            $stmt->execute();

            $roomId = $id ?: $db->lastInsertRowID();

            // Обновляем плюшки
            $db->exec("DELETE FROM room_amenities WHERE room_id = $roomId");
            $amenityIds = $input['amenity_ids'] ?? [];
            foreach ($amenityIds as $aid) {
                $db->exec("INSERT INTO room_amenities (room_id, amenity_id) VALUES ($roomId, " . intval($aid) . ")");
            }

            // Создаём страницу номера если новый
            if (!$id) {
                $stmt = $db->prepare("INSERT OR IGNORE INTO room_pages (room_id, description, bed_type) VALUES (:rid, '', '')");
                $stmt->bindValue(':rid', $roomId);
                $stmt->execute();
            }

            jsonResponse(['success' => true, 'id' => $roomId]);
            break;

        case 'delete_room':
            requireAuth();
            $id = intval($input['id'] ?? 0);
            $db->exec("DELETE FROM rooms WHERE id = $id");
            jsonResponse(['success' => true]);
            break;

        case 'get_room_page':
            requireAuth();
            $roomId = intval($_GET['room_id'] ?? 0);
            $stmt = $db->prepare("
                SELECT rp.*, r.name as room_name 
                FROM room_pages rp 
                JOIN rooms r ON r.id = rp.room_id 
                WHERE rp.room_id = :rid
            ");
            $stmt->bindValue(':rid', $roomId);
            $page = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

            if ($page) {
                $page['gallery'] = json_decode($page['gallery'] ?: '[]', true);
                // Оснащение
                $eqResult = $db->query("SELECT equipment_id FROM room_equipment WHERE room_id = $roomId");
                $page['equipment_ids'] = [];
                while ($eq = $eqResult->fetchArray(SQLITE3_ASSOC)) { $page['equipment_ids'][] = intval($eq['equipment_id']); }
            }
            jsonResponse($page ?: ['error' => 'Страница не найдена']);
            break;

        case 'save_room_page':
            requireAuth();
            $roomId = intval($input['room_id'] ?? 0);

            $stmt = $db->prepare("UPDATE room_pages SET description=:desc, bed_type=:bed, gallery=:gallery WHERE room_id=:rid");
            $stmt->bindValue(':rid', $roomId);
            $stmt->bindValue(':desc', $input['description'] ?? '');
            $stmt->bindValue(':bed', $input['bed_type'] ?? '');
            $stmt->bindValue(':gallery', json_encode($input['gallery'] ?? [], JSON_UNESCAPED_UNICODE));
            $stmt->execute();

            // Обновляем оснащение
            $db->exec("DELETE FROM room_equipment WHERE room_id = $roomId");
            $equipIds = $input['equipment_ids'] ?? [];
            foreach ($equipIds as $eid) {
                $db->exec("INSERT INTO room_equipment (room_id, equipment_id) VALUES ($roomId, " . intval($eid) . ")");
            }

            jsonResponse(['success' => true]);
            break;

        case 'upload_room_gallery':
            requireAuth();
            if (!empty($_FILES['photos'])) {
                $paths = [];
                $files = $_FILES['photos'];
                $count = is_array($files['name']) ? count($files['name']) : 1;
                for ($i = 0; $i < $count; $i++) {
                    $name = is_array($files['name']) ? $files['name'][$i] : $files['name'];
                    $tmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
                    $err = is_array($files['error']) ? $files['error'][$i] : $files['error'];
                    if ($err === UPLOAD_ERR_OK) {
                        $ext = pathinfo($name, PATHINFO_EXTENSION);
                        $filename = 'gallery_' . time() . '_' . rand(1000,9999) . '_' . $i . '.' . $ext;
                        $dest = __DIR__ . '/../uploads/rooms/' . $filename;
                        move_uploaded_file($tmp, $dest);
                        $paths[] = 'uploads/rooms/' . $filename;
                    }
                }
                jsonResponse(['success' => true, 'paths' => $paths]);
            }
            jsonResponse(['error' => 'Нет файлов'], 400);
            break;

        // ==================== БИЛЬЯРД ====================
        case 'get_billiards':
            requireAuth();
            $result = $db->query("SELECT * FROM billiards ORDER BY id");
            $items = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $items[] = $row; }
            jsonResponse($items);
            break;

        case 'save_billiard_price':
            requireAuth();
            $id = intval($input['id'] ?? 0);
            $price = floatval($input['price'] ?? 0);
            $stmt = $db->prepare("UPDATE billiards SET price = :price WHERE id = :id");
            $stmt->bindValue(':price', $price);
            $stmt->bindValue(':id', $id);
            $stmt->execute();
            jsonResponse(['success' => true]);
            break;

        // ==================== ДОКУМЕНТЫ ====================
        case 'get_documents':
            requireAuth();
            $result = $db->query("SELECT * FROM documents ORDER BY uploaded_at DESC");
            $docs = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) { $docs[] = $row; }
            jsonResponse($docs);
            break;

        case 'upload_document':
            requireAuth();
            $name = $_POST['name'] ?? 'Документ';
            if (!empty($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
                $filename = 'doc_' . time() . '_' . rand(1000,9999) . '.' . $ext;
                $dest = __DIR__ . '/../uploads/documents/' . $filename;
                move_uploaded_file($_FILES['file']['tmp_name'], $dest);
                $filePath = 'uploads/documents/' . $filename;

                $stmt = $db->prepare("INSERT INTO documents (name, file_path) VALUES (:name, :path)");
                $stmt->bindValue(':name', $name);
                $stmt->bindValue(':path', $filePath);
                $stmt->execute();

                jsonResponse(['success' => true, 'id' => $db->lastInsertRowID()]);
            }
            jsonResponse(['error' => 'Файл не загружен'], 400);
            break;

        case 'delete_document':
            requireAuth();
            $id = intval($input['id'] ?? 0);
            $stmt = $db->prepare("SELECT file_path FROM documents WHERE id = :id");
            $stmt->bindValue(':id', $id);
            $doc = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
            if ($doc) {
                $fullPath = __DIR__ . '/../' . $doc['file_path'];
                if (file_exists($fullPath)) { unlink($fullPath); }
                $db->exec("DELETE FROM documents WHERE id = $id");
            }
            jsonResponse(['success' => true]);
            break;

        default:
            jsonResponse(['error' => 'Неизвестное действие: ' . $action], 400);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
