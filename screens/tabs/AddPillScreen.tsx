import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/AuthContext';

const AddPillScreen = () => {
  const { user } = useContext(AuthContext);
  const [pillName, setPillName] = useState('');
  const [dosageAmount, setDosageAmount] = useState('');
  const [unit, setUnit] = useState<'pill' | 'mL'>('pill');
  const [reminderTimes, setReminderTimes] = useState<Date[]>([]);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState<number | null>(null);
  const [instructions, setInstructions] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [refillsLeft, setRefillsLeft] = useState('');
  const [withFood, setWithFood] = useState(false);
  const [beforeMeal, setBeforeMeal] = useState(false);
  const [frequency, setFrequency] = useState('');

  const handleAddReminderTime = () => {
    setReminderTimes([...reminderTimes, new Date()]);
    setShowTimePickerIndex(reminderTimes.length);
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

  const handleSave = async () => {
    if (!pillName || !dosageAmount) return;

    const newMed = {
      userId: user?.uid,
      pillName,
      dosageAmount: Number(dosageAmount),
      unit,
      reminderTimes: reminderTimes.map((d) => d.toISOString()),
      frequency,
      instructions,
      expirationDate,
      refillsLeft: Number(refillsLeft),
      withFood,
      beforeMeal,
      createdAt: new Date().toISOString(),
    };

    // TODO: Save to Firestore
    console.log('Saving med:', newMed);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pill Name</Text>
      <TextInput style={styles.input} value={pillName} onChangeText={setPillName} />

      <Text style={styles.label}>Dosage Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={dosageAmount}
        onChangeText={setDosageAmount}
      />

      <Text style={styles.label}>Unit</Text>
      <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
        <Picker.Item label="Pill(s)" value="pill" />
        <Picker.Item label="mL" value="mL" />
      </Picker>

      <Text style={styles.label}>Reminder Times</Text>
      {reminderTimes.map((time, index) => (
        <TouchableOpacity key={index} onPress={() => setShowTimePickerIndex(index)}>
          <Text style={styles.input}>{formatTime(time)}</Text>
        </TouchableOpacity>
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

      <Text style={styles.label}>Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2x per day"
        value={frequency}
        onChangeText={setFrequency}
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Take 30 min before meals"
        value={instructions}
        onChangeText={setInstructions}
      />

      <Text style={styles.label}>Expiration Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={expirationDate}
        onChangeText={setExpirationDate}
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

      <Button title="Save Medication" onPress={handleSave} />
    </ScrollView>
  );
}

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
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
});