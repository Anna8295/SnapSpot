import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 

const Header = (props) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity>
            <Text style={{fontWeight: '700', fontSize: 30}}>SnapSpot</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Add')}>
                <MaterialIcons name="add-box" size={30} color="black" />
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 10
    },

    iconContainer: {
        flexDirection: 'row',
        marginLeft: 10
    }
})

export default Header