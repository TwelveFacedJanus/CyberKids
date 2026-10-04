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

def score_scam_banner(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """scam_banner — симуляция. Оцениваем сам факт прохождения."""
    entered = next(
        (a.get("value") for a in answers if a.get("key") == "scam_data"),
        None,
    )
    details = [{
        "expected": "Понять, что это была симуляция",
        "chosen": "Данные введены" if entered else "Данные не введены",
        "correct": True,
    }]
    return 1, 1, details


def score_scam_chat(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """scam_chat: сколько мошенников найдено среди показанных."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "scam_chat_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Найти всех мошенников",
            "chosen": "не выбрано",
            "correct": False,
        }]

    # content в БД имеет pool. shownIds — что видел фронт.
    pool = content.get("pool") or content.get("messages") or []
    shown_ids = set(result.get("shownIds") or [])
    selected = set(result.get("selectedIds") or [])

    shown = [m for m in pool if m.get("id") in shown_ids]
    total_scam = len([m for m in shown if m.get("isScam")])

    caught = len([m for m in shown if m.get("isScam") and m.get("id") in selected])
    wrong = len([m for m in shown if not m.get("isScam") and m.get("id") in selected])

    correct = max(0, caught - wrong)
    total = total_scam if total_scam > 0 else 1

    details = [{
        "expected": f"Найти всех мошенников среди показанных ({total_scam})",
        "chosen": f"Поймано: {caught}, ошибок: {wrong}",
        "correct": correct == total,
    }]
    return correct, total, details


def score_scam_chain(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """scam_chain: 3 фазы — порядок + момент кражи + действие."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "scam_chain_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Пройти расследование",
            "chosen": "не пройдено",
            "correct": False,
        }]

    total_correct = int(result.get("totalCorrect", 0))
    total_possible = int(result.get("totalPossible", 1))
    details = result.get("details") or []

    return total_correct, total_possible, details


def score_scam_phishing(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """scam_phishing: собери безопасное письмо."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "scam_phishing_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Собрать безопасное письмо",
            "chosen": "не пройдено",
            "correct": False,
        }]

    total_correct = int(result.get("totalCorrect", 0))
    total_possible = int(result.get("totalPossible", 1))
    details = result.get("details") or []
    return total_correct, total_possible, details


def score_scam_defender(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """scam_defender: ситуации + настройки безопасности."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "scam_defender_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Защитить аккаунт",
            "chosen": "не пройдено",
            "correct": False,
        }]

    total_correct = int(result.get("totalCorrect", 0))
    total_possible = int(result.get("totalPossible", 1))
    details = result.get("details") or []
    return total_correct, total_possible, details


def score_theory_cards(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """theory_cards: все ли карточки изучены."""
    import json

    progress_raw = next(
        (a.get("value") for a in answers if a.get("key") == "theory_progress"),
        "[]",
    )
    try:
        completed = (
            json.loads(progress_raw)
            if isinstance(progress_raw, str)
            else (progress_raw or [])
        )
    except Exception:
        completed = []

    cards = content.get("cards", [])
    total = len(cards) if cards else 1
    correct = len([c for c in cards if c["id"] in completed])

    details = [{
        "expected": f"Изучить все карточки ({total})",
        "chosen": f"Изучено: {correct}",
        "correct": correct == total,
    }]
    return correct, total, details


def score_quick_test(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """quick_test: считаем верные ответы."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "quick_test_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Пройти тест",
            "chosen": "не пройден",
            "correct": False,
        }]

    correct = int(result.get("correct", 0))
    total = int(result.get("total", 1))
    details = [{
        "expected": f"Верно: {total}",
        "chosen": f"Верно: {correct}",
        "correct": correct == total,
    }]
    return correct, total, details

def score_profile_builder(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """profile_builder: сколько шагов сборки профиля безопасно."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "profile_builder_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Пройти сборку профиля",
            "chosen": "не пройдено",
            "correct": False,
        }]

    total_correct = int(result.get("totalCorrect", 0))
    total_possible = int(result.get("totalPossible", 1))
    details = result.get("details") or []
    return total_correct, total_possible, details

def score_photo_detective(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """photo_detective: улики + инструменты + открытый ответ."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "photo_detective_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Пройти расследование",
            "chosen": "не пройдено",
            "correct": False,
        }]

    details: list[dict] = []

    # ─── 1. Улики на фото ───
    hotspots = content.get("hotspots", [])
    total_hotspots = len(hotspots)
    found_ids = set(result.get("foundHotspots") or [])
    found_correct = sum(1 for h in hotspots if h.get("id") in found_ids)

    for h in hotspots:
        details.append({
            "item_id": h.get("id"),
            "item_text": h.get("label"),
            "expected": "найти",
            "chosen": "найдено" if h.get("id") in found_ids else "пропущено",
            "correct": h.get("id") in found_ids,
        })

    # ─── 2. Инструменты ───
    tools = content.get("tools", [])
    total_tools = len(tools)
    used_ids = set(result.get("usedTools") or [])
    tools_correct = sum(1 for t in tools if t.get("id") in used_ids)

    for t in tools:
        details.append({
            "item_id": t.get("id"),
            "item_text": t.get("title"),
            "expected": "использовать",
            "chosen": "использован" if t.get("id") in used_ids else "не использован",
            "correct": t.get("id") in used_ids,
        })

    # ─── 3. Открытый ответ ───
    answer = (result.get("finalAnswer") or "").lower()
    keywords = ["геометк", "школ", "приватн", "скры", "не выкладыв", "адрес", "вывеск", "ник"]
    answer_correct = any(k in answer for k in keywords)

    details.append({
        "item_id": "final_answer",
        "item_text": "Открытый ответ",
        "expected": "развёрнутый ответ по теме",
        "chosen": (result.get("finalAnswer") or "")[:80],
        "correct": answer_correct,
    })

    total_correct = found_correct + tools_correct + (1 if answer_correct else 0)
    total_possible = total_hotspots + total_tools + 1

    return total_correct, total_possible, details

def score_fake_friend_chat(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """fake_friend_chat: красные флаги + развилки + финал."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "fake_friend_chat_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Пройти диалог",
            "chosen": "не пройдено",
            "correct": False,
        }]

    details: list[dict] = []

    # ─── 1. Красные флаги ───
    red_flags = content.get("redFlags", [])
    total_flags = len(red_flags)
    found_flags = set(result.get("foundFlags") or [])
    flags_correct = sum(1 for f in red_flags if f.get("id") in found_flags)

    for f in red_flags:
        details.append({
            "item_id": f.get("id"),
            "item_text": f.get("label"),
            "expected": "заметить",
            "chosen": "замечено" if f.get("id") in found_flags else "пропущено",
            "correct": f.get("id") in found_flags,
        })

    # ─── 2. Развилки ───
    choices = result.get("choices") or {}   # { choiceId: "good"|"neutral"|"bad" }
    correct_choices = 0
    total_choices = 0

    for choice in content.get("choices", []):
        total_choices += 1
        picked = choices.get(choice.get("id"))
        is_correct = picked == "good"
        if is_correct:
            correct_choices += 1
        details.append({
            "scenario_id": choice.get("id"),
            "title": choice.get("title"),
            "expected": "правильный вариант",
            "chosen": picked or "не выбрано",
            "correct": is_correct,
        })

    # ─── 3. Финал ───
    final_choice = result.get("finalChoice")   # "good" | "neutral" | "bad"
    final_correct = final_choice == "good"

    details.append({
        "scenario_id": "final",
        "title": "Финальное решение",
        "expected": "good",
        "chosen": final_choice or "не выбрано",
        "correct": final_correct,
    })

    total_correct = flags_correct + correct_choices + (1 if final_correct else 0)
    total_possible = total_flags + total_choices + 1

    return total_correct, total_possible, details

def score_hacked_friend(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """hacked_friend: флаги + развилки + финал."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "hacked_friend_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Разоблачить мошенника",
            "chosen": "не пройдено",
            "correct": False,
        }]

    details: list[dict] = []

    # Флаги
    red_flags = content.get("redFlags", [])
    total_flags = len(red_flags)
    found_flags = set(result.get("foundFlags") or [])
    flags_correct = sum(1 for f in red_flags if f.get("id") in found_flags)
    for f in red_flags:
        details.append({
            "item_id": f.get("id"),
            "item_text": f.get("label"),
            "expected": "заметить",
            "chosen": "замечено" if f.get("id") in found_flags else "пропущено",
            "correct": f.get("id") in found_flags,
        })

    # Развилки
    choices = result.get("choices") or {}
    correct_choices = 0
    total_choices = 0
    for choice in content.get("choices", []):
        total_choices += 1
        picked = choices.get(choice.get("id"))
        is_correct = picked == "good"
        if is_correct:
            correct_choices += 1
        details.append({
            "scenario_id": choice.get("id"),
            "title": choice.get("title"),
            "expected": "правильный вариант",
            "chosen": picked or "не выбрано",
            "correct": is_correct,
        })

    # Финал
    final_choice = result.get("finalChoice")
    final_correct = final_choice == "good"
    details.append({
        "scenario_id": "final",
        "title": "Финальное решение",
        "expected": "good",
        "chosen": final_choice or "не выбрано",
        "correct": final_correct,
    })

    total_correct = flags_correct + correct_choices + (1 if final_correct else 0)
    total_possible = total_flags + total_choices + 1

    return total_correct, total_possible, details

def score_safe_job_sort(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """safe_job_sort: 12 карточек на безопасность."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "safe_job_sort_result"),
        None,
    )
    if not result:
        return 0, 1, [{
            "expected": "Промодерировать карточки",
            "chosen": "не пройдено",
            "correct": False,
        }]

    decisions: dict[str, str] = result.get("decisions") or {}   # { cardId: "safe" | "danger" }
    cards = content.get("cards", [])
    total = len(cards)

    correct = 0
    details: list[dict] = []

    for c in cards:
        picked = decisions.get(c.get("id"))
        expected = c.get("safety")
        is_correct = picked == expected
        if is_correct:
            correct += 1

        details.append({
            "item_id": c.get("id"),
            "item_text": c.get("title"),
            "expected": expected,
            "chosen": picked or "не выбрано",
            "correct": is_correct,
        })

    return correct, total, details

def score_dropper_chat(content: dict, answers: list[dict]) -> tuple[int, int, list[dict]]:
    """dropper_chat: 5 пунктов — расследование, улики, решение, отказ под давлением, роль."""
    result = next(
        (a.get("value") for a in answers if a.get("key") == "dropper_chat_result"),
        None,
    )
    if not result:
        return 0, 5, [{
            "expected": "Пройти сценарий до конца",
            "chosen": "не пройдено",
            "correct": False,
        }]
 
    min_q = content.get("minQuestions", 3)
    min_flags = content.get("minFlags", 4)
    first_choice = result.get("firstChoice")
    pressure_first = result.get("pressureFirst")
    role_first = result.get("roleFirst")
 
    pressure_ok_id = next(
        (o["id"] for o in (content.get("pressure") or {}).get("options", []) if o.get("correct")),
        None,
    )
    role_ok_id = next(
        (o["id"] for o in content.get("roleOptions", []) if o.get("correct")),
        None,
    )
    asked = len(result.get("questionsAsked") or [])
    flags = len(result.get("flagsFound") or [])
 
    items = [
        ("Расспросить Артёма", f"минимум {min_q} вопроса", f"{asked} вопр.", asked >= min_q),
        ("Найти тревожные сообщения", f"минимум {min_flags}", f"{flags} найдено", flags >= min_flags),
        ("Решение при входящем переводе", "stop", first_choice or "не выбрано", first_choice == "stop"),
        ("Отказ под давлением (с первой попытки)", pressure_ok_id, pressure_first or "не выбрано", pressure_first == pressure_ok_id),
        ("Роль в схеме", role_ok_id, role_first or "не выбрано", role_first == role_ok_id),
    ]
    details = [
        {"item_id": f"d{i + 1}", "item_text": t, "expected": e, "chosen": c, "correct": ok}
        for i, (t, e, c, ok) in enumerate(items)
    ]
    return sum(1 for d in details if d["correct"]), len(details), details


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
    if task_type == constants.TASK_PHISHING_SITE:
        return score_phishing_site(content, answers)
    if task_type == constants.TASK_SCAM_BANNER:
        return score_scam_banner(content, answers)
    if task_type == constants.TASK_SCAM_CHAT:
        return score_scam_chat(content, answers)
    if task_type == constants.TASK_SCAM_CHAIN:
        return score_scam_chain(content, answers)
    if task_type == constants.TASK_SCAM_PHISHING:
        return score_scam_phishing(content, answers)
    if task_type == constants.TASK_SCAM_DEFENDER:
        return score_scam_defender(content, answers)
    if task_type == constants.TASK_THEORY_CARDS:
        return score_theory_cards(content, answers)
    if task_type == constants.TASK_QUICK_TEST:
        return score_quick_test(content, answers)
    if task_type == constants.TASK_PROFILE_BUILDER:
        return score_profile_builder(content, answers)
    if task_type == constants.TASK_PHOTO_DETECTIVE:
        return score_photo_detective(content, answers)
    if task_type == constants.TASK_FAKE_FRIEND_CHAT:
        return score_fake_friend_chat(content, answers)
    if task_type == constants.TASK_HACKED_FRIEND:
        return score_hacked_friend(content, answers)
    if task_type == constants.TASK_SAFE_JOB_SORT:
        return score_safe_job_sort(content, answers)
    if task_type == constants.TASK_DROPPER_CHAT:
        return score_dropper_chat(content, answers)
    return 0, 0, []

