import React, { Component } from 'react';

import { 
    TouchableOpacity,
    Modal,
    StyleSheet,
    View,
} from "react-native";

import { 
  Container, 
  Content, 
  Card,
  CardItem,
  Icon,
  Button,
  Text,
  Radio,
  Right,
  Left,
  Item,
  Input,
  Label,
} from 'native-base';

import {
    Avatar,
} from 'react-native-elements'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ProfileScreen extends Component {

    //Variable Initializations
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            firstName: '',
            lastName: '',
            studyTopicSelected: '',
            studyGroupName: '',
            studyGroupListCreating: [''],
            studyGroupListJoining: [''],
            createGroupModalVisibility: false,
            joinGroupModalVisibility: false,
            chatAndVideoCallModalVisibilty: false,
            arrayInitializer: [''],
            studyGroupChatSelected: '',
        }
    }

    //Fetch User Profile DAta
    componentDidMount = () => {
        firestore()
            .collection('Users')
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                this.setState({ userName: snapShot.data().userName });
                this.setState({ firstName: snapShot.data().firstName });
                this.setState({ lastName: snapShot.data().lastName });
            });
        
        var groupCollectionCreating = "";
        var studyGroupArrayCreating = [];
        firestore()
            .collection('Groups')
            .get()
            .then((snapShot) => {
                groupCollectionCreating = snapShot.docs.map(doc => doc.data());
            })
            .then(() => {
                for (let index = 0; index < groupCollectionCreating.length; index++) {
                    firestore()
                        .collection('Groups')
                        .doc(groupCollectionCreating[index].groupName)
                        .collection('Members')
                        .where('userID', '==', auth().currentUser.uid)
                        .get()
                        .then((snapShot) => {
                            snapShot.forEach(() => {
                                studyGroupArrayCreating.push({
                                    groupName: groupCollectionCreating[index].groupName,
                                    topic: groupCollectionCreating[index].topic,
                                })
                            })
                            this.setState({ studyGroupListCreating: studyGroupArrayCreating });
                        })
                }
            });

        this.setState({ studyGroupListJoining: this.state.arrayInitializer });
    }

    //Handles the Signing Out of User
    _handleSignOut = () => {
        auth().signOut();
        this.props.navigation.navigate('Sign In');
    }

    //Opening and Closing Trigger of Create Group Modal
    _handleCreateGroupModalVisibility = (visible) => {
        this.setState({ createGroupModalVisibility: visible });
    }

    //Handles the Creation of the Study Group
    _handleCreateStudyGroup = () => {
        firestore()
            .collection("Groups")
            .doc(this.state.studyGroupName)
            .set({
                groupName: this.state.studyGroupName,
                topic: this.state.studyTopicSelected,
                latestMessage: {
                    text: this.state.studyGroupName + ' created. Welcome!',
                    createdAt: new Date().getTime(),
                },
            })
            .then(() => {
                firestore()
                    .collection('Groups')
                    .doc(this.state.studyGroupName)
                    .collection("Members")
                    .doc(auth().currentUser.uid)
                    .set({
                        userID: auth().currentUser.uid,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName
                    })
            }).then(()=> {
                firestore()
                    .collection('Groups')
                    .doc(this.state.studyGroupName)
                    .collection('Messages')
                    .add({
                        text: this.state.studyGroupName + ' created. Welcome!',
                        createdAt: new Date().getTime(),
                        system: true,
                    })
            });
        
        this._handleCreateGroupModalVisibility(!this.state.createGroupModalVisibility);
        this.componentDidMount();
    }

    //Opening and Closing Trigger of Join Group Modal
    _handleJoinStudyGroupVisibility = (visible) => {
        this.setState({ joinGroupModalVisibility: visible });
        var groupCollectionJoining = "";
        var studyGroupArrayJoining = [];
        firestore()
            .collection('Groups')
            .get()
            .then((snapShot) => {
                groupCollectionJoining = snapShot.docs.map(doc => doc.data());
            })
            .then(() => {
                for (let index = 0; index < groupCollectionJoining.length; index++) {
                    firestore()
                        .collection('Groups')
                        .doc(groupCollectionJoining[index].groupName)
                        .collection('Members')
                        .doc(auth().currentUser.uid)
                        .get()
                        .then((doc) => {
                            if (!doc.exists) {
                                studyGroupArrayJoining.push({
                                    groupName: groupCollectionJoining[index].groupName,
                                    topic: groupCollectionJoining[index].topic
                                })
                                this.setState({ studyGroupListJoining: studyGroupArrayJoining });
                            }
                        })
                }
            });
    }

    _handleJoinStudyGroup = (studyGroupName) => {
        firestore()
            .collection('Groups')
            .doc(studyGroupName)
            .collection('Members')
            .doc(auth().currentUser.uid)
            .set({
                userID: auth().currentUser.uid,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            });
        
        this._handleJoinStudyGroupVisibility(!this.state.joinGroupModalVisibility);
        this.componentDidMount();
    }

    _handleChatAndVideoCallModalvisivility = (visible, studyGroupName) => {
        this.setState({ chatAndVideoCallModalVisibilty: visible });
        this.setState({ studyGroupChatSelected: studyGroupName });
    }
    
    _handleGroupChatNavigation = () => {
        this.setState({ chatAndVideoCallModalVisibilty: false });
        this.props.navigation.navigate('Chat', {
            studyGroupName: this.state.studyGroupChatSelected,
            currentUserName: this.state.lastName,
            currentUserID: auth().currentUser.uid,
        })
    }

    _handleGroupVideoCallNavigation = () => {
        this.setState({ chatAndVideoCallModalVisibilty: false });
        this.props.navigation.navigate('Video Call', {
            studyGroupName: this.state.studyGroupChatSelected,
        });
    }
    
    render() {
        return (
            <Container style = {{ backgroundColor: "#5b5275", }} >
                <Content>

                    {/* User Profile Card */}
                    <Avatar
                        rounded
                        containerStyle = {{ backgroundColor: "#6490b3" ,alignSelf: "center", marginTop: 25 }} 
                        size = "xlarge"
                        activeOpacity = {0.5}
                        onPress = {() => console.log("Hey")}
                    ></Avatar>
                    <Card style = {profilePageStyle.profileCard}>
                        <CardItem header style = {profilePageStyle.profileCardHeader}>
                            <Text style = {profilePageStyle.profileTextHeader}>User Profile</Text>
                        </CardItem>
                        <CardItem style = {profilePageStyle.profileCardItem}>
                            <Icon type = "MaterialIcons" name = "person" />
                            <Text>{this.state.userName}</Text>
                        </CardItem>
                        <CardItem style = {profilePageStyle.profileCardItem}>
                            <Icon type = "MaterialIcons" name = "person" />
                            <Text>{this.state.firstName}</Text>
                        </CardItem>
                        <CardItem style = {profilePageStyle.profileCardItem}>
                            <Icon type = "MaterialIcons" name = "person" />
                            <Text>{this.state.lastName}</Text>
                        </CardItem>
                    </Card>

                    {/* Create and Join Group Card */}
                    <Card style = {profilePageStyle.profileCard}>
                        <CardItem header style = {profilePageStyle.profileCardHeader}>
                            <Text style = {profilePageStyle.profileTextHeader}>Groups</Text>
                        </CardItem>
                        <TouchableOpacity onPress = {() => this._handleCreateGroupModalVisibility(true)}>
                            <CardItem style = {profilePageStyle.profileCardHeader}>
                                <Icon type = "MaterialIcons" name = "add-circle" />
                                <Text>Create Group</Text>
                            </CardItem>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {() => this._handleJoinStudyGroupVisibility(true) }>
                            <CardItem style = {profilePageStyle.profileCardHeader}>
                                <Icon type = "MaterialIcons" name = "group-add" />
                                <Text>Join Group</Text>
                            </CardItem>
                        </TouchableOpacity>
                    </Card>

                    {/* List of Groups Card */}
                    <Card style = { profilePageStyle.profileCard }>
                        <CardItem style = { profilePageStyle.profileCardHeader }> 
                            <Text style = { profilePageStyle.profileTextHeader }>List of Groups</Text>
                        </CardItem>
                        {
                            this.state.studyGroupListCreating.map((item, index) => {
                                return (
                                    <CardItem key = {index} style = { profilePageStyle.profileCardItem }>
                                        <Icon type = "MaterialIcons" name = "people" />
                                        <TouchableOpacity onPress = {() => this._handleChatAndVideoCallModalvisivility(true, item.groupName)}>
                                            <Text>{item.groupName}</Text>
                                        </TouchableOpacity>
                                    </CardItem>
                                )
                            })
                        }
                    </Card>
                    
                    {/* Sign Out Button */}
                    <Button light style = {profilePageStyle.profileButton} onPress = { this._handleSignOut }>
                        <TouchableOpacity>
                            <Text>Sign Out</Text>
                        </TouchableOpacity>
                    </Button>

                    {/* Chat and Video Call Modal */}
                    <Modal
                        animationType = "slide"
                        transparent = { true }
                        visible = { this.state.chatAndVideoCallModalVisibilty }
                    >
                        <Container style = {{ backgroundColor: "rgba(0,0,0,0.9)" }}>
                            <Content>
                                <Card style = { profilePageStyle.profileCardModal }>
                                    <CardItem style = { profilePageStyle.profileCardHeader } > 
                                        <TouchableOpacity onPress = {() => this._handleGroupChatNavigation()}>
                                            <Text style = { profilePageStyle.profileTextHeader }>Chat</Text>
                                        </TouchableOpacity>
                                    </CardItem>
                                </Card>
                                <Card style = { profilePageStyle.profileCard }>
                                <CardItem style = { profilePageStyle.profileCardHeader } > 
                                        <TouchableOpacity onPress = {() => this._handleGroupVideoCallNavigation()}>
                                            <Text style = { profilePageStyle.profileTextHeader }>Video Call</Text>
                                        </TouchableOpacity>
                                    </CardItem>
                                </Card>
                                <View style = { profilePageStyle.profileButtonGroup }>
                                    <Button light style = { profilePageStyle.profileButton } onPress = {() => this._handleChatAndVideoCallModalvisivility(!this.state.chatAndVideoCallModalVisibilty) } > 
                                        <Text>Close</Text>
                                    </Button>
                                </View>
                            </Content>
                        </Container>
                    </Modal>

                    {/* Create Group Modal */}
                    <Modal 
                        animationType = "slide"
                        transparent = { true }
                        visible = { this.state.createGroupModalVisibility }
                    >
                        <Container style = {{backgroundColor: "rgba(0,0,0,0.9)"}}>
                            <Content>
                                <Card style = { profilePageStyle.profileCardModal }>
                                    <CardItem header style = { profilePageStyle.profileCardHeader }> 
                                        <Text style = {profilePageStyle.profileTextHeader}>Select a Topic:</Text>
                                    </CardItem>
                                </Card>
                                <Card style = { profilePageStyle.profileCard }>
                                    <TouchableOpacity onPress = {() => this.setState({ studyTopicSelected: 'language' })}>
                                        <CardItem style = { profilePageStyle.profileCardItem }>
                                            <Left>
                                                <Icon type = "MaterialCommunityIcons" name = "alphabetical-variant" />
                                                <Text>Language</Text>
                                            </Left>
                                            <Right>
                                                <Radio
                                                    onPress = {() => this.setState({ studyTopicSelected: 'language' })}
                                                    selected = { this.state.studyTopicSelected == 'language' }
                                                />
                                            </Right>
                                        </CardItem>
                                    </TouchableOpacity>
                                    <TouchableOpacity  onPress = {() => this.setState({ studyTopicSelected: 'mathematics' })}>
                                        <CardItem style = { profilePageStyle.profileCardItem }>
                                            <Left>
                                                <Icon type = "MaterialCommunityIcons" name = "calculator-variant" />
                                                <Text>Mathematics</Text>
                                            </Left>
                                            <Right>
                                                <Radio 
                                                    onPress = {() => this.setState({ studyTopicSelected: 'mathematics' })}
                                                    selected = { this.state.studyTopicSelected == 'mathematics' }
                                                />
                                            </Right>
                                        </CardItem>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress = {() => this.setState({ studyTopicSelected: 'science' })}>
                                        <CardItem style = { profilePageStyle.profileCardItem }>
                                            <Left>
                                                <Icon type = "MaterialCommunityIcons" name = "atom" />
                                                <Text>Science</Text>
                                            </Left>
                                            <Right>
                                                <Radio
                                                    onPress = {() => this.setState({ studyTopicSelected: 'science' })}
                                                    selected = { this.state.studyTopicSelected == 'science' }
                                                />
                                            </Right>
                                        </CardItem>
                                    </TouchableOpacity>
                                </Card>
                                <Card style = { profilePageStyle.profileCard }>
                                    <CardItem style = { profilePageStyle.profileCardItem }>
                                           <Item floatingLabel>
                                                <Label style = {{ color: "black" }}>Group Name: </Label>
                                                <Input 
                                                    onChangeText = { (studyGroupName) => this.setState( { studyGroupName } ) } 
                                                    value = { this.state.studyGroupName } 
                                                />
                                           </Item>
                                    </CardItem>
                                </Card>
                                <View style = { profilePageStyle.profileButtonGroup }>
                                    <Button light style = {profilePageStyle.profileButton} onPress = {this._handleCreateStudyGroup}>
                                        <Text>Save</Text>
                                    </Button>
                                    <Button light style = {profilePageStyle.profileButton} onPress = {() => this._handleCreateGroupModalVisibility(!this.state.createGroupModalVisibility)}>
                                        <Text>Close</Text>
                                    </Button>
                                </View>
                            </Content>
                        </Container>
                    </Modal>

                    {/* Join a Group Modal */}
                    <Modal
                        animationType = "slide"
                        transparent = { true }
                        visible = { this.state.joinGroupModalVisibility }
                    >
                        <Container style = {{backgroundColor: "rgba(0,0,0,0.9)"}}>
                            <Content>
                                <Card style = { profilePageStyle.profileCardModal }>
                                    <CardItem header style = { profilePageStyle.profileCardHeader }> 
                                        <Text style = {profilePageStyle.profileTextHeader}>Select a Group:</Text>
                                    </CardItem>
                                </Card>
                                {   
                                    this.state.studyGroupListJoining.map((item, index) => {
                                        if (this.state.studyGroupListJoining == ""){
                                            return (
                                                <Card key = { index } style = { profilePageStyle.profileCard }>
                                                    <CardItem header style = { profilePageStyle.profileCardHeader }>
                                                        <Text style = { profilePageStyle.profileTextHeader }>No Available Groups</Text>
                                                    </CardItem>
                                                </Card>
                                            )
                                        } else {
                                            return (
                                                <Card key = { index } style = { profilePageStyle.profileCard }>
                                                    <CardItem header style = { profilePageStyle.profileCardHeader }>
                                                        <Text style = { profilePageStyle.profileTextHeader }>{ item.groupName }</Text>
                                                    </CardItem>
                                                    <CardItem style = { profilePageStyle.profileCardItem }>
                                                        <Text>Topic: { item.topic }</Text>
                                                    </CardItem>
                                                    <CardItem style = { profilePageStyle.profileCardHeader }>
                                                        <Button light style = {profilePageStyle.profileButton} onPress = {() => this._handleJoinStudyGroup(item.groupName)}>
                                                            <Text>Join</Text>
                                                        </Button>
                                                    </CardItem>
                                                </Card>
                                            )
                                        }
                                    })
                                }
                                <View style = { profilePageStyle.profileButtonGroup }>
                                    <Button light style = {profilePageStyle.profileButton} onPress = {() => this._handleJoinStudyGroupVisibility(!this.state.joinGroupModalVisibility)}>
                                        <Text>Close</Text>
                                    </Button>
                                </View>
                            </Content>
                        </Container>
                    </Modal>

                </Content>
            </Container>
        );
    }
}

const profilePageStyle = StyleSheet.create({
    profileCard: {
        backgroundColor: "#6490b3", 
        marginTop: 20, 
        marginLeft: 25, 
        marginRight: 25, 
        borderRadius: 20
    },
    profileCardItem: {
        backgroundColor: "#6490b3", 
        borderRadius: 20,
    },
    profileCardHeader: {
        backgroundColor: "#6490b3", 
        borderRadius: 20,
        alignSelf: "center"
    },
    profileTextHeader: {
        fontWeight: "bold", 
        fontSize: 18
    },
    profileButton: {
        alignSelf: "center", 
        marginTop: 25, 
        marginBottom: 25,
        marginRight: 20, 
        marginLeft: 20,
        borderRadius: 10,
        backgroundColor: "#6490b3", 
    },
    profileCardModal: {
        backgroundColor: "#6490b3", 
        marginTop: 180, 
        marginLeft: 25, 
        marginRight: 25, 
        borderRadius: 20
    },
    profileButtonGroup: {
        flexDirection: "row",
        alignSelf: "center",
    }
});