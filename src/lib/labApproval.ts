import * as Linking from "expo-linking";

/** Inbox that will receive join-request emails in the final (non-test) version. */
export const LAB_ADMIN_EMAIL = "mani.dev.beta@gmail.com";

/**
 * Testers: approve the join on the device immediately.
 * Final version: keep `requested` and notify `LAB_ADMIN_EMAIL` with `/admin/approve`.
 */
export const LAB_APPROVAL_MODE: "auto" | "admin-email" = "auto";

export const LAB_APPROVE_PATH = "/admin/approve";
export const LAB_APPROVE_WEB_URL = "https://leanmindset-v4.vercel.app/admin/approve";

export function isAutoLabApproval() {
  return LAB_APPROVAL_MODE === "auto";
}

export function labApproveUrl() {
  return Linking.createURL(LAB_APPROVE_PATH);
}

export function notifyAdminOfLabRequest(member: { name: string; email: string }) {
  if (isAutoLabApproval()) return;
  const subject = encodeURIComponent(`Starter Lab request: ${member.name || member.email}`);
  const body = encodeURIComponent(
    [
      `${member.name || "A member"} (${member.email}) requested Starter Lab.`,
      "",
      "Approve without opening the admin queue:",
      LAB_APPROVE_WEB_URL,
    ].join("\n"),
  );
  void Linking.openURL(`mailto:${LAB_ADMIN_EMAIL}?subject=${subject}&body=${body}`);
}
