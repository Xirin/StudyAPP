import React, { Component } from 'react';

import { 
  Container, 
  Content, 
  Thumbnail, 
  Text,
  Card, 
  CardItem,
  Form, 
  Item, 
  Input, 
  Label,
  Button,
} from 'native-base';

import {
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import auth from '@react-native-firebase/auth';

export default class SignInScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
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
                        this.props.navigation.navigate('Profile');
                    }
                });
    }

    render() {
        const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
        return (
            <Container style = {{ backgroundColor: "#5b5275", }} >
                <Content>
                    <Thumbnail large source = {{ uri: uri }} style = { signInPageStyle.signInLogo } />
                    <Card style = { signInPageStyle.signInCard }>
                        <Form>
                            <CardItem style = { signInPageStyle.signInCardItem } >
                                <Item floatingLabel>
                                    <Label style = { signInPageStyle.signInCardItemLabel }  >E-mail</Label>
                                    <Input onChangeText = { (email) => this.setState( { email } ) } value = { this.state.email } />
                                </Item>
                            </CardItem>
                            <CardItem style = { signInPageStyle.signInCardItem } >
                                <Item floatingLabel>
                                    <Label style = { signInPageStyle.signInCardItemLabel }  >Password</Label>
                                    <Input onChangeText = { (password) => this.setState( { password } ) } value = { this.state.password } />
                                </Item>
                            </CardItem>
                        </Form>
                        <Button light style = { signInPageStyle.signInButton } onPress={this._handleSignIn}>
                            <Text style = { signInPageStyle.signInCardItemLabel } >Sign In</Text>
                        </Button>
                        <TouchableOpacity>
                            <Text style = { signInPageStyle.signInLink } onPress={() => this.props.navigation.navigate('Sign Up')}>
                                Create an Account?
                            </Text>
                        </TouchableOpacity>
                    </Card>
                </Content>
            </Container>
        );
    }
} 

const signInPageStyle = StyleSheet.create({
    signInLogo: {
        alignSelf: "center", marginTop: 100, marginBottom: 50 
    },

    signInCard: {
        backgroundColor: "#6490b3",  
        marginLeft: 25, 
        marginRight: 25, 
        borderRadius: 20
    },

    signInCardItem: {
        backgroundColor: "#6490b3", 
        borderRadius: 20
    },

    signInCardItemLabel: {
        color: "#BCE8E6"
    },

    signInButton: {
        backgroundColor: "#6490b3", 
        alignSelf: "center", 
        marginTop: 25, 
        marginBottom: 25, 
        borderRadius: 10,
    },

    signInLink: {
        alignSelf: "center", 
        color: "#5B6AB5", 
        marginBottom: 25
    }
});