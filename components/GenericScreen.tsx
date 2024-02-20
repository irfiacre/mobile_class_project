import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";

const GenericScreen = ({ ...props }) => {
  const { title, content } = props;
  return (
    <View style={styles.generic}>
      <View style={styles.section}>
        <Text style={styles.title}>{title || "Generic Title"} </Text>
        <View
          style={styles.separator}
          // customColor="#eee"
          // darkColor="rgba(255,255,255,0.1)"
        />
      </View>
      <View style={styles.section}>
        <ImageBackground
          source={{ uri: "https://picsum.photos/300" }}
          style={{ width: "100%", height: 200 }}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.content}>
          {content ||
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
tenetur error, harum nesciunt ipsum debitis quas aliquid.`}
        </Text>
      </View>
    </View>
  );
};

export default GenericScreen;

const styles = StyleSheet.create({
  generic: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d78d6",
  },
  content: {
    fontSize: 18,
    fontWeight: "400",
  },
  section: {
    padding: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
