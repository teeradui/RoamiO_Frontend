import { Colors } from '@/constants/theme';
import { useTripController } from '@/src/controllers/tripController';
import { useTripMemberController } from '@/src/controllers/tripMemberController';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ActivitiesTab from '@/src/components/trip/activitiesTab';
import ExpensesTab from '@/src/components/trip/expensesTab';
import MapTab from '@/src/components/trip/mapTab';
import MembersTab from '@/src/components/trip/membersTab';
import OverviewTab from '@/src/components/trip/overviewTab';
import PhotosTab from '@/src/components/trip/photosTab';

type Tab = 'Overview' | 'Map' | 'Activities' | 'Photos' | 'Expenses' | 'Members';
const TABS: Tab[] = ['Overview', 'Map', 'Activities', 'Photos', 'Expenses', 'Members'];

export default function TripDetailScreen() {
  //const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { tripId } = useLocalSearchParams();
  const id = Number(tripId);

  const { trips, fetchAllTrips, deleteTrip, updateTripStatus, loading } = useTripController();
  const { members, fetchMembers } = useTripMemberController(id);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const trip = trips.find((t) => t.tripId === id) ?? null;

  useEffect(() => {
    fetchAllTrips();
    fetchMembers();
  }, [id]);

  const handleEndTrip = () => {
    Alert.alert(
        'End Trip',
        `Are you sure you want to end "${trip?.tripName}"?`,
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'End Trip',
                style: 'destructive',
                onPress: async () => {
                    await updateTripStatus(id, 'Completed');
                    await fetchAllTrips();
                },
            },
        ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${trip?.tripName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTrip(id);
            if (success) router.replace('/(tabs)')
          },
        },
      ]
    );
  };

  if (loading || !trip) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.tabActive} />
      </SafeAreaView>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <SafeAreaView style = {{ flex:1, backgroundColor: Colors.bgPrimary}}>
        <View style = {{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8}}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: Colors.textPrimary }}>
            {trip.tripName}
          </Text>
          {trip.tripStatus === 'Active' && (
          <TouchableOpacity
              onPress={handleEndTrip}
              style={{ height: 34, borderRadius: 17, backgroundColor: '#FFE5E5', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, flexDirection: 'row', gap: 4 }}
          >
              <Ionicons name="stop-circle-outline" size={16} color={Colors.iconOrange} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.iconOrange }}>End Trip</Text>
          </TouchableOpacity>
          )}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {trip.tripStatus !== 'Active' && (
            <TouchableOpacity onPress={handleDelete} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFE5E5', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="trash-outline" size={18} color={Colors.iconOrange} />
            </TouchableOpacity>
            )}
            <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="share-outline" size={18} color={Colors.iconBrown} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style = {{ margin: 16, backgroundColor: Colors.bgCard2, borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>

            {trip.imageUrl ? (
              <Image source={{ uri: trip.imageUrl }} style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 12 }} />
            ) : (
              <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="image-outline" size={32} color={Colors.textDisabled} />
              </View>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.textPrimary }}>
                {trip.tripDestination}
              </Text>
              <TouchableOpacity onPress = {() => router.push({ pathname: "/trips/edit", params: { tripId: id.toString() } })}>
              <Ionicons name="pencil-outline" size={16} color={Colors.iconBrown} />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: Colors.bgHighlight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary }}>
                Starts {formatDateTime(trip.meetUpTime)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Ionicons name="calendar-outline" size={14} color={Colors.iconBrown} />
              <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                {formatDate(trip.startTime)} — {formatDate(trip.endTime)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <Ionicons name="location-outline" size={14} color={Colors.iconBrown} />
              <Text style={{ fontSize: 13, color: trip.meetingPoint ? Colors.textSecondary : Colors.textDisabled }}>
                {trip.meetingPoint ?? "Didn't set the meeting point"}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginBottom: 16 }}>
              <View style={{ flex: 1, backgroundColor: Colors.bgAccent, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Ionicons name="navigate-outline" size={20} color={Colors.iconBrown} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 }}>0 km</Text>
                <Text style={{ fontSize: 11, color: Colors.textSecondary }}>Distance</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: Colors.bgAccent, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Ionicons name="wallet-outline" size={20} color={Colors.iconOrange} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 }}>$ 0.0</Text>
                <Text style={{ fontSize: 11, color: Colors.textSecondary }}>Spent</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              {members.length === 0 ? (
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bgCard }}>
                  <Ionicons name="person-outline" size={18} color={Colors.textDisabled} />
                </View>
              ) : (
                members.slice(0, 5).map((member, index) => (
                  <View
                    key={member.participantId}
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bgCard, marginLeft: index === 0 ? 0 : -10 }}
                  >
                    <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
                  </View>
                ))
              )}
            </View>
          </View>

            {/* Tab Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 4 }} style={{ marginBottom: 12 }}>
            {TABS.map((tab) => {
              const focused = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: focused ? Colors.filterActiveBg : 'transparent' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: focused ? '700' : '500', color: focused ? Colors.filterActiveText : Colors.textMuted }}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
            {activeTab === 'Overview'    && <OverviewTab trip={trip} members={members} />}
            {activeTab === 'Map'         && <MapTab trip={trip} members={members} />}
            {activeTab === 'Activities'  && <ActivitiesTab trip={trip}/>}
            {activeTab === 'Photos'      && <PhotosTab />}
            {activeTab === 'Expenses'    && <ExpensesTab trip={trip} members={members} />} 
            {activeTab === 'Members'     && <MembersTab trip={trip} members={members} onRefresh={fetchMembers} />}
          </View>
        </ScrollView>
    
    </SafeAreaView>
  )

}