import React, { Component } from 'react';

import {
    StyleSheet,
    LogBox,
} from 'react-native';

import {
    Container,
    Content,
    View
} from 'native-base';

import {
    Header,
    Card,
    Text,
    Input,
    Icon,
} from 'react-native-elements'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ForumTopicScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forumID: this.props.route.params.forumID,
            forumTopic: this.props.route.params.forumTopic,
            forumCollection: [''],
            forumComment: "",
            forumCommentCollection: [''],
            stringInitializer: "",
            userName: "",
            forumReply: "",
            forumCommentFormValidation: "",
            forumReplyFormValidation: "",
        }
    }

    componentDidMount = () => {
        //Fetch Topic Title and Content
        var forumTopicArray = [];
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .get()
            .then((snapShot) => {
                forumTopicArray.push({
                    forumTitle: snapShot.data().forumTitle,
                    forumContent: snapShot.data().forumContent
                })
                this.setState({ forumCollection: forumTopicArray })
            })

        //Fetch Forum Comments
        var forumCommentID = [];
        var forumCommentArray = [];
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .collection("Comment")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    forumCommentID.push(doc.id)
                })
            })
            .then(() => {
                for (let index = 0; index < forumCommentID.length; index++) {
                    firestore()
                        .collection("Forum")
                        .doc(this.state.forumID)
                        .collection("Comment")
                        .doc(forumCommentID[index])
                        .get()
                        .then((commentSnapshot) => {

                            firestore()
                                .collection("Forum")
                                .doc(this.state.forumID)
                                .collection("Comment")
                                .doc(forumCommentID[index])
                                .collection("Reply")
                                .get()
                                .then((replySnapShot) => {
                                    forumCommentArray.push({
                                        forumCommentID: forumCommentID[index],
                                        user: commentSnapshot.data().user,
                                        comment: commentSnapshot.data().comment,
                                        replyCounter: replySnapShot.size,
                                    })
                                    this.setState({ forumCommentCollection: forumCommentArray })
                                })
                        })
                }
            })
        
        //Fetch User
        var fullName = "";
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                fullName = snapshot.data().firstName.concat(" " + snapshot.data().lastName )
                this.setState({ userName: fullName })
            })
    }

    _handleReturn = () => {
        this.props.navigation.navigate("Forums");
    }

    _handleSendComment = (forumComments) => {
        //Form Validation for Forum Comment Field
        var errorCounter = 0;
        if (this.state.forumComment == "") {
            errorCounter = errorCounter + 1;
            this.setState({ forumCommentFormValidation: "This field is required*" })
        } else {
            this.setState({ forumCommentFormValidation: "" })
        }

        if (errorCounter == 0) {
            //Store the Forum Comment to the database
            firestore()
                .collection("Forum")
                .doc(this.state.forumID)
                .collection("Comment")
                .doc()
                .set({
                    user: this.state.userName,
                    comment: forumComments
                })
        
            this.setState({ forumComment: this.state.stringInitializer })
            this.componentDidMount();
        }
    }

    _handleReplyComment = (forumReply, forumCommentID) => {
        //Form Validation for Forum Comment Reply field
        var errorCounter = 0;
        if (this.state.forumReply == "") {
            errorCounter = errorCounter + 1;
            this.setState({ forumReplyFormValidation: "This field is required*" })
        } else {
            this.setState({ forumReplyFormValidation: "" })
        }

        if (errorCounter == 0) {
            //Store Forum Comment Reply to the database
            firestore()
                .collection("Forum")
                .doc(this.state.forumID)
                .collection("Comment")
                .doc(forumCommentID)
                .collection("Reply")
                .doc()
                .set({
                    user: this.state.userName,
                    reply: forumReply
                })
        
            this.setState({ forumReply: this.state.stringInitializer })
            this.componentDidMount();
        }
    }

    _handleViewReplyComment = (forumCommentID) => {
        this.props.navigation.navigate("Forum Reply", {
            forumID: this.state.forumID,
            forumCommentID: forumCommentID,
        });
    }

    render() {
        LogBox.ignoreAllLogs();
        return(
            <Container>
                <Header
                    containerStyle = {{ backgroundColor: "#7B1FA2" }}
                    leftComponent = {{ 
                        icon: "arrow-back",
                        color: "#fff",
                        onPress: () => this._handleReturn(),
                    }}
                />

                <Content>
                    {
                        this.state.forumCollection.map((item, index) => {
                            return(
                                <Card 
                                    key = { index }
                                    containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                >
                                    <Card.Title>
                                        { item.forumTitle }
                                    </Card.Title>
                                    <Text style = {{ alignSelf: "center" }} >
                                        { item.forumContent }
                                    </Text>
                                </Card>
                            )
                        })
                    }
                    <Input
                        placeholder = "Write a Comment"
                        onChangeText = {(forumComment) => this.setState({ forumComment })}
                        value = { this.state.forumComment }
                        rightIcon = {
                            <Icon
                                type = "material"
                                name = "send"
                                onPress = {() => this._handleSendComment(this.state.forumComment)}
                                color = "#7B1FA2"
                            />
                        }
                        errorStyle = {{ color: "red" }}
                        errorMessage = { this.state.forumCommentFormValidation }
                    />

                    {
                        this.state.forumCommentCollection == "" ?
                            <Card containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }} >
                                <Card.Title>
                                    <Text>No Comments</Text>
                                </Card.Title>
                            </Card>
                        :
                        this.state.forumCommentCollection.map((item, index) => {
                            return(
                                <Card 
                                    key = { index }
                                    containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                >
                                    <Card.FeaturedTitle >                                    
                                        <Text>
                                            { item.user }
                                        </Text>
                                    </Card.FeaturedTitle>
                                    <Card.Title style = {{ alignSelf: "flex-end" }} >
                                        <Icon
                                            type = "evil-icons"
                                            name = "comment"
                                            onPress = {() => this._handleViewReplyComment(item.forumCommentID)}
                                            color = "#7B1FA2"
                                        />
                                        <Text> { item.replyCounter } </Text>
                                    </Card.Title>
                                    <Text style = {{ marginBottom: 15, fontSize: 15, alignSelf: "flex-start" }} > { item.comment } </Text>
                                    <Text>
                                        Reply
                                    </Text>
                                    <Input
                                        onChangeText = {(forumReply) => this.setState({ forumReply })}
                                        value = { this.state.forumReply }
                                        placeholder = "Write a Reply"
                                        rightIcon = {
                                            <Icon
                                                type = "material"
                                                name = "send"
                                                onPress = {() => this._handleReplyComment(this.state.forumReply, item.forumCommentID)}
                                                color = "#7B1FA2"
                                            />
                                        }
                                        errorStyle = {{ color: "red" }}
                                        errorMessage = { this.state.forumReplyFormValidation }
                                    />
                                </Card>
                            )
                        })
                    }
                </Content>
            </Container>
        )
    }
}