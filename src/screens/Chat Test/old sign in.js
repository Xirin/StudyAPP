import React, { Component } from 'react';

import { 
  Container, 
  Content, 
  Thumbnail, 
  Text,
//   Card, 
//   CardItem,
  Form, 
  Item, 
//   Input, 
  Label,
//   Button
} from 'native-base';

import {
    TouchableOpacity,
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
                        this.props.navigation.navigate('Profile');
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
                    this.props.navigation.navigate('Profile');
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
        const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
        return (
            // <Container style = {{ backgroundColor: "#5b5275", }} >
            //     <Content>
            //         <Thumbnail large source = {{ uri: uri }} style = { signInPageStyle.signInLogo } />
            //         <Card style = { signInPageStyle.signInCard }>
            //             <Form>
            //                 <CardItem style = { signInPageStyle.signInCardItem } >
            //                     <Item floatingLabel>
            //                         <Label style = { signInPageStyle.signInCardItemLabel }  >E-mail</Label>
            //                         <Input onChangeText = { (email) => this.setState( { email } ) } value = { this.state.email } />
            //                     </Item>
            //                 </CardItem>
            //                 <CardItem style = { signInPageStyle.signInCardItem } >
            //                     <Item floatingLabel>
            //                         <Label style = { signInPageStyle.signInCardItemLabel }  >Password</Label>
            //                         <Input onChangeText = { (password) => this.setState( { password } ) } value = { this.state.password } />
            //                     </Item>
            //                 </CardItem>
            //             </Form>
            //             <Button light style = { signInPageStyle.signInButton } onPress={this._handleSignIn}>
            //                 <Text style = { signInPageStyle.signInCardItemLabel } >Sign In</Text>
            //             </Button>
            //             <TouchableOpacity>
            //                 <Text style = { signInPageStyle.signInLink } onPress={() => this.props.navigation.navigate('Sign Up')}>
            //                     Create an Account?
            //                 </Text>
            //             </TouchableOpacity>
            //         </Card>
            //     </Content>
            // </Container>
            <Container>
                <Content>

                    <Avatar
                        size = "xlarge"
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
    // signInLogo: {
    //     alignSelf: "center", marginTop: 100, marginBottom: 50 
    // },

    // signInCard: {
    //     backgroundColor: "#6490b3",  
    //     marginLeft: 25, 
    //     marginRight: 25, 
    //     borderRadius: 20
    // },

    // signInCardItem: {
    //     backgroundColor: "#6490b3", 
    //     borderRadius: 20
    // },

    // signInCardItemLabel: {
    //     color: "#BCE8E6"
    // },

    // signInButton: {
    //     backgroundColor: "#6490b3", 
    //     alignSelf: "center", 
    //     marginTop: 25, 
    //     marginBottom: 25, 
    //     borderRadius: 10,
    // },

    // signInLink: {
    //     alignSelf: "center", 
    //     color: "#5B6AB5", 
    //     marginBottom: 25
    // }

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