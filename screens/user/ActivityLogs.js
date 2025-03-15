import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActivity, saveMoodLog } from '../../redux/actions/moodActions';

export default function ActivityLogs({ navigation, route }) {
  const mood = useSelector(state => state.moodLog.mood);
  const userId = useSelector(state => state.auth.user?._id);
  const authState = useSelector(state => state.auth); // Get entire auth state
  const moodLogState = useSelector(state => state.moodLog); // Get entire mood log state
  const dispatch = useDispatch();

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedSocial, setSelectedSocial] = useState([]);
  const [selectedHealth, setSelectedHealth] = useState([]);
  const [selectedSleep, setSelectedSleep] = useState(null);

  const handleLogout = () => {
    navigation.navigate('Signin');
  };

  const selectedDate = route.params?.selectedDate || new Date();

  const handleFinish = () => {
    if (selectedActivities.length === 0 || selectedSocial.length === 0 || 
        selectedHealth.length === 0 || !selectedSleep) {
      Alert.alert("Incomplete Log", "Please select at least one item from each category and sleep quality.");
      return;
    }

    // Debug logs (using values stored at component level)
    console.log("User ID:", userId);
    console.log("Selected Mood:", mood);
    console.log("Auth state:", authState);
    console.log("Mood state:", moodLogState);

    if (!userId) {
      Alert.alert("Error", "User information is missing. Please log in again.");
      navigation.navigate('Signin');
      return;
    }

    if (!mood) {
      Alert.alert("Error", "Mood data is missing. Please select your mood first.");
      navigation.navigate('MoodLogs');
      return;
    }
    
    const selectedDateCopy = new Date(selectedDate);

    const now = new Date(); 
    
    selectedDateCopy.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
    const utcDate = new Date(
      selectedDateCopy.getFullYear(), // Keep year
      selectedDateCopy.getMonth(),    // Keep month
      selectedDateCopy.getDate(),     // Keep day
      now.getHours(),                 // Keep correct time
      now.getMinutes(),
      now.getSeconds()
    );

    const logData = {
      user: userId,
      mood,
      activities: selectedActivities,
      social: selectedSocial,
      health: selectedHealth,
      sleepQuality: selectedSleep,
      date: utcDate.toISOString(), 
    };

    console.log("Log data to be saved:", logData);
    
    dispatch(saveMoodLog(logData))
      .then(() => {
        navigation.navigate('Nav', { logSaved: true });
      })
      .catch(error => {
        Alert.alert("Error", `Failed to save mood log: ${error.message}`);
      });
  };

  const toggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(item => item !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const toggleSocial = (social) => {
    if (selectedSocial.includes(social)) {
      setSelectedSocial(selectedSocial.filter(item => item !== social));
    } else {
      setSelectedSocial([...selectedSocial, social]);
    }
  };

  const toggleHealth = (health) => {
    if (selectedHealth.includes(health)) {
      setSelectedHealth(selectedHealth.filter(item => item !== health));
    } else {
      setSelectedHealth([...selectedHealth, health]);
    }
  };

  const selectSleep = (sleep) => {
    setSelectedSleep(sleep);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={30} color="#292f33" />
        </TouchableOpacity>
        <Text style={styles.title}>How did your day go?</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Studying') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Studying')}
            >
              <Image source={require('../../assets/studying.gif')} style={styles.image} />
              <Text style={styles.imageText}>Studying</Text>
              {selectedActivities.includes('Studying') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Exam') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Exam')}
            >
              <Image source={require('../../assets/exam.gif')} style={styles.image} />
              <Text style={styles.imageText}>Exam</Text>
              {selectedActivities.includes('Exam') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Work') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Work')}
            >
              <Image source={require('../../assets/work.gif')} style={styles.image} />
              <Text style={styles.imageText}>Work</Text>
              {selectedActivities.includes('Work') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Reading') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Reading')}
            >
              <Image source={require('../../assets/reading.gif')} style={styles.image} />
              <Text style={styles.imageText}>Reading</Text>
              {selectedActivities.includes('Reading') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.imageRow}>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Gaming') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Gaming')}
            >
              <Image source={require('../../assets/gaming.gif')} style={styles.image} />
              <Text style={styles.imageText}>Gaming</Text>
              {selectedActivities.includes('Gaming') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Music') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Music')}
            >
              <Image source={require('../../assets/music.gif')} style={styles.image} />
              <Text style={styles.imageText}>Music</Text>
              {selectedActivities.includes('Music') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Movie') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Movie')}
            >
              <Image source={require('../../assets/movie.gif')} style={styles.image} />
              <Text style={styles.imageText}>Movie</Text>
              {selectedActivities.includes('Movie') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedActivities.includes('Relax') && styles.selectedContainer
              ]}
              onPress={() => toggleActivity('Relax')}
            >
              <Image source={require('../../assets/relax.gif')} style={styles.image} />
              <Text style={styles.imageText}>Relax</Text>
              {selectedActivities.includes('Relax') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSocial.includes('Family') && styles.selectedContainer
              ]}
              onPress={() => toggleSocial('Family')}
            >
              <Image source={require('../../assets/family.gif')} style={styles.image} />
              <Text style={styles.imageText}>Family</Text>
              {selectedSocial.includes('Family') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSocial.includes('Friends') && styles.selectedContainer
              ]}
              onPress={() => toggleSocial('Friends')}
            >
              <Image source={require('../../assets/friends.gif')} style={styles.image} />
              <Text style={styles.imageText}>Friends</Text>
              {selectedSocial.includes('Friends') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSocial.includes('Relationship') && styles.selectedContainer
              ]}
              onPress={() => toggleSocial('Relationship')}
            >
              <Image source={require('../../assets/relationship.gif')} style={styles.image} />
              <Text style={styles.imageText}>Partner</Text>
              {selectedSocial.includes('Relationship') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSocial.includes('Colleagues') && styles.selectedContainer
              ]}
              onPress={() => toggleSocial('Colleagues')}
            >
              <Image source={require('../../assets/colleagues.gif')} style={styles.image} />
              <Text style={styles.imageText}>Colleague</Text>
              {selectedSocial.includes('Colleagues') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSocial.includes('Pets') && styles.selectedContainer
              ]}
              onPress={() => toggleSocial('Pets')}
            >
              <Image source={require('../../assets/pets.gif')} style={styles.image} />
              <Text style={styles.imageText}>Pets</Text>
              {selectedSocial.includes('Pets') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedHealth.includes('Exercise') && styles.selectedContainer
              ]}
              onPress={() => toggleHealth('Exercise')}
            >
              <Image source={require('../../assets/exercise.gif')} style={styles.image} />
              <Text style={styles.imageText}>Exercise</Text>
              {selectedHealth.includes('Exercise') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedHealth.includes('Run') && styles.selectedContainer
              ]}
              onPress={() => toggleHealth('Run')}
            >
              <Image source={require('../../assets/run.gif')} style={styles.image} />
              <Text style={styles.imageText}>Run</Text>
              {selectedHealth.includes('Run') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedHealth.includes('Walk') && styles.selectedContainer
              ]}
              onPress={() => toggleHealth('Walk')}
            >
              <Image source={require('../../assets/walk.gif')} style={styles.image} />
              <Text style={styles.imageText}>Walk</Text>
              {selectedHealth.includes('Walk') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedHealth.includes('Eat Healthy') && styles.selectedContainer
              ]}
              onPress={() => toggleHealth('Eat Healthy')}
            >
              <Image source={require('../../assets/eathealthy.gif')} style={styles.image} />
              <Text style={styles.imageText}>Eat Healthy</Text>
              {selectedHealth.includes('Eat Healthy') && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Quality</Text>
          <View style={styles.imageRow}>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSleep === 'No Sleep' && styles.selectedContainer
              ]}
              onPress={() => selectSleep('No Sleep')}
            >
              <Image source={require('../../assets/no-sleep.gif')} style={styles.image} />
              <Text style={styles.imageText}>No Sleep</Text>
              {selectedSleep === 'No Sleep' && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSleep === 'Poor Sleep' && styles.selectedContainer
              ]}
              onPress={() => selectSleep('Poor Sleep')}
            >
              <Image source={require('../../assets/poor-sleep.gif')} style={styles.image} />
              <Text style={styles.imageText}>Poor Sleep</Text>
              {selectedSleep === 'Poor Sleep' && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSleep === 'Medium Sleep' && styles.selectedContainer
              ]}
              onPress={() => selectSleep('Medium Sleep')}
            >
              <Image source={require('../../assets/medium-sleep.gif')} style={styles.image} />
              <Text style={styles.imageText}>Medium Sleep</Text>
              {selectedSleep === 'Medium Sleep' && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.imageContainer, 
                selectedSleep === 'Good Sleep' && styles.selectedContainer
              ]}
              onPress={() => selectSleep('Good Sleep')}
            >
              <Image source={require('../../assets/good-sleep.gif')} style={styles.image} />
              <Text style={styles.imageText}>Good Sleep</Text>
              {selectedSleep === 'Good Sleep' && (
                <View style={styles.checkMark}>
                  <Icon name="check-circle" size={20} color="#6fba94" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef0ee',
  },
  logoutButton: {
    position: 'absolute',
    top: 22,
    right: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100, 
  },
  title: {
    textAlign: 'center',
    color: '#3a3939',
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'transparent',
    borderColor: '#b1b1b1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#3a3939',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '22%',
    padding: 5,
    borderRadius: 8,
    position: 'relative',
  },
  selectedContainer: {
    backgroundColor: 'rgba(111, 186, 148, 0.1)',
    borderWidth: 1,
    borderColor: '#6fba94',
  },
  image: {
    width: 50,
    height: 50,
  },
  imageText: {
    color: '#3a3939',
    fontSize: 12.5,
    fontFamily: 'Nunito',
    marginTop: 5,
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  finishButton: {
    backgroundColor: '#6fba94',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bolder',
  },
});