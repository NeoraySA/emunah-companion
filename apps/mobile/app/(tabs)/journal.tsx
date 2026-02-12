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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@constants/config';
import {
  useJournalEntries,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from '@hooks/use-journal';
import { EmptyState } from '@components/EmptyState';
import type { JournalEntry } from '@emunah/shared';

const MOOD_OPTIONS = ['😊', '🙏', '💪', '😔', '🤔', '✨'];

export default function JournalScreen() {
  const { data: entries, isLoading, isError, refetch } = useJournalEntries();
  const createMutation = useCreateJournalEntry();
  const updateMutation = useUpdateJournalEntry();
  const deleteMutation = useDeleteJournalEntry();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('');

  const openNew = useCallback(() => {
    setEditingEntry(null);
    setTitle('');
    setBody('');
    setMood('');
    setModalVisible(true);
  }, []);

  const openEdit = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title ?? '');
    setBody(entry.body);
    setMood(entry.mood ?? '');
    setModalVisible(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!body.trim()) return;
    try {
      if (editingEntry) {
        await updateMutation.mutateAsync({
          id: editingEntry.id,
          title: title.trim() || undefined,
          body: body.trim(),
          mood: mood || undefined,
        });
      } else {
        await createMutation.mutateAsync({
          title: title.trim() || undefined,
          body: body.trim(),
          mood: mood || undefined,
        });
      }
      setModalVisible(false);
    } catch {
      Alert.alert('שגיאה', 'לא ניתן לשמור את הרשומה');
    }
  }, [editingEntry, title, body, mood]);

  const handleDelete = useCallback(
    (entry: JournalEntry) => {
      Alert.alert('מחיקה', 'למחוק את הרשומה?', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(entry.id),
        },
      ]);
    },
    [deleteMutation],
  );

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function renderItem({ item }: { item: JournalEntry }) {
    return (
      <Pressable style={styles.card} onPress={() => openEdit(item)} accessibilityRole="button">
        <View style={styles.cardHeader}>
          {item.mood ? <Text style={styles.mood}>{item.mood}</Text> : null}
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        </View>
        {item.title ? <Text style={styles.cardTitle}>{item.title}</Text> : null}
        <Text style={styles.cardBody} numberOfLines={3}>
          {item.body}
        </Text>
        <Pressable
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
          hitSlop={8}
          accessibilityLabel="מחק רשומה"
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
        </Pressable>
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
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
        ListEmptyComponent={
          <EmptyState
            emoji="📝"
            title="היומן ריק"
            subtitle={isError ? 'שגיאה בטעינה' : 'התחל לכתוב את חוויות האמונה שלך'}
            actionLabel="רשומה חדשה"
            onAction={openNew}
          />
        }
      />

      {/* FAB */}
      {(entries?.length ?? 0) > 0 && (
        <Pressable style={styles.fab} onPress={openNew} accessibilityLabel="רשומה חדשה">
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
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>ביטול</Text>
              </Pressable>
              <Text style={styles.modalTitle}>{editingEntry ? 'עריכת רשומה' : 'רשומה חדשה'}</Text>
              <Pressable
                onPress={handleSave}
                disabled={!body.trim() || createMutation.isPending || updateMutation.isPending}
              >
                <Text style={[styles.modalSave, !body.trim() && styles.modalSaveDisabled]}>
                  {createMutation.isPending || updateMutation.isPending ? '...' : 'שמור'}
                </Text>
              </Pressable>
            </View>

            {/* Mood selector */}
            <View style={styles.moodRow}>
              <Text style={styles.moodLabel}>מצב רוח:</Text>
              {MOOD_OPTIONS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMood(mood === m ? '' : m)}
                  style={[styles.moodOption, mood === m && styles.moodSelected]}
                >
                  <Text style={styles.moodEmoji}>{m}</Text>
                </Pressable>
              ))}
            </View>

            {/* Title */}
            <TextInput
              style={styles.inputTitle}
              placeholder="כותרת (אופציונלי)"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
            />

            {/* Body */}
            <TextInput
              style={styles.inputBody}
              placeholder="מה עובר עליך היום?"
              placeholderTextColor={COLORS.textMuted}
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
              textAlign="right"
              autoFocus
            />
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
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  mood: { fontSize: 20 },
  cardDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
    textAlign: 'right',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 15,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: 22,
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },

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
    marginBottom: 20,
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

  // Mood
  moodRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
  },
  moodOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.border,
  },
  moodSelected: {
    backgroundColor: COLORS.secondary + '30',
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  moodEmoji: { fontSize: 18 },

  // Inputs
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    writingDirection: 'rtl',
  },
  inputBody: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingTop: 16,
    writingDirection: 'rtl',
    lineHeight: 26,
  },
});
