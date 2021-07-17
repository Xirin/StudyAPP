import React, { Component } from 'react';

import { 
  Container, 
  Content, 
} from 'native-base';

import {
    StyleSheet,
    View,
    TextInput
} from 'react-native';

import {
    Avatar,
    Overlay,
    Card,
    Input,
    Button,
} from 'react-native-elements';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class SignInScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            signUpOverlayVisiblility: false,
            signInOverlayVisibility: false
        }
    }

    _handleSignIn = () => {
        auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => auth().FirebaseAuthInvalidCredentialsException())
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-email') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                    }
                    
                    else if (errorCode === 'auth/user-not-found') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                    }

                    else if (errorCode === 'auth/wrong-password') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                    }

                    else {
                        this._handleCloseSignInOvelay();
                        this.props.navigation.navigate('PScreen');
                    }
                });
    }

    _handleSignUp = () => {
        auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => auth().FirebaseAuthInvalidCredentialsException())
            .catch((error) => {
                const errorCode = error.code;
                if ( errorCode === 'auth/email-already-in-use' ) {
                    this.setState( { email: "" });
                    this.setState({ password: "" });
                }

                else if ( errorCode === 'auth/invalid-email' ) {
                    this.setState({ email: "" });
                    this.setState({ password: "" });
                }

                else if ( errorCode === 'auth/weak-password' ) {
                    this.setState({ email: "" });
                    this.setState({ password: "" });
                }
                else {
                    this._handleCloseSignUpOverlay();
                }
            })
            .then(() => {
                firestore()
                    .collection('Users')
                    .doc(auth().currentUser.uid)
                    .set({
                      firstName: this.state.firstName,
                      lastName: this.state.lastName  
                    });
            });
    }

    _handleOpenSignUpOverlay = (visible) => {
        this.setState ({ signUpOverlayVisiblility: visible });
    }

    _handleCloseSignUpOverlay = () => {
        this.setState ({ signUpOverlayVisiblility: !this.state.signUpOverlayVisiblility });
    }

    _handleOpenSignInOvelay = (visible) => {
        this.setState ({ signInOverlayVisibility: visible });
    }

    _handleCloseSignInOvelay = () => {
        this.setState ({ signInOverlayVisibility: !this.state.signInOverlayVisibility });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Avatar
                        rounded
                        size = "xlarge"
                        title = "SM"
                        activeOpacity = { 0.5 }
                        containerStyle = {{ backgroundColor: "#2288DC" ,alignSelf: "center", marginTop: 120 }}
                    >
                    </Avatar>

                    <View style = { signInPageStyle.signInButtonGroup }>
                        <Button 
                            title = "Sign In"
                            type = "outline"
                            buttonStyle = { signInPageStyle.signInButton }
                            onPress = {() => this._handleOpenSignInOvelay(true)}
                        />
                        <Button 
                            title = "Sign Up"
                            type = "outline"
                            buttonStyle = { signInPageStyle.signInButton }
                            onPress = {()  => this._handleOpenSignUpOverlay(true)}
                        />
                    </View>

                    <Overlay
                        isVisible = { this.state.signUpOverlayVisiblility }
                        onBackdropPress = {() => this._handleCloseSignUpOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <Card>
                            <Card.Title style = { signInPageStyle.signInOverlayCard }>Sign Up</Card.Title>
                            <Card.Divider/>
                            <Input 
                                placeholder = "First Name"
                                leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#2288DC" }}
                                label = "First Name"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(firstName) => this.setState ({ firstName })}
                                value = { this.state.firstName }
                            />
                            <Input 
                                placeholder = "Last Name"
                                leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#2288DC" }}
                                label = "Last Name"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(lastName) => this.setState ({ lastName })}
                                value = { this.state.lastName }
                            />
                            <Input 
                                placeholder = "email@address.com"
                                leftIcon = {{ type: "ion-icon", name: "mail", color: "#2288DC" }}
                                label = "Email Address"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(email) => this.setState ({ email })}
                                value = { this.state.email }
                            />
                            <Input 
                                placeholder = "Password"
                                leftIcon = {{ type: "font-awesome", name: "lock", color: "#2288DC" }}
                                label = "Password"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(password) => this.setState ({ password })}
                                value = { this.state.password }
                                InputComponent = { TextInput }
                                secureTextEntry = { true }
                            />
                            <Button 
                                title = "Save"
                                type = "outline"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleSignUp()}
                            />
                            <Button 
                                title = "Close"
                                type = "outline"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleCloseSignUpOverlay()}
                            />
                        </Card>
                    </Overlay>

                    <Overlay
                        isVisible = { this.state.signInOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseSignInOvelay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <Card>
                            <Card.Title style = { signInPageStyle.signInOverlayCard } >Sign In</Card.Title>
                            <Card.Divider/>
                            <Input 
                                placeholder = "email@address.com"
                                leftIcon = {{ type: "ion-icon", name: "mail", color: "#2288DC" }}
                                label = "Email Address"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(email) => this.setState ({ email })}
                                value = { this.state.email }
                            />
                            <Input 
                                placeholder = "Password"
                                leftIcon = {{ type: "font-awesome", name: "lock", color: "#2288DC" }}
                                label = "Password"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(password) => this.setState ({ password })}
                                value = { this.state.password }
                                InputComponent = { TextInput }
                                secureTextEntry = { true }
                            />
                            <Button 
                                title = "Sign In"
                                type = "outline"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleSignIn()}
                            />
                            <Button 
                                title = "Close"
                                type = "outline"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleCloseSignInOvelay()}
                            />
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        );
    }
} 

const signInPageStyle = StyleSheet.create({

    signInButton: {
        alignSelf: "center",
        marginBottom: 15,
        paddingHorizontal: 100,
    },

    signInButtonGroup: {
        marginTop: 150,
    },

    signInOverlayCard: {
        marginHorizontal: 100,
        color: "#2288DC"
    },

});