import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import ContactDetails from "@/components/ContactDetails";
import Loading from "@/components/Loading";
import { MaterialIcons } from "@expo/vector-icons";
import AddContactForm from "@/components/AddContactForm";

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

  const [modelValue, setModel] = useState(false);

  const handleOpenCloseModel = (condition: boolean) => setModel(condition);
  const handleCreateContact = (formInput: any) => {
    console.log(formInput);
  };

  return (
    <View style={styles.container}>
      {contacts ? (
        <View>
          {/* <Text style={styles.title}>Contacts List</Text> */}
          <View style={styles.head}>
            <Text style={styles.title}>Contacts List</Text>
            <Pressable
              style={styles.camera}
              onPress={() => handleOpenCloseModel(true)}
            >
              <MaterialIcons name="person-add" size={24} color="#fff" />
            </Pressable>
          </View>
          {modelValue ? (
            <AddContactForm handleSubmit={handleCreateContact} />
          ) : (
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
          )}
        </View>
      ) : (
        <Loading />
      )}
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
  camera: {
    padding: 10,
    backgroundColor: "#1d78d6",
    borderRadius: 6,
    width: 45,
    height: 45,
  },
  head: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
});
