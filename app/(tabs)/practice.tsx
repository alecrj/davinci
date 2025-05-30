import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { DrawAnythingCanvas } from '@/components/drawing/DrawAnythingCanvas';
import { MagicTransformation } from '@/components/drawing/MagicTransformation';
import { Button } from '@/components/ui/Button';

const { width: screenWidth } = Dimensions.get('window');

const drawingPrompts = [
  { id: '1', prompt: 'Draw a happy sun', icon: '☀️' },
  { id: '2', prompt: 'Draw a simple house', icon: '🏠' },
  { id: '3', prompt: 'Draw a smiling face', icon: '😊' },
  { id: '4', prompt: 'Draw a heart', icon: '❤️' },
  { id: '5', prompt: 'Draw a tree', icon: '🌳' },
  { id: '6', prompt: 'Draw a star', icon: '⭐' },
];

export default function PracticeScreen() {
  const { theme } = useTheme();
  const [currentPrompt, setCurrentPrompt] = useState(drawingPrompts[0]);
  const [showTransformation, setShowTransformation] = useState(false);
  const [detectedShape, setDetectedShape] = useState<string | null>(null);
  const canvasRef = useRef<any>(null);

  const handleShapeDetected = (shape: string) => {
    setDetectedShape(shape);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setDetectedShape(null);
    setShowTransformation(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleTransform = () => {
    if (detectedShape) {
      setShowTransformation(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePromptSelect = (prompt: typeof drawingPrompts[0]) => {
    setCurrentPrompt(prompt);
    handleClear();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRandomPrompt = () => {
    const otherPrompts = drawingPrompts.filter(p => p.id !== currentPrompt.id);
    const randomPrompt = otherPrompts[Math.floor(Math.random() * otherPrompts.length)];
    handlePromptSelect(randomPrompt);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Free Drawing Practice
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Express yourself without limits
          </Text>
        </View>

        {/* Current Prompt */}
        <View style={[styles.promptCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.promptHeader}>
            <Text style={[styles.promptLabel, { color: theme.colors.text }]}>
              Today's Prompt
            </Text>
            <TouchableOpacity onPress={handleRandomPrompt}>
              <Ionicons name="shuffle" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.promptContent}>
            <Text style={styles.promptIcon}>{currentPrompt.icon}</Text>
            <Text style={[styles.promptText, { color: theme.colors.text }]}>
              {currentPrompt.prompt}
            </Text>
          </View>
        </View>

        {/* Drawing Canvas */}
        <View style={styles.canvasSection}>
          <DrawAnythingCanvas
            ref={canvasRef}
            onShapeDetected={handleShapeDetected}
            style={[styles.canvas, { backgroundColor: theme.colors.card }]}
          />
          
          {detectedShape && (
            <View style={[styles.detectionBadge, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.detectionText}>
                {detectedShape} detected!
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Clear"
            onPress={handleClear}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Transform ✨"
            onPress={handleTransform}
            variant="primary"
            disabled={!detectedShape}
            style={styles.actionButton}
          />
        </View>

        {/* Quick Prompts */}
        <View style={styles.quickPrompts}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Ideas
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsContainer}>
            {drawingPrompts.map((prompt) => (
              <TouchableOpacity
                key={prompt.id}
                style={[
                  styles.promptChip,
                  { 
                    backgroundColor: prompt.id === currentPrompt.id 
                      ? theme.colors.primary 
                      : theme.colors.card 
                  }
                ]}
                onPress={() => handlePromptSelect(prompt)}>
                <Text style={styles.promptChipIcon}>{prompt.icon}</Text>
                <Text style={[
                  styles.promptChipText,
                  { 
                    color: prompt.id === currentPrompt.id 
                      ? 'white' 
                      : theme.colors.text 
                  }
                ]}>
                  {prompt.prompt.replace('Draw ', '')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="bulb-outline" size={24} color={theme.colors.warning} />
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
              Pro Tip
            </Text>
            <Text style={[styles.tipsText, { color: theme.colors.text }]}>
              Don't worry about perfection! The magic happens when you let your creativity flow.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Transformation Modal */}
      {showTransformation && detectedShape && (
        <MagicTransformation
          shape={detectedShape}
          onClose={() => setShowTransformation(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  promptCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  promptLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  promptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  promptIcon: {
    fontSize: 36,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  canvasSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  canvas: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  detectionText: {
    color: 'white',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
  },
  quickPrompts: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  promptsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  promptChipIcon: {
    fontSize: 20,
  },
  promptChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipsCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    gap: 15,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});