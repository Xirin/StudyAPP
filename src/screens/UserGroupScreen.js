import React, { Component } from 'react';

import {
    StyleSheet,
    LogBox,
    ScrollView,
    View,
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
    Icon,
    Chip,
} from 'react-native-elements';

import AgoraUIKit from 'agora-rn-uikit';

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class UserGroupScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userGroups: [''],
            availableUsers: [''],
            arrayInitializer: [''],
            userFirstName: "",
            userLastName: "",
            userGroup: "",
            checkedItem: "",
            createGroupOverlayVisibility: false,
            joinGroupOvarlayVisibility: false,
            activeIndex: "",
            videoCall: false,
            userStudyPeers: [""],
            findStudyPeerFormValidation: false,
            userGroupNameFormValidation: "",
            topicListAccordion: false,
            topicList: [
                { title: "Multidimensional Array", checked: false },
                { title: "Looping Statements", checked: false },
                { title: "Function", checked: false },
                { title: "Array Data Structure", checked: false },
                { title: "Variables, Constants, and Data Types", checked: false },
                { title: "Selection Statements", checked: false },
                { title: "Input/Output Statements", checked: false },
                { title: "Others", checked: false },
            ],
            topicListFormValidation: "",
            searchGroupOverlayVisibility: false,
            searchGroupResultOverlayVisibility: false,
            searchGroupTopicSelected: [""],
            searchAvailableGroups: [""],
            searchAvailableGroupsAccordion: "",
            userGroupMembersOverlayVisibility: false,
            userGroupMembersList: [""],
            editGroupOverlayVisibility: false,
            editGroupName: "",
            editGroupNameFormValidation: "",
            groupForEdit: "",
            deleteOverlayVisibility: "",
            groupForDelete: "",
            leaveGroupVisibility: false,
            groupForLeave: "",
        }
    }

    componentDidMount = () => {

        //Fetch All the Groups that the User is Part of
        var userGroupCollection = [];
        var userGroupArray = [];
        // firestore()
        //     .collection("Groups")
        //     .get()
        //     .then((snapShot) => {
        //         userGroupCollection = snapShot.docs.map(doc => doc.data());
        //     })
        //     .then(() => {
        //         for(let index = 0; index < userGroupCollection.length; index++) {
        //             firestore()
        //                 .collection("Groups")
        //                 .doc(userGroupCollection[index].groupName)
        //                 .collection("Members")
        //                 .where("userID", "==", auth().currentUser.uid)
        //                 .get()
        //                 .then((snapShot) => {
        //                     snapShot.forEach(() => {
        //                         userGroupArray.push({
        //                             groupName: userGroupCollection[index].groupName,
        //                             topics: userGroupCollection[index].topics
        //                         }) 
        //                     })
        //                     this.setState({ userGroups: userGroupArray })
        //                 })
        //         }
        //     });
        firestore()
            .collection("Groups")
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    userGroupCollection.push({
                        groupID: doc.id,
                        creatorID: doc.data().creatorID,    
                        creatorName: doc.data().creatorName,
                        groupName: doc.data().groupName,
                        topics: doc.data().topics,
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < userGroupCollection.length; index++) {
                    firestore()
                        .collection("Groups")
                        .doc(userGroupCollection[index].groupID)
                        .collection("Members")
                        .where("userID", "==", auth().currentUser.uid)
                        .get()
                        .then((snapShot) => {
                            snapShot.forEach(() => {
                                userGroupArray.push({
                                    groupID: userGroupCollection[index].groupID,
                                    creatorID: userGroupCollection[index].creatorID,
                                    creatorName: userGroupCollection[index].creatorName,
                                    groupName: userGroupCollection[index].groupName,
                                    topics: userGroupCollection[index].topics,
                                })
                            })
                            this.setState({ userGroups: userGroupArray })
                        })
                }
            })
        
        //Fetch the Last Name of the Current User
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                this.setState({ userFirstName: snapShot.data().firstName })
                this.setState({ userLastName: snapShot.data().lastName })
            })
        
        this.setState({ availableUsers: this.state.arrayInitializer })
        this.forceUpdate();
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer()
    }

    _handleChatNavigation = (groupID) => {
        this.props.navigation.navigate("Chat", {
            userLastName: this.state.userLastName,
            studyGroupID: groupID,
            currentUserID: auth().currentUser.uid,
        });
    }

    _handleVideoCallNavigation = (userGroupName) => {
        this.props.navigation.navigate("Video Call", {
            studyGroupName: userGroupName
        });
    }

    _handleOpenCreateGroupOvelay = (visible) => {
        //Get all the study peers of the current user
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
                        otherUserName: doc.data().otherUserName,
                        checked: false,
                    })
                })
                this.setState({ userStudyPeers: userStudyPeersArray })
            })

        this.setState({ createGroupOverlayVisibility: visible })
    }

    _handleCloseCreateGroupOverlay = () => {
        this.setState({ createGroupOverlayVisibility: false })
    }

    _handleFindMatchOverlay = (visible) => {
        //Open Find Match Overlay
        this.setState({ joinGroupOvarlayVisibility: visible })

        var currentUserAllScoresArrray = [];
        var otherUsersAllScoresArray = [];
        var currentUserToOtherUserScoresArray = [];
        var otherUserToCurrentUserScoresArray = [];
        var currentUserToOtherUserCompabilityArray = [];
        var otherUserToCurrentUserCompabilityArray = [];
        var reciprocalRecommenderScore = [];
        var recommendedUserArray = [];
        var userInvitationStatusArray = [];
        var availableUsersArray = [];
        
        //Get the Current User's Attribute Scores and Preferred Scores
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                currentUserAllScoresArrray.push({
                    userID: snapShot.data().uid,
                    wtcScore: snapShot.data().WTCScore,
                    wtcPreferredScore: snapShot.data().wtcPreferredScore,
                    personalityScore: snapShot.data().personalityScore,
                    personalityPreferredScore: snapShot.data().personalityPreferredScore
                })
            })
            .then(() => {
                //Get all the Other User's Attribute Scores and Preferred Scores
                firestore()
                    .collection("Users")
                    .where("uid", "!=", auth().currentUser.uid)
                    .get()
                    .then((snapShot) => {
                        snapShot.forEach((doc) => {
                            otherUsersAllScoresArray.push({
                                userID: doc.data().uid,
                                wtcScore: doc.data().WTCScore,
                                wtcPreferredScore: doc.data().wtcPreferredScore,
                                personalityScore: doc.data().personalityScore,
                                personalityPreferredScore: doc.data().personalityPreferredScore
                            })
                        })
                    })
                    .then(() => {
                        //Getting the WTC and Personality Score via Current User to Other Users
                        for (let index = 0; index < otherUsersAllScoresArray.length; index++) {                            
                            if (otherUsersAllScoresArray[index].wtcScore >= currentUserAllScoresArrray.map(i => i.wtcPreferredScore)) {
                                if (otherUsersAllScoresArray[index].personalityScore >= currentUserAllScoresArrray.map(i => i.personalityPreferredScore)) {
                                    currentUserToOtherUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: otherUsersAllScoresArray[index].wtcScore,
                                        personalityScore: otherUsersAllScoresArray[index].personalityScore
                                    })
                                } else {
                                    currentUserToOtherUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: otherUsersAllScoresArray[index].wtcScore,
                                        personalityScore: 0
                                    })
                                }
                            }
                            else {
                                if (otherUsersAllScoresArray[index].personalityScore >= currentUserAllScoresArrray.map(i => i.personalityPreferredScore)) {
                                    currentUserToOtherUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: 0,
                                        personalityScore: otherUsersAllScoresArray[index].personalityScore
                                    })
                                } else {
                                    currentUserToOtherUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: 0,
                                        personalityScore: 0
                                    })
                                }
                            }
                        }

                        //Getting the WTC and Personality Score via Other User to Current User
                        for (let index = 0; index < otherUsersAllScoresArray.length; index++) {
                            if (currentUserAllScoresArrray.map(i => i.wtcScore) >= otherUsersAllScoresArray[index].wtcPreferredScore) {
                                if (currentUserAllScoresArrray.map(i => i.personalityScore) >= otherUsersAllScoresArray[index].personalityPreferredScore) {
                                    otherUserToCurrentUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: currentUserAllScoresArrray.map(i => i.wtcScore),
                                        personalityScore: currentUserAllScoresArrray.map(i => i.personalityScore)
                                    })
                                } else {
                                    otherUserToCurrentUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: currentUserAllScoresArrray.map(i => i.wtcScore),
                                        personalityScore: 0
                                    })
                                }
                            }
                            else {
                                if (currentUserAllScoresArrray.map(i => i.personalityScore) >= otherUsersAllScoresArray[index].personalityPreferredScore) {
                                    otherUserToCurrentUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: 0,
                                        personalityScore: currentUserAllScoresArrray.map(i => i.personalityScore)
                                    })
                                } else {
                                    otherUserToCurrentUserScoresArray.push({
                                        currentUserID: currentUserAllScoresArrray.map(i => i.userID),
                                        otherUserID: otherUsersAllScoresArray[index].userID,
                                        wtcScore: 0,
                                        personalityScore: 0
                                    })
                                }
                            }
                        }
                        
                        //Getting the Compability Score Via Current User to Other User
                        for (let index  = 0; index < currentUserToOtherUserScoresArray.length; index++) {
                            currentUserToOtherUserCompabilityArray.push({
                                currentUserID: currentUserToOtherUserScoresArray[index].currentUserID,
                                otherUserID: currentUserToOtherUserScoresArray[index].otherUserID,
                                compabilityScore: (1 / 2) * ((parseFloat(currentUserToOtherUserScoresArray[index].wtcScore) + parseFloat(currentUserToOtherUserScoresArray[index].personalityScore)) / 100)
                            })
                        }

                        //Getting the Compability Score Via Other User to Current User
                        for (let index = 0; index < otherUserToCurrentUserScoresArray.length; index++) {
                            otherUserToCurrentUserCompabilityArray.push({
                                currentUserID: otherUserToCurrentUserScoresArray[index].currentUserID,
                                otherUserID: otherUserToCurrentUserScoresArray[index].otherUserID,
                                compabilityScore: (1 / 2) * ((parseFloat(otherUserToCurrentUserScoresArray[index].wtcScore) + parseFloat(otherUserToCurrentUserScoresArray[index].personalityScore)) / 100)
                            })
                        }

                        //Getting the Reciprocal Recommender Score
                        for (let index = 0; index < currentUserToOtherUserCompabilityArray.length; index++) {
                            for (let i = 0; i < otherUserToCurrentUserCompabilityArray.length; i++) {
                                if (
                                    JSON.stringify(currentUserToOtherUserCompabilityArray[index].currentUserID) == JSON.stringify(otherUserToCurrentUserCompabilityArray[i].currentUserID) &&
                                    JSON.stringify(currentUserToOtherUserCompabilityArray[index].otherUserID) == JSON.stringify(otherUserToCurrentUserCompabilityArray[i].otherUserID)
                                ) {
                                    reciprocalRecommenderScore.push({
                                        currentUserID: currentUserToOtherUserCompabilityArray[index].currentUserID,
                                        otherUserID: currentUserToOtherUserCompabilityArray[index].otherUserID,
                                        score: 2 / ((1 / parseFloat(currentUserToOtherUserCompabilityArray[index].compabilityScore)) + (1 / parseFloat(otherUserToCurrentUserCompabilityArray[i].compabilityScore)))
                                    })
                                }
                            }
                        }
                        
                        //Sorting the Reciprocal Recommendations from highest to lowest
                        reciprocalRecommenderScore.sort((a, b) => {
                            if (a.score > b.score) {
                                return -1;
                            }
                            if (a.score < b.score) {
                                return 1;
                            }
                            return 0
                        })

                        var counter = 0;
                        //Get all the Information about the users base on their reciprocal recommender scores
                        for (let index = 0; index < reciprocalRecommenderScore.length; index++) {
                            firestore()
                                .collection("Users")
                                .where("uid", "==", reciprocalRecommenderScore[index].otherUserID)
                                .get()
                                .then((snapShot) => {
                                    snapShot.forEach((doc) => {
                                        recommendedUserArray.push({
                                            otherUserID: doc.data().uid,
                                            otherUserFullName: doc.data().firstName.concat(" ", doc.data().lastName)
                                        })
                                    })
                                })
                                //Check if Other User is already invited as a study peer or not 
                                .then(() => {
                                    firestore()
                                        .collection("Invitations")
                                        .doc(auth().currentUser.uid)
                                        .collection("Sent")
                                        .doc(recommendedUserArray[index].otherUserID)
                                        .get()
                                        .then((doc) => {
                                            if (doc.exists) {
                                                userInvitationStatusArray.push({
                                                    otherUserID: recommendedUserArray[index].otherUserID,
                                                    otherUserFullName: recommendedUserArray[index].otherUserFullName,
                                                    otherUserInviationStatus: true
                                                })
                                            } else {
                                                userInvitationStatusArray.push({
                                                    otherUserID: recommendedUserArray[index].otherUserID,
                                                    otherUserFullName: recommendedUserArray[index].otherUserFullName,
                                                    otherUserInviationStatus: false
                                                })
                                            }
                                        })
                                        //Check if Other User is already a Study Peer
                                        .then(() => {
                                            firestore()
                                                .collection("Users")
                                                .doc(auth().currentUser.uid)
                                                .collection("Study Peers")
                                                .doc(userInvitationStatusArray[index].otherUserID)
                                                .get()
                                                .then((doc) => {
                                                    if (!doc.exists) {
                                                        if (counter < 5) {
                                                            availableUsersArray.push({
                                                                otherUserID: userInvitationStatusArray[index].otherUserID,
                                                                otherUserFullName: userInvitationStatusArray[index].otherUserFullName,
                                                                otherUserInviationStatus: userInvitationStatusArray[index].otherUserInviationStatus,
                                                            })
                                                            counter = counter + 1
                                                        }
                                                    }
                                                    this.setState({ availableUsers: availableUsersArray })
                                                })
                                        })
                                })
                        }
                    })        
            })
    }

    _handleCloseJoinGroupOverlay = () => {
        this.setState({ joinGroupOvarlayVisibility: false })
    }


    _handleCreateGroupCheckBox = (checkedItem) => {
        //Getting all checked study peers
        var data = this.state.userStudyPeers;
        var index = data.findIndex(x => x.otherUserName === checkedItem)
        data[index].checked = !data[index].checked;
        this.setState({ userStudyPeers: data })
    }

    _handleTopicCheckBox = (topicSelected) => {
        //Getting all checked topics
        var topicData = this.state.topicList;
        var topicIndex = topicData.findIndex(x => x.title === topicSelected)
        topicData[topicIndex].checked = !topicData[topicIndex].checked
        this.setState({ topicList: topicData })
    }

    _handleCreateGroup = () => {
        //Form Validation for Group Creation Field
        var errorCounter = 0;
        var groupID = "";
        if (this.state.userGroup == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userGroupNameFormValidation: "This field is required*" })
        } else {
            this.setState({ userGroupNameFormValidation: "" })
        }

        var topicListFormValidation = this.state.topicList;
        var topicListFormValidationCounter = 0;
        for (let index = 0; index < topicListFormValidation.length; index++) {
            if (topicListFormValidation[index].checked === false) {
                topicListFormValidationCounter = topicListFormValidationCounter + 1;
            }
        }

        if (topicListFormValidationCounter == 8) {
            errorCounter = errorCounter + 1;
            this.setState({ topicListFormValidation: "This field is required*" })
        } else {
            this.setState({ topicListFormValidation: "" })
        }
        
        if (errorCounter == 0) {
            //Get all topic that is selected by the user
            var topicListSelectedArray = this.state.topicList;
            var topicLstSelectedCollection = [];
            for (let index = 0; index < topicListSelectedArray.length; index++) {
                if (topicListSelectedArray[index].checked === true) {
                    topicLstSelectedCollection.push(
                        topicListSelectedArray[index].title
                    )
                }
            }

            //Store Group Invitations to other users in database 
            var userStudyPeersSelectedArray = this.state.userStudyPeers;
            for (let index = 0; index < userStudyPeersSelectedArray.length; index++) {
                if (userStudyPeersSelectedArray[index].checked == true) {
                    firestore()
                        .collection("Invitations")
                        .doc(auth().currentUser.uid)
                        .set({
                            senderID: auth().currentUser.uid
                        })
                        .then(() => {
                            // firestore()
                            //     .collection("Groups")
                            //     .doc(this.state.userGroup)
                            //     .set({
                            //         creatorID: auth().currentUser.uid,
                            //         creatorName: this.state.userFirstName.concat(" ", this.state.userLastName),
                            //         groupName: this.state.userGroup,
                            //         topics: topicLstSelectedCollection
                            //     })
                            //     .then(() => {
                            //         firestore()
                            //             .collection("Groups")
                            //             .doc(this.state.userGroup)
                            //             .collection("Members")
                            //             .doc(auth().currentUser.uid)
                            //             .set({
                            //                 userFullName: this.state.userFirstName.concat(" ", this.state.userLastName),
                            //                 userID: auth().currentUser.uid
                            //             })
                            //     })
                            firestore()
                                .collection("Groups")
                                .add({
                                    creatorID: auth().currentUser.uid,
                                    creatorName: this.state.userFirstName.concat(" ", this.state.userLastName),
                                    groupName: this.state.userGroup,
                                    topics: topicLstSelectedCollection
                                })
                                .then(() => {
                                    firestore()
                                        .collection("Groups")
                                        .where("creatorID", "==", auth().currentUser.uid)
                                        .where("groupName", "==", this.state.userGroup)
                                        .get()
                                        .then((snapShot) => {
                                            snapShot.forEach((doc) => {
                                                groupID = doc.id
                                            })
                                        })
                                        .then(() => {
                                            firestore()
                                                .collection("Groups")
                                                .doc(groupID)
                                                .collection("Members")
                                                .doc(auth().currentUser.uid)
                                                .set({
                                                    userFullName: this.state.userFirstName.concat(" ", this.state.userLastName),
                                                    userID: auth().currentUser.uid
                                                })
                                        })
                                        .then(() => {
                                            firestore()
                                                .collection("Invitations")
                                                .doc(auth().currentUser.uid)
                                                .collection("Group Sent")
                                                .doc(userStudyPeersSelectedArray[index].otherUserID)
                                                .set({
                                                    groupID: groupID,
                                                    recipientUserID: userStudyPeersSelectedArray[index].otherUserID,
                                                    recipientUserFullName: userStudyPeersSelectedArray[index].otherUserName,
                                                    senderID: auth().currentUser.uid,
                                                    senderName: this.state.userFirstName.concat(" ", this.state.userLastName),
                                                    message: "You have been invited by ".concat(this.state.userFirstName.concat(" ", this.state.userLastName), " in the group ", this.state.userGroup),
                                                    groupName: this.state.userGroup,
                                                    topics: topicLstSelectedCollection
                                                })
                                        })
                                })
                        })  
                }
            }

            this._handleCloseCreateGroupOverlay();
            this.componentDidMount();
            
        }
    }

    _handleAddPeer = (otherUserID, otherUserFullName) => {
        //Fetching Personal of the Current User for Storing
        var currentUSerFullName = "";
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                currentUSerFullName = snapShot.data().firstName.concat(" ", snapShot.data().lastName)
            })
            .then(() => {
                //List of Invitaions that the Current User has Sent to other Users
                firestore()
                .collection("Invitations")
                .doc(auth().currentUser.uid)
                .set({
                    senderID: auth().currentUser.uid
                })
                .then(() => {
                    firestore()
                    .collection("Invitations")
                    .doc(auth().currentUser.uid)
                    .collection("Sent")
                    .doc(otherUserID)
                    .set({
                        recipientUserID: otherUserID,
                        recipientUserFullName: otherUserFullName,
                        senderID: auth().currentUser.uid,
                        senderName: this.state.userFirstName.concat(" ", this.state.userLastName),
                        message: currentUSerFullName.concat("  has sent you a Study Peer Invitation!")
                    })
                })
            })

            this._handleFindMatchOverlay();
            this.setState({ activeIndex: "" })
    }

    _handleCancelPeerRequest = (otherUserID, otherUserFullName) => {
        firestore()
            .collection("Invitations")
            .doc(auth().currentUser.uid)
            .collection("Sent")
            .doc(otherUserID)
            .delete()

        this._handleFindMatchOverlay();
        this.setState({ activeIndex: "" })
    }

    _handleOpenSearchGroupOverlay = (visible) => {
        this.setState({ searchGroupOverlayVisibility: visible })
    }

    _handleCloseSearchGroupOverlay = () => {
        this.setState({ searchGroupOverlayVisibility: false })
    }

    _handleOpenSearchResultsOverlay = (visible) => {
        //Form Validation
        var errorCounter = 0;
        var topicListFormValidation = this.state.topicList;
        var topicListFormValidationCounter = 0;
        for (let index = 0; index < topicListFormValidation.length; index++) {
            if (topicListFormValidation[index].checked === false) {
                topicListFormValidationCounter = topicListFormValidationCounter + 1;
            }
        }

        if (topicListFormValidationCounter == 8) {
            errorCounter = errorCounter + 1;
            this.setState({ topicListFormValidation: "This field is required*" })
        } else {
            this.setState({ topicListFormValidation: "" })
        }

        if (errorCounter == 0) {
            //Get all topics that is selected by the user
            var topicsSelectedArray = this.state.topicList;
            var topicsSelectedCollection = [];
            for (let index = 0; index  < topicsSelectedArray.length; index++) {
                if (topicsSelectedArray[index].checked === true) {
                    topicsSelectedCollection.push(
                        topicsSelectedArray[index].title
                    )
                }
            }
            this.setState({ searchGroupTopicSelected: topicsSelectedCollection })

            //Get all available groups that got the topics preferred by the user
            var topicArray = [];
            var topicCounter = 0;
            var availableGroups = [];
            var availableGroupsCollection = [];
            firestore()
                .collection("Groups")
                .where("topics", "array-contains-any", topicsSelectedCollection)
                .get()
                .then((snapShot) => {
                    snapShot.forEach((doc, i) => {
                        for (let index = 0; index < doc.data().topics.length; index++) {
                            for (let i = 0; i < topicsSelectedCollection.length; i++) {
                                if (doc.data().topics[index] == topicsSelectedCollection[i]) {
                                    topicCounter = topicCounter + 1;
                                }
                            }
                        }
                        availableGroups.push({
                            groupID: doc.id,
                            creatorID: doc.data().creatorID,
                            creatorName: doc.data().creatorName,
                            groupName: doc.data().groupName,
                            topics: doc.data().topics, 
                            matchCounter: topicCounter
                        })
                    })
                })
                .then(() => {
                    for (let index = 0; index < availableGroups.length; index++) {
                        firestore()
                            .collection("Groups")
                            .doc(availableGroups[index].groupID)
                            .collection("Members")
                            .doc(auth().currentUser.uid)
                            .get()
                            .then((doc) => {
                                if (!doc.exists) {
                                    availableGroupsCollection.push({
                                        groupID: availableGroups[index].groupID,
                                        creatorID: availableGroups[index].creatorID,
                                        creatorName: availableGroups[index].creatorName,
                                        groupName: availableGroups[index].groupName,
                                        topics: availableGroups[index].topics,
                                        matchCounter: availableGroups[index].matchCounter,
                                    })
                                }
                                //Sorting the Matched Topics
                                availableGroupsCollection.sort((a, b) => {
                                    if (a.matchCounter > b.matchCounter) {
                                        return -1;
                                    }
                                    if (a.matchCounter < b.matchCounter) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                this.setState({ searchAvailableGroups: availableGroupsCollection })
                            })
                    }
                    this.setState({ searchGroupResultOverlayVisibility: visible })
                    this._handleCloseSearchGroupOverlay()
                })
        }
    }

    _handleCloseSearchResultsOverlay = () => {
        this.setState({ searchGroupResultOverlayVisibility: false })
    }

    _handleApplyToGroup = (groupID, creatorID, creatorName, groupName, topics) => {
        //Store to database the join request of the user
        firestore()
            .collection("Invitations")
            .doc(creatorID)
            .collection("Group Request")
            .doc(auth().currentUser.uid)
            .set({
                groupID: groupID,
                groupName: groupName,
                creatorID: creatorID,
                creatorName: creatorName,
                requestorFullName: this.state.userFirstName.concat(" ", this.state.userLastName),
                requestorUserID: auth().currentUser.uid,
                topics: topics,
                message: this.state.userFirstName.concat(" ", this.state.userLastName, " has requested to join your group ", groupName)
            })

        this._handleCloseSearchResultsOverlay();
    }

    _handleOpenUserGroupMembersOverlay = (visibility) => {
        //Geetting all Members in a Group
        var userGroupMembersArray = [];
        var usergroupMemberCollection = [];
        firestore()
            .collection("Groups")
            .doc(this.state.activeIndex)
            .collection("Members")
            .where("userID", "!=", auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    userGroupMembersArray.push({
                        userID: doc.data().userID,
                        userFullName: doc.data().userFullName
                    })
                })

            })
            .then(() => {
                //Check if the members is already a study peer or not of the current user
                for (let index  = 0; index  < userGroupMembersArray.length; index++) {
                    firestore()
                        .collection("Users")
                        .doc(auth().currentUser.uid)
                        .collection("Study Peers")
                        .doc(userGroupMembersArray[index].userID)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                usergroupMemberCollection.push({
                                    userID: userGroupMembersArray[index].userID,
                                    userFullName: userGroupMembersArray[index].userFullName,
                                    isStudyPeer: true
                                })
                            }
                            else {
                                usergroupMemberCollection.push({
                                    userID: userGroupMembersArray[index].userID,
                                    userFullName: userGroupMembersArray[index].userFullName,
                                    isStudyPeer: false
                                })
                            }
                            this.setState({ userGroupMembersList: usergroupMemberCollection })
                        })
                }
            })

        this.setState({ userGroupMembersOverlayVisibility: visibility })
    }

    _handleCloseUserGroupMembersOverlay  = () => {
        this.setState({ userGroupMembersOverlayVisibility: false })
    }

    _handleAddPeerFromGroup = (otherUserID, otherUserName) => {
        //Store the invitation to the database
        firestore()
            .collection("Invitations")
            .doc(auth().currentUser.uid)
            .set({
                senderID: auth().currentUser.uid
            })
            .then(() => {
                firestore()
                    .collection("Invitations")
                    .doc(auth().currentUser.uid)
                    .collection("Sent")
                    .doc(otherUserID)
                    .set({
                        senderID: auth().currentUser.uid,
                        senderName: this.state.userFirstName.concat(" ", this.state.userLastName),
                        recipientUserID: otherUserID,
                        recipientUserFullName: otherUserName,
                        message: this.state.userFirstName.concat(" ", this.state.userLastName, " has sent you a Study Peer Invitation!"),
                    })
            })

        this._handleCloseUserGroupMembersOverlay();
    }

    _handleOpenEditGroupOverlay = (visible, groupID, groupName) => {
        this.setState({ editGroupOverlayVisibility: visible });
        this.setState({ editGroupName: groupName });
        this.setState({ groupForEdit: groupID })
    }

    _handleCloseEditGroupOverlay = () => {
        this.setState({ editGroupOverlayVisibility: false })
    }

    _handleEditGroup = () => {
        //Form Validation
        var errorCounter = 0;
        var topicListFormValidation = this.state.topicList;
        var topicListFormValidationCounter = 0;
        for (let index = 0; index < topicListFormValidation.length; index++) {
            if (topicListFormValidation[index].checked === false) {
                topicListFormValidationCounter = topicListFormValidationCounter + 1;
            }
        }

        if (topicListFormValidationCounter == 8) {
            errorCounter = errorCounter + 1;
            this.setState({ topicListFormValidation: "This field is required*" })
        } else {
            this.setState({ topicListFormValidation: "" })
        }

        if (this.state.editGroupName == "") {
            errorCounter = errorCounter + 1;
            this.setState({ editGroupNameFormValidation: "This field is required*" })
        } else {
            this.setState({ editGroupNameFormValidation: "" })
        }
        
        if (errorCounter == 0) {
            //Get all topic that is selected by the user
            var topicListSelectedArray = this.state.topicList;
            var topicLstSelectedCollection = [];
            for (let index = 0; index < topicListSelectedArray.length; index++) {
                if (topicListSelectedArray[index].checked === true) {
                    topicLstSelectedCollection.push(
                        topicListSelectedArray[index].title
                    )
                }
            }

            //Edit Group Name and Topics
            firestore()
                .collection("Groups")
                .doc(this.state.groupForEdit)
                .update({
                    groupName: this.state.editGroupName,
                    topics: topicLstSelectedCollection
                })
        }

        this._handleCloseEditGroupOverlay();
        this.componentDidMount();
    }

    _handleOpenDeleteGroupOverlay = (visible, groupID) => {
        this.setState({ deleteOverlayVisibility: visible })
        this.setState({ groupForDelete: groupID })
    }

    _handleCloseDeleteGroupOverlay = () => {
        this.setState({ deleteOverlayVisibility: false })
    }

    _handleDeleteGroup = () => {
        //Delete All Sent Invitations
        var groupInvitesForDelete = [];
        firestore()
            .collection("Invitations")
            .doc(auth().currentUser.uid)
            .collection("Group Sent")
            .where("groupID", "==", this.state.groupForDelete)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    groupInvitesForDelete.push({
                        documentID: doc.id
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < groupInvitesForDelete.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(auth().currentUser.uid)
                        .collection("Group Sent")
                        .doc(groupInvitesForDelete[index].documentID)
                        .delete()
                }
            })

        //Delete All Request Invitations
        var groupRequestForDelete = [];
        firestore()
            .collection("Invitations")
            .doc(auth().currentUser.uid)
            .collection("Group Request")
            .where("groupID", "==", this.state.groupForDelete)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    groupRequestForDelete.push({
                        documentID: doc.id
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < groupRequestForDelete.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(auth().currentUser.uid)
                        .collection("Group Request")
                        .doc(groupRequestForDelete[index].documentID)
                        .delete()
                }
            })

        //Delete the Selected Group
        firestore()
            .collection("Groups")
            .doc(this.state.groupForDelete)
            .delete()

        this._handleCloseDeleteGroupOverlay();
        this.componentDidMount();
    }

    _handleOpenLeaveGroupOverlay = (visible, groupID) => {
        this.setState({ leaveGroupVisibility: visible })
        this.setState({ groupForLeave: groupID })
    }

    _handleCloseLeaveGroupOverlay = () => {
        this.setState({ leaveGroupVisibility: false })
    }

    _handleLeaveGroup = () => {
        //Delete the Document Where the user is on
        firestore()
            .collection("Groups")
            .doc(this.state.groupForLeave)
            .collection("Members")
            .doc(auth().currentUser.uid)
            .delete()

        this._handleCloseLeaveGroupOverlay();
        this.componentDidMount();
    }

    render() {
        LogBox.ignoreAllLogs();

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
                    <Content>
                        <Header
                            containerStyle = {{ backgroundColor: "#7B1FA2" }}
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
                            <Card.Title style = {{ color: "#7B1FA2" }} >
                                Create Groups / Find Study Peers
                            </Card.Title>
                            <Card.Divider style = { userGroupScreenStyle.udDivider } />
                            <Button  
                                title ="Create Group"
                                type ="solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                onPress = {() => this._handleOpenCreateGroupOvelay(true)}
                            />
                            <Button  
                                title ="Search Group"
                                type ="solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                containerStyle = {{ marginTop: "3%" }}
                                onPress = {() => this._handleOpenSearchGroupOverlay(true)}
                            />
                            <Button
                                title = "Find Match"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                containerStyle = {{ marginTop: "3%" }}
                                onPress = {() => this._handleFindMatchOverlay(true)}
                            />
                        </Card>
                        <Card containerStyle = { userGroupScreenStyle.ugCard2 } >
                            <Card.Title style = {{ color: "#7B1FA2" }}>
                                Your Groups
                            </Card.Title>
                            <Card.Divider/>
                            {
                                this.state.userGroups.map((item, index) => {
                                    if (this.state.userGroups == "") {
                                        return (
                                            <Text h4 style = {{  color: "#7B1FA2", alignSelf: "center" }}>
                                                No Groups
                                            </Text>
                                        )
                                    }
                                    else {
                                        if (item.creatorID == auth().currentUser.uid) {
                                            return(
                                                <ListItem.Accordion
                                                    style = { userGroupScreenStyle.ugCardTitle }
                                                    key = { index }
                                                    content = {
                                                        <>
                                                            <ListItem.Content>
                                                                <ListItem.Title style = {{ color: "#7B1FA2" }}>
                                                                    { item.groupName }
                                                                </ListItem.Title>
                                                            </ListItem.Content>
                                                        </>
                                                    }
                                                    
                                                    isExpanded = { this.state.activeIndex === item.groupID }
                                                    onPress = {() => {
                                                        if (this.state.activeIndex == item.groupID) {
                                                            this.setState({ activeIndex: "" })
                                                        } else {
                                                            this.setState({ activeIndex: item.groupID })
                                                        }
                                                    }}
                                                >
                                                    <Text
                                                        style = {{
                                                            color: "#7B1FA2",
                                                            fontWeight: "bold",
                                                            fontSize: 16,
                                                            alignSelf: "center"
                                                        }}
                                                    >
                                                        Topics:
                                                    </Text>
                                                    {
                                                        item.topics.map((t, i) => {
                                                            return(
                                                                <Chip
                                                                    containerStyle = {{ alignSelf: "center", marginTop: "2.5%" }}
                                                                    buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                                                    title = { item.topics[i] } 
                                                                />
                                                            )
                                                        })
                                                    }
                                                    <ListItem>
                                                        <ListItem.Content style = {{ alignItems: "center" }}>
                                                            <Button
                                                                type = "solid"
                                                                title = "Chat"
                                                                buttonStyle = { userGroupScreenStyle.ugButton }
                                                                onPress = {() => this._handleChatNavigation(item.groupID)}
                                                            />
                                                            <Button
                                                                type = "solid"
                                                                title = "Video Call"
                                                                buttonStyle = { userGroupScreenStyle.ugButton2 }
                                                                onPress = {() => this.setState({ videoCall: true })}
                                                            />
                                                            <Button
                                                                type = "solid"
                                                                title = "Members"
                                                                buttonStyle = {{ paddingHorizontal: "37.1%", marginTop: "3.5%", backgroundColor: "#7B1FA2" }}
                                                                onPress = {() => this._handleOpenUserGroupMembersOverlay(true)}
                                                            />
                                                            <Button
                                                                type = "solid"
                                                                title = "Edit"
                                                                buttonStyle = {{ paddingHorizontal: "44.4%", marginTop: "3.5%", backgroundColor: "#DF4759" }}
                                                                onPress = {() => this._handleOpenEditGroupOverlay(true, item.groupID, item.groupName, item.topics)}
                                                            />
                                                             <Button
                                                                type = "solid"
                                                                title = "Delete"
                                                                buttonStyle = {{ paddingHorizontal: "41%", marginTop: "3.5%", backgroundColor: "#DF4759" }}
                                                                onPress = {() => this._handleOpenDeleteGroupOverlay(true, item.groupID)}
                                                            />
                                                        </ListItem.Content>
                                                    </ListItem>
                                                </ListItem.Accordion>
                                            )
                                        } else {
                                            return(
                                                <ListItem.Accordion
                                                    style = { userGroupScreenStyle.ugCardTitle }
                                                    key = { index }
                                                    content = {
                                                        <>
                                                            <ListItem.Content>
                                                                <ListItem.Title style = {{ color: "#7B1FA2" }}>
                                                                    { item.groupName }
                                                                </ListItem.Title>
                                                            </ListItem.Content>
                                                        </>
                                                    }
                                                    
                                                    isExpanded = { this.state.activeIndex === item.groupID }
                                                    onPress = {() => {
                                                        if (this.state.activeIndex == item.groupID) {
                                                            this.setState({ activeIndex: "" })
                                                        } else {
                                                            this.setState({ activeIndex: item.groupID })
                                                        }
                                                    }}
                                                >
                                                    <Text
                                                        style = {{
                                                            color: "#7B1FA2",
                                                            fontWeight: "bold",
                                                            fontSize: 16,
                                                            alignSelf: "center"
                                                        }}
                                                    >
                                                        Topics:
                                                    </Text>
                                                    {
                                                        item.topics.map((t, i) => {
                                                            return(
                                                                <Chip
                                                                    containerStyle = {{ alignSelf: "center", marginTop: "2.5%" }}
                                                                    buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                                                    title = { item.topics[i] } 
                                                                />
                                                            )
                                                        })
                                                    }
                                                    <ListItem>
                                                        <ListItem.Content style = {{ alignItems: "center" }}>
                                                            <Button
                                                                type = "solid"
                                                                title = "Chat"
                                                                buttonStyle = { userGroupScreenStyle.ugButton }
                                                                onPress = {() => this._handleChatNavigation(item.groupID)}
                                                            />
                                                            <Button
                                                                type = "solid"
                                                                title = "Video Call"
                                                                buttonStyle = { userGroupScreenStyle.ugButton2 }
                                                                onPress = {() => this.setState({ videoCall: true })}
                                                            />
                                                            <Button
                                                                type = "solid"
                                                                title = "Members"
                                                                buttonStyle = {{ paddingHorizontal: "37.1%", marginTop: "3.5%", backgroundColor: "#7B1FA2" }}
                                                                onPress = {() => this._handleOpenUserGroupMembersOverlay(true)}
                                                            />
                                                            <Button
                                                                type = "solid"
                                                                title = "Leave Group"
                                                                buttonStyle = {{ paddingHorizontal: "35.7%", marginTop: "3.5%", backgroundColor: "#DF4759" }}
                                                                onPress = {() => this._handleOpenLeaveGroupOverlay(true, item.groupID)}
                                                            />
                                                        </ListItem.Content>
                                                    </ListItem>
                                                </ListItem.Accordion>
                                            )
                                        }
                                    }
                                })
                            }
                        </Card>

                        <Overlay
                            isVisible = { this.state.createGroupOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseCreateGroupOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <ScrollView>
                                <Card>
                                    <Card.Title style = { userGroupScreenStyle.ugOverlayCard }>
                                        Create Group
                                    </Card.Title>
                                    <Card.Divider/>
                                    <Input
                                        placeholder = "...."
                                        label = "Group Name"
                                        labelStyle = {{ color: "#7B1FA2" }}
                                        onChangeText = {(userGroup) => this.setState({ userGroup })}
                                        value = { this.state.userGroup }
                                        errorStyle = {{ color: "red" }}
                                        errorMessage = { this.state.userGroupNameFormValidation }
                                    />
                                    <ListItem.Accordion
                                        content = {
                                            <>
                                                <Icon
                                                    type = "material-community"
                                                    name = "bookshelf"
                                                    color = "#7B1FA2"
                                                />
                                                <ListItem.Content>
                                                    <ListItem.Title style = {{ color: "#7B1FA2", fontWeight: "bold" }}>
                                                        {"\u00A0"}{"\u00A0"}Topics
                                                    </ListItem.Title>
                                                </ListItem.Content>
                                            </>
                                        }
                                        isExpanded = { this.state.topicListAccordion }
                                        onPress = {() => this.setState({ topicListAccordion: !this.state.topicListAccordion })}
                                    >
                                        {
                                            this.state.topicList.map((item, index) => {
                                                return (
                                                    <View key  = { index }>
                                                        <CheckBox
                                                            title = { item.title }
                                                            textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                                            checked = { item.checked }
                                                            onPress = {() => this._handleTopicCheckBox(item.title)}
                                                        />
                                                    </View>
                                                )
                                            })
                                        }
                                    </ListItem.Accordion>
                                    <Text style = {{
                                        color: "red",
                                        marginLeft: "5%",
                                        marginBottom: "3%",
                                        fontSize: 12
                                    }}>
                                        { this.state.topicListFormValidation }
                                    </Text>
                                    <Card.Divider/>
                                    <View style = {{ flex: 1, flexDirection: "row", marginLeft: 13, marginBottom: 5 }}>
                                        <Icon 
                                            type = "material-community"
                                            name = "bookshelf"
                                            color = "#7B1FA2" 
                                        />
                                        <Text style = {{ color: "#7B1FA2", fontWeight: "bold", fontSize: 16 }} >Invite Study Peers</Text>
                                    </View>
                                    {
                                        this.state.userStudyPeers.map((item, index) => {
                                            return (
                                                <View key = { index } >
                                                    <CheckBox
                                                        title = { item.otherUserName }
                                                        textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                                        checked = { item.checked }
                                                        onPress = {() => this._handleCreateGroupCheckBox(item.otherUserName)}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                    <Button
                                        title = "Save"
                                        type = "solid"
                                        buttonStyle = { userGroupScreenStyle.ugOverlayButton }
                                        onPress = {() => this._handleCreateGroup()}
                                    />
                                    <Button
                                        title = "Close"
                                        type = "solid"
                                        onPress = {() => this._handleCloseCreateGroupOverlay()}
                                        buttonStyle = { userGroupScreenStyle.ugOverlayButton }
                                    />
                                </Card>
                            </ScrollView>
                        </Overlay>

                        <Overlay
                            isVisible = { this.state.joinGroupOvarlayVisibility }
                            onBackdropPress = {() => this._handleCloseJoinGroupOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2"}}
                        >
                           {
                            <Card containerStyle = {{ paddingBottom: 35 }} >
                                <Card.Title style = { userGroupScreenStyle.ugOverlayCard2 }>
                                    Discover Study Peers
                                </Card.Title>
                                <Card.Divider/>
                                {
                                    this.state.availableUsers.map((item, index) => {
                                        if (this.state.availableUsers == "") {
                                            return(
                                                <Text h4 style = {{  color: "#7B1FA2", alignSelf: "center" }}>
                                                    No Available Study Peers
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
                                                                <ListItem.Title style = {{ color: "#7B1FA2" }}>
                                                                    { item.otherUserFullName }
                                                                </ListItem.Title>
                                                            </ListItem.Content>
                                                        </>
                                                    }
                                                    isExpanded = { this.state.activeIndex === item.otherUserFullName}
                                                    onPress = {() => {
                                                        if (this.state.activeIndex == item.otherUserFullName) {
                                                            this.setState({ activeIndex: "" })
                                                        } else {
                                                            this.setState({ activeIndex: item.otherUserFullName })
                                                        }
                                                    }}
                                                >
                                                    <ListItem containerStyle = {{ backgroundColor: "transparent", marginBottom: "5%" }} >
                                                        <ListItem.Content style = {{ alignItems: "center" }} >
                                                            {item.otherUserInviationStatus == false ?
                                                                <Button
                                                                    type = "solid"
                                                                    title = "Add Peer"
                                                                    buttonStyle = { userGroupScreenStyle.ugButton4 }
                                                                    onPress = {() => this._handleAddPeer(item.otherUserID, item.otherUserFullName)}
                                                                />
                                                                :
                                                                <Button
                                                                    type = "solid"
                                                                    titleStyle = {{ fontSize: 12 }}
                                                                    title = "Cancel Request"
                                                                    buttonStyle = {{ backgroundColor: "#DF4759", paddingHorizontal: "40%", marginBottom: "3%", }}
                                                                    onPress ={() => this._handleCancelPeerRequest(item.otherUserID, item.otherUserFullName)}
                                                                />
                                                            }   
                                                            <Button
                                                                type = "solid"
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
                           }
                        </Overlay>

                        {/* Search Group OVerlay Topic Selection */}
                        <Overlay
                            isVisible = { this.state.searchGroupOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseSearchGroupOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <Card>
                                <Card.Title style = { userGroupScreenStyle.ugOverlayCard2 }>
                                    Discover Study Groups
                                </Card.Title>
                                <Card.Divider/>
                                <Text
                                    style = {{ color: "#7B1FA2", fontWeight: "bold", fontSize: 16, marginBottom: "4%" }}
                                >
                                    Please Selact your desired Topic/s:
                                </Text>
                                {
                                    this.state.topicList.map((item, index) => {
                                        return (
                                            <View key  = { index } >
                                                <CheckBox
                                                    title = { item.title }
                                                    textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                                    checked = { item.checked }
                                                    onPress = {() => this._handleTopicCheckBox(item.title)}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text style = {{
                                    color: "red",
                                    marginLeft: "5%",
                                    marginBottom: "3%",
                                    fontSize: 12
                                }}>
                                    { this.state.topicListFormValidation }
                                </Text>
                                <Card.Divider/>
                                <Button
                                    title = "Search"
                                    type = "solid"
                                    buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                    onPress = {() => this._handleOpenSearchResultsOverlay(true)}
                                />
                                <Button
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                    onPress = {() => this._handleCloseSearchGroupOverlay()}
                                />
                            </Card>
                        </Overlay>

                        {/* Search Group Results Overlay */}
                        <Overlay
                            isVisible = { this.state.searchGroupResultOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseSearchResultsOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: "5%", borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <Card>
                                <ScrollView>
                                    <Card.Title style = { userGroupScreenStyle.ugOverlayCard2 }>
                                        Discover Study Groups
                                    </Card.Title>
                                    <Card.Divider/>
                                    <Text
                                        style = {{ color: "#7B1FA2", fontWeight: "bold", fontSize: 16, marginBottom: "4%" }}
                                    >
                                        Topic/s Selected:
                                    </Text>
                                    {
                                        this.state.searchGroupTopicSelected.map((item, index) => {
                                            return (
                                                <View key = { index }>
                                                    <Chip
                                                        containerStyle = {{ alignSelf: "center", marginBottom: "3%" }}
                                                        buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                                        title = { item }
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                    <Card.Divider/>
                                    <Text
                                        style = {{ color: "#7B1FA2", fontWeight: "bold", fontSize: 16, marginBottom: "2%" }}
                                    >
                                        Available Groups:
                                    </Text>
                                    {
                                        this.state.searchAvailableGroups.map((item, index) => {
                                            if (this.state.searchAvailableGroups != "") {
                                                return (
                                                    <ListItem.Accordion
                                                        style = { userGroupScreenStyle.ugCardTitle }
                                                        key = { index }
                                                        content = {
                                                            <>
                                                                <ListItem.Content>
                                                                    <ListItem.Title style = {{ color: "#7B1FA2" }}>
                                                                        { item.groupName }
                                                                    </ListItem.Title>
                                                                    <ListItem.Subtitle>
                                                                        { item.creatorName }
                                                                    </ListItem.Subtitle>
                                                                </ListItem.Content>
                                                            </>
                                                        }
                                                        isExpanded = { this.state.searchAvailableGroupsAccordion === item.groupName }
                                                        onPress = {() => {
                                                            if (this.state.searchAvailableGroupsAccordion == item.groupName) {
                                                                this.setState({ searchAvailableGroupsAccordion: "" })
                                                            } else {
                                                                this.setState({ searchAvailableGroupsAccordion: item.groupName })
                                                            }
                                                        }}
                                                    >
                                                        <Text style = {{ color: "#7B1FA2", marginTop: "2%", alignSelf: "center", fontWeight: "bold" }} >Topics: </Text>
                                                        <Text
                                                            style = {{ color: "#7B1FA2", alignSelf: "center" }}
                                                        >
                                                           {
                                                               item.topics.map((t, i) => {
                                                                   return (
                                                                       item.topics[i].concat("\n")
                                                                   )
                                                               })
                                                           }
                                                        </Text>
                                                        <Button
                                                            title = "Join"
                                                            type = "solid"
                                                            buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                                            onPress = {() => this._handleApplyToGroup(item.groupID, item.creatorID, item.creatorName, item.groupName, item.topics)}
                                                        />
                                                        <Button
                                                            title = "Close"
                                                            type = "solid"
                                                            buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                                            onPress = {() => this._handleCloseSearchResultsOverlay()}
                                                        />
                                                    </ListItem.Accordion>
                                                )
                                            } else {
                                                return (
                                                    <Text h4 style = {{  color: "#7B1FA2", alignSelf: "center" }}>
                                                        No Available Groups
                                                    </Text>
                                                )
                                            }
                                        })
                                    }
                                </ScrollView>
                            </Card>
                        </Overlay>

                        {/* User Group Members List Overlay */}
                        <Overlay
                            isVisible = { this.state.userGroupMembersOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseUserGroupMembersOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: "5%", borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <Card>
                                <Card.Title style = { userGroupScreenStyle.ugOverlayCard2 }>
                                    Groupname: { this.state.activeIndex }{"\n"}
                                    List of Members
                                </Card.Title>
                                <Card.Divider/>
                                {
                                    this.state.userGroupMembersList.map((item, index) => {
                                        return item.isStudyPeer ? (
                                            <ListItem key = { index } containerStyle ={{ backgroundColor: "#b4e0e0" }}>
                                                <ListItem.Content>
                                                    <ListItem.Title style = {{ color: "#7B1FA2" }} >{ item.userFullName }</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        ) : (
                                            <ListItem key = { index } containerStyle ={{ backgroundColor: "#b4e0e0" }}>
                                                <ListItem.Content>
                                                    <ListItem.Title style = {{ color: "#7B1FA2" }} >{ item.userFullName }</ListItem.Title>
                                                </ListItem.Content>
                                                <Icon 
                                                    type = "material-community" 
                                                    name = "account-plus" 
                                                    color = "#7B1FA2" 
                                                    onPress = {() => this._handleAddPeerFromGroup(item.userID, item.userFullName)}
                                                />
                                            </ListItem>
                                        )
                                    })
                                }
                                <Button
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = {{ marginTop: "3%", marginBottom: "3%", backgroundColor: "#7B1FA2" }}
                                    onPress = {() => this._handleCloseUserGroupMembersOverlay()}
                                />
                            </Card>
                        </Overlay>

                        {/* Edit Group Overlay */}
                        <Overlay
                            isVisible = { this.state.editGroupOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseEditGroupOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: "5%", borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                           <ScrollView>
                                <Card>
                                    <Card.Title style = { userGroupScreenStyle.ugOverlayCard2 }>
                                        Edit Group
                                    </Card.Title>
                                    <Card.Divider/>
                                    <Input
                                        placeholder = "Group Name"
                                        label = "Group Name"
                                        labelStyle = {{ color: "#7B1FA2" }}
                                        onChangeText = {(editGroupName) => this.setState({ editGroupName })}
                                        value = { this.state.editGroupName }
                                        errorStyle = {{ color: "red" }}
                                        errorMessage = { this.state.editGroupNameFormValidation }
                                    />
                                    <Text
                                        style = {{ color: "#7B1FA2", fontWeight: "bold", fontSize: 16, marginBottom: "4%" }}
                                    >
                                        Please Selact your desired Topic/s:
                                    </Text>
                                    {
                                        this.state.topicList.map((item, index) => {
                                            return (
                                                <View key  = { index } >
                                                    <CheckBox
                                                        title = { item.title }
                                                        textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                                        checked = { item.checked }
                                                        onPress = {() => this._handleTopicCheckBox(item.title)}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                    <Text style = {{
                                        color: "red",
                                        marginLeft: "5%",
                                        marginBottom: "3%",
                                        fontSize: 12
                                    }}>
                                        { this.state.topicListFormValidation }
                                    </Text>
                                    <Card.Divider/>
                                    <Button
                                        title = "Save"
                                        type = "solid"
                                        buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                        onPress = {() => this._handleEditGroup()}
                                    />
                                    <Button
                                        title = "Close"
                                        type = "solid"
                                        buttonStyle = {{ marginTop: "3%", marginBottom: "3%", backgroundColor: "#7B1FA2" }}
                                        onPress = {() => this._handleCloseEditGroupOverlay()}
                                    />
                                </Card>
                           </ScrollView>
                        </Overlay>

                        {/* Delete Group Overlay */}
                        <Overlay
                            isVisible = { this.state.deleteOverlayVisibility }
                            onBackdropPress = {() => this._handleCloseDeleteGroupOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: "5%", borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                             <Card>
                                <Text style = {{ color: "#7B1FA2", fontSize: 25, fontWeight: "bold", textAlign: "center" }} >
                                    Do you want to delete this Group?
                                </Text>
                                <Card.Divider/>
                                <Button
                                    title = "Delete"
                                    type = "solid"
                                    buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                    onPress = {() => this._handleDeleteGroup()}
                                />
                                <Button
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                    onPress = {() => this._handleCloseDeleteGroupOverlay()}
                                />
                            </Card>
                        </Overlay>

                        {/* Leave Group Overlay */}
                        <Overlay
                            isVisible = { this.state.leaveGroupVisibility }
                            onBackdropPress = {() => this._handleCloseLeaveGroupOverlay()}
                            overlayStyle = {{ padding: 0, paddingBottom: "5%", borderWidth: 5, borderColor: "#7B1FA2" }}
                        >
                            <Card>
                                <Text style = {{ color: "#7B1FA2", fontSize: 25, fontWeight: "bold", textAlign: "center" }} >
                                    Do you want to leave this Group?
                                </Text>
                                <Card.Divider/>
                                <Button
                                    title = "Leave"
                                    type = "solid"
                                    buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                    onPress = {() => this._handleLeaveGroup()}
                                />
                                <Button
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                    onPress = {() => this._handleCloseLeaveGroupOverlay()}
                                />
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
        borderColor: "#7B1FA2"
    },

    ugCard2: {
        marginTop: "15%",
        borderWidth: 1,
        borderColor: "#7B1FA2"
    },

    ugCardTitle: {
        borderBottomWidth: 1,
        borderColor: "#7B1FA2",
    },

    ugButton: {
        backgroundColor: "#7B1FA2",
        paddingHorizontal: "43.5%",
        marginBottom: 10,
    },

    ugButton2: {
        backgroundColor: "#7B1FA2",
        paddingHorizontal: "40%",
    },

    ugButton3: {
        backgroundColor: "#7B1FA2",
        paddingHorizontal: "41.9%",
    },

    ugButton4: {
        backgroundColor: "#7B1FA2",
        paddingHorizontal: "40%",
        marginBottom: "3%",
    },

    ugOverlayCard: {
        marginHorizontal: 0,
        color: "#7B1FA2"
    },
    
    ugOverlayCard2: {
        marginHorizontal: "25%",
        color: "#7B1FA2"
    },

    ugOverlayCheckbox: {
        color: "#7B1FA2"
    },

    ugOverlayButton: {
        backgroundColor: "#7B1FA2",
        marginTop: 10,
    }

});