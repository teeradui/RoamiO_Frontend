import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

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

export default function SuccessScreen() {
    const params = useLocalSearchParams();

    const tripName = params.tripName as string;
    const meetupTime = params.meetupTime as string;

    const formatTime = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit"});
    };

    return (
        <SafeAreaView style = {{ flex: 1, backgroundColor: Colors.bgPrimary}}>
            <View style = {{flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 16, marginBottom: 12}}>
                <TouchableOpacity onPress = {() => router.back()} style = {{ padding: 4}}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style = {{ flex: 1, textAlign: "center", fontSize: 22, fontWeight: "700", color:Colors.textPrimary}}>Create Trip</Text>
                <View style = {{ width: 32}} />
            </View>

            <StepIndicator current={2} />

            <ScrollView showsVerticalScrollIndicator = {false} contentContainerStyle = {{paddingHorizontal: 24, paddingBottom: 40, alignItems: "center"}}>

                <LottieView source={require("@/assets/animations/Travelisfun.json")} autoPlay loop={true} style = {{ width: 260, height: 200}} />

                <Text style = {{fontSize: 24, fontWeight: "700", color: Colors.textPrimary, marginTop: 8, marginBottom: 8,}}>Trip Created Successfully!</Text>
                <Text style = {{ fontSize: 14, color:Colors.textSecondary, marginBottom: 4,}}>{tripName} is ready for your adventure!</Text>
                <Text style = {{ fontSize: 14, color:Colors.textSecondary, marginBottom: 24,}}>Tracking will start at {formatTime(meetupTime)}</Text>

                <View style={{ backgroundColor: "#E8F4FB", borderRadius: 16, padding: 16, marginBottom: 12, width: "100%", }} > 
                    <Text style={{ fontSize: 13, color: "#2C7DA0", textAlign: "center", lineHeight: 20, }} > 
                        📡 GPS tracking activates at trip start time. Activities and locations will be detected automatically. 
                    </Text> 
                </View>

                <View style={{ backgroundColor: "#FEF0E7", borderRadius: 16, padding: 16, marginBottom: 32, width: "100%", }} > 
                    <Text style={{ fontSize: 13, color: "#C46A2A", textAlign: "center", lineHeight: 20, }} > 
                        🔔 Invited friends will receive a notification. A reminder will be sent before the trip starts. 
                    </Text> 
                </View>

                <TouchableOpacity onPress={() => router.push("/trips")} style = {{ backgroundColor: Colors.btnPrimary, borderRadius: 30, paddingVertical: 16, width: "100%", alignItems: "center", marginBottom: 12}}>
                    <Text style = {{fontSize: 16, fontWeight: "700", color: Colors.bgPrimary}}>View Trips</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace("/")} style = {{ backgroundColor: Colors.btnSecondary, borderRadius: 30, paddingVertical: 16, width: "100%", alignItems: "center", borderWidth: 1, borderColor: Colors.textDisabled}}>
                    <Text style = {{fontSize: 16, fontWeight: "700", color: Colors.btnPrimary}}>Go Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}