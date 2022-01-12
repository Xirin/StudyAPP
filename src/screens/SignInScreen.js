import React, { Component } from 'react';

import { 
  Container, 
  Content,
  List, 
} from 'native-base';

import {
    StyleSheet,
    View,
    TextInput,
    ScrollView,
} from 'react-native';

import {
    Avatar,
    Overlay,
    Card,
    Input,
    Button,
    Text,
    CheckBox,
    Slider,
    ListItem,
    Icon
} from 'react-native-elements';

import Swiper from 'react-native-swiper';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class SignInScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            //Personal Information Variables
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            age: "",
            sex: "",
            course: "",
            topic: "",
            signUpOverlayVisiblility: false,
            signInOverlayVisibility: false,
            courseListAccordion: false,
            topicListAccordion: false,
            emailFormValidation: "",
            passwordFormValidation: "",
            firstNameFormValidation: "",
            lastNameFormValidation: "",
            ageFormValidation: "",
            sexFormValidation: "",
            courseFormValidation: "",
            topicFormValidation: "",
            progressAlertOverlayvisivility: "",
            progressAlertStatus: "",

            //Personality Test Variables
            signUpOverlayPersonalityTestVisibility: false,
            preferredPersonalityScore: 0,
            personalityTestQ1ActiveIndex: "",
            personalityTestQ2ActiveIndex: "",
            personalityTestQ3ActiveIndex: "",
            personalityTestQ4ActiveIndex: "",
            personalityTestQ5ActiveIndex: "",
            personalityTestQ6ActiveIndex: "",
            personalityTestQ7ActiveIndex: "",
            personalityTestQ8ActiveIndex: "",
            personalityTestQ9ActiveIndex: "",
            personalityTestQ10ActiveIndex: "",
            personalityQ1FormValidation: "",
            personalityQ2FormValidation: "",
            personalityQ3FormValidation: "",
            personalityQ4FormValidation: "",
            personalityQ5FormValidation: "",
            personalityQ6FormValidation: "",
            personalityQ7FormValidation: "",
            personalityQ8FormValidation: "",
            personalityQ9FormValidation: "",
            personalityQ10FormValidation: "",
            personalityTestQuestions: [
                "1.) I see myself as someone who is Reserved",
                "2.) I see myself as someone who is generally Trusting",
                "3.) I see myself as someone who is tends to be Lazy",
                "4.) I see myself as someone who is Relaxed, Handles stress well",
                "5.) I see myself as someone who has few Artistic Interests",
                "6.) I see myself as someone who is Outgioing, Sociable",
                "7.) I see myself as someone who tends to Find fault with Others",
                "8.) I see myself as someone who does a Thorough job",
                "9.) I see myself as someone who gets Nervous Easily",
                "10.) I see myself as someone who has an Active Imagination",
            ],
            personalityTestAnswers: [
                { title: "Disagree Strongly" },
                { title: "Disagree a Little" },
                { title: "Neither Agree nor Disagree" },
                { title: "Agree a Little" },
                { title: "Agree Strongly" },
            ],

            //Learning Styles Variables
            // signUpOverlayLearningStylesVisibility: false,
            // learningStylesQ1ActiveIndex: "",
            // learningStylesQ2ActiveIndex: "",
            // learningStylesQ3ActiveIndex: "",
            // learningStylesQ4ActiveIndex: "",
            // learningStylesQ5ActiveIndex: "",
            // learningStylesQ6ActiveIndex: "",
            // learningStylesQ7ActiveIndex: "",
            // learningStylesQ8ActiveIndex: "",
            // learningStylesQ9ActiveIndex: "",
            // learningStylesQ10ActiveIndex: "",
            // learningStylesQ11ActiveIndex: "",
            // learningStylesQ12ActiveIndex: "",
            // learningStylesQ13ActiveIndex: "",
            // learningStylesQ14ActiveIndex: "",
            // learningStylesQ15ActiveIndex: "",
            // learningStylesQ16ActiveIndex: "",
            // learningStylesQ17ActiveIndex: "",
            // learningStylesQ18ActiveIndex: "",
            // learningStylesQ19ActiveIndex: "",
            // learningStylesQ20ActiveIndex: "",
            // learningStylesQ21ActiveIndex: "",
            // learningStylesQ22ActiveIndex: "",
            // lsQ1FormValidation: "",
            // lsQ2FormValidation: "",
            // lsQ3FormValidation: "",
            // lsQ4FormValidation: "",
            // lsQ5FormValidation: "",
            // lsQ6FormValidation: "",
            // lsQ7FormValidation: "",
            // lsQ8FormValidation: "",
            // lsQ9FormValidation: "",
            // lsQ10FormValidation: "",
            // lsQ11FormValidation: "",
            // lsQ12FormValidation: "",
            // lsQ13FormValidation: "",
            // lsQ14FormValidation: "",
            // lsQ15FormValidation: "",
            // lsQ16FormValidation: "",
            // lsQ17FormValidation: "",
            // lsQ18FormValidation: "",
            // lsQ19FormValidation: "",
            // lsQ20FormValidation: "",
            // lsQ21FormValidation: "",
            // lsQ22FormValidation: "",
            // learningStylesQuestions: [
            //     "1.) I understand something better after I",
            //     "2.) When I am learning something new, it helps me to",
            //     "3.) In a study group working on difficult material, I am more likely to",
            //     "4.) In classes I have taken",
            //     "5.) When I start a homework problem, I am more likely to",
            //     "6.) I prefer to study",
            //     "7.) I would rather first",
            //     "8.) I more easily remember",
            //     "9.) When I have to work on a group project, I first want to) ",
            //     "10.) I am more likely to be considered",
            //     "11.) The idea of doing homework in groups, with one grade for the entire group",
            //     "12.) I tend to",
            //     "13.) Once I understand",
            //     "14.) When I solve maths problems",
            //     "15.) When I'm analysing a story or a novel",
            //     "16.) It is more important to me that an instructor",
            //     "17.) I learn",
            //     "18.) When considering a body of information, I am more likely to",
            //     "19.) When writing a paper, I am more likely to",
            //     "20.) When I am learning a new subject, I prefer to",
            //     "21.) .Some teachers start their lectures with an outline of what they will cover. Such outlines are",
            //     "22.) When solving problems in a group, I would be more likely to",
            // ],
            // learningStyleAnswersQ1: [
            //     { title: "try it out." },
            //     { title: "think it through." }
            // ],
            // learningStyleAnswersQ2: [
            //     { title: "talk about it." },
            //     { title: "think about it. " }
            // ],
            // learningStyleAnswersQ3: [
            //     { title: "jump in and contribute ideas." },
            //     { title: "sit back and listen." }
            // ],
            // learningStyleAnswersQ4: [
            //     { title: "I have usually got to know many of the students." },
            //     { title: "I have rarely got to know many of the students." }
            // ],
            // learningStyleAnswersQ5: [
            //     { title: "start working on the solution immediately." },
            //     { title: "try to fully understand the problem first." }
            // ],
            // learningStyleAnswersQ6: [
            //     { title: "in a group." },
            //     { title: "alone." }
            // ],
            // learningStyleAnswersQ7: [
            //     { title: "try things out." },
            //     { title: "think about how I'm going to do it." }
            // ],
            // learningStyleAnswersQ8: [
            //     { title: "something I have done." },
            //     { title: "something I have thought a lot about." }
            // ],
            // learningStyleAnswersQ9: [
            //     { title: "(have a \"group brainstorming\" where everyone contributes ideas." },
            //     { title: "brainstorm individually and then come together as a group to compare ideas." }
            // ],
            // learningStyleAnswersQ10: [
            //     { title: "outgoing." },
            //     { title: "reserved." }
            // ],
            // learningStyleAnswersQ11: [
            //     { title: "appeals to me." },
            //     { title: "does not appeal to me." }
            // ],
            // learningStyleAnswersQ12: [
            //     { title: "understand details of a subject but may be fuzzy about its overall structure." },
            //     { title: "understand the overall structure but may be fuzzy about details." }
            // ],
            // learningStyleAnswersQ13: [
            //     { title: "all the parts, I understand the whole thing." },
            //     { title: "the whole thing, I see how the parts fit." }
            // ],
            // learningStyleAnswersQ14: [
            //     { title: "I usually work my way to the solutions one step at a time." },
            //     { title: "I often just see the solutions but then have to struggle to figure out the steps to get to them." }
            // ],
            // learningStyleAnswersQ15: [
            //     { title: "I think of the incidents and try to put them together to figure out the themes." },
            //     { title: "I just know what the themes are when I finish reading and then I have to go back and find the incidents that demonstrate them." }
            // ],
            // learningStyleAnswersQ16: [
            //     { title: "lay out the material in clear sequential steps." },
            //     { title: "give me an overall picture and relate the material to other subjects." }
            // ],
            // learningStyleAnswersQ17: [
            //     { title: "at a fairly regular pace. If I study hard, I'll \"get it.\"" },
            //     { title: "in fits and starts. I'll be totally confused and then suddenly it all \"clicks.\"" }
            // ],
            // learningStyleAnswersQ18: [
            //     { title: "focus on details and miss the big picture." },
            //     { title: "try to understand the big picture before getting into the details." }
            // ],
            // learningStyleAnswersQ19: [
            //     { title: "work on (think about or write) the beginning of the paper and progress forward." },
            //     { title: "work on (think about or write) different parts of the paper and then order them." }
            // ],
            // learningStyleAnswersQ20: [
            //     { title: "stay focused on that subject, learning as much about it as I can." },
            //     { title: "try to make connections between that subject and related subjects." }
            // ],
            // learningStyleAnswersQ21: [
            //     { title: "somewhat helpful to me." },
            //     { title: "very helpful to me." }
            // ],
            // learningStyleAnswersQ22: [
            //     { title: "think of the steps in the solution process." },
            //     { title: "think of possible consequences or applications of the solution in a wide range of areas. " }
            // ],

            //Willingness to Communicate Variables
            signUpOverlayWTCVisibility: false,
            preferredWTCScore: 0,
            wtcQ1ActiveIndex: 0,
            wtcQ2ActiveIndex: 0,
            wtcQ3ActiveIndex: 0,
            wtcQ4ActiveIndex: 0,
            wtcQ5ActiveIndex: 0,
            wtcQ6ActiveIndex: 0,
            wtcQ7ActiveIndex: 0,
            wtcQ8ActiveIndex: 0,
            wtcQ9ActiveIndex: 0,
            wtcQ10ActiveIndex: 0,
            wtcQ11ActiveIndex: 0,
            wtcQ12ActiveIndex: 0,
            wtcQuestions: [
                "1.) Presenta talk to a group of strangers.",
                "2.) Talk with an acquaintance while standing in line.",
                "3.) Talk in a large meeting of freinds.",
                "4.) Talk in a small group of strangers.",
                "5.) Talk with a friend while standing In line.",
                "6.) Talk in a large meeting of acquaintances.",
                "7.) Talk with a stranger while standing in line.",
                "8.)  Present a talk to a group of friends",
                "9.) Talk in a small group of acquaintances.",
                "10.) Talk in a large meeting of strangers.",
                "11.) Talk in a small group of friends.",
                "12.) Presenta talk to a group of acquaintances."
            ],

            //Self Efficacy Variables
            // signUpOverlaySelfEfficacyVisibility: false,
            // selfEfficacyQ1ActiveIndex: "",
            // selfEfficacyQ2ActiveIndex: "",
            // selfEfficacyQ3ActiveIndex: "",
            // selfEfficacyQ4ActiveIndex: "",
            // selfEfficacyQ5ActiveIndex: "",
            // selfEfficacyQ6ActiveIndex: "",
            // selfEfficacyQ7ActiveIndex: "",
            // selfEfficacyQ8ActiveIndex: "",
            // selfEfficacyQ1FormValidation: "",
            // selfEfficacyQ2FormValidation: "",
            // selfEfficacyQ3FormValidation: "",
            // selfEfficacyQ4FormValidation: "",
            // selfEfficacyQ5FormValidation: "",
            // selfEfficacyQ6FormValidation: "",
            // selfEfficacyQ7FormValidation: "",
            // selfEfficacyQ8FormValidation: "",
            // selfEfficacyQuestions: [
            //     "1. I believe I will receive an excellent grade in this class.",
            //     "2. I'm certain I can understand the most difficult material presented in the readings for this course.",
            //     "3. I'm confident I can understand the basic concepts taught in this course.",
            //     "4. I'm confident I can understand the most complex material presented by the instructor in this course.",
            //     "5. I'm confident I can do an excellent job on the assignments and tests in this course.",
            //     "6. I expect to do well in this class.",
            //     "7. I'm certain I can master the skills being taught in this class.",
            //     "8.  Considering the difficulty of this course, the teacher, and my skills, I think I will do well in this class."
            // ],
            // selfEfficacyAnswers: [
            //     { title: "Very True of Me" },
            //     { title: "True of Me" },
            //     { title: "Somewhat True of Me" },
            //     { title: "Neutral" },
            //     { title: "Somewhat Not True of Me" },
            //     { title: "Not True of Me" },
            //     { title: "Not Very True of Me" },
            // ],

        }
    }

    _handleSignIn = () => {
        auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => auth().FirebaseAuthInvalidCredentialsException())
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-email') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                        this.setState({ emailFormValidation: "E-mail is Invalid*" })
                    }
                    
                    else if (errorCode === 'auth/user-not-found') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                        this.setState({ emailFormValidation: "E-mail does not exist*" })
                    }

                    else if (errorCode === 'auth/wrong-password') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                        this.setState({ passwordFormValidation: "Wrong Password*" })
                    }
                    else if (this.state.email == "") {
                        this.setState({ emailFormValidation: "E-mail is Required*" })
                    }
                    else if (this.state.password == "") {
                        this.setState({ passwordFormValidation: "Password is Required*" })
                    }

                    else {
                        this._handleCloseSignInOvelay();
                        this.setState({ emailFormValidation: "" })
                        this.setState({ passwordFormValidation: "" })
                        this.props.navigation.navigate('Profile');
                    }
                });
    }

    _handleSignUp = () => {
        //Form Validation of Self Efficacy Fields
        // var errorCounter = 0;
        // if (this.state.selfEfficacyQ1ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ1FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ1FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ2ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ2FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ2FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ3ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ3FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ3FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ4ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ4FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ4FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ5ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ5FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ5FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ6ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ6FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ6FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ7ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ7FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ7FormValidation: "" })
        // }

        // if (this.state.selfEfficacyQ8ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ selfEfficacyQ8FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ selfEfficacyQ8FormValidation: "" })
        // }

        // if (errorCounter == 0) {
            //Personal Information Database Storing
            auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => auth().FirebaseAuthInvalidCredentialsException())
            .catch((error) => {
                const errorCode = error.code;
                if ( errorCode === 'auth/email-already-in-use' ) {
                    this.setState( { email: "" });
                    this.setState({ password: "" });
                }

                else if ( errorCode === 'auth/invalid-email' ) {
                    this.setState({ email: "" });
                    this.setState({ password: "" });
                }

                else if ( errorCode === 'auth/weak-password' ) {
                    this.setState({ email: "" });
                    this.setState({ password: "" });
                }
                else {
                    this.setState ({ signUpOverlayVisiblility: false });
                }
            })
            .then(() => {
                //WTC Score Computation
                var wtcStrangerScore = (this.state.wtcQ1ActiveIndex +
                                    this.state.wtcQ4ActiveIndex +
                                    this.state.wtcQ7ActiveIndex +
                                    this.state.wtcQ10ActiveIndex) / 4;

                var wtcAcquaintanceScore = (this.state.wtcQ2ActiveIndex +
                                    this.state.wtcQ6ActiveIndex +
                                    this.state.wtcQ9ActiveIndex +
                                    this.state.wtcQ12ActiveIndex) / 4;

                var wtcFriendScore = (this.state.wtcQ3ActiveIndex +
                                    this.state.wtcQ5ActiveIndex +
                                    this.state.wtcQ8ActiveIndex +
                                    this.state.wtcQ11ActiveIndex) / 4;

                var wtcTotalScore = (wtcStrangerScore + wtcAcquaintanceScore + wtcFriendScore) / 3;

                //Peronality Score Computation
                var personalityAnswerReversedScored = [
                    this.state.personalityTestQ1ActiveIndex,
                    this.state.personalityTestQ3ActiveIndex,
                    this.state.personalityTestQ4ActiveIndex,
                    this.state.personalityTestQ5ActiveIndex,
                    this.state.personalityTestQ7ActiveIndex
                ];

                var personalityAnswerNormalScored = [
                    this.state.personalityTestQ2ActiveIndex,
                    this.state.personalityTestQ6ActiveIndex,
                    this.state.personalityTestQ8ActiveIndex,
                    this.state.personalityTestQ9ActiveIndex,
                    this.state.personalityTestQ10ActiveIndex
                ];

                var personalityQ1Score = 0;
                var personalityQ2Score = 0;
                var personalityQ3Score = 0;
                var personalityQ4Score = 0;
                var personalityQ5Score = 0;
                var personalityQ6Score = 0;
                var personalityQ7Score = 0;
                var personalityQ8Score = 0;
                var personalityQ9Score = 0;
                var personalityQ10Score = 0;        
                
                var personalityReverseScores = [
                    personalityQ1Score,
                    personalityQ3Score,
                    personalityQ4Score,
                    personalityQ5Score,
                    personalityQ7Score
                ];

                var personalityNormalScores = [
                    personalityQ2Score,
                    personalityQ6Score,
                    personalityQ8Score,
                    personalityQ9Score,
                    personalityQ10Score
                ];

                for (var index = 0; index < personalityAnswerReversedScored.length; index++) {

                    //Reversed Scored
                    if (personalityAnswerReversedScored[index] === "Disagree Strongly") {
                        personalityReverseScores[index] = 100;
                    }
                    else if (personalityAnswerReversedScored[index] === "Disagree a Little") {
                        personalityReverseScores[index] = 80;
                    }
                    else if (personalityAnswerReversedScored[index] === "Neither Agree nor Disagree") {
                        personalityReverseScores[index] = 60;
                    }
                    else if (personalityAnswerReversedScored[index] === "Agree a Little") {
                        personalityReverseScores[index] = 40;
                    }
                    else if (personalityAnswerReversedScored[index] === "Agree Strongly") {
                        personalityReverseScores[index] = 20;
                    }

                    //Normal Scored
                    if (personalityAnswerNormalScored[index] === "Disagree Strongly") {
                        personalityNormalScores[index] = 20;
                    }
                    else if (personalityAnswerNormalScored[index] === "Disagree a Little") {
                        personalityNormalScores[index] = 40;
                    }
                    else if (personalityAnswerNormalScored[index] === "Neither Agree nor Disagree") {
                        personalityNormalScores[index] = 60;
                    }
                    else if (personalityAnswerNormalScored[index] === "Agree a Little") {
                        personalityNormalScores[index] = 80;
                    }
                    else if (personalityAnswerNormalScored[index] === "Agree Strongly") {
                        personalityNormalScores[index] = 100;
                    }
                }

                //Looping for Individual Scoring of the Questions
                for (var index = 0; index < personalityReverseScores.length; index++) {
                    if (index == 0) {
                        personalityQ1Score = personalityReverseScores[index];
                        personalityQ2Score = personalityNormalScores[index];
                    } 
                    else if (index == 1) {
                        personalityQ3Score = personalityReverseScores[index];
                        personalityQ6Score = personalityNormalScores[index];
                    }
                    else if (index == 2) {
                        personalityQ4Score = personalityReverseScores[index];
                        personalityQ8Score = personalityNormalScores[index];
                    }
                    else if (index == 3) {
                        personalityQ5Score = personalityReverseScores[index];
                        personalityQ9Score = personalityNormalScores[index];
                    }
                    else if (index == 4) {
                        personalityQ7Score = personalityReverseScores[index];
                        personalityQ10Score = personalityNormalScores[index];
                    }
                }
        
                var personalityExtraversionScore = (personalityQ1Score + personalityQ6Score) / 2;
                var personalityAgreeablenessScore = (personalityQ2Score + personalityQ7Score) / 2;
                var personalityConscientiousnessScore = (personalityQ3Score + personalityQ8Score) / 2;
                var personalityNeuroticismScore = (personalityQ4Score + personalityQ9Score) / 2;
                var personalityOpennessScore = (personalityQ5Score + personalityQ10Score) / 2;

                var personalityTotalScore = (personalityExtraversionScore +
                                            personalityAgreeablenessScore +
                                            personalityConscientiousnessScore +
                                            personalityNeuroticismScore +
                                            personalityOpennessScore) / 5;

                // //Learning Styles Score Computation
                // var lsActiveReflectiveAnswers = [
                //     this.state.learningStylesQ1ActiveIndex,
                //     this.state.learningStylesQ2ActiveIndex,
                //     this.state.learningStylesQ3ActiveIndex,
                //     this.state.learningStylesQ4ActiveIndex,
                //     this.state.learningStylesQ5ActiveIndex,
                //     this.state.learningStylesQ6ActiveIndex,
                //     this.state.learningStylesQ7ActiveIndex,
                //     this.state.learningStylesQ8ActiveIndex,
                //     this.state.learningStylesQ9ActiveIndex,
                //     this.state.learningStylesQ10ActiveIndex,
                //     this.state.learningStylesQ11ActiveIndex,
                // ];

                // var lsSequentialGlobalAnswers = [
                //     this.state.learningStylesQ12ActiveIndex,
                //     this.state.learningStylesQ13ActiveIndex,
                //     this.state.learningStylesQ14ActiveIndex,
                //     this.state.learningStylesQ15ActiveIndex,
                //     this.state.learningStylesQ16ActiveIndex,
                //     this.state.learningStylesQ17ActiveIndex,
                //     this.state.learningStylesQ18ActiveIndex,
                //     this.state.learningStylesQ19ActiveIndex,
                //     this.state.learningStylesQ20ActiveIndex,
                //     this.state.learningStylesQ21ActiveIndex,
                //     this.state.learningStylesQ22ActiveIndex,
                // ];

                // var lsActiveScore = 0;
                // var lsReflectiveScore = 0;
                // var lsSequentialScore = 0;
                // var lsGlobalScore = 0;
                // var learningStyleScoreAR = 0;
                // var learningStylesScoreSG = 0;

                // for (var index = 0; index < lsActiveReflectiveAnswers.length; index++) {

                //     //Adding all Scores Active or Global
                //     if (lsActiveReflectiveAnswers[index].charAt(1) === "a" ) {
                //         lsActiveScore = lsActiveScore + 1;
                //     }
                //     else if (lsActiveReflectiveAnswers[index].charAt(1) === "b") {
                //         lsReflectiveScore = lsReflectiveScore + 1;
                //     }

                //     //Adding all Scores Sequential or Global
                //     if (lsSequentialGlobalAnswers[index].charAt(1) === "a") {
                //         lsSequentialScore = lsSequentialScore + 1;
                //     }
                //     else if (lsSequentialGlobalAnswers[index].charAt(1) === "b") {
                //         lsGlobalScore = lsGlobalScore + 1;
                //     }
                // }

                // //Computing if User is Reflective of Active Learner
                // if (lsActiveScore > lsReflectiveScore) {
                //     learningStyleScoreAR = lsActiveScore - lsReflectiveScore + "A";
                // }
                // else if (lsReflectiveScore > lsActiveScore) {
                //     learningStyleScoreAR = lsReflectiveScore - lsActiveScore + "B";
                // }

                // //Computing if User is Sequential or Global Learner
                // if (lsSequentialScore > lsGlobalScore) {
                //     learningStylesScoreSG = lsSequentialScore - lsGlobalScore + "A";
                // }
                // else if (lsGlobalScore > lsSequentialScore) {
                //     learningStylesScoreSG = lsGlobalScore - lsSequentialScore + "B";
                // }

                // //Self Efficacy Score Computation
                // var seQuestionsSum = 0;
                // var seQuestionsCounter = 0;
                // var seQuestionsArrayCounter = [];
                // var seQuestionsSDStep1 = [];
                // var seQuestionsSDStep2 = 0;
                // var seQuestionsCCStep1 = [];
                // var seQuestionsVariance = 0;
                // var seAnswerScores = 0;
                // var seAnswerCounter = 0;
                // var seAnswersScoresArrayCounter = [];
                // var seAnswersSDStep1 = [];
                // var seAnswersSDStep2 = 0;
                // var seAnswersCCStep1 = [];
                // var seAnswers = [
                //     this.state.selfEfficacyQ1ActiveIndex,
                //     this.state.selfEfficacyQ2ActiveIndex,
                //     this.state.selfEfficacyQ3ActiveIndex,
                //     this.state.selfEfficacyQ4ActiveIndex,
                //     this.state.selfEfficacyQ5ActiveIndex,
                //     this.state.selfEfficacyQ6ActiveIndex,
                //     this.state.selfEfficacyQ7ActiveIndex,
                //     this.state.selfEfficacyQ8ActiveIndex,
                // ];
                // var seCCStep2 = [];
                // var seCorrelationCoefficientStep1 = 0;
                // var seCorrelationCoefficientStep2 = 0;
                
                // //Getting Mean for Quesitions in Self Efficacy
                // for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                //     seQuestionsSum = seQuestionsSum + parseInt(this.state.selfEfficacyQuestions[index].charAt(0));
                //     seQuestionsCounter = seQuestionsCounter + 1;
                //     seQuestionsArrayCounter[index] = index + 1;
                // }

                // //Setting Score Value of Answers in Self Efficacy
                // for (var index = 0; index < seAnswers.length; index++) {

                //     seAnswerCounter = seAnswerCounter + 1;

                //     if (seAnswers[index] === "Not Very True of Me") {
                //         seAnswerScores = seAnswerScores + 1;
                //         seAnswersScoresArrayCounter[index] = 1;
                //     }
                //     else if (seAnswers[index] === "Not True of Me") {
                //         seAnswerScores = seAnswerScores + 2;
                //         seAnswersScoresArrayCounter[index] = 2;
                //     }
                //     else if (seAnswers[index] === "Somewhat Not True of Me") {
                //         seAnswerScores = seAnswerScores + 3;
                //         seAnswersScoresArrayCounter[index] = 3;
                //     }
                //     else if (seAnswers[index] === "Neutral") {
                //         seAnswerScores = seAnswerScores + 4;
                //         seAnswersScoresArrayCounter[index] = 4;
                //     }
                //     else if (seAnswers[index] === "Somewhat True of Me") {
                //         seAnswerScores = seAnswerScores + 5;
                //         seAnswersScoresArrayCounter[index] = 5;
                //     }
                //     else if (seAnswers[index] === "True of Me") {
                //         seAnswerScores = seAnswerScores + 6;
                //         seAnswersScoresArrayCounter[index] = 6;
                //     }
                //     else if (seAnswers[index] === "Very True of Me") {
                //         seAnswerScores = seAnswerScores + 7;
                //         seAnswersScoresArrayCounter[index] = 7;
                //     }
                // }

                // //Getting Mean for Questions And Answers
                // var seQuestionsMean = seQuestionsSum / seQuestionsCounter;
                // var seAnswersMean = seAnswerScores / seAnswerCounter;

                // //Getting Standard Deviation and Correlation Coefficiency for Self Efficacy Questions STEP 1
                // for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                //     seQuestionsSDStep1[index] = Math.pow(seQuestionsArrayCounter[index] - seQuestionsMean, 2);
                //     seQuestionsCCStep1[index] = seQuestionsArrayCounter[index] - seQuestionsMean;
                // }
                // //Getting Standard Deviation and Correlation Coefficiency for Self Efficacy Questions STEP 2
                // for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                //     seQuestionsSDStep2 = seQuestionsSDStep2 + seQuestionsSDStep1[index];
                // }
                // //Getting Variance for Self Efficacy
                // seQuestionsVariance = seQuestionsSDStep2 / (seQuestionsCounter - 1);

                // //Getting Standard Deviation and Correlation Coefficient for Self Efficacy Answer Scores STEP 1
                // for (var index = 0; index < seAnswers.length; index++) {
                //     seAnswersSDStep1[index] = Math.pow(seAnswersScoresArrayCounter[index] - seAnswersMean, 2);
                //     seAnswersCCStep1[index] = seAnswersScoresArrayCounter[index] - seAnswersMean;
                // }
                
                // //Getting Standard Deviation and Correlation Coefficient for Self Efficacy Answer Scores STEP 2
                // for (var index = 0; index < seAnswers.length; index++) {
                //     seAnswersSDStep2 = seAnswersSDStep2 + seAnswersSDStep1[index];
                // }

                // //Getting Correlation Coefficiency for Questions and Answer Scores Self Efficacy STEP 2
                // for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                //     seCCStep2[index] = seQuestionsCCStep1[index] * seAnswersCCStep1[index];
                // }

                // //Getting Correlation Coefficient for Self Efficacy STEP 2
                // for (var index = 0; index < seCCStep2.length; index++) {
                //     seCorrelationCoefficientStep1 = seCCStep2.reduce((a, b) => a + b, 0);
                // }
                // seCorrelationCoefficientStep2 = Math.sqrt((seQuestionsSDStep2 * seAnswersSDStep2));

                // //Getting Standard Deviation and Self Efficacy Score
                // var seStandardDevation = Math.sqrt(seQuestionsVariance); 
                // var selfEfficacyScore = seCorrelationCoefficientStep1 / seCorrelationCoefficientStep2;

                firestore()
                    .collection('Users')
                    .doc(auth().currentUser.uid)
                    .set({
                        uid: auth().currentUser.uid,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName, 
                        age: this.state.age,
                        sex: this.state.sex,
                        course: this.state.course,
                        topic: this.state.topic,
                        personalityScore: personalityTotalScore,
                        WTCScore: wtcTotalScore,
                        personalityPreferredScore: this.state.preferredPersonalityScore,
                        wtcPreferredScore: this.state.preferredWTCScore,
                        // LearningStyleScore1: learningStyleScoreAR,
                        // LearningStyleScore2: learningStylesScoreSG,
                        // SelfEfficacy: selfEfficacyScore,
                    })
            })
            //Personality Test Database Storing
            .then(() => {
                var personalityTestAnswers = [
                    this.state.personalityTestQ1ActiveIndex,
                    this.state.personalityTestQ2ActiveIndex,
                    this.state.personalityTestQ3ActiveIndex,
                    this.state.personalityTestQ4ActiveIndex,
                    this.state.personalityTestQ5ActiveIndex,
                    this.state.personalityTestQ6ActiveIndex,
                    this.state.personalityTestQ7ActiveIndex,
                    this.state.personalityTestQ8ActiveIndex,
                    this.state.personalityTestQ9ActiveIndex,
                    this.state.personalityTestQ10ActiveIndex,
                ];
                for (let index = 0; index < this.state.personalityTestQuestions.length; index++) {
                    firestore()
                        .collection("Users")
                        .doc(auth().currentUser.uid)
                        .collection("Personality Test")
                        .doc(this.state.personalityTestQuestions[index])
                        .set({
                            answer: personalityTestAnswers[index],
                        })
                }
            })
            //Learning Styles Test Database Storing
            // .then(() => {
            //     var learningStylesAnswers = [
            //         this.state.learningStylesQ1ActiveIndex,
            //         this.state.learningStylesQ2ActiveIndex,
            //         this.state.learningStylesQ3ActiveIndex,
            //         this.state.learningStylesQ4ActiveIndex,
            //         this.state.learningStylesQ5ActiveIndex,
            //         this.state.learningStylesQ6ActiveIndex,
            //         this.state.learningStylesQ7ActiveIndex,
            //         this.state.learningStylesQ8ActiveIndex,
            //         this.state.learningStylesQ9ActiveIndex,
            //         this.state.learningStylesQ10ActiveIndex,
            //         this.state.learningStylesQ11ActiveIndex,
            //         this.state.learningStylesQ12ActiveIndex,
            //         this.state.learningStylesQ13ActiveIndex,
            //         this.state.learningStylesQ14ActiveIndex,
            //         this.state.learningStylesQ15ActiveIndex,
            //         this.state.learningStylesQ16ActiveIndex,
            //         this.state.learningStylesQ17ActiveIndex,
            //         this.state.learningStylesQ18ActiveIndex,
            //         this.state.learningStylesQ19ActiveIndex,
            //         this.state.learningStylesQ20ActiveIndex,
            //         this.state.learningStylesQ21ActiveIndex,
            //         this.state.learningStylesQ22ActiveIndex,
            //     ];
            //     for (let index = 0; index < this.state.learningStylesQuestions.length; index++) {
            //         firestore()
            //             .collection("Users")
            //             .doc(auth().currentUser.uid)
            //             .collection("Learning Styles Test")
            //             .doc(this.state.learningStylesQuestions[index])
            //             .set({
            //                 answer: learningStylesAnswers[index],
            //             })
            //     }
            // })
            //Willingness to Communicate Database Storing
            .then(() => {
                var wtcAnswers = [
                    this.state.wtcQ1ActiveIndex,
                    this.state.wtcQ2ActiveIndex,
                    this.state.wtcQ3ActiveIndex,
                    this.state.wtcQ4ActiveIndex,
                    this.state.wtcQ5ActiveIndex,
                    this.state.wtcQ6ActiveIndex,
                    this.state.wtcQ7ActiveIndex,
                    this.state.wtcQ8ActiveIndex,
                    this.state.wtcQ9ActiveIndex,
                    this.state.wtcQ10ActiveIndex,
                    this.state.wtcQ11ActiveIndex,
                    this.state.wtcQ12ActiveIndex,
                ];
                for (let index = 0; index < this.state.wtcQuestions.length; index++) {
                    firestore()
                        .collection("Users")
                        .doc(auth().currentUser.uid)
                        .collection("Willingness to Communicate Test")
                        .doc(this.state.wtcQuestions[index])
                        .set({
                            answer: wtcAnswers[index],
                        })
                }
            })
            //Self Efficacy Database Storing
            // .then(() => {
            //     var selfEfficacyAnswers = [
            //         this.state.selfEfficacyQ1ActiveIndex,
            //         this.state.selfEfficacyQ2ActiveIndex,
            //         this.state.selfEfficacyQ3ActiveIndex,
            //         this.state.selfEfficacyQ4ActiveIndex,
            //         this.state.selfEfficacyQ5ActiveIndex,
            //         this.state.selfEfficacyQ6ActiveIndex,
            //         this.state.selfEfficacyQ7ActiveIndex,
            //         this.state.selfEfficacyQ8ActiveIndex,
            //     ];
            //     for (let index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
            //         firestore()
            //             .collection("Users")
            //             .doc(auth().currentUser.uid)
            //             .collection("Self Efficacy Test")
            //             .doc(this.state.selfEfficacyQuestions[index])
            //             .set({
            //                 answer: selfEfficacyAnswers[index],
            //             })
            //     }
            // });

            //Navigation to other overlays
            this.setState ({ signUpOverlayVisiblility: false });
            this.setState ({ signUpOverlayPersonalityTestVisibility: false })
            this.setState ({ signUpOverlayLearningStylesVisibility: false })
            this.setState ({ signUpOverlayWTCVisibility: false })
            this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
            this.setState ({ progressAlertOverlayvisivility: false })
        //}
    }
    
    //Personal Information Overlay Triggers
    _handleOpenSignUpOverlay = (visible) => {
        this.setState ({ signUpOverlayVisiblility: visible });
        this.setState ({ signUpOverlayPersonalityTestVisibility: false })
        this.setState ({ signUpOverlayLearningStylesVisibility: false })
        this.setState ({ signUpOverlayWTCVisibility: false })
        this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
        this.setState ({ progressAlertOverlayvisivility: false })
    }

    _handleCloseSignUpOverlay = () => {
        this.setState ({ signUpOverlayVisiblility: !this.state.signUpOverlayVisiblility });
    }

    //Personality Test Overlay Triggers
    _handleOpenPersonalityTestOverlay = (visible) => {
        //From Validation for Personal Information Fields
        // var errorCounter = 0;
        // if (this.state.firstName == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ firstNameFormValidation: "First Name is Required*" })
        // }
        // else {
        //     this.setState({ firstNameFormValidation: "" })
        // }

        // if (this.state.lastName == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lastNameFormValidation: "Last Name is Required*" })
        // }
        // else {
        //     this.setState({ lastNameFormValidation: "" })
        // }

        // if (this.state.age == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ ageFormValidation: "Age is Required*" })
        // } 
        // else {
        //     this.setState({ ageFormValidation: "" })
        // }

        // if (this.state.email == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ emailFormValidation: "E-mail is Required*" })
        // }
        // else {
        //     this.setState({ emailFormValidation: "" })
        // }

        // if (this.state.password == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ passwordFormValidation: "Password is Required*" })
        // }
        // else {
        //     this.setState({ passwordFormValidation: "" })
        // }

        // if (this.state.course == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ courseFormValidation: "Course is Required*" })
        // }
        //  else {
        //      this.setState({ courseFormValidation: "" })
        //  }

        //  if (this.state.topic == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ topicFormValidation: "Topic is Required*" })
        //  }
        //  else {
        //      this.setState({ topicFormValidation: "" })
        //  }

        //  if (this.state.sex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ sexFormValidation: "Sex is Required*" })
        //  }
        //  else {
        //     this.setState({ sexFormValidation: "" })
        //  }

        // if (errorCounter == 0) {
            //Navigation of other overlays
            this.setState ({ signUpOverlayPersonalityTestVisibility: visible })
            this.setState ({ signUpOverlayVisiblility: false });
            this.setState ({ signUpOverlayLearningStylesVisibility: false })
            this.setState ({ signUpOverlayWTCVisibility: false })
            this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
            this.setState ({ progressAlertOverlayvisivility: false })
        //}
    }

    _handleClosePersonalityTestOverlay = () => {
        this.setState ({ signUpOverlayPersonalityTestVisibility: !this.state.signUpOverlayPersonalityTestVisibility })
        
    }

    //Learning Styles Overlay Triggers
    _handleOpenLearningStylesOverlay = (visible) => {
        //Form Validations for Personality Test Fields
        // var errorCounter = 0;
        // if (this.state.personalityTestQ1ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ1FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ1FormValidation: "" })
        // }

        // if (this.state.personalityTestQ2ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ2FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ2FormValidation: "" })
        // }

        // if (this.state.personalityTestQ3ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ3FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ3FormValidation: "" })
        // }

        // if (this.state.personalityTestQ4ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ4FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ4FormValidation: "" })
        // }

        // if (this.state.personalityTestQ5ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ5FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ5FormValidation: "" })
        // }

        // if (this.state.personalityTestQ6ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ6FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ6FormValidation: "" })
        // }

        // if (this.state.personalityTestQ7ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ7FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ7FormValidation: "" })
        // }

        // if (this.state.personalityTestQ8ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ8FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ8FormValidation: "" })
        // }

        // if (this.state.personalityTestQ9ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ9FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ9FormValidation: "" })
        // }

        // if (this.state.personalityTestQ10ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ personalityQ10FormValidation: "This field is required*" })
        // }
        // else {
        //     this.setState({ personalityQ10FormValidation: "" })
        // }

        //Navigation of other overlays
        // if (errorCounter == 0) {
            this.setState ({ signUpOverlayLearningStylesVisibility: visible })
            this.setState ({ signUpOverlayVisiblility: false });
            this.setState ({ signUpOverlayPersonalityTestVisibility: false })
            this.setState ({ signUpOverlayWTCVisibility: false })
            this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
            this.setState ({ progressAlertOverlayvisivility: false })
        //}
    }

    _handleCloseLearningStylesOverlay = () => {
        this.setState ({ signUpOverlayLearningStylesVisibility: !this.state.signUpOverlayLearningStylesVisibility })
    }

    //Willingness to Communicate Overlay Triggers
    _handleOpenWTCOverlay = (visible) => {
        //Form Validations for Learning Styles Fields
        // var errorCounter = 0;
        // if (this.state.learningStylesQ1ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ1FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ1FormValidation: "" })
        // }

        // if (this.state.learningStylesQ2ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ2FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ2FormValidation: "" })
        // }

        // if (this.state.learningStylesQ3ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ3FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ3FormValidation: "" })
        // }

        // if (this.state.learningStylesQ4ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ4FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ4FormValidation: "" })
        // }

        // if (this.state.learningStylesQ5ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ5FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ5FormValidation: "" })
        // }

        // if (this.state.learningStylesQ6ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ6FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ6FormValidation: "" })
        // }

        // if (this.state.learningStylesQ7ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ7FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ7FormValidation: "" })
        // }

        // if (this.state.learningStylesQ8ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ8FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ8FormValidation: "" })
        // }

        // if (this.state.learningStylesQ9ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ9FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ9FormValidation: "" })
        // }

        // if (this.state.learningStylesQ10ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ10FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ10FormValidation: "" })
        // }

        // if (this.state.learningStylesQ11ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ11FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ11FormValidation: "" })
        // }

        // if (this.state.learningStylesQ12ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ12FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ12FormValidation: "" })
        // }

        // if (this.state.learningStylesQ13ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ13FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ13FormValidation: "" })
        // }

        // if (this.state.learningStylesQ14ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ14FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ14FormValidation: "" })
        // }

        // if (this.state.learningStylesQ15ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ15FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ15FormValidation: "" })
        // }

        // if (this.state.learningStylesQ16ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ16FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ16FormValidation: "" })
        // }

        // if (this.state.learningStylesQ17ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ17FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ17FormValidation: "" })
        // }

        // if (this.state.learningStylesQ18ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ18FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ18FormValidation: "" })
        // }

        // if (this.state.learningStylesQ19ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ19FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ19FormValidation: "" })
        // }

        // if (this.state.learningStylesQ20ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ20FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ20FormValidation: "" })
        // }

        // if (this.state.learningStylesQ21ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ21FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ21FormValidation: "" })
        // }

        // if (this.state.learningStylesQ22ActiveIndex == "") {
        //     errorCounter = errorCounter + 1;
        //     this.setState({ lsQ22FormValidation: "This field is required*" })
        // } else {
        //     this.setState({ lsQ22FormValidation: "" })
        // }

        //Navigation of other overlays
        //if (errorCounter == 0) {
            this.setState ({ signUpOverlayWTCVisibility: visible })
            this.setState ({ signUpOverlayVisiblility: false });
            this.setState ({ signUpOverlayPersonalityTestVisibility: false })
            this.setState ({ signUpOverlayLearningStylesVisibility: false })
            this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
            this.setState ({ progressAlertOverlayvisivility: false })
        //}
        
    }

    _handleCloseWTCOverlay = () => {
        this.setState ({ signUpOverlayWTCVisibility: !this.state.signUpOverlayWTCVisibility })
    }

    //Self Efficacy Overlay Triggers
    _handleOpenSelfEfficacyOverlay = (visible) => {
        this.setState ({ signUpOverlaySelfEfficacyVisibility: visible })
        this.setState ({ signUpOverlayVisiblility: false });
        this.setState ({ signUpOverlayPersonalityTestVisibility: false })
        this.setState ({ signUpOverlayLearningStylesVisibility: false })
        this.setState ({ signUpOverlayWTCVisibility: false })
        this.setState ({ progressAlertOverlayvisivility: false })
    }

    _handleCloseSelfEfficacyOverlay = () => {
        this.setState ({ signUpOverlaySelfEfficacyVisibility: !this.state.signUpOverlaySelfEfficacyVisibility })
    }

    //User Signin Overlay Triggers
    _handleOpenSignInOvelay = (visible) => {
        this.setState ({ signInOverlayVisibility: visible });
    }

    _handleCloseSignInOvelay = () => {
        this.setState ({ signInOverlayVisibility: !this.state.signInOverlayVisibility });
    }

    _handleLimitMaxValue = (wtcActiveIndex) => {
        if (wtcActiveIndex > 100) {
            return 100;
        } 
        else {
            return wtcActiveIndex;
        }
    }

    _handleOpenProgressAlertOverlay = (visible, type) => {
        if (type == "Personality Test") {
            var errorCounter = 0;
            //Form Validation for Personal Information
            if (this.state.firstName == "") {
                errorCounter = errorCounter + 1;
                this.setState({ firstNameFormValidation: "First Name is required*" })
            } else {
                this.setState({ firstNameFormValidation: "" })
            }

            if (this.state.lastName == "") {
                errorCounter = errorCounter + 1;
                this.setState({ lastNameFormValidation: "Last Name is required*" })
            } else {
                this.setState({ lastNameFormValidation: "" })
            }

            if (this.state.age == "") {
                errorCounter = errorCounter + 1;
                this.setState({ ageFormValidation: "Age is required*" })
            } else {
                this.setState({ ageFormValidation: "" })
            }

            if (this.state.sex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ sexFormValidation: "Sex is required*" })
            } else {
                this.setState({ sexFormValidation: "" })
            }

            if (this.state.course == "") {
                errorCounter = errorCounter + 1;
                this.setState({ courseFormValidation: "Course is required*" })
            } else {
                this.setState({ courseFormValidation: "" })
            }

            if (this.state.topic == "") {
                errorCounter = errorCounter + 1;
                this.setState({ topicFormValidation: "Topic is required*" })
            } else {
                this.setState({ topicFormValidation: "" })
            }

            if (this.state.email == "") {
                errorCounter = errorCounter + 1;
                this.setState({ emailFormValidation: "Email is required*" })
            } else {
                this.setState({ emailFormValidation: "" })
            }

            if (this.state.password == "") {
                errorCounter = errorCounter + 1;
                this.setState({ passwordFormValidation: "Password is required*" })
            } else {
                this.setState({ passwordFormValidation: "" })
            }

            //Open Progress Overlay
            if (errorCounter == 0) {
                this.setState({ progressAlertOverlayvisivility: visible })
                this.setState({ progressAlertStatus: type })
            }
        }

        else if (type == "Willingness to Communicate Test") {
            var errorCounter = 0;
            if (this.state.personalityTestQ1ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ1FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ1FormValidation: "" })
            }

            if (this.state.personalityTestQ2ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ2FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ2FormValidation: "" })
            }

            if (this.state.personalityTestQ3ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ3FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ3FormValidation: "" })
            }

            if (this.state.personalityTestQ4ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ4FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ4FormValidation: "" })
            }

            if (this.state.personalityTestQ5ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ5FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ5FormValidation: "" })
            }

            if (this.state.personalityTestQ6ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ6FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ6FormValidation: "" })
            }

            if (this.state.personalityTestQ7ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ7FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ7FormValidation: "" })
            }

            if (this.state.personalityTestQ8ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ8FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ8FormValidation: "" })
            }

            if (this.state.personalityTestQ9ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ9FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ9FormValidation: "" })
            }

            if (this.state.personalityTestQ10ActiveIndex == "") {
                errorCounter = errorCounter + 1;
                this.setState({ personalityQ10FormValidation: "This field is required*" })
            } else {
                this.setState({ personalityQ10FormValidation: "" })
            }

            //Open Progress Overlay
            if (errorCounter == 0) {
                this.setState({ progressAlertOverlayvisivility: visible })
                this.setState({ progressAlertStatus: type })
            }
        }
    }
    
    _handleCloseProgressAlertOverlay = () => {
        this.setState({ progressAlertOverlayvisivility: false })
    }

    _handleProgressAlert = () => {
        if (this.state.progressAlertStatus == "Personality Test") {
            return (
                <View>
                    <Text style = {{ fontSize: 20, color: "#7B1FA2", textAlign: "justify" }} >You can now Proceed to the next step which is the... </Text>
                    <Text style = {{ fontSize: 20, color: "#7B1FA2", textAlign: "center", fontWeight: "bold" }}>{"\n"}{this.state.progressAlertStatus}</Text>
                    <Button 
                        title = "Proceed"
                        type = "solid"
                        buttonStyle = { signInPageStyle.signInButton }
                        onPress = {() => this._handleOpenPersonalityTestOverlay(true)}
                    />
                    <Button 
                        title = "Close"
                        type = "solid"
                        buttonStyle = { signInPageStyle.signInButton }
                        onPress = {() => this._handleCloseProgressAlertOverlay()}
                    />
                </View>
            )
        }
        
        // else if (this.state.progressAlertStatus == "Learning Styles Questionnaire") {
        //     return (
        //         <View>
        //             <Text style = {{ fontSize: 20, color: "#2288DC", textAlign: "justify" }} >You can now Proceed to the next step which is the... </Text>
        //             <Text style = {{ fontSize: 20, color: "#2288DC", textAlign: "center", fontWeight: "bold" }}>{"\n"}{this.state.progressAlertStatus}</Text>
        //             <Button 
        //                 title = "Proceed"
        //                 type = "outline"
        //                 buttonStyle = { signInPageStyle.signInButton }
        //                 onPress = {() => this._handleOpenLearningStylesOverlay(true)}
        //             />
        //             <Button 
        //                 title = "Close"
        //                 type = "outline"
        //                 buttonStyle = { signInPageStyle.signInButton }
        //                 onPress = {() => this._handleCloseProgressAlertOverlay()}
        //             />
        //         </View>
        //     )
        // }

        else if (this.state.progressAlertStatus == "Willingness to Communicate Test") {
            return (
                <View>
                    <Text style = {{ fontSize: 20, color: "#7B1FA2", textAlign: "justify" }} >You can now Proceed to the next step which is the... </Text>
                    <Text style = {{ fontSize: 20, color: "#7B1FA2", textAlign: "center", fontWeight: "bold" }}>{"\n"}{this.state.progressAlertStatus}</Text>
                    <Button 
                        title = "Proceed"
                        type = "solid"
                        buttonStyle = { signInPageStyle.signInButton }
                        onPress = {() => this._handleOpenWTCOverlay(true)}
                    />
                    <Button 
                        title = "Close"
                        type = "solid"
                        buttonStyle = { signInPageStyle.signInButton }
                        onPress = {() => this._handleCloseProgressAlertOverlay()}
                    />
                </View>
            )
        }

        // else if (this.state.progressAlertStatus == "Self Efficacy Questionnaire") {
        //     return (
        //         <View>
        //             <Text style = {{ fontSize: 20, color: "#2288DC", textAlign: "justify" }} >You can now Proceed to the next step which is the... </Text>
        //             <Text style = {{ fontSize: 20, color: "#2288DC", textAlign: "center", fontWeight: "bold" }}>{"\n"}{this.state.progressAlertStatus}</Text>
        //             <Button 
        //                 title = "Proceed"
        //                 type = "outline"
        //                 buttonStyle = { signInPageStyle.signInButton }
        //                 onPress = {() => this._handleOpenSelfEfficacyOverlay(true)}
        //             />
        //             <Button 
        //                 title = "Close"
        //                 type = "outline"
        //                 buttonStyle = { signInPageStyle.signInButton }
        //                 onPress = {() => this._handleCloseProgressAlertOverlay()}
        //             />
        //         </View>
        //     )
        // }
    }

    render() {
        var logo = require("./assets/logo.jpg");
        const sexList = [
            { sex: "Male" },
            { sex: "Female" }
        ];
        const courseList = [
            { title: "Bachelor of Science in Information Technology" },
            { title: "Bachelor of Science in Computer Science" },
            { title: "Bachelor of Library and Information Science" },
        ];
        const topicList = [
            { title: "Multidimensional Array" },
            { title: "Looping Statements" },
            { title: "Function" },
            { title: "Array Data Structure" },
            { title: "Variables, Constants, and Data Types" },
            { title: "Selection Statements" },
            { title: "Input/Output Statements" },
        ];

        return (
            <Container>
                <Content style = {{ borderWidth: 3, borderRadius: 10, borderColor: "#7B1FA2", marginHorizontal: "5%", marginVertical: "40%" }} >
                    <Avatar
                        source = { logo }
                        rounded
                        size = "xlarge"
                        activeOpacity = { 0.5 }
                        containerStyle = {{ backgroundColor: "#7B1FA2" ,alignSelf: "center", marginTop: "20%" }}
                    >
                    </Avatar>
                    <Text style = {{ alignSelf: "center", fontSize: 25, fontWeight: "bold", color: "#7B1FA2" }}>
                        StudyAPP
                    </Text>
                    <View style = { signInPageStyle.signInButtonGroup }>
                        <Button 
                            title = "Sign In"
                            type = "solid"
                            buttonStyle = { signInPageStyle.signInButton }
                            onPress = {() => this._handleOpenSignInOvelay(true)}
                        />
                        <Button 
                            title = "Sign Up"
                            type = "solid"
                            buttonStyle = { signInPageStyle.signInButton }
                            onPress = {()  => this._handleOpenSignUpOverlay(true)}
                        />
                    </View>

                    {/*Personal Information Oerlay*/}
                    <Overlay
                        isVisible = { this.state.signUpOverlayVisiblility }
                        onBackdropPress = {() => this._handleCloseSignUpOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard }>Sign Up</Card.Title>
                                <Card.Divider/>
                                <Input 
                                    placeholder = "First Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#7B1FA2" }}
                                    label = "First Name"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    onChangeText = {(firstName) => this.setState ({ firstName })}
                                    value = { this.state.firstName }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.firstNameFormValidation }
                                />
                                <Input 
                                    placeholder = "Last Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#7B1FA2" }}
                                    label = "Last Name"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    onChangeText = {(lastName) => this.setState ({ lastName })}
                                    value = { this.state.lastName }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.lastNameFormValidation }
                                />
                                <Input 
                                    keyboardType = "number-pad"
                                    placeholder = "Age"
                                    leftIcon = {{ type: "material-community", name: "counter", color: "#7B1FA2" }}
                                    label = "Age"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    onChangeText = {(age) => this.setState ({ age })}
                                    value = { this.state.age }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.ageFormValidation }
                                />
                                <Text style = {signInPageStyle.signUpText}>
                                    Sex
                                </Text>
                                <View style = { signInPageStyle.signUpCheckBox } >
                                    {
                                        sexList.map((item, index) => {
                                            return(
                                                <View key = { index }>
                                                    <CheckBox 
                                                        textStyle = {{ color: "#7B1FA2" }}
                                                        title = { item.sex }
                                                        checkedIcon='dot-circle-o'
                                                        uncheckedIcon='circle-o'
                                                        checked = { this.state.sex === item.sex }
                                                        onPress = {() => this.setState({ sex: item.sex })}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <Text style = {{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12
                                }}>
                                    { this.state.sexFormValidation }
                                </Text>
                                <ListItem.Accordion
                                    content = {
                                        <>
                                            <Icon 
                                                type = "material-community" 
                                                name = "school"
                                                color = "#7B1FA2"
                                            />
                                            <ListItem.Content>
                                                <ListItem.Title style = {{ color: "#7B1FA2", fontWeight: "bold" }}>
                                                    {"\u00A0"}{"\u00A0"}Course List
                                                </ListItem.Title>
                                            </ListItem.Content>
                                        </>
                                    }
                                    isExpanded = { this.state.courseListAccordion }
                                    onPress = {() => this.setState({ courseListAccordion: !this.state.courseListAccordion })}
                                >
                                    {
                                        courseList.map((item, index) => {
                                            return(
                                                <View key = { index }>
                                                    <CheckBox 
                                                        textStyle = {{ color: "#7B1FA2" }}
                                                        title = { item.title }
                                                        checkedIcon='dot-circle-o'
                                                        uncheckedIcon='circle-o'
                                                        checked = { this.state.course === item.title }
                                                        onPress = {() => this.setState({ course: item.title })}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                </ListItem.Accordion>
                                <Card.Divider/>
                                <Text style = {{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12
                                }}>
                                    { this.state.courseFormValidation }
                                </Text>
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
                                        topicList.map((item, index) => {
                                            return(
                                                <View key = { index }>
                                                    <CheckBox 
                                                        textStyle = {{ color: "#7B1FA2" }}
                                                        title = { item.title }
                                                        checkedIcon='dot-circle-o'
                                                        uncheckedIcon='circle-o'
                                                        checked = { this.state.topic === item.title }
                                                        onPress = {() => this.setState({ topic: item.title })}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                </ListItem.Accordion>
                                <Card.Divider/>
                                <Text style = {{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12
                                }}>
                                    { this.state.topicFormValidation }
                                </Text>
                                <Input 
                                    placeholder = "email@address.com"
                                    leftIcon = {{ type: "ion-icon", name: "mail", color: "#7B1FA2" }}
                                    label = "Email Address"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    onChangeText = {(email) => this.setState ({ email })}
                                    value = { this.state.email }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.emailFormValidation }
                                />
                                <Input 
                                    placeholder = "Password"
                                    leftIcon = {{ type: "font-awesome", name: "lock", color: "#7B1FA2" }}
                                    label = "Password"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    onChangeText = {(password) => this.setState ({ password })}
                                    value = { this.state.password }
                                    InputComponent = { TextInput }
                                    secureTextEntry = { true }
                                    errorStyle = {{ color: "red" }}
                                    errorMessage = { this.state.passwordFormValidation }
                                />
                                {/* <Button
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenPersonalityTestOverlay(true)}
                                /> */}
                                <Button 
                                    title = "Next"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenProgressAlertOverlay(true, "Personality Test")}
                                />
                                <Button 
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleCloseSignUpOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay>

                    {/*Personality Test Oerlay*/}
                    <Overlay
                        isVisible = { this.state.signUpOverlayPersonalityTestVisibility }
                        onBackdropPress = {() => this._handleClosePersonalityTestOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard }>
                                    Personality Test
                                </Card.Title>
                                <Card.Divider/>
                                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Instructions:  {"\n"}</Text>
                                <Text style = {{ marginBottom: 10 }} >How well do the following statements describe your personality?</Text>
                                <Card.Divider/>
                                <Text>1. I see myself as someone who is Reserved </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ1ActiveIndex: item.title })}
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
                                    { this.state.personalityQ1FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>2. I see myself as someone who is generally Trusting </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ2ActiveIndex: item.title })}
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
                                    { this.state.personalityQ2FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>3. I see myself as someone who is tends to be Lazy </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ3ActiveIndex: item.title })}
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
                                    { this.state.personalityQ3FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>4. I see myself as someone who is Relaxed, Handles stress well </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ4ActiveIndex: item.title })}
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
                                    { this.state.personalityQ4FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>5. I see myself as someone who has few Artistic Interests</Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ5ActiveIndex: item.title })}
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
                                    { this.state.personalityQ5FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>6. I see myself as someone who is Outgioing, Sociable </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ6ActiveIndex: item.title })}
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
                                    { this.state.personalityQ6FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>7. I see myself as someone who tends to Find fault with Others </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ7ActiveIndex: item.title })}
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
                                    { this.state.personalityQ7FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>8. I see myself as someone who does a Thorough job </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ8ActiveIndex: item.title })}
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
                                    { this.state.personalityQ8FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>9. I see myself as someone who gets Nervous Easily </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ9ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ9ActiveIndex: item.title })}
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
                                    { this.state.personalityQ9FormValidation }
                                </Text>
                                <Card.Divider/>
                                <Text>10. I see myself as someone who has an Active Imagination </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.personalityTestQ10ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ10ActiveIndex: item.title })}
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
                                    { this.state.personalityQ10FormValidation }
                                </Text>
                                <Text>Select your preferred Personality Score.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(preferredPersonalityScore) => this.setState({ preferredPersonalityScore })}
                                        value = { this.state.preferredPersonalityScore }
                                />
                                <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.preferredPersonalityScore } </Text>
                                <Button 
                                    title = "Previous"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenSignUpOverlay(true)}
                                />
                                {/* <Button 
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenLearningStylesOverlay(true)}
                                /> */}
                                <Button 
                                    title = "Next"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenProgressAlertOverlay(true, "Willingness to Communicate Test")}
                                />
                                <Button 
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleClosePersonalityTestOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay>

                    {/*Learning Styles Overlay*/}
                    {/* <Overlay
                        isVisible = { this.state.signUpOverlayLearningStylesVisibility }
                        onBackdropPress = {() => this._handleCloseLearningStylesOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard } >Learning Styles Test</Card.Title>
                                <Card.Divider/>
                                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Instructions:  {"\n"}</Text>
                                <Text style = {{ marginBottom: 10 }} >
                                    To complete the questionnaire please circle "a" or "b" to indicate your answer to every
                                    question. You may only choose one answer for each question and you must answer every
                                    question. If both "a" and "b" seem to apply to you, please choose the one that applies
                                    more frequently
                                </Text>
                                <Card.Divider/>
                                <Text>1. I understand something better after I...</Text>
                                {
                                    this.state.learningStyleAnswersQ1.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ1ActiveIndex: item.title })}
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
                                    { this.state.lsQ1FormValidation }
                                </Text>
                                <Card.Divider/>

                                <Text>2. When I am learning something new, it helps me to</Text>
                                {
                                    this.state.learningStyleAnswersQ2.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ2ActiveIndex: item.title })}
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
                                    { this.state.lsQ2FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>3. In a study group working on difficult material, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ3.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ3ActiveIndex: item.title })}
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
                                    { this.state.lsQ3FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>4. In classes I have taken</Text>
                                {
                                    this.state.learningStyleAnswersQ4.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ4ActiveIndex: item.title })}
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
                                    { this.state.lsQ4FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>5. When I start a homework problem, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ5.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ5ActiveIndex: item.title })}
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
                                    { this.state.lsQ5FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>6. I prefer to study</Text>
                                {
                                    this.state.learningStyleAnswersQ6.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ6ActiveIndex: item.title })}
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
                                    { this.state.lsQ6FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>7. I would rather first</Text>
                                {
                                    this.state.learningStyleAnswersQ7.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ7ActiveIndex: item.title })}
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
                                    { this.state.lsQ7FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>8. I more easily remember</Text>
                                {
                                    this.state.learningStyleAnswersQ8.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ8ActiveIndex: item.title })}
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
                                    { this.state.lsQ8FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>9. When I have to work on a group project, I first want to</Text>
                                {
                                    this.state.learningStyleAnswersQ9.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ9ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ9ActiveIndex: item.title })}
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
                                    { this.state.lsQ9FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>10. I am more likely to be considered</Text>
                                {
                                    this.state.learningStyleAnswersQ10.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ10ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ10ActiveIndex: item.title })}
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
                                    { this.state.lsQ10FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>11. The idea of doing homework in groups, with one grade for the entire group</Text>
                                {
                                    this.state.learningStyleAnswersQ11.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ11ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ11ActiveIndex: item.title })}
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
                                    { this.state.lsQ11FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>12. I tend to</Text>
                                {
                                    this.state.learningStyleAnswersQ12.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ12ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ12ActiveIndex: item.title })}
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
                                    { this.state.lsQ12FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>13. Once I understand</Text>
                                {
                                    this.state.learningStyleAnswersQ13.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ13ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ13ActiveIndex: item.title })}
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
                                    { this.state.lsQ13FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>14. When I solve maths problems</Text>
                                {
                                    this.state.learningStyleAnswersQ14.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ14ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ14ActiveIndex: item.title })}
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
                                    { this.state.lsQ14FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>15. When I'm analysing a story or a novel</Text>
                                {
                                    this.state.learningStyleAnswersQ15.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ15ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ15ActiveIndex: item.title })}
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
                                    { this.state.lsQ15FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>16. It is more important to me that an instructor</Text>
                                {
                                    this.state.learningStyleAnswersQ16.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ16ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ16ActiveIndex: item.title })}
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
                                    { this.state.lsQ16FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>17. I learn</Text>
                                {
                                    this.state.learningStyleAnswersQ17.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ17ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ17ActiveIndex: item.title })}
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
                                    { this.state.lsQ17FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>18. When considering a body of information, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ18.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ18ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ18ActiveIndex: item.title })}
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
                                    { this.state.lsQ18FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>19. When writing a paper, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ19.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ19ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ19ActiveIndex: item.title })}
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
                                    { this.state.lsQ19FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>20. When I am learning a new subject, I prefer to</Text>
                                {
                                    this.state.learningStyleAnswersQ20.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ20ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ20ActiveIndex: item.title })}
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
                                    { this.state.lsQ20FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>21. Some teachers start their lectures with an outline of what they will cover. Such outlines are </Text>
                                {
                                    this.state.learningStyleAnswersQ21.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ21ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ21ActiveIndex: item.title })}
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
                                    { this.state.lsQ21FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>22. When solving problems in a group, I would be more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ22.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.learningStylesQ22ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ22ActiveIndex: item.title })}
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
                                    { this.state.lsQ22FormValidation }
                                </Text>
                                
                                <Button 
                                    title = "Previous"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenPersonalityTestOverlay(true)}
                                />
                                <Button 
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenWTCOverlay(true)}
                                />
                                <Button 
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenProgressAlertOverlay(true, "Willingness to Communicate Questionnaire")}
                                />
                                <Button 
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleCloseLearningStylesOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay> */}

                    {/* Willingness to Communicate Overlay */}
                    <Overlay
                        isVisible = { this.state.signUpOverlayWTCVisibility }
                        onBackdropPress = {() => this._handleCloseWTCOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard } >Willingness to Communicate</Card.Title>
                                <Card.Divider/>
                                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Instructions:  {"\n"}</Text>
                                <Text style = {{ marginBottom: 10 }} >
                                    Below are twenty situations in which a person might choose to communicate or not
                                    to communicate. Presume you have completely free choice. Indicate the percentage of times you
                                    would choose to communicate in each type of situation. Indicate in the space at the left what percent of the time you would choose to communicate.
                                    0 = never, 100 = always

                                </Text>
                                <Card.Divider/>
                                <Text>1. Present a talk to a group of strangers.</Text>
                                    <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ1ActiveIndex) => this.setState({ wtcQ1ActiveIndex })}
                                        value = { this.state.wtcQ1ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ1ActiveIndex } </Text>

                                <Text>2. Talk with an acquaintance while standing in line.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ2ActiveIndex) => this.setState({ wtcQ2ActiveIndex })}
                                        value = { this.state.wtcQ2ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ2ActiveIndex } </Text>
                               
                                <Text>3. Talk in a large meeting of friends.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ3ActiveIndex) => this.setState({ wtcQ3ActiveIndex })}
                                        value = { this.state.wtcQ3ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ3ActiveIndex } </Text>
                               
                                <Text>4. Talk in a small group of strangers.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ4ActiveIndex) => this.setState({ wtcQ4ActiveIndex })}
                                        value = { this.state.wtcQ4ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ4ActiveIndex } </Text>
                                
                                <Text>5. Talk with a friend while standing In line.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ5ActiveIndex) => this.setState({ wtcQ5ActiveIndex })}
                                        value = { this.state.wtcQ5ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ5ActiveIndex } </Text>
                                
                                <Text>6. Talk in a large meeting of acquaintances.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ6ActiveIndex) => this.setState({ wtcQ6ActiveIndex })}
                                        value = { this.state.wtcQ6ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ6ActiveIndex } </Text>
                                
                                <Text>7. Talk with a stranger while standing in line.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ7ActiveIndex) => this.setState({ wtcQ7ActiveIndex })}
                                        value = { this.state.wtcQ7ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ7ActiveIndex } </Text>
                               
                                <Text>8. Present a talk to a group of friends</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ8ActiveIndex) => this.setState({ wtcQ8ActiveIndex })}
                                        value = { this.state.wtcQ8ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ8ActiveIndex } </Text>
                                
                                <Text>9. Talk in a small group of acquaintances.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ9ActiveIndex) => this.setState({ wtcQ9ActiveIndex })}
                                        value = { this.state.wtcQ9ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ9ActiveIndex } </Text>
                               
                                <Text>10. Talk in a large meeting of strangers.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ10ActiveIndex) => this.setState({ wtcQ10ActiveIndex })}
                                        value = { this.state.wtcQ10ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ10ActiveIndex } </Text>
                                
                                <Text>11. Talk in a small group of friends.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ11ActiveIndex) => this.setState({ wtcQ11ActiveIndex })}
                                        value = { this.state.wtcQ11ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ11ActiveIndex } </Text>
                                
                                <Text>12. Present a talk to a group of acquaintances.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ12ActiveIndex) => this.setState({ wtcQ12ActiveIndex })}
                                        value = { this.state.wtcQ12ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ12ActiveIndex } </Text>
                                
                                <Card.Divider/>
                                <Text>Select your preferred WTC Score.</Text>
                                <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#7B1FA2' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(preferredWTCScore) => this.setState({ preferredWTCScore })}
                                        value = { this.state.preferredWTCScore }
                                />
                                <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.preferredWTCScore } </Text>
                                <Button 
                                    title = "Previous"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenPersonalityTestOverlay(true)}
                                />
                                {/* <Button 
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenSelfEfficacyOverlay(true)}
                                /> */}
                                <Button 
                                    title = "Save"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleSignUp()}
                                />
                                <Button 
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleCloseWTCOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay>

                    {/* Self Efficacy Overlay */}
                    {/* <Overlay
                        isVisible = { this.state.signUpOverlaySelfEfficacyVisibility }
                        onBackdropPress = {() => this._handleCloseSelfEfficacyOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard } >Self Efficacy</Card.Title>
                                <Card.Divider/>
                                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Instructions:  {"\n"}</Text>
                                <Text style = {{ marginBottom: 10 }} >
                                    The items comprising this scale assess two aspects of expectancy: expectancy
                                    for success and self-efficacy. Expectancy for success refers to performance
                                    expectations, and relates specifically to task performance. Self-efficacy is a selfappraisal of one's ability to master a task. Self-efficacy includes judgments
                                    about one's ability to accomplish a task as well as one's confidence in one's
                                    skills to perform that task.
                                </Text>
                                <Card.Divider/>
                                <Text>1. I believe I will receive an excellent grade in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ1ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ1FormValidation }
                                </Text>
                                <Card.Divider/>

                                <Text>2. I'm certain I can understand the most difficult material presented in the readings for this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ2ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ2FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>3. I'm confident I can understand the basic concepts taught in this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ3ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ3FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>4. I'm confident I can understand the most complex material presented by the instructor in this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ4ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ4FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>5. I'm confident I can do an excellent job on the assignments and tests in this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ5ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ5FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>6. I expect to do well in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ6ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ6FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>7. I'm certain I can master the skills being taught in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ7ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ7FormValidation }
                                </Text>
                                <Card.Divider/>
                                
                                <Text>8.  Considering the difficulty of this course, the teacher, and my skills, I think I will do well in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    checked = { this.state.selfEfficacyQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ8ActiveIndex: item.title })}
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
                                    { this.state.selfEfficacyQ8FormValidation }
                                </Text>
                                <Card.Divider/>

                                <Button 
                                    title = "Previous"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenWTCOverlay(true)}
                                />
                                <Button 
                                    title = "Save"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleSignUp()}
                                />
                                <Button 
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleCloseSelfEfficacyOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay> */}
                        
                    <Overlay
                        isVisible = { this.state.signInOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseSignInOvelay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            <Card.Title style = { signInPageStyle.signInOverlayCard } >Sign In</Card.Title>
                            <Card.Divider/>
                            <Input 
                                placeholder = "email@address.com"
                                leftIcon = {{ type: "ion-icon", name: "mail", color: "#7B1FA2" }}
                                label = "Email Address"
                                labelStyle = {{ color: "#7B1FA2" }}
                                onChangeText = {(email) => this.setState ({ email })}
                                value = { this.state.email }
                                errorStyle = {{ color: "red" }}
                                errorMessage = { this.state.emailFormValidation }
                            />
                            <Input 
                                placeholder = "Password"
                                leftIcon = {{ type: "font-awesome", name: "lock", color: "#7B1FA2" }}
                                label = "Password"
                                labelStyle = {{ color: "#7B1FA2" }}
                                onChangeText = {(password) => this.setState ({ password })}
                                value = { this.state.password }
                                InputComponent = { TextInput }
                                secureTextEntry = { true }
                                errorStyle = {{ color: "red" }}
                                errorMessage = { this.state.passwordFormValidation }
                            />
                            <Button 
                                title = "Sign In"
                                type = "solid"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleSignIn()}
                            />
                            <Button 
                                title = "Close"
                                type = "solid"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleCloseSignInOvelay()}
                            />
                        </Card>
                    </Overlay>

                    {/* Progress Alert Overlay Visibility */}
                    <Overlay
                        isVisible = { this.state.progressAlertOverlayvisivility }
                        onBackdropPress = {() => this._handleCloseProgressAlertOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            { this._handleProgressAlert() }
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        );
    }
} 

const signInPageStyle = StyleSheet.create({

    signInButton: {
        backgroundColor: "#7B1FA2",
        alignSelf: "center",
        marginTop: "3%",
        paddingHorizontal: "30%",
    },

    signInButtonGroup: {
        marginTop: "20%",
    },

    signInOverlayCard: {
        marginHorizontal: 90,
        color: "#7B1FA2"
    },

    signUpText: {
        color: "#7B1FA2",
        marginLeft: 11,
        fontWeight: "bold",
        fontSize: 16
    },

    signUpCheckBox: {
        color: "#7B1FA2",
        marginBottom: 20
    },

});