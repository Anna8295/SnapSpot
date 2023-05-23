import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { connect } from 'react-redux'
 
function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => { 
    const { currentUser, posts } = props  
    console.log(currentUser, posts)
    setUser(currentUser)
    setUserPosts(posts)
  }, [props.currentUser, props.posts])

  useEffect(() => {
    loadUserData();
  }, []); 
 
  const loadUserData = () => {
    firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                setUserPosts(posts)
                setRefreshing(false);
            })
  }

  const onRefresh = () => {
    //Clear old data of the list
    setUserPosts([]);
    //Call the Service to get the latest data
    loadUserData()
  };

  const onLogout = () => {
    firebase.auth().signOut()
  }

  if(user === null){
    return <View />
  }

  return (
    <View style={styles.container}>
       <Header navigation={props.navigation}/>
      <View style={styles.containerUserInfo}>
        <View style={styles.containerInfo}>
          <Ionicons name="person-sharp" size={70} color="black" />
          <Text style={{marginLeft: 5, fontWeight: '700', fontSize: 32}}>{user.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onLogout()}
        >
          <Ionicons name="log-out" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.containerGallery}> 
      {refreshing ? <ActivityIndicator /> : null}  
            <FlatList 
              numColumns={3}
              horizontal={false}
              data={userPosts}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => {
                  props.navigation.navigate('Post', { uri: item.downloadURL, text: item.caption, latitude: item.latitude, longitude: item.longitude  });
                }}>
                  <View style={styles.containerImage}>
                    <Image style={styles.image} source={{ uri: item.downloadURL }} />
                  </View>
                </TouchableWithoutFeedback>
              )} 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
        />
      </View>
    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40
  },
  containerUserInfo:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderTopWidth: 3,
    borderColor: 'black'
  },
  containerInfo:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerGallery:{
    flex: 1,
  },
  containerImage:{
    flex: 1/3,
    borderWidth: 1,
    borderColor: 'black'
  },
  image:{
    flex: 1,
    aspectRatio: 1/1
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile)