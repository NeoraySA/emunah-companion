import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@constants/config';
import { useHomeButtons } from '@hooks/use-home-buttons';
import { useAuth } from '@hooks/use-auth';
import { EmptyState } from '@components/EmptyState';

// Map icon string from API to Ionicons name
const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  book: 'book-outline',
  journal: 'journal-outline',
  heart: 'heart-outline',
  settings: 'settings-outline',
  star: 'star-outline',
  compass: 'compass-outline',
  bulb: 'bulb-outline',
  people: 'people-outline',
};

const COLOR_MAP: Record<string, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  indigo: '#6366f1',
  rose: '#f43f5e',
  teal: '#14b8a6',
};

function resolveIcon(raw: string): keyof typeof Ionicons.glyphMap {
  return ICON_MAP[raw] ?? (raw as keyof typeof Ionicons.glyphMap) ?? 'ellipse-outline';
}

function resolveColor(raw: string): string {
  return COLOR_MAP[raw] ?? raw ?? COLORS.secondary;
}

/**
 * Home Screen – displays the main action buttons configured via CMS.
 */
export default function HomeScreen() {
  const { user } = useAuth();
  const { data: buttons, isLoading, isError, refetch } = useHomeButtons();
  const router = useRouter();

  function handlePress(route: string) {
    // Routes from API like "scenarios", "journal", "anchors", "settings"
    if (route.startsWith('/')) {
      router.push(route as never);
    } else {
      router.navigate(`/(tabs)/${route}` as never);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>שלום{user?.fullName ? ` ${user.fullName}` : ''}!</Text>
          <Text style={styles.heroSubtitle}>חזק את האמונה שלך יום אחרי יום</Text>
        </View>

        {/* Action Buttons Grid */}
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.secondary} style={{ marginTop: 32 }} />
        ) : isError || !buttons?.length ? (
          <EmptyState
            icon="grid-outline"
            title="אין כפתורים זמינים"
            subtitle="עדכן את התוכן דרך לוח הניהול"
          />
        ) : (
          <View style={styles.grid}>
            {buttons.map((button) => (
              <Pressable
                key={button.id}
                style={styles.card}
                accessibilityLabel={button.label ?? button.key}
                accessibilityRole="button"
                onPress={() => handlePress(button.route)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: resolveColor(button.icon.split(':')[1] ?? 'blue') + '20' },
                  ]}
                >
                  <Ionicons
                    name={resolveIcon(button.icon.split(':')[0] ?? button.icon)}
                    size={32}
                    color={resolveColor(button.icon.split(':')[1] ?? 'blue')}
                  />
                </View>
                <Text style={styles.cardTitle}>{button.label ?? button.key}</Text>
                {button.description ? (
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {button.description}
                  </Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginTop: 4,
  },
});
