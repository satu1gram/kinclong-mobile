import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage — wajib agar authService persist tidak crash di JSDOM
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock URL polyfill (tidak diperlukan di environment test)
jest.mock('react-native-url-polyfill/auto', () => {});

// Silence "useNativeDriver" warning dari React Native Animated di test
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});
