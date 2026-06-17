import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function ActivitiesTab() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 }}>
      <Ionicons name="radio-outline" size={52} color={Colors.textDisabled} />
      <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textDisabled }}>
        Activities will be detected automatically
      </Text>
      <Text style={{ fontSize: 13, color: Colors.textDisabled, textAlign: 'center' }}>
        Based on stops, location types and duration
      </Text>
    </View>
  );
}