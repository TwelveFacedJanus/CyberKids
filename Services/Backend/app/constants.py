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
    #
    "fake_friends": "Фальшивые друзья",
    "ai_traps": "Ловушки с ИИ и дипфейками",
    "easy_money": "Лёгкие деньги",
    "school_trap": "Школьная ловушка",
    "cybersecurity": "Кибербезопасность",
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
    #
    "fake_friends": "👥",
    "ai_traps": "🤖",
    "easy_money": "💰",
    "school_trap": "🏫",
    "cybersecurity": "🛡️",
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
TASK_PROFILE_BUILDER = "profile_builder"
TASK_PHOTO_DETECTIVE = "photo_detective"
TASK_FAKE_FRIEND_CHAT = "fake_friend_chat"
TASK_HACKED_FRIEND = "hacked_friend"
TASK_SAFE_JOB_SORT = "safe_job_sort"
TASK_DROPPER_CHAT = "dropper_chat"
TASK_FAKE_DIARY = "fake_diary"
TASK_PRIZE_TRAP = "prize_trap"


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
    TASK_PROFILE_BUILDER: "Сборка профиля",
    TASK_PHOTO_DETECTIVE: "Фото-детектив",
    TASK_FAKE_FRIEND_CHAT: "Фальшивый друг",
    TASK_HACKED_FRIEND: "Взломанный друг",
    TASK_SAFE_JOB_SORT: "Биржа подработок",
    TASK_DROPPER_CHAT: "Подработка с переводами",
    TASK_FAKE_DIARY: "Дневник-двойник",
    TASK_PRIZE_TRAP: "Приз победителю",
}