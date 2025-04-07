module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?(@react-native|react-native-svg|@react-native-google-signin|@react-navigation|@react-native-async-storage)/)',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.png$': '<rootDir>/__mocks__/fileMock.js',
    '@env': '<rootDir>/__mocks__/envMock.js',
  },
};