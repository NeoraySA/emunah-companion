import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Journal Screen – personal faith journal (encrypted entries).
 * Placeholder until Journal API is connected.
 */
export default function JournalScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📝</Text>
        <Text style={styles.title}>יומן אישי</Text>
        <Text style={styles.subtitle}>כאן תוכל לרשום את חוויות האמונה שלך</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
