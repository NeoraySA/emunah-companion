import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

/**
 * Home Screen – displays the main action buttons configured via CMS.
 * Placeholder implementation until HomeButton API is connected.
 */
export default function HomeScreen() {
  // Placeholder buttons – will be replaced with data from API
  const buttons = [
    { id: '1', title: 'תרחישי אמונה', icon: 'book-outline' as const, color: '#3b82f6' },
    { id: '2', title: 'יומן אישי', icon: 'journal-outline' as const, color: '#10b981' },
    { id: '3', title: 'עוגני אמונה', icon: 'heart-outline' as const, color: '#f59e0b' },
    { id: '4', title: 'הגדרות', icon: 'settings-outline' as const, color: '#6366f1' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>שלום וברכה!</Text>
          <Text style={styles.heroSubtitle}>חזק את האמונה שלך יום אחרי יום</Text>
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.grid}>
          {buttons.map((button) => (
            <Pressable
              key={button.id}
              style={styles.card}
              accessibilityLabel={button.title}
              accessibilityRole="button"
            >
              <View style={[styles.iconContainer, { backgroundColor: button.color + '20' }]}>
                <Ionicons name={button.icon} size={32} color={button.color} />
              </View>
              <Text style={styles.cardTitle}>{button.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
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
    backgroundColor: '#ffffff',
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
    color: '#1e293b',
    writingDirection: 'rtl',
  },
});
