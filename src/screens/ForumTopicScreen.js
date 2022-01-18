import React, { Component } from 'react';

import {
    StyleSheet,
    LogBox,
} from 'react-native';

import {
    Container,
    Content,
    View,
    Textarea
} from 'native-base';

import {
    Header,
    Card,
    Text,
    Input,
    Icon,
    Overlay,
    Button,
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
            editReplyOverlayVisibility: false,
            editReply: "",
            editReplyID: "",
            deleteReplyOverlayVisibility: false,
            deleteReplyID: "",
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
                                        replierID: commentSnapshot.data().replierID,
                                        replierName: commentSnapshot.data().replierName,
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
                    replierID: auth().currentUser.uid,
                    replierName: this.state.userName,
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
                    replierID: auth().currentUser.uid,
                    replierName: this.state.userName,
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

    _handleOpenEditCommentOverlay = (visible, comment, commentID) => {
        this.setState({ editReplyOverlayVisibility: visible });
        this.setState({ editReply: comment });
        this.setState({ editReplyID: commentID });
    }

    _handleCloseEditCommentOverlay = () => {
        this.setState({ editReplyOverlayVisibility: false });
    }

    _handleEditComment = () => {
        //Edit Comment
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .collection("Comment")
            .doc(this.state.editReplyID)
            .update({
                comment: this.state.editReply
            })

        this._handleCloseEditCommentOverlay();
        this.componentDidMount();
    }

    _handleOpenDeleteCommentOverlay = (visible, commentID) => {
        this.setState({ deleteReplyOverlayVisibility: visible });
        this.setState({ deleteReplyID: commentID });
    }

    _handleCloseDeleteOverlay = () => {
        this.setState({ deleteReplyOverlayVisibility: false })
    }

    _handleDeleteComment = () => {
        //Delete Comment
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .collection("Comment")
            .doc(this.state.deleteReplyID)
            .delete()

        this._handleCloseDeleteOverlay()
        this.componentDidMount()
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
                            if (item.replierID == auth().currentUser.uid) {
                                return(
                                    <Card 
                                        key = { index }
                                        containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                    >
                                        <View style = {{ flex: 1, flexDirection: "row", alignSelf: "flex-end" }} >
                                           <View style = {{ flex: 1, flexDirection: "row", marginBottom: "5%" }} >
                                                <Icon
                                                    type = "material-community"
                                                    name = "comment-text"
                                                    iconStyle = {{ fontSize: 27 }}
                                                    onPress = {() => this._handleViewReplyComment(item.forumCommentID)}
                                                    color = "#7B1FA2"
                                                />
                                                <Text> { item.replyCounter } </Text>
                                           </View>
                                            <Icon
                                                type = "material-community"
                                                name = "square-edit-outline"
                                                iconStyle = {{ fontSize: 30, marginRight: "3%" }}
                                                color = "#7B1FA2"
                                                onPress = {() => this._handleOpenEditCommentOverlay(true, item.comment, item.forumCommentID)}
                                            />
                                            <Icon
                                                type = "material-community"
                                                name = "delete"
                                                iconStyle = {{ fontSize: 30 }}
                                                color = "#7B1FA2"
                                                onPress = {() => this._handleOpenDeleteCommentOverlay(true, item.forumCommentID)}
                                            />
                                        </View>
                                        <Card.FeaturedTitle >                                    
                                            <Text>
                                                { item.replierName }
                                            </Text>
                                        </Card.FeaturedTitle>
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
                            } else {
                                return(
                                    <Card 
                                        key = { index }
                                        containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                    >
                                        <View style = {{ flex: 1, flexDirection: "row", marginBottom: "5%" }} >
                                            <Icon
                                                type = "material-community"
                                                name = "comment-text"
                                                iconStyle = {{ fontSize: 27 }}
                                                onPress = {() => this._handleViewReplyComment(item.forumCommentID)}
                                                color = "#7B1FA2"
                                            />
                                            <Text> { item.replyCounter } </Text>
                                        </View>
                                        <Card.FeaturedTitle >                                    
                                            <Text>
                                                { item.replierName }
                                            </Text>
                                        </Card.FeaturedTitle>
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
                            }
                        })
                    }

                    {/* Edit Comment Overlay */}
                    <Overlay
                        isVisible = { this.state.editReplyOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseEditCommentOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            <Card.Title style = {{ color: "#7B1FA2", marginHorizontal: "30%" }} >Edit Comment</Card.Title>
                            <Card.Divider/>
                            <Input
                                placeholder = "Comment"
                                label = "Comment"
                                labelStyle = {{ color: "#7B1FA2" }}
                                InputComponent = { Textarea }
                                rowSpan = { 5 }
                                onChangeText = {(editReply) => this.setState({ editReply })}
                                value = { this.state.editReply }
                            />
                            <Button
                                title = "Save"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                onPress = {() => this._handleEditComment()}
                            />
                            <Button
                                title = "Close"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                onPress = {() => this._handleCloseEditCommentOverlay()}
                            />
                        </Card>
                    </Overlay>

                    {/* Delete Comment Overlay */}
                    <Overlay
                        isVisible = { this.state.deleteReplyOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseDeleteOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            <Text style = {{ color: "#7B1FA2", fontSize: 25, fontWeight: "bold", textAlign: "center" }} >
                                Do you want to delete this Comment?
                            </Text>
                            <Card.Divider/>
                            <Button
                                title = "Delete"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                onPress = {() => this._handleDeleteComment()}
                            />
                            <Button
                                title = "Close"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                onPress = {() => this._handleCloseDeleteOverlay()}
                            />
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        )
    }
}