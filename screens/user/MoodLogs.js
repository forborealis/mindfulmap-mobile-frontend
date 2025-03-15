import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { selectMood } from '../../redux/actions/moodActions';

export default function MoodLogs({ navigation, route }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const dispatch = useDispatch();

  const dateToUse = route.params?.selectedDate || new Date();

  const handleLogout = () => {
    navigation.navigate('Signin');
  };

  const handleNext = () => {
    if (selectedMood) {
      dispatch(selectMood(selectedMood));
      navigation.navigate('ActivityLogs', { selectedDate: dateToUse });
    } else {
      alert('Please select your mood before continuing');
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const formattedDate = dateToUse.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={30} color="#292f33" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>
            {dateToUse.toDateString() === new Date().toDateString() 
              ? `Today, ${formattedDate}` 
              : formattedDate}
          </Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
        <View style={styles.moodContainer}>
          <View style={styles.moodRow}>
            <TouchableOpacity 
              style={[styles.moodItem, selectedMood === 'Relaxed' && styles.selectedMood]} 
              onPress={() => handleMoodSelect('Relaxed')}
            >
              <Image source={require('../../assets/relaxed.gif')} style={styles.moodIcon} />
              <Text style={styles.moodText}>Relaxed</Text>
              {selectedMood === 'Relaxed' && (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={40} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.moodItem, selectedMood === 'Happy' && styles.selectedMood]} 
              onPress={() => handleMoodSelect('Happy')}
            >
              <Image source={require('../../assets/happy.gif')} style={styles.moodIcon} />
              <Text style={styles.moodText}>Happy</Text>
              {selectedMood === 'Happy' && (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={40} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.moodItem, selectedMood === 'Fine' && styles.selectedMood]} 
              onPress={() => handleMoodSelect('Fine')}
            >
              <Image source={require('../../assets/fine.gif')} style={styles.moodIcon} />
              <Text style={styles.moodText}>Fine</Text>
              {selectedMood === 'Fine' && (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={40} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.moodRow}>
            <TouchableOpacity 
              style={[styles.moodItem, selectedMood === 'Anxious' && styles.selectedMood]} 
              onPress={() => handleMoodSelect('Anxious')}
            >
              <Image source={require('../../assets/anxious.gif')} style={styles.moodIcon} />
              <Text style={styles.moodText}>Anxious</Text>
              {selectedMood === 'Anxious' && (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={40} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.moodItem, selectedMood === 'Sad' && styles.selectedMood]} 
              onPress={() => handleMoodSelect('Sad')}
            >
              <Image source={require('../../assets/sad.gif')} style={styles.moodIcon} />
              <Text style={styles.moodText}>Sad</Text>
              {selectedMood === 'Sad' && (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={40} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.moodItem, selectedMood === 'Angry' && styles.selectedMood]} 
              onPress={() => handleMoodSelect('Angry')}
            >
              <Image source={require('../../assets/angry.gif')} style={styles.moodIcon} />
              <Text style={styles.moodText}>Angry</Text>
              {selectedMood === 'Angry' && (
                <View style={styles.checkOverlay}>
                  <Icon name="check-circle" size={40} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef0ee',
    paddingHorizontal: 20,
    paddingTop: 20, 
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40, 
  },
  title: {
    textAlign: 'center',
    color: '#292f33',
    fontSize: 37,
    fontFamily: 'Nunito-Bold',
    marginBottom: 10, 
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10, 
  },
  dateText: {
    color: '#292f33',
    fontSize: 13,
    fontFamily: 'Nunito',
  },
  timeText: {
    color: '#292f33',
    fontSize: 13,
    fontFamily: 'Nunito',
  },
  moodContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10, 
  },
  moodItem: {
    alignItems: 'center',
    flex: 2,
    position: 'relative',
    padding: 5,
    borderRadius: 10,
  },
  selectedMood: {
    backgroundColor: 'rgba(111, 186, 148, 0.1)',
  },
  moodIcon: {
    width: 100,
    height: 100,
  },
  moodText: {
    color: '#292f33',
    fontSize: 15,
    fontFamily: 'Nunito',
    marginTop: 5,
  },
  checkOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  nextButton: {
    backgroundColor: '#6fba94',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 70, 
    alignSelf: 'center',
    width: '50%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bolder',
  },
});