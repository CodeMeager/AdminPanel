# Сайт-заглушка гостиницы

Простой сайт на PHP + SQLite для тестирования админ-панели.

## Структура проекта

```
hotel-stub/
├── index.php              # Главная страница
├── db.php                 # Подключение к БД
├── init_db.php            # Инициализация БД + тестовые данные
├── style.css              # Стили сайта
├── pages/
│   ├── menu.php           # Основное меню
│   ├── business_lunch.php # Бизнес-ланч
│   ├── rooms.php          # Список номеров
│   ├── room_detail.php    # Страница номера
│   ├── billiards.php      # Бильярд
│   └── about.php          # О нас + документы
├── admin/
│   ├── index.php          # Заглушка для React-админки
│   └── api.php            # API (все CRUD-операции)
├── data/
│   └── database.sqlite    # БД (создаётся после init_db.php)
└── uploads/
    ├── rooms/             # Фото номеров
    ├── menu/              # Фото блюд
    └── documents/         # Документы
```

## Установка

### 1. Скопировать файлы на сервер

### 2. Инициализировать базу данных
```bash
php init_db.php
```
Будет создана БД с тестовыми данными.

### 3. Открыть в браузере
```
http://ваш-домен/index.php
```

## Тестовый аккаунт
- **Логин:** admin
- **Пароль:** admin123

## API эндпоинты (admin/api.php)

Все запросы идут на `admin/api.php?action=...`

### Авторизация
| Action | Метод | Описание |
|--------|-------|----------|
| `login` | POST | Вход (username, password) |
| `logout` | POST | Выход |
| `check_auth` | GET | Проверка авторизации |

### Меню
| Action | Метод | Описание |
|--------|-------|----------|
| `get_menu_categories` | GET | Категории (?menu_type=main/business_lunch) |
| `get_menu_items` | GET | Блюда категории (?category_id=N) |
| `save_menu_item` | POST | Создать/обновить блюдо |
| `delete_menu_item` | POST | Удалить блюдо |

### Номера
| Action | Метод | Описание |
|--------|-------|----------|
| `get_room_types` | GET | Типы номеров |
| `get_amenities` | GET | Список плюшек |
| `get_equipment` | GET | Список оснащения |
| `get_rooms` | GET | Все номера |
| `save_room` | POST | Создать/обновить номер |
| `delete_room` | POST | Удалить номер |
| `get_room_page` | GET | Страница номера (?room_id=N) |
| `save_room_page` | POST | Сохранить страницу номера |
| `upload_room_gallery` | POST | Загрузить фото в галерею |

### Бильярд
| Action | Метод | Описание |
|--------|-------|----------|
| `get_billiards` | GET | Все цены |
| `save_billiard_price` | POST | Обновить цену |

### Документы
| Action | Метод | Описание |
|--------|-------|----------|
| `get_documents` | GET | Все документы |
| `upload_document` | POST | Загрузить документ |
| `delete_document` | POST | Удалить документ |

## Требования
- PHP 7.4+ с расширением SQLite3
- Права на запись в папки `data/` и `uploads/`
