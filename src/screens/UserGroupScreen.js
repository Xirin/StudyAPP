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
            ],
            searchGroupOverlayVisibility: false,
            searchGroupResultOverlayVisibility: false,
            searchGroupTopicSelected: [""],
            searchAvailableGroups: [""],
            searchAvailableGroupsAccordion: "",
            userGroupMembersOverlayVisibility: false,
            userGroupMembersList: [""],
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
                                    topics: userGroupCollection[index].topics
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
        
        this.setState({ availableUsers: this.state.arrayInitializer })
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer()
    }

    _handleChatNavigation = (userGroupName) => {
        this.props.navigation.navigate("Chat", {
            userLastName: this.state.userLastName,
            studyGroupName: userGroupName,
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

    // _handleFindMatchOverlay = (visible) => {
    //     this.setState({ joinGroupOvarlayVisibility: visible })
    //     var userGroupCollection = [];
    //     var userGroupArray = [];
        
    //     //Compbility Algorithm Calculation From Current User to Other User Vice Versa
    //     var personalityScore = "";
    //     var wtcScore = "";
    //     var learningStyleScore1 = "";
    //     var learningStyleScore2 = "";
    //     var selfEfficacyScore = "";
    //     var userLSARScore = "";
    //     var userLSGSScore = "";
    //     var userCompabilityScore = [];
    //     var userFinalARScore = [];
    //     var userFinalGSScore = [];
    //     var userFinalLearningStyleScore = [];
    //     var compat1 = 1/4;
    //     var compat2 = [];

    //     var otherUserLSScore1 = [];
    //     var otherUserLSScore2 = [];
    //     var otherUserLSARScore = [];
    //     var otherUserLSGSScore = [];
    //     var otherUserFinalARScore = [];
    //     var otherUserFinalGSScore = [];
    //     var otherUserFinalLearningStyleScore = [];
    //     var otherUserCompabilityScore = [];
    //     var otherCompat1 = 1/4;
    //     var otherCompat2 = [];

    //     var reciprocalRecommendationScore = [];

    //     firestore()
    //         .collection("Users")
    //         .doc(auth().currentUser.uid)
    //         .get()
    //         .then((snapShot) => {
    //             personalityScore = snapShot.data().PersonalityScore;
    //             wtcScore = snapShot.data().WTCScore;
    //             learningStyleScore1 = snapShot.data().LearningStyleScore1
    //             learningStyleScore2 = snapShot.data().LearningStyleScore2;
    //             selfEfficacyScore = snapShot.data().SelfEfficacy;

    //             //Scoring of Learning Style Active/Reflective
    //             if (learningStyleScore1.length == 2) {
    //                 if (learningStyleScore1.slice(0, 1) <= 3) {
    //                     if (learningStyleScore1.slice(1, 3) == "A") {
    //                         userLSARScore = "Mild Active";
    //                     }
    //                     else if (learningStyleScore1.slice(1, 3) == "B") {
    //                         userLSARScore = "Mild Reflective"
    //                     }   
    //                 }
    //                 else if (learningStyleScore1.slice(0, 1) <= 7) {
    //                     if (learningStyleScore1.slice(1, 3) == "A") {
    //                         userLSARScore = "Moderate Active";
    //                     }
    //                     else if (learningStyleScore1.slice(1, 3) == "B") {
    //                         userLSARScore = "Moderate Reflective"
    //                     }   
    //                 }
    //                 else if (learningStyleScore1.slice(0, 1) <= 9) {
    //                     if (learningStyleScore1.slice(1, 3) == "A") {
    //                         userLSARScore = "Strong Active";
    //                     }
    //                     else if (learningStyleScore1.slice(1, 3) == "B") {
    //                         userLSARScore = "Strong Reflective"
    //                     }   
    //                 }
    //             }
    //             else if (learningStyleScore1.length == 3) {
    //                 if (learningStyleScore1.slice(0, 2) <= 11) {
    //                     if (learningStyleScore1.slice(2, 3) == "A") {
    //                         userLSARScore = "Strong Active";
    //                     }
    //                     else if (learningStyleScore1.slice(2, 3) == "B") {
    //                         userLSARScore = "Strong Reflective"
    //                     }   
    //                 }
    //             }

    //             //Scoring of Learning Style Global/Sequential
    //             if (learningStyleScore2.length == 2) {
    //                 if (learningStyleScore2.slice(0, 1) <= 3) {
    //                     if (learningStyleScore2.slice(1, 3) == "A") {
    //                         userLSGSScore = "Mild Global";
    //                     }
    //                     else if (learningStyleScore2.slice(1, 3) == "B") {
    //                         userLSGSScore = "Mild Sequential"
    //                     }   
    //                 }
    //                 else if (learningStyleScore2.slice(0, 1) <= 7) {
    //                     if (learningStyleScore2.slice(1, 3) == "A") {
    //                         userLSGSScore = "Moderate Global";
    //                     }
    //                     else if (learningStyleScore2.slice(1, 3) == "B") {
    //                         userLSGSScore = "Moderate Sequential"
    //                     }   
    //                 }
    //                 else if (learningStyleScore2.slice(0, 1) <= 9) {
    //                     if (learningStyleScore2.slice(1, 3) == "A") {
    //                         userLSGSScore = "Strong Global";
    //                     }
    //                     else if (learningStyleScore2.slice(1, 3) == "B") {
    //                         userLSGSScore = "Strong Sequential"
    //                     }   
    //                 }
    //             }
    //             else if (learningStyleScore2.length == 3) {
    //                 if (learningStyleScore2.slice(0, 2) <= 11) {
    //                     if (learningStyleScore2.slice(2, 3) == "A") {
    //                         userLSGSScore = "Strong Global";
    //                     }
    //                     else if (learningStyleScore2.slice(2, 3) == "B") {
    //                         userLSGSScore = "Strong Sequential"
    //                     }   
    //                 }
    //             }
    //         })
    //         .then(() => {
    //             firestore()
    //             .collection("Users")
    //             .where("uid", "!=", auth().currentUser.uid)
    //             .get()
    //             .then((snapShot) => {
    //                 snapShot.forEach((doc) => {
                        
    //                     otherUserLSScore1.push({
    //                         otherUserID: doc.data().uid,
    //                         otherUserCourse: doc.data().course,
    //                         otherUserTopic: doc.data().topic,
    //                         personalityScore: doc.data().PersonalityScore,
    //                         wtcScore: doc.data().WTCScore,
    //                         selfEfficacyScore: doc.data().SelfEfficacy,
    //                         learningStyleScore1: doc.data().LearningStyleScore1,
    //                     });
    //                     otherUserLSScore2.push({
    //                         otherUserID: doc.data().uid,
    //                         otherUserCourse: doc.data().course,
    //                         otherUserTopic: doc.data().topic,
    //                         personalityScore: doc.data().PersonalityScore,
    //                         wtcScore: doc.data().WTCScore,
    //                         selfEfficacyScore: doc.data().SelfEfficacy,
    //                         learningStyleScore2: doc.data().LearningStyleScore2,
    //                     })
                        
    //                     //Other User Learning Style Active/Reflective Scoring  
    //                     for (let index = 0; index < otherUserLSScore1.length; index++) {
    //                         if (otherUserLSScore1[index].learningStyleScore1.length == 2) {
    //                             if (otherUserLSScore1[index].learningStyleScore1.slice(0, 1) <= 3) {
    //                                 if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) == "A") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Mild Active"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Mild Reflective"
    //                                     }
    //                                 }
    //                             }
    //                             else if (otherUserLSScore1[index].learningStyleScore1.slice(0, 1) <= 7) {
    //                                 if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) == "A") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Moderate Active"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Moderate Reflective"
    //                                     }
    //                                 }
    //                             }
    //                             else if (otherUserLSScore1[index].learningStyleScore1.slice(0, 1) <= 9) {
    //                                 if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) == "A") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Strong Active"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Strong Reflective"
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                         else if (otherUserLSScore1[index].learningStyleScore1.length == 3) {
    //                             if (otherUserLSScore1[index].learningStyleScore1.slice(0, 2) <= 11) {
    //                                 if (otherUserLSScore1[index].learningStyleScore1.slice(2, 3) == "A") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Strong Active"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore1[index].learningStyleScore1.slice(2, 3) <= "B") {
    //                                     otherUserLSARScore[index] = {
    //                                         otherUserID: otherUserLSScore1[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore1[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore1[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore1[index].personalityScore,
    //                                         wtcScore: otherUserLSScore1[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
    //                                         lsScore: "Strong Reflective"
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     //Other User Learning Style Global/Sequential Scoring 
    //                     for (let index = 0; index < otherUserLSScore2.length; index++) {
    //                         if (otherUserLSScore2[index].learningStyleScore2.length == 2) {
    //                             if (otherUserLSScore2[index].learningStyleScore2.slice(0, 1) <= 3) {
    //                                 if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) == "A") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Mild Gobal"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Mild Sequential"
    //                                     }
    //                                 }
    //                             }
    //                             else if (otherUserLSScore2[index].learningStyleScore2.slice(0, 1) <= 7) {
    //                                 if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) == "A") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Moderate Global"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Moderate Sequential"
    //                                     }
    //                                 }
    //                             }
    //                             else if (otherUserLSScore2[index].learningStyleScore2.slice(0, 1) <= 9) {
    //                                 if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) == "A") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Strong Gobal"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Strong Sequential"
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                         else if (otherUserLSScore2[index].learningStyleScore2.length == 3) {
    //                             if (otherUserLSScore2[index].learningStyleScore2.slice(0, 2) <= 11) {
    //                                 if (otherUserLSScore2[index].learningStyleScore2.slice(2, 3) == "A") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Strong Gobal"
    //                                     }
    //                                 }
    //                                 else if (otherUserLSScore2[index].learningStyleScore2.slice(2, 3) <= "B") {
    //                                     otherUserLSGSScore[index] = {
    //                                         otherUserID: otherUserLSScore2[index].otherUserID,
    //                                         otherUserCourse: otherUserLSScore2[index].otherUserCourse,
    //                                         otherUserTopic: otherUserLSScore2[index].otherUserTopic,
    //                                         personalityScore: otherUserLSScore2[index].personalityScore,
    //                                         wtcScore: otherUserLSScore2[index].wtcScore,
    //                                         selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
    //                                         gsScore: "Strong Sequential"
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 })
    //             })
    //             .then(() => {
    //                 //Final Scoring for Active/Reflective Learning Styles User to Other Users
    //                 for(let index = 0; index < otherUserLSARScore.length; index++) {
    //                     if (userLSARScore == otherUserLSARScore[index].lsScore) {
    //                         userFinalARScore[index] = {
    //                             otherUserID: otherUserLSARScore[index].otherUserID,
    //                             score: 100
    //                         };
    //                     }
    //                     else if (userLSARScore != otherUserLSARScore[index].lsScore) {
    //                         userFinalARScore[index] = {
    //                             otherUserID: otherUserLSARScore[index].otherUserID,
    //                             score: 0
    //                         }
    //                     }
    //                 }

    //                 //Final Scoring for Global/Seqeuential Learning Styles User to Other Users
    //                 for(let index  = 0; index < otherUserLSGSScore.length; index++) {
    //                     if (userLSGSScore == otherUserLSGSScore[index].gsScore) {
    //                         userFinalGSScore[index] = {
    //                             otherUserID: otherUserLSARScore[index].otherUserID,
    //                             score: 100
    //                         };
    //                     }
    //                     if (userLSGSScore != otherUserLSGSScore[index].gsScore) {
    //                         userFinalGSScore[index] = {
    //                             otherUserID: otherUserLSARScore[index].otherUserID,
    //                             score: 0
    //                         };
    //                     }
    //                 }

    //                 //Final Learning Style Score Computation for User to Other Users
    //                 for (let index  = 0; index < userFinalARScore.length; index++) {
    //                     userFinalLearningStyleScore[index] = {
    //                         otherUserID: userFinalARScore[index].otherUserID,
    //                         finalScore: (userFinalARScore[index].score + userFinalGSScore[index].score) / 2
    //                     }
    //                 }
                    
    //                 //Compability Current User to Other Users
    //                 for (let index  = 0; index < userFinalLearningStyleScore.length; index++) {
    //                     compat2[index] = {
    //                         otherUserID: userFinalLearningStyleScore[index].otherUserID,
    //                         compatScore: (personalityScore + wtcScore + selfEfficacyScore + userFinalLearningStyleScore[index].finalScore) / 1
    //                     }
    //                 }

    //                 for (let index = 0; index < compat2.length; index++) {
    //                     userCompabilityScore[index] = {
    //                         otherUserID: compat2[index].otherUserID,
    //                         userCompabilityScore: compat1 * compat2[index].compatScore 
    //                     }
    //                 }

    //                 //Final Scoring for Active/Reflective Learning Styles Other Users to Current User
    //                 for (let index = 0; index < otherUserLSARScore.length; index ++) {
    //                     if (otherUserLSARScore[index].lsScore == userLSARScore) {
    //                         otherUserFinalARScore[index] = {
    //                             otherUserID: otherUserLSARScore[index].otherUserID,
    //                             otherUserCourse: otherUserLSARScore[index].otherUserCourse,
    //                             otherUserTopic: otherUserLSARScore[index].otherUserTopic, 
    //                             personalityScore: otherUserLSARScore[index].personalityScore,
    //                             wtcScore: otherUserLSARScore[index].wtcScore,
    //                             selfEfficacyScore: otherUserLSARScore[index].selfEfficacyScore,
    //                             lsScore: 100
    //                         }
    //                     }
    //                     else if (otherUserLSARScore[index].lsScore != userLSARScore) {
    //                         otherUserFinalARScore[index] = {
    //                             otherUserID: otherUserLSARScore[index].otherUserID,
    //                             otherUserCourse: otherUserLSARScore[index].otherUserCourse,
    //                             otherUserTopic: otherUserLSARScore[index].otherUserTopic, 
    //                             personalityScore: otherUserLSARScore[index].personalityScore,
    //                             wtcScore: otherUserLSARScore[index].wtcScore,
    //                             selfEfficacyScore: otherUserLSARScore[index].selfEfficacyScore,
    //                             lsScore: 0
    //                         }
    //                     }
    //                 }

    //                 //Final Scoring for Global/Sequential Learning Styles Other Users to Current User
    //                 for (let index = 0; index < otherUserLSGSScore.length; index ++) {
    //                     if (otherUserLSGSScore[index].gsScore == userLSGSScore) {
    //                         otherUserFinalGSScore[index] = {
    //                             otherUserID: otherUserLSGSScore[index].otherUserID,
    //                             otherUserCourse: otherUserLSGSScore[index].otherUserCourse,
    //                             otherUserTopic: otherUserLSGSScore[index].otherUserTopic,
    //                             personalityScore: otherUserLSGSScore[index].personalityScore,
    //                             wtcScore: otherUserLSGSScore[index].wtcScore,
    //                             selfEfficacyScore: otherUserLSGSScore[index].selfEfficacyScore,
    //                             lsScore: 100
    //                         }
    //                     }
    //                     else if (otherUserLSGSScore[index].gsScore != userLSGSScore) {
    //                         otherUserFinalGSScore[index] = {
    //                             otherUserID: otherUserLSGSScore[index].otherUserID,
    //                             otherUserCourse: otherUserLSGSScore[index].otherUserCourse,
    //                             otherUserTopic: otherUserLSGSScore[index].otherUserTopic,
    //                             personalityScore: otherUserLSGSScore[index].personalityScore,
    //                             wtcScore: otherUserLSGSScore[index].wtcScore,
    //                             selfEfficacyScore: otherUserLSGSScore[index].selfEfficacyScore,
    //                             lsScore: 0
    //                         }
    //                     }
    //                 }

    //                 //Final Learning Style Score Computation for Other Users to Current User
    //                 for (let index = 0; index < otherUserFinalARScore.length; index++) {
    //                     otherUserFinalLearningStyleScore[index] = {
    //                         otherUserID: otherUserFinalARScore[index].otherUserID,
    //                         otherUserCourse: otherUserFinalARScore[index].otherUserCourse,
    //                         otherUserTopic: otherUserFinalARScore[index].otherUserTopic,
    //                         personalityScore: otherUserFinalARScore[index].personalityScore,
    //                         wtcScore: otherUserFinalARScore[index].wtcScore,
    //                         selfEfficacyScore: otherUserFinalARScore[index].selfEfficacyScore,
    //                         finalScore: (otherUserFinalARScore[index].lsScore + otherUserFinalGSScore[index].lsScore) / 2
    //                     }
    //                 }

    //                 //Compability Other Users to Current User
                    
    //                 for (let index = 0; index < otherUserFinalLearningStyleScore.length; index++) {
    //                     otherCompat2[index] = {
    //                         otherUserID: otherUserFinalLearningStyleScore[index].otherUserID,
    //                         otherUserCourse: otherUserFinalLearningStyleScore[index].otherUserCourse,
    //                         otherUserTopic: otherUserFinalLearningStyleScore[index].otherUserTopic,
    //                         compatScore: (
    //                             otherUserFinalLearningStyleScore[index].personalityScore +
    //                             otherUserFinalLearningStyleScore[index].wtcScore + 
    //                             otherUserFinalLearningStyleScore[index].selfEfficacyScore +
    //                             otherUserFinalLearningStyleScore[index].finalScore
    //                         ) / 1
    //                     }
    //                 }
    //                 for (let index = 0; index < otherCompat2.length; index++) {
    //                     otherUserCompabilityScore[index] = {
    //                         otherUserID: otherCompat2[index].otherUserID,
    //                         otherUserCourse: otherCompat2[index].otherUserCourse,
    //                         otherUserTopic: otherCompat2[index].otherUserTopic,
    //                         otherUserCompabilityScore: otherCompat1 * otherCompat2[index].compatScore
    //                     }
    //                 }
    //             })
    //             .then(() => {
    //                 //Recipsrocal Recommendation Computation
    //                 for (let index = 0; index < userCompabilityScore.length; index++) {
    //                     if (userCompabilityScore[index].otherUserID == otherUserCompabilityScore[index].otherUserID) {
    //                         reciprocalRecommendationScore[index] = {
    //                             currentUserID: auth().currentUser.uid,
    //                             otherUserID: otherUserCompabilityScore[index].otherUserID,
    //                             otherUserCourse: otherUserCompabilityScore[index].otherUserCourse,
    //                             otherUserTopic: otherUserCompabilityScore[index].otherUserTopic,
    //                             score: 2 / ((1 / userCompabilityScore[index].userCompabilityScore) + (1 / otherUserCompabilityScore[index].otherUserCompabilityScore))
    //                         }
    //                     }
    //                 }

    //                 reciprocalRecommendationScore.sort((a, b) => {
    //                     if (a.score > b.score) {
    //                         return -1;
    //                     }
    //                     if (a.score < b.score) {
    //                         return 1;
    //                     }
    //                     return 0
    //                 })
    //             })
    //             //Assinging  Values to Render Available Groups base on Reciprocal Recommender Value also if the user is inside that group or not
    //             .then(() => {
    //                 for (let index = 0; index < reciprocalRecommendationScore.length; index++) {
    //                     firestore()
    //                         .collection("Users")
    //                         .where("uid", "==", reciprocalRecommendationScore[index].otherUserID)
    //                         // .where("course", "==", reciprocalRecommendationScore[index].otherUserCourse)
    //                         // .where("topic", "==", reciprocalRecommendationScore[index].otherUserTopic)
    //                         .get()
    //                         .then((snapShot) => {
    //                             snapShot.forEach((doc) => {
    //                                 userGroupCollection.push({
    //                                     otherUserID: doc.data().uid,
    //                                     otherUserFirstName: doc.data().firstName,
    //                                     otherUserLastName: doc.data().lastName,
    //                                 })
    //                             })
    //                         }) 
    //                         .then(() => {
    //                             firestore()
    //                                 .collection("Users")
    //                                 .doc(auth().currentUser.uid)
    //                                 .collection("Study Peers")
    //                                 .doc(userGroupCollection[index].otherUserID)
    //                                 .get()
    //                                 .then((doc) => {
    //                                     if (!doc.exists) {
    //                                         userGroupArray.push({
    //                                             otherUserID: userGroupCollection[index].otherUserID,
    //                                             otherUserFirstName: userGroupCollection[index].otherUserFirstName,
    //                                             otherUserLastName: userGroupCollection[index].otherUserLastName
    //                                         })
    //                                     }
    //                                     this.setState({ userAvailableGroups: userGroupArray })
    //                                 })
    //                         })
    //                 }
    //             })
    //         })

    //     //Check if the other users already recieved an study peer invitation or not
    //     var otherUserInvitationArray = [];
    //     firestore()
    //         .collection("Users")
    //         .where("uid", "!=", auth().currentUser.uid)
    //         .get()
    //         .then((snapShot) => {
    //             snapShot.forEach((doc) => {
    //                 otherUserInvitationArray.push({
    //                     otherUserID: doc.data().uid,
    //                 })
    //             })
    //         })
    //         .then(() => {
    //             for (let index = 0; index < otherUserInvitationArray.length; index++) {
    //                 firestore()
    //                     .collection("Invitations")
    //                     .doc(auth().currentUser.uid)
    //                     .collection("Sent")
    //                     .doc(otherUserInvitationArray[index].otherUserID)
    //                     .get()
    //                     .then((doc) => {
    //                         if (doc.exists) {
    //                             this.setState({ findStudyPeerFormValidation: true })
    //                         }
    //                         else { 
    //                             this.setState({ findStudyPeerFormValidation: false })
    //                         }
    //                     })
    //             }
    //         })
    // }

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
        if (this.state.userGroup == "") {
            errorCounter = errorCounter + 1;
            this.setState({ userGroupNameFormValidation: "This field is required*" })
        } else {
            this.setState({ userGroupNameFormValidation: "" })
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
                            firestore()
                                .collection("Invitations")
                                .doc(auth().currentUser.uid)
                                .collection("Group Sent")
                                .doc(userStudyPeersSelectedArray[index].otherUserID)
                                .set({
                                    recipientUserID: userStudyPeersSelectedArray[index].otherUserID,
                                    recipientUserFullName: userStudyPeersSelectedArray[index].otherUserName,
                                    senderID: auth().currentUser.uid,
                                    senderName: this.state.userFirstName.concat(" ", this.state.userLastName),
                                    message: "You have been invited by ".concat(this.state.userFirstName.concat(" ", this.state.userLastName), " in the group ", this.state.userGroup),
                                    groupName: this.state.userGroup,
                                    topics: topicLstSelectedCollection
                                })
                        })
                        .then(() => {
                            firestore()
                                .collection("Groups")
                                .doc(this.state.userGroup)
                                .set({
                                    creatorID: auth().currentUser.uid,
                                    creatorName: this.state.userFirstName.concat(" ", this.state.userLastName),
                                    groupName: this.state.userGroup,
                                    topics: topicLstSelectedCollection
                                })
                                .then(() => {
                                    firestore()
                                        .collection("Groups")
                                        .doc(this.state.userGroup)
                                        .collection("Members")
                                        .doc(auth().currentUser.uid)
                                        .set({
                                            userFullName: this.state.userFirstName.concat(" ", this.state.userLastName),
                                            userID: auth().currentUser.uid
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
                snapShot.forEach((doc) => {
                    for (let index = 0; index < doc.data().topics.length; index++){
                        topicArray.push(
                            doc.data().topics[index].concat("\n")
                        )
                    }
                    for (let index = 0; index < topicsSelectedCollection.length; index++) {
                        for (let i = 0; i < doc.data().topics.length; i++) {
                            if (doc.data().topics[i] === topicsSelectedCollection[index]) {
                                topicCounter = topicCounter + 1;
                            }
                        }
                    }
                    availableGroups.push({
                        creatorID: doc.data().creatorID,
                        creatorName: doc.data().creatorName,
                        groupName: doc.data().groupName,
                        topics: topicArray, 
                        matchCounter: topicCounter
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < availableGroups.length; index++) {
                    firestore()
                        .collection("Groups")
                        .doc(availableGroups[index].groupName)
                        .collection("Members")
                        .doc(auth().currentUser.uid)
                        .get()
                        .then((doc) => {
                            if (!doc.exists) {
                                availableGroupsCollection.push({
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
            })
            
        this.setState({ searchGroupResultOverlayVisibility: visible })
        this._handleCloseSearchGroupOverlay()
    }

    _handleCloseSearchResultsOverlay = () => {
        this.setState({ searchGroupResultOverlayVisibility: false })
    }

    _handleApplyToGroup = (creatorID, creatorName, groupName, topics) => {
        //Store to database the join request of the user
        firestore()
            .collection("Invitations")
            .doc(creatorID)
            .collection("Group Request")
            .doc(auth().currentUser.uid)
            .set({
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
                                                
                                                isExpanded = { this.state.activeIndex === item.groupName }
                                                onPress = {() => {
                                                    if (this.state.activeIndex == item.groupName) {
                                                        this.setState({ activeIndex: "" })
                                                    } else {
                                                        this.setState({ activeIndex: item.groupName })
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
                                                            onPress = {() => this._handleChatNavigation(item.groupName)}
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
                                                            buttonStyle = {{ paddingHorizontal: "35%", marginTop: "3.5%", backgroundColor: "#7B1FA2" }}
                                                            onPress = {() => this._handleOpenUserGroupMembersOverlay(true)}
                                                        />
                                                    </ListItem.Content>
                                                </ListItem>
                                            </ListItem.Accordion>
                                        )
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
                                                    { item.topics }
                                                </Text>
                                                <Button
                                                    title = "Join"
                                                    type = "solid"
                                                    buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                                    onPress = {() => this._handleApplyToGroup(item.creatorID, item.creatorName, item.groupName, item.topics)}
                                                />
                                                <Button
                                                    title = "Close"
                                                    type = "solid"
                                                    buttonStyle = {{ marginTop: "3%", backgroundColor: "#7B1FA2" }}
                                                    onPress = {() => this._handleCloseSearchResultsOverlay()}
                                                />
                                            </ListItem.Accordion>
                                        )
                                    })
                                }
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
        paddingHorizontal: "42.5%",
        marginBottom: 10,
    },

    ugButton2: {
        backgroundColor: "#7B1FA2",
        paddingHorizontal: "40%",
    },

    ugButton3: {
        backgroundColor: "#7B1FA2",
        paddingHorizontal: "40%",
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