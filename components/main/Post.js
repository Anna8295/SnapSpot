import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

function Post({ route }) {
  const caption = route.params.text;
  const uri = route.params.uri;
  const latitude = route.params.latitude;
  const longitude = route.params.longitude;

  const openShareDialogAsync = async () => {
    if (!await Sharing.isAvailableAsync()) {
      alert('Uh oh, sharing is not available on your device!');
      return;
    }

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory + 'post.jpg'
      );

      const { uri: localUri } = await downloadResumable.downloadAsync();

      await Sharing.shareAsync(localUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your post',
        UTI: 'public.jpeg',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerShare}>
        <TouchableOpacity onPress={() => openShareDialogAsync()}>
          <Ionicons name="ios-share-outline" size={33} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerImage}>
        <Image style={styles.image} source={{ uri }} />
      </View>
      <View style={styles.containerCaption}>
        <Text>Caption: {caption}</Text>
      </View>

      {latitude && longitude && (
        <View style={styles.mapContainer}>
          <MapView style={styles.map}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.4,
              longitudeDelta: 0.9
            }}>
            <Marker coordinate={{ latitude, longitude }} title='Marker' />
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  containerShare: {
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: 'flex-end'
  },
  containerImage:{
    width: '100%',
    height: 450
  },
  image: {
    height: '100%',
    resizeMode: 'cover'
  },
  containerCaption: {
    marginHorizontal: 15,
    marginTop: 5
  },
  mapContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  }
});

export default Post;