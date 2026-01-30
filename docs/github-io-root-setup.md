# inpz00.github.io 루트 페이지 설정

AdSense가 `https://inpz00.github.io` 소유 확인을 위해 루트 주소에 접속합니다.
루트에 페이지가 없으면 404가 나오므로, **별도 저장소**를 만들어 루트를 채웁니다.

---

## 1단계: 새 저장소 생성

1. GitHub에서 **New repository**
2. **Repository name**: `inpz00.github.io` (본인 사용자명.github.io)
3. Public, **Add a README file** 선택 후 생성

---

## 2단계: index.html 추가

저장소에 `index.html` 파일을 만듭니다.

### 방법 A: GitHub에서 직접 생성

1. 저장소 페이지에서 **Add file** → **Create new file**
2. 파일명: `index.html`
3. 아래 내용 붙여넣기:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WSC Prep Master</title>
  <!-- AdSense 소유 확인 시 여기에 메타태그 추가 -->
  <!-- <meta name="google-site-verification" content="여기에_발급된_코드" /> -->
  <meta http-equiv="refresh" content="0; url=https://inpz00.github.io/wsc-prep-master/">
</head>
<body>
  <p>이동 중… <a href="https://inpz00.github.io/wsc-prep-master/">WSC Prep Master로 이동</a></p>
</body>
</html>
```

4. **Commit changes** 클릭

---

### 방법 B: 소유 확인용 메타태그가 필요한 경우

AdSense가 메타태그를 요구할 때는, `index.html`을 아래처럼 수정합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WSC Prep Master</title>
  <!-- AdSense에서 준 메타태그를 그대로 아래에 붙여넣기 -->
  <meta name="google-site-verification" content="여기에_AdSense_발급_코드" />
</head>
<body>
  <h1>WSC Prep Master</h1>
  <p><a href="https://inpz00.github.io/wsc-prep-master/">퀴즈 앱으로 이동 →</a></p>
</body>
</html>
```

- 소유 확인이 끝난 뒤, 필요하면 다시 `meta http-equiv="refresh"`로 자동 이동을 추가해도 됩니다.

---

## 3단계: GitHub Pages 설정

1. 저장소 **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: main, /(root)
4. **Save**

---

## 4단계: 확인

1~2분 후 `https://inpz00.github.io` 접속
- 정상이면 `index.html` 내용이 보이거나 `/wsc-prep-master/`로 이동합니다.
- 이제 AdSense에서 `https://inpz00.github.io`로 소유 확인을 진행할 수 있습니다.
