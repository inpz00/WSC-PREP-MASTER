/**
 * 퀴즈 완료 후 정답 화면 전 표시되는 광고 (Google AdSense)
 * src/config/ads.js에서 ID 설정
 */

import { useState, useEffect } from 'react';
import { AD_CLIENT, AD_SLOT_INTERSTITIAL, AD_ENABLED } from '../config/ads';
import { loadAdSenseScript, pushAdSlot } from '../lib/loadAdSense';

const WATCH_SECONDS = 5;

const isValidSlot = (slot) => slot && !slot.includes('X');

export default function AdInterstitial({ onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(WATCH_SECONDS);
  const [canContinue, setCanContinue] = useState(false);

  const hasRealAd = AD_ENABLED && isValidSlot(AD_CLIENT) && isValidSlot(AD_SLOT_INTERSTITIAL);

  useEffect(() => {
    if (!AD_ENABLED) {
      onComplete();
      return;
    }
    const t = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setCanContinue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onComplete]);

  useEffect(() => {
    if (!hasRealAd) return;
    loadAdSenseScript(AD_CLIENT).then(() => pushAdSlot());
  }, [hasRealAd]);

  if (!AD_ENABLED) return null;

  if (hasRealAd) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-slate-600 font-medium mb-4">광고를 시청해 주세요</p>
          <div className="min-h-[280px] flex items-center justify-center mb-4">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={AD_CLIENT}
              data-ad-slot={AD_SLOT_INTERSTITIAL}
              data-ad-format="rectangle"
              data-full-width-responsive="true"
            />
          </div>
          <p className="text-4xl font-bold text-violet-600 mb-2">
            {secondsLeft > 0 ? secondsLeft : '✓'}
          </p>
          <p className="text-sm text-slate-500 mb-4">
            {canContinue ? '결과를 확인할 수 있습니다.' : '잠시만 기다려 주세요.'}
          </p>
          <button
            onClick={onComplete}
            disabled={!canContinue}
            className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {canContinue ? '결과 보기' : `${secondsLeft}초 후 가능`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-slate-600 font-medium mb-4">광고를 시청해 주세요</p>
        <p className="text-4xl font-bold text-violet-600 mb-6">
          {secondsLeft > 0 ? secondsLeft : '✓'}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          {canContinue ? '결과를 확인할 수 있습니다.' : '잠시만 기다려 주세요.'}
        </p>
        <button
          onClick={onComplete}
          disabled={!canContinue}
          className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {canContinue ? '결과 보기' : `${secondsLeft}초 후 가능`}
        </button>
      </div>
    </div>
  );
}
