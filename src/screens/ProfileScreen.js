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
    Chip,
} from 'react-native-elements';

import {
    StyleSheet,
    ScrollView,
    LogBox,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

import {
    Container,
    Content,
    Title,
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
            userCourse: "",
            userFirstNameFormValidation: "",
            userLastNameFormValidation: "",
            userSexFormValidation: "",
            userAgeFormValidation: "",
            userCourseFormValidation: "",
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
            userGroupRequest: [""],
            userGroupRequestCounter: 0,
            userGroupRequestResponse: [""],
            userGroupRequestResponseCounter: 0,
            userVideoCallChannel: "",
            messageOverlayVisibility: false,
            userLatestMessages: [""],
            userMessagesCounter: 0,
            groupLatestMessages: [""],
            groupMessagesCounter: 0,
            setRefresh: false,
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
                this.setState({ userCourse: snapShot.data().course })
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
        var userGroupRequestArray = [];
        var groupRequestCounter = 0;
        var userGroupRequestResponseArray = [];
        var groupRequestResponseCounter = 0;

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
                                    groupID: doc.data().groupID,
                                    senderID: doc.data().senderID,
                                    senderID: doc.data().senderID,
                                    senderName: doc.data().senderName,
                                    recipientUserID: doc.data().recipientUserID,
                                    recipientUserFullName: doc.data().recipientUserFullName,
                                    message: doc.data().message,
                                    groupName: doc.data().groupName,
                                    topics: doc.data().topics
                                })
                                groupInvitationCounter = groupInvitationCounter + 1;
                            })
                            this.setState({ userGroupsInvitations: userGroupInvitationsArray })
                            this.setState({ userGroupInvitationCounter: groupInvitationCounter })
                        })
                }
            })
            .then(() => {
                //Checking and Getting all Group Request from the requestor
                firestore()
                    .collection("Invitations")
                    .doc(auth().currentUser.uid)
                    .collection("Group Request")
                    .where("creatorID", "==", auth().currentUser.uid)
                    .get()
                    .then((snapShot) => {
                        snapShot.forEach((doc) => {
                            userGroupRequestArray.push({
                                groupID: doc.data().groupID,
                                creatorID: doc.data().creatorID,
                                creatorName: doc.data().creatorName,
                                groupName: doc.data().groupName,
                                requestorUserID: doc.data().requestorUserID,
                                requestorFullName: doc.data().requestorFullName,
                                topics: doc.data().topics,
                                message: doc.data().message
                            })
                            groupRequestCounter = groupRequestCounter + 1;
                        })
                        this.setState({ userGroupRequest: userGroupRequestArray })
                        this.setState({ userGroupRequestCounter: groupRequestCounter })
                    })
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
                    })
            })
            .then(() => {
                //Checking and Getting all Group Request Response from the Group Creator
                for (let index  = 0; index < otherUsersArray.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(otherUsersArray[index].otherUserID)
                        .collection("Group Request Response")
                        .where("recipientUserID", "==", auth().currentUser.uid)
                        .get()
                        .then((snapShot) => {
                            snapShot.forEach((doc) => {
                                userGroupRequestResponseArray.push({
                                    senderID: doc.data().senderID,
                                    senderName: doc.data().senderName,
                                    recipientUserFullName: doc.data().recipientUserFullName,
                                    recipientUserID: doc.data().recipientUserID,
                                    response: doc.data().response
                                })
                                groupRequestResponseCounter = groupRequestResponseCounter + 1;
                            })
                            this.setState({ userGroupRequestResponse: userGroupRequestResponseArray })
                            this.setState({ userGroupRequestResponseCounter: groupRequestResponseCounter })
                        })
                }
            })
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer()
    }

    _handleUserSexField = () => {
        if (this.state.userSex == "Male") {
            return (
                <Input 
                    leftIcon = {{ type: "material-community", name: "gender-male", color: "#7B1FA2" }}
                    label = "Sex"
                    labelStyle = {{ color: "#7B1FA2" }}
                    inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
                    defaultValue = { this.state.userSex }
                    disabled = { true }
                />
            )
        }
        else if (this.state.userSex == "Female") {
            return (
                <Input 
                    leftIcon = {{ type: "material-community", name: "gender-female", color: "#7B1FA2" }}
                    label = "Sex"
                    labelStyle = {{ color: "#7B1FA2" }}
                    inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
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

        if (this.state.userSex == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userSexFormValidation: "Sex is required*" })
        } else {
            this.setState({ userSexFormValidation: "" })
        }

        if (this.state.userCourse == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userCourseFormValidation: "Course is required*" })
        } else {
            this.setState({ userCourseFormValidation: "" })
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

        //Delete all Group Request Response Notification
        var otherUsersArray = [];
        firestore()
            .collection("Users")
            .where("uid", "!=", auth().currentUser.uid)
            .get()
            .then((snapsShot) =>{
                snapsShot.forEach((doc) => {
                    otherUsersArray.push({
                        otherUserID: doc.data().uid
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < otherUsersArray.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(otherUsersArray[index].otherUserID)
                        .collection("Group Request Response")
                        .doc(auth().currentUser.uid)
                        .delete()
                }
            })

        this.setState({ notificationsOverlayVisibility: !this.state.notificationsOverlayVisibility })
        this.componentDidMount();
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

        this.componentDidMount();
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

        this.componentDidMount();
    }

    _handleAcceptGroupInvitation = (groupID, senderID, senderName, recipientUserID, recipientUserFullName, groupName, topics) => {

        //Store the invited peer information
        firestore()
            .collection("Groups")
            .doc(groupID)
            .collection("Members")
            .doc(recipientUserID)
            .set({
                userID: recipientUserID,
                userFullName: recipientUserFullName
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

        this.componentDidMount();
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
        
        this.componentDidMount();
    }

    _handleAcceptGroupRequest = (groupID, creatorID, creatorName, requestorUserID, requestorFullName, groupName) => {

        //Storing to the Databse the response of the accepted user
        firestore()
            .collection("Invitations")
            .doc(creatorID)
            .collection("Group Request Response")
            .doc(requestorUserID)
            .set({
                senderID: creatorID,
                senderName: creatorName,
                recipientUserID: requestorUserID,
                recipientUserFullName: requestorFullName,
                response: creatorName.concat(" has accepted your request to join the Group ", groupName, "!")
            })

        //Storing to the Database the information of the accepted user
        firestore()
            .collection("Groups")
            .doc(groupID)
            .collection("Members")
            .doc(requestorUserID)
            .set({
                userFullName: requestorFullName,
                userID: requestorUserID
            })

        //Deleting the Request sent by the Requestor
        firestore()
            .collection("Invitations")
            .doc(creatorID)
            .collection("Group Request")
            .doc(requestorUserID)
            .delete()
        
        this.componentDidMount();
    }

    _handleDeclineGroupRequest = (creatorID, creatorName, requestorUserID, requestorFullName, groupName) => {
        //Storing to the Databse the response of the declined user
        firestore()
            .collection("Invitations")
            .doc(creatorID)
            .collection("Group Request Response")
            .doc(requestorUserID)
            .set({
                senderID: creatorID,
                senderName: creatorName,
                recipientUserID: requestorUserID,
                recipientUserFullName: requestorFullName,
                response: creatorName.concat(" has declined your request to join the Group ", groupName, "!")
            })

        //Deleting the Request sent by the Requestor
        firestore()
            .collection("Invitations")
            .doc(creatorID)
            .collection("Group Request")
            .doc(requestorUserID)
            .delete()

        this.componentDidMount();
    }

    _handleRefresh = () => {
        this.setState({ setRefresh: true })
        setTimeout(() => {
            this.setState({ setRefresh: false })
            this.componentDidMount();
        }, 5000)
    }

    render() {

        LogBox.ignoreAllLogs();

        const sexList = [
            { sex: "Male" },
            { sex: "Female" }
        ];

        const courseList = [
            { title: "Bachelor of Science in Information Technology" },
            { title: "Bachelor of Science in Computer Science" },
            { title: "Bachelor of Library and Information Science" }
        ];

        const BadgedIconInvitations = 
            withBadge(
                this.state.userInvitationCounter + 
                this.state.userGroupInvitationCounter + 
                this.state.userResponseCounter + 
                this.state.userGroupRequestCounter +
                this.state.userGroupRequestResponseCounter
            )(Icon);

        return (
            <Container>
                <ScrollView
                    refreshControl = {
                        <RefreshControl
                            refreshing = { this.state.setRefresh }
                            onRefresh = {() => this._handleRefresh()}
                        />
                    }
                >
                    <Content>
                        <Header
                            containerStyle = {{ backgroundColor: "#7B1FA2" }}
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
                                <View style = {{ marginRight: 10, flex: 1, flexDirection: "row" }}>
                                    <BadgedIconInvitations 
                                        type = "material-community" 
                                        name = "bell" 
                                        color = "#fff"
                                        onPress = {() => this._handleOpenNotifications(true)}
                                        containerStyle ={{ paddingLeft: "40%" }}
                                    />
                                </View>
                            }
                        />
                        <Avatar
                            rounded
                            size = "xlarge"
                            title = { this.state.avatarTemp }
                            activeOpacity = { 0.5 }
                            containerStyle = {{ backgroundColor: "#7B1FA2", marginTop: 40, alignSelf: "center" }}
                        >
                        </Avatar>
                        <Card containerStyle = {{ borderColor: "#7B1FA2", borderRadius: 10 }} >
                            <Card.Title style = {{ color: "#7B1FA2" }}>
                                Information
                            </Card.Title>
                            <Card.Divider style = {{ borderColor: "#7B1FA2", borderWidth: 0.5 }} />
                            <Input 
                                leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#7B1FA2" }}
                                label = "First Name"
                                labelStyle = {{ color: "#7B1FA2" }}
                                inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
                                defaultValue = { this.state.userFirstName }
                                disabled = { true }
                            />
                            <Input 
                                leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#7B1FA2" }}
                                label = "Last Name"
                                labelStyle = {{ color: "#7B1FA2" }}
                                inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
                                defaultValue = { this.state.userLastName }
                                disabled = { true }
                            />
                            <Input 
                                leftIcon = {{ type: "material-community", name: "counter", color: "#7B1FA2" }}
                                label = "Age"
                                labelStyle = {{ color: "#7B1FA2" }}
                                inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
                                defaultValue = { this.state.userAge }
                                disabled = { true }
                            />
                            { this._handleUserSexField() }
                            <Input 
                                placeholder = "email@address.com"
                                leftIcon = {{ type: "ion-icon", name: "mail", color: "#7B1FA2" }}
                                label = "Email Address"
                                labelStyle = {{ color: "#7B1FA2" }}
                                inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
                                defaultValue = { this.state.userEmail }
                                disabled = { true }
                            />
                            <Input 
                                leftIcon = {{ type: "ion-icon", name: "laptop", color: "#7B1FA2" }}
                                label = "Email Address"
                                labelStyle = {{ color: "#7B1FA2" }}
                                style = {{ fontSize: 11 }}
                                inputContainerStyle = {{ borderBottomWidth: 1, borderColor: "#7B1FA2" }}
                                defaultValue = { this.state.userCourse }
                                disabled = { true }
                            />
                        </Card>
                        <Button
                            title = "Edit"
                            type = "solid"
                            buttonStyle = { profileScreenStyle.profileButton }
                            onPress = {() => this._handleOpenUpdateProfileOverlay(true)}
                        />

                        {/* Update Profile Information */}
                        <Overlay
                            isVisible = { this.state.updateProfileOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseUpdateProfileOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <Card>
                                <ScrollView>
                                    <Card.Title style = { profileScreenStyle.profileCardTitle } >Update Profile</Card.Title>
                                    <Card.Divider/>
                                    <Input 
                                        placeholder = "First Name"
                                        leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#7B1FA2" }}
                                        label = "First Name"
                                        labelStyle = {{ color: "#7B1FA2" }}
                                        onChangeText = {(userFirstName) => this.setState ({ userFirstName })}
                                        value = { this.state.userFirstName }
                                        errorStyle = {{ color: "red" }}
                                        errorMessage = { this.state.userFirstNameFormValidation }
                                    />
                                    <Input 
                                        placeholder = "Last Name"
                                        leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#7B1FA2" }}
                                        label = "Last Name"
                                        labelStyle = {{ color: "#7B1FA2" }}
                                        onChangeText = {(userLastName) => this.setState ({ userLastName })}
                                        value = { this.state.userLastName }
                                        errorStyle = {{ color: "red" }}
                                        errorMessage = { this.state.userLastNameFormValidation }
                                    />
                                    <Input 
                                        placeholder = "Last Name"
                                        leftIcon = {{ type: "material-community", name: "counter", color: "#7B1FA2" }}
                                        label = "Last Name"
                                        labelStyle = {{ color: "#7B1FA2" }}
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
                                                        textStyle = {{ color: "#7B1FA2" }}
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
                                    <Text style = { profileScreenStyle.profileText }>
                                        Course
                                    </Text>
                                    {
                                        courseList.map((item, index) => {
                                            return (
                                                <View key = { index }>
                                                    <CheckBox
                                                        textStyle = {{ color: "#7B1FA2" }} 
                                                        title = { item.title }
                                                        checked = { this.state.userCourse === item.title }
                                                        onPress = {() => this.setState({ userCourse: item.title })}
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
                                        { this.state.userCourseFormValidation }
                                    </Text>
                                    <Button
                                        title = "Save"
                                        type = "solid"
                                        buttonStyle = {{ alignSelf: "center", marginTop: 15, paddingHorizontal: "41%", borderWidth: 1, backgroundColor: "#7B1FA2" }}
                                        onPress = {() => this._handleUpdateProfile()}
                                    />
                                    <Button
                                        title = "Close"
                                        type = "solid"
                                        buttonStyle = { profileScreenStyle.profileButton2 }
                                        onPress = {() => this._handleCloseUpdateProfileOverlay()}
                                    />
                                </ScrollView>
                            </Card>
                        </Overlay>
                        
                        {/* Invitation Notifications Overlay */}
                        <Overlay
                            isVisible = { this.state.notificationsOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseNotifications()}
                            overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <Card>
                                <ScrollView>
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
                                                    <Text style = {{ marginTop: 10 }} >Topics: { item.topics }</Text>
                                                    <Card.Divider/>
                                                    <View style ={{ flexDirection: "row", alignSelf: "center" }}>
                                                        <Button
                                                            title = "Join"
                                                            type = "standard"
                                                            onPress = {() => this._handleAcceptGroupInvitation(item.groupID, item.senderID, item.senderName, item.recipientUserID, item.recipientUserFullName, item.groupName, item.topics)}
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
                                        this.state.userGroupRequest.map((item, index) => {
                                            return (
                                                <Card key = { index }>
                                                    <Card.Title>{ item.requestorFullName }</Card.Title>
                                                    <Card.Divider/>
                                                    <Text>{ item.message }</Text>
                                                    <Card.Divider/>
                                                    <View style ={{ flexDirection: "row", alignSelf: "center" }}>
                                                        <Button
                                                            title = "Accept"
                                                            type = "standard"
                                                            onPress = {() => this._handleAcceptGroupRequest(item.groupID, item.creatorID, item.creatorName, item.requestorUserID, item.requestorFullName, item.groupName)}
                                                            buttonStyle = {{ backgroundColor: "#42BA96", marginHorizontal: 5, marginTop: 10 }}
                                                        />
                                                        <Button
                                                            title = "Decline"
                                                            type = "standard"
                                                            onPress = {() => this._handleDeclineGroupRequest(item.creatorID, item.creatorName, item.requestorUserID, item.requestorFullName, item.groupName)}
                                                            buttonStyle = {{ backgroundColor: "#DF4759", marginHorizontal: 5, marginTop: 10 }}
                                                        />
                                                    </View>
                                                </Card>
                                            )
                                        })
                                    }
                                    {
                                        this.state.userGroupRequestResponse.map((item, index) => {
                                            return (
                                                <Card key = { index }>
                                                    <Card.Title>{ item.senderName }</Card.Title>
                                                    <Card.Divider/>
                                                    <Text>{ item.response }</Text>
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
                                        type = "solid"
                                        buttonStyle = { profileScreenStyle.profileButton2 }
                                        onPress = {() => this._handleCloseNotifications()}
                                    />
                                </ScrollView>
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
        marginTop: "10%",
        marginBottom: "5%",
        paddingHorizontal: "30%",
        borderWidth: 1,
        backgroundColor: "#7B1FA2"
    },

    profileButton2: {
        alignSelf: "center",
        marginTop: 15,
        paddingHorizontal: "40%",
        borderWidth: 1,
        backgroundColor: "#7B1FA2"
    },

    profileCardTitle: {
        marginHorizontal: 0,
        color: "#7B1FA2"
    },

    profileText: {
        color: "#7B1FA2",
        marginLeft: 11,
        fontWeight: "bold",
        fontSize: 16
    }

});