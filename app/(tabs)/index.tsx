import React, {useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type FilterTab = 'All' | 'Active' | 'Upcoming' | 'Completed';

const FILTER_TABS: FilterTab[] = ['All', 'Active', 'Upcoming', 'Completed'];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

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
            
            {/*empty state*/}
            <TouchableOpacity style = {{ alignItems: "center", justifyContent: "center", paddingVertical: 32, gap:10}}>
              <View style = {{width: 52, height: 52,  alignItems: "center", justifyContent: "center"}}>
                <Ionicons name="add-circle-outline" size = {28} color= {Colors.textDisabled}/>
              </View>
              <View style = {{ alignItems: 'center', gap: 2}}>
                <Text style = {{ fontSize: 15, color: Colors.textDisabled, fontWeight: "600"}}>Start a New Trip</Text>
                <Text style = {{fontSize: 12, color: Colors.textDisabled}}>Let's create your adventure!</Text>
              </View>
              
            </TouchableOpacity>
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

            {/*empty state*/}
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}