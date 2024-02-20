import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, Text } from "react-native";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "react-native-toast-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoginScreen from "./(auth)/loginScreen";
import { router, useLocalSearchParams, usePathname } from "expo-router";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "(tabs)" };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isLoggedIn = true;
  // const nav = useLocalSearchParams();
  // console.log("=====", nav);
  return (
    <ThemeProvider value={DefaultTheme}>
      <ToastProvider
        placement="bottom"
        dangerIcon={<MaterialCommunityIcons name="close" color="#fff" />}
        successIcon={
          <MaterialCommunityIcons name="check" color="#fff" size={18} />
        }
        offset={10}
        duration={3000}
        animationDuration={100}
        renderType={{
          custom_toast: (toast) => (
            <View
              style={{
                maxWidth: "85%",
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: "#fff",
                marginVertical: 4,
                borderRadius: 8,
                borderLeftColor: "#00C851",
                borderLeftWidth: 6,
                justifyContent: "center",
                paddingLeft: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {toast.data.title}
              </Text>
              <Text style={{ color: "#a3a3a3", marginTop: 2 }}>
                {toast.message}
              </Text>
            </View>
          ),
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          {!isLoggedIn ? (
            <LoginScreen />
          ) : (
            <Drawer drawerContent={(props) => <Sidebar {...props} />}>
              <Drawer.Screen
                name="(tabs)"
                options={{ headerShown: true, title: "" }}
              />
            </Drawer>
          )}
        </GestureHandlerRootView>
      </ToastProvider>
    </ThemeProvider>
  );
}