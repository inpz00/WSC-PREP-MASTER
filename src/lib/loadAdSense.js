/**
 * Google AdSense 스크립트 로드 (한 번만)
 */
let loaded = false;
let loading = false;

export function loadAdSenseScript(clientId) {
  if (!clientId || clientId.includes('XXXX')) return Promise.resolve();
  if (loaded) return Promise.resolve();
  if (loading) return new Promise((resolve) => { const check = () => { if (loaded) resolve(); else setTimeout(check, 50); }; check(); });

  loading = true;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => { loaded = true; loading = false; resolve(); };
    script.onerror = () => { loading = false; resolve(); };
    document.head.appendChild(script);
  });
}

export function pushAdSlot() {
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
}
