# Google AdSense 설정 가이드

## 1단계: AdSense 가입

1. [Google AdSense](https://www.google.com/adsense) 접속
2. **시작하기** 클릭 후 Google 계정 로그인
3. **사이트 URL** 입력: `https://inpz00.github.io/wsc-prep-master/`
4. 제출 후 **승인 대기** (며칠~몇 주 소요될 수 있음)

---

## 2단계: 광고 단위 생성

승인 후 **광고** → **광고 단위 기준** 메뉴에서 생성합니다.

### 좌우 배너용 (2개)

| 항목 | 설정 |
|------|------|
| 광고 단위 유형 | 디스플레이 광고 |
| 광고 단위 이름 | 좌측 배너 (또는 Left Sidebar) |
| 광고 크기 | 반응형 또는 160×600 (스카이스크래퍼) |

같은 방식으로 **우측 배너** 1개 더 생성.

### 인터스티셜용 (1개)

| 항목 | 설정 |
|------|------|
| 광고 단위 유형 | 디스플레이 광고 |
| 광고 단위 이름 | 결과 화면 전 광고 |
| 광고 크기 | 336×280 (대형 직사각형) 또는 반응형 |

---

## 3단계: 발급된 ID 확인

광고 단위 생성 후 다음 두 가지가 필요합니다.

| 항목 | 위치 | 예시 |
|------|------|------|
| **게시자 ID** | AdSense 홈 → **계정** → **설정** → 게시자 ID | `ca-pub-1234567890123456` |
| **광고 슬롯 ID** | **광고** → **광고 단위 기준** → 해당 단위 클릭 → **코드 가져오기** → `data-ad-slot="..."` 값 | `1234567890` |

---

## 4단계: 프로젝트에 적용

### 1) `src/config/ads.js` 수정

```js
// 게시자 ID (ca-pub-로 시작)
export const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXX';

// 광고 슬롯 ID
export const AD_SLOT_LEFT = 'XXXXXXXXXX';   // 좌측 배너
export const AD_SLOT_RIGHT = 'XXXXXXXXXX';  // 우측 배너
export const AD_SLOT_INTERSTITIAL = 'XXXXXXXXXX';  // 결과 화면 전
```

### 2) `index.html` (선택)

스크립트는 React에서 자동 로드되므로 **별도 수정 없음**. `src/config/ads.js`만 맞추면 됩니다.

---

## 5단계: 동작 확인

1. `src/config/ads.js`에 실제 ID 입력 후 저장
2. `npm run dev` 실행
3. 광고가 표시되는지 확인
4. **승인 전**에는 빈 영역, **승인 후**에는 실제 광고 노출

---

## 주의사항

- **정책 위반 금지**: 저작권 침해, 성인 콘텐츠, 클릭 유도 등
- **트래픽**: 방문자가 있어야 광고가 노출되고 수익 발생
- **승인 대기 중**: `AD_ENABLED = false`로 두고 개발 가능
