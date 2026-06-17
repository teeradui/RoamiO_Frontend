import React from "react";
import {View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function PhotoTab() {
    return (
        <View style = {{gap: 12}}>
            <TouchableOpacity style={{ backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity: 0.05, shadowRadius: 4, elevation:1}}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="images-outline" size={20} color={Colors.iconOrange} />
                    </View>
                    <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textPrimary }}>
                        Select Photo Album
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>
                        Please select photo album before your trip start
                    </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 }}>
                <Ionicons name="camera-outline" size={52} color={Colors.textDisabled} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textDisabled }}>
                    No photos yet
                </Text>
                <Text style={{ fontSize: 13, color: Colors.textDisabled, textAlign: 'center' }}>
                    Photos will be imported automatically from your album
                </Text>
            </View>
        </View>
    );
}