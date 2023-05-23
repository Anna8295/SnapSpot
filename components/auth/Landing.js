import React from 'react'
import { View, Button, StyleSheet, Image, Pressable, Text } from 'react-native'

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
          <Image source={require('../../assets/map.png')} style={{height: 100, width: 100}}/>
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.sloganText}>Welcome to SnapSpot! Discover and share amazing photos.</Text>
        <Pressable
          titleSize={20}
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{fontWeight: '600', color: 'white', fontSize: '20' }}>Sign Up</Text>
        </Pressable>

        <Pressable
          titleSize={20}
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{fontWeight: '600', color: 'white', fontSize: '20' }}>Log In</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: 50,
      paddingHorizontal: 12
  },
  logoContainer: {
      alignItems: 'center',
      marginTop: 60
  },
  button: {
    backgroundColor: '#0096f6',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 4,
    marginBottom: 8
  },
  wrapper: {
    marginTop: 80
  },
  sloganText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'gray',
  },
})