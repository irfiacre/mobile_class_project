import { StyleSheet, View } from "react-native";
import React from "react";
import { IconButton } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ActionItems = (props: {
  handleEdit: () => void;
  handleDelete: () => void;
  hasPublish: boolean;
  handlePublish: () => void;
}) => {
  const { handleEdit, handleDelete, handlePublish, hasPublish } = props;
  return (
    <View style={styles.container}>
      {hasPublish && (
        <IconButton
          onPress={() => handlePublish()}
          icon={
            <MaterialCommunityIcons
              name="cloud-upload"
              color="green"
              size={32}
            />
          }
          borderRadius="full"
          _pressed={{ backgroundColor: "#DFE3E6" }}
        />
      )}
      <IconButton
        onPress={() => handleEdit()}
        icon={
          <MaterialCommunityIcons
            name="square-edit-outline"
            color="#1d78d6"
            size={32}
          />
        }
        borderRadius="full"
        _pressed={{ backgroundColor: "#DFE3E6" }}
      />
      <IconButton
        onPress={() => handleDelete()}
        icon={
          <MaterialCommunityIcons name="delete" color="#d61e1d" size={32} />
        }
        borderRadius="full"
        _pressed={{ backgroundColor: "#DFE3E6" }}
      />
    </View>
  );
};

export default ActionItems;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.8,
  },
});
