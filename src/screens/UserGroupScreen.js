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
import { color } from 'react-native-reanimated';

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

    // _handleVideoCallNavigation = (userGroupName) => {
    //     this.props.navigation.navigate("Video Call", {
    //         studyGroupName: userGroupName
    //     });
    // }

    _handleOpenCreateGroupOvelay = (visible) => {
        this.setState({ createGroupOverlayVisibility: visible })
    }

    _handleCloseCreateGroupOverlay = () => {
        this.setState({ createGroupOverlayVisibility: false })
    }

    _handleJoinGroupOverlay = (visible) => {
        this.setState({ joinGroupOvarlayVisibility: visible })
        var userGroupCollection = [];
        var userGroupArray = [];
        // firestore()
        //     .collection("Groups")
        //     .get()
        //     .then((snapShot) =>{
        //         userGroupCollection = snapShot.docs.map(doc => doc.data());
        //     })
        //     .then(() => {
        //         for (let index = 0; index < userGroupCollection.length; index++) {
        //             firestore()
        //                 .collection("Groups")
        //                 .doc(userGroupCollection[index].groupName)
        //                 .collection("Members")
        //                 .doc(auth().currentUser.uid)
        //                 .get()
        //                 .then((doc) => {
        //                     if(!doc.exists) {
        //                         userGroupArray.push({
        //                             groupName: userGroupCollection[index].groupName,
        //                             topic: userGroupCollection[index].topic,
        //                         })
        //                         this.setState({ userAvailableGroups: userGroupArray })
        //                     }
        //                 })
        //         }
        //     });
        
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
        // var compabilityAlgorithmStep1 = 1 / 4;
        // var compabilityAlgorithmStep2 = (personalityScore + wtcScore + selfEfficacyScore) / 1;
        // userCompabilityScore = compabilityAlgorithmStep1 * compabilityAlgorithmStep2;

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
                            personalityScore: doc.data().PersonalityScore,
                            wtcScore: doc.data().WTCScore,
                            selfEfficacyScore: doc.data().SelfEfficacy,
                            learningStyleScore1: doc.data().LearningStyleScore1,
                        });
                        otherUserLSScore2.push({
                            otherUserID: doc.data().uid,
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
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Mild Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
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
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Moderate Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
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
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Strong Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(1, 3) <= "B") {
                                        otherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
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
                                            personalityScore: otherUserLSScore1[index].personalityScore,
                                            wtcScore: otherUserLSScore1[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore1[index].selfEfficacyScore,
                                            lsScore: "Strong Active"
                                        }
                                    }
                                    else if (otherUserLSScore1[index].learningStyleScore1.slice(2, 3) <= "B") {
                                        ootherUserLSARScore[index] = {
                                            otherUserID: otherUserLSScore1[index].otherUserID,
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
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Mild Gobal"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
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
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Moderate Global"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
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
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Gobal"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(1, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
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
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Gobal"
                                        }
                                    }
                                    else if (otherUserLSScore2[index].learningStyleScore2.slice(2, 3) <= "B") {
                                        otherUserLSGSScore[index] = {
                                            otherUserID: otherUserLSScore2[index].otherUserID,
                                            personalityScore: otherUserLSScore2[index].personalityScore,
                                            wtcScore: otherUserLSScore2[index].wtcScore,
                                            selfEfficacyScore: otherUserLSScore2[index].selfEfficacyScore,
                                            gsScore: "Strong Sequential"
                                        }
                                    }
                                }
                            }
                        }
                        // otherUserScoreCollection.push({
                        //     userID: doc.data().uid,
                        //     personalityScore: doc.data().PersonalityScore,
                        //     wtcScore: doc.data().WTCScore,
                        //     selfEfficacyScore: doc.data().SelfEfficacy
                        // })
                    })
                    // for(let index = 0; index < otherUserScoreCollection.length; index++) {
                    //     otherUserScoreArray[index] = [
                    //        otherUserScoreCollection[index].userID,
                    //        (1/4) * ((otherUserScoreCollection[index].personalityScore +
                    //             otherUserScoreCollection[index].wtcScore +
                    //             otherUserScoreCollection[index].selfEfficacyScore) / 1 )
                    //     ];
                    // }
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
                                personalityScore: otherUserLSARScore[index].personalityScore,
                                wtcScore: otherUserLSARScore[index].wtcScore,
                                selfEfficacyScore: otherUserLSARScore[index].selfEfficacyScore,
                                lsScore: 100
                            }
                        }
                        else if (otherUserLSARScore[index].lsScore != userLSARScore) {
                            otherUserFinalARScore[index] = {
                                otherUserID: otherUserLSARScore[index].otherUserID,
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
                                personalityScore: otherUserLSGSScore[index].personalityScore,
                                wtcScore: otherUserLSGSScore[index].wtcScore,
                                selfEfficacyScore: otherUserLSGSScore[index].selfEfficacyScore,
                                lsScore: 100
                            }
                        }
                        else if (otherUserLSGSScore[index].gsScore != userLSGSScore) {
                            otherUserFinalGSScore[index] = {
                                otherUserID: otherUserLSGSScore[index].otherUserID,
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

                    // console.log("\n\n")
                    // console.log(userCompabilityScore)
                    // console.log(otherUserCompabilityScore)
                    // console.log("\n\n\n")
                    // console.log(reciprocalRecommendationScore)

                    // for (let index = 0; index < otherUserScoreCollection.length; index++) {
                    //     reciprocalRecommendationScore[index] = [
                    //         { currentUserID: auth().currentUser.uid, otherUser: otherUserScoreArray[index][0] },
                    //         2 / ((1 / userCompabilityScore) + (1 / otherUserScoreArray[index][1]))
                    //     ];
                    // }
                    
                })
                //Assinging  Values to Render Available Groups base on Reciprocal Recommender Value also if the user is insde that group or not
                .then(() => {
                    for (let index  = 0; index < reciprocalRecommendationScore.length; index++) {
                        firestore()
                            .collection("Groups")
                            .where("creatorID", "==", reciprocalRecommendationScore[index].otherUserID)
                            .get()
                            .then((snapShot) => {
                                snapShot.forEach((doc) => {
                                    userGroupCollection.push({
                                        groupName: doc.data().groupName,
                                        topic: doc.data().topic
                                    })
                                })
                            })
                            .then(() => {
                                firestore()
                                    .collection("Groups")
                                    .doc(userGroupCollection[index].groupName)
                                    .collection("Members")
                                    .doc(auth().currentUser.uid)
                                    .get()
                                    .then((doc) => {
                                        if (!doc.exists) {
                                            userGroupArray.push({
                                                groupName: userGroupCollection[index].groupName,
                                                topic: userGroupCollection[index].topic
                                            })
                                        }
                                        this.setState({ userAvailableGroups: userGroupArray })
                                    })
                            })
                    }
                            // .then(() => {
                            //     for (let index = 0; index  < userGroupCollection.length; index++) {
                            //         firestore()
                            //             .collection("Groups")
                            //             .doc(userGroupCollection[index].groupName)
                            //             .collection("Members")
                            //             .doc(auth().currentUser.uid)
                            //             .get()
                            //             .then((doc) => {
                            //                 if (!doc.exists) {
                            //                     userGroupArray.push({
                            //                         groupName: userGroupCollection[index].groupName,
                            //                         topic: userGroupCollection[index].topic
                            //                     })
                            //                 }
                            //             })
                            //     }  
                            // })
                        // firestore()
                        //     .collection("Groups")
                        //     .get()
                        //     .then((snapShot) =>{
                        //         userGroupCollection = snapShot.docs.map(doc => doc.data());
                        //     })
                        //     .then(() => {
                        //         for (let index = 0; index < userGroupCollection.length; index++) {
                        //             firestore()
                        //                 .collection("Groups")
                        //                 .doc(userGroupCollection[index].groupName)
                        //                 .collection("Members")
                        //                 .doc(auth().currentUser.uid)
                        //                 .get()
                        //                 .then((doc) => {
                        //                     if(!doc.exists) {
                        //                         userGroupArray.push({
                        //                             groupName: userGroupCollection[index].groupName,
                        //                             topic: userGroupCollection[index].topic,
                        //                         })
                        //                         this.setState({ userAvailableGroups: userGroupArray })
                        //                     }
                        //                 })
                        //         }
                        //     });
                        // console.log(reciprocalRecommendationScore[index])
                })
            })
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
                creatorID: auth().currentUser.uid,
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