import { useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useKeyboardHeight } from "@/src/hooks/useKeyboardHeight";

let overlayNode: ReactNode | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setOverlay(node: ReactNode | null) {
  overlayNode = node;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return overlayNode;
}

/** Renders sheets inside the phone body (covers tabs, stays in the iPhone frame on web). */
export function OverlayHost() {
  const overlay = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const keyboardHeight = useKeyboardHeight();
  if (!overlay) return null;
  return (
    <View pointerEvents="auto" style={[styles.host, keyboardHeight > 0 ? { bottom: keyboardHeight } : null]}>
      {overlay}
    </View>
  );
}

type InPhoneModalProps = {
  visible: boolean;
  children: ReactNode;
};

export function InPhoneModal({ visible, children }: InPhoneModalProps) {
  useLayoutEffect(() => {
    setOverlay(visible ? children : null);
  }, [visible, children]);

  useLayoutEffect(() => {
    return () => setOverlay(null);
  }, []);

  return null;
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
  },
});
