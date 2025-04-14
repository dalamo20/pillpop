module.exports = {
    preset: 'ts-jest', // or 'babel-jest' if you don't use ts-jest
    testEnvironment: 'node',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // or 'babel-jest'
    },
  };
  