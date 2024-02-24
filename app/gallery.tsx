import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ImageViewer from "react-native-image-viewing";
import { MaterialIcons } from "@expo/vector-icons";

const Gallery = () => {
  const [galleryContent, setGalleryContent] = useState<any>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  let listOfGalleryContent: any = [];
  useEffect(() => {
    (async () => {
      await requestPermission();

      if (permissionResponse?.granted) {
        const imagesData = await MediaLibrary.getAssetsAsync();

        if (imagesData.assets) {
          for (let imageElt in imagesData.assets) {
            const imageInfo = await MediaLibrary.getAssetInfoAsync(
              imagesData.assets[imageElt]
            );
            if (imageInfo.localUri) {
              const formatted = { uri: imageInfo.localUri };
              listOfGalleryContent.push(formatted);
            }
          }
        }
        setGalleryContent(listOfGalleryContent);
      }
    })();
  }, [permissionResponse?.granted]);
  const [visible, setVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const renderItem = ({ item, index }: { item: any; index: any }) => (
    <TouchableOpacity onPress={() => openImageViewer(index)}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </TouchableOpacity>
  );
  const openImageViewer = (index: any) => {
    setSelectedImageIndex(index);
    setVisible(true);
  };
  const handleTakePicture = async () => {
    const { uri } = await Camera.takePictureAsync();
    const asset = await MediaLibrary.createAssetAsync(uri);
  };
  return galleryContent[0] ? (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>Contacts List</Text>
        <Pressable style={styles.camera}>
          <MaterialIcons name="camera" size={24} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={galleryContent}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.imageGrid}
      />

      <Modal visible={visible} transparent={true}>
        <ImageViewer
          images={galleryContent}
          imageIndex={selectedImageIndex}
          presentationStyle="overFullScreen"
          onRequestClose={() => setVisible(false)}
          visible={true}
        />
      </Modal>
    </View>
  ) : (
    <Text>Loading...</Text>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
  },
  imageGrid: {
    justifyContent: "space-between",
    padding: 5,
  },
  image: {
    width: "100%",
    height: 150,
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 6,
    margin: 5,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1d78d6",
    padding: 5,
  },
});
