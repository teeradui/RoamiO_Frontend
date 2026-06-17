import { Colors } from '@/constants/theme';
import { Trip } from '@/src/models/Trip';
import { TripMember } from '@/src/models/TripMember';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    trip: Trip;
    members: TripMember[];
    onPress: () => void;
};

function getDisplayStatus(trip: Trip): 'Upcoming' | 'Active' | 'Completed' {
    if (trip.tripStatus === 'Completed') return 'Completed';
    
    const now = new Date();
    const start = new Date(trip.startTime);
    const end = new Date(trip.endTime);
    
    if (now > end) return 'Completed';
    if (now >= start) return 'Active';
    return 'Upcoming';
}

function StatusBadge({status} : {status: 'Upcoming' | 'Active' | 'Completed'}) {
    const config = {
        Upcoming: {bg: Colors.bgUpcoming, text: Colors.textUpcoming, label: 'Up Coming', icon: 'time-outline'},
        Active: {bg: Colors.bgActive, text: Colors.textActive, label: 'Active', icon:'navigate-outline'},
        Completed: {bg: Colors.bgCompleted, text: Colors.textCompleted, label: 'Completed', icon:'checkmark-circle-outline'}
    } as const;

    const s = config[status];

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: s.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4}}>
            <Ionicons name={s.icon} size={12} color={s.text}/>
            <Text style={{fontSize: 12, fontWeight: '600', color:s.text}}>{s.label}</Text>
        </View>
    );
}

function MemberAvatars({members}: {members: TripMember[]}) {
    const MAX = 5;
    const shown = members.slice(0, MAX);
    const extra = members.length - MAX;

    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
            {shown.map((member, index) => (
                <View key={member.participantId} style={{width: 28, height:28, borderRadius:14, backgroundColor: Colors.bgAccent, borderWidth: 2, borderColor: Colors.bgCard, marginLeft: index === 0 ? 0 : -10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', zIndex: shown.length - index,}}>
                    {member.profileImage ? (
                        <Image source={{uri: member.profileImage}} style={{width: 28, height: 28, borderRadius: 14}}/>
                    ) : (
                        <Ionicons name="person" size={14} color={Colors.textMuted}/>
                    )}
                </View>
            ))}

            {extra > 0 && (
                <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bgHighlight, borderWidth: 2, borderColor: Colors.bgCard, marginLeft: -8, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style = {{ fontSize: 10, fontWeight: '700', color: Colors.textSecondary}}>
                        +{extra}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default function TripCard({trip, members, onPress}: Props ){
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month:'short', year: 'numeric'});

    const destination = trip.tripDestination;

    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: Colors.bgCard, borderRadius: 20, padding: 12, flexDirection: 'row', gap: 12, shadowColor: '#000', shadowOffset:{width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, marginBottom: 12}}>
            <View style = {{width: 100, height: 110, borderRadius: 14, overflow: 'hidden',backgroundColor: Colors.bgAccent}}>
                {trip.imageUrl ? (
                    <Image source={{ uri: trip.imageUrl}} style = {{width: 100, height: 110}} resizeMode="cover"/>
                ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="image-outline" size={32} color={Colors.textMuted}/>
                    </View>
                )}
            </View>

            <View style={{flex: 1}}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4}}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, flex: 1}} numberOfLines={1}>
                        {trip.tripName}
                    </Text>
                    <StatusBadge status={getDisplayStatus(trip)}/>
                </View>

                <Text style={{fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6}}>
                    {destination}
                </Text>

                <View style={{ flexDirection: 'row', alignItems:'center', gap: 4, marginBottom: 6}}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.iconBrown}/>
                    <Text style={{fontSize: 12, color: Colors.textSecondary}}>
                        {formatDate(trip.startTime)}
                    </Text>
                </View>

                {/*กลับมาใส่ฟังก์ชันตรงเลขด้วย */}
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        <Ionicons name="camera-outline" size={13} color={Colors.iconBrown}/>
                        <Text style={{fontSize: 12, color: Colors.textSecondary}}>0</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        <Ionicons name="location-outline" size={13} color={Colors.iconBrown}/>
                        <Text style={{fontSize: 12, color: Colors.textSecondary}}>0</Text>
                    </View>
                </View>

                <MemberAvatars members={members}/>
            </View>
        </TouchableOpacity>
    );
}