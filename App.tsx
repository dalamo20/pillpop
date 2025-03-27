import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { AuthProvider } from './context/AuthContext';
import Toast from 'react-native-toast-message';

Toast.show({
  type: 'success',
  text1: 'Login successful',
});

Toast.show({
  type: 'error',
  text1: 'Login failed',
  text2: 'Please check your email and password',
});

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;