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

        //Getting the Counter for Individual Latest Messages
        var messageThread = [];
        var messagecounter = 0;
        firestore() 
            .collection("Chat")
            .where("user", "array-contains", auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    messageThread.push({
                        threadID: doc.id,
                        recieved: doc.data().recieved,
                        sender: doc.data().sender
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < messageThread.length; index++) {
                    if (messageThread[index].sender._id != auth().currentUser.uid && messageThread[index].recieved == false) {
                        messagecounter = messagecounter + 1;
                    }
                }
                this.setState({ userMessagesCounter: messagecounter })
            })


        //Getting the Counter for Group Latest Messages
        var groupID = [];
        var groupMessagesCounter = 0;
        firestore()
            .collection("Groups")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    groupID.push({
                        documentID: doc.id,
                        recieved: doc.data().recieved,
                        sender: doc.data().sender,
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < groupID.length; index++) {
                    firestore()
                        .collection("Groups")
                        .doc(groupID[index].documentID)
                        .collection("Members")
                        .where("userID", "==", auth().currentUser.uid)
                        .get()
                        .then(() => {
                            if (groupID[index].sender._id != auth().currentUser.uid && groupID[index].recieved == false) {
                                groupMessagesCounter = groupMessagesCounter + 1;
                            }
                            this.setState({ groupMessagesCounter: groupMessagesCounter })
                        })
                }
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

    _handleAcceptGroupInvitation = (senderID, senderName, recipientUserID, recipientUserFullName, groupName, topics) => {
        //Getting Group ID
        var groupID = "";
        firestore()
            .collection("Groups")
            .where("creatorID", "==", senderID)
            .where("groupName", "==", groupName)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    groupID = doc.id;
                })
            })
            .then(() => {
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
            })

        // firestore()
        //     .collection("Groups")
        //     .doc(groupName)
        //     .set({
        //         groupName: groupName,
        //         creatorID: senderID,
        //         creatorName: senderName,
        //         topics: topics
        //     })
        //     .then(() => {
        //         //Store the creator information
        //         firestore()
        //             .collection("Groups")
        //             .doc(groupName)
        //             .collection("Members")
        //             .doc(senderID)
        //             .set({
        //                 userID: senderID,
        //                 userFullName: senderName
        //             })
                
        //         //Store the invited peer information
        //         firestore()
        //             .collection("Groups")
        //             .doc(groupName)
        //             .collection("Members")
        //             .doc(recipientUserID)
        //             .set({
        //                 userID: recipientUserID,
        //                 userFullName: recipientUserFullName
        //             })
        //     })

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

    _handleAcceptGroupRequest = (creatorID, creatorName, requestorUserID, requestorFullName, groupName) => {
        //Getting Group ID
        var groupID = "";
        firestore()
            .collection("Groups")
            .where("creatorID", "==", creatorID)
            .where("groupName", "==", groupName)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    groupID = doc.id;
                })
            })

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
        // firestore()
        //     .collection("Groups")
        //     .doc(groupName)
        //     .collection("Members")
        //     .doc(requestorUserID)
        //     .set({
        //         userFullName: requestorFullName,
        //         userID: requestorUserID
        //     })

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
    
    _handleActiveIndexUser = (otherUserName, otherUserID) => {
        if (this.state.activeIndex == otherUserName) {
            this.setState({ activeIndex: "" })
        } else {
            this.setState({ activeIndex: otherUserName })
        }
        //Getting the Document ID for both Users for Video Call
        var documentID = [];
        firestore()
            .collection("Chat")
            .where("user", "array-contains", auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    documentID.push({
                        docID: doc.id,
                        users: doc.data().user
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < documentID.length; index++) {
                    for (let i = 0; i < 2; i++) {
                        if (documentID[index].users[i] == otherUserID) {
                            this.setState({ userVideoCallChannel: documentID[index].docID })
                        }
                    }
                }
            })
    }

    _handleOpenMessageOverlay = (visible) => {
        //Getting all Individual Message Threads that is connected to the current user
        var messageThread = [];
        var latestMessages = [];
        firestore()
            .collection("Chat")
            .where("user", "array-contains", auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    messageThread.push({
                        threadID: doc.id
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < messageThread.length; index++) {
                    firestore()
                        .collection("Chat")
                        .doc(messageThread[index].threadID)
                        .get()
                        .then((snapShot) => {
                            latestMessages.push({
                                threadID: messageThread[index].threadID,
                                message: snapShot.data().latestMessage,
                                createdAt: new Date(snapShot.data().latestMessage.createdAt).toDateString(),
                                recieved: snapShot.data().recieved,
                                system: snapShot.data().system,
                                sender: snapShot.data().sender,
                                user: snapShot.data().user,
                            })
                            this.setState({ userLatestMessages: latestMessages })
                        })
                }
            })

        //Getting all Group Message Threads that is connected to the current user
        var groupID = [];
        var groupLatestMessages = [];
        firestore()
            .collection("Groups")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    groupID.push({
                        documentID: doc.id,
                        groupName: doc.data().groupName,
                        message: doc.data().latestMessage,
                        createdAt: new Date(doc.data().latestMessage.createdAt).toDateString(),
                        recieved: doc.data().recieved,
                        sender: doc.data().sender,
                        system: doc.data().system,
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < groupID.length; index++) {
                    firestore()
                        .collection("Groups")
                        .doc(groupID[index].documentID)
                        .collection("Members")
                        .where("userID", "==", auth().currentUser.uid)
                        .get()
                        .then(() => {
                            groupLatestMessages.push({
                                groupID: groupID[index].documentID,
                                groupName: groupID[index].groupName,
                                message: groupID[index].message,
                                createdAt: groupID[index].createdAt,
                                recieved: groupID[index].recieved,
                                sender: groupID[index].sender,
                                system: groupID[index].system,
                            })
                            this.setState({ groupLatestMessages: groupLatestMessages })
                        })
                }
            })

        this.setState({ messageOverlayVisibility: visible })
    }

    _handleCloseMessageOverlay = () => {
        this.setState({ messageOverlayVisibility: false })
    }

    _handleLatestMessageChatNavigation = (user, threadID) => {
        //Navigating Latest Messages for Invdividuals
        var otherUserID = "";
        for (let index = 0; index < user.length; index++) {
            if (user[index] != auth().currentUser.uid) {
                otherUserID = user[index];
            }
        }

        firestore()
            .collection("Chat")
            .doc(threadID)
            .update({
                recieved: true
            })

        this.props.navigation.navigate("Chat Study Peers" ,{
            documentID: threadID,
            otherUserID: otherUserID,
            currentUserID: auth().currentUser.uid,
            currentUserLastName: this.state.userLastName,
        })
    }

    _handleGroupLatestMessageChatNavigation = (groupID) => {
        //Navigating Latest Messages for Groups
        firestore()
            .collection("Groups")
            .doc(groupID)
            .update({
                recieved: true
            })

        this.props.navigation.navigate("Chat", {
            userLastName: this.state.userLastName,
            studyGroupID: groupID,
            currentUserID: auth().currentUser.uid,
        })
    }

    render() {

        LogBox.ignoreAllLogs();

        const sexList = [
            { sex: "Male" },
            { sex: "Female" }
        ];

        const BadgedIconInvitations = 
            withBadge(
                this.state.userInvitationCounter + 
                this.state.userGroupInvitationCounter + 
                this.state.userResponseCounter + 
                this.state.userGroupRequestCounter +
                this.state.userGroupRequestResponseCounter
            )(Icon);

        const BadgedIconMessages = 
            withBadge(
                this.state.userMessagesCounter +
                this.state.groupMessagesCounter
            )(Icon);
        
        const rtcProps = {
            appId: '573557ec13bc4538bdf45c56fe439e73',
            channel: this.state.userVideoCallChannel,
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
                                     <BadgedIconMessages
                                        type = "material-community"
                                        name = "message-bulleted"
                                        color = "#fff"
                                        onPress = {() => this._handleOpenMessageOverlay(true)}
                                    />
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
                        </Card>
                        <Button
                            title = "Edit"
                            type = "solid"
                            buttonStyle = { profileScreenStyle.profileButton }
                            onPress = {() => this._handleOpenUpdateProfileOverlay(true)}
                        />

                        {/* User Study Peer List */}
                        <Card containerStyle = {{ borderColor: "#7B1FA2", marginBottom: "5%", borderRadius: 10 }} >
                            <Card.Title style = {{ color: "#7B1FA2" }} >Study Peer List</Card.Title>
                            <Card.Divider/>
                            {
                                this.state.userStudyPeers.map((item, index) => {
                                    return (
                                        <ListItem.Accordion
                                            key = { index }
                                            content = {
                                                <>
                                                    <ListItem.Content>
                                                        <ListItem.Title style = {{ color: "#7B1FA2", fontWeight: "bold" }} >
                                                            { item.otherUserName }
                                                        </ListItem.Title>
                                                    </ListItem.Content>
                                                </>
                                            }
                                            isExpanded = { this.state.activeIndex == item.otherUserName }
                                            onPress = {() => this._handleActiveIndexUser(item.otherUserName, item.otherUserID)}
                                        >
                                            <ListItem>
                                                <ListItem.Content style = {{ alignItems: "center" }} >
                                                    <Button
                                                        title = "Chat"
                                                        type = "solid"
                                                        onPress = {() => this._handleChatNavigation(item.otherUserID)}
                                                        buttonStyle = {{ paddingHorizontal: "43.5%", marginBottom: 5, backgroundColor: "#7B1FA2" }}
                                                    />
                                                    <Button
                                                        title = "Video Call"
                                                        type = "solid"
                                                        onPress = {() => this.setState({ videoCall: true })}
                                                        buttonStyle = {{ paddingHorizontal: "40%", marginTop: 5, backgroundColor: "#7B1FA2" }}
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
                                                            onPress = {() => this._handleAcceptGroupInvitation(item.senderID, item.senderName, item.recipientUserID, item.recipientUserFullName, item.groupName, item.topics)}
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
                                                            onPress = {() => this._handleAcceptGroupRequest(item.creatorID, item.creatorName, item.requestorUserID, item.requestorFullName, item.groupName)}
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

                        {/* Message Notification Overlay */}
                        <Overlay
                            isVisible = { this.state.messageOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseMessageOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                            fullScreen = { true }
                        >
                            <ScrollView>
                                <Card>
                                    <Card.Title style = {{ color: "#7B1FA2" }} >Messages</Card.Title>
                                    <Card.Divider/>
                                    {
                                        this.state.userLatestMessages.map((item, index) => {
                                            if (this.state.userLatestMessages == "" || item.sender._id == auth().currentUser.uid || item.recieved == true) {
                                                return (
                                                    <Text h4 style = {{  color: "#7B1FA2", alignSelf: "center" }}>
                                                        No Individual Messages
                                                    </Text>
                                                )
                                            } else {
                                                return (
                                                    <ListItem key  = { index }>
                                                        <ListItem.Content>
                                                            <TouchableOpacity  onPress = {() => this._handleLatestMessageChatNavigation(item.user, item.threadID)} >
                                                                <ListItem.Subtitle>{ item.createdAt }</ListItem.Subtitle>
                                                                <ListItem.Title style = {{ fontWeight: "bold" }} >{ item.sender.displayName }: {item.message.text}</ListItem.Title>
                                                            </TouchableOpacity>
                                                        </ListItem.Content>
                                                        <ListItem.Chevron 
                                                            iconStyle = {{ color: "#7B1FA2", fontSize: 30, fontWeight: "bold" }} 
                                                            onPress = {() => this._handleLatestMessageChatNavigation(item.user, item.threadID)} 
                                                        />
                                                    </ListItem>
                                                )
                                            }
                                        })
                                    }
                                    {
                                        this.state.groupLatestMessages.map((item, index) => {
                                            if (this.state.groupLatestMessages == "" || item.sender._id == auth().currentUser.uid || item.recieved == true) {
                                                return (
                                                    <Text h4 style = {{  color: "#7B1FA2", alignSelf: "center" }}>
                                                        No Group Messages
                                                    </Text>
                                                )
                                            } else {
                                                return (
                                                    <ListItem key = { index }>
                                                        <ListItem.Content>
                                                            <TouchableOpacity onPress = {() => this._handleGroupLatestMessageChatNavigation(item.groupID)} >
                                                                <ListItem.Subtitle>{ item.createdAt }</ListItem.Subtitle>
                                                                <ListItem.Title style = {{ fontStyle: "italic" }}>Group: { item.groupName }</ListItem.Title>
                                                                <ListItem.Title style = {{ fontWeight: "bold" }} >{ item.sender.displayName }: {item.message.text}</ListItem.Title>
                                                            </TouchableOpacity>
                                                        </ListItem.Content>
                                                        <ListItem.Chevron
                                                            iconStyle = {{ color: "#7B1FA2", fontSize: 30, fontWeight: "bold" }}
                                                            onPress = {() => this._handleGroupLatestMessageChatNavigation(item.groupID)}
                                                        />
                                                    </ListItem>
                                                )
                                            }
                                        })
                                    }
                                </Card>
                            </ScrollView>
                            <Button
                                title = "Close"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2", marginHorizontal: "10%", marginTop: "3%" }}
                                onPress = {() => this._handleCloseMessageOverlay()}
                            />
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