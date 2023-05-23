import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, clearData } from '../redux/actions/index'

import Map from './main/Map'
import Add from './main/Add'
import Profile from './main/Profile'


const Tab = createMaterialBottomTabNavigator();
const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      secondaryContainer: 'transparent',
    },
  };

const Empty = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount(){
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
    } 
    render() {
        return (
            <PaperProvider theme={theme}>
                <Tab.Navigator 
                    initialRouteName='Profile' 
                    labeled={false}
                    activeColor="white"
                    inactiveColor="gray"
                    shifting={true}
                    barStyle={{ 
                        backgroundColor: 'black',
                        elevation: 8,
                        borderRadius: 25,
                        overflow: 'hidden',
                        marginHorizontal: 10,
                        marginBottom: 45,
                        ...style.shadow,
                    }}
                >
                    <Tab.Screen name='Profile' component={Profile} 
                        options={{
                            tabBarIcon: ({color})=> (
                                <View style={{alignItems: 'center', justifyContent: 'center', top: 8}}> 
                                    <MaterialCommunityIcons name='account-circle' color={color} size={30} />
                                </View>
                            ),
                        }}    
                    />
                    <Tab.Screen name="MainMap" component={Empty} 
                        listeners={({navigation}) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate('Map')
                            }
                        })}
                        options={{
                            tabBarIcon: ({color})=> (
                                <View style={{alignItems: 'center', justifyContent: 'center', top: 8}}> 
                                    <MaterialCommunityIcons name='map-marker' color={color} size={30} />
                                </View>
                            ),
                        }}    
                    />
                    <Tab.Screen name="MainAdd" component={Empty} 
                        listeners={({navigation}) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate('Add')
                            }
                        })}
                        options={{
                            tabBarIcon: ({color})=> (
                                <View style={{alignItems: 'center', justifyContent: 'center', top: 8}}> 
                                    <MaterialCommunityIcons name='plus-box' color={color} size={30} />
                                </View>
                            ),
                        }}    
                    />
                </Tab.Navigator>
            </PaperProvider>
        )
    }
}

const style = StyleSheet.create({
    shadow: {
        shadowColor: '#7f5df0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, clearData}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main);