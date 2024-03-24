import React, { useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { INITIAL_REGION } from "@/services/constants";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { primaryColor } from "@/util/helpers";

const MapsComponent = () => {
  const navigation = useNavigation();
  const mapRef = useRef<any>();
  const onResetMap = () => {
    const rwRegion = {
      latitude: -1.9403,
      longitude: 29.8739,
      latitudeDelta: 2,
      longitudeDelta: 2,
    };
    mapRef.current?.animateToRegion(rwRegion);
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      title: "Map",
      headerRight: () => (
        <TouchableOpacity onPress={onResetMap} style={styles.resetBtnContainer}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
      >
        <Marker
          key={"Airport"}
          coordinate={{
            latitude: -1.963042,
            longitude: 30.134174,
          }}
        />
        <Marker
          key={"Auca"}
          coordinate={{
            latitude: -1.9557,
            longitude: 30.1042,
          }}
        />
      </MapView>
    </View>
  );
};

export default MapsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  resetBtnContainer: {
    padding: 10,
  },
  resetBtnText: {
    color: primaryColor,
    fontWeight: "600",
    fontSize: 18,
  },
});
