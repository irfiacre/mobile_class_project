import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "react-native-toast-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoginScreen from "./loginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
export { ErrorBoundary } from "expo-router";
import { createUsersTable, openDatabase } from "@/services/usersService";
import { NativeBaseProvider } from "native-base";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/db/firestore";
import { createQuizTable } from "@/services/quizService";
import { createQuestionTable } from "@/services/questionService";
import { createAnswersTable } from "@/services/answersService";
import Loading from "@/components/Loading";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@/services/constants";

WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync();

const db = openDatabase();

const ProviderContainer = (props: any) => {
  const { children } = props;
  return (
    <ThemeProvider value={DefaultTheme}>
      <NativeBaseProvider>
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
          {children}
        </ToastProvider>
      </NativeBaseProvider>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  useEffect(() => {
    createUsersTable(db);
    createQuizTable(db);
    createQuestionTable(db);
    createAnswersTable(db);
    createUsersTable(db);
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credentials = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credentials);
    }
  }, [response]);
  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (error) {
      console.log(" Check Local User error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
        console.log("No user");
      }
    });
    return () => unsub();
  }, []);

  if (!loaded) {
    return null;
  }
  if (loading) return <Loading />;
  return userInfo ? (
    <ProviderContainer>
      <RootLayoutNav userInfo={userInfo} />
    </ProviderContainer>
  ) : (
    <ThemeProvider
      value={DefaultTheme}
      children={
        <NativeBaseProvider>
          <LoginScreen promptAsync={promptAsync} />
        </NativeBaseProvider>
      }
    />
  );
}

const RootLayoutNav = (props: any) => {
  const { userInfo } = props;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <Sidebar userInfo={userInfo} {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{ headerShown: true, title: "" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};
