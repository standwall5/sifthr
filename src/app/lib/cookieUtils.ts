/**
 * Cookie utilities for managing visitor tracking and consent
 */

const COOKIE_CONSENT_NAME = "sifthr_cookie_consent";
const VISITOR_COOKIE_NAME = "sifthr_visitor";
const FIRST_VISIT_SHOWN = "sifthr_first_visit_shown";

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

/**
 * Set a cookie in the browser
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 365,
): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie from the browser
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Check if user has accepted cookies
 */
export function hasAcceptedCookies(): boolean {
  const consent = getCookie(COOKIE_CONSENT_NAME);
  return consent !== null;
}

/**
 * Save cookie consent preferences
 */
export function saveCookieConsent(consent: Partial<CookieConsent>): void {
  const fullConsent: CookieConsent = {
    necessary: true, // Always true
    analytics: consent.analytics ?? false,
    marketing: consent.marketing ?? false,
    timestamp: Date.now(),
  };
  setCookie(COOKIE_CONSENT_NAME, JSON.stringify(fullConsent), 365);
}

/**
 * Get cookie consent preferences
 */
export function getCookieConsent(): CookieConsent | null {
  const consent = getCookie(COOKIE_CONSENT_NAME);
  if (!consent) return null;

  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

/**
 * Check if this is the user's first visit
 */
export function isFirstTimeVisitor(): boolean {
  return getCookie(VISITOR_COOKIE_NAME) === null;
}

/**
 * Mark that the user has visited the site
 */
export function markAsVisited(): void {
  setCookie(VISITOR_COOKIE_NAME, "true", 365);
}

/**
 * Check if we've already shown the first-visit experience
 */
export function hasShownFirstVisit(): boolean {
  return getCookie(FIRST_VISIT_SHOWN) === "true";
}

/**
 * Mark that we've shown the first-visit experience
 */
export function markFirstVisitShown(): void {
  setCookie(FIRST_VISIT_SHOWN, "true", 365);
}

/**
 * Check if we should show the Next Step tour
 */
export function shouldShowNextStep(): boolean {
  // Show if:
  // 1. User has accepted cookies (or at least visited)
  // 2. This is their first time
  // 3. We haven't shown it yet
  return isFirstTimeVisitor() && !hasShownFirstVisit();
}
