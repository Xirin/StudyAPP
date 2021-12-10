import React, { Component } from 'react';

import {
    StyleSheet,
    LogBox,
    ScrollView,
    View
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

import AgoraUIKit from 'agora-rn-uikit';

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
            activeIndex: "",
            videoCall: false,
            userStudyPeers: [""],
            findStudyPeerFormValidation: false,
            userGroupNameFormValidation: "",
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
        console.log(userGroupName)
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

    _handleFindMatchOverlay = (visible) => {
        this.setState({ joinGroupOvarlayVisibility: visible })
        var userGroupCollection = [];
        var userGroupArray = [];
        
        //Compbility Algorithm Calculation From Current User to Other User Vice Versa
        var personalityScore = "";
        var wtcScore = "";
        var learningStyleScore1 = "";
        var learningStyleScore2 = "";
        var selfEfficacyScore = "";
        var userLSARScore = "";
        var userLSGSScore = "";
        var userCompabilityScore = [];
        var userFinalARScore = [];
        var userFinalGSScore = [];
        var userFinalLearningStyleScore = [];
        var compat1 = 1/4;
        var compat2 = [];

        var otherUserLSScore1 = [];
        var otherUserLSScore2 = [];
        var otherUserLSARScore = [];
        var otherUserLSGSScore = [];
        var otherUserFinalARScore = [];
        var otherUserFinalGSScore = [];
        var otherUserFinalLearningStyleScore = [];
        var otherUserCompabilityScore = [];
        var otherCompat1 = 1/4;
        var otherCompat2 = [];

        var reciprocalRecommendationScore = [];

        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                personalityScore = snapShot.data().PersonalityScore;
                wtcScore = snapShot.data().WTCScore;
                learningStyleScore1 = snapShot.data().LearningStyleScore1
                learningStyleScore2 = snapShot.data().LearningStyleScore2;
                selfEfficacyScore = snapShot.data().SelfEfficacy;

                //Scoring of Learning Style Active/Reflective
                if (learningStyleScore1.length == 2) {
                    if (learningStyleScore1.slice(0, 1) <= 3) {
                        if (learningStyleScore1.slice(1, 3) == "A") {
                            userLSARScore = "Mild Active";
                        }
                        else if (learningStyleScore1.slice(1, 3) == "B") {
                            userLSARScore = "Mild Reflective"
                        }   
                    }
                    else if (learningStyleScore1.slice(0, 1) <= 7) {
                        if (learningStyleScore1.slice(1, 3) == "A") {
                            userLSARScore = "Moderate Active";
                        }
                        else if (learningStyleScore1.slice(1, 3) == "B") {
                            userLSARScore = "Moderate Reflective"
                        }   
                    }
                    else if (learningStyleScore1.slice(0, 1) <= 9) {
                        if (learningStyleScore1.slice(1, 3) == "A") {
                            userLSARScore = "Strong Active";
                        }
                        else if (learningStyleScore1.slice(1, 3) == "B") {
                            userLSARScore = "Strong Reflective"
                        }   
                    }
                }
                else if (learningStyleScore1.length == 3) {
                    if (learningStyleScore1.slice(0, 2) <= 11) {
                        if (learningStyleScore1.slice(2, 3) == "A") {
                            userLSARScore = "Strong Active";
                        }
                        else if (learningStyleScore1.slice(2, 3) == "B") {
                            userLSARScore = "Strong Reflective"
                        }   
                    }
                }

                //Scoring of Learning Style Global/Sequential
                if (learningStyleScore2.length == 2) {
                    if (learningStyleScore2.slice(0, 1) <= 3) {
                        if (learningStyleScore2.slice(1, 3) == "A") {
                            userLSGSScore = "Mild Global";
                        }
                        else if (learningStyleScore2.slice(1, 3) == "B") {
                            userLSGSScore = "Mild Sequential"
                        }   
                    }
                    else if (learningStyleScore2.slice(0, 1) <= 7) {
                        if (learningStyleScore2.slice(1, 3) == "A") {
                            userLSGSScore = "Moderate Global";
                        }
                        else if (learningStyleScore2.slice(1, 3) == "B") {
                            userLSGSScore = "Moderate Sequential"
                        }   
                    }
                    else if (learningStyleScore2.slice(0, 1) <= 9) {
                        if (learningStyleScore2.slice(1, 3) == "A") {
                            userLSGSScore = "Strong Global";
                        }
                        else if (learningStyleScore2.slice(1, 3) == "B") {
                            userLSGSScore = "Strong Sequential"
                        }   
                    }
                }
                else if (learningStyleScore2.length == 3) {
                    if (learningStyleScore2.slice(0, 2) <= 11) {
                        if (learningStyleScore2.slice(2, 3) == "A") {
                            userLSGSScore = "Strong Global";
                        }
                        else if (learningStyleScore2.slice(2, 3) == "B") {
                            userLSGSScore = "Strong Sequential"
                        }   
                    }
                }
            })
            .then(() => {
                firestore()
                .collection("Users")
                .where("uid", "!=", auth().currentUser.uid)
                .get()
                .then((snapShot) => {
                    snapShot.forEach((doc) => {
                        
                        otherUserLSScore1.push({
                            otherUserID: doc.data().uid,
                            otherUserCourse: doc.data().course,
                            otherUserTopic: doc.data().topic,
                            personalityScore: doc.data().PersonalityScore,
                            wtcScore: doc.data().WTCScore,
                            selfEfficacyScore: doc.data().SelfEfficacy,
                            learningStyleScore1: doc.data().LearningStyleScore1,
                        });
                        otherUserLSScore2.push({
                            otherUserID: doc.data().uid,
                            otherUserCourse: doc.data().course,
                            otherUserTopic: doc.data().topic,
                            personalityScore: doc.data().PersonalityScore,
                            wtcScore: doc.data().WTCScore,
                            selfEfficacyScore: doc.data().SelfEfficacy,
                            learningStyleScore2: doc.data().LearningStyleScore2,
                        })
                        
                        //Other User Learning Style Active/Reflective Scoring  
                        for (let index = 0; index < otherUserLSScore1.length; index++) {
                            if (otherUserLSScore1[index].learningStyleScore1.length == 2) {
                                if (otherUserLSScore1[index].learningStyleScore1.slice(0, 1) <= 3) {
                                    if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) == "A") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Mild Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Mild Reflective"
                                        }
                                    }
                                }
                                else if (otherUserLSScore1[index].learningStyleScore1.slice(0, 1) <= 7) {
                                    if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) == "A") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Moderate Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Moderate Reflective"
                                        }
                                    }
                                }
                                else if (otherUserLSScore1[index].learningStyleScore1.slice(0, 1) <= 9) {
                                    if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) == "A") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Strong Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Strong Reflective"
                                        }
                                    }
                                }
                            }
                            else if (otherUserLSScore1[index].learningStyleScore1.length == 3) {
                                if (otherUserLSScore1[index].learningStyleScore1.slice(0, 2) <= 11) {
                                    if (otherUserLSScore1[index].learningStyleScore1.slice(2, 3) == "A") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Strong Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(2, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
                                            otherUserCourse: otherUserLSScore1[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore1[index].otherUserTopic,
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Strong Reflective"
                                        }
                                    }
                                }
                            }
                        }
                        //Other User Learning Style Global/Sequential Scoring 
                        for (let index = 0; index < otherUserLSScore2.length; index++) {
                            if (otherUserLSScore2[index].learningStyleScore2.length == 2) {
                                if (otherUserLSScore2[index].learningStyleScore2.slice(0, 1) <= 3) {
                                    if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) == "A") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Mild Gobal"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Mild Sequential"
                                        }
                                    }
                                }
                                else if (otherUserLSScore2[index].learningStyleScore2.slice(0, 1) <= 7) {
                                    if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) == "A") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Moderate Global"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Moderate Sequential"
                                        }
                                    }
                                }
                                else if (otherUserLSScore2[index].learningStyleScore2.slice(0, 1) <= 9) {
                                    if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) == "A") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Gobal"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Sequential"
                                        }
                                    }
                                }
                            }
                            else if (otherUserLSScore2[index].learningStyleScore2.length == 3) {
                                if (otherUserLSScore2[index].learningStyleScore2.slice(0, 2) <= 11) {
                                    if (otherUserLSScore2[index].learningStyleScore2.slice(2, 3) == "A") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Gobal"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(2, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            otherUserCourse: otherUserLSScore2[index].otherUserCourse,
                                            otherUserTopic: otherUserLSScore2[index].otherUserTopic,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Sequential"
                                        }
                                    }
                                }
                            }
                        }
                    })
                })
                .then(() => {
                    //Final Scoring for Active/Reflective Learning Styles User to Other Users
                    for(let index = 0; index < otherUserLSARScore.length; index++) {
                        if (userLSARScore == otherUserLSARScore[index].lsScore) {
                            userFinalARScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
                                score: 100
                            };
                        }
                        else if (userLSARScore != otherUserLSARScore[index].lsScore) {
                            userFinalARScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
                                score: 0
                            }
                        }
                    }

                    //Final Scoring for Global/Seqeuential Learning Styles User to Other Users
                    for(let index  = 0; index < otherUserLSGSScore.length; index++) {
                        if (userLSGSScore == otherUserLSGSScore[index].gsScore) {
                            userFinalGSScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
                                score: 100
                            };
                        }
                        if (userLSGSScore != otherUserLSGSScore[index].gsScore) {
                            userFinalGSScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
                                score: 0
                            };
                        }
                    }

                    //Final Learning Style Score Computation for User to Other Users
                    for (let index  = 0; index < userFinalARScore.length; index++) {
                        userFinalLearningStyleScore[index] = {
                            otherUserID: userFinalARScore[index].otherUserID,
                            finalScore: (userFinalARScore[index].score + userFinalGSScore[index].score) / 2
                        }
                    }
                    
                    //Compability Current User to Other Users
                    for (let index  = 0; index < userFinalLearningStyleScore.length; index++) {
                        compat2[index] = {
                            otherUserID: userFinalLearningStyleScore[index].otherUserID,
                            compatScore: (personalityScore + wtcScore + selfEfficacyScore + userFinalLearningStyleScore[index].finalScore) / 1
                        }
                    }

                    for (let index = 0; index < compat2.length; index++) {
                        userCompabilityScore[index] = {
                            otherUserID: compat2[index].otherUserID,
                            userCompabilityScore: compat1 * compat2[index].compatScore 
                        }
                    }

                    //Final Scoring for Active/Reflective Learning Styles Other Users to Current User
                    for (let index = 0; index < otherUserLSARScore.length; index ++) {
                        if (otherUserLSARScore[index].lsScore == userLSARScore) {
                            otherUserFinalARScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
                                otherUserCourse: otherUserLSARScore[index].otherUserCourse,
                                otherUserTopic: otherUserLSARScore[index].otherUserTopic, 
                                personalityScore: otherUserLSARScore[index].personalityScore,
                                wtcScore: otherUserLSARScore[index].wtcScore,
                                selfEfficacyScore: otherUserLSARScore[index].selfEfficacyScore,
                                lsScore: 100
                            }
                        }
                        else if (otherUserLSARScore[index].lsScore != userLSARScore) {
                            otherUserFinalARScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
                                otherUserCourse: otherUserLSARScore[index].otherUserCourse,
                                otherUserTopic: otherUserLSARScore[index].otherUserTopic, 
                                personalityScore: otherUserLSARScore[index].personalityScore,
                                wtcScore: otherUserLSARScore[index].wtcScore,
                                selfEfficacyScore: otherUserLSARScore[index].selfEfficacyScore,
                                lsScore: 0
                            }
                        }
                    }

                    //Final Scoring for Global/Sequential Learning Styles Other Users to Current User
                    for (let index = 0; index < otherUserLSGSScore.length; index ++) {
                        if (otherUserLSGSScore[index].gsScore == userLSGSScore) {
                            otherUserFinalGSScore[index] = {
                                otherUserID: otherUserLSGSScore[index].otherUserID,
                                otherUserCourse: otherUserLSGSScore[index].otherUserCourse,
                                otherUserTopic: otherUserLSGSScore[index].otherUserTopic,
                                personalityScore: otherUserLSGSScore[index].personalityScore,
                                wtcScore: otherUserLSGSScore[index].wtcScore,
                                selfEfficacyScore: otherUserLSGSScore[index].selfEfficacyScore,
                                lsScore: 100
                            }
                        }
                        else if (otherUserLSGSScore[index].gsScore != userLSGSScore) {
                            otherUserFinalGSScore[index] = {
                                otherUserID: otherUserLSGSScore[index].otherUserID,
                                otherUserCourse: otherUserLSGSScore[index].otherUserCourse,
                                otherUserTopic: otherUserLSGSScore[index].otherUserTopic,
                                personalityScore: otherUserLSGSScore[index].personalityScore,
                                wtcScore: otherUserLSGSScore[index].wtcScore,
                                selfEfficacyScore: otherUserLSGSScore[index].selfEfficacyScore,
                                lsScore: 0
                            }
                        }
                    }

                    //Final Learning Style Score Computation for Other Users to Current User
                    for (let index = 0; index < otherUserFinalARScore.length; index++) {
                        otherUserFinalLearningStyleScore[index] = {
                            otherUserID: otherUserFinalARScore[index].otherUserID,
                            otherUserCourse: otherUserFinalARScore[index].otherUserCourse,
                            otherUserTopic: otherUserFinalARScore[index].otherUserTopic,
                            personalityScore: otherUserFinalARScore[index].personalityScore,
                            wtcScore: otherUserFinalARScore[index].wtcScore,
                            selfEfficacyScore: otherUserFinalARScore[index].selfEfficacyScore,
                            finalScore: (otherUserFinalARScore[index].lsScore + otherUserFinalGSScore[index].lsScore) / 2
                        }
                    }

                    //Compability Other Users to Current User
                    
                    for (let index = 0; index < otherUserFinalLearningStyleScore.length; index++) {
                        otherCompat2[index] = {
                            otherUserID: otherUserFinalLearningStyleScore[index].otherUserID,
                            otherUserCourse: otherUserFinalLearningStyleScore[index].otherUserCourse,
                            otherUserTopic: otherUserFinalLearningStyleScore[index].otherUserTopic,
                            compatScore: (
                                otherUserFinalLearningStyleScore[index].personalityScore +
                                otherUserFinalLearningStyleScore[index].wtcScore + 
                                otherUserFinalLearningStyleScore[index].selfEfficacyScore +
                                otherUserFinalLearningStyleScore[index].finalScore
                            ) / 1
                        }
                    }
                    for (let index = 0; index < otherCompat2.length; index++) {
                        otherUserCompabilityScore[index] = {
                            otherUserID: otherCompat2[index].otherUserID,
                            otherUserCourse: otherCompat2[index].otherUserCourse,
                            otherUserTopic: otherCompat2[index].otherUserTopic,
                            otherUserCompabilityScore: otherCompat1 * otherCompat2[index].compatScore
                        }
                    }
                })
                .then(() => {
                    //Recipsrocal Recommendation Computation
                    for (let index = 0; index < userCompabilityScore.length; index++) {
                        if (userCompabilityScore[index].otherUserID == otherUserCompabilityScore[index].otherUserID) {
                            reciprocalRecommendationScore[index] = {
                                currentUserID: auth().currentUser.uid,
                                otherUserID: otherUserCompabilityScore[index].otherUserID,
                                otherUserCourse: otherUserCompabilityScore[index].otherUserCourse,
                                otherUserTopic: otherUserCompabilityScore[index].otherUserTopic,
                                score: 2 / ((1 / userCompabilityScore[index].userCompabilityScore) + (1 / otherUserCompabilityScore[index].otherUserCompabilityScore))
                            }
                        }
                    }

                    reciprocalRecommendationScore.sort((a, b) => {
                        if (a.score > b.score) {
                            return -1;
                        }
                        if (a.score < b.score) {
                            return 1;
                        }
                        return 0
                    })
                })
                //Assinging  Values to Render Available Groups base on Reciprocal Recommender Value also if the user is inside that group or not
                .then(() => {
                    for (let index = 0; index < reciprocalRecommendationScore.length; index++) {
                        firestore()
                            .collection("Users")
                            .where("uid", "==", reciprocalRecommendationScore[index].otherUserID)
                            .where("course", "==", reciprocalRecommendationScore[index].otherUserCourse)
                            .where("topic", "==", reciprocalRecommendationScore[index].otherUserTopic)
                            .get()
                            .then((snapShot) => {
                                snapShot.forEach((doc) => {
                                    userGroupCollection.push({
                                        otherUserID: doc.data().uid,
                                        otherUserFirstName: doc.data().firstName,
                                        otherUserLastName: doc.data().lastName,
                                    })
                                })
                            }) 
                            .then(() => {
                                firestore()
                                    .collection("Users")
                                    .doc(auth().currentUser.uid)
                                    .collection("Study Peers")
                                    .doc(userGroupCollection[index].otherUserID)
                                    .get()
                                    .then((doc) => {
                                        if (!doc.exists) {
                                            userGroupArray.push({
                                                otherUserID: userGroupCollection[index].otherUserID,
                                                otherUserFirstName: userGroupCollection[index].otherUserFirstName,
                                                otherUserLastName: userGroupCollection[index].otherUserLastName
                                            })
                                        }
                                        this.setState({ userAvailableGroups: userGroupArray })
                                    })
                            })
                    }
                })
            })

        //Check if the other users already recieved an study peer invitation or not
        var otherUserInvitationArray = [];
        firestore()
            .collection("Users")
            .where("uid", "!=", auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    otherUserInvitationArray.push({
                        otherUserID: doc.data().uid,
                    })
                })
            })
            .then(() => {
                for (let index = 0; index < otherUserInvitationArray.length; index++) {
                    firestore()
                        .collection("Invitations")
                        .doc(auth().currentUser.uid)
                        .collection("Sent")
                        .doc(otherUserInvitationArray[index].otherUserID)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                this.setState({ findStudyPeerFormValidation: true })
                            }
                            else { 
                                this.setState({ findStudyPeerFormValidation: false })
                            }
                        })
                }
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
            //Store Group Invitations to other users in database 
            var userStudyPeersSelectedArray = this.state.userStudyPeers;
            for (let index = 0; index < userStudyPeersSelectedArray.length; index++) {
                if (userStudyPeersSelectedArray[index].checked == true) {
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
                            groupName: this.state.userGroup
                        })
                }
            }

            this._handleCloseCreateGroupOverlay();
            this.componentDidMount();
        }
    }

    _handleAddPeer = (otherUserID, otherUserFirstName, otherUserLastName) => {
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
                        recipientUserFullName: otherUserFirstName.concat(" ", otherUserLastName ),
                        senderID: auth().currentUser.uid,
                        senderName: this.state.userFirstName.concat(" ", this.state.userLastName),
                        message: currentUSerFullName.concat("  has sent you a Study Peer Invitation!")
                    })
                })
            })
        
        this._handleCloseJoinGroupOverlay();
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
                                Create Groups / Find Study Peers
                            </Card.Title>
                            <Card.Divider style = { userGroupScreenStyle.udDivider } />
                            <Button  
                                title ="Create Group"
                                type ="outline"
                                onPress = {() => this._handleOpenCreateGroupOvelay()}
                            />
                            <Button
                                title = "Find Match"
                                type = "outline"
                                containerStyle = {{ marginTop: 10 }}
                                onPress = {() => this._handleFindMatchOverlay()}
                            />
                        </Card>
                        <Card containerStyle = { userGroupScreenStyle.ugCard2 } >
                            <Card.Title style = {{ color: "#2288DC" }}>
                                Your Groups
                            </Card.Title>
                            <Card.Divider/>
                            {
                                this.state.userGroups.map((item, index) => {
                                    if (this.state.userGroups == "") {
                                        return (
                                            <Text h4 style = {{  color: "#2288DC", alignSelf: "center" }}>
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
                                                            onPress = {() => this.setState({ videoCall: true })}
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
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.userGroupNameFormValidation }
                                />
                                {
                                    this.state.userStudyPeers.map((item, index) => {
                                        return (
                                            <View key = { index } >
                                                <CheckBox
                                                    title = { item.otherUserName }
                                                    textStyle = { userGroupScreenStyle.ugOverlayCheckbox }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { item.checked }
                                                    onPress = {() => this._handleCreateGroupCheckBox(item.otherUserName)}
                                                />
                                            </View>
                                        )
                                    })
                                }
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
                                    Discover Study Peers
                                </Card.Title>
                                <Card.Divider/>
                                {
                                    this.state.userAvailableGroups.map((item, index) => {
                                        if (this.state.userAvailableGroups == "") {
                                            return(
                                                <Text h4 style = {{  color: "#2288DC", alignSelf: "center" }}>
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
                                                                <ListItem.Title style = {{ color: "#2288DC" }}>
                                                                    { item.otherUserFirstName.concat(" ", item.otherUserLastName) }
                                                                </ListItem.Title>
                                                            </ListItem.Content>
                                                        </>
                                                    }
                                                    isExpanded = { this.state.activeIndex === item.otherUserFirstName.concat(" ", item.otherUserLastName) }
                                                    onPress = {() => {
                                                        this.setState({ activeIndex: item.otherUserFirstName.concat(" ", item.otherUserLastName) })
                                                    }}
                                                >
                                                    <ListItem>
                                                        <ListItem.Content>
                                                            {this.state.findStudyPeerFormValidation == false ?
                                                                <Button
                                                                    type = "outline"
                                                                    title = "Add Peer"
                                                                    buttonStyle = { userGroupScreenStyle.ugButton4 }
                                                                    onPress = {() => this._handleAddPeer(item.otherUserID, item.otherUserFirstName, item.otherUserLastName)}
                                                                />
                                                                :
                                                                <Button
                                                                    type = "outline"
                                                                    titleStyle = {{ fontSize: 12 }}
                                                                    title = "Request Sent"
                                                                    buttonStyle = { userGroupScreenStyle.ugButton4 }
                                                                    disabled = { true }
                                                                />
                                                            }   
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
        paddingHorizontal: 89,
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