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
    "programming": "Программирование",
    "python": "Python",
    "lua": "Lua",
    "ai": "Искусственный интеллект",
    "logic": "Логика и алгоритмы",
    "gaming_scams": "Игровые мошенничества",
    "safety_test": "Это нормально или опасно?",
    "cyber_hero_test": "Тест-игра: кибергерой",
}

TOPIC_EMOJI = {
    "phishing": "🎣",
    "cyberbullying": "🛡️",
    "passwords": "🔑",
    "viruses": "🦠",
    "privacy": "🔒",
    "safe": "🛡️",
    "programming": "💻",
    "python": "🐍",
    "lua": "⛏️",
    "ai": "🤖",
    "logic": "🧠",
    "gaming_scams": "🎮",
    "safety_test": "🎯",
    "cyber_hero_test": "🦸"
}

# Типы заданий
TASK_DRAGDROP = "dragdrop"
TASK_DRAG3D = "drag3d"
TASK_QUIZ = "quiz"
TASK_SORT = "sort"
TASK_TRUE_FALSE = "true_false"
TASK_SCENARIO = "scenario"
TASK_CODE = "code"
TASK_AI_PROMPT = "ai_prompt"
TASK_DEBUG = "debug"
TASK_ALGORITHM = "algorithm"

TASK_TYPES = {
    TASK_DRAGDROP: "Перетаскивание",
    TASK_DRAG3D: "3D-кубы",
    TASK_QUIZ: "Викторина",
    TASK_SORT: "Сортировка по категориям",
    TASK_TRUE_FALSE: "Правда или ложь",
    TASK_SCENARIO: "Ситуация",
    TASK_CODE: "Программирование",
    TASK_AI_PROMPT: "Промптинг ИИ",
    TASK_DEBUG: "Отладка кода",
    TASK_ALGORITHM: "Алгоритмы",
}