import React, { Component } from 'react';

import {
    Header,
    Avatar,
    Card,
    Input,
    Button,
    Overlay,
    CheckBox,
    Text,
} from 'react-native-elements';

import {
    StyleSheet,
    ScrollView,
    LogBox,
} from 'react-native';

import {
    Container,
    Content,
    View,
} from 'native-base'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userFirstName: "",
            userLastName: "",
            userSex: "",
            avatarTemp: "",
            userEmail: "",
            userSex: "",
            userAge: "",
            updateProfileOverlayVisibility: false,
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
                this.setState({ userAge: snapShot.data().age })
                this.setState({ userSex: snapShot.data().sex })
                this.setState({ userEmail: firebase.auth().currentUser.email })
            });
            
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer()
    }

    _handleUserSexField = () => {
        if (this.state.userSex == "Male") {
            return (
                <Input 
                    leftIcon = {{ type: "material-community", name: "gender-male", color: "#2288DC" }}
                    label = "Sex"
                    labelStyle = {{ color: "#2288DC" }}
                    inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#2288DC" }}
                    defaultValue = { this.state.userSex }
                    disabled = { true }
                />
            )
        }
        else if (this.state.userSex == "Female") {
            return (
                <Input 
                    leftIcon = {{ type: "material-community", name: "gender-female", color: "#2288DC" }}
                    label = "Sex"
                    labelStyle = {{ color: "#2288DC" }}
                    inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#2288DC" }}
                    defaultValue = { this.state.userSex }
                    disabled = { true }
                />
            )
        }
    }

    _handleUpdateProfile = () => {
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .update({
                firstName: this.state.userFirstName,
                lastName: this.state.userLastName,
                age: this.state.userAge,
                sex: this.state.userSex
            });

        this._handleCloseUpdateProfileOverlay();
    }

    _handleOpenUpdateProfileOverlay = (visible) => {
        this.setState({ updateProfileOverlayVisibility: visible });
    }

    _handleCloseUpdateProfileOverlay = () => {
        this.setState({ updateProfileOverlayVisibility: !this.state.updateProfileOverlayVisibility });
        this.componentDidMount();
    }
    
    render() {

        LogBox.ignoreAllLogs();

        const sexList = [
            { sex: "Male" },
            { sex: "Female" }
        ];

        return (
            <Container>
                <ScrollView>
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
                                leftIcon = {{ type: "material-community", name: "counter", color: "#2288DC" }}
                                label = "Age"
                                labelStyle = {{ color: "#2288DC" }}
                                inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#2288DC" }}
                                defaultValue = { this.state.userAge }
                                disabled = { true }
                            />
                            { this._handleUserSexField() }
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
                            onPress = {() => this._handleOpenUpdateProfileOverlay(true)}
                        />

                        {/* Update Profile Information */}
                        <Overlay
                            isVisible = { this.state.updateProfileOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseUpdateProfileOverlay()}
                            overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                        >
                            <Card>
                                <Card.Title style = { profileScreenStyle.profileCardTitle } >Update Profile</Card.Title>
                                <Card.Divider/>
                                <Input 
                                    placeholder = "First Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#2288DC" }}
                                    label = "First Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(userFirstName) => this.setState ({ userFirstName })}
                                    value = { this.state.userFirstName }
                                />
                                <Input 
                                    placeholder = "Last Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#2288DC" }}
                                    label = "Last Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(userLastName) => this.setState ({ userLastName })}
                                    value = { this.state.userLastName }
                                />
                                <Input 
                                    placeholder = "Last Name"
                                    leftIcon = {{ type: "material-community", name: "counter", color: "#2288DC" }}
                                    label = "Last Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(userAge) => this.setState ({ userAge })}
                                    value = { this.state.userAge }
                                />
                                <Text style = { profileScreenStyle.profileText }>
                                    Sex
                                </Text>
                                {
                                    sexList.map((item, index) => {
                                        return(
                                            <View key = { index } >
                                                <CheckBox 
                                                    textStyle = {{ color: "#2288DC" }}
                                                    title = { item.sex }
                                                    checked = { this.state.userSex === item.sex }
                                                    onPress = {() => this.setState({ userSex: item.sex })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Button
                                    title = "Save"
                                    type = "outline"
                                    buttonStyle = { profileScreenStyle.profileButton2 }
                                    onPress = {() => this._handleUpdateProfile()}
                                />
                                <Button
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { profileScreenStyle.profileButton2 }
                                    onPress = {() => this._handleCloseUpdateProfileOverlay()}
                                />
                            </Card>
                        </Overlay>

                    </Content>
                </ScrollView>
            </Container>
        );
    }

}

const profileScreenStyle = StyleSheet.create({
    profileButton: {
        alignSelf: "center",
        marginTop: 35,
        marginBottom: 30,
        paddingHorizontal: 100,
        borderWidth: 1
    },

    profileButton2: {
        alignSelf: "center",
        marginTop: 15,
        paddingHorizontal: 100,
        borderWidth: 1
    },

    profileCardTitle: {
        marginHorizontal: 100,
        color: "#2288DC"
    },

    profileText: {
        color: "#2288DC",
        marginLeft: 11,
        fontWeight: "bold",
        fontSize: 16
    }

});