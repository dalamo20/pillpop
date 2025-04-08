import React, { useContext, } from 'react';
import { View, Text, StyleSheet, ScrollView, } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      {/* Date/Time Section */}
      <View style={styles.section}>
        <Text style={styles.date}>Fri, Oct 15</Text>
        <Text style={styles.time}>08:29AM</Text>
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
          <View style={[styles.trackerBarProgress, { width: '90%' }]} />
        </View>
        <View style={styles.trackerTextRow}>
          <Text style={styles.trackerText}>7/8 pills taken</Text>
          <Text style={styles.trackerText}>90%</Text>
        </View>
      </View>
      <View style={styles.separator} />

      {/* Today Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Today</Text>
        <View style={styles.pillFilterRow}>
          <View style={styles.pillToTake}>
            <Text style={styles.pillLabel}>Pills to take</Text>
            <View style={styles.numberCircle}><Text style={styles.numberText}>1</Text></View>
          </View>
          <View style={styles.pillsTaken}>
            <Text style={styles.pillLabelBlack}>Pills have taken</Text>
            <View style={styles.numberCircle}><Text style={styles.numberText}>4</Text></View>
          </View>
        </View>

        <View style={styles.pillCard}>
          <View style={styles.pillImagePlaceholder} />
          <View>
            <Text style={styles.pillName}>Claritin</Text>
            <Text>09:00AM • 1 pill</Text>
          </View>
        </View>
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
  numberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  pillCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
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
});