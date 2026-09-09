import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInput,
} from "react-native";
import AppTextInput from "@/src/ui/AppTextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppScreen from "@/src/layout/AppScreen";
import { useKeyboardHeight } from "@/src/hooks/useKeyboardHeight";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { useUiVariant } from "@/src/context/UiVariantContext";
import {
  createAssistantMessage,
  createUserMessage,
  getCoachReply,
  getCoachThread,
  quickActions,
  replyDelay,
  setCoachThread,
  splitCheckInMessage,
  type CoachMessage,
} from "@/src/services/coachService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import AvatarBadge from "@/src/ui/AvatarBadge";
import CheckInAskCard from "@/src/ui/CheckInAskCard";
import InsightCard from "@/src/ui/InsightCard";
import { canCheckIn } from "@/src/services/labMembershipService";

const actionIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  utensils: "restaurant-outline",
  clock: "time-outline",
  cake: "ice-cream-outline",
  sliders: "options-outline",
  plane: "airplane-outline",
  battery: "battery-half-outline",
};

const glassWeb = {
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
} as const;

const inputWeb = {
  borderWidth: 0,
} as const;

export default function CoachChat() {
  const { setComposerOpen, pendingCoachMessage, setPendingCoachMessage } = useUiVariant();
  const { membership } = useLabMembership();
  const checkInEnabled = canCheckIn(membership.lifecycle);
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<CoachMessage[]>(getCoachThread);
  const [typing, setTyping] = useState(false);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const keyboardInset = useKeyboardHeight();
  const [attachOpen, setAttachOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const endRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (blurTimer.current) clearTimeout(blurTimer.current);
      setComposerOpen(false);
    };
  }, [setComposerOpen]);

  useEffect(() => {
    if (keyboardInset > 0) {
      setTimeout(() => endRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [keyboardInset]);

  const composerPadBottom =
    keyboardInset > 0
      ? keyboardInset + spacing.sm
      : composing
        ? insets.bottom + spacing.sm
        : layout.tabBarContentInset;

  function enterChat() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setComposing(true);
    setComposerOpen(true);
  }

  function leaveChat() {
    setComposing(false);
    setComposerOpen(false);
  }

  function pickUpload(kind: "photo" | "file") {
    const fallback = kind === "photo" ? "Photo attached." : "File attached.";
    if (Platform.OS !== "web" || typeof document === "undefined") {
      setAttachOpen(false);
      sendMessage(fallback);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = kind === "photo" ? "image/*" : "*/*";
    input.onchange = () => {
      const file = input.files?.[0];
      setAttachOpen(false);
      if (!file) return;
      sendMessage(`${kind === "photo" ? "Photo" : "File"}: ${file.name}`);
    };
    input.click();
  }

  function commitMessages(updater: (current: CoachMessage[]) => CoachMessage[]) {
    setMessages((current) => {
      const next = updater(current);
      setCoachThread(next);
      return next;
    });
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMessage = createUserMessage(trimmed);
    commitMessages((current) => [...current, userMessage]);
    setTyping(true);
    setDraft("");
    const reply = getCoachReply(trimmed);
    timerRef.current = setTimeout(() => {
      commitMessages((current) => [
        ...current.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "read" as const } : msg)),
        createAssistantMessage(reply),
      ]);
      setTyping(false);
    }, replyDelay());
  }

  useEffect(() => {
    if (!pendingCoachMessage) return;
    const text = pendingCoachMessage;
    setPendingCoachMessage(null);
    sendMessage(text);
  }, [pendingCoachMessage, setPendingCoachMessage]);

  return (
    <AppScreen edges={["top"]} padded={false}>
      <View style={styles.flex}>
        {!composing ? (
          <View style={styles.top}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Coach</Text>
                <Text style={styles.subtitle}>Ask for help, ideas, or a plan</Text>
              </View>
              <AvatarBadge />
            </View>
            <View style={styles.rule} />
          </View>
        ) : null}

        {!composing ? (
          <View style={styles.focusWrap}>
            <InsightCard
              title="Today's coaching focus"
              body="You're doing well. Prioritize hydration and complete your workout."
              cta="View tips"
            />
          </View>
        ) : null}

        <ScrollView
          ref={endRef}
          style={styles.threadScroll}
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => endRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
          {typing ? (
            <Bubble message={{ id: "typing", role: "assistant", text: "", time: "" }} typing />
          ) : null}
        </ScrollView>

        {!composing ? (
          <View style={styles.fixedAsk}>
            <Text style={styles.ask}>Ask your coach</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
              {checkInEnabled ? <CheckInAskCard /> : null}
              {quickActions.map((action) => (
                <Pressable
                  key={action.id}
                  style={styles.quick}
                  onPress={() => sendMessage(action.message)}
                  accessibilityLabel={action.label.replace("\n", " ")}
                >
                  <Ionicons name={actionIcons[action.icon] ?? "help-outline"} size={15} color={action.color} />
                  <Text style={styles.quickLabel}>{action.label}</Text>
                  <Ionicons name="chevron-forward" size={12} color="#6E7D92" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={[styles.composerDock, { paddingBottom: composerPadBottom }]}>
          <View style={styles.composerRow}>
            <View style={styles.plusSlot}>
              {attachOpen ? (
                <View style={styles.attachMenu} accessibilityViewIsModal>
                  <Pressable style={styles.attachItem} onPress={() => pickUpload("photo")} accessibilityLabel="Upload photo">
                    <Ionicons name="image-outline" size={18} color={colors.metricBlueSoft} />
                    <Text style={styles.attachLabel}>Photo</Text>
                  </Pressable>
                  <View style={styles.attachSplit} />
                  <Pressable style={styles.attachItem} onPress={() => pickUpload("file")} accessibilityLabel="Upload file">
                    <Ionicons name="document-outline" size={18} color={colors.metricBlueSoft} />
                    <Text style={styles.attachLabel}>File</Text>
                  </Pressable>
                  <View style={styles.attachCaret} />
                </View>
              ) : null}
              <Pressable
                style={[styles.plus, attachOpen && styles.plusOpen, Platform.OS === "web" ? glassWeb : null]}
                onPress={() => {
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  setAttachOpen((open) => !open);
                }}
                accessibilityLabel="Add photo or file"
              >
                <Ionicons name={attachOpen ? "close" : "add"} size={22} color={colors.white} />
              </Pressable>
            </View>
            <View style={[styles.composer, Platform.OS === "web" ? glassWeb : null]}>
              <AppTextInput
                ref={inputRef}
                style={[styles.input, Platform.OS === "web" ? inputWeb : null]}
                value={draft}
                onChangeText={setDraft}
                onFocus={() => {
                  setAttachOpen(false);
                  enterChat();
                }}
                onBlur={() => {
                  blurTimer.current = setTimeout(leaveChat, 180);
                }}
                placeholder="Ask your coach...."
                placeholderTextColor="#8E8E93"
                accessibilityLabel="Ask your coach"
                returnKeyType="send"
                onSubmitEditing={() => sendMessage(draft)}
              />
              {draft.trim() ? (
                <Pressable
                  style={styles.send}
                  onPress={() => sendMessage(draft)}
                  accessibilityLabel="Send message"
                >
                  <Ionicons name="arrow-up" size={18} color={colors.white} />
                </Pressable>
              ) : (
                <Pressable style={styles.mic} accessibilityLabel="Voice memo">
                  <Ionicons name="mic-outline" size={22} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function BubbleText({ text }: { text: string }) {
  const checkIn = splitCheckInMessage(text);
  if (!checkIn) return <Text style={styles.bubbleText}>{text}</Text>;
  return (
    <Text style={styles.bubbleText}>
      <Text style={styles.checkInHeading}>{checkIn.heading}</Text>
      {checkIn.body ? `\n${checkIn.body}` : null}
    </Text>
  );
}

function Bubble({ message, typing }: { message: CoachMessage; typing?: boolean }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.msg, isUser && styles.msgUser]}>
      {!isUser ? (
        <View style={styles.spark}>
          <Ionicons name="sparkles" size={11} color="#7EABFF" />
        </View>
      ) : null}
      <View style={[styles.msgCol, isUser && styles.msgColUser]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleCoach]}>
          {typing ? (
            <Text style={styles.typing}>● ● ●</Text>
          ) : (
            <BubbleText text={message.text} />
          )}
        </View>
        {!typing && message.time ? (
          <View style={[styles.meta, isUser && styles.metaUser]}>
            <Text style={styles.metaText}>{message.time}</Text>
            {isUser ? <Ionicons name="checkmark-done" size={12} color="#8E8E93" /> : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 26, lineHeight: 31, fontWeight: "700", letterSpacing: -0.4, color: "#F5F7FB" },
  subtitle: { marginTop: 1, fontSize: 11, lineHeight: 15, color: "#8E8E93" },
  rule: { height: 1, marginTop: 10, backgroundColor: "rgba(255,255,255,0.08)" },
  focusWrap: { paddingHorizontal: 16, paddingTop: 8, flexShrink: 0 },
  threadScroll: { flex: 1, minHeight: 72 },
  thread: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, gap: 8 },
  msg: { flexDirection: "row", alignItems: "flex-end", gap: 6, width: "100%" },
  msgUser: { justifyContent: "flex-end" },
  spark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  msgCol: { maxWidth: "78%", flexShrink: 1 },
  msgColUser: { alignItems: "flex-end", marginLeft: "auto" },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleCoach: {
    backgroundColor: "#3A3A3C",
    borderBottomLeftRadius: 4,
    alignSelf: "flex-start",
  },
  bubbleUser: {
    backgroundColor: "#0A84FF",
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  bubbleText: { fontSize: 15, lineHeight: 20, color: "#FFFFFF", fontWeight: "400" },
  checkInHeading: { fontSize: 16, lineHeight: 21, fontWeight: "800", color: "#FFFFFF" },
  typing: { color: "rgba(255,255,255,0.55)", fontSize: 15, letterSpacing: 3 },
  meta: { marginTop: 4, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 4 },
  metaUser: { justifyContent: "flex-end" },
  metaText: { fontSize: 11, lineHeight: 13, color: "#8E8E93" },
  fixedAsk: { flexShrink: 0, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  ask: { fontSize: 11, fontWeight: "500", color: "#A6B4C8" },
  quickRow: { gap: 8, paddingBottom: 2 },
  quick: {
    minWidth: 118,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 11,
  },
  quickLabel: { fontSize: 10, lineHeight: 13, fontWeight: "500", color: "#E8EEF6" },
  composerDock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexShrink: 0,
    overflow: "visible",
    zIndex: 6,
  },
  attachMenu: {
    position: "absolute",
    left: 0,
    bottom: 56,
    minWidth: 148,
    borderRadius: 14,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingVertical: 4,
    zIndex: 8,
    ...Platform.select({
      web: { boxShadow: "0 10px 24px rgba(0,0,0,0.45)" as const },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
      },
    }),
  },
  attachSplit: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginHorizontal: 10,
  },
  attachCaret: {
    position: "absolute",
    left: 18,
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: "#2C2C2E",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    transform: [{ rotate: "45deg" }],
  },
  attachItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  attachLabel: { color: "#F5F7FB", fontSize: 15, fontWeight: "600" },
  composerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    overflow: "visible",
    zIndex: 6,
  },
  plusSlot: {
    width: 56,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "visible",
    zIndex: 7,
  },
  plus: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(44,44,46,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  plusOpen: {
    backgroundColor: "rgba(44,44,46,0.72)",
  },
  composer: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 48,
    paddingLeft: 14,
    paddingRight: 6,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(44,44,46,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  input: {
    flex: 1,
    height: 34,
    color: "#F5F7FB",
    fontSize: 14.4,
    backgroundColor: "transparent",
    padding: 0,
  },
  mic: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
  },
});
