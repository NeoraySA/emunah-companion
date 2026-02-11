import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@constants/config';
import { useAuth } from '@hooks/use-auth';

/**
 * Settings Screen – user info, preferences, logout.
 */
export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  function handleLogout() {
    Alert.alert('התנתקות', 'האם אתה בטוח שברצונך להתנתק?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'התנתק',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName ?? 'משתמש'}</Text>
            <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          </View>
        </View>

        {/* Settings sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>כללי</Text>

          <SettingsRow icon="language-outline" label="שפה" value="עברית" />
          <SettingsRow icon="notifications-outline" label="התראות" value="פעיל" />
          <SettingsRow icon="moon-outline" label="מצב לילה" value="כבוי" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>אודות</Text>

          <SettingsRow icon="information-circle-outline" label="גרסה" value="1.0.0" />
          <SettingsRow icon="document-text-outline" label="תנאי שימוש" />
          <SettingsRow icon="shield-outline" label="מדיניות פרטיות" />
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
          accessibilityRole="button"
          accessibilityLabel="התנתק"
        >
          {loggingOut ? (
            <ActivityIndicator color={COLORS.error} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
              <Text style={styles.logoutText}>התנתק</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Settings row component
// ---------------------------------------------------------------------------

function SettingsRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  return (
    <Pressable style={styles.row} accessibilityRole="button">
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={COLORS.textSecondary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // User card
  userCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: { flex: 1, marginRight: 16 },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'right',
  },

  // Sections
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },

  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    writingDirection: 'rtl',
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error + '10',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    writingDirection: 'rtl',
  },
});
