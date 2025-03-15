import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoodLogs } from '../../redux/actions/moodActions';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const moodImages = {
  relaxed: require('../../assets/relaxed.gif'),
  happy: require('../../assets/happy.gif'),
  fine: require('../../assets/fine.gif'),
  sad: require('../../assets/sad.gif'),
  anxious: require('../../assets/anxious.gif'),
  angry: require('../../assets/angry.gif'),
};

const activityImages = {
  studying: require('../../assets/studying.gif'),
  exam: require('../../assets/exam.gif'),
  work: require('../../assets/work.gif'),
  reading: require('../../assets/reading.gif'),
  gaming: require('../../assets/gaming.gif'),
  music: require('../../assets/music.gif'),
  movie: require('../../assets/movie.gif'),
  relax: require('../../assets/relax.gif'),
};

const healthImages = {
  exercise: require('../../assets/exercise.gif'),
  run: require('../../assets/run.gif'),
  walk: require('../../assets/walk.gif'),
  'eat healthy': require('../../assets/eathealthy.gif'),
};

const socialImages = {
  family: require('../../assets/family.gif'),
  friends: require('../../assets/friends.gif'),
  relationship: require('../../assets/relationship.gif'),
  colleagues: require('../../assets/colleagues.gif'),
  pets: require('../../assets/pets.gif'),
};

const sleepImages = {
  'No Sleep': require('../../assets/no-sleep.gif'),
  'Poor Sleep': require('../../assets/poor-sleep.gif'),
  'Medium Sleep': require('../../assets/medium-sleep.gif'),
  'Good Sleep': require('../../assets/good-sleep.gif'),
};

// Mood color mapping
const moodColors = {
  happy: '#6fba94',
  relaxed: '#89bcbc',
  fine: '#95c5d6',
  sad: '#b0c4de',
  anxious: '#ffbd9d',
  angry: '#ff9e80',
};

export default function MoodEntries({ navigation }) {
  const dispatch = useDispatch();
  const moodLogs = useSelector(state => state.moodLog.moodLogs || []);
  const loading = useSelector(state => state.moodLog.loading);
  const userId = useSelector(state => state.auth.user?._id);
  const [sortedLogs, setSortedLogs] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMoodLogs(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    // Sort the logs by date (newest first)
    if (moodLogs && moodLogs.length > 0) {
      const sorted = [...moodLogs].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setSortedLogs(sorted);
    } else {
      setSortedLogs([]);
    }
  }, [moodLogs]);

  const getDayLabel = (dateString) => {
    const logDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (logDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (logDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return logDate.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const toggleLogExpansion = (index) => {
    setExpandedLog(expandedLog === index ? null : index);
  };

  const getSectionIcon = (section) => {
    switch(section) {
      case 'Activities': return 'options';
      case 'Health': return 'fitness';
      case 'Social': return 'people';
      case 'Sleep Quality': return 'moon';
      default: return 'list';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6fba94', '#89bcbc']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mood Journal</Text>
        <Text style={styles.headerSubtitle}>Your emotional journey</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6fba94" />
          <Text style={styles.loadingText}>Loading your mood entries...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {sortedLogs.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="journal-outline" size={70} color="#cccccc" />
              <Text style={styles.noLogsText}>No mood logs available.</Text>
              <Text style={styles.noLogsSubtext}>Start tracking your moods to see entries here.</Text>
            </View>
          ) : (
            sortedLogs.map((log, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.logContainer,
                  { borderLeftColor: moodColors[log.mood.toLowerCase()] || '#cccccc' }
                ]}
                onPress={() => toggleLogExpansion(index)}
                activeOpacity={0.9}
              >
                <View style={styles.logHeader}>
                  <Image 
                    source={moodImages[log.mood.toLowerCase()]} 
                    style={styles.moodIcon} 
                  />
                  <View style={styles.logInfo}>
                    <Text style={styles.logDate}>
                      {getDayLabel(log.date)}, {new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </Text>
                    <Text style={[
                      styles.logMood,
                      { color: moodColors[log.mood.toLowerCase()] || '#000' }
                    ]}>
                      {log.mood}
                    </Text>
                  </View>
                  <Ionicons 
                    name={expandedLog === index ? "chevron-up" : "chevron-down"} 
                    size={22} 
                    color="#b1b1b1" 
                  />
                </View>
                
                {expandedLog === index && (
                  <View style={styles.logDetails}>
                    {/* Activities Section */}
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name={getSectionIcon('Activities')} size={18} color="#6fba94" />
                        <Text style={styles.sectionTitle}>Activities</Text>
                      </View>
                      <View style={styles.imagesGrid}>
                        {log.activities.map((activity, idx) => (
                          <View key={idx} style={styles.imageWithText}>
                            <Image 
                              source={activityImages[activity.toLowerCase()]} 
                              style={styles.activityIcon} 
                            />
                            <Text style={styles.imageText}>{activity}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    {/* Health Section */}
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name={getSectionIcon('Health')} size={18} color="#6fba94" />
                        <Text style={styles.sectionTitle}>Health</Text>
                      </View>
                      <View style={styles.imagesGrid}>
                        {log.health.map((health, idx) => (
                          <View key={idx} style={styles.imageWithText}>
                            <Image 
                              source={healthImages[health.toLowerCase()]} 
                              style={styles.healthIcon} 
                            />
                            <Text style={styles.imageText}>{health}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    {/* Social Section */}
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name={getSectionIcon('Social')} size={18} color="#6fba94" />
                        <Text style={styles.sectionTitle}>Social</Text>
                      </View>
                      <View style={styles.imagesGrid}>
                        {log.social.map((social, idx) => (
                          <View key={idx} style={styles.imageWithText}>
                            <Image 
                              source={socialImages[social.toLowerCase()]} 
                              style={styles.socialIcon} 
                            />
                            <Text style={styles.imageText}>{social}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    {/* Sleep Section */}
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name={getSectionIcon('Sleep Quality')} size={18} color="#6fba94" />
                        <Text style={styles.sectionTitle}>Sleep Quality</Text>
                      </View>
                      <View style={styles.imagesGrid}>
                        <View style={styles.imageWithText}>
                          <Image 
                            source={sleepImages[log.sleepQuality]} 
                            style={styles.sleepIcon} 
                          />
                          <Text style={styles.imageText}>{log.sleepQuality}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef0ee',
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: 'white',
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  noLogsText: {
    color: '#777',
    fontSize: 18,
    marginTop: 15,
    fontFamily: 'Nunito-Bold',
  },
  noLogsSubtext: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Nunito',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  logContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#6fba94',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    color: '#888',
    fontFamily: 'Nunito',
    fontSize: 14,
  },
  logMood: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginTop: 3,
  },
  logDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#444',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    marginLeft: 8,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWithText: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
    width: 70, // Fixed width for grid-like appearance
  },
  activityIcon: {
    width: 45,
    height: 45,
    marginBottom: 5,
    borderRadius: 22.5,
  },
  healthIcon: {
    width: 45,
    height: 45,
    marginBottom: 5,
    borderRadius: 22.5,
  },
  socialIcon: {
    width: 45,
    height: 45,
    marginBottom: 5,
    borderRadius: 22.5,
  },
  sleepIcon: {
    width: 45,
    height: 45,
    marginBottom: 5,
    borderRadius: 22.5,
  },
  imageText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Nunito',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});