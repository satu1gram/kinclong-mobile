module.exports = function (api) {
  // Cache berdasarkan NODE_ENV agar Jest (test) dan dev mendapat config yang tepat
  api.cache(() => process.env.NODE_ENV);

  // Saat testing (Jest), tidak perlu NativeWind babel transform
  // karena tidak ada styles yang di-render di test environment
  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: [
      isTest
        ? 'babel-preset-expo'
        : ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
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
