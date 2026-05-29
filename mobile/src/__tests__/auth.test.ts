import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../store/authStore';
import { authService } from '../lib/authService';

/**
 * Integration test untuk authStore + mock authService (Phase 3)
 *
 * Verifikasi alur:
 * - signIn sukses → user di-set
 * - signIn gagal  → error di-set
 * - signUp baru   → auto login (mock auto-confirm)
 * - signOut       → user = null
 * - Google OAuth  → user di-set
 */
describe('authStore + mock authService (Phase 3)', () => {
  beforeEach(async () => {
    await authService.__test__.reset();
    useAuthStore.setState({
      user:                   null,
      isLoading:              false,
      isInitialized:          false,
      error:                  null,
      needsEmailVerification: false,
    });
  });

  it('initial state correct', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('initializeAuth → isInitialized = true', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });
    expect(result.current.isInitialized).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('signIn dengan kredensial benar → user di-set', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });

    await act(async () => {
      await result.current.signIn('demo@kinclong.id', 'password123');
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('demo@kinclong.id');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('signIn dengan kredensial salah → error di-set, user tetap null', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });

    await act(async () => {
      await result.current.signIn('demo@kinclong.id', 'wrongpass');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/salah/i);
  });

  it('clearError menghapus error', async () => {
    const { result } = renderHook(() => useAuthStore());
    useAuthStore.setState({ error: 'Some error' });
    act(() => { result.current.clearError(); });
    expect(result.current.error).toBeNull();
  });

  it('signUp dengan email baru → auto login', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });

    await act(async () => {
      await result.current.signUp({
        email:       'baru@kinclong.id',
        password:    'password123',
        fullName:    'User Baru',
        carwashName: 'Outlet Baru',
      });
    });

    expect(result.current.user?.email).toBe('baru@kinclong.id');
    expect(result.current.user?.full_name).toBe('User Baru');
    expect(result.current.error).toBeNull();
  });

  it('signUp dengan email yang sudah terdaftar → error', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });

    await act(async () => {
      await result.current.signUp({
        email:       'demo@kinclong.id', // seeded
        password:    'password123',
        fullName:    'Duplicate',
        carwashName: 'X',
      });
    });

    expect(result.current.error).toMatch(/sudah terdaftar/i);
  });

  it('signOut menghapus user', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });

    await act(async () => {
      await result.current.signIn('demo@kinclong.id', 'password123');
    });
    expect(result.current.user).not.toBeNull();

    await act(async () => { await result.current.signOut(); });
    expect(result.current.user).toBeNull();
  });

  it('signInWithGoogle → user di-set otomatis', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.initializeAuth(); });

    await act(async () => { await result.current.signInWithGoogle(); });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toContain('@');
    expect(result.current.error).toBeNull();
  });

  it('resetPassword dengan email valid → return true', async () => {
    const { result } = renderHook(() => useAuthStore());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.resetPassword('demo@kinclong.id');
    });
    expect(success).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
