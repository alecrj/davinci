import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { AnimatedText } from '@/components/ui/AnimatedText';

const { width } = Dimensions.get('window');

export default function AssessmentWelcome() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleStartAssessment = () => {
    router.push('/assessment/questions');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <AnimatedText
            style={[styles.title, { color: theme.text }]}
            delay={200}
          >
            Let's find your level
          </AnimatedText>
          <AnimatedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
            delay={400}
          >
            This helps us create the perfect learning path for you
          </AnimatedText>
        </View>
        
        {/* Assessment Info Cards */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.iconText}>🎯</Text>
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Questions</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Tell us about your drawing experience
            </Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.iconText}>✏️</Text>
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Sketch</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Draw a couple of simple shapes
            </Text>
          </View>
        </Animated.View>
        
        {/* Features List */}
        <Animated.View
          style={[
            styles.featuresList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: theme.success }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Takes only 2-3 minutes
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: theme.success }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Personalized learning path
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: theme.success }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              You can retake it anytime
            </Text>
          </View>
        </Animated.View>
        
        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <Button
            title="Start Assessment"
            onPress={handleStartAssessment}
            style={styles.startButton}
          />
          
          <Text style={[styles.skipText, { color: theme.textTertiary }]}>
            Or skip to start learning right away
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoContainer: {
    gap: 16,
    marginVertical: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  featuresList: {
    gap: 16,
    marginVertical: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '400',
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    marginBottom: 16,
    width: width - 48,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '400',
  },
});