// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    crypto: require.resolve('crypto-browserify'),
    net: require.resolve('react-native-tcp-socket'), // Brugte react-native-tcp-socket for net/tls
    tls: require.resolve('react-native-tcp-socket'), // Brugte react-native-tcp-socket for net/tls
    url: require.resolve('react-native-url-polyfill'),
    zlib: require.resolve('browserify-zlib'),
    util: require.resolve('util/'),
    assert: require.resolve('assert/'),
    querystring: require.resolve('qs'), // <-- VIGTIG LINJE
    path: require.resolve('path-browserify'),
    fs: false,
};

const sourceExts = config.resolver.sourceExts ?? [];
if (!sourceExts.includes('cjs')) {
  config.resolver.sourceExts = [...sourceExts, 'cjs'];
}

module.exports = config;