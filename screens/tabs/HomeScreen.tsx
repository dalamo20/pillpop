import React, { useContext, useEffect, useState, } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getFirestore, collection, query, where, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../config/firebaseConfig';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import uuid from 'react-native-uuid';

const db = getFirestore(app);

const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [pillsToTake, setPillsToTake] = useState(0);
  const [pillsTaken, setPillsTaken] = useState(0);
  const [pillCards, setPillCards] = useState<any[]>([]);
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString(undefined, options));
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'medications'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let toTake = 0;
      let taken = 0;
      const pillList: any[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const times = data.reminderTimes || [];
        const daysOfWeek = data.daysOfWeek || [];
        const completions = data.completions || {};

        if (daysOfWeek.includes(todayDay)) {
          times.forEach((t: any, i: number) => {
            const dateObj = new Timestamp(t.seconds, 0).toDate();
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const pillId = `${docSnap.id}_${i}`;
            const completed = completions[pillId] || false;

            pillList.push({
              docId: docSnap.id,
              pillId,
              name: data.pillName,
              time: timeStr,
              whenToTake: data.whenToTake,
              dosage: `${data.dosageAmount || 1} ${data.unit || 'pill'}`,
              imageUrl: data.imageUrl,
              completed,
              index: i,
            });

            if (completed) taken++;
            else toTake++;
          });
        }
      });

      setPillsToTake(toTake);
      setPillsTaken(taken);
      setPillCards(pillList);
    });

    return () => unsubscribe();
  }, [user, todayDay]);

  const handleToggleComplete = async (docId: string, pillId: string, completed: boolean) => {
    try {
      const medicationRef = doc(db, 'medications', docId);
      await updateDoc(medicationRef, {
        [`completions.${pillId}`]: !completed,
      });
    } catch (error) {
      console.error('Error updating pill completion:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Date/Time Section */}
      <View style={styles.section}>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.time}>{currentTime}</Text>
      </View>
      <View style={styles.separator} />

      {/* Your Week Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Your week</Text>
        <View style={styles.weekContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.dayCircle} />
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.separator} />

      {/* Pill Tracker Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Pill tracker</Text>
        <View style={styles.trackerBarBackground}>
          <View style={[styles.trackerBarProgress, { width: `${(pillsTaken / (pillsToTake + pillsTaken)) * 100 || 0}%` }]} />
        </View>
        <View style={styles.trackerTextRow}>
          <Text style={styles.trackerText}>{pillsTaken}/{pillsToTake + pillsTaken} pills taken</Text>
          <Text style={styles.trackerText}>{((pillsTaken / (pillsToTake + pillsTaken)) * 100 || 0).toFixed(0)}%</Text>
        </View>
      </View>
      <View style={styles.separator} />

      {/* Today Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Today</Text>
        <View style={styles.pillFilterRow}>
          <View style={styles.pillToTake}>
            <Text style={styles.pillLabel}>Pills to take</Text>
            <View style={styles.numberCircle1}><Text style={styles.numberText1}>{pillsToTake}</Text></View>
          </View>
          <View style={styles.pillsTaken}>
            <Text style={styles.pillLabelBlack}>Pills have taken</Text>
            <View style={styles.numberCircle2}><Text style={styles.numberText2}>{pillsTaken}</Text></View>
          </View>
        </View>

        {pillCards.map((pill, index) => (
          <TouchableOpacity key={index} style={styles.pillCard} onPress={() => handleToggleComplete(pill.docId, pill.pillId, pill.completed)}>
            {pill.imageUrl ? (
              <Image source={{ uri: pill.imageUrl }} style={styles.pillImagePlaceholder} />
            ) : (
              <View style={styles.pillImagePlaceholder} />
            )}
            <View style={styles.pillDetails}>
              <View style={styles.pillHeaderRow}>
                <BouncyCheckbox
                  isChecked={pill.completed}
                  useBuiltInState={false}
                  size={18}
                  fillColor={pill.completed ? '#4CAF50' : '#fff'}
                  unFillColor={pill.completed ? '#4CAF50' : '#fff'}
                  iconStyle={{ borderColor: pill.completed ? '#4CAF50' : '#000', borderWidth: 2 }}
                  innerIconStyle={{ borderWidth: 2 }}
                  onPress={() => handleToggleComplete(pill.docId, pill.pillId, pill.completed)}
                />
                <Text style={styles.pillName}>{pill.name}</Text>
              </View>
              <Text>{pill.time} • {pill.dosage}</Text>
              <Text>{pill.whenToTake || ''}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7F1',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  date: {
    fontSize: 24,
    fontWeight: '600',
  },
  time: {
    fontSize: 18,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 12,
  },
  trackerBarBackground: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  trackerBarProgress: {
    height: 8,
    backgroundColor: '#DDF85A',
  },
  trackerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackerText: {
    fontSize: 12,
    color: '#444',
  },
  pillFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pillToTake: {
    backgroundColor: '#252525',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillsTaken: {
    backgroundColor: '#FFFFFD',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  pillLabel: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 6,
  },
  pillLabelBlack: {
    color: '#000',
    fontWeight: '500',
    marginRight: 6,
  },
  numberCircle1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberCircle2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText1: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  numberText2: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  pillCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  pillImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginRight: 12,
  },
  pillName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pillDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  pillHeaderRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
});