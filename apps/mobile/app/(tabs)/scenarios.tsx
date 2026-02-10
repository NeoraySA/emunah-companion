import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Scenarios Screen – displays list of faith/bittachon scenarios.
 * Placeholder until Scenario API is connected.
 */
export default function ScenariosScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📖</Text>
        <Text style={styles.title}>תרחישי אמונה</Text>
        <Text style={styles.subtitle}>בקרוב יופיעו כאן תרחישים לחיזוק האמונה</Text>
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
