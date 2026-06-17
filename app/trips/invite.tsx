import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTripInviteController } from "@/src/controllers/tripInviteController";
import * as Clipboard from 'expo-clipboard';

function StepIndicator({ current }: { current: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginHorizontal: 24,
        marginBottom: 20,
      }}
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor:
              i === current ? Colors.stepActive : Colors.stepInactive,
          }}
        />
      ))}
    </View>
  );
}

export default function InviteScreen() {
    const params = useLocalSearchParams();
    const [SelectedFriends, setSelectedFriends] = useState<string[]>([]);

    const handleCopyLink = async () => {
        const link = `roamio://trips/${params.tripId}?tripName=${encodeURIComponent(params.tripName as string)}&invitedBy=${encodeURIComponent('username')}`;
        await Clipboard.setStringAsync(link);
    };

    const toggleFriend = (id: string) => {
        setSelectedFriends((prev) =>
            prev.includes(id) ? prev.filter((friendId) => friendId !== id) : [...prev, id]
        );
    };

    const memberCount = 1 + SelectedFriends.length;

    const tripId = Number(params.tripId);
    const { sendInvite } = useTripInviteController(tripId);

    const handleCreate = async () => {
        router.push({
            pathname: "/trips/success",
            params: {
                tripId: params.tripId,
                tripName: params.tripName,
                meetupTime: params.meetupTime
            },
        });
    };

    return (
        <SafeAreaView style = {{ flex: 1, backgroundColor: Colors.bgPrimary}}>
            <View style  = {{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 16, marginBottom: 12}}>
                <TouchableOpacity onPress = {() => router.back()} style = {{ padding: 4}}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style = {{ flex: 1, textAlign: "center", fontSize: 22, fontWeight: "700", color:Colors.textPrimary}}>Create Trip</Text>
                <View style = {{ width: 32}} />
            </View>

            <StepIndicator current={1} />

            <ScrollView showsVerticalScrollIndicator = {false} contentContainerStyle= {{ paddingHorizontal: 24, paddingBottom: 40}}>
                <Text style = {{fontSize: 20, fontWeight: "500", color:Colors.textPrimary, marginBottom: 16}}>Invite Friends</Text>

                <View style = {{backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4, elevation:1}}>
                    <View style = {{width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bgHighlight + "80", alignItems: "center", justifyContent: "center", marginRight:12}}>
                        <Ionicons name="link-outline" size={22} color={Colors.textSecondary} />
                    </View>
                    <View style = {{ flex: 1}}>
                        <Text style = {{fontSize: 15, fontWeight: "600", color: Colors.textPrimary}}>Share Invite Link</Text>
                        <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>roamio://trips/{params.tripId}?tripName={params.tripName}&invitedBy=username</Text>
                    </View>
                    <TouchableOpacity onPress={handleCopyLink}>
                        <Ionicons name="copy-outline" size={20} color={Colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <View style = {{ backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 20, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4, elevation:1}}>
                    <View style = {{width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bgAccent, alignItems: "center", justifyContent: "center", marginRight:12}}>
                        <Ionicons name="people-outline" size={22} color={Colors.textSecondary}/>
                    </View>
                    <View style ={{flex:1}}>
                    <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.textPrimary }}>
                            You
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>
                            Trip Creator
                        </Text> 
                    </View>
                    <View style = {{width:28, height:28, borderRadius:14, backgroundColor: Colors.green, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="checkmark" size={20} color= "#fff" />
                    </View>
                </View>
                
                <Text style ={{ fontSize: 15, fontWeight: "700", color: Colors.textPrimary, marginBottom:12}}> From Your Friends</Text>

                {/*Empty state*/}
                <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12, }} > 
                    <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.textDisabled, alignItems: "center", justifyContent: "center", }} > 
                        <Ionicons name="people-outline" size={28} color={Colors.textDisabled} /> 
                    </View> 
                    <Text style={{ fontSize: 14, color: Colors.textDisabled, fontWeight: "500" }}> 
                        No friends yet 
                    </Text> 
                </View>

                <Text style = {{textAlign : "center", fontSize: 13, color: Colors.textMuted, marginBottom:20}}>
                    {memberCount} member{memberCount > 1 ? "s" : ""} will be added to the trip
                </Text>

                <TouchableOpacity onPress={handleCreate} style={{ backgroundColor: Colors.btnPrimary, paddingVertical: 16, borderRadius: 30, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{ color: Colors.bgPrimary, fontSize: 16, fontWeight: "700" }}>Create Trip</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}