import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import ContactDetails from "@/components/ContactDetails";
import { generateRandomString } from "@/util/helpers";

const ContactScreen = () => {
  const [contacts, setContacts] = useState<any>([]);

  useEffect(() => {
    const listOfContacts: any = [];
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          for (let contact in data) {
            const formatedContact: any = {
              name: `${data[contact]?.firstName} ${data[contact]?.lastName}`,
              email: data[contact]?.emails ? data[contact].emails : [],
              thumbnail: data[contact].image,
              contactType: data[contact]?.contactType,
              id: data[contact]?.id,
            };
            listOfContacts.push(formatedContact);
          }
        }
      }
    })();
    setContacts(listOfContacts);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts List</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactDetails
            {...item}
            name={item.name}
            email={item.email[0]?.email}
            thumbnail={item.thumbnail}
          />
        )}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1d78d6",
    padding: 5,
  },
});
