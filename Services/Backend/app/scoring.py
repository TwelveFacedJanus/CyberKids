from typing import Any

from app import constants


def _pick(answers: list[dict], key: Any, default: Any = None) -> Any:
    for a in answers:
        if a.get("key") == key or a.get("index") == key:
            return a.get("value", default)
    return default


def score_dragdrop(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    items = content.get("items", [])
    total = len(items)
    correct = 0
    details: list[dict] = []
    for i, item in enumerate(items):
        chosen = _pick(answers, item.get("id") or str(i))
        ok = chosen == item.get("section")
        if ok:
            correct += 1
        details.append(
            {
                "item_id": item.get("id") or str(i),
                "item_text": item.get("text"),
                "expected": item.get("section"),
                "chosen": chosen,
                "correct": ok,
            }
        )
    return correct, total, details


def score_sort(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    items = content.get("items", [])
    total = len(items)
    correct = 0
    details: list[dict] = []
    for i, item in enumerate(items):
        chosen = _pick(answers, item.get("id") or str(i))
        ok = chosen == item.get("section")
        if ok:
            correct += 1
        details.append(
            {
                "item_id": item.get("id") or str(i),
                "item_text": item.get("text"),
                "expected": item.get("section"),
                "chosen": chosen,
                "correct": ok,
            }
        )
    return correct, total, details


def score_quiz(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    questions = content.get("questions", [])
    total = len(questions)
    correct = 0
    details: list[dict] = []
    for i, q in enumerate(questions):
        chosen = _pick(answers, q.get("id") or str(i))
        ok = chosen == q.get("correct")
        if ok:
            correct += 1
        details.append(
            {
                "question_id": q.get("id") or str(i),
                "question": q.get("question"),
                "expected": q.get("correct"),
                "chosen": chosen,
                "correct": ok,
            }
        )
    return correct, total, details


def score_true_false(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    statements = content.get("statements", [])
    total = len(statements)
    correct = 0
    details: list[dict] = []
    for i, s in enumerate(statements):
        chosen = _pick(answers, s.get("id") or str(i))
        ok = chosen == s.get("is_true")
        if ok:
            correct += 1
        details.append(
            {
                "statement_id": s.get("id") or str(i),
                "statement": s.get("statement"),
                "expected": s.get("is_true"),
                "chosen": chosen,
                "correct": ok,
            }
        )
    return correct, total, details


def score_scenario(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    scenarios = content.get("scenarios", [])
    total = len(scenarios)
    correct = 0
    details: list[dict] = []
    for i, sc in enumerate(scenarios):
        chosen = _pick(answers, sc.get("id") or str(i))
        ok = chosen == sc.get("correct")
        if ok:
            correct += 1
        details.append(
            {
                "scenario_id": sc.get("id") or str(i),
                "title": sc.get("title"),
                "expected": sc.get("correct"),
                "chosen": chosen,
                "correct": ok,
            }
        )
    return correct, total, details

def score_code(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    # Проверяем, что код запустился успешно
    code_result = next((a.get('value') for a in answers if a.get('key') == 'code_result'), False)
    correct = 1 if code_result else 0
    total = 1
    details = [{
        "expected": True,
        "chosen": code_result,
        "correct": correct == 1,
    }]
    return correct, total, details

def score_ai_prompt(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """
    Оценивает AI-промпт на основе совпадений с ключевыми словами
    """
    # 🔧 Отладка
    print(f"[SCORING] Получены answers: {answers}")
    
    # Получаем процент совпадений из ответа
    match_percentage = 0
    matched_words = []
    
    for a in answers:
        key = a.get('key')
        value = a.get('value')
        print(f"[SCORING] a: key={key}, value={value}, type={type(value)}")
        
        if key == 'ai_match_percentage':
            if isinstance(value, (int, float)):
                match_percentage = int(value)
            elif isinstance(value, str):
                try:
                    match_percentage = int(value)
                except:
                    match_percentage = 0
            print(f"[SCORING] match_percentage = {match_percentage}")
            
        if key == 'ai_matched_words':
            if isinstance(value, list):
                matched_words = value
            elif isinstance(value, str):
                try:
                    import ast
                    matched_words = ast.literal_eval(value) if value else []
                except:
                    matched_words = [value] if value else []
            print(f"[SCORING] matched_words = {matched_words}")
    
    # 🔧 ПОРОГИ ДЛЯ ЗВЁЗД (более щадящие)
    # 0-20% → 0 звёзд, 21-40% → 1 звезда, 41-70% → 2 звезды, 71-100% → 3 звезды
    if match_percentage >= 71:
        correct = 3
        stars_text = "⭐⭐⭐"
    elif match_percentage >= 41:
        correct = 2
        stars_text = "⭐⭐"
    elif match_percentage >= 21:
        correct = 1
        stars_text = "⭐"
    else:
        correct = 0
        stars_text = "☆"
    
    print(f"[SCORING] Итог: match_percentage={match_percentage}, correct={correct}")
    
    total = 3
    
    details = [{
        "match_percentage": match_percentage,
        "matched_words": matched_words[:5] if matched_words else [],
        "correct": correct,
        "expected": f"Найдено ключевых слов: {match_percentage}%",
        "chosen": f"{stars_text} {match_percentage}% — найдено: {', '.join(matched_words[:3]) if matched_words else 'нет совпадений'}"
    }]
    
    return correct, total, details

def score_debug(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    # Аналогично code
    code_result = next((a.get('value') for a in answers if a.get('key') == 'debug_result'), False)
    correct = 1 if code_result else 0
    total = 1
    details = [{
        "expected": True,
        "chosen": code_result,
        "correct": correct == 1,
    }]
    return correct, total, details

def score_algorithm(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    # Проверяем правильный порядок блоков
    items = content.get('items', [])
    total = len(items)
    correct = 0
    details = []
    
    for i, item in enumerate(items):
        chosen = next((a.get('value') for a in answers if a.get('key') == item.get('id')), None)
        ok = chosen == i  # Правильный порядок — индекс соответствует позиции
        if ok:
            correct += 1
        details.append({
            "item_id": item.get('id'),
            "item_text": item.get('text'),
            "expected": i,
            "chosen": chosen,
            "correct": ok,
        })
    
    return correct, total, details

def score_phishing_site(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """
    Оценка задания-симуляции фишингового сайта.
    - Если ребёнок ввёл данные → 0 очков, деталь: caught=True
    - Если НЕ ввёл (закрыл / не стал) → 1 очко (молодец)
    """
    entered = next(
        (a.get("value") for a in answers if a.get("key") == "entered_data"),
        False,
    )
    correct = 0 if entered else 1
    total = 1
    details = [{
        "expected": "Не вводить данные на подозрительном сайте",
        "chosen": "Ввёл логин и пароль" if entered else "Не стал вводить",
        "correct": correct == 1,
        "caught": bool(entered),
    }]
    return correct, total, details

def score_task(task_type: str, content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    answers = [a for a in answers if isinstance(a, dict)]
    if task_type == constants.TASK_DRAGDROP:
        return score_dragdrop(content, answers)
    if task_type == constants.TASK_DRAG3D:
        return score_dragdrop(content, answers)
    if task_type == constants.TASK_SORT:
        return score_sort(content, answers)
    if task_type == constants.TASK_QUIZ:
        return score_quiz(content, answers)
    if task_type == constants.TASK_TRUE_FALSE:
        return score_true_false(content, answers)
    if task_type == constants.TASK_SCENARIO:
        return score_scenario(content, answers)
    if task_type == constants.TASK_CODE:
        return score_code(content, answers)
    if task_type == constants.TASK_AI_PROMPT:
        return score_ai_prompt(content, answers)
    if task_type == constants.TASK_DEBUG:
        return score_debug(content, answers)
    if task_type == constants.TASK_ALGORITHM:
        return score_algorithm(content, answers)
    if task_type == constants.TASK_PHISHING_SITE:
        return score_phishing_site(content, answers)
    return 0, 0, []

