import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../screens/tabs/HomeScreen.tsx';
import AddMedScreen from '../screens/tabs/AddMedScreen.tsx';
import TrackerScreen from '../screens/tabs/TrackerScreen.tsx';
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
          } else if (route.name === 'Tracker') {
            return <TrackerIcon width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add" component={AddMedScreen} />
        <Tab.Screen name="Tracker" component={TrackerScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabs;
