import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoodLogs } from '../../redux/actions/moodActions';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Import mood images
const moodImages = {
  Relaxed: require('../../assets/relaxed.gif'),
  Happy: require('../../assets/happy.gif'),
  Fine: require('../../assets/fine.gif'),
  Sad: require('../../assets/sad.gif'),
  Anxious: require('../../assets/anxious.gif'),
  Angry: require('../../assets/angry.gif'),
};

// Import activity icons mapping
const activityIcons = {
  gaming: 'game-controller-outline',
  music: 'musical-notes-outline',
  relax: 'bed-outline',
  reading: 'book-outline',
  studying: 'school-outline',
  work: 'briefcase-outline',
  movie: 'film-outline',
  exercise: 'fitness-outline',
  default: 'options-outline'
};

const defaultImage = require('../../assets/logo.png');

const WeeklyPrediction = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user?._id);
  const moodLogs = useSelector(state => state.moodLog.moodLogs || []);
  const [weeklyInsights, setWeeklyInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      dispatch(fetchMoodLogs(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (moodLogs.length > 0) {
      const insights = generateWeeklyInsights(moodLogs);
      setWeeklyInsights(insights);
    }
    setLoading(false);
  }, [moodLogs]);

  const generateWeeklyInsights = (logs) => {
    moment.locale('en', {
      week: {
        dow: 1, // Monday is the first day of the week
      }
    });

    const currentWeekStart = moment().startOf('week');
    const currentWeekEnd = moment().endOf('week');

    // Filter logs from previous week only
    const previousWeekLogs = logs.filter(log => {
      const logDate = moment(log.date);
      const prevWeekStart = moment().subtract(1, 'week').startOf('week');
      const prevWeekEnd = moment().subtract(1, 'week').endOf('week');
      return logDate.isBetween(prevWeekStart, prevWeekEnd, null, '[]');
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (previousWeekLogs.length === 0) {
      return daysOfWeek.map(day => ({
        day,
        mood: null,
        activity: null,
        icon: defaultImage
      }));
    }

    return daysOfWeek.map(day => {
      // Filter logs for specific day of week
      const dayLogs = previousWeekLogs.filter(log => 
        moment(log.date).format('dddd') === day
      );

      if (dayLogs.length === 0) {
        return {
          day,
          mood: null,
          activity: null,
          icon: defaultImage
        };
      }

      const mostCommonMood = getMostCommonMood(dayLogs);
      const mostCommonActivity = getMostCommonActivity(dayLogs);

      return {
        day,
        mood: mostCommonMood,
        activity: mostCommonActivity,
        icon: moodImages[mostCommonMood] || defaultImage
      };
    });
  };

  const getMostCommonMood = (logs) => {
    const moodCounts = logs.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 
      'Fine'
    );
  };

  const getMostCommonActivity = (logs) => {
    const allActivities = logs.flatMap(log => log.activities || []);

    if (allActivities.length === 0) return null;

    const activityCounts = allActivities.reduce((acc, activity) => {
      acc[activity] = (acc[activity] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(activityCounts).reduce((a, b) => 
      activityCounts[a] > activityCounts[b] ? a : b, 
      null
    );
  };

  const getActivityIcon = (activity) => {
    if (!activity) return 'help-circle-outline';
    
    const normalizedActivity = activity.toLowerCase();
    return activityIcons[normalizedActivity] || 'options-outline';
  };

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'Happy': return '#6fba94';
      case 'Relaxed': return '#89bcbc';
      case 'Fine': return '#95c5d6';
      case 'Sad': return '#b0c4de';
      case 'Anxious': return '#ffbd9d';
      case 'Angry': return '#ff9e80';
      default: return '#cccccc';
    }
  };

  // Format current week's date range
  const currentWeekStart = moment().startOf('week');
  const currentWeekEnd = moment().endOf('week');
  const weekDateRange = `${currentWeekStart.format('MMM DD')} - ${currentWeekEnd.format('MMM DD, YYYY')}`;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6fba94', '#89bcbc']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Weekly Mood Prediction</Text>
        <Text style={styles.headerSubtitle}>Based on your last week's patterns</Text>
      </LinearGradient>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6fba94" />
          <Text style={styles.loadingText}>Analyzing your patterns...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={20} color="#6fba94" />
            <Text style={styles.dateText}>{weekDateRange}</Text>
          </View>
          
          {weeklyInsights.map((item, index) => (
            <View key={item.day} style={styles.card}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayText}>{item.day}</Text>
                <View style={[styles.dayIndicator, index === moment().day() - 1 ? styles.todayIndicator : null]} />
              </View>
              
              <View style={styles.predictionContent}>
                <Image 
                  source={item.mood ? item.icon : defaultImage} 
                  style={styles.moodImage} 
                />
                
                <View style={styles.predictionDetails}>
                  {item.mood ? (
                    <View style={[styles.moodTag, {backgroundColor: getMoodColor(item.mood)}]}>
                      <Text style={styles.moodTagText}>{item.mood}</Text>
                    </View>
                  ) : (
                    <View style={styles.noDataTag}>
                      <Text style={styles.noDataTagText}>No data</Text>
                    </View>
                  )}
                  
                  {item.activity ? (
                    <View style={styles.activityContainer}>
                      <Ionicons 
                        name={getActivityIcon(item.activity)} 
                        size={18} 
                        color="#6fba94" 
                        style={styles.activityIcon}
                      />
                      <Text style={styles.activityText}>{item.activity}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              
              <Text style={styles.predictionText}>
                {item.mood && item.activity 
                  ? `You may feel ${item.mood.toLowerCase()} when doing ${item.activity.toLowerCase()}`
                  : 'No prediction available for this day'}
              </Text>
            </View>
          ))}
          
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#89bcbc" />
            <Text style={styles.infoText}>
              Predictions are based on your mood patterns from the previous week
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

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
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito',
  },
  content: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
    fontFamily: 'Nunito-Bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginBottom: 12,
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#444',
  },
  dayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  todayIndicator: {
    backgroundColor: '#6fba94',
  },
  predictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  predictionDetails: {
    flex: 1,
  },
  moodTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  moodTagText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  noDataTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  noDataTagText: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'Nunito',
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    marginRight: 6,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: '#666',
  },
  predictionText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Nunito',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(137, 188, 188, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Nunito',
    color: '#666',
  }
});

export default WeeklyPrediction;