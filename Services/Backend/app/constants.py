# Роли
ROLE_USER = "user"  # обычный ребёнок
ROLE_ADMIN = "admin"  # просмотр пользователей и результатов
ROLE_FULL = "full"  # полное управление — действует только в связке с admin

# Возрастные группы
AGE_JUNIOR = "junior"  # 6-8
AGE_MIDDLE = "middle"  # 9-11
AGE_SENIOR = "senior"  # 12-14

AGE_GROUPS = {
    AGE_JUNIOR: "6–8 лет",
    AGE_MIDDLE: "9–11 лет",
    AGE_SENIOR: "12–14 лет",
}

# Темы
TOPICS = {
    "phishing": "Фишинг",
    "cyberbullying": "Кибербуллинг",
    "passwords": "Пароли",
    "viruses": "Вирусы",
    "privacy": "Личные данные",
    "safe": "Безопасные действия",
    "gaming_scams": "Игровые мошенничества",
    "safety_test": "Это нормально или опасно?",
    "cyber_hero_test": "Тест-игра: кибергерой",
    "digital_footprint": "Цифровой след",
}

TOPIC_EMOJI = {
    "phishing": "🎣",
    "cyberbullying": "🛡️",
    "passwords": "🔑",
    "viruses": "🦠",
    "privacy": "🔒",
    "safe": "🛡️",
    "gaming_scams": "🎮",
    "safety_test": "🎯",
    "cyber_hero_test": "🦸",
    "digital_footprint": "👣",
}

# Типы заданий
TASK_DRAGDROP = "dragdrop"
TASK_DRAG3D = "drag3d"
TASK_QUIZ = "quiz"
TASK_SORT = "sort"
TASK_TRUE_FALSE = "true_false"
TASK_SCENARIO = "scenario"
TASK_PHISHING_SITE = "phishing_site"
TASK_SCAM_BANNER = "scam_banner"
TASK_SCAM_CHAT = "scam_chat"
TASK_SCAM_CHAIN = "scam_chain"
TASK_SCAM_PHISHING = "scam_phishing"
TASK_SCAM_DEFENDER = "scam_defender"
TASK_THEORY_CARDS = "theory_cards"
TASK_QUICK_TEST = "quick_test"
TASK_DIGITAL_FOOTPRINT = "digital_footprint"

TASK_TYPES = {
    TASK_DRAGDROP: "Перетаскивание",
    TASK_DRAG3D: "3D-кубы",
    TASK_QUIZ: "Викторина",
    TASK_SORT: "Сортировка по категориям",
    TASK_TRUE_FALSE: "Правда или ложь",
    TASK_SCENARIO: "Ситуация",
    TASK_PHISHING_SITE: "Фишинговый сайт",
    TASK_SCAM_BANNER: "Мошеннический баннер",
    TASK_SCAM_CHAT: "Мошенник в чате",
    TASK_SCAM_CHAIN: "Цепочка мошенничества",
    TASK_SCAM_PHISHING: "Поддельное письмо",
    TASK_SCAM_DEFENDER: "Защита аккаунта",
    TASK_THEORY_CARDS: "Теоретические карточки",
    TASK_QUICK_TEST: "Быстрый тест",
    TASK_DIGITAL_FOOTPRINT: "Цифровой след",
}