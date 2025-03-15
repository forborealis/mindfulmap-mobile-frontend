import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LandingPage from '../screens/LandingPage';
import Signin from '../screens/Signin';
import Signup from '../screens/Signup';
import AboutUs from '../screens/AboutUs';
import MoodLogs from '../screens/user/MoodLogs';
import ActivityLogs from '../screens/user/ActivityLogs';
import MoodEntries from '../screens/user/MoodEntries';
import Calendar from '../screens/user/Calendar';
import Correlation from '../screens/user/Correlation';
import Prediction from '../screens/user/Prediction';
import WeeklyPrediction from '../screens/user/WeeklyPrediction';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ headerShown: false }}
        />
      <Stack.Screen
          name="MoodLogs"
          component={MoodLogs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActivityLogs"
          component={ActivityLogs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeeklyPrediction"
          component={WeeklyPrediction}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Nav"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
  </Stack.Navigator>
    </NavigationContainer>
  );
  
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Entries') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }  else if (route.name === 'Correlation') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }  else if (route.name === 'Prediction') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'SignOut') {
            iconName = 'log-out-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4ecca3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          height: 60,
        }
      })}
    >
      <Tab.Screen name="Entries" component={MoodEntries} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Correlation" component={Correlation} />
      <Tab.Screen name="Prediction" component={WeeklyPrediction} /><Tab.Screen
        name="SignOut"
        component={() => null} // Empty screen since we only handle navigation
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent navigation
            navigation.navigate('Signin'); 
          },
        })}
        options={{
          tabBarLabel: 'Sign Out',
        }}
      />
    </Tab.Navigator>
  );
}
}