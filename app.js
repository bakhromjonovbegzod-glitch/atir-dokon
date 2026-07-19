/* =========================================================
   ЭЛИТ ПАРФЮМ — script.js
   Общая логика магазина (index.html) и админ-панели (admin.html).
   Хранение данных: localStorage (без backend).
   ========================================================= */

/* ---------------- НАСТРОЙКИ ---------------- */
const STORE = {
  productsKey: 'elit_products',
  cartKey: 'elit_cart',
  ordersKey: 'elit_orders',
  adminSessionKey: 'elit_admin_session',
  adminPassword: 'elit2026', // пароль администратора — при необходимости смените
  telegramSupportUsername: 'Msmu77', // куда прилетает заказ
  telegramChannelUrl: 'https://t.me/atir_070',
};

const CATEGORY_LABELS = {
  men: 'Мужской',
  women: 'Женский',
  unisex: 'Унисекс',
  gift: 'Подарочный набор',
};

/* ---------------- ДЕМО-ТОВАРЫ (используются при первом запуске) ---------------- */
const DEFAULT_PRODUCTS = [
  { id: 'p47', name: 'Signature Gift Box', category: 'gift', price: 7900, oldPrice: 9900,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Подарочный набор: духи 50 мл + дорожный флакон + свеча.', inStock: true },
  { id: 'p26', name: 'Belle Vanille', category: 'women', price: 4500, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Цветочно-фруктовый букет с искрящимся шлейфом.', inStock: true },
  { id: 'p40', name: 'Neutral Line', category: 'unisex', price: 7400, oldPrice: 8900,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Свежий цитрусово-мускусный аромат для любого времени суток.', inStock: true },
  { id: 'p4', name: 'Royal Spice', category: 'men', price: 5900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Строгий и уверенный характер — кожа, специи, кедр.', inStock: true },
  { id: 'p12', name: 'Midnight Bourbon', category: 'men', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Пряный шлейф с оттенком ветивера и мускуса.', inStock: true },
  { id: 'p42', name: 'Elite Musk', category: 'unisex', price: 4900, oldPrice: 5900,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Минималистичный и чистый — для тех, кто ценит простоту.', inStock: true },
  { id: 'p48', name: 'Luxury Travel Set', category: 'gift', price: 7900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Идеальный подарок — два аромата в фирменной упаковке.', inStock: true },
  { id: 'p39', name: 'Elite Citrus', category: 'unisex', price: 6900, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Универсальный аромат, подходящий и мужчинам, и женщинам.', inStock: true },
  { id: 'p16', name: 'Blossom Dream', category: 'women', price: 4900, oldPrice: 6900,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Игривый и лёгкий аромат для повседневной элегантности.', inStock: true },
  { id: 'p34', name: 'Horizon Line', category: 'unisex', price: 7400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Свежий цитрусово-мускусный аромат для любого времени суток.', inStock: true },
  { id: 'p27', name: 'Blossom Mystère', category: 'women', price: 7400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Игривый и лёгкий аромат для повседневной элегантности.', inStock: true },
  { id: 'p13', name: 'Emir Bourbon', category: 'men', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p23', name: 'Rêve Cherie', category: 'women', price: 5400, oldPrice: 6400,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p41', name: 'Modern Blanc', category: 'unisex', price: 6400, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Минималистичный и чистый — для тех, кто ценит простоту.', inStock: true },
  { id: 'p38', name: 'Pure Air', category: 'unisex', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Универсальный аромат, подходящий и мужчинам, и женщинам.', inStock: true },
  { id: 'p25', name: 'Diamond Noir', category: 'women', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p15', name: 'Royal Bourbon', category: 'men', price: 7400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Пряный шлейф с оттенком ветивера и мускуса.', inStock: true },
  { id: 'p6', name: 'Silver Leather', category: 'men', price: 6900, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p24', name: 'Amour Petal', category: 'women', price: 7400, oldPrice: 8900,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Нежный жасмин и белые цветы для романтичных вечеров.', inStock: true },
  { id: 'p5', name: 'Onyx Musk', category: 'men', price: 6400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Холодное дерево и табак для вечерних выходов.', inStock: true },
  { id: 'p11', name: 'Noble Tobacco', category: 'men', price: 5900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p1', name: 'Platinum Leather', category: 'men', price: 3900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Строгий и уверенный характер — кожа, специи, кедр.', inStock: true },
  { id: 'p30', name: 'Amour Cherie', category: 'women', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p31', name: 'Zen Musk', category: 'unisex', price: 3900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Минималистичный и чистый — для тех, кто ценит простоту.', inStock: true },
  { id: 'p35', name: 'Elite Line', category: 'unisex', price: 6400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Минималистичный и чистый — для тех, кто ценит простоту.', inStock: true },
  { id: 'p21', name: 'Iris Mystère', category: 'women', price: 6400, oldPrice: 7900,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p3', name: 'Royal Tobacco', category: 'men', price: 3900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Пряный шлейф с оттенком ветивера и мускуса.', inStock: true },
  { id: 'p2', name: 'Onyx Leather', category: 'men', price: 4500, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p28', name: 'Diamond Cherie', category: 'women', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Нежный жасмин и белые цветы для романтичных вечеров.', inStock: true },
  { id: 'p29', name: 'Jasmine Cherie', category: 'women', price: 7400, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p45', name: 'Elite Discovery Set', category: 'gift', price: 9900, oldPrice: 11900,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Набор для знакомства с коллекцией Элит Парфюм.', inStock: true },
  { id: 'p32', name: 'Neutral Reflection', category: 'unisex', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Универсальный аромат, подходящий и мужчинам, и женщинам.', inStock: true },
  { id: 'p33', name: 'Zen Reflection', category: 'unisex', price: 6900, oldPrice: 7900,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Лёгкая древесная база с воздушным цитрусовым верхом.', inStock: true },
  { id: 'p44', name: 'Royal Collection Duo', category: 'gift', price: 11900, oldPrice: 13900,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Набор для знакомства с коллекцией Элит Парфюм.', inStock: true },
  { id: 'p37', name: 'Essence Musk', category: 'unisex', price: 3900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Свежий цитрусово-мускусный аромат для любого времени суток.', inStock: true },
  { id: 'p22', name: 'Belle Dream', category: 'women', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Нежный жасмин и белые цветы для романтичных вечеров.', inStock: true },
  { id: 'p14', name: 'Royal Oud', category: 'men', price: 6400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Холодное дерево и табак для вечерних выходов.', inStock: true },
  { id: 'p19', name: 'Amour Rose', category: 'women', price: 6900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Нежный жасмин и белые цветы для романтичных вечеров.', inStock: true },
  { id: 'p18', name: 'Iris Noir', category: 'women', price: 4500, oldPrice: 5500,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Игривый и лёгкий аромат для повседневной элегантности.', inStock: true },
  { id: 'p10', name: 'Dark Cedar', category: 'men', price: 7400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Холодное дерево и табак для вечерних выходов.', inStock: true },
  { id: 'p49', name: 'Anniversary Duo Set', category: 'gift', price: 9900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Набор для знакомства с коллекцией Элит Парфюм.', inStock: true },
  { id: 'p46', name: 'Golden Trio Set', category: 'gift', price: 10900, oldPrice: 12900,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Набор для знакомства с коллекцией Элит Парфюм.', inStock: true },
  { id: 'p8', name: 'Sultan Bourbon', category: 'men', price: 6400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p17', name: 'Amour Elixir', category: 'women', price: 6400, oldPrice: 7400,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p9', name: 'Platinum Tobacco', category: 'men', price: 5900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p7', name: 'Onyx Spice', category: 'men', price: 4500, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Холодное дерево и табак для вечерних выходов.', inStock: true },
  { id: 'p50', name: 'Wedding Gift Collection', category: 'gift', price: 9900, oldPrice: 11900,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Подарочный набор: духи 50 мл + дорожный флакон + свеча.', inStock: true },
  { id: 'p20', name: 'Lily Noir', category: 'women', price: 4500, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Нежный жасмин и белые цветы для романтичных вечеров.', inStock: true },
  { id: 'p36', name: 'Aura Line', category: 'unisex', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Свежий цитрусово-мускусный аромат для любого времени суток.', inStock: true },
  { id: 'p43', name: 'Imperial Amber Set', category: 'gift', price: 10900, oldPrice: 12900,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Подарочный набор: духи 50 мл + дорожный флакон + свеча.', inStock: true },
  { id: 'p62', name: 'Rose Peony', category: 'women', price: 3900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Изысканный цветочный шлейф с оттенком пудры.', inStock: true },
  { id: 'p54', name: 'Onyx Pepper', category: 'men', price: 6900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Пряный шлейф с оттенком ветивера и мускуса.', inStock: true },
  { id: 'p73', name: 'Pure Drift', category: 'unisex', price: 5900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Универсальный аромат, подходящий и мужчинам, и женщинам.', inStock: true },
  { id: 'p78', name: 'Festive Gift Collection', category: 'gift', price: 12900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Идеальный подарок — два аромата в фирменной упаковке.', inStock: true },
  { id: 'p80', name: 'Couple\'s Fragrance Set', category: 'gift', price: 7900, oldPrice: 9900,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Набор для знакомства с коллекцией Элит Парфюм.', inStock: true },
  { id: 'p58', name: 'Emir Oud', category: 'men', price: 6400, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Пряный шлейф с оттенком ветивера и мускуса.', inStock: true },
  { id: 'p53', name: 'Falcon Spice', category: 'men', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Строгий и уверенный характер — кожа, специи, кедр.', inStock: true },
  { id: 'p69', name: 'Skyline Drift', category: 'unisex', price: 4500, oldPrice: 5500,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Универсальный аромат, подходящий и мужчинам, и женщинам.', inStock: true },
  { id: 'p61', name: 'Amour Éclat', category: 'women', price: 3900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Игривый и лёгкий аромат для повседневной элегантности.', inStock: true },
  { id: 'p66', name: 'Rêve Peony', category: 'women', price: 7400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p70', name: 'Essence Air', category: 'unisex', price: 5900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Лёгкая древесная база с воздушным цитрусовым верхом.', inStock: true },
  { id: 'p71', name: 'Pure Bloom', category: 'unisex', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Минималистичный и чистый — для тех, кто ценит простоту.', inStock: true },
  { id: 'p55', name: 'Noble Pepper', category: 'men', price: 6400, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p63', name: 'Iris Glow', category: 'women', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p52', name: 'Black Cedar', category: 'men', price: 6900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p51', name: 'King\'s Musk', category: 'men', price: 5400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800',
    description: 'Строгий и уверенный характер — кожа, специи, кедр.', inStock: true },
  { id: 'p79', name: 'Birthday Gift Set', category: 'gift', price: 10900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Роскошная подарочная коллекция в бархатной шкатулке.', inStock: true },
  { id: 'p60', name: 'Crystal Vanille', category: 'women', price: 6900, oldPrice: 8400,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800',
    description: 'Цветочно-фруктовый букет с искрящимся шлейфом.', inStock: true },
  { id: 'p77', name: 'Premium Sampler Set', category: 'gift', price: 12900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Набор для знакомства с коллекцией Элит Парфюм.', inStock: true },
  { id: 'p68', name: 'Rêve Whisper', category: 'women', price: 6900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=800',
    description: 'Игривый и лёгкий аромат для повседневной элегантности.', inStock: true },
  { id: 'p75', name: 'Balance Tone', category: 'unisex', price: 7400, oldPrice: 8900,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Лёгкая древесная база с воздушным цитрусовым верхом.', inStock: true },
  { id: 'p64', name: 'Pearl Orchid', category: 'women', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p59', name: 'Falcon Whiskey', category: 'men', price: 4900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800',
    description: 'Насыщенный древесно-восточный аромат с нотами уда и амбры.', inStock: true },
  { id: 'p57', name: 'Onyx Whiskey', category: 'men', price: 7900, oldPrice: 9900,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Дымный, харизматичный аромат для сильных личностей.', inStock: true },
  { id: 'p65', name: 'Diamond Bloom', category: 'women', price: 5900, oldPrice: 6900,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800',
    description: 'Цветочно-фруктовый букет с искрящимся шлейфом.', inStock: true },
  { id: 'p76', name: 'Deluxe Duo Set', category: 'gift', price: 7900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Идеальный подарок — два аромата в фирменной упаковке.', inStock: true },
  { id: 'p67', name: 'Belle Bloom', category: 'women', price: 4500, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800',
    description: 'Тёмная роза, пачули и ваниль — вечерний аромат.', inStock: true },
  { id: 'p56', name: 'Steel Amber', category: 'men', price: 6900, oldPrice: 8900,
    image: 'https://images.unsplash.com/photo-1592842232655-e5f6b1a5d5f2?q=80&w=800',
    description: 'Строгий и уверенный характер — кожа, специи, кедр.', inStock: true },
  { id: 'p74', name: 'Infinite Citrus', category: 'unisex', price: 5900, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'Минималистичный и чистый — для тех, кто ценит простоту.', inStock: true },
  { id: 'p72', name: 'Horizon Wood', category: 'unisex', price: 7400, oldPrice: 0,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'Универсальный аромат, подходящий и мужчинам, и женщинам.', inStock: true },
];

/* ---------------- УТИЛИТЫ ---------------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function formatPrice(n) {
  return Number(n || 0).toLocaleString('ru-RU') + ' ₽';
}
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function showToast(message, isError) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.textContent = message;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ---------------- ДАННЫЕ: ТОВАРЫ ---------------- */
function getProducts() {
  let products = readJSON(STORE.productsKey, null);
  if (!products) {
    products = DEFAULT_PRODUCTS;
    writeJSON(STORE.productsKey, products);
  }
  return products;
}
function saveProducts(products) {
  writeJSON(STORE.productsKey, products);
}
function getProductById(id) {
  return getProducts().find((p) => p.id === id);
}

/* ---------------- ДАННЫЕ: КОРЗИНА ---------------- */
function getCart() {
  return readJSON(STORE.cartKey, []);
}
function saveCart(cart) {
  writeJSON(STORE.cartKey, cart);
  updateCartBadge();
}
function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
function addToCart(productId, qty) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty || 1;
  } else {
    cart.push({ id: productId, qty: qty || 1 });
  }
  saveCart(cart);
  showToast('Добавлено в корзину');
  renderCartDrawer();
}
function changeCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  const next = item.qty <= 0 ? cart.filter((i) => i.id !== productId) : cart;
  saveCart(next);
  renderCartDrawer();
}
function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.id !== productId));
  renderCartDrawer();
}
function cartTotal() {
  return getCart().reduce((sum, item) => {
    const p = getProductById(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}
function updateCartBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (badge) badge.textContent = cartCount();
}

/* ---------------- ДАННЫЕ: ЗАКАЗЫ ---------------- */
function getOrders() {
  return readJSON(STORE.ordersKey, []);
}
function saveOrders(orders) {
  writeJSON(STORE.ordersKey, orders);
}
function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}
function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
}

/* =========================================================
   ВИТРИНА (index.html)
   ========================================================= */
let activeCategory = 'all';

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  const products = getProducts().filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  if (!products.length) {
    grid.innerHTML = '<div class="empty-state">В этой категории пока нет товаров. Загляните позже.</div>';
    return;
  }

  grid.innerHTML = products.map((p) => `
    <div class="card">
      <div class="card-media">
        ${p.oldPrice > 0 ? '<span class="card-tag">Скидка</span>' : ''}
        ${!p.inStock ? '<span class="card-tag out">Нет в наличии</span>' : ''}
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">
      </div>
      <div class="card-body">
        <span class="card-cat">${escapeHtml(CATEGORY_LABELS[p.category] || p.category)}</span>
        <h3 class="card-name">${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        <div class="card-foot">
          <div>
            ${p.oldPrice > 0 ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
            <span class="price">${formatPrice(p.price)}</span>
          </div>
          <button class="add-btn" ${p.inStock ? '' : 'disabled'} data-add="${p.id}">
            ${p.inStock ? 'В корзину' : 'Недоступно'}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(btn.dataset.add, 1));
  });
  grid.querySelectorAll('.card-media img, .card-name').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const card = el.closest('.card');
      const btn = card.querySelector('[data-add]');
      openProductView(btn.dataset.add);
    });
  });
}

function setActiveCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.filter === cat);
  });
  renderCatalog();
}

function openProductView(productId) {
  const p = getProductById(productId);
  if (!p) return;
  const modal = document.getElementById('productModal');
  const body = document.getElementById('productModalBody');
  body.innerHTML = `
    <div class="pv-grid">
      <div class="pv-media"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"></div>
      <div>
        <span class="card-cat">${escapeHtml(CATEGORY_LABELS[p.category] || p.category)}</span>
        <h3 class="modal-title" style="margin-top:8px;">${escapeHtml(p.name)}</h3>
        <p class="modal-sub">${escapeHtml(p.description)}</p>
        <div style="margin:18px 0;">
          ${p.oldPrice > 0 ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          <span class="price" style="font-size:26px;">${formatPrice(p.price)}</span>
        </div>
        <button class="btn btn-gold btn-block" ${p.inStock ? '' : 'disabled'} id="pvAddBtn">
          ${p.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  `;
  const addBtn = document.getElementById('pvAddBtn');
  if (addBtn) addBtn.addEventListener('click', () => { addToCart(p.id, 1); closeModal('productModal'); });
  openModal('productModal');
}

/* ---------- корзина: отрисовка ---------- */
function renderCartDrawer() {
  const list = document.getElementById('cartItems');
  if (!list) return;
  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = '<div class="empty-state">Корзина пуста. Выберите свой аромат в каталоге.</div>';
  } else {
    list.innerHTML = cart.map((item) => {
      const p = getProductById(item.id);
      if (!p) return '';
      return `
        <div class="cart-item">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
          <div class="cart-item-info">
            <b>${escapeHtml(p.name)}</b>
            <span class="muted" style="font-size:12px;">${formatPrice(p.price)}</span>
            <div class="qty-row">
              <button class="qty-btn" data-dec="${p.id}">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-inc="${p.id}">+</button>
              <a class="remove-link" data-remove="${p.id}">Удалить</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-inc]').forEach((b) => b.addEventListener('click', () => changeCartQty(b.dataset.inc, 1)));
    list.querySelectorAll('[data-dec]').forEach((b) => b.addEventListener('click', () => changeCartQty(b.dataset.dec, -1)));
    list.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => removeFromCart(b.dataset.remove)));
  }

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = formatPrice(cartTotal());
  updateCartBadge();
}

/* ---------- модалки / шторка: открытие-закрытие ---------- */
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function openDrawer() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('drawerOverlay')?.classList.add('open');
}
function closeDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('drawerOverlay')?.classList.remove('open');
}

/* ---------- оформление заказа -> Telegram ---------- */
function buildTelegramOrderText(order) {
  const lines = [];
  lines.push('Новый заказ — Элит Парфюм');
  lines.push('№ ' + order.id);
  lines.push('Имя: ' + order.name);
  lines.push('Телефон: ' + order.phone);
  if (order.address) lines.push('Адрес: ' + order.address);
  if (order.comment) lines.push('Комментарий: ' + order.comment);
  lines.push('');
  lines.push('Состав заказа:');
  order.items.forEach((it) => {
    lines.push('— ' + it.name + ' × ' + it.qty + ' = ' + formatPrice(it.price * it.qty));
  });
  lines.push('');
  lines.push('Итого: ' + formatPrice(order.total));
  return lines.join('\n');
}

function submitCheckout(e) {
  e.preventDefault();
  const cart = getCart();
  if (!cart.length) {
    showToast('Корзина пуста', true);
    return;
  }
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const comment = document.getElementById('coComment').value.trim();

  if (!name || !phone) {
    showToast('Заполните имя и телефон', true);
    return;
  }

  const items = cart.map((item) => {
    const p = getProductById(item.id);
    return { id: item.id, name: p ? p.name : 'Товар удалён', price: p ? p.price : 0, qty: item.qty };
  });

  const order = {
    id: uid('order'),
    date: new Date().toISOString(),
    name, phone, address, comment,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    status: 'new',
  };

  addOrder(order);
  saveCart([]);
  renderCartDrawer();
  closeModal('checkoutModal');
  closeDrawer();

  const text = encodeURIComponent(buildTelegramOrderText(order));
  window.open(`https://t.me/${STORE.telegramSupportUsername}?text=${text}`, '_blank');

  showToast('Заказ оформлен! Открываем Telegram для отправки...');
  document.getElementById('checkoutForm')?.reset();
}

/* =========================================================
   ИНИЦИАЛИЗАЦИЯ ВИТРИНЫ
   ========================================================= */
function initStorefront() {
  getProducts(); // засеять демо-товары при первом запуске
  renderCatalog();
  renderCartDrawer();
  updateCartBadge();

  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => setActiveCategory(chip.dataset.filter));
  });

  document.getElementById('cartBtn')?.addEventListener('click', openDrawer);
  document.getElementById('closeDrawerBtn')?.addEventListener('click', closeDrawer);
  document.getElementById('drawerOverlay')?.addEventListener('click', closeDrawer);

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!getCart().length) { showToast('Корзина пуста', true); return; }
    closeDrawer();
    openModal('checkoutModal');
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  document.getElementById('checkoutForm')?.addEventListener('submit', submitCheckout);

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
  });

  // плавный скролл к каталогу с любой кнопки-якоря уже обеспечен CSS scroll-behavior
}

/* =========================================================
   АДМИН-ПАНЕЛЬ (admin.html)
   ========================================================= */
function isAdminLoggedIn() {
  return sessionStorage.getItem(STORE.adminSessionKey) === '1';
}
function adminLogin(password) {
  if (password === STORE.adminPassword) {
    sessionStorage.setItem(STORE.adminSessionKey, '1');
    return true;
  }
  return false;
}
function adminLogout() {
  sessionStorage.removeItem(STORE.adminSessionKey);
  window.location.reload();
}

function renderAdminGate() {
  const gate = document.getElementById('loginShell');
  const shell = document.getElementById('adminShell');
  if (!gate || !shell) return;
  if (isAdminLoggedIn()) {
    gate.style.display = 'none';
    shell.style.display = 'flex';
    initAdminApp();
  } else {
    gate.style.display = 'flex';
    shell.style.display = 'none';
  }
}

function initAdminLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    if (adminLogin(pass)) {
      errorEl.textContent = '';
      renderAdminGate();
    } else {
      errorEl.textContent = 'Неверный пароль. Попробуйте ещё раз.';
    }
  });
}

let adminTab = 'products';

function initAdminApp() {
  document.getElementById('logoutBtn')?.addEventListener('click', adminLogout);

  document.querySelectorAll('.side-link[data-tab]').forEach((link) => {
    link.addEventListener('click', () => setAdminTab(link.dataset.tab));
  });

  document.getElementById('newProductBtn')?.addEventListener('click', () => openProductForm(null));
  document.getElementById('productForm')?.addEventListener('submit', submitProductForm);
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
  });

  renderAdminStats();
  renderAdminProducts();
  renderAdminOrders();
}

function setAdminTab(tab) {
  adminTab = tab;
  document.querySelectorAll('.side-link[data-tab]').forEach((l) => l.classList.toggle('active', l.dataset.tab === tab));
  document.querySelectorAll('.admin-panel').forEach((p) => p.style.display = 'none');
  document.getElementById('panel-' + tab).style.display = 'block';
  renderAdminStats();
}

function renderAdminStats() {
  const products = getProducts();
  const orders = getOrders();
  const revenue = orders.filter((o) => o.status !== 'cancel').reduce((s, o) => s + o.total, 0);
  const el = document.getElementById('adminStats');
  if (!el) return;
  el.innerHTML = `
    <div class="stat-card"><div class="num">${products.length}</div><div class="lbl">Товаров</div></div>
    <div class="stat-card"><div class="num">${orders.length}</div><div class="lbl">Заказов</div></div>
    <div class="stat-card"><div class="num">${orders.filter((o) => o.status === 'new').length}</div><div class="lbl">Новых</div></div>
    <div class="stat-card"><div class="num">${formatPrice(revenue)}</div><div class="lbl">Оборот</div></div>
  `;
}

/* ---------- админ: товары ---------- */
function renderAdminProducts() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;
  const products = getProducts();

  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">Пока нет товаров — добавьте первый.</div></td></tr>';
    return;
  }

  tbody.innerHTML = products.map((p) => `
    <tr>
      <td><img class="row-thumb" src="${escapeHtml(p.image)}" alt=""></td>
      <td><b>${escapeHtml(p.name)}</b></td>
      <td>${escapeHtml(CATEGORY_LABELS[p.category] || p.category)}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.inStock ? '<span class="badge badge-done">В наличии</span>' : '<span class="badge badge-cancel">Нет</span>'}</td>
      <td>
        <div class="row-actions">
          <button class="icon-link" data-edit="${p.id}">Изменить</button>
          <button class="icon-link" data-delete="${p.id}">Удалить</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openProductForm(b.dataset.edit)));
  tbody.querySelectorAll('[data-delete]').forEach((b) => b.addEventListener('click', () => {
    if (confirm('Удалить этот товар?')) {
      saveProducts(getProducts().filter((p) => p.id !== b.dataset.delete));
      renderAdminProducts();
      renderAdminStats();
      showToast('Товар удалён');
    }
  }));
}

function openProductForm(productId) {
  const form = document.getElementById('productForm');
  form.reset();
  document.getElementById('productFormTitle').textContent = productId ? 'Изменить товар' : 'Новый товар';
  document.getElementById('pfId').value = productId || '';

  if (productId) {
    const p = getProductById(productId);
    if (p) {
      document.getElementById('pfName').value = p.name;
      document.getElementById('pfCategory').value = p.category;
      document.getElementById('pfPrice').value = p.price;
      document.getElementById('pfOldPrice').value = p.oldPrice || '';
      document.getElementById('pfImage').value = p.image;
      document.getElementById('pfDescription').value = p.description;
      document.getElementById('pfInStock').checked = p.inStock;
    }
  } else {
    document.getElementById('pfInStock').checked = true;
  }
  openModal('productModal');
}

function submitProductForm(e) {
  e.preventDefault();
  const id = document.getElementById('pfId').value;
  const name = document.getElementById('pfName').value.trim();
  const category = document.getElementById('pfCategory').value;
  const price = Number(document.getElementById('pfPrice').value);
  const oldPrice = Number(document.getElementById('pfOldPrice').value) || 0;
  const image = document.getElementById('pfImage').value.trim();
  const description = document.getElementById('pfDescription').value.trim();
  const inStock = document.getElementById('pfInStock').checked;

  if (!name || !price || !image) {
    showToast('Заполните название, цену и изображение', true);
    return;
  }

  const products = getProducts();
  if (id) {
    const p = products.find((x) => x.id === id);
    Object.assign(p, { name, category, price, oldPrice, image, description, inStock });
  } else {
    products.push({ id: uid('p'), name, category, price, oldPrice, image, description, inStock });
  }
  saveProducts(products);
  closeModal('productModal');
  renderAdminProducts();
  renderAdminStats();
  showToast(id ? 'Товар обновлён' : 'Товар добавлен');
}

/* ---------- админ: заказы ---------- */
function renderAdminOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;
  const orders = getOrders();

  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">Заказов пока нет.</div></td></tr>';
    return;
  }

  const statusLabel = { new: 'Новый', done: 'Обработан', cancel: 'Отменён' };
  const statusClass = { new: 'badge-new', done: 'badge-done', cancel: 'badge-cancel' };

  tbody.innerHTML = orders.map((o) => `
    <tr>
      <td>${new Date(o.date).toLocaleString('ru-RU')}</td>
      <td><b>${escapeHtml(o.name)}</b><br><span class="muted">${escapeHtml(o.phone)}</span></td>
      <td>${o.items.length} тов.</td>
      <td>${formatPrice(o.total)}</td>
      <td><span class="badge ${statusClass[o.status]}">${statusLabel[o.status]}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-link" data-view="${o.id}">Детали</button>
          ${o.status !== 'done' ? `<button class="icon-link" data-done="${o.id}">Готово</button>` : ''}
          ${o.status !== 'cancel' ? `<button class="icon-link" data-cancel="${o.id}">Отменить</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-done]').forEach((b) => b.addEventListener('click', () => { updateOrderStatus(b.dataset.done, 'done'); renderAdminOrders(); renderAdminStats(); }));
  tbody.querySelectorAll('[data-cancel]').forEach((b) => b.addEventListener('click', () => { updateOrderStatus(b.dataset.cancel, 'cancel'); renderAdminOrders(); renderAdminStats(); }));
  tbody.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => viewOrder(b.dataset.view)));
}

function viewOrder(orderId) {
  const order = getOrders().find((o) => o.id === orderId);
  if (!order) return;
  const body = document.getElementById('orderModalBody');
  body.innerHTML = `
    <div class="order-detail-list">
      <p><b>Заказ:</b> ${escapeHtml(order.id)}</p>
      <p><b>Клиент:</b> ${escapeHtml(order.name)} · ${escapeHtml(order.phone)}</p>
      ${order.address ? `<p><b>Адрес:</b> ${escapeHtml(order.address)}</p>` : ''}
      ${order.comment ? `<p><b>Комментарий:</b> ${escapeHtml(order.comment)}</p>` : ''}
      <hr style="border-color:var(--gold-line); margin:14px 0;">
      ${order.items.map((it) => `<p>— ${escapeHtml(it.name)} × ${it.qty} = ${formatPrice(it.price * it.qty)}</p>`).join('')}
      <hr style="border-color:var(--gold-line); margin:14px 0;">
      <p><b>Итого: ${formatPrice(order.total)}</b></p>
    </div>
  `;
  openModal('orderModal');
}

/* ---------------- ЗАПУСК ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  if (document.body.dataset.page === 'store') {
    initStorefront();
  }
  if (document.body.dataset.page === 'admin') {
    initAdminLoginForm();
    renderAdminGate();
  }
});