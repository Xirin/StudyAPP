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
            signUpOverlayVisiblility: false,
            signInOverlayVisibility: false,

            //Personality Test Variables
            signUpOverlayPersonalityTestVisibility: false,
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
            signUpOverlayLearningStylesVisibility: false,
            learningStylesQ1ActiveIndex: "",
            learningStylesQ2ActiveIndex: "",
            learningStylesQ3ActiveIndex: "",
            learningStylesQ4ActiveIndex: "",
            learningStylesQ5ActiveIndex: "",
            learningStylesQ6ActiveIndex: "",
            learningStylesQ7ActiveIndex: "",
            learningStylesQ8ActiveIndex: "",
            learningStylesQ9ActiveIndex: "",
            learningStylesQ10ActiveIndex: "",
            learningStylesQ11ActiveIndex: "",
            learningStylesQ12ActiveIndex: "",
            learningStylesQ13ActiveIndex: "",
            learningStylesQ14ActiveIndex: "",
            learningStylesQ15ActiveIndex: "",
            learningStylesQ16ActiveIndex: "",
            learningStylesQ17ActiveIndex: "",
            learningStylesQ18ActiveIndex: "",
            learningStylesQ19ActiveIndex: "",
            learningStylesQ20ActiveIndex: "",
            learningStylesQ21ActiveIndex: "",
            learningStylesQ22ActiveIndex: "",
            learningStylesQuestions: [
                "1.) I understand something better after I",
                "2.) When I am learning something new, it helps me to",
                "3.) In a study group working on difficult material, I am more likely to",
                "4.) In classes I have taken",
                "5.) When I start a homework problem, I am more likely to",
                "6.) I prefer to study",
                "7.) I would rather first",
                "8.) I more easily remember",
                "9.) When I have to work on a group project, I first want to) ",
                "10.) I am more likely to be considered",
                "11.) The idea of doing homework in groups, with one grade for the entire group",
                "12.) I tend to",
                "13.) Once I understand",
                "14.) When I solve maths problems",
                "15.) When I'm analysing a story or a novel",
                "16.) It is more important to me that an instructor",
                "17.) I learn",
                "18.) When considering a body of information, I am more likely to",
                "19.) When writing a paper, I am more likely to",
                "20.) When I am learning a new subject, I prefer to",
                "21.) .Some teachers start their lectures with an outline of what they will cover. Such outlines are",
                "22.) When solving problems in a group, I would be more likely to",
            ],
            learningStyleAnswersQ1: [
                { title: "(a) try it out." },
                { title: "(b) think it through." }
            ],
            learningStyleAnswersQ2: [
                { title: "(a) talk about it." },
                { title: "(b) think about it. " }
            ],
            learningStyleAnswersQ3: [
                { title: "(a) jump in and contribute ideas." },
                { title: "(b) sit back and listen." }
            ],
            learningStyleAnswersQ4: [
                { title: "(a) I have usually got to know many of the students." },
                { title: "(b) I have rarely got to know many of the students." }
            ],
            learningStyleAnswersQ5: [
                { title: "(a) start working on the solution immediately." },
                { title: "(b) try to fully understand the problem first." }
            ],
            learningStyleAnswersQ6: [
                { title: "(a) in a group." },
                { title: "(b) alone." }
            ],
            learningStyleAnswersQ7: [
                { title: "(a) try things out." },
                { title: "(b) think about how I'm going to do it." }
            ],
            learningStyleAnswersQ8: [
                { title: "(a) something I have done." },
                { title: "(b) something I have thought a lot about." }
            ],
            learningStyleAnswersQ9: [
                { title: "(a) have a \"group brainstorming\" where everyone contributes ideas." },
                { title: "(b) brainstorm individually and then come together as a group to compare ideas." }
            ],
            learningStyleAnswersQ10: [
                { title: "(a) outgoing." },
                { title: "(b) reserved." }
            ],
            learningStyleAnswersQ11: [
                { title: "(a) appeals to me." },
                { title: "(b) does not appeal to me." }
            ],
            learningStyleAnswersQ12: [
                { title: "(a) understand details of a subject but may be fuzzy about its overall structure." },
                { title: "(b) understand the overall structure but may be fuzzy about details." }
            ],
            learningStyleAnswersQ13: [
                { title: "(a) all the parts, I understand the whole thing." },
                { title: "(b) the whole thing, I see how the parts fit." }
            ],
            learningStyleAnswersQ14: [
                { title: "(a) I usually work my way to the solutions one step at a time." },
                { title: "(b) I often just see the solutions but then have to struggle to figure out the steps to get to them." }
            ],
            learningStyleAnswersQ15: [
                { title: "(a) I think of the incidents and try to put them together to figure out the themes." },
                { title: "(b) I just know what the themes are when I finish reading and then I have to go back and find the incidents that demonstrate them." }
            ],
            learningStyleAnswersQ16: [
                { title: "(a) lay out the material in clear sequential steps." },
                { title: "(b) give me an overall picture and relate the material to other subjects." }
            ],
            learningStyleAnswersQ17: [
                { title: "(a) at a fairly regular pace. If I study hard, I'll \"get it.\"" },
                { title: "(b) in fits and starts. I'll be totally confused and then suddenly it all \"clicks.\"" }
            ],
            learningStyleAnswersQ18: [
                { title: "(a) focus on details and miss the big picture." },
                { title: "(b) try to understand the big picture before getting into the details." }
            ],
            learningStyleAnswersQ19: [
                { title: "(a) work on (think about or write) the beginning of the paper and progress forward." },
                { title: "(b) work on (think about or write) different parts of the paper and then order them." }
            ],
            learningStyleAnswersQ20: [
                { title: "(a) stay focused on that subject, learning as much about it as I can." },
                { title: "(b) try to make connections between that subject and related subjects." }
            ],
            learningStyleAnswersQ21: [
                { title: "(a) somewhat helpful to me." },
                { title: "(b) very helpful to me." }
            ],
            learningStyleAnswersQ22: [
                { title: "(a) think of the steps in the solution process." },
                { title: "(b) think of possible consequences or applications of the solution in a wide range of areas. " }
            ],

            //Willingness to Communicate Variables
            signUpOverlayWTCVisibility: false,
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
            signUpOverlaySelfEfficacyVisibility: false,
            selfEfficacyQ1ActiveIndex: "",
            selfEfficacyQ2ActiveIndex: "",
            selfEfficacyQ3ActiveIndex: "",
            selfEfficacyQ4ActiveIndex: "",
            selfEfficacyQ5ActiveIndex: "",
            selfEfficacyQ6ActiveIndex: "",
            selfEfficacyQ7ActiveIndex: "",
            selfEfficacyQ8ActiveIndex: "",
            selfEfficacyQuestions: [
                "1. I believe I will receive an excellent grade in this class.",
                "2. I'm certain I can understand the most difficult material presented in the readings for this course.",
                "3. I'm confident I can understand the basic concepts taught in this course.",
                "4. I'm confident I can understand the most complex material presented by the instructor in this course.",
                "5. I'm confident I can do an excellent job on the assignments and tests in this course.",
                "6. I expect to do well in this class.",
                "7. I'm certain I can master the skills being taught in this class.",
                "8.  Considering the difficulty of this course, the teacher, and my skills, I think I will do well in this class."
            ],
            selfEfficacyAnswers: [
                { title: "Very True of Me" },
                { title: "True of Me" },
                { title: "Somewhat True of Me" },
                { title: "Neutral" },
                { title: "Somewhat Not True of Me" },
                { title: "Not True of Me" },
                { title: "Not Very True of Me" },
            ],

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
                    }
                    
                    else if (errorCode === 'auth/user-not-found') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                    }

                    else if (errorCode === 'auth/wrong-password') {
                        this.setState({ email: '' });
                        this.setState({ password: '' });
                    }

                    else {
                        this._handleCloseSignInOvelay();
                        this.props.navigation.navigate('Profile');
                    }
                });
    }

    _handleSignUp = () => {
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
                        personalityReverseScores[index] = 5;
                    }
                    else if (personalityAnswerReversedScored[index] === "Disagree a Little") {
                        personalityReverseScores[index] = 4;
                    }
                    else if (personalityAnswerReversedScored[index] === "Neither Agree nor Disagree") {
                        personalityReverseScores[index] = 3
                    }
                     else if (personalityAnswerReversedScored[index] === "Agree a Little") {
                        personalityReverseScores[index] = 2;
                    }
                    else if (personalityAnswerReversedScored[index] === "Agree Strongly") {
                        personalityReverseScores[index] = 1;
                    }

                    //Normal Scored
                    if (personalityAnswerNormalScored[index] === "Disagree Strongly") {
                        personalityNormalScores[index] = 1;
                    }
                    else if (personalityAnswerNormalScored[index] === "Disagree a Little") {
                        personalityNormalScores[index] = 2;
                    }
                    else if (personalityAnswerNormalScored[index] === "Neither Agree nor Disagree") {
                        personalityNormalScores[index] = 3;
                    }
                    else if (personalityAnswerNormalScored[index] === "Agree a Little") {
                        personalityNormalScores[index] = 4;
                    }
                    else if (personalityAnswerNormalScored[index] === "Agree Strongly") {
                        personalityNormalScores[index] = 5;
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

                //Learning Styles Score Computation
                var lsActiveReflectiveAnswers = [
                    this.state.learningStylesQ1ActiveIndex,
                    this.state.learningStylesQ2ActiveIndex,
                    this.state.learningStylesQ3ActiveIndex,
                    this.state.learningStylesQ4ActiveIndex,
                    this.state.learningStylesQ5ActiveIndex,
                    this.state.learningStylesQ6ActiveIndex,
                    this.state.learningStylesQ7ActiveIndex,
                    this.state.learningStylesQ8ActiveIndex,
                    this.state.learningStylesQ9ActiveIndex,
                    this.state.learningStylesQ10ActiveIndex,
                    this.state.learningStylesQ11ActiveIndex,
                ];

                var lsSequentialGlobalAnswers = [
                    this.state.learningStylesQ12ActiveIndex,
                    this.state.learningStylesQ13ActiveIndex,
                    this.state.learningStylesQ14ActiveIndex,
                    this.state.learningStylesQ15ActiveIndex,
                    this.state.learningStylesQ16ActiveIndex,
                    this.state.learningStylesQ17ActiveIndex,
                    this.state.learningStylesQ18ActiveIndex,
                    this.state.learningStylesQ19ActiveIndex,
                    this.state.learningStylesQ20ActiveIndex,
                    this.state.learningStylesQ21ActiveIndex,
                    this.state.learningStylesQ22ActiveIndex,
                ];

                var lsActiveScore = 0;
                var lsReflectiveScore = 0;
                var lsSequentialScore = 0;
                var lsGlobalScore = 0;
                var learningStyleScoreAR = 0;
                var learningStylesScoreSG = 0;

                for (var index = 0; index < lsActiveReflectiveAnswers.length; index++) {

                    //Adding all Scores Active or Global
                    if (lsActiveReflectiveAnswers[index].charAt(1) === "a" ) {
                        lsActiveScore = lsActiveScore + 1;
                    }
                    else if (lsActiveReflectiveAnswers[index].charAt(1) === "b") {
                        lsReflectiveScore = lsReflectiveScore + 1;
                    }

                    //Adding all Scores Sequential or Global
                    if (lsSequentialGlobalAnswers[index].charAt(1) === "a") {
                        lsSequentialScore = lsSequentialScore + 1;
                    }
                    else if (lsSequentialGlobalAnswers[index].charAt(1) === "b") {
                        lsGlobalScore = lsGlobalScore + 1;
                    }
                }

                //Computing if User is Reflective of Active Learner
                if (lsActiveScore > lsReflectiveScore) {
                    learningStyleScoreAR = lsActiveScore - lsReflectiveScore + "A";
                }
                else if (lsReflectiveScore > lsActiveScore) {
                    learningStyleScoreAR = lsReflectiveScore - lsActiveScore + "B";
                }

                //Computing if User is Sequential or Global Learner
                if (lsSequentialScore > lsGlobalScore) {
                    learningStylesScoreSG = lsSequentialScore - lsGlobalScore + "A";
                }
                else if (lsGlobalScore > lsSequentialScore) {
                    learningStylesScoreSG = lsGlobalScore - lsSequentialScore + "B";
                }

                //Self Efficacy Score Computation
                var seQuestionsSum = 0;
                var seQuestionsCounter = 0;
                var seQuestionsArrayCounter = [];
                var seQuestionsSDStep1 = [];
                var seQuestionsSDStep2 = 0;
                var seQuestionsCCStep1 = [];
                var seQuestionsVariance = 0;
                var seAnswerScores = 0;
                var seAnswerCounter = 0;
                var seAnswersScoresArrayCounter = [];
                var seAnswersSDStep1 = [];
                var seAnswersSDStep2 = 0;
                var seAnswersCCStep1 = [];
                var seAnswers = [
                    this.state.selfEfficacyQ1ActiveIndex,
                    this.state.selfEfficacyQ2ActiveIndex,
                    this.state.selfEfficacyQ3ActiveIndex,
                    this.state.selfEfficacyQ4ActiveIndex,
                    this.state.selfEfficacyQ5ActiveIndex,
                    this.state.selfEfficacyQ6ActiveIndex,
                    this.state.selfEfficacyQ7ActiveIndex,
                    this.state.selfEfficacyQ8ActiveIndex,
                ];
                var seCCStep2 = [];
                var seCorrelationCoefficientStep1 = 0;
                var seCorrelationCoefficientStep2 = 0;
                
                //Getting Mean for Quesitions in Self Efficacy
                for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                    seQuestionsSum = seQuestionsSum + parseInt(this.state.selfEfficacyQuestions[index].charAt(0));
                    seQuestionsCounter = seQuestionsCounter + 1;
                    seQuestionsArrayCounter[index] = index + 1;
                }

                //Setting Score Value of Answers in Self Efficacy
                for (var index = 0; index < seAnswers.length; index++) {

                    seAnswerCounter = seAnswerCounter + 1;

                    if (seAnswers[index] === "Not Very True of Me") {
                        seAnswerScores = seAnswerScores + 1;
                        seAnswersScoresArrayCounter[index] = 1;
                    }
                    else if (seAnswers[index] === "Not True of Me") {
                        seAnswerScores = seAnswerScores + 2;
                        seAnswersScoresArrayCounter[index] = 2;
                    }
                    else if (seAnswers[index] === "Somewhat Not True of Me") {
                        seAnswerScores = seAnswerScores + 3;
                        seAnswersScoresArrayCounter[index] = 3;
                    }
                    else if (seAnswers[index] === "Neutral") {
                        seAnswerScores = seAnswerScores + 4;
                        seAnswersScoresArrayCounter[index] = 4;
                    }
                    else if (seAnswers[index] === "Somewhat True of Me") {
                        seAnswerScores = seAnswerScores + 5;
                        seAnswersScoresArrayCounter[index] = 5;
                    }
                    else if (seAnswers[index] === "True of Me") {
                        seAnswerScores = seAnswerScores + 6;
                        seAnswersScoresArrayCounter[index] = 6;
                    }
                    else if (seAnswers[index] === "Very True of Me") {
                        seAnswerScores = seAnswerScores + 7;
                        seAnswersScoresArrayCounter[index] = 7;
                    }
                }

                //Getting Mean for Questions And Answers
                var seQuestionsMean = seQuestionsSum / seQuestionsCounter;
                var seAnswersMean = seAnswerScores / seAnswerCounter;

                //Getting Standard Deviation and Correlation Coefficiency for Self Efficacy Questions STEP 1
                for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                    seQuestionsSDStep1[index] = Math.pow(seQuestionsArrayCounter[index] - seQuestionsMean, 2);
                    seQuestionsCCStep1[index] = seQuestionsArrayCounter[index] - seQuestionsMean;
                }
                //Getting Standard Deviation and Correlation Coefficiency for Self Efficacy Questions STEP 2
                for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                    seQuestionsSDStep2 = seQuestionsSDStep2 + seQuestionsSDStep1[index];
                }
                //Getting Variance for Self Efficacy
                seQuestionsVariance = seQuestionsSDStep2 / (seQuestionsCounter - 1);

                //Getting Standard Deviation and Correlation Coefficient for Self Efficacy Answer Scores STEP 1
                for (var index = 0; index < seAnswers.length; index++) {
                    seAnswersSDStep1[index] = Math.pow(seAnswersScoresArrayCounter[index] - seAnswersMean, 2);
                    seAnswersCCStep1[index] = seAnswersScoresArrayCounter[index] - seAnswersMean;
                }
                
                //Getting Standard Deviation and Correlation Coefficient for Self Efficacy Answer Scores STEP 2
                for (var index = 0; index < seAnswers.length; index++) {
                    seAnswersSDStep2 = seAnswersSDStep2 + seAnswersSDStep1[index];
                }

                //Getting Correlation Coefficiency for Questions and Answer Scores Self Efficacy STEP 2
                for (var index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                    seCCStep2[index] = seQuestionsCCStep1[index] * seAnswersCCStep1[index];
                }

                //Getting Correlation Coefficient for Self Efficacy STEP 2
                for (var index = 0; index < seCCStep2.length; index++) {
                    seCorrelationCoefficientStep1 = seCCStep2.reduce((a, b) => a + b, 0);
                }
                seCorrelationCoefficientStep2 = Math.sqrt((seQuestionsSDStep2 * seAnswersSDStep2));

                //Getting Standard Deviation and Self Efficacy Score
                var seStandardDevation = Math.sqrt(seQuestionsVariance); 
                var selfEfficacyScore = seCorrelationCoefficientStep1 / seCorrelationCoefficientStep2;

                firestore()
                    .collection('Users')
                    .doc(auth().currentUser.uid)
                    .set({
                        firstName: this.state.firstName,
                        lastName: this.state.lastName, 
                        age: this.state.age,
                        sex: this.state.sex,
                        PersonalityScore: personalityTotalScore,
                        WTCScore: wtcTotalScore,
                        LearningStyleScore1: learningStyleScoreAR,
                        LearningStyleScore2: learningStylesScoreSG,
                        SelfEfficacy: selfEfficacyScore,
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
            .then(() => {
                var learningStylesAnswers = [
                    this.state.learningStylesQ1ActiveIndex,
                    this.state.learningStylesQ2ActiveIndex,
                    this.state.learningStylesQ3ActiveIndex,
                    this.state.learningStylesQ4ActiveIndex,
                    this.state.learningStylesQ5ActiveIndex,
                    this.state.learningStylesQ6ActiveIndex,
                    this.state.learningStylesQ7ActiveIndex,
                    this.state.learningStylesQ8ActiveIndex,
                    this.state.learningStylesQ9ActiveIndex,
                    this.state.learningStylesQ10ActiveIndex,
                    this.state.learningStylesQ11ActiveIndex,
                    this.state.learningStylesQ12ActiveIndex,
                    this.state.learningStylesQ13ActiveIndex,
                    this.state.learningStylesQ14ActiveIndex,
                    this.state.learningStylesQ15ActiveIndex,
                    this.state.learningStylesQ16ActiveIndex,
                    this.state.learningStylesQ17ActiveIndex,
                    this.state.learningStylesQ18ActiveIndex,
                    this.state.learningStylesQ19ActiveIndex,
                    this.state.learningStylesQ20ActiveIndex,
                    this.state.learningStylesQ21ActiveIndex,
                    this.state.learningStylesQ22ActiveIndex,
                ];
                for (let index = 0; index < this.state.learningStylesQuestions.length; index++) {
                    firestore()
                        .collection("Users")
                        .doc(auth().currentUser.uid)
                        .collection("Learning Styles Test")
                        .doc(this.state.learningStylesQuestions[index])
                        .set({
                            answer: learningStylesAnswers[index],
                        })
                }
            })
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
            .then(() => {
                var selfEfficacyAnswers = [
                    this.state.selfEfficacyQ1ActiveIndex,
                    this.state.selfEfficacyQ2ActiveIndex,
                    this.state.selfEfficacyQ3ActiveIndex,
                    this.state.selfEfficacyQ4ActiveIndex,
                    this.state.selfEfficacyQ5ActiveIndex,
                    this.state.selfEfficacyQ6ActiveIndex,
                    this.state.selfEfficacyQ7ActiveIndex,
                    this.state.selfEfficacyQ8ActiveIndex,
                ];
                for (let index = 0; index < this.state.selfEfficacyQuestions.length; index++) {
                    firestore()
                        .collection("Users")
                        .doc(auth().currentUser.uid)
                        .collection("Self Efficacy Test")
                        .doc(this.state.selfEfficacyQuestions[index])
                        .set({
                            answer: selfEfficacyAnswers[index],
                        })
                }
            });
        this.setState ({ signUpOverlayVisiblility: false });
        this.setState ({ signUpOverlayPersonalityTestVisibility: false })
        this.setState ({ signUpOverlayLearningStylesVisibility: false })
        this.setState ({ signUpOverlayWTCVisibility: false })
        this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
    }
    //Personal Information Overlay Triggers
    _handleOpenSignUpOverlay = (visible) => {
        this.setState ({ signUpOverlayVisiblility: visible });
        this.setState ({ signUpOverlayPersonalityTestVisibility: false })
        this.setState ({ signUpOverlayLearningStylesVisibility: false })
        this.setState ({ signUpOverlayWTCVisibility: false })
        this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
    }

    _handleCloseSignUpOverlay = () => {
        this.setState ({ signUpOverlayVisiblility: !this.state.signUpOverlayVisiblility });
    }

    //Personality Test Overlay Triggers
    _handleOpenPersonalityTestOverlay = (visible) => {
        this.setState ({ signUpOverlayPersonalityTestVisibility: visible })
        this.setState ({ signUpOverlayVisiblility: false });
        this.setState ({ signUpOverlayLearningStylesVisibility: false })
        this.setState ({ signUpOverlayWTCVisibility: false })
        this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
    }

    _handleClosePersonalityTestOverlay = () => {
        this.setState ({ signUpOverlayPersonalityTestVisibility: !this.state.signUpOverlayPersonalityTestVisibility })
        
    }

    //Learning Styles Overlay Triggers
    _handleOpenLearningStylesOverlay = (visible) => {
        this.setState ({ signUpOverlayLearningStylesVisibility: visible })
        this.setState ({ signUpOverlayVisiblility: false });
        this.setState ({ signUpOverlayPersonalityTestVisibility: false })
        this.setState ({ signUpOverlayWTCVisibility: false })
        this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
    }

    _handleCloseLearningStylesOverlay = () => {
        this.setState ({ signUpOverlayLearningStylesVisibility: !this.state.signUpOverlayLearningStylesVisibility })
    }

    //Willingness to Communicate Overlay Triggers
    _handleOpenWTCOverlay = (visible) => {
        this.setState ({ signUpOverlayWTCVisibility: visible })
        this.setState ({ signUpOverlayVisiblility: false });
        this.setState ({ signUpOverlayPersonalityTestVisibility: false })
        this.setState ({ signUpOverlayLearningStylesVisibility: false })
        this.setState ({ signUpOverlaySelfEfficacyVisibility: false })
        
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


    render() {
        var logo = require("./assets/StudymateLogo.png");
        const sexList = [
            { sex: "Male" },
            { sex: "Female" }
        ]
        return (
            <Container>
                <Content>
                    <Avatar
                        source = { logo }
                        rounded
                        size = "xlarge"
                        activeOpacity = { 0.5 }
                        containerStyle = {{ backgroundColor: "#2288DC" ,alignSelf: "center", marginTop: 120 }}
                    >
                    </Avatar>

                    <View style = { signInPageStyle.signInButtonGroup }>
                        <Button 
                            title = "Sign In"
                            type = "outline"
                            buttonStyle = { signInPageStyle.signInButton }
                            onPress = {() => this._handleOpenSignInOvelay(true)}
                        />
                        <Button 
                            title = "Sign Up"
                            type = "outline"
                            buttonStyle = { signInPageStyle.signInButton }
                            onPress = {()  => this._handleOpenSignUpOverlay(true)}
                        />
                    </View>

                    {/*Personal Information Oerlay*/}
                    <Overlay
                        isVisible = { this.state.signUpOverlayVisiblility }
                        onBackdropPress = {() => this._handleCloseSignUpOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard }>Sign Up</Card.Title>
                                <Card.Divider/>
                                <Input 
                                    placeholder = "First Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-f-box", color: "#2288DC" }}
                                    label = "First Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(firstName) => this.setState ({ firstName })}
                                    value = { this.state.firstName }
                                />
                                <Input 
                                    placeholder = "Last Name"
                                    leftIcon = {{ type: "material-community", name: "alpha-l-box", color: "#2288DC" }}
                                    label = "Last Name"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(lastName) => this.setState ({ lastName })}
                                    value = { this.state.lastName }
                                />
                                <Input 
                                    keyboardType = "number-pad"
                                    placeholder = "Age"
                                    leftIcon = {{ type: "material-community", name: "counter", color: "#2288DC" }}
                                    label = "Age"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(age) => this.setState ({ age })}
                                    value = { this.state.age }
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
                                                        textStyle = {{ color: "#2288DC" }}
                                                        title = { item.sex }
                                                        checked = { this.state.sex === item.sex }
                                                        onPress = {() => this.setState({ sex: item.sex })}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <Input 
                                    placeholder = "email@address.com"
                                    leftIcon = {{ type: "ion-icon", name: "mail", color: "#2288DC" }}
                                    label = "Email Address"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(email) => this.setState ({ email })}
                                    value = { this.state.email }
                                />
                                <Input 
                                    placeholder = "Password"
                                    leftIcon = {{ type: "font-awesome", name: "lock", color: "#2288DC" }}
                                    label = "Password"
                                    labelStyle = {{ color: "#2288DC" }}
                                    onChangeText = {(password) => this.setState ({ password })}
                                    value = { this.state.password }
                                    InputComponent = { TextInput }
                                    secureTextEntry = { true }
                                />
                                <Button
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenPersonalityTestOverlay(true)}
                                />
                                <Button 
                                    title = "Close"
                                    type = "outline"
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
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard }>
                                    Personality Test
                                </Card.Title>
                                <Card.Divider/>
                                <Text>1. I see myself as someone who is Reserved </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ1ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>2. I see myself as someone who is generally Trusting </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ2ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>3. I see myself as someone who is tends to be Lazy </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ3ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>4. I see myself as someone who is Relaxed, Handles stress well </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ4ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>5. I see myself as someone who has few Artistic Interests</Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ5ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>6. I see myself as someone who is Outgioing, Sociable </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ6ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>7. I see myself as someone who tends to Find fault with Others </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ7ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>8. I see myself as someone who does a Thorough job </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ8ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>9. I see myself as someone who gets Nervous Easily </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ9ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ9ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>10. I see myself as someone who has an Active Imagination </Text>
                                {
                                    this.state.personalityTestAnswers.map((item, index) => {
                                        return(
                                            <View key = { index }>
                                                <CheckBox 
                                                    title = { item.title }
                                                    checked = { this.state.personalityTestQ10ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ personalityTestQ10ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                
                                <Button 
                                    title = "Previous"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenSignUpOverlay(true)}
                                />
                                <Button 
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenLearningStylesOverlay(true)}
                                />
                                <Button 
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleClosePersonalityTestOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay>

                    {/*Learning Styles Overlay*/}
                    <Overlay
                        isVisible = { this.state.signUpOverlayLearningStylesVisibility }
                        onBackdropPress = {() => this._handleCloseLearningStylesOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard } >Learning Styles Test</Card.Title>
                                <Card.Divider/>
                                <Text>1. I understand something better after I...</Text>
                                {
                                    this.state.learningStyleAnswersQ1.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ1ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>2. When I am learning something new, it helps me to</Text>
                                {
                                    this.state.learningStyleAnswersQ2.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ2ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>3. In a study group working on difficult material, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ3.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ3ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>4. In classes I have taken</Text>
                                {
                                    this.state.learningStyleAnswersQ4.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ4ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>5. When I start a homework problem, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ5.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ5ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>6. I prefer to study</Text>
                                {
                                    this.state.learningStyleAnswersQ6.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ6ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>7. I would rather first</Text>
                                {
                                    this.state.learningStyleAnswersQ7.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ7ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>8. I more easily remember</Text>
                                {
                                    this.state.learningStyleAnswersQ8.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ8ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>9. When I have to work on a group project, I first want to</Text>
                                {
                                    this.state.learningStyleAnswersQ9.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ9ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ9ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>10. I am more likely to be considered</Text>
                                {
                                    this.state.learningStyleAnswersQ10.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ10ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ10ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>11. The idea of doing homework in groups, with one grade for the entire group</Text>
                                {
                                    this.state.learningStyleAnswersQ11.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ11ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ11ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>12. I tend to</Text>
                                {
                                    this.state.learningStyleAnswersQ12.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ12ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ12ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>13. Once I understand</Text>
                                {
                                    this.state.learningStyleAnswersQ13.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ13ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ13ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>14. When I solve maths problems</Text>
                                {
                                    this.state.learningStyleAnswersQ14.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ14ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ14ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>15. When I'm analysing a story or a novel</Text>
                                {
                                    this.state.learningStyleAnswersQ15.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ15ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ15ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>16. It is more important to me that an instructor</Text>
                                {
                                    this.state.learningStyleAnswersQ16.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ16ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ16ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>17. I learn</Text>
                                {
                                    this.state.learningStyleAnswersQ17.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ17ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ17ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>18. When considering a body of information, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ18.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ18ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ18ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>19. When writing a paper, I am more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ19.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ19ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ19ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>20. When I am learning a new subject, I prefer to</Text>
                                {
                                    this.state.learningStyleAnswersQ20.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ20ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ20ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>21. Some teachers start their lectures with an outline of what they will cover. Such outlines are </Text>
                                {
                                    this.state.learningStyleAnswersQ21.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ21ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ21ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>22. When solving problems in a group, I would be more likely to</Text>
                                {
                                    this.state.learningStyleAnswersQ22.map((item, index) => {
                                        return (
                                            <View key  = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.learningStylesQ22ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ learningStylesQ22ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }

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
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleCloseLearningStylesOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay>

                    {/* Willingness to Communicate Overlay */}
                    <Overlay
                        isVisible = { this.state.signUpOverlayWTCVisibility }
                        onBackdropPress = {() => this._handleCloseWTCOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard } >Willingness to Communicate</Card.Title>
                                <Card.Divider/>
                                
                                <Text>1. Present a talk to a group of strangers.</Text>
                                    <Slider
                                        trackStyle={{ height: 20, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
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
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: '#2288DC' }}
                                        minimumValue = {0}
                                        maximumValue = {100}
                                        step = {1}
                                        onValueChange = {(wtcQ12ActiveIndex) => this.setState({ wtcQ12ActiveIndex })}
                                        value = { this.state.wtcQ12ActiveIndex }
                                    />
                                    <Text style = {{ alignSelf: "center", marginBottom: 10 }} >Rating: { this.state.wtcQ12ActiveIndex } </Text>
                                

                                <Button 
                                    title = "Previous"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenLearningStylesOverlay(true)}
                                />
                                <Button 
                                    title = "Next"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleOpenSelfEfficacyOverlay(true)}
                                />
                                <Button 
                                    title = "Close"
                                    type = "outline"
                                    buttonStyle = { signInPageStyle.signInButton }
                                    onPress = {() => this._handleCloseWTCOverlay()}
                                />
                            </Card>
                        </ScrollView>
                    </Overlay>

                    {/* Self Efficacy Overlay */}
                    <Overlay
                        isVisible = { this.state.signUpOverlaySelfEfficacyVisibility }
                        onBackdropPress = {() => this._handleCloseSelfEfficacyOverlay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <ScrollView>
                            <Card>
                                <Card.Title style = { signInPageStyle.signInOverlayCard } >Self Efficacy</Card.Title>
                                <Card.Divider/>
                                <Text>1. I believe I will receive an excellent grade in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ1ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>2. I'm certain I can understand the most difficult material presented in the readings for this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ2ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>3. I'm confident I can understand the basic concepts taught in this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ3ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>4. I'm confident I can understand the most complex material presented by the instructor in this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ4ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>5. I'm confident I can do an excellent job on the assignments and tests in this course.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ5ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>6. I expect to do well in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ6ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>7. I'm certain I can master the skills being taught in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ7ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>8.  Considering the difficulty of this course, the teacher, and my skills, I think I will do well in this class.</Text>
                                {
                                    this.state.selfEfficacyAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }> 
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.selfEfficacyQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ selfEfficacyQ8ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }

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
                    </Overlay>
                        
                    <Overlay
                        isVisible = { this.state.signInOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseSignInOvelay()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
                    >
                        <Card>
                            <Card.Title style = { signInPageStyle.signInOverlayCard } >Sign In</Card.Title>
                            <Card.Divider/>
                            <Input 
                                placeholder = "email@address.com"
                                leftIcon = {{ type: "ion-icon", name: "mail", color: "#2288DC" }}
                                label = "Email Address"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(email) => this.setState ({ email })}
                                value = { this.state.email }
                            />
                            <Input 
                                placeholder = "Password"
                                leftIcon = {{ type: "font-awesome", name: "lock", color: "#2288DC" }}
                                label = "Password"
                                labelStyle = {{ color: "#2288DC" }}
                                onChangeText = {(password) => this.setState ({ password })}
                                value = { this.state.password }
                                InputComponent = { TextInput }
                                secureTextEntry = { true }
                            />
                            <Button 
                                title = "Sign In"
                                type = "outline"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleSignIn()}
                            />
                            <Button 
                                title = "Close"
                                type = "outline"
                                buttonStyle = { signInPageStyle.signInButton }
                                onPress = {() => this._handleCloseSignInOvelay()}
                            />
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        );
    }
} 

const signInPageStyle = StyleSheet.create({

    signInButton: {
        alignSelf: "center",
        marginTop: 10,
        paddingHorizontal: 100,
    },

    signInButtonGroup: {
        marginTop: 150,
    },

    signInOverlayCard: {
        marginHorizontal: 100,
        color: "#2288DC"
    },

    signUpText: {
        color: "#2288DC",
        marginLeft: 11,
        fontWeight: "bold",
        fontSize: 16
    },

    signUpCheckBox: {
        color: "#2288DC",
        marginBottom: 20
    },

});