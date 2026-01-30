/**
 * Google AdSense 설정
 * docs/ADSENSE_SETUP.md 참고하여 값 입력
 */

// 게시자 ID (ca-pub-로 시작, AdSense 계정에서 확인)
export const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXX';

// 광고 슬롯 ID (각 광고 단위 코드에서 data-ad-slot 값)
export const AD_SLOT_LEFT = 'XXXXXXXXXX';       // 좌측 사이드 배너
export const AD_SLOT_RIGHT = 'XXXXXXXXXX';      // 우측 사이드 배너
export const AD_SLOT_INTERSTITIAL = 'XXXXXXXXXX'; // 결과 화면 전 광고

// 광고 활성화 (false면 모든 광고 비표시) — 다시 켜려면 true로 변경
export const AD_ENABLED = false;
