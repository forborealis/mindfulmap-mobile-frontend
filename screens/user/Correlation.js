import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const chartSize = width * 0.3;

export default function Correlation() {
  const [correlationResults, setCorrelationResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(state => state.auth.user?._id); 

  useEffect(() => {
    if (userId) {
      const fetchCorrelationData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/correlation?user=${userId}`);
          console.log('Fetched Correlation Data:', response.data);
          setCorrelationResults(response.data);
          
          // Generate recommendations based on correlation results
          if (response.data.length > 0 && !response.data[0].message) {
            generateRecommendations(response.data);
          }
        } catch (error) {
          console.error('Error fetching correlation data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCorrelationData();
    }
  }, [userId]);

  const generateRecommendations = (results) => {
    const newRecommendations = [];
    
    // Find mood-activity correlations
    const moodActivityResults = results.filter(result => result.correlationMood && result.correlationActivity);
    
    // Find sleep quality results
    const sleepResults = results.filter(result => result.sleepQuality);
    
    // Generate mood-activity recommendations
    if (moodActivityResults.length > 0) {
      const result = moodActivityResults[0];
      const mood = result.correlationMood.toLowerCase();
      const activity = result.correlationActivity.toLowerCase();
      
      // Recommendation 1 based on positive mood correlation
      if (['happy', 'relaxed', 'fine'].includes(mood)) {
        newRecommendations.push({
          type: 'mood-activity',
          icon: 'thumbs-up',
          text: `Keep including ${activity} in your routine as it positively affects your mood.`,
          mood,
          activity
        });
        
        // Recommendation 2 for frequency
        newRecommendations.push({
          type: 'mood-activity',
          icon: 'calendar',
          text: `Consider scheduling ${activity} regularly, perhaps 3-4 times a week for optimal mood benefits.`,
          mood,
          activity
        });
      } else {
        // Recommendations for negative moods
        newRecommendations.push({
          type: 'mood-activity',
          icon: 'alert-circle',
          text: `Be mindful that ${activity} tends to correlate with your ${mood} mood.`,
          mood,
          activity
        });
        
        newRecommendations.push({
          type: 'mood-activity',
          icon: 'options',
          text: `Try balancing ${activity} with other activities that might boost your mood.`,
          mood,
          activity
        });
      }
    } else {
      // Default recommendations if no mood-activity correlations
      newRecommendations.push({
        type: 'mood-activity',
        icon: 'clipboard',
        text: 'Try logging your activities consistently to discover mood patterns.',
      });
      
      newRecommendations.push({
        type: 'mood-activity',
        icon: 'calendar',
        text: 'Include a variety of activities in your daily routine to identify what impacts your mood.',
      });
    }
    
    // Generate sleep quality recommendations
    if (sleepResults.length > 0) {
      const result = sleepResults[0];
      const quality = result.sleepQuality.toLowerCase();
      
      if (quality === 'good sleep' || quality === 'good') {
        newRecommendations.push({
          type: 'sleep',
          icon: 'moon',
          text: 'Continue with your current sleep routine, it\'s working well for you.',
          quality
        });
        
        newRecommendations.push({
          type: 'sleep',
          icon: 'time',
          text: 'Maintain a consistent sleep schedule to preserve your good sleep quality.',
          quality
        });
      } else if (quality === 'medium sleep' || quality === 'medium') {
        newRecommendations.push({
          type: 'sleep',
          icon: 'bed',
          text: 'Consider going to bed 30 minutes earlier to improve your sleep quality.',
          quality
        });
        
        newRecommendations.push({
          type: 'sleep',
          icon: 'phone-portrait',
          text: 'Reduce screen time before bed to help transition to better sleep.',
          quality
        });
      } else {
        newRecommendations.push({
          type: 'sleep',
          icon: 'water',
          text: 'Try relaxation techniques like deep breathing before bedtime.',
          quality
        });
        
        newRecommendations.push({
          type: 'sleep',
          icon: 'cafe',
          text: 'Limit caffeine after noon to help improve your sleep quality.',
          quality
        });
      }
    } else {
      // Default sleep recommendations
      newRecommendations.push({
        type: 'sleep',
        icon: 'moon',
        text: 'Aim for 7-8 hours of sleep each night for optimal wellbeing.',
      });
      
      newRecommendations.push({
        type: 'sleep',
        icon: 'bed',
        text: 'Create a relaxing bedtime routine to signal to your body it\'s time to sleep.',
      });
    }
    
    setRecommendations(newRecommendations);
  };

  useEffect(() => {
    console.log('Correlation Results:', correlationResults);
    console.log('Recommendations:', recommendations);
  }, [correlationResults, recommendations]);

  const getIconName = (mood) => {
    switch(mood?.toLowerCase()) {
      case 'happy': return 'happy-outline';
      case 'relaxed': return 'leaf-outline';
      case 'fine': return 'thumbs-up-outline';
      case 'sad': return 'sad-outline';
      case 'anxious': return 'flash-outline';
      case 'angry': return 'flame-outline';
      default: return 'analytics-outline';
    }
  };

  const getActivityIcon = (activity) => {
    switch(activity?.toLowerCase()) {
      case 'gaming': return 'game-controller-outline';
      case 'music': return 'musical-notes-outline';
      case 'relax': return 'bed-outline';
      case 'reading': return 'book-outline';
      case 'studying': return 'school-outline';
      case 'work': return 'briefcase-outline';
      case 'movie': return 'film-outline';
      case 'exercise': return 'fitness-outline';
      default: return 'options-outline';
    }
  };

  const getSocialIcon = (social) => {
    switch(social?.toLowerCase()) {
      case 'family': return 'people-outline';
      case 'friends': return 'beer-outline';
      case 'relationship': return 'heart-outline';
      case 'colleagues': return 'business-outline';
      case 'pets': return 'paw-outline';
      default: return 'people-circle-outline';
    }
  };

  const getSleepIcon = (quality) => {
    switch(quality?.toLowerCase()) {
      case 'good sleep': return 'moon-outline';
      case 'good': return 'moon-outline';
      case 'medium sleep': return 'partly-sunny-outline';
      case 'medium': return 'partly-sunny-outline';
      case 'poor sleep': return 'cloudy-night-outline';
      case 'poor': return 'cloudy-night-outline';
      case 'no sleep': return 'eye-outline';
      default: return 'bed-outline';
    }
  };

  const getHealthIcon = (status) => {
    return status?.toLowerCase().includes('normal') ? 'shield-checkmark-outline' : 'medkit-outline';
  };

  const getMoodColor = (mood) => {
    switch(mood?.toLowerCase()) {
      case 'happy': return '#6fba94';
      case 'relaxed': return '#89bcbc';
      case 'fine': return '#95c5d6';
      case 'sad': return '#b0c4de';
      case 'anxious': return '#ffbd9d';
      case 'angry': return '#ff9e80';
      default: return '#cccccc';
    }
  };

  const getSleepQualityColor = (quality) => {
    switch(quality?.toLowerCase()) {
      case 'good sleep': return '#6fba94';
      case 'good': return '#6fba94';
      case 'medium sleep': return '#ffbd9d';
      case 'medium': return '#ffbd9d';
      case 'poor sleep': return '#ff9e80';
      case 'poor': return '#ff9e80';
      case 'no sleep': return '#ffcccb';
      default: return '#89bcbc';
    }
  };

  // Improved donut chart with proper progress visualization
  const renderCustomDonutChart = (percentage, color) => {
    const validPercentage = isNaN(parseInt(percentage)) ? 0 : parseInt(percentage);
    const strokeWidth = 10;
    
    // Simple colored circle with percentage text
    return (
      <View style={styles.customChartContainer}>
        {/* Background circle */}
        <View style={[styles.circleBackground, { 
          width: chartSize, 
          height: chartSize,
          borderRadius: chartSize / 2,
          borderWidth: strokeWidth,
          borderColor: '#f0f0f0',
        }]} />
        
        {/* Create quadrant segments based on percentage */}
        {validPercentage >= 25 && (
          <View style={[styles.quadrant, { 
            width: chartSize / 2,
            height: chartSize / 2,
            top: 0,
            right: 0,
            borderTopRightRadius: chartSize / 2,
            borderWidth: strokeWidth,
            borderLeftWidth: 0,
            borderBottomWidth: 0,
            borderColor: color,
          }]} />
        )}
        
        {validPercentage >= 50 && (
          <View style={[styles.quadrant, { 
            width: chartSize / 2,
            height: chartSize / 2,
            top: 0,
            left: 0,
            borderTopLeftRadius: chartSize / 2,
            borderWidth: strokeWidth,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderColor: color,
          }]} />
        )}
        
        {validPercentage >= 75 && (
          <View style={[styles.quadrant, { 
            width: chartSize / 2,
            height: chartSize / 2,
            bottom: 0,
            left: 0,
            borderBottomLeftRadius: chartSize / 2,
            borderWidth: strokeWidth,
            borderRightWidth: 0,
            borderTopWidth: 0,
            borderColor: color,
          }]} />
        )}
        
        {/* Last segment is partially filled based on remaining percentage */}
        <View style={[styles.quadrant, { 
          width: chartSize / 2,
          height: chartSize / 2,
          bottom: 0,
          right: 0,
          borderBottomRightRadius: chartSize / 2,
          borderWidth: strokeWidth,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderColor: validPercentage > 0 ? color : 'transparent',
          opacity: validPercentage < 25 ? validPercentage / 25 : 1,
        }]} />

        {/* White center */}
        <View style={[styles.circleCenter, { 
          width: chartSize - strokeWidth * 2, 
          height: chartSize - strokeWidth * 2,
          borderRadius: (chartSize - strokeWidth * 2) / 2,
        }]} />
        
        {/* Percentage text */}
        <View style={styles.percentageTextContainer}>
          <Text style={styles.chartPercentage}>{validPercentage}%</Text>
        </View>
      </View>
    );
  };

  const renderRecommendations = () => {
    if (recommendations.length === 0) return null;

    const moodActivityRecs = recommendations.filter(rec => rec.type === 'mood-activity');
    const sleepRecs = recommendations.filter(rec => rec.type === 'sleep');

    return (
      <View style={styles.recommendationsContainer}>
        <LinearGradient
          colors={['#89bcbc', '#6fba94']}
          style={[styles.sectionHeader, {marginTop: 20}]}
        >
          <Ionicons name="bulb" size={24} color="white" />
          <Text style={styles.sectionHeaderText}>Personalized Recommendations</Text>
        </LinearGradient>

        <Text style={styles.recommendationSubheader}>Based on your activities:</Text>
        {moodActivityRecs.map((rec, index) => (
          <View key={`mood-${index}`} style={styles.recommendationCard}>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name={rec.icon} size={24} color="#6fba94" />
            </View>
            <Text style={styles.recommendationText}>{rec.text}</Text>
          </View>
        ))}

        <Text style={styles.recommendationSubheader}>For better sleep:</Text>
        {sleepRecs.map((rec, index) => (
          <View key={`sleep-${index}`} style={styles.recommendationCard}>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name={rec.icon} size={24} color="#89bcbc" />
            </View>
            <Text style={styles.recommendationText}>{rec.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCorrelationResults = () => {
    const moodResults = correlationResults.filter(result => result.correlationMood && result.correlationActivity);
    const socialResults = correlationResults.filter(result => result.correlationSocial);
    const healthResults = correlationResults.filter(result => result.healthStatus);
    const sleepResults = correlationResults.filter(result => result.sleepQuality);

    return (
      <View style={styles.resultsContainer}>
        <LinearGradient
          colors={['#89bcbc', '#6fba94']}
          style={styles.sectionHeader}
        >
          <Ionicons name="heart" size={24} color="white" />
          <Text style={styles.sectionHeaderText}>Activities</Text>
        </LinearGradient>

        {moodResults.length > 0 ? (
          moodResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.chartWithText}>
                {renderCustomDonutChart(
                  result.correlationValue, 
                  getMoodColor(result.correlationMood)
                )}
                <View style={styles.resultContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={getActivityIcon(result.correlationActivity)} size={24} color="#89bcbc" />
                  </View>
                  <Text style={styles.resultText}>
                    <Text style={styles.highlightText}>{result.correlationMood}</Text> mood is linked to{' '}
                    <Text style={styles.highlightText}>{result.correlationActivity}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No activity correlations found</Text>
        )}

        <LinearGradient
          colors={['#89bcbc', '#6fba94']}
          style={[styles.sectionHeader, {marginTop: 20}]}
        >
          <Ionicons name="people" size={24} color="white" />
          <Text style={styles.sectionHeaderText}>Social</Text>
        </LinearGradient>

        {socialResults.length > 0 ? (
          socialResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.chartWithText}>
                {renderCustomDonutChart(
                  result.correlationValue, 
                  getMoodColor(result.correlationMood)
                )}
                <View style={styles.resultContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={getSocialIcon(result.correlationSocial)} size={24} color="#89bcbc" />
                  </View>
                  <Text style={styles.resultText}>
                    <Text style={styles.highlightText}>{result.correlationMood}</Text> mood is linked to{' '}
                    <Text style={styles.highlightText}>{result.correlationSocial}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No social correlations found</Text>
        )}

        <LinearGradient
          colors={['#89bcbc', '#6fba94']}
          style={[styles.sectionHeader, {marginTop: 20}]}
        >
          <Ionicons name="fitness" size={24} color="white" />
          <Text style={styles.sectionHeaderText}>Health</Text>
        </LinearGradient>

        {healthResults.length > 0 ? (
          healthResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={getHealthIcon(result.healthStatus)} 
                  size={30} 
                  color={result.healthStatus?.toLowerCase().includes('normal') ? "#6fba94" : "#ff9e80"} 
                />
              </View>
              <Text style={styles.resultText}>
                <Text style={styles.highlightText}>{result.healthStatus}</Text>
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No health data found</Text>
        )}

        <LinearGradient
          colors={['#89bcbc', '#6fba94']}
          style={[styles.sectionHeader, {marginTop: 20}]}
        >
          <Ionicons name="moon" size={24} color="white" />
          <Text style={styles.sectionHeaderText}>Sleep Quality</Text>
        </LinearGradient>

        {sleepResults.length > 0 ? (
          sleepResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.chartWithText}>
                {renderCustomDonutChart(
                  result.sleepQualityValue || 65, 
                  getSleepQualityColor(result.sleepQuality)
                )}
                <View style={styles.resultContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={getSleepIcon(result.sleepQuality)} size={30} color="#89bcbc" />
                  </View>
                  <Text style={styles.resultText}>
                    Sleep this week is{' '}
                    <Text style={styles.highlightText}>{result.sleepQuality}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No sleep quality data found</Text>
        )}

        {renderRecommendations()}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#6fba94', '#89bcbc']}
          style={styles.header}
        >
          <Text style={styles.title}>Correlation Analysis</Text>
          <Text style={styles.subtitle}>Weekly insights based on your mood logs</Text>
        </LinearGradient>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6fba94" />
          <Text style={styles.loadingText}>Analyzing your patterns...</Text>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          {correlationResults.length === 1 && correlationResults[0].message ? (
            <View style={styles.messageContainer}>
              <Ionicons name="information-circle-outline" size={50} color="#89bcbc" />
              <Text style={styles.messageText}>{correlationResults[0].message}</Text>
              <Text style={styles.tipText}>Tip: Log your moods daily for better insights</Text>
            </View>
          ) : (
            renderCorrelationResults()
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef0ee',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  innerContainer: {
    padding: 20,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    marginLeft: 10,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  chartWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Nunito',
  },
  highlightText: {
    color: '#6fba94',
    fontFamily: 'Nunito-Bold',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito',
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  messageText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#89bcbc',
    fontFamily: 'Nunito',
    textAlign: 'center',
    marginTop: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontFamily: 'Nunito-Italic',
    fontSize: 14,
    marginBottom: 15,
  },
  // Styles for recommendations
  recommendationsContainer: {
    marginTop: 10,
  },
  recommendationSubheader: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#555',
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: 5,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.00,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#6fba94',
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    fontFamily: 'Nunito',
    lineHeight: 20,
  },
  // Improved chart styles
  customChartContainer: {
    width: chartSize,
    height: chartSize,
    marginRight: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    position: 'absolute',
  },
  quadrant: {
    position: 'absolute',
    overflow: 'hidden',
  },
  circleCenter: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  percentageTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPercentage: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#444',
  },
});