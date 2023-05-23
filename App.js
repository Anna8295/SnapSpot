import React, { Component } from 'react';

import {View, Text } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
  appId: "<YOUR_APP_ID>",
  measurementId: "<YOUR_MEASUREMENT_ID>"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
}else {
  app = firebase.app();
}

app.firestore();
firebase.auth();

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


import { NavigationContainer } from '@react-navigation/native'; 
import {createStackNavigator } from '@react-navigation/stack';

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Main from './components/Main'
import Login from './components/auth/Login'
import Add from './components/main/Add'
import Save from './components/main/Save';
import Profile from './components/main/Profile'
import Post from './components/main/Post'
import Map from './components/main/Map'

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded:true
        })
      }else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render(){
    const {loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Landing'>
            <Stack.Screen name='Landing' component={Landing} options={{ headerShown: false}}/>
            <Stack.Screen name='Register' component={Register} options={{ headerShown: false}}/>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false}}/>
          </Stack.Navigator>
      </NavigationContainer>
      )
    } 

    return(
      <Provider store={store}>
         <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen name='Main' component={Main} options={{ headerShown: false}}/>
            <Stack.Screen 
              name='Add' 
              component={Add} 
              navigation={this.props.navigation}
              options={{
                headerTitle: 'CREATE POST',
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTintColor: 'white',
                headerBackTitle: ' '
              }}  
            />
            <Stack.Screen 
              name='Save' 
              component={Save} 
              navigation={this.props.navigation}
              options={{
                headerTitle: 'NEW POST',
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTintColor: 'white',
                headerBackTitle: ' '
              }}    
            />
            <Stack.Screen 
              name='Map' 
              component={Map} 
              navigation={this.props.navigation}
              options={{
                headerTitle: 'MAP',
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTintColor: 'white',
                headerBackTitle: ' '
              }}
              />
            <Stack.Screen 
              name='Post' 
              component={Post} 
              navigation={this.props.navigation}
              options={{
                headerTitle: 'POST',
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTintColor: 'white',
                headerBackTitle: ' '
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
