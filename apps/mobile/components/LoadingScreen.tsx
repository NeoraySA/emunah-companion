import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '@constants/config';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen loading indicator.
 */
export function LoadingScreen({ message = 'טוען...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
  },
});
