import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { useProfile } from "@/src/hooks/useProfile";

type RequireSessionProps = {
  children: ReactNode;
  requireOnboarding?: boolean;
};

/** Redirects unauthenticated (and optionally unfinished) users off protected stacks. */
export function RequireSession({ children, requireOnboarding = true }: RequireSessionProps) {
  const { session, profile } = useProfile();
  if (!session) return <Redirect href="/login" />;
  if (requireOnboarding && !profile.onboardingComplete) return <Redirect href="/onboarding" />;
  return <>{children}</>;
}
