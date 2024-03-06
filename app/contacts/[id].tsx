import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { View as CustomView } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const KeyElt = (props: { text: string; value: string }) => {
  const { text, value } = props;
  return (
    <View style={{ flexDirection: "row", padding: 5, paddingHorizontal: 10 }}>
      <Text
        style={{
          fontWeight: "700",
          paddingRight: 10,
          textTransform: "capitalize",
        }}
      >
        {text}:
      </Text>
      <Text>{value}</Text>
    </View>
  );
};

const ContactScreen = () => {
  const { id } = useLocalSearchParams();
  const [contactState, setContactState] = useState<any>({});
  const randomImg = `https://i.stack.imgur.com/l60Hf.png`;
  let contactInfo: any;
  const router = useRouter();
  useEffect(() => {
    (async () => {
      contactInfo = await Contacts.getContactByIdAsync(id.toString());
      setContactState(contactInfo);
    })();
  }, []);
  console.log("----", contactState);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/contacts/")}>
        <MaterialIcons
          name="chevron-left"
          size={32}
          style={{ color: "#1d78d6", paddingTop: 10, paddingBottom: 15 }}
        />
      </Pressable>
      {contactState.name ? (
        <View>
          <View style={styles.section1}>
            <View style={styles.thumbnail}>
              <Image
                source={{ uri: `${contactState.image?.uri || randomImg}` }}
                style={{ width: 150, height: 150, borderRadius: 6 }}
              />
            </View>
            <View>
              <Text style={styles.title}>{contactState.name}</Text>
              {contactState.nickname && (
                <KeyElt text="nickname" value={contactState.nickname} />
              )}
              {contactState.birthday && (
                <KeyElt
                  text="born"
                  value={`${contactState.birthday.day}/${contactState.birthday.month}/${contactState.birthday.year}`}
                />
              )}
            </View>
          </View>
          <CustomView style={styles.separator} customColor="#1d78d6" />
          <View>
            <Text style={styles.subTitle}>Information</Text>
            {contactState.emails && (
              <KeyElt text="Email" value={contactState.emails[0]?.email} />
            )}

            {contactState.phoneNumbers?.map((phoneNbrElt: any) => (
              <View key={phoneNbrElt.digits}>
                <KeyElt text={phoneNbrElt.label} value={phoneNbrElt.digits} />
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.subTitle}>Address</Text>
            {contactState.addresses?.map((addressElt: any) => (
              <View key={addressElt.id}>
                <Text>
                  {" "}
                  {addressElt.city}, {addressElt.isoCountryCode}{" "}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
    paddingHorizontal: 16,
  },
  section1: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1d78d6",
    padding: 5,
    flexWrap: "wrap",
    width: "95%",
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 5,
    color: "#1d78d6",
    padding: 5,
  },
  separator: {
    marginBottom: 30,
    height: 3,
    width: "100%",
    opacity: 0.5,
  },
  thumbnail: { padding: 10 },
});
