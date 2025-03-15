import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Animated, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Linking 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

export default function AboutUs() {
  const navigation = useNavigation();
  const fadeAnimGif = useRef(new Animated.Value(0)).current;
  const fadeAnimText = useRef(new Animated.Value(0)).current;
  const fadeAnimFeatures = useRef(new Animated.Value(0)).current;
  const fadeAnimTeam = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimGif, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnimText, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(fadeAnimFeatures, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }).start(() => {
              setTimeout(() => {
                Animated.timing(fadeAnimTeam, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                }).start();
              }, 300);
            });
          }, 300);
        });
      }, 400); 
    });
  }, [fadeAnimGif, fadeAnimText, fadeAnimFeatures, fadeAnimTeam]);

  const teamMembers = [
    {
      image: require('../assets/member1.png'),
      name: 'Hannah Aurora Busto',
      role: 'Fullstack Developer',
    },
    {
      image: require('../assets/member3.png'),
      name: 'Aminah Malic',
      role: 'Fullstack Developer',
    },
    {
      image: require('../assets/maampops.png'),
      name: 'Prof. Pops Madriaga',
      role: 'Project Adviser',
    },
    {
      image: require('../assets/member2.png'),
      name: 'Angel Galapon',
      role: 'Developer',
    },
    {
      image: require('../assets/member4.png'),
      name: 'Resty Jr Cailao',
      role: 'Developer',
    },
  ];

  const features = [
    {
      icon: 'happy-outline',
      title: 'Track Your Mood',
      description: 'Log daily emotions and see how they change over time',
    },
    {
      icon: 'analytics-outline',
      title: 'Discover Patterns',
      description: 'Identify connections between activities and emotions',
    },
    {
      icon: 'calendar-outline',
      title: 'Weekly Review',
      description: 'Get insights into your emotional patterns each week',
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#6fba94', '#64aa86']}
        style={styles.headerGradient}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{opacity: fadeAnimGif, alignItems: 'center'}}>
          <Image
            source={require('../assets/about.png')}
            style={styles.image}
          />
        </Animated.View>
        
        <Animated.View style={{...styles.textContainer, opacity: fadeAnimText}}>
          <LinearGradient
            colors={['#ffffff', '#f5f9f7']}
            style={styles.aboutCard}
          >
            <Text style={styles.title}>Your Wellness Journey</Text>
            <Text style={styles.description}>
              Mindful Map is a daily mood and activity tracking system designed to help you understand
              the connection between your emotions and daily routines. By logging your moods and activities, 
              you can identify patterns that influence your well-being and take steps toward a healthier mind.
            </Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={{opacity: fadeAnimFeatures, width: '100%', alignItems: 'center'}}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={['rgba(111, 186, 148, 0.15)', 'rgba(111, 186, 148, 0)']}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.sectionTitleGradient}
            />
            <Text style={styles.sectionTitle}>Key Features</Text>
          </View>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon} size={28} color="#6fba94" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
        
        <Animated.View style={{opacity: fadeAnimTeam, width: '100%', alignItems: 'center'}}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={['rgba(111, 186, 148, 0.15)', 'rgba(111, 186, 148, 0)']}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.sectionTitleGradient}
            />
            <Text style={styles.sectionTitle}>Our Team</Text>
          </View>
          
          <View style={styles.teamContainer}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <Image source={member.image} style={styles.teamMemberImage} />
                <View style={styles.teamMemberInfo}>
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  <Text style={styles.teamMemberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
        
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>Have questions or suggestions?</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => Linking.openURL('mailto:contact@mindfulmap.com')}
          >
            <LinearGradient
              colors={['#6fba94', '#64aa86']}
              style={styles.ctaButtonGradient}
            >
              <Text style={styles.ctaButtonText}>Contact Us</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Footer from LandingPage */}
        <LinearGradient
          colors={['#64aa86', '#6fba94']}
          style={styles.footer}
        >
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Mindful Map</Text>
              <Text style={styles.footerText}>Your mental wellness journey begins here</Text>
            </View>
            
            <View style={styles.footerDivider} />
            
            <View style={styles.footerSection}>
              <Text style={styles.footerSubtitle}>Connect with us</Text>
              <View style={styles.socialLinks}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL('https://twitter.com')}
                >
                  <Ionicons name="logo-twitter" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL('https://instagram.com')}
                >
                  <Ionicons name="logo-instagram" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL('mailto:contact@mindfulmap.com')}
                >
                  <Ionicons name="mail" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.copyright}>© 2025 Mindful Map. All rights reserved.</Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#eef0ee',
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 0,
    alignItems: 'center',
  },
  image: {
    width: cardWidth,
    height: 250,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    color: '#444',
    fontFamily: 'Nunito-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Nunito',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
    position: 'relative',
  },
  sectionTitleGradient: {
    position: 'absolute',
    height: 40,
    width: width * 0.7,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#444',
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    zIndex: 1,
  },
  featureCard: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 20,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#444',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: '#666',
    lineHeight: 20,
  },
  teamContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  teamCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  teamMemberImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#6fba94',
  },
  teamMemberInfo: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#444',
    marginBottom: 5,
  },
  teamMemberRole: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: '#6fba94',
  },
  ctaContainer: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
    backgroundColor: 'rgba(111, 186, 148, 0.1)',
    borderRadius: 10,
    marginHorizontal: 20,
    width: cardWidth,
  },
  ctaText: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ctaButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Footer styles from LandingPage
  footer: {
    padding: 30,
    marginTop: 20,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerSection: {
    flex: 1,
    minWidth: 150,
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    marginBottom: 8,
  },
  footerSubtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: 'white',
    opacity: 0.9,
    marginBottom: 6,
  },
  footerDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: 5,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  copyright: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 20,
  }
});