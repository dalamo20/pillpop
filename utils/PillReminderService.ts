import { getFirestore, collection, getDocs, Timestamp } from 'firebase/firestore';
import { app } from '../config/firebaseConfig';
import { scheduleDailyNotification } from './notifications';

const db = getFirestore(app);

export const scheduleRemindersForAllPills = async () => {
  const querySnapshot = await getDocs(collection(db, 'medications'));
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.reminderTimes || !data.daysOfWeek) return;

    const shouldRemindToday = data.daysOfWeek.includes(todayDay);
    if (!shouldRemindToday) return;

    data.reminderTimes.forEach((timestamp: Timestamp, index: number) => {
      const date = timestamp.toDate();
      const now = new Date();
      const fireDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), date.getHours(), date.getMinutes(), 0);

      // If time already passed today, don't fire again until tomorrow
      if (fireDate < now) {
        fireDate.setDate(fireDate.getDate() + 1);
      }
      scheduleDailyNotification(
        'Pill Reminder',
        `Take ${data.pillName} at ${fireDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        fireDate,
        docSnap.id,
        index
      );
    });
  });
};
