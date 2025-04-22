import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Button, } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getFirestore, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from '../config/firebaseConfig';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PillStackParamList } from '../navigation/types';
import { cancelScheduledNotification, scheduleDailyNotification  } from '../utils/notifications';


const db = getFirestore(app);

type EditPillScreenProps = NativeStackScreenProps<PillStackParamList, 'EditPillScreen'>;

const EditPillScreen = ({ route, navigation }: EditPillScreenProps) => {
  const { pill } = route.params;

  const [pillName, setPillName] = useState(pill.pillName);
  const [dosageAmount, setDosageAmount] = useState(pill.dosageAmount?.toString() || '');
  const [unit, setUnit] = useState(pill.unit || '');
  const [reminderTimes, setReminderTimes] = useState<Date[]>(pill.reminderTimes?.map((t) => new Timestamp(t.seconds, 0).toDate()) || []);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState<number | null>(null);
  const [instructions, setInstructions] = useState(pill.instructions || '');
  const [expirationDate, setExpirationDate] = useState(pill.expirationDate || '');
  const [refillsLeft, setRefillsLeft] = useState(pill.refillsLeft?.toString() || '');
  const [withFood, setWithFood] = useState(pill.withFood || false);
  const [beforeMeal, setBeforeMeal] = useState(pill.beforeMeal || false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Edit Medication' });
  }, [navigation]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (showTimePickerIndex === null || selectedDate === undefined) return;
    const updatedTimes = [...reminderTimes];
    updatedTimes[showTimePickerIndex] = selectedDate;
    setReminderTimes(updatedTimes);
    setShowTimePickerIndex(null);
  };

  const handleAddReminder = () => {
    setReminderTimes([...reminderTimes, new Date()]);
  };

  const handleRemoveReminder = (index: number) => {
    const updatedTimes = [...reminderTimes];
    updatedTimes.splice(index, 1);
    setReminderTimes(updatedTimes);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'medications', pill.id), {
        pillName,
        dosageAmount: Number(dosageAmount),
        unit,
        reminderTimes: reminderTimes.map((d) => Timestamp.fromDate(d)),
        instructions,
        expirationDate,
        refillsLeft: Number(refillsLeft),
        withFood,
        beforeMeal,
        updatedAt: Timestamp.now(),
      });

      pill.reminderTimes?.forEach((_, index) => {
        cancelScheduledNotification(`${pill.id}-${index}`);
      });
  
      // Schedule new notifications
      reminderTimes.forEach((time, index) => {
        const now = new Date();
        const fireDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          time.getHours(),
          time.getMinutes(),
          0
        );
  
        if (fireDate < now) {
          fireDate.setDate(fireDate.getDate() + 1); // push to next day if time has passed
        }
  
        scheduleDailyNotification(
          `Time to take ${pillName}`,
          `Dosage: ${dosageAmount} ${unit}${withFood ? ' with food' : ''}`,
          fireDate,
          pill.id,
          index
        );
      });

      Alert.alert('Success', 'Medication updated!');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Could not update pill.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Pill Name</Text>
      <TextInput style={styles.input} value={pillName} onChangeText={setPillName} />

      <Text style={styles.label}>Dosage Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={dosageAmount}
        onChangeText={setDosageAmount}
      />

<Text style={styles.label}>Reminder Times</Text>
      {reminderTimes.map((time, index) => (
        <View key={index} style={styles.reminderRow}>
          <TouchableOpacity onPress={() => setShowTimePickerIndex(index)}>
            <Text style={styles.timeButton}>{formatTime(time)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveReminder(index)}>
            <Text style={styles.removeText}>❌</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Reminder Time" onPress={handleAddReminder} />

      {showTimePickerIndex !== null && (
        <DateTimePicker
          mode="time"
          value={reminderTimes[showTimePickerIndex] || new Date()}
          display={Platform.OS === 'android' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={styles.input}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="e.g. Take 30 minutes before meals"
      />

      <Text style={styles.label}>Expiration Date</Text>
      <TextInput
        style={styles.input}
        value={expirationDate}
        onChangeText={setExpirationDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Refills Left</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={refillsLeft}
        onChangeText={setRefillsLeft}
      />

      <View style={styles.checkboxRow}>
        <Text>Take with food</Text>
        <TouchableOpacity onPress={() => setWithFood(!withFood)}>
          <Text>{withFood ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxRow}>
        <Text>Take before meal</Text>
        <TouchableOpacity onPress={() => setBeforeMeal(!beforeMeal)}>
          <Text>{beforeMeal ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
};

export default EditPillScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7F1',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 6,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
  