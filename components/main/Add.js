import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; 
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



export default function Add({navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const cameraRef = useRef(null)
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState({})
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted');

            const locationStatus = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(locationStatus.status === 'granted');

        })();
    }, []);

    const takePicture = async () => {
        if(cameraRef.current){
            const data = await cameraRef.current.takePictureAsync();
            setImage(data.uri)

            // Get the device's current location
            let locationUser = null;
            const locationSubscription = await Location.watchPositionAsync(
              { accuracy: Location.Accuracy.High, timeInterval: 2000 },
              (location) => {
                console.log(location);
                locationUser = location;
                const latitude = locationUser.coords.latitude;
                const longitude = locationUser.coords.longitude;
                setLocation({ latitude, longitude });
                locationSubscription.remove(); // remove the subscription
              }
            )
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          exif: true // Request EXIF data (including location) for the image
        });
        
        console.log(result.assets[0].exif)

        if (!result.canceled) {
            const { uri } = result.assets[0];
            console.log(uri)
            const exifData = result.assets[0].exif;
            const { GPSLatitude, GPSLongitude } = exifData;

            const latitude = exifData.GPSLatitudeRef === "S" ? -1 * GPSLatitude : GPSLatitude;
            const longitude = exifData.GPSLongitudeRef === "W" ? -1 * GPSLongitude : GPSLongitude;
            
            console.log(latitude, longitude);
            setLocation({latitude, longitude})
            setImage(uri);
          }
        }

  if (!hasCameraPermission || !hasGalleryPermission || !hasLocationPermission){
    return <View />;
  } 

  if (hasCameraPermission === false || hasGalleryPermission === false || hasLocationPermission === false ){
    return <Text>No access to camera, gallery or location</Text>;
  } 

return (
    <View style={styles.container}>
        <View style={styles.cameraContainer}>
            <Camera
            style={styles.camera}
            type={type}
            ratio={'1:1'}
            ref={cameraRef}
            />
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        </View>
        <View style={styles.topButtonContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Save', {image, location})}
            >
                <MaterialIcons name="add-box" size={50} color="white" />
            </TouchableOpacity>
        </View>
        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
                onPress={() => pickImage()}
            >
                <MaterialIcons name="photo-library" size={50} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => takePicture()}
            >
                <MaterialCommunityIcons name="circle-slice-8" size={120} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>
                    setType(
                    type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    )
                }
            >
                <Ionicons name="camera-reverse-sharp" size={50} color="white" />
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    cameraContainer: {
      flex: 1,
      position: 'relative',
    },
    camera: {
      flex: 1,
      aspectRatio: 1,
    },
    previewImage: {
      position: 'absolute',
      top: 20,
      left: 20,
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    topButtonContainer: {
      position: 'absolute',
      top: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
});
    