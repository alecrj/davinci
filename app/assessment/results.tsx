import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { Button } from '@/components/ui/Button';
import { STORAGE_KEYS } from '@/constants/app';

const skillLevels = [
  {
    level: 'Beginner',
    color: ['#10b981', '#059669'],
    icon: '🌱',
    message: "Perfect! Let's start with the basics and build your confidence.",
    tips: [
      'Start with simple shapes',
      'Practice 5-10 minutes daily',
      'Focus on fun, not perfection',
    ],
  },
  {
    level: 'Intermediate',
    color: ['#3b82f6', '#2563eb'],
    icon: '🌿',
    message: "Great foundation! Ready to explore more creative techniques.",
    tips: [
      'Try combining shapes',
      'Experiment with shading',
      'Challenge yourself daily',
    ],
  },
  {
    level: 'Advanced',
    color: ['#8b5cf6', '#7c3aed'],
    icon: '🌳',
    message: "Impressive skills! Let's refine your artistic mastery.",
    tips: [
      'Master complex compositions',
      'Develop your unique style',
      'Share and inspire others',
    ],
  },
];

export default function AssessmentResults() {
  const router = useRouter();
  const { theme } = useTheme();
  const { skillLevel, updateSkillLevel } = useUserProgress();
  const [animatedValue] = useState(new Animated.Value(0));
  
  const currentLevel = skillLevels.find(l => l.level === skillLevel) || skillLevels[0];

  useEffect(() => {
    // Save assessment completion
    AsyncStorage.setItem(STORAGE_KEYS.assessmentResults, JSON.stringify({
      skillLevel,
      completedAt: new Date().toISOString(),
    }));

    // Animate entrance
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Celebration haptic
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 500);
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/home');
  };

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.background, currentLevel.color[0] + '20']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <AnimatedText
          text="Your Skill Level"
          style={[styles.title, { color: theme.colors.text }]}
          animation="fadeIn"
        />

        <Animated.View style={[styles.resultCard, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={currentLevel.color}
            style={styles.levelGradient}>
            <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
            <Text style={styles.levelText}>{currentLevel.level}</Text>
            <View style={styles.levelBadge}>
              <Ionicons name="trophy" size={20} color="white" />
            </View>
          </LinearGradient>
        </Animated.View>

        <Text style={[styles.message, { color: theme.colors.text }]}>
          {currentLevel.message}
        </Text>

        <View style={[styles.tipsCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
            Your Learning Path
          </Text>
          {currentLevel.tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={currentLevel.color[0]} 
              />
              <Text style={[styles.tipText, { color: theme.colors.text }]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.benefitsCard}>
          <LinearGradient
            colors={[currentLevel.color[0] + '20', currentLevel.color[1] + '20']}
            style={styles.benefitGradient}>
            <Ionicons name="sparkles" size={24} color={currentLevel.color[0]} />
            <Text style={[styles.benefitText, { color: theme.colors.text }]}>
              You'll unlock {currentLevel.level === 'Beginner' ? '20+' : '40+'} personalized lessons
            </Text>
          </LinearGradient>
        </View>

        <Button
          title="Start Your Journey"
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
        />

        <TouchableOpacity 
          style={styles.retakeButton}
          onPress={() => router.back()}>
          <Text style={[styles.retakeText, { color: theme.colors.text }]}>
            Retake Assessment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  resultCard: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  levelGradient: {
    flex: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  levelIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  levelBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  tipsCard: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    flex: 1,
  },
  benefitsCard: {
    width: '100%',
    marginBottom: 30,
  },
  benefitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 15,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    width: '100%',
    marginBottom: 15,
  },
  retakeButton: {
    padding: 10,
  },
  retakeText: {
    fontSize: 16,
    opacity: 0.7,
  },
});