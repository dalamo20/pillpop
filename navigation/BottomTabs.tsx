import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../screens/tabs/HomeScreen.tsx';
import { NavigationContainer } from '@react-navigation/native';
import AddMedScreen from '../screens/tabs/AddMedScreen.tsx';
import ProfileScreen from '../screens/tabs/ProfileScreen.tsx';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <NavigationContainer>
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add" component={AddMedScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabs;
