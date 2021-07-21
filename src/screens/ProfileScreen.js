import React, { Component } from 'react';

import {
    Header,
    Avatar,
    Card,
    Input,
    Button,
} from 'react-native-elements';

import {
    StyleSheet,
} from 'react-native';

import {
    Container,
    Content,
} from 'native-base'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userFirstName: "",
            userLastName: "",
            avatarTemp: "",
            userEmail: ""
        }
    }

    componentDidMount = () => {
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                this.setState({ userFirstName: snapShot.data().firstName })
                this.setState({ userLastName: snapShot.data().lastName })
                this.setState({ avatarTemp: this.state.userFirstName[0].concat(this.state.userLastName[0]) })
                this.setState({ userEmail: firebase.auth().currentUser.email })
            });
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer()
    }
    
    render() {
        return (
            <Container>
                <Content>
                    <Header 
                        leftComponent = {{ 
                            icon: "menu",
                            color: "#fff",
                            onPress: () => this._handleOpenDrawer(),
                        }}
                        centerComponent = {{
                            text: "Profile",
                            style: {color: "#fff"}
                        }}
                    />
                    <Avatar
                        rounded
                        size = "xlarge"
                        title = { this.state.avatarTemp }
                        activeOpacity = { 0.5 }
                        containerStyle = {{ backgroundColor: "#2288DC", marginTop: 40, alignSelf: "center" }}
                    >
                    </Avatar>
                    <Card containerStyle = {{ borderColor: "#2288DC" }} >
                        <Card.Title style = {{ color: "#2288DC" }}>
                            Information
                        </Card.Title>
                        <Card.Divider style = {{ borderColor: "#2288DC", borderWidth: 0.5 }} />
                        <Input 
                            leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#2288DC" }}
                            label = "First Name"
                            labelStyle = {{ color: "#2288DC" }}
                            inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#2288DC" }}
                            defaultValue = { this.state.userFirstName }
                            disabled = { true }
                        />
                        <Input 
                            leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#2288DC" }}
                            label = "Last Name"
                            labelStyle = {{ color: "#2288DC" }}
                            inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#2288DC" }}
                            defaultValue = { this.state.userLastName }
                            disabled = { true }
                        />
                        <Input 
                            placeholder = "email@address.com"
                            leftIcon = {{ type: "ion-icon", name: "mail", color: "#2288DC" }}
                            label = "Email Address"
                            labelStyle = {{ color: "#2288DC" }}
                            inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#2288DC" }}
                            defaultValue = { this.state.userEmail }
                            disabled = { true }
                        />
                    </Card>
                    <Button
                        title = "Edit"
                        type = "outline"
                        buttonStyle = { profileScreenStyle.profileButton }
                    />
                </Content>
            </Container>
        );
    }

}

const profileScreenStyle = StyleSheet.create({
    profileButton: {
        alignSelf: "center",
        marginTop: 35,
        paddingHorizontal: 100,
        borderWidth: 1
    }
});