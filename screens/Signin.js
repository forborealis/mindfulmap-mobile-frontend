import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import Toast from 'react-native-toast-message';
import { setUser } from '../redux/actions/authActions';

export default function Signin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { message, user, firebaseUid } = response.data;

      // Dispatch user to Redux store
      dispatch(setUser({
        _id: user._id,         
        email: user.email,
        name: user.name,         
        firebaseUid: user.firebaseUid
      }));

      Toast.show({
        type: 'success',
        text1: 'Logged in successfully!',
      });

      // Fetch mood logs for the current day
      const today = new Date().toISOString().split('T')[0];
      const moodLogsResponse = await axios.get(`${API_URL}/moodlogs?user=${user._id}&date=${today}`);
      const moodLogs = moodLogsResponse.data;

      // Check if there is an existing log for the current day
      if (moodLogs.length > 0) {
        navigation.navigate('Nav');
      } else {
        navigation.navigate('MoodLogs', { firebaseUid });
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 400) {
        Toast.show({
          type: 'error',
          text1: error.response.data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'An error occurred. Please try again.',
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('LandingPage')}>
        <Image source={require('../assets/logo.png')} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6fba94"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6fba94"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.newHereText}>New here?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}> Create an account.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef0ee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 10, 
  },
  title: {
    color: '#292f33',
    fontSize: 35,
    fontWeight: 'semibold',
    fontFamily: 'Nunito-Bold',
    marginBottom: 40, 
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#6fba94',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20, 
    backgroundColor: 'transparent',
    color: '#292f33',
    fontFamily: 'Nunito',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#6fba94',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20, 
  },
  newHereText: {
    color: '#292f33',
    fontSize: 16,
    fontFamily: 'Nunito',
  },
  signupText: {
    color: '#6fba94',
    fontSize: 16,
    fontFamily: 'Nunito',
  },
});