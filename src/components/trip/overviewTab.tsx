import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { Trip } from "@/src/models/Trip";
import { TripMember } from "@/src/models/TripMember";

type Props = {
    trip: Trip;
    members: TripMember[];
};

function StatCard({ icon, value, label, iconColor}: {icon: keyof typeof Ionicons.glyphMap; value: string; label: string; iconColor: string}) {
    return (
        <View style = {{flex:1, backgroundColor: Colors.bgAccent, borderRadius: 12,padding: 12, alignItems: 'center', gap:4}}>
            <Ionicons name={icon} size={20} color={iconColor}/>
            <Text style= {{fontSize: 15, fontWeight: '700', color: Colors.textPrimary}}>{value}</Text>
            <Text style={{fontSize: 11, color:Colors.textSecondary}}>{label}</Text>
        </View>
    );
}

export default function OverviewTab({ trip, members}: Props) {
    return (
        <View style = {{gap: 16}}>

            <View style= {{ flexDirection: 'row', gap:12}}>
                <StatCard icon="camera-outline" value={`0`} label="Photos" iconColor={Colors.iconOrange}/>
                <StatCard icon="location-outline" value={`0`} label="Places" iconColor={Colors.iconOrange}/>
                <StatCard icon="pulse-outline" value={`0`} label="Activities" iconColor={Colors.iconOrange}/>
            </View>

            <View style={{backgroundColor: Colors.bgCard, borderRadius:16, padding: 16, shadowColor: '#000', shadowOffset:{width:0, height:1}, shadowOpacity:0.05, shadowRadius:4, elevation:1}}>

                <View style={{flexDirection: 'row', alignItems: 'center', gap:6, marginBottom: 12}}>
                    <Ionicons name="pin" size={20} color={Colors.iconOrange}/>
                    <Text style={{fontSize: 15, fontWeight:'700', color:Colors.textPrimary}}>Place Visited</Text>
                </View>

                <View style={{alignItems: 'center', paddingVertical: 16}}>
                    <Text style = {{fontSize: 13, color: Colors.textDisabled}}>Places will appear as you travel</Text>
                </View>
            </View>

        </View>
    );
}