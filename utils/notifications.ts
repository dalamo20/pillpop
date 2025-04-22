import { Notifications } from 'react-native-notifications';

export const scheduleDailyNotification = (
  title: string,
  body: string,
  date: Date,
  pillId: string,
  index: number
) => {
  Notifications.postLocalNotification({
    title,
    body,
    fireDate: date.toISOString(),
    userInfo: {
      screen: 'Home',
      pillId,
      index,
    },
  });
};

export const cancelScheduledNotification = (id: string) => {
  Notifications.cancelLocalNotification(id); 
};
