/**
 * EditScreenInfo Component
 * Temporary component for Expo default template compatibility
 */

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';

export interface EditScreenInfoProps {
  path: string;
}

export default function EditScreenInfo({ path }: EditScreenInfoProps) {
  const { colors } = useTheme();
  
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={[styles.getStartedText, { color: colors.textSecondary }]}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <Text style={[styles.codeHighlightText, { color: colors.text }]}>
            {path}
          </Text>
        </View>

        <Text
          style={[styles.getStartedText, { color: colors.textSecondary }]}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity 
          style={styles.helpLink} 
          onPress={() => {
            console.log('Help link pressed');
          }}
        >
          <Text style={[styles.helpLinkText, { color: colors.primary }]} lightColor="#2e78b7">
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  codeHighlightText: {
    fontSize: 17,
    fontFamily: 'SpaceMono',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});