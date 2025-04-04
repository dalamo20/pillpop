import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../screens/tabs/HomeScreen.tsx';
import AddPillScreen from '../screens/tabs/AddPillScreen.tsx';
import PillCabinetScreen from '../screens/tabs/PillCabinetScreen.tsx';
import HomeIcon from '../assets/icons/homeIcon.svg';
import AddIcon from '../assets/icons/addIcon.svg';
import TrackerIcon from '../assets/icons/trackerIcon.svg';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size }) => {
          if (route.name === 'Home') {
            return <HomeIcon width={size} height={size} />;
          } else if (route.name === 'Add') {
            return <AddIcon width={size} height={size} />;
          } else if (route.name === 'PillCabinet') {
            return <TrackerIcon width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add" component={AddPillScreen} />
        <Tab.Screen name="PillCabinet" component={PillCabinetScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabs;
