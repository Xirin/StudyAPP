import React, { Component } from 'react';

import { 
  Container, 
  Content, 
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
                { title: "start working on the solution immediately." },
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
            wtcQ1ActiveIndex: "",
            wtcQ2ActiveIndex: "",
            wtcQ3ActiveIndex: "",
            wtcQ4ActiveIndex: "",
            wtcQ5ActiveIndex: "",
            wtcQ6ActiveIndex: "",
            wtcQ7ActiveIndex: "",
            wtcQ8ActiveIndex: "",
            wtcQ9ActiveIndex: "",
            wtcQ10ActiveIndex: "",
            wtcQ11ActiveIndex: "",
            wtcQ12ActiveIndex: "",
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
            wtcAnswers: [
                { title: "0" },
                { title: "100" }
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
                firestore()
                    .collection('Users')
                    .doc(auth().currentUser.uid)
                    .set({
                      firstName: this.state.firstName,
                      lastName: this.state.lastName  
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

    render() {
        return (
            <Container>
                <Content>
                    <Avatar
                        rounded
                        size = "xlarge"
                        title = "SM"
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
                        <View>
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
                        </View>
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
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ1ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ1ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>2. Talk with an acquaintance while standing in line.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ2ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ2ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>3. Talk in a large meeting of friends.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ3ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ3ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>4. Talk in a small group of strangers.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ4ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ4ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>5. Talk with a friend while standing In line.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ5ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ5ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>6. Talk in a large meeting of acquaintances.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ6ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ6ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>7. Talk with a stranger while standing in line.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ7ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ7ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>8. Present a talk to a group of friends</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ8ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ8ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>9. Talk in a small group of acquaintances.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ9ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ9ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>10. Talk in a large meeting of strangers.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ10ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ10ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>11. Talk in a small group of friends.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ11ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ11ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }
                                <Text>12. Present a talk to a group of acquaintances.</Text>
                                {
                                    this.state.wtcAnswers.map((item, index) => {
                                        return (
                                            <View key = { index }>
                                                <CheckBox
                                                    title = { item.title }
                                                    checked = { this.state.wtcQ12ActiveIndex === item.title }
                                                    onPress = {() => this.setState({ wtcQ12ActiveIndex: item.title })}
                                                />
                                            </View>
                                        )
                                    })
                                }

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

});