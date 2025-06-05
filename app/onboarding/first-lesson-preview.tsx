import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { uiHaptics } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

export default function FirstLessonPreviewScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { updateProgress } = useUserProgress();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartLesson = () => {
    uiHaptics.buttonPress();
    // For now, skip to completion
    router.push('/onboarding/complete');
  };

  const handleRemindTomorrow = async () => {
    uiHaptics.buttonPress();
    
    // Mark onboarding as complete
    await updateProgress({
      hasCompletedOnboarding: true,
      currentLessonPath: 'beginner/apple', // Set up for tomorrow
    });
    
    // Go to completion screen
    router.push('/onboarding/complete');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(0, 122, 255, 0.1)', 'rgba(88, 86, 214, 0.1)']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Your First Real Lesson
            </Text>
            <Text style={[styles.subtitle, { color: colors.primary }]}>
              Tomorrow, you'll draw this apple 🍎
            </Text>
          </View>

          {/* Lesson Preview Card */}
          <View style={[styles.lessonCard, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={['#ff6b6b', '#ff8787']}
              style={styles.lessonGradient}
            >
              <Text style={styles.lessonEmoji}>🍎</Text>
              <Text style={styles.lessonTitle}>Draw a Perfect Apple</Text>
              <Text style={styles.lessonSubtitle}>Master basic shapes & shading</Text>
              
              <View style={styles.lessonInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="white" />
                  <Text style={styles.infoText}>3 minutes</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="sparkles" size={16} color="white" />
                  <Text style={styles.infoText}>AI-enhanced</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* What You'll Learn */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What You'll Learn:
            </Text>
            
            <View style={[styles.learningPoint, { backgroundColor: colors.card }]}>
              <Text style={styles.pointEmoji}>⭕</Text>
              <View style={styles.pointContent}>
                <Text style={[styles.pointTitle, { color: colors.text }]}>
                  Perfect Circle Technique
                </Text>
                <Text style={[styles.pointDescription, { color: colors.textSecondary }]}>
                  The secret to drawing round objects
                </Text>
              </View>
            </View>

            <View style={[styles.learningPoint, { backgroundColor: colors.card }]}>
              <Text style={styles.pointEmoji}>🎨</Text>
              <View style={styles.pointContent}>
                <Text style={[styles.pointTitle, { color: colors.text }]}>
                  Basic Shading
                </Text>
                <Text style={[styles.pointDescription, { color: colors.textSecondary }]}>
                  Make your apple look 3D and realistic
                </Text>
              </View>
            </View>

            <View style={[styles.learningPoint, { backgroundColor: colors.card }]}>
              <Text style={styles.pointEmoji}>✨</Text>
              <View style={styles.pointContent}>
                <Text style={[styles.pointTitle, { color: colors.text }]}>
                  AI Enhancement
                </Text>
                <Text style={[styles.pointDescription, { color: colors.textSecondary }]}>
                  See your apple transformed into art
                </Text>
              </View>
            </View>
          </View>

          {/* Tomorrow's Hook */}
          <View style={[styles.tomorrowCard, { backgroundColor: colors.primary }]}>
            <Ionicons name="notifications" size={24} color="white" />
            <Text style={styles.tomorrowText}>
              We'll remind you tomorrow at 10 AM{'\n'}
              to start your artistic journey!
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Start Lesson Now"
              onPress={handleStartLesson}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />
            
            <Button
              title="Remind Me Tomorrow"
              onPress={handleRemindTomorrow}
              variant="outline"
              size="large"
              style={styles.secondaryButton}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  lessonCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  lessonGradient: {
    padding: 30,
    alignItems: 'center',
  },
  lessonEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  lessonSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 20,
  },
  lessonInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  learningPoint: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  pointEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  pointContent: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pointDescription: {
    fontSize: 14,
  },
  tomorrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    gap: 16,
  },
  tomorrowText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {},
});