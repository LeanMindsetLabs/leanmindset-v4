import { usePathname } from "expo-router";
import { useUiVariant } from "@/src/context/UiVariantContext";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { demoSetLifecycle } from "@/src/services/labMembershipService";
import UiVariantToggle from "@/src/ui/UiVariantToggle";

export default function PreviewToggles() {
  const pathname = usePathname();
  const { previewRoute, checkInPicker, setCheckInPicker } = useUiVariant();
  const { membership } = useLabMembership();

  if (!__DEV__) return null;
  if (pathname.startsWith("/labs/")) return null;

  if (previewRoute === "checkin") {
    return (
      <UiVariantToggle
        compact
        label="Check-in pickers"
        value={checkInPicker}
        onChange={setCheckInPicker}
        options={[
          { id: "1", label: "1" },
          { id: "2", label: "2" },
          { id: "3", label: "3" },
        ]}
      />
    );
  }

  if (previewRoute === "index") {
    return (
      <UiVariantToggle
        compact
        label="Lab"
        value={membership.lifecycle}
        onChange={demoSetLifecycle}
        options={[
          { id: "explorer", label: "Explore" },
          { id: "requested", label: "Wait" },
          { id: "approved_preparing", label: "Prep" },
          { id: "active", label: "Active" },
          { id: "completed", label: "Done" },
        ]}
      />
    );
  }

  return null;
}
