// ─── МЕНЮ ────────────────────────────────────────────────────────────────────

export const menuCategories = [
  { id: 1, name: 'Холодные закуски', menu_type: 'main' },
  { id: 2, name: 'Салаты',          menu_type: 'main' },
  { id: 3, name: 'Супы',            menu_type: 'main' },
  { id: 4, name: 'Горячие блюда',   menu_type: 'main' },
  { id: 5, name: 'Гарниры',         menu_type: 'main' },
  { id: 6, name: 'Десерты',         menu_type: 'main' },
  { id: 7, name: 'Напитки',         menu_type: 'main' },
]

export const menuItems = [
  { id: 1,  category_id: 1, name: 'Нарезка из буженины',     description: 'Домашняя буженина с зеленью и хреном', price: 350, weight: '150 г' },
  { id: 2,  category_id: 1, name: 'Овощная нарезка',         description: 'Свежие сезонные овощи',               price: 220, weight: '200 г' },
  { id: 3,  category_id: 2, name: 'Цезарь с курицей',        description: 'Классический цезарь, курица гриль',   price: 380, weight: '250 г' },
  { id: 4,  category_id: 2, name: 'Греческий',               description: 'Овощи, маслины, фета',                price: 320, weight: '220 г' },
  { id: 5,  category_id: 3, name: 'Борщ',                    description: 'Классический со сметаной',            price: 280, weight: '300 мл' },
  { id: 6,  category_id: 3, name: 'Куриный бульон',          description: 'С домашней лапшой',                   price: 230, weight: '300 мл' },
  { id: 7,  category_id: 4, name: 'Котлета по-киевски',      description: 'С гарниром на выбор',                 price: 520, weight: '200 г' },
  { id: 8,  category_id: 4, name: 'Стейк из свинины',        description: 'На гриле с соусом барбекю',           price: 680, weight: '250 г' },
  { id: 9,  category_id: 5, name: 'Картофельное пюре',       description: 'Со сливочным маслом',                 price: 120, weight: '150 г' },
  { id: 10, category_id: 5, name: 'Рис отварной',            description: 'Длиннозерный пропаренный рис',        price: 90,  weight: '150 г' },
  { id: 11, category_id: 6, name: 'Тирамису',                description: 'Классический итальянский',            price: 290, weight: '120 г' },
  { id: 12, category_id: 7, name: 'Чай чёрный',              description: 'Листовой, с лимоном',                 price: 80,  weight: '300 мл' },
  { id: 13, category_id: 7, name: 'Кофе американо',          description: 'Зерновой, двойной',                   price: 150, weight: '200 мл' },
]

// ─── БИЗНЕС-ЛАНЧ ─────────────────────────────────────────────────────────────

export const lunchCategories = [
  { id: 10, name: 'Салат',          menu_type: 'business_lunch' },
  { id: 11, name: 'Суп',            menu_type: 'business_lunch' },
  { id: 12, name: 'Основное блюдо', menu_type: 'business_lunch' },
  { id: 13, name: 'Напиток',        menu_type: 'business_lunch' },
]

export const lunchItems = [
  { id: 101, category_id: 10, name: 'Салат из свежих овощей', description: 'Огурцы, помидоры, зелень', price: 120, weight: '150 г' },
  { id: 102, category_id: 10, name: 'Цезарь лёгкий',         description: 'Без курицы, с сухариками', price: 140, weight: '130 г' },
  { id: 103, category_id: 11, name: 'Суп дня',               description: 'Меняется ежедневно',       price: 150, weight: '300 мл' },
  { id: 104, category_id: 12, name: 'Курица с рисом',         description: 'Отварная грудка, рис',    price: 280, weight: '300 г' },
  { id: 105, category_id: 12, name: 'Котлета с пюре',         description: 'Домашняя котлета',         price: 260, weight: '300 г' },
  { id: 106, category_id: 13, name: 'Компот',                 description: 'Из сухофруктов',           price: 60,  weight: '200 мл' },
  { id: 107, category_id: 13, name: 'Чай / кофе',             description: 'На выбор',                 price: 80,  weight: '200 мл' },
]

// ─── НОМЕРА ───────────────────────────────────────────────────────────────────

export const roomTypes = ['Стандарт', 'Комфорт', 'Люкс', 'Полулюкс', 'Семейный']

export const amenitiesList = [
  'Wi-Fi', 'Кондиционер', 'Телевизор', 'Мини-бар', 'Сейф',
  'Фен', 'Холодильник', 'Чайник', 'Балкон', 'Вид на город',
  'Парковка', 'Завтрак включён',
]

export const equipmentInRoom = [
  'Кровать', 'Шкаф для одежды', 'Письменный стол',
  'Кресло', 'Зеркало', 'Телефон', 'Утюг и гладильная доска',
]

export const equipmentDisposable = [
  'Шампунь', 'Гель для душа', 'Мыло', 'Зубная щётка',
  'Зубная паста', 'Бритвенный набор', 'Шапочка для душа',
  'Расчёска', 'Ватные палочки', 'Ватные диски',
]

export const rooms = [
  {
    id: 1,
    type: 'Стандарт',
    name: 'Стандарт одноместный',
    description: 'Уютный номер для одного гостя',
    count: 10,
    area: 18,
    price: 3200,
    photo: null,
    amenities: ['Wi-Fi', 'Телевизор', 'Фен', 'Холодильник'],
  },
  {
    id: 2,
    type: 'Комфорт',
    name: 'Комфорт двухместный',
    description: 'Просторный номер с двуспальной кроватью',
    count: 8,
    area: 26,
    price: 5400,
    photo: null,
    amenities: ['Wi-Fi', 'Кондиционер', 'Телевизор', 'Фен', 'Холодильник', 'Чайник'],
  },
  {
    id: 3,
    type: 'Люкс',
    name: 'Люкс',
    description: 'Элегантный номер повышенного комфорта',
    count: 3,
    area: 45,
    price: 9800,
    photo: null,
    amenities: ['Wi-Fi', 'Кондиционер', 'Телевизор', 'Мини-бар', 'Сейф', 'Фен', 'Балкон'],
  },
]

// Страницы номеров (детальная информация)
export const roomPages = {
  1: {
    room_id: 1,
    gallery: [],
    preview_index: 0,
    full_description: 'Стандартный номер оснащён всем необходимым для комфортного отдыха. Подходит для одного гостя или пары.',
    bed_type: '1,5-спальная',
    equipment_in_room: ['Кровать', 'Шкаф для одежды', 'Письменный стол', 'Зеркало'],
    equipment_disposable: ['Шампунь', 'Гель для душа', 'Мыло', 'Зубная щётка'],
  },
  2: {
    room_id: 2,
    gallery: [],
    preview_index: 0,
    full_description: 'Номер Комфорт предлагает дополнительное пространство и улучшенный интерьер.',
    bed_type: '2-спальная',
    equipment_in_room: ['Кровать', 'Шкаф для одежды', 'Письменный стол', 'Кресло', 'Зеркало'],
    equipment_disposable: ['Шампунь', 'Гель для душа', 'Мыло', 'Зубная щётка', 'Зубная паста'],
  },
  3: {
    room_id: 3,
    gallery: [],
    preview_index: 0,
    full_description: 'Люкс — это максимум комфорта и изысканный интерьер. Просторная гостиная, панорамные окна.',
    bed_type: 'King-size',
    equipment_in_room: ['Кровать', 'Шкаф для одежды', 'Письменный стол', 'Кресло', 'Зеркало', 'Телефон'],
    equipment_disposable: ['Шампунь', 'Гель для душа', 'Мыло', 'Зубная щётка', 'Зубная паста', 'Бритвенный набор', 'Расчёска'],
  },
}

// ─── БИЛЬЯРД ──────────────────────────────────────────────────────────────────

export const billiardPrices = [
  { id: 1, table: '12 футов', duration: '1 час',  price: 800 },
  { id: 2, table: '12 футов', duration: '2 часа', price: 1400 },
  { id: 3, table: '12 футов', duration: '3 часа', price: 1900 },
  { id: 4, table: '12 футов', duration: 'Ночь',   price: 4500 },
  { id: 5, table: '8 футов',  duration: '1 час',  price: 600 },
  { id: 6, table: '8 футов',  duration: '2 часа', price: 1000 },
  { id: 7, table: '8 футов',  duration: '3 часа', price: 1400 },
  { id: 8, table: '8 футов',  duration: 'Ночь',   price: 3500 },
]

// ─── ДОКУМЕНТЫ ────────────────────────────────────────────────────────────────

export const documents = [
  { id: 1, name: 'Правила проживания',           filename: 'rules.pdf' },
  { id: 2, name: 'Договор оказания услуг',       filename: 'contract.pdf' },
  { id: 3, name: 'Прайс-лист дополнительных услуг', filename: 'pricelist.pdf' },
]

// ─── ПОЛЬЗОВАТЕЛИ ─────────────────────────────────────────────────────────────

export const users = [
  { id: 1, username: 'admin',    password: 'admin123', name: 'Администратор' },
  { id: 2, username: 'manager',  password: 'manager1', name: 'Менеджер' },
]
