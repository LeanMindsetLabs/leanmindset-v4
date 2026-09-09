import { router, type Href } from "expo-router";
import { Platform } from "react-native";

/** Shareable URL fallback until a V4 host is live. Native opens in-app legal routes. */
export const LEGAL_SITE = "https://leanmindset-v3.vercel.app";

export const legalSlugs = {
  terms: "terms",
  privacy: "privacy",
  community: "community-guidelines",
} as const;

export type LegalPage = keyof typeof legalSlugs;

export function legalUrl(page: LegalPage) {
  const path = `/legal/${legalSlugs[page]}/`;
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return `${LEGAL_SITE}${path}`;
}

export async function openLegalPage(page: LegalPage) {
  if (Platform.OS !== "web") {
    router.push(`/legal/${legalSlugs[page]}` as Href);
    return;
  }
  const url = legalUrl(page);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.assign(url);
}
