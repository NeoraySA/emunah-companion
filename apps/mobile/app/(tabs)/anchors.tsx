import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@constants/config';
import { useAnchors, useCreateAnchor, useUpdateAnchor, useDeleteAnchor } from '@hooks/use-anchors';
import { EmptyState } from '@components/EmptyState';
import type { Anchor, ScheduleType } from '@emunah/shared';

const SCHEDULE_OPTIONS: { value: ScheduleType; label: string }[] = [
  { value: 'once', label: 'פעם אחת' },
  { value: 'daily', label: 'יומי' },
  { value: 'weekly', label: 'שבועי' },
  { value: 'custom', label: 'מותאם' },
];

export default function AnchorsScreen() {
  const { data: anchors, isLoading, isError, refetch } = useAnchors();
  const createMutation = useCreateAnchor();
  const updateMutation = useUpdateAnchor();
  const deleteMutation = useDeleteAnchor();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnchor, setEditingAnchor] = useState<Anchor | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [isActive, setIsActive] = useState(true);

  const openNew = useCallback(() => {
    setEditingAnchor(null);
    setTitle('');
    setBody('');
    setScheduleType('daily');
    setIsActive(true);
    setModalVisible(true);
  }, []);

  const openEdit = useCallback((anchor: Anchor) => {
    setEditingAnchor(anchor);
    setTitle(anchor.title);
    setBody(anchor.body ?? '');
    setScheduleType(anchor.scheduleType);
    setIsActive(anchor.isActive);
    setModalVisible(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    try {
      if (editingAnchor) {
        await updateMutation.mutateAsync({
          id: editingAnchor.id,
          title: title.trim(),
          body: body.trim() || undefined,
          scheduleType,
        });
      } else {
        await createMutation.mutateAsync({
          title: title.trim(),
          body: body.trim() || undefined,
          scheduleType,
        });
      }
      setModalVisible(false);
    } catch {
      Alert.alert('שגיאה', 'לא ניתן לשמור את העוגן');
    }
  }, [editingAnchor, title, body, scheduleType]);

  const handleDelete = useCallback(
    (anchor: Anchor) => {
      Alert.alert('מחיקה', `למחוק את "${anchor.title}"?`, [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(anchor.id),
        },
      ]);
    },
    [deleteMutation],
  );

  const scheduleLabel = (type: ScheduleType) =>
    SCHEDULE_OPTIONS.find((o) => o.value === type)?.label ?? type;

  function renderItem({ item }: { item: Anchor }) {
    return (
      <Pressable style={styles.card} onPress={() => openEdit(item)} accessibilityRole="button">
        <View style={styles.cardRow}>
          <View
            style={[
              styles.dot,
              { backgroundColor: item.isActive ? COLORS.success : COLORS.textMuted },
            ]}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.body ? (
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.body}
              </Text>
            ) : null}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="repeat-outline" size={12} color={COLORS.secondary} />
                <Text style={styles.badgeText}>{scheduleLabel(item.scheduleType)}</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={() => handleDelete(item)} hitSlop={8} accessibilityLabel="מחק עוגן">
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </Pressable>
        </View>
      </Pressable>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center} edges={['bottom']}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={anchors}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
        ListEmptyComponent={
          <EmptyState
            emoji="💎"
            title="אין עוגנים עדיין"
            subtitle={isError ? 'שגיאה בטעינה' : 'צור עוגני אמונה לרגעי חיזוק'}
            actionLabel="עוגן חדש"
            onAction={openNew}
          />
        }
      />

      {/* FAB */}
      {(anchors?.length ?? 0) > 0 && (
        <Pressable style={styles.fab} onPress={openNew} accessibilityLabel="עוגן חדש">
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}

      {/* Create / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <SafeAreaView style={styles.modalInner}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>ביטול</Text>
              </Pressable>
              <Text style={styles.modalTitle}>{editingAnchor ? 'עריכת עוגן' : 'עוגן חדש'}</Text>
              <Pressable
                onPress={handleSave}
                disabled={!title.trim() || createMutation.isPending || updateMutation.isPending}
              >
                <Text style={[styles.modalSave, !title.trim() && styles.modalSaveDisabled]}>
                  {createMutation.isPending || updateMutation.isPending ? '...' : 'שמור'}
                </Text>
              </Pressable>
            </View>

            {/* Title */}
            <TextInput
              style={styles.inputTitle}
              placeholder="כותרת העוגן *"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
              autoFocus
            />

            {/* Body */}
            <TextInput
              style={styles.inputBody}
              placeholder="תוכן / פסוק / מחשבה..."
              placeholderTextColor={COLORS.textMuted}
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
              textAlign="right"
            />

            {/* Schedule type */}
            <Text style={styles.fieldLabel}>תזמון תזכורת</Text>
            <View style={styles.scheduleRow}>
              {SCHEDULE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.scheduleOption,
                    scheduleType === opt.value && styles.scheduleSelected,
                  ]}
                  onPress={() => setScheduleType(opt.value)}
                >
                  <Text
                    style={[
                      styles.scheduleText,
                      scheduleType === opt.value && styles.scheduleTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Active toggle (edit only) */}
            {editingAnchor ? (
              <View style={styles.toggleRow}>
                <Text style={styles.fieldLabel}>פעיל</Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ true: COLORS.secondary, false: COLORS.border }}
                />
              </View>
            ) : null}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
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
  },
  list: { padding: 16, paddingBottom: 100 },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    marginTop: 8,
    gap: 8,
  },
  badge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.secondary + '12',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, color: COLORS.secondary, fontWeight: '500' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // Modal
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalInner: { flex: 1, padding: 20 },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },
  modalCancel: { fontSize: 16, color: COLORS.textSecondary },
  modalSave: { fontSize: 16, fontWeight: '600', color: COLORS.secondary },
  modalSaveDisabled: { color: COLORS.textMuted },

  // Inputs
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  inputBody: {
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingTop: 12,
    writingDirection: 'rtl',
    lineHeight: 26,
    minHeight: 120,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 8,
  },

  // Schedule
  scheduleRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 20,
  },
  scheduleOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  scheduleSelected: { backgroundColor: COLORS.secondary },
  scheduleText: { fontSize: 14, color: COLORS.textPrimary },
  scheduleTextSelected: { color: '#fff', fontWeight: '600' },

  // Toggle
  toggleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
