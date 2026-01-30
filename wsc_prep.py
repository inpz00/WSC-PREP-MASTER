"""
WSC Prep Master: Challenge — Python 버전
Scholar's Challenge 연습 앱 (WSC 2026 테마: "Are We There Yet?")

실행: streamlit run wsc_prep.py
필요: pip install streamlit
"""

import json
import random
import os
from pathlib import Path

import streamlit as st

# =============================================================================
# 상수
# =============================================================================
SUBJECTS = [
    "Science & Technology",
    "History",
    "Social Studies",
    "Art & Music",
    "Literature & Media",
    "Special Area",
]
DIFFICULTIES = [1, 2, 3, 4, 5]
DIVISIONS = [
    {"id": "Skittles", "label": "Skittles", "ages": "Ages 8–11", "description": "Simpler words"},
    {"id": "Junior", "label": "Junior", "ages": "Ages 12–14", "description": "Standard difficulty"},
    {"id": "Senior", "label": "Senior", "ages": "Ages 15+", "description": "Advanced vocabulary"},
]
MODES = [
    {"id": "A", "label": "Mode A", "questions": 40, "minutes": 20},
    {"id": "B", "label": "Mode B", "questions": 20, "minutes": 10},
]
AVAILABLE_DIVISION = "Skittles"
HISTORY_FILE = "wsc_prep_history.json"
QUESTIONS_PATH = Path(__file__).parent / "public" / "questions.json"

# =============================================================================
# 데이터 로드 및 필터링
# =============================================================================
def load_questions():
    """questions.json 로드 및 정규화"""
    if not QUESTIONS_PATH.exists():
        return []
    with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)
    out = []
    for r in raw:
        out.append({
            "id": r.get("id"),
            "subject": r.get("subject"),
            "division": r.get("division"),
            "difficulty": r.get("difficulty"),
            "question": r.get("question"),
            "options": r.get("options") or {},
            "correctAnswer": r.get("correct_answer") or r.get("correctAnswer"),
            "explanation": r.get("explanation"),
            "studyMoreUrl": r.get("resource_link") or r.get("studyMoreUrl"),
        })
    return out


def filter_questions(questions, *, by_division=None, by_subject=None, by_difficulty=None, full_mock=False):
    """문제 필터링"""
    result = questions
    if by_division is not None:
        result = [q for q in result if q["division"] == by_division]
    if full_mock:
        return result
    if by_subject is not None:
        result = [q for q in result if q["subject"] == by_subject]
    if by_difficulty is not None and by_difficulty != "all":
        result = [q for q in result if q["difficulty"] == by_difficulty]
    return result


def shuffle_array(arr):
    """Fisher-Yates 셔플"""
    a = arr.copy()
    for i in range(len(a) - 1, 0, -1):
        j = random.randint(0, i)
        a[i], a[j] = a[j], a[i]
    return a


def get_quiz_set(questions, count):
    """랜덤 문제 세트 (중복 없음)"""
    if not questions:
        return []
    shuffled = shuffle_array(questions)
    return shuffled[: min(count, len(shuffled))]


def get_quiz_set_balanced(questions, count):
    """난이도 균형 문제 세트"""
    if not questions:
        return []
    by_diff = {d: [q for q in questions if q["difficulty"] == d] for d in DIFFICULTIES}
    per_level = (count + 4) // 5
    selected = []
    selected_ids = set()
    for d in DIFFICULTIES:
        shuffled = shuffle_array(by_diff[d])
        for q in shuffled[:per_level]:
            selected.append(q)
            selected_ids.add(q["id"])
    result = shuffle_array(selected)
    if len(result) >= count:
        return result[:count]
    rest = [q for q in questions if q["id"] not in selected_ids]
    more = shuffle_array(rest)[: count - len(result)]
    return shuffle_array(result + more)


def score_answer(selected_keys, correct_key):
    """WSC Multiple Mark 채점"""
    if not selected_keys:
        return 0
    if correct_key not in selected_keys:
        return 0
    n = len(selected_keys)
    if n == 1:
        return 1.0
    if n == 2:
        return 0.5
    if n == 3:
        return round(1 / 3, 2)
    if n == 4:
        return 0.25
    return 0


# =============================================================================
# 저장소 (결과 히스토리)
# =============================================================================
def get_history_path():
    return Path(__file__).parent / HISTORY_FILE


def get_result_history():
    p = get_history_path()
    if not p.exists():
        return []
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_result(result):
    from datetime import datetime
    history = get_result_history()
    history.insert(0, {**result, "date": datetime.now().isoformat()})
    history = history[:50]
    with open(get_history_path(), "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


# =============================================================================
# Streamlit 앱
# =============================================================================
def main():
    st.set_page_config(
        page_title="WSC Prep Master",
        page_icon="📚",
        layout="centered",
        initial_sidebar_state="collapsed",
    )
    st.markdown("""
    <style>
    .stApp { background-color: #f1f5f9; }
    h1, h2, h3 { color: #1e293b; }
    </style>
    """, unsafe_allow_html=True)

    if "questions" not in st.session_state:
        st.session_state.questions = load_questions()
    if "screen" not in st.session_state:
        st.session_state.screen = "setup"
    if "quiz_state" not in st.session_state:
        st.session_state.quiz_state = None
    if "config" not in st.session_state:
        st.session_state.config = None

    questions = st.session_state.questions
    if not questions:
        st.error("questions.json을 찾을 수 없습니다. public/questions.json 경로를 확인하세요.")
        st.stop()

    # ─── 헤더 ───
    st.markdown("""
    <div style="background: #6d28d9; color: white; padding: 1rem 1.5rem; border-radius: 8px; 
                margin-bottom: 1.5rem; border-bottom: 4px solid #f59e0b;">
        <h1 style="margin:0; color:white;">WSC Prep Master: Challenge</h1>
        <span style="color: #fcd34d; font-size: 0.9rem;">Are We There Yet? (2026)</span>
    </div>
    """, unsafe_allow_html=True)

    # ─── 화면 라우팅 ───
    if st.session_state.screen == "setup":
        render_setup(questions)
    elif st.session_state.screen == "quiz":
        render_quiz()
    else:
        render_review()


def render_setup(questions):
    st.header("Scholar's Challenge — Setup")
    st.caption(f"— {len(questions)} questions loaded")
    st.markdown("Choose division, time/volume, and focus. Multiple answers per question; partial credit applies.")

    with st.form("setup_form"):
        # Division
        st.subheader("Division")
        div_ids = [d["id"] for d in DIVISIONS]
        division_idx = div_ids.index(AVAILABLE_DIVISION) if AVAILABLE_DIVISION in div_ids else 0
        division = st.radio("Division", div_ids, index=division_idx, horizontal=True,
                           format_func=lambda x: f"{x} (준비 중)" if x != AVAILABLE_DIVISION else x)
        if division != AVAILABLE_DIVISION:
            st.warning("Junior / Senior는 준비 중입니다. Skittles를 선택해 주세요.")
            division = AVAILABLE_DIVISION

        # Mode
        st.subheader("1. Time / Volume")
        mode_options = {m["label"]: m for m in MODES}
        mode_label = st.radio("Mode", list(mode_options.keys()), horizontal=True)
        mode = mode_options[mode_label]

        # Focus
        st.subheader("2. Focus")
        focus = st.radio(
            "Focus",
            ["By Subject", "By Difficulty", "Full Mock Exam"],
            format_func=lambda x: {
                "By Subject": "By Subject — 1 subject + difficulty (or All)",
                "By Difficulty": "By Difficulty — 1 level, all subjects",
                "Full Mock Exam": "Full Mock Exam — All subjects & levels",
            }[x],
        )
        subject, difficulty = None, None
        if focus == "By Subject":
            subject = st.selectbox("Subject", SUBJECTS)
            difficulty = st.selectbox("Difficulty", ["all"] + DIFFICULTIES, format_func=lambda x: "All (mixed)" if x == "all" else f"Level {x}")
        elif focus == "By Difficulty":
            difficulty = st.selectbox("Difficulty", DIFFICULTIES, format_func=lambda x: f"Level {x}")

        submitted = st.form_submit_button("Start Quiz")

    if submitted:
        filtered = filter_questions(questions, by_division=division)
        if not filtered:
            filtered = questions

        focus_map = {"By Subject": "bySubject", "By Difficulty": "byDifficulty", "Full Mock Exam": "fullMock"}
        ft = focus_map[focus]

        if ft == "bySubject":
            filtered = filter_questions(filtered, by_subject=subject, by_difficulty=difficulty if difficulty != "all" else None)
        elif ft == "byDifficulty":
            filtered = filter_questions(filtered, by_difficulty=difficulty)
        if not filtered:
            filtered = filter_questions(questions, by_division=division)

        q_set = (
            get_quiz_set_balanced(filtered, mode["questions"])
            if ft == "bySubject" and difficulty == "all"
            else get_quiz_set(filtered, mode["questions"])
        )

        st.session_state.config = {
            "timeLimitMinutes": mode["minutes"],
            "questionCount": len(q_set),
            "divisionId": division,
        }
        st.session_state.quiz_state = {
            "questions": q_set,
            "answers": {},
            "startTime": __import__("time").time(),
            "currentIndex": 0,
        }
        st.session_state.screen = "quiz"
        st.rerun()


def render_quiz():
    qs = st.session_state.quiz_state
    cfg = st.session_state.config
    if not qs or not cfg:
        st.session_state.screen = "setup"
        st.rerun()

    questions = qs["questions"]
    answers = qs.get("answers") or {}
    current_idx = qs.get("currentIndex", 0)
    start_time = qs["startTime"]

    import time
    elapsed = int(time.time() - start_time)
    limit_sec = cfg["timeLimitMinutes"] * 60
    time_left = max(0, limit_sec - elapsed)

    if time_left <= 0:
        st.session_state.quiz_state["answers"] = answers
        st.session_state.quiz_state["endTime"] = time.time() * 1000
        st.session_state.quiz_state["startTime"] = qs["startTime"] * 1000
        st.session_state.screen = "review"
        st.rerun()

    question = questions[current_idx] if current_idx < len(questions) else None
    if not question:
        st.session_state.screen = "setup"
        st.rerun()

    # 상단: 문제 번호, 타이머, Exit
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        st.caption(f"Question {current_idx + 1} of {len(questions)} | {question['subject']} · L{question['difficulty']}")
    with col2:
        m, s = divmod(time_left, 60)
        st.metric("Time", f"{m}:{s:02d}")
    with col3:
        if st.button("Exit"):
            st.session_state.screen = "setup"
            st.session_state.quiz_state = None
            st.session_state.config = None
            st.rerun()

    # 문제
    st.markdown(f"**{question['question']}**")
    st.caption("Select one or more (partial: 1=1pt, 2=0.5, 3=0.33, 4=0.25)")

    options = question.get("options") or {}
    choice_keys = [k for k in ["A", "B", "C", "D"] if k in options]
    key = f"q{current_idx}"
    current_sel = answers.get(key, [])

    new_sel = st.multiselect("Your answers", choice_keys, default=current_sel,
                             format_func=lambda k: f"{k}. {options.get(k, '')}")

    if new_sel != current_sel:
        answers = dict(answers)
        answers[key] = sorted(new_sel)
        st.session_state.quiz_state["answers"] = answers

    # 네비게이션
    col1, col2, col3 = st.columns([1, 2, 1])
    with col1:
        if st.button("◀ Previous") and current_idx > 0:
            st.session_state.quiz_state["currentIndex"] = current_idx - 1
            st.rerun()
    with col3:
        if st.button("Next ▶") if current_idx < len(questions) - 1 else st.button("Finish"):
            if current_idx < len(questions) - 1:
                st.session_state.quiz_state["currentIndex"] = current_idx + 1
            else:
                st.session_state.quiz_state["answers"] = answers
                st.session_state.quiz_state["endTime"] = time.time() * 1000
                st.session_state.quiz_state["startTime"] = qs["startTime"] * 1000
                st.session_state.screen = "review"
            st.rerun()

    # 문제 번호 네비게이션
    st.caption("Jump to question:")
    cols = st.columns(min(20, len(questions)))
    for i, c in enumerate(cols):
        if i < len(questions):
            with c:
                if st.button(str(i + 1), key=f"nav_{i}"):
                    st.session_state.quiz_state["currentIndex"] = i
                    st.rerun()


def render_review():
    qs = st.session_state.quiz_state
    if not qs:
        st.session_state.screen = "setup"
        st.rerun()

    questions = qs["questions"]
    answers = qs.get("answers") or {}
    start_ms = qs.get("startTime", 0)
    end_ms = qs.get("endTime", 0)
    time_spent = int((end_ms - start_ms) / 1000) if end_ms else 0

    results = []
    for i, q in enumerate(questions):
        key = f"q{i}"
        sel = answers.get(key, [])
        pts = score_answer(sel, q["correctAnswer"])
        results.append({
            "question": q,
            "index": i,
            "selected": sel,
            "points": pts,
            "correctKey": q["correctAnswer"],
        })

    total_pts = sum(r["points"] for r in results)
    max_pts = len(questions)
    pct = round((total_pts / max_pts) * 100) if max_pts else 0

    save_result({
        "totalPoints": total_pts,
        "maxPoints": max_pts,
        "pct": pct,
        "questionCount": len(questions),
        "timeSpentSec": time_spent,
    })

    st.header("Quiz Complete")
    st.caption(f"Time: {time_spent // 60}m {time_spent % 60}s")
    st.metric("Score", f"{total_pts:.2f} / {max_pts} ({pct}%)")

    if st.button("New Quiz"):
        st.session_state.screen = "setup"
        st.session_state.quiz_state = None
        st.session_state.config = None
        st.rerun()

    st.subheader("Review — Questions & Answers")
    for r in results:
        q = r["question"]
        with st.expander(f"Q{r['index']+1}: {q['question'][:60]}... — {r['points']:.2f} pts"):
            st.markdown(f"**Your selection:** {', '.join(r['selected']) if r['selected'] else '—'}")
            st.markdown(f"**Correct:** {r['correctKey']}")
            st.markdown(q.get("explanation", ""))
            if q.get("studyMoreUrl"):
                st.markdown(f"[Study more →]({q['studyMoreUrl']})")

    st.markdown("---")
    st.caption("Scholar's Challenge practice — WSC theme 2026")


if __name__ == "__main__":
    main()
