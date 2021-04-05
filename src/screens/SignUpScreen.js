import React, { Component } from 'react';

import {
    StyleSheet,
} from 'react-native';

import { 
  Container, 
  Content, 
  Text,
  Card, 
  CardItem,
  Item, 
  Input, 
  Label,
  Button,
} from 'native-base';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class SignUpScreen extends Component {

    constructor (props) {
        super (props);
        this.state ={
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            userName: '',
            itemState: ''
        }
        this._handeleSignUp = this._handleSignUp.bind(this);
    }

    _handleSignUp = () =>{
        auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => auth().FirebaseAuthInvalidCredentialsException())
                .catch( (error) => {
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
                }).then(() => {
                    firestore()
                        .collection('Users')
                        .doc(auth().currentUser.uid)
                        .set({
                            userName: this.state.userName,
                            firstName: this.state.firstName,
                            lastName: this.state.lastName
                        })
                });
    }

    render() {

        return(
            <Container style = {{ backgroundColor: "#5b5275", }} >
                <Content>
                    <Card style = { signUpPageStyle.signUpCard }>
                        <CardItem header bordered style = { signUpPageStyle.signUpCardItem } >
                            <Text style = { signUpPageStyle.signUpCardItemLabel } >
                                Create your StudySquad Account
                            </Text>
                        </CardItem>
                        <CardItem style = { signUpPageStyle.signUpCardItem } >
                            <Item floatingLabel>
                                <Label style = { signUpPageStyle.signUpCardItemLabel } >First Name</Label>
                                <Input onChangeText = { (firstName) => this.setState( { firstName } ) } value = { this.state.firstName } />
                            </Item>
                        </CardItem>
                        <CardItem style = { signUpPageStyle.signUpCardItem } >
                            <Item floatingLabel>
                                <Label style = { signUpPageStyle.signUpCardItemLabel } >Last Name</Label>
                                <Input onChangeText = { (lastName) => this.setState( { lastName } ) } value = { this.state.lastName } />
                            </Item>
                        </CardItem>
                        <CardItem style = { signUpPageStyle.signUpCardItem } >
                            <Item floatingLabel>
                                <Label style = { signUpPageStyle.signUpCardItemLabel } >Username</Label>
                                <Input onChangeText = { (userName) => this.setState( { userName } ) } value = { this.state.userName } />
                            </Item>
                        </CardItem>
                        <CardItem style = { signUpPageStyle.signUpCardItem } >
                            <Item floatingLabel>
                                <Label style = { signUpPageStyle.signUpCardItemLabel } >E-mail</Label>
                                <Input onChangeText = { (email) => this.setState( { email } ) } value = { this.state.email } />
                            </Item>
                        </CardItem>
                        <CardItem style = { signUpPageStyle.signUpCardItem } >
                            <Item floatingLabel>
                                <Label style = { signUpPageStyle.signUpCardItemLabel }  >Confirm Password</Label>
                                <Input onChangeText = { (password) => this.setState( { password } ) } value = { this.state.password } />
                            </Item>
                        </CardItem>
                        <CardItem footer style = { signUpPageStyle.signUpCardItem } >
                            <Button light style = { signUpPageStyle.signUpButton } onPress={this._handleSignUp}>
                                <Text style = { signUpPageStyle.signUpCardItemLabel } >Sign Up</Text>
                            </Button>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const signUpPageStyle = StyleSheet.create({
    signUpCard: {
        backgroundColor: "#6490b3", 
        marginTop: 50, 
        marginLeft: 25, 
        marginRight: 25, 
        borderRadius: 20, 
        alignItems: "center",
    },

    signUpCardItem: {
        backgroundColor: "#6490b3",
    },

    signUpCardItemLabel: {
        color: "#BCE8E6"
    },
    
    signUpButton: {
        alignSelf: "center", 
        marginTop: 25, 
        marginBottom: 25, 
        borderRadius: 10,
        backgroundColor: "#6490b3",
    },
});