import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GenericScreen from "../../components/GenericScreen";

const AboutUsScreen = () => {
  const content = (
    <View>
      <Text>Nothing ....</Text>
    </View>
  );
  return (
    <View style={styles.about}>
      <SafeAreaView />
      <GenericScreen title="Our History" content={content} />
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  about: {
    flex: 1,
  },
});
