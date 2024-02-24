import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { View as CustomView } from "@/components/Themed";
import { useRouter } from "expo-router";
const ContactDetails = (props: any) => {
  const { name, email, id } = props;
  const router = useRouter();

  return (
    <View>
      <Pressable
        style={styles.contact}
        onPress={() =>
          router.push({
            pathname: "/contacts/[id]",
            params: { id: id },
          })
        }
      >
        <View style={styles.contactDetails}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email || "No email"}</Text>
        </View>
      </Pressable>
      <CustomView style={styles.separator} customColor="#eee" />
    </View>
  );
};

export default ContactDetails;

const styles = StyleSheet.create({
  contact: {
    flex: 1,
    padding: 5,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: { padding: 10, borderRadius: 50 },
  contactDetails: { padding: 10 },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  email: {
    fontSize: 18,
    fontWeight: "400",
    color: "grey",
    paddingBottom: 10,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
