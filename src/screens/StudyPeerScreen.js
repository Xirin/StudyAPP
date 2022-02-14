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

export default class StudyPeerScreen extends Component {

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
                this.setState({ userAge: snapShot.data().age })
                this.setState({ userSex: snapShot.data().sex })
                this.setState({ userEmail: firebase.auth().currentUser.email })
            });

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
                                text: "Study Peers",
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
                                </View>
                            }
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
                                                        No Messages
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
                                                return null;
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