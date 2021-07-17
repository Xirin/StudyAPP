import React, { Component } from 'react';

import {
    StyleSheet,
    LogBox,
    ScrollView
} from 'react-native';

import {
    Container,
    Content,
} from 'native-base'

import {
    Header,
    Card,
    Button,
    ListItem,
    Overlay,
    Input,
    CheckBox,
    Text,
} from 'react-native-elements';

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class UserGroupScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userGroups: [''],
            userAvailableGroups: [''],
            arrayInitializer: [''],
            userFirstName: "",
            userLastName: "",
            userGroup: "",
            checkedItem: "",
            createGroupOverlayVisibility: false,
            joinGroupOvarlayVisibility: false,
            checkedM: false,
            checkedS: false,
            checkedL: false,
            activeIndex: '',
        }
    }

    componentDidMount = () => {
        this.forceUpdate();
        //Fetch All the Groups that the User is Part of
        var userGroupCollection = "";
        var userGroupArray = [];
        firestore()
            .collection("Groups")
            .get()
            .then((snapShot) => {
                userGroupCollection = snapShot.docs.map(doc => doc.data());
            })
            .then(() => {
                for(let index = 0; index < userGroupCollection.length; index++) {
                    firestore()
                        .collection("Groups")
                        .doc(userGroupCollection[index].groupName)
                        .collection("Members")
                        .where("userID", "==", auth().currentUser.uid)
                        .get()
                        .then((snapShot) => {
                            snapShot.forEach(() => {
                                userGroupArray.push({
                                    groupName: userGroupCollection[index].groupName,
                                    topic: userGroupCollection[index].topic
                                })
                            })
                            this.setState({ userGroups: userGroupArray })
                        })
                }
            });
        
        //Fetch the Last Name of the Current User
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                this.setState({ userFirstName: snapShot.data().firstName })
                this.setState({ userLastName: snapShot.data().lastName })
            })
        
        this.setState({ userAvailableGroups: this.state.arrayInitializer })
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer()
    }

    _handleChatNavigation = (userGroupName) => {
        this.props.navigation.navigate("Chat", {
            userLastName: this.state.userLastName,
            studyGroupName: userGroupName,
            currentUserID: auth().currentUser.uid
        });
    }

    _handleVideoCallNavigation = (userGroupName) => {
        this.props.navigation.navigate("Video Call", {
            studyGroupName: userGroupName
        });
    }

    _handleOpenCreateGroupOvelay = (visible) => {
        this.setState({ createGroupOverlayVisibility: visible })
    }

    _handleCloseCreateGroupOverlay = () => {
        this.setState({ createGroupOverlayVisibility: false })
    }

    _handleJoinGroupOverlay = (visible) => {
        this.setState({ joinGroupOvarlayVisibility: visible })
        var userGroupCollection = "";
        var userGroupArray = [];
        firestore()
            .collection("Groups")
            .get()
            .then((snapShot) =>{
                userGroupCollection = snapShot.docs.map(doc => doc.data());
            })
            .then(() => {
                for (let index = 0; index < userGroupCollection.length; index++) {
                    firestore()
                        .collection("Groups")
                        .doc(userGroupCollection[index].groupName)
                        .collection("Members")
                        .doc(auth().currentUser.uid)
                        .get()
                        .then((doc) => {
                            if(!doc.exists) {
                                userGroupArray.push({
                                    groupName: userGroupCollection[index].groupName,
                                    topic: userGroupCollection[index].topic,
                                })
                                this.setState({ userAvailableGroups: userGroupArray })
                            }
                        })
                }
            });
    }

    _handleCloseJoinGroupOverlay = () => {
        this.setState({ joinGroupOvarlayVisibility: false })
    }

    _handleCreateGroupCheckBox = (checkedItem) => {
        if(checkedItem === "Mathematics") {
            this.setState({ checkedM: true })
            this.setState({ checkedL: false })
            this.setState({ checkedS: false })
            this.setState({ checkedItem: checkedItem })
        }

        else if(checkedItem === "Language") {
            this.setState({ checkedM: false })
            this.setState({ checkedL: true })
            this.setState({ checkedS: false })
            this.setState({ checkedItem: checkedItem })
        }

        else if(checkedItem === "Science") {
            this.setState({ checkedM: false })
            this.setState({ checkedL: false })
            this.setState({ checkedS: true })
            this.setState({ checkedItem: checkedItem })
        }
    }

    _handleCreateGroup = () => {
        firestore()
            .collection("Groups")
            .doc(this.state.userGroup)
            .set({
                groupName: this.state.userGroup,
                topic: this.state.checkedItem,
            })
            .then(() => {
                firestore()
                    .collection("Groups")
                    .doc(this.state.userGroup)
                    .collection("Members")
                    .doc(auth().currentUser.uid)
                    .set({
                        userID: auth().currentUser.uid,
                        firstName: this.state.userFirstName,
                        lastName: this.state.userLastName
                    })
            })
            .then(() => {
                firestore()
                    .collection("Groups")
                    .doc(this.state.userGroup)
                    .collection("Messages")
                    .add({
                        text: this.state.userGroup + " created. Welcome!",
                        createdAt: new Date().getTime(),
                        system: true,
                    })
            })
        
        this._handleCloseCreateGroupOverlay();
        this.componentDidMount();
    }

    _handleJoinGroup = (groupName) => {
        firestore()
            .collection("Groups")
            .doc(groupName)
            .collection("Members")
            .doc(auth().currentUser.uid)
            .set({
                userID: auth().currentUser.uid,
                firstName: this.state.userFirstName,
                lastName: this.state.userLastName,
            })
        
        this._handleCloseJoinGroupOverlay();
        this.componentDidMount();
    }

    render() {
        LogBox.ignoreAllLogs();
        return(
            <Container>
                <Content>
                    <Header 
                        leftComponent = {{ 
                            icon: "menu",
                            color: "#fff",
                            onPress: () => this._handleOpenDrawer(),
                        }}
                        centerComponent = {{
                            text: "Groups",
                            style: {color: "#fff"}
                        }}
                    />
                    <Card containerStyle = { userGroupScreenStyle.ugCard } >
                        <Card.Title style = {{ color: "#2288DC" }} >
                            Create or Discover Groups
                        </Card.Title>
                        <Card.Divider style = { userGroupScreenStyle.udDivider } />
                        <Button  
                            title ="Create Group"
                            type ="outline"
                            onPress = {() => this._handleOpenCreateGroupOvelay()}
                        />
                        <Button
                            title = "Join Group"
                            type = "outline"
                            containerStyle = {{ marginTop: 10 }}
                            onPress = {() => this._handleJoinGroupOverlay()}
                        />
                    </Card>
                    <Card containerStyle = { userGroupScreenStyle.ugCard2 } >
                        <Card.Title style = {{ color: "#2288DC" }}>
                            Your Groups
                        </Card.Title>
                        <Card.Divider/>
                        {
                            this.state.userGroups.map((item, index) => {
                                return(
                                    <ListItem.Accordion
                                        style = { userGroupScreenStyle.ugCardTitle }
                                        key = { index }
                                        content = {
                                            <>
                                                <ListItem.Content>
                                                    <ListItem.Title style = {{ color: "#2288DC" }}>
                                                        { item.groupName }
                                                    </ListItem.Title>
                                                </ListItem.Content>
                                            </>
                                        }
                                        
                                        isExpanded = { this.state.activeIndex === item.groupName }
                                        onPress = {() => {
                                            this.setState({ activeIndex: item.groupName })
                                        }}
                                    >
                                        <ListItem>
                                            <ListItem.Content>
                                                <Button
                                                    type = "outline"
                                                    title = "Chat"
                                                    buttonStyle = { userGroupScreenStyle.ugButton }
                                                    onPress = {() => this._handleChatNavigation(item.groupName)}
                                                />
                                                <Button
                                                    type = "outline"
                                                    title = "Video Call"
                                                    buttonStyle = { userGroupScreenStyle.ugButton2 }
                                                    onPress = {() => this._handleVideoCallNavigation(item.groupName)}
                                                />
                                            </ListItem.Content>
                                        </ListItem>
                                    </ListItem.Accordion>
                                )
                            })
                        }
                    </Card>

                    <Overlay
                        isVisible = { this.state.createGroupOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseCreateGroupOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <Card>
                            <Card.Title style = { userGroupScreenStyle.ugOverlayCard }>
                                Create Group
                            </Card.Title>
                            <Card.Divider/>
                            <Input
                                placeholder = "...."
                                label = "Group Name"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(userGroup) => this.setState({ userGroup })}
                                value = { this.state.userGroup }
                            />
                            <CheckBox
                                title = "Mathematics"
                                textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked = { this.state.checkedM }
                                onPress = {() => this._handleCreateGroupCheckBox("Mathematics")}
                            />
                            <CheckBox
                                title = "Science"
                                textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked = { this.state.checkedS }
                                onPress = {() => this._handleCreateGroupCheckBox("Science")}
                            />
                            <CheckBox
                                title = "Langauge"
                                textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked = { this.state.checkedL }
                                onPress = {() => this._handleCreateGroupCheckBox("Language")}
                            />
                            <Button
                                title = "Save"
                                type = "outline"
                                containerStyle = { userGroupScreenStyle.ugOverlayButton }
                                onPress = {() => this._handleCreateGroup()}
                            />
                            <Button
                                title = "Close"
                                type = "outline"
                                onPress = {() => this._handleCloseCreateGroupOverlay()}
                                containerStyle = { userGroupScreenStyle.ugOverlayButton }
                            />
                        </Card>
                    </Overlay>

                    <Overlay
                        isVisible = { this.state.joinGroupOvarlayVisibility }
                        onBackdropPress = {() => this._handleCloseJoinGroupOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <Card>
                            <Card.Title style = { userGroupScreenStyle.ugOverlayCard2 }>
                                Discover Groups
                            </Card.Title>
                            <Card.Divider/>
                            {
                                this.state.userAvailableGroups.map((item, index) => {
                                    if (this.state.userAvailableGroups == "") {
                                        return(
                                            <Text h4 style = {{  color: "#2288DC", alignSelf: "center" }}>
                                                No Available Groups
                                            </Text>
                                        )
                                    }
                                    else {
                                        return(
                                            <ListItem.Accordion
                                                style = { userGroupScreenStyle.ugCardTitle }
                                                key = { index }
                                                content = {
                                                    <>
                                                        <ListItem.Content>
                                                            <ListItem.Title style = {{ color: "#2288DC" }}>
                                                                { item.groupName }
                                                            </ListItem.Title>
                                                        </ListItem.Content>
                                                    </>
                                                }
                                                isExpanded = { this.state.activeIndex === item.groupName }
                                                onPress = {() => {
                                                    this.setState({ activeIndex: item.groupName })
                                                }}
                                            >
                                                <ListItem>
                                                    <ListItem.Content>
                                                        <Button
                                                            type = "outline"
                                                            title = "Join"
                                                            buttonStyle = { userGroupScreenStyle.ugButton4 }
                                                            onPress = {() => this._handleJoinGroup(item.groupName)}
                                                        />
                                                        <Button
                                                            type = "outline"
                                                            title = "Close"
                                                            buttonStyle = { userGroupScreenStyle.ugButton3 }
                                                            onPress = {() => this._handleCloseJoinGroupOverlay()}
                                                        />
                                                    </ListItem.Content>
                                                </ListItem>
                                            </ListItem.Accordion>
                                        )
                                    }
                                })
                            }
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        );
    }
}

const userGroupScreenStyle = StyleSheet.create({

    ugCard: {
        borderWidth: 1,
        borderColor: "#2288DC"
    },

    ugCard2: {
        marginTop: 50,
        borderWidth: 1,
        borderColor: "#2288DC"
    },

    ugCardTitle: {
        borderBottomWidth: 1,
        borderColor: "#2288DC",
    },

    ugButton: {
        paddingHorizontal: 110,
        marginBottom: 10,
    },

    ugButton2: {
        paddingHorizontal: 91,
    },

    ugButton3: {
        paddingHorizontal: 101,
    },

    ugButton4: {
        paddingHorizontal: 106,
        marginBottom: 10,
    },

    ugOverlayCard: {
        marginHorizontal: 100,
        color: "#2288DC"
    },
    
    ugOverlayCard2: {
        marginHorizontal: 85,
        color: "#2288DC"
    },

    ugOverlayCheckbox: {
        color: "#2288DC"
    },

    ugOverlayButton: {
        marginTop: 10,
    }

});