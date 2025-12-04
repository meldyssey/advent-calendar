
export function isKakaoTalkBrowser(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('kakaotalk');
}; 

export function openInExternalBrwoser(url?: string): void {
  const targetUrl = 'https://advent-calendar-68497.web.app/';
  window.location.replace(`kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`);
}