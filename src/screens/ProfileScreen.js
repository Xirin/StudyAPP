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
    Icon,
    Badge,
    withBadge,
    ListItem,
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

import AgoraUIKit from 'agora-rn-uikit';

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
            userFirstNameFormValidation: "",
            userLastNameFormValidation: "",
            userSexFormValidation: "",
            userAgeFormValidation: "",
            userInvitationCounter: 0,
            userInvitations: [""],
            userResponseCounter: 0,
            userResponse: [""],
            userGroupInvitationCounter: 0,
            userGroupsInvitations: [""],
            userStudyPeers: [""],
            activeIndex: "",
            updateProfileOverlayVisibility: false,
            notificationsOverlayVisibility: false,
            videoCall: false,
        }
    }

    componentDidMount = () => {
        //Getting Personal information to the Current User for Profile Display
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

        //Getting Invitions from the other Users to display in Notfications
        var otherUsersArray = [];
        var userInvitationsArray = [];
        var invitationCounter = 0;
        var otherUsersResponseArray = [];
        var responseCounter = 0;
        var userGroupInvitationsArray = [];
        var groupInvitationCounter = 0;

        firestore()
            .collection("Users")
            .where("uid", "!=", auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    otherUsersArray.push({
                        otherUserID: doc.data().uid
                    })  
                })
            })
            .then(() => {
                //Checking and Getting all Invitaions Counter the Current User is invited by other users
                for (let index = 0; index < otherUsersArray.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(otherUsersArray[index].otherUserID)
                        .collection("Sent")
                        .where("recipientUserID", "==", auth().currentUser.uid)
                        .get()
                        .then((snapShot) => {
                            snapShot.forEach((doc) => {
                                userInvitationsArray.push({
                                    senderID: doc.data().senderID,
                                    senderName: doc.data().senderName,
                                    recipientUserID: doc.data().recipientUserID,
                                    recipientUserFullName: doc.data().recipientUserFullName,
                                    message: doc.data().message
                                })
                                invitationCounter = invitationCounter + 1;
                            })
                            this.setState({ userInvitations: userInvitationsArray })
                            this.setState({ userInvitationCounter: invitationCounter })
                        })
                }
            })
            .then(() => {
                //Checking and Getting all Group Invitations from the sender
                for (let index = 0; index < otherUsersArray.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(otherUsersArray[index].otherUserID)
                        .collection("Group Sent")
                        .where("recipientUserID", "==", auth().currentUser.uid)
                        .get()
                        .then((snapShot) => {
                            snapShot.forEach((doc) => {
                                userGroupInvitationsArray.push({
                                    senderID: doc.data().senderID,
                                    senderID: doc.data().senderID,
                                    senderName: doc.data().senderName,
                                    recipientUserID: doc.data().recipientUserID,
                                    recipientUserFullName: doc.data().recipientUserFullName,
                                    message: doc.data().message,
                                    groupName: doc.data().groupName
                                })
                                groupInvitationCounter = groupInvitationCounter + 1;
                            })
                            this.setState({ userGroupsInvitations: userGroupInvitationsArray })
                            this.setState({ userGroupInvitationCounter: groupInvitationCounter })
                        })
                }
            })
            .then(() => {
                //Checking and Getting all Invitation response from the recipient
                firestore()
                    .collection("Invitations")
                    .doc(auth().currentUser.uid)
                    .collection("Response")
                    .where("senderID", "==", auth().currentUser.uid)
                    .get()
                    .then((snapShot) => {
                        snapShot.forEach((doc) => {
                            otherUsersResponseArray.push({
                                senderID: doc.data().senderID,
                                recipientUserID: doc.data().recipientUserID,
                                recipientUserFullName: doc.data().recipientUserFullName,
                                response: doc.data().response
                            })
                            responseCounter = responseCounter + 1;
                        })
                        
                        this.setState({ userResponse: otherUsersResponseArray })
                        this.setState({ userResponseCounter: responseCounter })
                        console.log(this.state.userResponse)
                    })
            })
        
        //Getting all Study Peers of a User
        var userStudyPeersArray = [];
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .collection("Study Peers")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    userStudyPeersArray.push({
                        otherUserID: doc.data().otherUserID,
                        otherUserName: doc.data().otherUserName
                    })
                })
                this.setState({ userStudyPeers: userStudyPeersArray })
            })
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
        //Form Validation for Updating Profile Fields
        var errorCounter = 0;
        if (this.state.userFirstName == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userFirstNameFormValidation: "First Name is required*" })
        } else {
            this.setState({ userFirstNameFormValidation: "" })
        }

        if (this.state.userLastName == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userLastNameFormValidation: "Last Name is required*" })
        } else {
            this.setState({ userLastNameFormValidation: "" })
        }

        if (this.state.userAge == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userAgeFormValidation: "Age is required*" })
        } else {
            this.setState({ userAgeFormValidation: "" })
        }

        if (this.state.userFirstName == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userFirstNameFormValidation: "Sex is required*" })
        } else {
            this.setState({ userFirstNameFormValidation: "" })
        }

        if (errorCounter == 0) {
            //Storing the updated personal information in the database
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
    }

    _handleOpenUpdateProfileOverlay = (visible) => {
        this.setState({ updateProfileOverlayVisibility: visible });
    }

    _handleCloseUpdateProfileOverlay = () => {
        this.setState({ updateProfileOverlayVisibility: !this.state.updateProfileOverlayVisibility });
        this.componentDidMount();
    }

    _handleOpenNotifications = (visible) => {
        this.setState({ notificationsOverlayVisibility: visible })
    }

    _handleCloseNotifications = () => {
        //Delete all Response Notification
        firestore()
            .collection("Invitations")
            .doc(auth().currentUser.uid)
            .collection("Response")
            .get()
            .then((querySnapShot) => {
                querySnapShot.docs.forEach((snapShot) => {
                    snapShot.ref.delete()
                })
            })

        this.componentDidMount();
        this.setState({ notificationsOverlayVisibility: !this.state.notificationsOverlayVisibility })
    }

    _handleAcceptInvitation = (senderID, senderName, recipientUserID, recipientUserFullName) => {
        //Stores the Information of both users if the recipient accepts the invitation
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .collection("Study Peers")
            .doc(senderID)
            .set({
                otherUserID: senderID,
                otherUserName: senderName
            });

        //Storing also to the sender that inforamtion of recipient info if accepted
        firestore()
           .collection("Users")
           .doc(senderID)
           .collection("Study Peers")
           .doc(auth().currentUser.uid)
           .set({
               otherUserID: recipientUserID,
               otherUserName: recipientUserFullName
           });

        //Deleting the Invitation inside the Database if the Recipients got a response
        firestore()
           .collection("Invitations")
           .doc(senderID)
           .collection("Sent")
           .doc(recipientUserID)
           .delete();
        
        //Storing the accept response to the sender
        firestore()
           .collection("Invitations")
           .doc(senderID)
           .collection("Response")
           .doc(recipientUserID)
           .set({
               senderID: senderID,
               recipientUserID: recipientUserID,
               recipientUserFullName: recipientUserFullName,
               response: recipientUserFullName.concat(" has accepted your Study Peer Invitaion!")
           })

        firestore()
           .collection("Chat")
           .doc()
           .set({
                user: [
                    auth().currentUser.uid,
                    senderID
                ],
           })
                
        this._handleCloseNotifications();
    }

    _handleDeclineInvitation = (senderID, senderName, recipientUserID, recipientUserFullName) => {
        //Deleting the Invitation inside the Database if the Recipients got a response
        firestore()
           .collection("Invitations")
           .doc(senderID)
           .collection("Sent")
           .doc(recipientUserID)
           .delete();
        
        //Storing the accept response to the sender
        firestore()
           .collection("Invitations")
           .doc(senderID)
           .collection("Response")
           .doc(recipientUserID)
           .set({
               senderID: senderID,
               recipientUserID: recipientUserID,
               recipientUserFullName: recipientUserFullName,
               response: recipientUserFullName.concat(" has declined your Study Peer Invitaion!")
           });

        this._handleCloseNotifications();
    }

    _handleChatNavigation = (otherUserID) => {
        firestore()
            .collection("Chat")
            .where("user", "array-contains-any", [auth().currentUser.uid, otherUserID])
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    this.props.navigation.navigate("Chat Study Peers" ,{
                        documentID: doc.id,
                        otherUserID: otherUserID,
                        currentUserID: auth().currentUser.uid,
                        currentUserLastName: this.state.userLastName,
                    })
                })
            })
    }

    _handleAcceptGroupInvitation = (senderID, senderName, recipientUserID, recipientUserFullName, groupName) => {
        //Creation of group and storing all of its users invited
        firestore()
            .collection("Groups")
            .doc(groupName)
            .set({
                groupName: groupName,
                creatorID: senderID,
                creatorName: senderName
            })
            .then(() => {
                //Store the creator information
                firestore()
                    .collection("Groups")
                    .doc(groupName)
                    .collection("Members")
                    .doc(senderID)
                    .set({
                        userID: senderID,
                        userFullName: senderName
                    })
                
                //Store the invited peer information
                firestore()
                    .collection("Groups")
                    .doc(groupName)
                    .collection("Members")
                    .doc(recipientUserID)
                    .set({
                        userID: recipientUserID,
                        userFullName: recipientUserFullName
                    })
            })

        //Deleting the group invitation for getting a response
        firestore()
            .collection("Invitations")
            .doc(senderID)
            .collection("Group Sent")
            .doc(recipientUserID)
            .delete()

        //Storing the response that the recipient has accepted the invitation
        firestore()
            .collection("Invitations")
            .doc(senderID)
            .collection("Response")
            .doc(recipientUserID)
            .set({
                senderID: senderID,
                recipientUserID: recipientUserID,
                recipientUserFullName: recipientUserFullName,
                response: recipientUserFullName.concat(" has joined your ".concat(groupName, " group!"))
            })

        this._handleCloseNotifications();
    }

    _handleDeclineGroupInvitation = (senderID, senderName, recipientUserID, recipientUserFullName, groupName) => {
        //Deleting the group invitation for getting a response
        firestore()
            .collection("Invitations")
            .doc(senderID)
            .collection("Group Sent")
            .doc(recipientUserID)
            .delete()

        //Storing the response that the recipient has accepted the invitation
        firestore()
            .collection("Invitations")
            .doc(senderID)
            .collection("Response")
            .doc(recipientUserID)
            .set({
                senderID: senderID,
                recipientUserID: recipientUserID,
                recipientUserFullName: recipientUserFullName,
                response: recipientUserFullName.concat(" has declined your ".concat(groupName, " group invitation!"))
            })

        this._handleCloseNotifications();
    }
    
    render() {

        LogBox.ignoreAllLogs();

        const sexList = [
            { sex: "Male" },
            { sex: "Female" }
        ];

        const BadgedIcon = withBadge(this.state.userInvitationCounter + this.state.userGroupInvitationCounter + this.state.userResponseCounter)(Icon);

        const rtcProps = {
            appId: '573557ec13bc4538bdf45c56fe439e73',
            channel: this.state.activeIndex,
        };

        const callbacks = {
            EndCall: () => this.setState({ videoCall: false }),
        };

        return this.state.videoCall ? (
            <AgoraUIKit rtcProps = {rtcProps} callbacks = { callbacks }  />
        ) : (
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
                            rightComponent = {
                                <View style = {{ marginRight: 10 }}>
                                    <BadgedIcon 
                                        type = "material-community" 
                                        name = "bell" 
                                        color = "#fff"
                                        onPress = {() => this._handleOpenNotifications(true)}
                                    />
                                </View>
                            }
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

                        {/* User Study Peer List */}
                        <Card containerStyle = {{ borderColor: "#2288DC", marginBottom: 20 }} >
                            <Card.Title style = {{ color: "#2288DC" }} >Study Peer List</Card.Title>
                            <Card.Divider/>
                            {
                                this.state.userStudyPeers.map((item, index) => {
                                    return (
                                        <ListItem.Accordion
                                            key = { index }
                                            content = {
                                                <>
                                                    <ListItem.Content>
                                                        <ListItem.Title style = {{ color: "#2288DC", fontWeight: "bold" }} >
                                                            { item.otherUserName }
                                                        </ListItem.Title>
                                                    </ListItem.Content>
                                                </>
                                            }
                                            isExpanded = { this.state.activeIndex == item.otherUserName }
                                            onPress = {() => {
                                                this.setState({ activeIndex: item.otherUserName })
                                            }}
                                        >
                                            <ListItem>
                                                <ListItem.Content>
                                                    <Button
                                                        title = "Chat"
                                                        type = "outline"
                                                        onPress = {() => this._handleChatNavigation(item.otherUserID)}
                                                        buttonStyle = {{ paddingHorizontal: 115, marginBottom: 5 }}
                                                    />
                                                    <Button
                                                        title = "Video Call"
                                                        type = "outline"
                                                        onPress = {() => this.setState({ videoCall: true })}
                                                        buttonStyle = {{ paddingHorizontal: 96, marginTop: 5 }}
                                                    />
                                                </ListItem.Content>
                                            </ListItem>
                                        </ListItem.Accordion>
                                    )
                                })
                            }
                        </Card>

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
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.userFirstNameFormValidation }
                                />
                                <Input 
                                    placeholder = "Last Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#2288DC" }}
                                    label = "Last Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(userLastName) => this.setState ({ userLastName })}
                                    value = { this.state.userLastName }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.userLastNameFormValidation }
                                />
                                <Input 
                                    placeholder = "Last Name"
                                    leftIcon = {{ type: "material-community", name: "counter", color: "#2288DC" }}
                                    label = "Last Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(userAge) => this.setState ({ userAge })}
                                    value = { this.state.userAge }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.userAgeFormValidation }
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
                                <Text style = {{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12
                                }}>
                                    { this.state.userSexFormValidation }
                                </Text>
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
                        
                        {/* Invitation Notifications Overlay */}
                        <Overlay
                            isVisible = { this.state.notificationsOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseNotifications()}
                            overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                        >
                            <Card>
                                <Card.Title>Notfications</Card.Title>
                                <Card.Divider/>
                                {
                                    this.state.userInvitations.map((item, index) => {
                                        return(
                                            <Card key = { index } >
                                                <Card.Title>{ item.senderName }</Card.Title>
                                                <Card.Divider/>
                                                <Text>{ item.message }</Text>
                                                <View style ={{ flexDirection: "row", alignSelf: "center" }}>
                                                    <Button
                                                        title = "Accept"
                                                        type = "standard"
                                                        onPress = {() => this._handleAcceptInvitation(item.senderID, item.senderName, item.recipientUserID, item.recipientUserFullName)}
                                                        buttonStyle = {{ backgroundColor: "#42BA96", marginHorizontal: 5, marginTop: 10 }}
                                                    />
                                                    <Button
                                                        title = "Decline"
                                                        type = "standard"
                                                        onPress = {() => this._handleDeclineInvitation(item.senderID, item.senderName, item.recipientUserID, item.recipientUserFullName)}
                                                        buttonStyle = {{ backgroundColor: "#DF4759", marginHorizontal: 5, marginTop: 10 }}
                                                    />
                                                </View>
                                            </Card>
                                        )
                                    })
                                }
                                {
                                    this.state.userGroupsInvitations.map((item, index) => {
                                        return (
                                            <Card key = { index }>
                                                <Card.Title>{ item.senderName }</Card.Title>
                                                <Card.Divider/>
                                                <Text>{ item.message }</Text>
                                                <View style ={{ flexDirection: "row", alignSelf: "center" }}>
                                                    <Button
                                                        title = "Join"
                                                        type = "standard"
                                                        onPress = {() => this._handleAcceptGroupInvitation(item.senderID, item.senderName, item.recipientUserID, item.recipientUserFullName, item.groupName)}
                                                        buttonStyle = {{ backgroundColor: "#42BA96", marginHorizontal: 5, marginTop: 10 }}
                                                    />
                                                    <Button
                                                        title = "Decline"
                                                        type = "standard"
                                                        onPress = {() => this._handleDeclineGroupInvitation(item.senderID, item.senderName, item.recipientUserID, item.recipientUserFullName, item.groupName)}
                                                        buttonStyle = {{ backgroundColor: "#DF4759", marginHorizontal: 5, marginTop: 10 }}
                                                    />
                                                </View>
                                            </Card>
                                        )
                                    })
                                }
                                {
                                    this.state.userResponse.map((item, index) => {
                                        return (
                                            <Card key = { index }>
                                                <Card.Title>{ item.recipientUserFullName }</Card.Title>
                                                <Card.Divider/>
                                                <Text>{ item.response }</Text>
                                            </Card>
                                        )
                                    })
                                }
                                <Button
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { profileScreenStyle.profileButton2 }
                                    onPress = {() => this._handleCloseNotifications()}
                                />
                            </Card>
                        </Overlay>
                    </Content>
                </ScrollView>
            </Container>
        )
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