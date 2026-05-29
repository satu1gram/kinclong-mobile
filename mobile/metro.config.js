const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * metro.config.js - Metro bundler configuration
 *
 * Mengaktifkan NativeWind v4 dengan CSS processing.
 * File global.css di-process oleh Tailwind CLI melalui Metro.
 */

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
