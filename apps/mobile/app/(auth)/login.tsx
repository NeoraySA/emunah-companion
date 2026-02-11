import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@constants/config';
import { useAuth } from '@hooks/use-auth';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('נא למלא את כל השדות');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? 'שגיאה בהתחברות. נסה שוב.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={56} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>אמונה</Text>
          <Text style={styles.subtitle}>ברוך הבא! התחבר כדי להמשיך</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>אימייל</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              textAlign="left"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>סיסמה</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                textContentType="password"
                textAlign="left"
                editable={!loading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="התחבר"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>התחבר</Text>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>אין לך חשבון?</Text>
          <Link href={'/(auth)/register' as never} asChild>
            <Pressable accessibilityRole="link">
              <Text style={styles.footerLink}> הירשם עכשיו</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  // Header
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    writingDirection: 'rtl',
  },

  // Form
  form: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  errorBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10',
    borderColor: COLORS.error + '30',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    writingDirection: 'rtl',
  },
  footerLink: {
    fontSize: 15,
    color: COLORS.secondary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
});
