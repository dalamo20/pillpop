const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    blacklistRE: exclusionList([]),
    blockList: exclusionList([]),
    assetExts: defaultConfig.resolver.assetExts,
    sourceExts: defaultConfig.resolver.sourceExts,
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
});
