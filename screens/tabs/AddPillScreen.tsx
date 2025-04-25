import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Platform, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/AuthContext';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Toast from 'react-native-toast-message';
import { app } from '../../config/firebaseConfig';

const db = getFirestore(app);
const functions = getFunctions(app);

const AddPillScreen = () => {
  const { user } = useContext(AuthContext);
  const [pillName, setPillName] = useState('');
  const [dosageAmount, setDosageAmount] = useState('');
  const [unit, setUnit] = useState<'pill' | 'mL'>('pill');
  const [reminderTimes, setReminderTimes] = useState<Date[]>([]);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState<number | null>(null);
  const [whenToTake, setWhenToTake] = useState<'beforeMeal' | 'withFood' | 'afterMeal' | ''>('');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [refillsLeft, setRefillsLeft] = useState('');
  const [instructions, setInstructions] = useState('');

  const toggleDay = (day: string) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddReminderTime = () => {
    setReminderTimes([...reminderTimes, new Date()]);
    setShowTimePickerIndex(reminderTimes.length);
  };

  const handleRemoveReminderTime = (index: number) => {
    const updatedTimes = [...reminderTimes];
    updatedTimes.splice(index, 1);
    setReminderTimes(updatedTimes);
  };

  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (showTimePickerIndex === null || selectedDate === undefined) return;
    const updatedTimes = [...reminderTimes];
    updatedTimes[showTimePickerIndex] = selectedDate;
    setReminderTimes(updatedTimes);
    setShowTimePickerIndex(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAutoFill = async () => {
    if (!pillName) {
      Toast.show({ type: 'error', text1: 'Missing Info', text2: 'Please enter a pill name first.' });
      return;
    }

    try {
      const generatePillInfo = httpsCallable(functions, 'generatePillInfo');
      const response = await generatePillInfo({ pillName });
      const data = response.data as { result: string };
      const lines = data.result?.split('\n').map((l) => l.trim()).filter(Boolean) ?? [];

      let dosage = '';
      let instructionText = '';
      let frequency = '';

      lines.forEach((line) => {
        if (/dosage/i.test(line)) dosage = line.split(':')[1]?.trim() ?? '';
        else if (/instructions?/i.test(line)) instructionText = line.split(':')[1]?.trim() ?? '';
        else if (/frequency/i.test(line)) frequency = line.split(':')[1]?.trim() ?? '';
      });

      if (dosage) setDosageAmount(dosage.replace(/[^\d.]/g, ''));
      if (instructionText) setInstructions(instructionText);
      if (frequency?.toLowerCase().includes('meal')) {
        if (frequency.includes('before')) setWhenToTake('beforeMeal');
        else if (frequency.includes('with')) setWhenToTake('withFood');
        else if (frequency.includes('after')) setWhenToTake('afterMeal');
      }

      Toast.show({ type: 'success', text1: 'Autofill Complete', text2: 'Fields populated using AI.' });
    } catch (error) {
      console.error('Autofill error:', error);
      Toast.show({ type: 'error', text1: 'Autofill Failed', text2: 'Unable to retrieve pill data.' });
    }
  };

  const handleSave = async () => {
    if (!pillName || !dosageAmount || !reminderTimes.length || !daysOfWeek.length) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please complete all required fields.' });
      return;
    }

    const newMed = {
      userId: user?.uid,
      pillName,
      dosageAmount: Number(dosageAmount),
      unit,
      reminderTimes: reminderTimes.map((d) => Timestamp.fromDate(d)),
      whenToTake,
      daysOfWeek,
      expirationDate,
      refillsLeft: Number(refillsLeft),
      instructions,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, 'medications'), newMed);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Medication saved!' });

      setPillName('');
      setDosageAmount('');
      setUnit('pill');
      setReminderTimes([]);
      setDaysOfWeek([]);
      setWhenToTake('');
      setExpirationDate('');
      setRefillsLeft('');
      setInstructions('');
    } catch (error) {
      console.error('Error saving medication:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save medication.' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pill Name *</Text>
      <TextInput style={styles.input} value={pillName} onChangeText={setPillName} />
      <Button title="✨ Autofill Info" onPress={handleAutoFill} />

      <Text style={styles.label}>Dosage Amount *</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={dosageAmount} onChangeText={setDosageAmount} />

      <Text style={styles.label}>Unit</Text>
      <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
        <Picker.Item label="Pill(s)" value="pill" />
        <Picker.Item label="mL" value="mL" />
      </Picker>

      <Text style={styles.label}>When to Take</Text>
      <View style={styles.checkboxRow}>
        {['beforeMeal', 'withFood', 'afterMeal'].map((option) => (
          <TouchableOpacity key={option} onPress={() => setWhenToTake(option as typeof whenToTake)} style={styles.radioOption}>
            <Text>{whenToTake === option ? '🔘' : '⚪'} {option.replace(/([A-Z])/g, ' $1')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Days to Take *</Text>
      <View style={styles.checkboxRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <TouchableOpacity key={day} onPress={() => toggleDay(day)}>
            <Text style={daysOfWeek.includes(day) ? styles.daySelected : styles.day}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Reminder Times *</Text>
      {reminderTimes.map((time, index) => (
        <View key={index} style={styles.reminderItem}>
          <TouchableOpacity onPress={() => setShowTimePickerIndex(index)}>
            <Text style={styles.input}>{formatTime(time)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveReminderTime(index)}>
            <Text style={{ color: 'red', marginLeft: 10 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Add Reminder Time" onPress={handleAddReminderTime} />

      {showTimePickerIndex !== null && (
        <DateTimePicker
          mode="time"
          value={reminderTimes[showTimePickerIndex] || new Date()}
          display={Platform.OS === 'android' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)}>
        <Text style={styles.toggle}>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</Text>
      </TouchableOpacity>

      {showAdvanced && (
        <>
          <Text style={styles.label}>Expiration Date</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={expirationDate} onChangeText={setExpirationDate} />

          <Text style={styles.label}>Refills Left</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={refillsLeft} onChangeText={setRefillsLeft} />

          <Text style={styles.label}>Instructions</Text>
          <TextInput style={styles.input} placeholder="e.g. Take with water" value={instructions} onChangeText={setInstructions} />
        </>
      )}

      <Button title="Save Medication" onPress={handleSave} />
    </ScrollView>
  );
};

export default AddPillScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF7F1',
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
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  radioOption: {
    marginRight: 16,
  },
  toggle: {
    color: '#007AFF',
    marginTop: 20,
    textAlign: 'center',
  },
  day: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  daySelected: {
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
    color: 'white',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
});
