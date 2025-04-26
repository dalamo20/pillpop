import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Platform, ActivityIndicator, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/AuthContext';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Toast from 'react-native-toast-message';
import { app } from '../../config/firebaseConfig';

const db = getFirestore(app);
const functions = getFunctions(app);

const parseDaysFromString = (line: string): string[] => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days.filter(day => line.toLowerCase().includes(day));
};

const parseTimesFromString = (line: string): Date[] => {
  const times: Date[] = [];
  const matches = line.match(/\b\d{1,2}(:\d{2})?\s*(am|pm)?\b/gi) ?? [];

  matches.forEach(timeStr => {
    let [hour, minute = '00'] = timeStr.replace(/(am|pm)/i, '').trim().split(':');
    let hourNum = parseInt(hour);
    const isPM = /pm/i.test(timeStr);
    if (isPM && hourNum < 12) hourNum += 12;
    if (!isPM && hourNum === 12) hourNum = 0;

    const now = new Date();
    now.setHours(hourNum, parseInt(minute), 0, 0);
    times.push(new Date(now));
  });
  return times;
};

const parseWhenToTake = (line: string): 'beforeMeal' | 'withFood' | 'afterMeal' | '' => {
  const lower = line.toLowerCase();
  if (lower.includes('before')) return 'beforeMeal';
  if (lower.includes('with')) return 'withFood';
  if (lower.includes('after')) return 'afterMeal';
  return '';
};

const unitFromString = (line: string): 'pill' | 'mL' | 'gram' | 'cream' => {
  const lower = line.toLowerCase();
  if (lower.includes('ml')) return 'mL';
  if (lower.includes('gram')) return 'gram';
  if (lower.includes('cream') || lower.includes('ointment') || lower.includes('gel')) return 'cream';
  if (lower.includes('pill') || lower.includes('tablet') || lower.includes('capsule')) return 'pill';
  return 'pill';
};

const AddPillScreen = () => {
  const { user } = useContext(AuthContext);
  const [pillName, setPillName] = useState('');
  const [dosageAmount, setDosageAmount] = useState('');
  const [unit, setUnit] = useState<'pill' | 'mL' | 'gram' | 'cream'>('pill');
  const [reminderTimes, setReminderTimes] = useState<Date[]>([]);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState<number | null>(null);
  const [whenToTake, setWhenToTake] = useState<'beforeMeal' | 'withFood' | 'afterMeal' | ''>('');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [refillsLeft, setRefillsLeft] = useState('');
  const [instructions, setInstructions] = useState('');
  const [form, setForm] = useState('');
  const [condition, setCondition] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [timePreference, setTimePreference] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleDay = (day: string) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimePref = (pref: string) => {
    setTimePreference((prev) => {
      const prefs = prev.split(',').map(p => p.trim()).filter(Boolean);
      return prefs.includes(pref)
        ? prefs.filter(p => p !== pref).join(', ')
        : [...prefs, pref].join(', ');
    });
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
      const response = await generatePillInfo({ pillName, form, condition, ageGroup, timePreference });
      const data = response.data as { result: string };
      const lines = data.result?.split('\n').map(l => l.trim()).filter(Boolean) ?? [];

      lines.forEach((line) => {
        if (/^dosage:/i.test(line)) {
          const match = line.split(':')[1]?.trim().match(/[\d.]+/);
          if (match) setDosageAmount(match[0]);
        }
        else if (/^unit:/i.test(line)) setUnit(unitFromString(line));
        else if (/^instructions:/i.test(line)) setInstructions(line.split(':')[1]?.trim() ?? '');
        else if (/^whentotake:/i.test(line)) setWhenToTake(parseWhenToTake(line));
        else if (/^daystotake:/i.test(line)) setDaysOfWeek(parseDaysFromString(line));
        else if (/^remindertimes:/i.test(line)) setReminderTimes(parseTimesFromString(line));
      });

      Toast.show({ type: 'success', text1: 'Autofill Complete', text2: 'Fields populated using AI.' });
    } catch (error) {
      console.error('Autofill error:', error);
      Toast.show({ type: 'error', text1: 'Autofill Failed', text2: 'Unable to retrieve pill data.' });
    } finally {
      setIsLoading(false);
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
      form,
      condition,
      ageGroup,
      timePreference,
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
      setForm('');
      setCondition('');
      setAgeGroup('');
      setTimePreference('');
    } catch (error) {
      console.error('Error saving medication:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save medication.' });
    }
    return null
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Medication Name *</Text>
      <TextInput style={styles.input} value={pillName} onChangeText={setPillName} />

      <Text style={styles.label}>Form</Text>
      <TextInput style={styles.input} placeholder="e.g. pill, cream, injection" value={form} onChangeText={setForm} />

      <Text style={styles.label}>Condition</Text>
      <TextInput style={styles.input} placeholder="e.g. eczema, headache" value={condition} onChangeText={setCondition} />

      <Text style={styles.label}>Age Group</Text>
      <TextInput style={styles.input} placeholder="e.g. child, adult, senior" value={ageGroup} onChangeText={setAgeGroup} />

      <Text style={styles.label}>Time Preference</Text>
        <View style={styles.checkboxRow}>
          {['morning', 'afternoon', 'evening', 'night'].map((pref) => (
            <TouchableOpacity key={pref} onPress={() => toggleTimePref(pref)}>
              <Text style={timePreference.includes(pref) ? styles.daySelected : styles.day}>
                {pref.charAt(0).toUpperCase() + pref.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.autofillButton, isLoading && { backgroundColor: '#ccc' }]}
          onPress={handleAutoFill}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.autofillButtonText}>✨ Autofill Info</Text>
          )}
        </TouchableOpacity>

      <Text style={styles.label}>Dosage Amount *</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={dosageAmount} onChangeText={setDosageAmount} />

      <Text style={styles.label}>Unit</Text>
      <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
        <Picker.Item label="Pill(s)" value="pill" />
        <Picker.Item label="mL" value="mL" />
        <Picker.Item label="Gram(s)" value="gram" />
        <Picker.Item label="Ointment / Cream (Apply)" value="cream" />
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
  autofillButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  autofillButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
