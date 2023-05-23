import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import Profile from './Profile'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

export default function Save(props) {
    const [caption, setCaption] = useState('')

    const {latitude, longitude} = props.route.params.location
    console.log(latitude, longitude)

    const uploadImage = async() => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)
        const response = await fetch(uri);
        const blob = await response.blob();
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on('state_changed', taskProgress, taskError, taskCompleted)

    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .add({
                downloadURL,
                caption,
                latitude,
                longitude,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                props.navigation.navigate('Profile', { image: downloadURL });
            })
            .catch((error) => {
              console.log(error);
            })
    }

  return (
    <View style={{flex: 1}}>
      <View style={{margin: 20, justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderColor: 'black', paddingBottom: 10}}>
        <Image 
          style={{ width: 100, height: 100 }}
          source={{uri: props.route.params.image}}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <TextInput 
            style={{color: 'black', fontSize: 20}}
            placeholder='Write a Caption ...'
            placeholderTextColor='gray'
            multiline={true}
            onChangeText={(caption) => setCaption(caption)}
          />
        </View>
      </View>
      <Button 
        title='Save'
        onPress={() => uploadImage()}
      />
    </View>
  )
}

