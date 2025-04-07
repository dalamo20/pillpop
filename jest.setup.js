jest.mock('react-native/Libraries/Animated/NativeAnimatedModule', () => ({
    __esModule: true,
    default: {},
  }));

  jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSignin: {
      configure: jest.fn(),
      hasPlayServices: jest.fn().mockResolvedValue(true),
      signIn: jest.fn().mockResolvedValue({ idToken: 'test-id-token' }),
    },
    statusCodes: {},
  }));
  