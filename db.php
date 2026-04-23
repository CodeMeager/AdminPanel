<?php
/**
 * Подключение к базе данных
 */
function getDB(): SQLite3 {
    $dbPath = __DIR__ . '/data/database.sqlite';
    if (!file_exists($dbPath)) {
        die('База данных не найдена. Запустите: php init_db.php');
    }
    $db = new SQLite3($dbPath);
    $db->enableExceptions(true);
    $db->exec("PRAGMA foreign_keys = ON");
    return $db;
}
