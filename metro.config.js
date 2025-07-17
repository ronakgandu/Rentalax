const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure these modules are resolved properly
config.resolver.alias = {
  '@': __dirname,
};

config.resolver.platforms = ['native', 'ios', 'android', 'web'];

module.exports = config;