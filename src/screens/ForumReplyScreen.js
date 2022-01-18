import React, { Component } from 'react';

import {
    StyleSheet
} from 'react-native';

import {
    Container,
    Content
} from 'native-base';

import {
    Header,
    Card,
    Text,
    Input,
    Icon,
} from 'react-native-elements';

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ForumReplyScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forumID: this.props.route.params.forumID,
            forumCommentID: this.props.route.params.forumCommentID,
            forumFullName: "",
            forumReplyCollection: [''],
            forumReply: "",
            stringInitializer: "",
            forumReplyFormValidation: "",
        }
    }

    componentDidMount = () => {

        var forumReplyID = [];
        var forumReplyCollectionArray = [];
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .collection("Comment")
            .doc(this.state.forumCommentID)
            .collection("Reply")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    forumReplyID.push(doc.id)
                })
            })
            .then(() => {
                for (let index = 0; index < forumReplyID.length; index++) {
                    firestore()
                        .collection("Forum")
                        .doc(this.state.forumID)
                        .collection("Comment")
                        .doc(this.state.forumCommentID)
                        .collection("Reply")
                        .doc(forumReplyID[index])
                        .get()
                        .then((snapShot) => {
                            forumReplyCollectionArray.push({
                                forumReplyID: forumReplyID[index],
                                forumUser: snapShot.data().replierName,
                                forumUserID: snapShot.data().replierID,
                                forumReply: snapShot.data().reply
                            })
                            this.setState({ forumReplyCollection: forumReplyCollectionArray })
                        })
                }
            })

            var fullName = "";
            firestore()
                .collection("Users")
                .doc(auth().currentUser.uid)
                .get()
                .then((snapshot) => {
                    fullName = snapshot.data().firstName.concat(" " + snapshot.data().lastName )
                    this.setState({ forumFullName: fullName })
                })
    }

    _handleReturn = () => {
        this.props.navigation.navigate("Forum Topic")
    }

    _handleSendReply = (forumReply) => {
        //Form Validation for Forum reply field
        var errorCounter = 0;
        if (this.state.forumReply == "") {
            errorCounter = errorCounter + 1;
            this.setState({ forumReplyFormValidation: "This field is required*" })
        } else {
            this.setState({ forumReplyFormValidation: "" })
        }

        if (errorCounter == 0) {
            //Store Forum Reply to the database
            firestore()
                .collection("Forum")
                .doc(this.state.forumID)
                .collection("Comment")
                .doc(this.state.forumCommentID)
                .collection("Reply")
                .doc()
                .set({
                    replierID: auth().currentUser.uid,
                    replierName: this.state.forumFullName,
                    reply: forumReply
                })

            this.setState({ forumReply: this.state.stringInitializer })
            this.componentDidMount();
        }
    }

    render() {
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

                    <Input
                        placeholder = "Add a Reply"
                        onChangeText = {(forumReply) => this.setState({ forumReply })}
                        value = { this.state.forumReply }
                        rightIcon = {
                            <Icon
                                type = "material"
                                name = "send"
                                onPress = {() => this._handleSendReply(this.state.forumReply)}
                                color = "#7B1FA2"
                            />
                        }
                        errorStyle = {{ color: "red" }}
                        errorMessage = { this.state.forumReplyFormValidation }
                    />

                    {
                        this.state.forumReplyCollection.map((item, index) => {
                            if (this.state.forumReplyCollection == "") {
                                return (
                                    <Card 
                                        key = { index }
                                        containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                    >
                                        <Text style = {{ alignSelf: "center" }} >
                                            No Replies
                                        </Text>
                                    </Card>
                                )
                            }
                            else {
                                return (
                                    <Card 
                                        key = { index }
                                        containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                    >
                                        <Card.Title style = {{ alignSelf: "flex-start" }} >
                                            { item.forumUser }
                                        </Card.Title>
                                        <Text>
                                            { item.forumReply }
                                        </Text>
                                    </Card>
                                )
                            }
                        })
                    }
                </Content>
            </Container>
        )
    }
}