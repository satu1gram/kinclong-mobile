module.exports = function (api) {
  // Cache berdasarkan NODE_ENV agar Jest (test) dan dev mendapat config yang tepat
  api.cache(() => process.env.NODE_ENV);

  // Saat testing (Jest), tidak perlu NativeWind babel transform
  // karena tidak ada styles yang di-render di test environment
  const isTest = process.env.NODE_ENV === 'test';

  // Opsi untuk babel-preset-expo:
  // - jsxImportSource: 'nativewind' → wajib untuk NativeWind v4
  // - reanimated: false → matikan auto-load 'react-native-worklets/plugin'
  //   (project ini tidak pakai Reanimated; mencegah error "Cannot find module
  //   'react-native-worklets/plugin'" saat bundling iOS/Android)
  const expoPresetOptions = isTest
    ? { reanimated: false }
    : { jsxImportSource: 'nativewind', reanimated: false };

  return {
    presets: [
      ['babel-preset-expo', expoPresetOptions],
      ...(isTest ? [] : ['nativewind/babel']),
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@lib': './src/lib',
            '@store': './src/store',
            '@types': './src/types',
            '@i18n': './src/i18n',
            '@assets': './src/assets',
          },
        },
      ],
    ],
  };
};
