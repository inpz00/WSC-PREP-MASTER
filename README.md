# WSC Prep Master: Challenge

A web-based **Scholar's Challenge** practice app for the World Scholar's Cup, themed **"Are We There Yet?" (2026)**.

## Tech Stack

- **React** (Vite)
- **Tailwind CSS**

## Features

1. **Setup Screen**
   - **Time/Volume:** Mode A (40 Q / 20 min) or Mode B (20 Q / 10 min)
   - **Focus:** By Subject (1 subject + difficulty 1–5), By Difficulty (1 level, all subjects), or Full Mock (all subjects & levels)

2. **Quiz Interface**
   - 4-choice (A–D) with **multiple answers allowed** per question
   - **WSC scoring:** 1 correct = 1 pt, 2 = 0.5, 3 = 0.33, 4 = 0.25; wrong = 0
   - Timer, pause, and question navigator

3. **Review & Feedback**
   - Total score and percentage
   - Review each question with correct answer, explanation, and "Study More" link
   - **Progress:** result history in localStorage and a simple bar chart

4. **Sample Data**
   - 5 placeholder questions (Science, History, Social Studies, Art, Literature) based on the 2026 theme

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## 웹 배포 (GitHub Pages)

이 저장소를 GitHub에 올리면 **GitHub Pages**로 자동 배포됩니다.

### 1. GitHub에 저장소 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git push -u origin main
```

### 2. GitHub Pages 설정

1. 저장소 페이지 → **Settings** → **Pages**
2. **Source**에서 **GitHub Actions** 선택
3. `main` 브랜치에 푸시하면 자동으로 빌드·배포

### 3. 접속 URL

배포 완료 후:

```
https://<사용자명>.github.io/<저장소명>/
```

예: `https://yourname.github.io/wsc-prep-master/`

> ⚠️ 첫 배포는 푸시 후 1~2분 정도 걸릴 수 있습니다. **Actions** 탭에서 진행 상황을 확인하세요.

## Subjects

Science, History, Social Studies, Art, Literature, Special Area.
