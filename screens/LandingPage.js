import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  Animated, 
  ScrollView, 
  Dimensions,
  StatusBar,
  Linking
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LandingPage({ navigation }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(null);
  
  const images = [
    require('../assets/landing1.png'),
    require('../assets/landing2.png'),
    require('../assets/landing3.png'),
    require('../assets/landing4.png'),
    require('../assets/landing5.png')
  ];
  
  const previewImages = [
    require('../assets/preview1.png'),
    require('../assets/preview2.png'),
    require('../assets/preview3.png'),
  ];

  let [fontsLoaded] = useFonts({
    'Nunito': require('../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // Change image when fully faded out
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        
        // Start fade in animation with new image
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(fadeInterval);
  }, []);

  // Auto-scroll the preview carousel
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      const nextIndex = (currentPreviewIndex + 1) % previewImages.length;
      setCurrentPreviewIndex(nextIndex);
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true
      });
    }, 3000);

    return () => clearInterval(carouselInterval);
  }, [currentPreviewIndex]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#eef0ee" />
      <ScrollView style={{ flex: 1, backgroundColor: '#eef0ee' }}>
        {/* Top gradient */}
        <LinearGradient
          colors={['rgba(111, 186, 148, 0.2)', 'rgba(111, 186, 148, 0)']}
          style={styles.topGradient}
        />
        
        <View style={styles.container}>
          {/* Top Info Bar */}
          <View style={styles.infoBar}>
            <Ionicons name="leaf" size={18} color="#64aa86" />
            <Text style={styles.infoText}>Your mental wellbeing companion</Text>
          </View>
          
          <Animated.Image 
            source={images[currentImageIndex]}
            style={[styles.image, { opacity: fadeAnim }]}
          />
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mindful Map</Text>
            <Text style={styles.subtitle}>Keep track of your moods every day.</Text>
          </View>
          
          {/* Button with improved styling */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Signin')}
            >
              <LinearGradient
                colors={['#6fba94', '#64aa86']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Try Now</Text>
                <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 5 }} />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('AboutUs')}
            >
              <Text style={styles.secondaryButtonText}>About Us</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Feature highlights before preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="analytics" size={24} color="#64aa86" />
            </View>
            <Text style={styles.featureText}>Track mood patterns</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="bulb" size={24} color="#64aa86" />
            </View>
            <Text style={styles.featureText}>Personalized insights</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="calendar" size={24} color="#64aa86" />
            </View>
            <Text style={styles.featureText}>Monthly Log Overview</Text>
          </View>
        </View>
        
        {/* Preview Images Carousel - No Container */}
        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
              setCurrentPreviewIndex(newIndex);
            }}
          >
            {previewImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  key={index}
                  source={image}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
          
          {/* Simple dot indicators */}
          <View style={styles.indicatorContainer}>
            {previewImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentPreviewIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Call to action before footer */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>Ready to start your mental wellness journey?</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Signin')}
          >
            <LinearGradient
              colors={['#6fba94', '#64aa86']}
              style={styles.ctaButtonGradient}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Footer similar to AboutUs */}
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
    </>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef0ee',
    paddingVertical: 40,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(111, 186, 148, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Nunito',
    color: '#64aa86',
    fontSize: 14,
    marginLeft: 6,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  image: {
    width: 330,
    height: 340,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    marginBottom: 10,
    fontFamily: 'Nunito-Bold',
    color: '#64aa86',
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 20,
    fontFamily: 'Nunito',
    textAlign: 'center',
    color: '#64aa86',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: 180,
    borderRadius: 25,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primaryButton: {
    backgroundColor: '#6fba94',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#6fba94',
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'semi-bold',
    fontSize: 18,
    fontFamily: 'Nunito',
    color: 'white',
  },
  secondaryButtonText: {
    fontWeight: 'semi-bold',
    fontSize: 18,
    fontFamily: 'Nunito',
    color: '#64aa86',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  featureItem: {
    alignItems: 'center',
    width: width / 3 - 20,
    marginBottom: 10,
  },
  featureIconContainer: {
    backgroundColor: 'rgba(111, 186, 148, 0.15)',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  // Improved carousel styles
  carouselWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  carouselContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: width * 2.6,
    height: width * 1.6,
    borderRadius: 20,
    // These marginLeft and translateX will center the image horizontally
    marginLeft: -width * 0.0,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#64aa86',
    width: 16,
  },
  ctaContainer: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
    backgroundColor: 'rgba(111, 186, 148, 0.1)',
    borderRadius: 10,
    marginHorizontal: 20,
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
  footer: {
    padding: 30,
    marginTop: 20,
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