import React from 'react';
import { View } from 'react-native';
import AddIcon from '../assets/icons/addIcon.svg'; 

const TestIconScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AddIcon width={100} height={100} fill="blue" />
    </View>
  );
};

export default TestIconScreen;
