# backend/app/routers/execution.py
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..dependencies import get_current_user
from ..models import User
from ..config import settings

router = APIRouter(prefix="/api/run", tags=["execution"])

class CodeRequest(BaseModel):
    code: str
    language: str  # python, javascript, lua

class CodeResponse(BaseModel):
    output: str
    success: bool
    error: Optional[str] = None

class AIPromptRequest(BaseModel):
    prompt: str

class AIPromptResponse(BaseModel):
    response: str
    success: bool
    match_percentage: int = 0
    matched_words: list[str] = []
    error: Optional[str] = None

# URL-ы интерпретаторов
INTERPRETER_URLS = {
    "python": settings.PYTHON_INTERPRETER_URL,
    "javascript": settings.NODEJS_INTERPRETER_URL,
    "lua": settings.LUA_INTERPRETER_URL,
}

@router.post("/code", response_model=CodeResponse)
async def execute_code(
    request: CodeRequest,
    user: User = Depends(get_current_user)
):
    """Выполняет код через соответствующий интерпретатор в Docker"""
    
    # Проверки безопасности
    if len(request.code) > 10000:
        raise HTTPException(status_code=400, detail="Код слишком длинный")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Аккаунт отключён")
    
    # Проверка языка
    if request.language not in INTERPRETER_URLS:
        raise HTTPException(
            status_code=400,
            detail=f"Язык '{request.language}' не поддерживается. Доступны: {', '.join(INTERPRETER_URLS.keys())}"
        )
    
    # Отправляем код в интерпретатор
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                INTERPRETER_URLS[request.language],
                json={
                    "code": request.code,
                    "language": request.language
                }
            )
            
            if response.status_code != 200:
                return CodeResponse(
                    output="",
                    success=False,
                    error=f"Ошибка интерпретатора: {response.status_code}"
                )
            
            data = response.json()
            return CodeResponse(
                output=data.get("output", "(пустой вывод)"),
                success=data.get("success", False),
                error=data.get("error")
            )
            
    except httpx.TimeoutException:
        return CodeResponse(
            output="",
            success=False,
            error="Превышено время выполнения (10 секунд)"
        )
    except Exception as e:
        return CodeResponse(
            output="",
            success=False,
            error=f"Ошибка выполнения: {str(e)}"
        )


# ==================== AI-промптинг ====================

# Можно использовать внешний API или локальную модель
# Пока оставляем имитацию

async def generate_ai_response(prompt: str) -> tuple[str, bool, Optional[str]]:
    """Генерирует ответ на промпт"""
    
    prompt_lower = prompt.lower()
    
    # Сказка про дружбу
    if "сказка" in prompt_lower and ("дружб" in prompt_lower or "дракон" in prompt_lower):
        return (
            "🐉 Жил-был добрый дракон по имени Дракоша. Однажды он встретил храброго котёнка по имени Мурзик. "
            "Сначала они боялись друг друга, но потом поняли, что вместе они сильнее. "
            "Они стали лучшими друзьями и вместе спасли лес от злых колдунов. "
            "С тех пор они всегда помогали друг другу и другим зверятам! 🐱",
            True,
            None
        )
    
    # Советы по безопасности
    if "совет" in prompt_lower and ("безопасн" in prompt_lower or "интернет" in prompt_lower):
        return (
            "🛡️ 3 главных совета по безопасности в интернете:\n\n"
            "1️⃣ 🔐 **Создавай сложные пароли** — используй буквы, цифры и специальные символы.\n"
            "2️⃣ 🎣 **Не попадайся на фишинг** — не переходи по подозрительным ссылкам.\n"
            "3️⃣ 🤫 **Защищай личные данные** — не публикуй адрес, телефон и пароли.",
            True,
            None
        )
    
    return (
        f"🤖 Спасибо за твой промпт!\n\n"
        f"💡 Для лучшего результата попробуй быть более конкретным.\n"
        f"Примеры хороших промптов:\n"
        f"- «Напиши сказку про дракона и котёнка»\n"
        f"- «Дай 3 совета по безопасности в интернете»",
        True,
        None
    )


@router.post("/ai-prompt", response_model=AIPromptResponse)
async def execute_ai_prompt(
    request: AIPromptRequest,
    user: User = Depends(get_current_user)
):
    """Отправляет промпт в ИИ и возвращает ответ с оценкой"""
    
    if not request.prompt or len(request.prompt) < 3:
        raise HTTPException(status_code=400, detail="Промпт слишком короткий")
    
    if len(request.prompt) > 5000:
        raise HTTPException(status_code=400, detail="Промпт слишком длинный")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Аккаунт отключён")
    
    # Генерируем ответ и считаем совпадения
    response, success, error, match_percentage, matched_words = await generate_ai_response_with_score(request.prompt)
    
    # 🔧 Отладка перед отправкой
    print(f"[AI] ОТПРАВЛЯЮ В ОТВЕТ: match_percentage={match_percentage}, matched_words={matched_words}")
    
    return AIPromptResponse(
        response=response,
        success=success,
        match_percentage=match_percentage,  # ✅ Теперь точно передаём
        matched_words=matched_words,         # ✅ Теперь точно передаём
        error=error
    )

async def generate_ai_response_with_score(prompt: str) -> tuple[str, bool, Optional[str], int, list[str]]:
    """
    Генерирует ответ на промпт и считает качество промпта.
    Оценивается:
    1. Процент совпадений слов промпта с ключевыми словами (точность)
    2. Количество уникальных ключевых слов, которые удалось затронуть (полнота)
    """
    
    prompt_lower = prompt.lower()
    
    # Разбиваем промпт на слова (убираем знаки препинания)
    import re
    prompt_words = set(re.findall(r'[а-яёa-z]+', prompt_lower))
    
    # 🔑 РАСШИРЕННЫЙ СЛОВАРЬ
    keyword_contexts = {
        "сказка": {
            "keywords": [
                "сказк", "сказка", "сказки", "сказку", "сказкой", "сказке",
                "дракон", "дракона", "дракону", "драконом", "драконе", "драконы",
                "котён", "котен", "котёнок", "котенок", "котёнка", "котенка",
                "дружб", "дружба", "дружбы", "дружбу", "дружбой", "дружбе",
                "спас", "спасли", "спасать", "спасти",
                "лес", "леса", "лесу", "лесом", "лесе",
                "вмест", "вместе", "вместо",
                "помог", "помогли", "помогать", "помочь",
                "добр", "добрый", "добрая", "доброе", "добрые",
                "храбр", "храбрый", "храбрая", "храброе", "храбрые",
                "друг", "друга", "другу", "другом", "друзья", "друзей",
                "история", "историю", "истории",
                "приключени", "приключение", "приключения",
                "герой", "героя", "герои", "героев",
                "волшеб", "волшебный", "волшебная", "волшебное",
                "маги", "магия", "магический",
                "чудес", "чудо", "чудеса", "чудесный",
                "принц", "принцесса", "король", "королева",
                "замок", "замка", "замку",
                "злой", "злая", "злое", "злые", "злодей",
                "колдун", "колдуна", "колдуны",
                "волшебник", "волшебника",
            ],
            "response": "🐉 Жил-был добрый дракон по имени Дракоша. Однажды он встретил храброго котёнка по имени Мурзик. Сначала они боялись друг друга, но потом поняли, что вместе они сильнее. Они стали лучшими друзьями и вместе спасли лес от злых колдунов. С тех пор они всегда помогали друг другу и другим зверятам! 🐱"
        },
        "совет": {
            "keywords": [
                "пароль", "пароля", "паролю", "паролем", "пароле", "пароли",
                "фишинг", "фишинга",
                "личн", "личный", "личная", "личное", "личные",
                "данные", "данных", "данным", "данными",
                "безопасн", "безопасный", "безопасная", "безопасность",
                "интернет", "интернета", "интернету",
                "сеть", "сети", "сетей",
                "защит", "защита", "защиты", "защиту",
                "ссылка", "ссылки", "ссылку", "ссылкой",
                "аккаунт", "аккаунта", "аккаунту", "аккаунтом",
                "антивирус", "антивируса",
                "совет", "совета", "совету", "советы",
                "правил", "правило", "правила",
                "мошенник", "мошенника", "мошенники",
                "обман", "обмана", "обмануть",
                "конфиденци", "конфиденциальный",
                "сложн", "сложный", "сложная",
                "надежн", "надежный", "надежная",
                "уникальн", "уникальный",
                "символ", "символы", "цифр", "букв",
                "запоминать", "запомнить", "хранить",
            ],
            "response": "🛡️ 3 главных совета по безопасности в интернете:\n\n1️⃣ 🔐 **Создавай сложные пароли** — используй буквы, цифры и специальные символы. Не используй один и тот же пароль на всех сайтах!\n\n2️⃣ 🎣 **Не попадайся на фишинг** — не переходи по подозрительным ссылкам и не вводи личные данные на незнакомых сайтах. Всегда проверяй адрес сайта!\n\n3️⃣ 🤫 **Защищай личные данные** — не публикуй свой адрес, номер телефона и пароли в интернете. Помни: то, что ты выложил в сеть, может остаться там навсегда!"
        }
    }
    
    # 🔧 Определяем тип задания
    task_type = None
    matched_keywords = []
    
    for key, context in keyword_contexts.items():
        for word in context["keywords"]:
            if word in prompt_lower:
                if not task_type:
                    task_type = key
                if task_type == key:
                    matched_keywords.append(word)
    
    if task_type:
        context = keyword_contexts[task_type]
        keywords = context["keywords"]
        response_text = context["response"]
        
        # 🔧 НОВАЯ ЛОГИКА:
        # 1. Считаем уникальные совпавшие слова
        matched_unique = list(set(matched_keywords))
        total_prompt_words = len(prompt_words)  # Количество слов в промпте
        total_keywords = len(set(keywords))  # Всего ключевых слов
        
        # 2. Процент совпадений от слов в промпте (качество промпта)
        # Сколько слов в промпте являются ключевыми
        matched_prompt_words = [w for w in prompt_words if any(k in w or w in k for k in keywords)]
        match_from_prompt = len(matched_prompt_words)
        
        # Процент релевантных слов в промпте (точность)
        relevance_percent = int((match_from_prompt / total_prompt_words) * 100) if total_prompt_words > 0 else 0
        
        # Процент покрытия ключевых слов (полнота)
        coverage_percent = int((len(matched_unique) / total_keywords) * 100) if total_keywords > 0 else 0
        
        # Итоговый балл = среднее между точностью и полнотой
        # Но если промпт слишком короткий (< 3 слов) — штраф
        if total_prompt_words < 3:
            final_percent = min(20, relevance_percent)
        else:
            # 60% точность + 40% полнота
            final_percent = int(relevance_percent * 0.6 + coverage_percent * 0.4)
        
        # Ограничиваем 100%
        final_percent = min(final_percent, 100)
        
        print(f"[AI] Всего слов в промпте: {total_prompt_words}")
        print(f"[AI] Релевантных слов: {match_from_prompt} (точность: {relevance_percent}%)")
        print(f"[AI] Уникальных совпадений: {len(matched_unique)}/{total_keywords} (полнота: {coverage_percent}%)")
        print(f"[AI] Итоговый балл: {final_percent}%")
        
        return response_text, True, None, final_percent, matched_unique
    
    # Ответ по умолчанию
    default_response = (
        f"🤖 Спасибо за твой промпт!\n\n"
        f"💡 Для лучшего результата попробуй быть более конкретным.\n"
        f"Примеры хороших промптов:\n"
        f"- «Напиши сказку про дракона и котёнка»\n"
        f"- «Дай 3 совета по безопасности в интернете»"
    )
    
    return default_response, True, None, 0, []
