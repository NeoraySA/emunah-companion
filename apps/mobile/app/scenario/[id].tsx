import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@constants/config';
import { useScenario } from '@hooks/use-scenarios';
import type { ScenarioStep } from '@emunah/shared';

const STEP_TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  text: 'document-text-outline',
  prompt: 'chatbubble-ellipses-outline',
  action: 'flash-outline',
  summary: 'checkmark-circle-outline',
};

/**
 * Scenario flow screen – step-by-step walkthrough.
 * Accessible via /scenario/[id] (stack screen above tabs).
 */
export default function ScenarioFlowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scenarioId = Number(id);
  const { data: scenario, isLoading, isError } = useScenario(scenarioId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = scenario?.steps?.sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const currentStep: ScenarioStep | undefined = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const goNext = useCallback(() => {
    if (!isLast) setCurrentStepIndex((i) => i + 1);
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (!isFirst) setCurrentStepIndex((i) => i - 1);
  }, [isFirst]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Stack.Screen options={{ title: 'טוען...' }} />
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </SafeAreaView>
    );
  }

  if (isError || !scenario) {
    return (
      <SafeAreaView style={styles.center}>
        <Stack.Screen options={{ title: 'שגיאה' }} />
        <Text style={styles.errorText}>לא ניתן לטעון את התרחיש</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>חזרה</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!steps.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Stack.Screen options={{ title: scenario.title ?? scenario.key }} />
        <Ionicons name="document-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>אין צעדים בתרחיש זה</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>חזרה</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: scenario.title ?? scenario.key,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerBackTitle: 'חזרה',
        }}
      />

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          צעד {currentStepIndex + 1} מתוך {steps.length}
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentStepIndex + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Step content */}
      <ScrollView contentContainerStyle={styles.stepContent}>
        <View style={styles.stepIconRow}>
          <Ionicons
            name={STEP_TYPE_ICONS[currentStep?.stepType ?? 'text'] ?? 'ellipse-outline'}
            size={28}
            color={COLORS.secondary}
          />
          <Text style={styles.stepTypeLabel}>
            {currentStep?.stepType === 'text'
              ? 'קריאה'
              : currentStep?.stepType === 'prompt'
                ? 'התבוננות'
                : currentStep?.stepType === 'action'
                  ? 'פעולה'
                  : 'סיכום'}
          </Text>
        </View>

        {currentStep?.title ? <Text style={styles.stepTitle}>{currentStep.title}</Text> : null}
        {currentStep?.body ? <Text style={styles.stepBody}>{currentStep.body}</Text> : null}
        {currentStep?.promptText ? (
          <View style={styles.promptBox}>
            <Text style={styles.promptText}>{currentStep.promptText}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navRow}>
        <Pressable
          style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
          onPress={goPrev}
          disabled={isFirst}
        >
          <Ionicons name="chevron-forward" size={20} color={isFirst ? COLORS.textMuted : '#fff'} />
          <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>הקודם</Text>
        </Pressable>

        {isLast ? (
          <Pressable style={[styles.navBtn, styles.navBtnFinish]} onPress={() => router.back()}>
            <Text style={styles.navBtnText}>סיום</Text>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </Pressable>
        ) : (
          <Pressable style={styles.navBtn} onPress={goNext}>
            <Text style={styles.navBtnText}>הבא</Text>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginBottom: 16,
    writingDirection: 'rtl',
  },
  emptyTitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 12,
    writingDirection: 'rtl',
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  // Progress
  progressRow: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },

  // Step content
  stepContent: { padding: 20, paddingBottom: 40 },
  stepIconRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    writingDirection: 'rtl',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 16,
  },
  stepBody: {
    fontSize: 17,
    lineHeight: 28,
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  promptBox: {
    marginTop: 20,
    backgroundColor: COLORS.secondary + '10',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  promptText: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.primary,
    writingDirection: 'rtl',
    textAlign: 'right',
    fontStyle: 'italic',
  },

  // Nav
  navRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  navBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  navBtnDisabled: { backgroundColor: COLORS.border },
  navBtnFinish: { backgroundColor: COLORS.success },
  navBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  navBtnTextDisabled: { color: COLORS.textMuted },
});
