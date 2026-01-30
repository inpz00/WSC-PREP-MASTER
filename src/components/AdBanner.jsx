/**
 * 좌우 사이드 광고 배너 (Google AdSense)
 * src/config/ads.js에서 ID 설정
 */

import { useEffect, useRef } from 'react';
import { AD_CLIENT, AD_SLOT_LEFT, AD_SLOT_RIGHT, AD_ENABLED } from '../config/ads';
import { loadAdSenseScript, pushAdSlot } from '../lib/loadAdSense';

const BANNER_WIDTH = 160;
const BANNER_HEIGHT = 600;

const isValidSlot = (slot) => slot && !slot.includes('X');

export default function AdBanner({ position = 'left' }) {

  const slotId = position === 'left' ? AD_SLOT_LEFT : AD_SLOT_RIGHT;

  useEffect(() => {
    if (!AD_ENABLED || !isValidSlot(slotId) || !isValidSlot(AD_CLIENT)) return;

    loadAdSenseScript(AD_CLIENT).then(() => pushAdSlot());
  }, [slotId]);

  if (!AD_ENABLED) return null;

  if (!isValidSlot(slotId)) {
    return (
      <aside
        className={`hidden lg:flex flex-col items-center justify-start pt-6 shrink-0 sticky top-4 ${
          position === 'left' ? 'pl-2' : 'pr-2'
        }`}
        style={{ width: BANNER_WIDTH }}
      >
        <div
          className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-2"
          style={{ minHeight: BANNER_HEIGHT }}
        >
          <span className="font-medium text-slate-500">Ad Space</span>
          <span>{BANNER_WIDTH}×{BANNER_HEIGHT}</span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`hidden lg:flex flex-col items-center justify-start pt-6 shrink-0 sticky top-4 ${
        position === 'left' ? 'pl-2' : 'pr-2'
      }`}
      style={{ width: BANNER_WIDTH }}
    >
      <div className="w-full">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: BANNER_HEIGHT }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slotId}
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
      </div>
    </aside>
  );
}
