import React, { useEffect, useState } from 'react';
import  MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StyleSheet, View } from 'react-native';

export default function Map() {
  const [mapRegion, setMapRegion] = useState({ })

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({})
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.4,
      longitudeDelta: 0.9
    })
  }

  useEffect(() => {
    userLocation();
  }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
        region={mapRegion}
      >
        {mapRegion.latitude && <Marker coordinate={mapRegion} title='Marker' />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});



