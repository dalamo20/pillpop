import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../screens/tabs/HomeScreen.tsx';
import AddPillScreen from '../screens/tabs/AddPillScreen.tsx';
import PillCabinetScreen from '../screens/tabs/PillCabinetScreen.tsx';
import HomeIcon from '../assets/icons/homeIcon.svg';
import AddIcon from '../assets/icons/addIcon.svg';
import TrackerIcon from '../assets/icons/trackerIcon.svg';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditPillScreen from '../screens/EditPillScreen.tsx';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PillStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PillCabinetScreen" component={PillCabinetScreen} options={{ title: 'Pill Cabinet' }} />
      <Stack.Screen name="EditPillScreen" component={EditPillScreen} options={{ title: 'Edit Pill' }} />
    </Stack.Navigator>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size }) => {
          if (route.name === 'Home') {
            return <HomeIcon width={size} height={size} />;
          } else if (route.name === 'Add Medication') {
            return <AddIcon width={size} height={size} />;
          } else if (route.name === 'Pill Cabinet') {
            return <TrackerIcon width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add Medication" component={AddPillScreen} />
        <Tab.Screen name="Pill Cabinet" component={PillStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default BottomTabs;
