import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BottomNav({ navigation }) {
  const handleSignOut = () => {
    // Add sign out logic here
    navigation.navigate('Signin');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MoodEntries')}>
        <Icon name="mood" size={30} color="#64aa86" />
        <Text style={styles.navText}>MoodEntries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={handleSignOut}>
        <Icon name="logout" size={30} color="#64aa86" />
        <Text style={styles.navText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#000',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Nunito-Bold',
  },
});