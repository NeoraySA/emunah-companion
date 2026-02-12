import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@constants/config';
import { useScenarios } from '@hooks/use-scenarios';
import { EmptyState } from '@components/EmptyState';
import type { Scenario } from '@emunah/shared';

const CATEGORY_COLORS: Record<string, string> = {
  faith: '#3b82f6',
  trust: '#10b981',
  gratitude: '#f59e0b',
  prayer: '#8b5cf6',
};

export default function ScenariosScreen() {
  const { data: scenarios, isLoading, isError, refetch } = useScenarios();
  const router = useRouter();

  function handlePress(id: number) {
    router.push(`/scenario/${id}` as never);
  }

  function renderItem({ item }: { item: Scenario }) {
    const color = CATEGORY_COLORS[item.category] ?? COLORS.secondary;
    return (
      <Pressable
        style={styles.card}
        onPress={() => handlePress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={item.title ?? item.key}
      >
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title ?? item.key}</Text>
          {item.description ? (
            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        <Ionicons name="chevron-back" size={20} color={COLORS.textMuted} />
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
        data={scenarios}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
        ListEmptyComponent={
          <EmptyState
            emoji="📖"
            title="אין תרחישים עדיין"
            subtitle={isError ? 'שגיאה בטעינת הנתונים' : 'תרחישים יתווספו בקרוב דרך לוח הניהול'}
          />
        }
      />
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
  list: { padding: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
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
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
    textAlign: 'right',
    lineHeight: 20,
  },
  cardCategory: {
    fontSize: 12,
    color: COLORS.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginTop: 6,
  },
});
