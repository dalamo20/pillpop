import React from 'react';
import { View, Button, Alert } from 'react-native';
import { Notifications } from 'react-native-notifications';

const TestNotificationTrigger = () => {
  const triggerNotification = () => {
    const now = new Date();
    const fireDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() + 1,
      0
    );

    Notifications.postLocalNotification({
      title: '⏰ Test Reminder',
      body: 'This is a test notification set 1 minute from now.',
      fireDate: fireDate.toISOString(), // doesn't affect postLocalNotification, but left for future scheduling logic
      userInfo: {
        screen: 'Home',
        test: true,
      },
      android: {
        channelId: 'default',
      },
    });

    Alert.alert('Scheduled', `Test notification should show now.`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="📣 Schedule 1-Minute Test Notification" onPress={triggerNotification} />
    </View>
  );
};

export default TestNotificationTrigger;
