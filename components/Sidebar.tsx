import React from "react";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { router, useNavigation } from "expo-router";
import { View as ViewCustom } from "@/components/Themed";
import { useRouteInfo } from "expo-router/build/hooks";

const Sidebar = ({ ...props }) => {
  const { userInfo, handleLogout } = props;
  const routerInfo = useRouteInfo();
  const listArrayItem = [
    {
      icon: <MaterialCommunityIcons name="home" size={24} color="#1d78d6" />,
      title: "Home",
      url: "/",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="calculator-variant"
          size={24}
          color="#1d78d6"
        />
      ),
      title: "Calculator",
      url: "/calculator",
    },
    {
      icon: (
        <MaterialCommunityIcons name="information" size={24} color="#1d78d6" />
      ),
      title: "About us",
      url: "/aboutUs",
    },
    {
      icon: (
        <MaterialCommunityIcons name="contacts" size={24} color="#1d78d6" />
      ),
      title: "Contacts",
      url: "/contacts",
    },
    {
      icon: <MaterialCommunityIcons name="image" size={24} color="#1d78d6" />,
      title: "Gallery",
      url: "/gallery",
    },
    {
      icon: <MaterialCommunityIcons name="book" size={24} color="#1d78d6" />,
      title: "Quiz",
      url: "/quiz",
    },
  ];

  const Item = ({
    title,
    icon,
    handlePress,
    color,
  }: {
    title: string;
    icon: any;
    handlePress: any;
    color: string;
  }) => (
    <TouchableOpacity onPress={handlePress} style={styles.item}>
      <View>
        <Text>{icon}</Text>
      </View>
      <Text style={[styles.title, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => {
    const color = routerInfo.pathname.includes(item.url) ? "#1d78d6" : "black";

    return (
      <Item
        handlePress={() =>
          router.push({
            pathname: item.url,
          })
        }
        title={item.title}
        color={color}
        icon={item.icon}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <View
        style={{ justifyContent: "center", alignItems: "center", flex: 0.3 }}
      >
        {userInfo?.picture ? (
          <View style={styles.thumbnail}>
            <Image
              source={{ uri: userInfo?.picture }}
              style={{ width: 80, height: 80, borderRadius: 50 }}
            />
          </View>
        ) : (
          <FontAwesome6
            name="circle-user"
            size={80}
            style={styles.profilePic}
          />
        )}
        <ViewCustom style={styles.separator} customColor="#eee" />
        <Text style={styles.userFullName}>{userInfo?.name || "John Doe"}</Text>
        <ViewCustom style={styles.separator} customColor="#eee" />
      </View>

      <View style={{ flex: 0.55, alignItems: "center" }}>
        <FlatList data={listArrayItem} renderItem={renderItem} />
      </View>
      <TouchableOpacity
        style={{ flex: 0.05, alignItems: "center" }}
        onPress={() => handleLogout()}
      >
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: "",
    paddingVertical: 5,
    marginVertical: 5,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 18,
    marginLeft: 20,
    paddingLeft: 0,
    color: "#1d78d6",
  },
  profilePic: {
    padding: 20,
    color: "#1d78d6",
  },
  userFullName: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1d78d6",
    padding: 20,
    textTransform: "capitalize",
  },
  separator: {
    height: 1,
    width: "80%",
  },
  thumbnail: { padding: 10 },
});
