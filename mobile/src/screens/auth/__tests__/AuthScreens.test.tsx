import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../../../lib/authService';
import type { AuthStackParamList } from '../../../navigation/types';

/**
 * Integration tests untuk screen Auth (Phase 3)
 * - Verifikasi render & alur klik di LoginScreen / RegisterScreen
 * - Validasi form, error display, Google OAuth, navigasi link
 */

const Stack = createNativeStackNavigator<AuthStackParamList>();

function renderAuthNav(initialRoute: keyof AuthStackParamList = 'Login') {
  return render(
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login"          component={LoginScreen} />
        <Stack.Screen name="Register"       component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

async function resetAll() {
  await authService.__test__.reset();
  useAuthStore.setState({
    user:                   null,
    isLoading:              false,
    isInitialized:          true,
    error:                  null,
    needsEmailVerification: false,
  });
  // Pasang listener auth (biasanya di-pasang di App.tsx via initializeAuth)
  await useAuthStore.getState().initializeAuth();
}

// ────────────────────────────────────────────────────────────────────────────
describe('LoginScreen', () => {
  beforeEach(async () => { await resetAll(); });

  it('render judul, email field, password field, dan submit button', () => {
    const { getByTestId, getByText } = renderAuthNav('Login');
    expect(getByTestId('login-screen')).toBeTruthy();
    expect(getByTestId('login-email-input')).toBeTruthy();
    expect(getByTestId('login-password-input')).toBeTruthy();
    expect(getByTestId('login-submit-button')).toBeTruthy();
    expect(getByTestId('login-google-button')).toBeTruthy();
    expect(getByText('Masuk ke Akun')).toBeTruthy();
  });

  it('menampilkan error validasi saat submit form kosong', async () => {
    const { getByTestId, getByText } = renderAuthNav('Login');
    await act(async () => {
      fireEvent.press(getByTestId('login-submit-button'));
    });
    expect(getByText('Email wajib diisi')).toBeTruthy();
    expect(getByText('Kata sandi wajib diisi')).toBeTruthy();
  });

  it('menampilkan error untuk email format tidak valid', async () => {
    const { getByTestId, getByText } = renderAuthNav('Login');
    fireEvent.changeText(getByTestId('login-email-input'), 'bukanemail');
    fireEvent.changeText(getByTestId('login-password-input'), 'password123');
    await act(async () => {
      fireEvent.press(getByTestId('login-submit-button'));
    });
    expect(getByText(/format email tidak valid/i)).toBeTruthy();
  });

  it('login dengan kredensial demo → user di-set di store', async () => {
    const { getByTestId } = renderAuthNav('Login');
    fireEvent.changeText(getByTestId('login-email-input'), 'demo@kinclong.id');
    fireEvent.changeText(getByTestId('login-password-input'), 'password123');

    await act(async () => {
      fireEvent.press(getByTestId('login-submit-button'));
    });

    await waitFor(() => {
      expect(useAuthStore.getState().user?.email).toBe('demo@kinclong.id');
    });
  });

  it('login dengan kredensial salah → menampilkan error banner', async () => {
    const { getByTestId, findByTestId } = renderAuthNav('Login');
    fireEvent.changeText(getByTestId('login-email-input'), 'demo@kinclong.id');
    fireEvent.changeText(getByTestId('login-password-input'), 'wrongpass');

    await act(async () => {
      fireEvent.press(getByTestId('login-submit-button'));
    });

    const banner = await findByTestId('login-error-banner');
    expect(banner).toBeTruthy();
  });

  it('Google OAuth button → user di-set otomatis', async () => {
    const { getByTestId } = renderAuthNav('Login');
    await act(async () => {
      fireEvent.press(getByTestId('login-google-button'));
    });
    await waitFor(() => {
      expect(useAuthStore.getState().user).not.toBeNull();
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
describe('RegisterScreen', () => {
  beforeEach(async () => { await resetAll(); });

  it('render semua field form pendaftaran', () => {
    const { getByTestId } = renderAuthNav('Register');
    expect(getByTestId('register-screen')).toBeTruthy();
    expect(getByTestId('register-carwash-input')).toBeTruthy();
    expect(getByTestId('register-fullname-input')).toBeTruthy();
    expect(getByTestId('register-email-input')).toBeTruthy();
    expect(getByTestId('register-password-input')).toBeTruthy();
    expect(getByTestId('register-confirm-password-input')).toBeTruthy();
    expect(getByTestId('register-submit-button')).toBeTruthy();
    expect(getByTestId('register-google-button')).toBeTruthy();
  });

  it('error muncul saat password tidak cocok', async () => {
    const { getByTestId, getByText } = renderAuthNav('Register');
    fireEvent.changeText(getByTestId('register-carwash-input'),         'Outlet A');
    fireEvent.changeText(getByTestId('register-fullname-input'),        'Budi');
    fireEvent.changeText(getByTestId('register-email-input'),           'budi@email.com');
    fireEvent.changeText(getByTestId('register-password-input'),        'password123');
    fireEvent.changeText(getByTestId('register-confirm-password-input'),'beda123');

    await act(async () => {
      fireEvent.press(getByTestId('register-submit-button'));
    });

    expect(getByText('Kata sandi tidak cocok')).toBeTruthy();
  });

  it('register sukses → user di-set di store', async () => {
    const { getByTestId } = renderAuthNav('Register');
    fireEvent.changeText(getByTestId('register-carwash-input'),         'Outlet B');
    fireEvent.changeText(getByTestId('register-fullname-input'),        'Citra');
    fireEvent.changeText(getByTestId('register-email-input'),           'citra@kinclong.id');
    fireEvent.changeText(getByTestId('register-password-input'),        'password123');
    fireEvent.changeText(getByTestId('register-confirm-password-input'),'password123');

    await act(async () => {
      fireEvent.press(getByTestId('register-submit-button'));
    });

    await waitFor(() => {
      expect(useAuthStore.getState().user?.email).toBe('citra@kinclong.id');
      expect(useAuthStore.getState().user?.full_name).toBe('Citra');
    });
  });

  it('register dengan email yang sudah ada → error banner', async () => {
    const { getByTestId, findByTestId } = renderAuthNav('Register');
    fireEvent.changeText(getByTestId('register-carwash-input'),         'Dup');
    fireEvent.changeText(getByTestId('register-fullname-input'),        'Dup');
    fireEvent.changeText(getByTestId('register-email-input'),           'demo@kinclong.id'); // seeded
    fireEvent.changeText(getByTestId('register-password-input'),        'password123');
    fireEvent.changeText(getByTestId('register-confirm-password-input'),'password123');

    await act(async () => {
      fireEvent.press(getByTestId('register-submit-button'));
    });

    const banner = await findByTestId('register-error-banner');
    expect(banner).toBeTruthy();
  });
});
