import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { AuthProvider } from './context/AuthContext';
import Toast from 'react-native-toast-message';
import { Notifications } from 'react-native-notifications';
import { Platform, PermissionsAndroid } from 'react-native';
import { scheduleRemindersForAllPills } from './utils/PillReminderService';

const App = () => {
  Notifications.removeAllDeliveredNotifications();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    Toast.show({ type: 'success', text1: 'Login successful' });
    Toast.show({ type: 'error', text1: 'Login failed', text2: 'Please check your email and password' });

    Notifications.registerRemoteNotifications();

    // Notification channel for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannel({
        channelId: 'default',
        name: 'Default Channel',
        importance: 5,
        description: 'Used for pill reminders',
        enableVibration: true,
        sound: 'default',
      });
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        .then((result) => {
          console.log(result === PermissionsAndroid.RESULTS.GRANTED
            ? 'Notification permission granted.'
            : 'Notification permission denied.');
        });
    }

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('Notification tapped:', notification.payload);
      if (notification.payload?.screen === 'Home') {
        navigationRef.navigate('Home'); // Navigate to the Home screen when notification pushed
      }
      completion();
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Foreground notification:', notification.payload);
      completion({ alert: true, sound: true, badge: false });
    });

    scheduleRemindersForAllPills();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;