import { Tabs } from "expo-router";
import React, {useEffect, useRef} from "react";
import { View, Text,Platform, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/theme";
import { Ionicons,FontAwesome6 } from "@expo/vector-icons";

type TabConfig = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  library: "Ionicons" | "FontAwesome6";
  
};

const TABS: TabConfig[] = [
  { name: "index", label: "Home", icon: "home-outline", library: 'Ionicons' },
  { name: "leaderboard", label: "Ranking", icon: "trophy-outline", library: 'Ionicons' },
  { name: "create", label: "Create", icon: "add-circle-outline", library: 'Ionicons' },
  { name: "friends", label: "Friends", icon: "people-outline", library: 'Ionicons' },
  { name: "profile", label: "Profile", icon: "circle-user", library: 'FontAwesome6' },
];

function TabIcon({
  iconName,
  label,
  focused,
  library,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  library: "Ionicons" | "FontAwesome6";
}) {

  const translateY = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const labelHeight = useRef(new Animated.Value(0)).current;

  useEffect(()=> {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: focused ? -4:0,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.timing(labelOpacity, {
        toValue: focused ? 1:0,
        duration: 180,
        useNativeDriver: true, 
      }),
      Animated.spring(labelHeight, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={{ flex:1, alignItems: "center", justifyContent: "center", gap: 2, marginBottom:-30}}>
      {focused && (
        <LinearGradient
          colors={[`${Colors.tabGlow}00`, `${Colors.tabGlow}66`]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{position: "absolute", top: -6, left: -32, right: -32, bottom: -4, borderRadius: 148}}
        />
      )}
      <Animated.View style ={{ alignItems: "center", transform: [{translateY}]}}>
        {library === "Ionicons" ? (
          <Ionicons
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={24}
            style={{marginTop: 1}}
            color={focused ? Colors.tabActive : Colors.tabInactive}
          />
        ) : (
          <FontAwesome6
            name={iconName as any}
            size={21}
            color={focused ? Colors.tabActive : Colors.tabInactive}
          />
        )}
        <Animated.Text numberOfLines={1}  style= {{ width:48, fontSize: 10, fontWeight:"700", color: Colors.tabActive, margin: 2, textAlign: "center", opacity: labelOpacity, transform:[{ scaleY: labelHeight}]}}>{label}</Animated.Text>
      </Animated.View>
    </View>
  );
}

function TabBarBackground() {
  return (
    <View
      style = {{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        backgroundColor: Colors.bgPrimary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#6e3a0f',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 16,
      }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => <TabBarBackground />,
        sceneStyle: {backgroundColor: Colors.bgPrimary},
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 70: 56,
          paddingBottom: Platform.OS === 'ios' ? 12 :6,
          paddingTop: 6,
          paddingHorizontal: 4
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
        key = {tab.name}
        name = {tab.name}
        options = {{
          tabBarIcon: ({focused}) => (
            <TabIcon iconName = {tab.icon} label = {tab.label} focused = {focused} library={tab.library} />
          )
        }}
        />
      ))}
      
    </Tabs>
  );
}