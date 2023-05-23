import React, { Component } from 'react'
import { View, Pressable, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password: '',
            uid: ''
        }

        this.onSingnUp = this.onSingnUp.bind(this)
    }

    validateInputs() {
        const { email, password } = this.state;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim()) && password.trim() !== '';
    }

    onSingnUp(){
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {  
            this.setState({ uid: result.user.uid })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        const isValid = this.validateInputs();
        const { email, password } = this.state;
        return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/map.png')} style={{height: 100, width: 100}}/>
            </View>
            <View style={styles.wrapper}>
                <View style={[styles.inputField, {
                    borderColor: 
                        email.length < 1 || !isValid ? 'red' : '#ccc',
                }]}>
                    <TextInput 
                        placeholderTextColor='#444'
                        placeholder='Phone number, username or email'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        autoFocus={true}
                        onChangeText={(email) => this.setState({email})}
                    />
                </View>
                <View style={[styles.inputField, {
                    borderColor: 
                       password.length > 4 ? '#ccc' : 'red',
                }]}>
                    <TextInput 
                        placeholderTextColor='#444'
                        placeholder='Password'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        textContentType='password'
                        onChangeText={(password) => this.setState({password})}
                    />
                </View>  
                    <Pressable
                        titleSize={20}
                        style={styles.button(isValid)}
                        disabled={!isValid}
                        onPress={() => this.onSingnUp()}
                    ><Text style={{fontWeight: '600', color: 'white', fontSize: '20' }}>Log in</Text></Pressable>
                
                <View style={styles.signupContainer}>
                    <Text>Don't have an account?</Text>
                    <TouchableOpacity onPress={() =>  this.props.navigation.navigate('Register')}>
                        <Text style={{color: '#6bb0f5'}}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>    
        </View>
        )
    }
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
    inputField: {
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#fafafa',
        marginBottom: 10,
        borderWidth: 1
    },
    wrapper: {
        marginTop: 80
    },
    button: (isValid) => ({
        backgroundColor: isValid ? '#0096f6' : '#9acaf7',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 4
    }),
    signupContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 50
    }
})

export default Login