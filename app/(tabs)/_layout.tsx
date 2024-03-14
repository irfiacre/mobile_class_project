import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import { useToast } from "react-native-toast-notifications";
import { generateRandomString } from "@/util/helpers";
import { handleSyncLocalToFirebase } from "@/util/handleFirebaseSync";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const toast = useToast();
  const { type, isConnected } = useNetInfo();

  useEffect(() => {
    if (isConnected !== null) {
      // Check for Internet availability
      const message = isConnected
        ? `${type} is connected successfully`
        : "Internet got disconnected";

      toast.show(message, {
        type: isConnected ? "success" : "danger",
        id: generateRandomString("toast"),
      });
      const syncLocal = async () => await handleSyncLocalToFirebase();
      if (isConnected) {
        syncLocal();
      } else {
        console.log(" Can not sync Data at the moment");
      }
    }
  }, [type, isConnected]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="calculator"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calculator-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="aboutUs"
        options={{
          tabBarLabel: "About Us",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="information"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
