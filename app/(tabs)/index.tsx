import { Colors } from "@/constants/theme";
import TripCard from '@/src/components/tripCard';
import { useTripController } from '@/src/controllers/tripController';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type FilterTab = 'All' | 'Active' | 'Upcoming' | 'Completed';

const FILTER_TABS: FilterTab[] = ['All', 'Active', 'Upcoming', 'Completed'];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const { trips, fetchAllTrips, loading} = useTripController();

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const activeUpcoming = trips.filter((t) => {
    if (activeFilter === 'All') return t.tripStatus === 'Active' || t.tripStatus === 'Upcoming';
    if (activeFilter === 'Active') return t.tripStatus === 'Active';
    if (activeFilter === 'Upcoming') return t.tripStatus === 'Upcoming';
    return false;
  });

  const history = trips.filter((t) => {
    if (activeFilter === 'All') return t.tripStatus === 'Completed';
    if (activeFilter === 'Completed') return t.tripStatus === 'Completed';
    return false;
  });

  return (
    <View style = {{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      
      <View 
        style = {{ 
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12, 
        }}
      >
        <View>
          <Text style = {{ fontSize: 13, color: Colors.textSecondary, fontWeight: "500"}}>Welcome back, user</Text>
          <Text style = {{ fontSize: 26, fontWeight: "800", color: Colors.textPrimary, marginTop: 1 }}>My Trip</Text>
        </View>

        <TouchableOpacity style = {{width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgAccent, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name="notifications-outline" size = {22} color = {Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{ paddingHorizontal: 20, gap: 8, alignItems: "center"}} style = {{ marginBottom: 12, flexGrow: 0}}>

        {FILTER_TABS.map((tab) => {
          const focused = activeFilter === tab;
          return (
            <TouchableOpacity key ={tab} onPress = {() => setActiveFilter(tab)} style = {{ paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: focused ? Colors.filterActiveBg : Colors.filterInactiveBg }}>
              <Text style = {{ fontSize: 13, fontWeight: focused ? "600" : "500" ,color: focused ? Colors.filterActiveText : Colors.filterInactiveText,}}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={Colors.tabActive}/>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator = {false} style = {{ flex:1}} contentContainerStyle = {{paddingHorizontal: 20, paddingBottom: 24}}>

        {/* active & upcoming section */}
        {activeFilter !== 'Completed' && (
          <View style = {{ marginBottom: 20 }}>
            <View style = {{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12}}>
              <LinearGradient colors={ Colors.gradientSatellite} start = {{x:0, y:0}} end = {{x:1, y:1}} style={{borderRadius: 8, padding: 6}}>
                <Ionicons name="navigate" size = {20} color = "#fff" />
              </LinearGradient>
              <Text style = {{ fontSize: 17, fontWeight: "700", color: Colors.textPrimary }}>Active & Upcoming Trips</Text>
            </View>
            
            {activeUpcoming.length === 0 ? (
              <TouchableOpacity style = {{ alignItems: "center", justifyContent: "center", paddingVertical: 32, gap:10}}>
                <View style = {{width: 52, height: 52,  alignItems: "center", justifyContent: "center"}}>
                  <Ionicons name="add-circle-outline" size = {28} color= {Colors.textDisabled}/>
                </View>
                <View style = {{ alignItems: 'center', gap: 2}}>
                  <Text style = {{ fontSize: 15, color: Colors.textDisabled, fontWeight: "600"}}>Start a New Trip</Text>
                  <Text style = {{fontSize: 12, color: Colors.textDisabled}}>Let's create your adventure!</Text>
                </View>
              </TouchableOpacity>
              ) :(
                activeUpcoming.map((trip) => (
                  <TripCard key={trip.tripId}
                    trip={trip}
                    members={[]}
                    onPress={() => router.push({ pathname: "/trips/tripDetail", params: { tripId: trip.tripId } })}/>
                ))
              )}
          </View>
        )}

        {/* history section */}
        {activeFilter !== 'Active' && activeFilter !== 'Upcoming' && (
          <View style = {{ marginBottom: 20}}>
            <View style = {{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12}}>
              <LinearGradient colors = {Colors.gradientMap} start = {{x: 0, y:0}} end ={{x:1, y:1}} style = {{borderRadius: 8, padding: 6}}>
                <Ionicons name="map" size={16} color= "#fff"/>
              </LinearGradient>
              <Text style = {{fontSize: 17, fontWeight: "700", color: Colors.textPrimary}}>Trip History</Text>
            </View>
            
            {history.length === 0 ? (
              <View style = {{alignItems:"center", justifyContent: "center", paddingVertical: 32, gap: 10}}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="sad-outline" size={26} color={Colors.textDisabled} />
                </View>
                <View style = {{ alignItems: 'center', gap: 2}}>
                  <Text style = {{ fontSize: 15, color: Colors.textDisabled, fontWeight: "600"}}>No trips yet</Text>
                  <Text style = {{fontSize: 12, color: Colors.textDisabled}}>Your past adventures will appear here!</Text>
                </View>
              </View>
            ) : (
              history.map((trip) => (
                <TripCard key={trip.tripId}
                trip={trip}
                members={[]}
                onPress={() => router.push({ pathname: "/trips/tripDetail", params: { tripId: trip.tripId } })}/>
              ))
            )}
            
          </View>
        )}
      </ScrollView>
      )}  
    </View>
  );
}