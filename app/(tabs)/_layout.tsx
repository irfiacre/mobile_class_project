import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            // <TabBarIcon name="code" color={color} />
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
