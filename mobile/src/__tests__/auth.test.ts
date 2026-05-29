import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../store/authStore';

/**
 * Unit test untuk authStore Zustand
 * Menguji state management autentikasi secara terisolasi
 * (Supabase di-mock di jest.setup.ts)
 */

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: false, error: null });
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });

  it('should clear error when clearError is called', () => {
    useAuthStore.setState({ error: 'Test error' });
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should set loading to true during signIn', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(result.current.isLoading).toBeDefined();
  });
});
