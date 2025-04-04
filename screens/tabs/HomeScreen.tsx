import React, { useContext, } from 'react';
import { View,Text, StyleSheet, } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Welcome to PillPop!</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7F1',
  },
  iconContainer: {
    marginRight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 12,
  },
});