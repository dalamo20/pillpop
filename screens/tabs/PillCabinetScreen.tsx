import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../config/firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Medication } from '../../types';
import DateTimePicker, { Event as DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const db = getFirestore(app);

const PillCabinetScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'medications'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Medication[];
      setMedications(meds);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'medications', id));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Medication }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EditPillScreen', { pill: item })}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        <View style={styles.cardText}>
          <Text style={styles.pillName}>{item.pillName}</Text>
          <Text>{item.reminderTimes?.length ? new Date(item.reminderTimes[0].seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
          <Text>{item.beforeMeal ? 'Before meal' : item.withFood ? 'With food' : 'After meal'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={{ color: 'red' }}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello {user?.email?.split('@')[0]},</Text>
      <Text style={styles.subHeader}>There are <Text style={styles.bold}>{medications.length} pills</Text> in your cabinet</Text>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

export default PillCabinetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: '#eee',
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
  },
  pillName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
