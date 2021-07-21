import React, { Component } from 'react';

import {
    StyleSheet,
    LogBox,
} from 'react-native';

import {
    Container,
    Content,
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
        if (forumComments == "") {
            console.log("Empty") //Kulang pa ni
        } else {
            firestore()
                .collection("Forum")
                .doc(this.state.forumID)
                .collection("Comment")
                .doc()
                .set({
                    user: this.state.userName,
                    comment: forumComments
                })
        }   
        this.setState({ forumComment: this.state.stringInitializer })
        this.componentDidMount();
    }

    _handleReplyComment = (forumReply, forumCommentID) => {
        if(forumReply == "") {
            
        } else {
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
        }
        this.setState({ forumReply: this.state.stringInitializer })
        this.componentDidMount();
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
                                <Card key = { index }>
                                    <Card.Title>
                                        { item.forumTitle }
                                    </Card.Title>
                                    <Card.Divider/>
                                    <Text>
                                        { item.forumContent }
                                    </Text>
                                    <Card.Divider/>
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
                            />
                        }
                    />

                    {
                        this.state.forumCommentCollection == "" ?
                            <Card>
                                <Card.Title>
                                    <Text>No Comments</Text>
                                </Card.Title>
                            </Card>
                        :
                        this.state.forumCommentCollection.map((item, index) => {
                            return(
                                <Card key = { index }>
                                    <Card.FeaturedTitle >                                    
                                        <Text>
                                            { item.user }
                                        </Text>
                                    </Card.FeaturedTitle>
                                    <Card.Title style = {{ alignSelf: "flex-end" }}>
                                        <Icon
                                                type = "evil-icons"
                                                name = "comment"
                                                onPress = {() => this._handleViewReplyComment(item.forumCommentID)}
                                        />
                                        <Text>
                                                { item.replyCounter }
                                        </Text>
                                    </Card.Title>
                                    <Text>
                                        { item.comment }
                                    </Text>
                                    <Card.Divider/>
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
                                            />
                                        }
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