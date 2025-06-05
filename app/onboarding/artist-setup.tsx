import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { uiHaptics } from '@/utils/haptics';

const { width } = Dimensions.get('window');

interface ArtInterest {
  id: string;
  emoji: string;
  label: string;
  selected: boolean;
}

export default function ArtistSetupScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { updateProgress, updatePreferences } = useUserProgress();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [artistName, setArtistName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(10); // Default 10 minutes
  const [interests, setInterests] = useState<ArtInterest[]>([
    { id: 'portraits', emoji: '👤', label: 'Portraits', selected: false },
    { id: 'landscapes', emoji: '🏞️', label: 'Landscapes', selected: false },
    { id: 'animals', emoji: '🦁', label: 'Animals', selected: false },
    { id: 'abstract', emoji: '🎨', label: 'Abstract', selected: false },
    { id: 'manga', emoji: '✨', label: 'Manga/Anime', selected: false },
    { id: 'lettering', emoji: '✍️', label: 'Lettering', selected: false },
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleInterest = (id: string) => {
    uiHaptics.tabSelection();
    setInterests(prev => 
      prev.map(interest => 
        interest.id === id 
          ? { ...interest, selected: !interest.selected }
          : interest
      )
    );
  };

  const handleContinue = async () => {
    uiHaptics.buttonPress();
    
    // Save preferences
    const selectedInterests = interests
      .filter(i => i.selected)
      .map(i => i.id);
    
    await updateProgress({
      currentSkillLevel: 'beginner',
      stats: {
        totalLessonsCompleted: 0,
        currentStreak: 1,
        totalDrawingTime: 0,
        shapesDrawn: 3, // From transformation
        perfectScores: 0,
      }
    });
    
    await updatePreferences({
      notificationsEnabled: true, // Default to enabled for streak reminders
    });
    
    // Navigate to first lesson preview
    router.push('/onboarding/first-lesson-preview');
  };

  const DailyGoalOption = ({ minutes, label }: { minutes: number; label: string }) => (
    <TouchableOpacity
      style={[
        styles.goalOption,
        { 
          backgroundColor: dailyGoal === minutes ? colors.primary : colors.card,
          borderColor: dailyGoal === minutes ? colors.primary : colors.border,
        }
      ]}
      onPress={() => {
        setDailyGoal(minutes);
        uiHaptics.tabSelection();
      }}
    >
      <Text style={[
        styles.goalMinutes,
        { color: dailyGoal === minutes ? 'white' : colors.text }
      ]}>
        {minutes}
      </Text>
      <Text style={[
        styles.goalLabel,
        { color: dailyGoal === minutes ? 'white' : colors.textSecondary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          opacity: fadeAnim 
        }
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.celebration, { color: colors.primary }]}>
            🎉 You ARE an Artist! 🎉
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Let's Set Up Your Journey
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Quick questions to personalize your experience
          </Text>
        </View>

        {/* Daily Goal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Daily Drawing Goal ⏰
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            How many minutes can you practice each day?
          </Text>
          
          <View style={styles.goalGrid}>
            <DailyGoalOption minutes={5} label="Light" />
            <DailyGoalOption minutes={10} label="Regular" />
            <DailyGoalOption minutes={15} label="Serious" />
            <DailyGoalOption minutes={20} label="Intense" />
          </View>
          
          <View style={[styles.streakInfo, { backgroundColor: colors.card }]}>
            <Ionicons name="flame" size={24} color={colors.primary} />
            <Text style={[styles.streakText, { color: colors.text }]}>
              We'll remind you daily to keep your streak alive!
            </Text>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What do you want to draw? 🎨
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Select all that interest you (choose at least 2)
          </Text>
          
          <View style={styles.interestsGrid}>
            {interests.map(interest => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestCard,
                  { 
                    backgroundColor: interest.selected ? colors.primary : colors.card,
                    borderColor: interest.selected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                <Text style={[
                  styles.interestLabel,
                  { color: interest.selected ? 'white' : colors.text }
                ]}>
                  {interest.label}
                </Text>
                {interest.selected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            title="See Your First Lesson"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={interests.filter(i => i.selected).length < 2}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  celebration: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  goalGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  goalOption: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  goalMinutes: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalLabel: {
    fontSize: 12,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  streakText: {
    flex: 1,
    fontSize: 14,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    width: (width - 52) / 3, // 3 columns with gaps
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  interestEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    marginTop: 20,
  },
});