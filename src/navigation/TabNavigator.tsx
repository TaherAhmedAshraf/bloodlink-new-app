import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

// Import screens
import HomeScreen from '../screens/home/HomeScreen';
import CreateRequestScreen from '../screens/home/CreateRequestScreen';
import ChatScreen from '../screens/home/ChatScreen';
import BloodBankScreen from '../screens/home/bloodbank/index';
import ProfileScreen from '../screens/home/ProfileScreen';

// Import icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

// Wrapper for ChatScreen to handle props
const ChatScreenWrapper = (props: any) => {
  return <ChatScreen {...props} route={{ params: {}, key: '', name: '' }} />;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateRequestScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AI Chat"
        component={ChatScreenWrapper}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Blood Banks"
        component={BloodBankScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="hospital-building" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 