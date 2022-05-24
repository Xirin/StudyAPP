import React, { Component } from 'react';

import {
    StyleSheet,
    RefreshControl,
    View,
} from 'react-native';

import {
    Container,
    Content,
    Textarea
} from 'native-base';

import {
    Header,
    Card,
    Text,
    Input,
    Icon,
    Overlay,
    Button
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
            editReplyOverlayVisibility: false,
            editReply: "",
            editReplyID: "",
            deleteReplyOverlayVisibility: false,
            deleteReplyID: "",
            setRefresh: false,
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

    _handleOpenEditReplyOverlay = (visible, forumReply, forumReplyID) => {
        this.setState({ editReplyOverlayVisibility: visible });
        this.setState({ editReply: forumReply });
        this.setState({ editReplyID: forumReplyID });
    }

    _handleCloseEditReplyOverlay = () => {
        this.setState({ editReplyOverlayVisibility: false });
    }

    _handleEditReply = () => {
        //Edit Reply
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .collection("Comment")
            .doc(this.state.forumCommentID)
            .collection("Reply")
            .doc(this.state.editReplyID)
            .update({
                reply: this.state.editReply
            })

        this._handleCloseEditReplyOverlay();
        this.componentDidMount();
    }

    _handleOpenDeleteReplyOverlay = (visible, forumReplyID) => {
        this.setState({ deleteReplyOverlayVisibility: visible });
        this.setState({ deleteReplyID: forumReplyID });
    }

    _handleCloseDeleteReplyOverlay = () => {
        this.setState({ deleteReplyOverlayVisibility: false })
    }

    _handleDeleteReply = () => {
        //Delete Comment
        firestore()
            .collection("Forum")
            .doc(this.state.forumID)
            .collection("Comment")
            .doc(this.state.forumCommentID)
            .collection("Reply")
            .doc(this.state.deleteReplyID)
            .delete()

        this._handleCloseDeleteReplyOverlay()
        this.componentDidMount()
    }

    _handleRefresh = () => {
        this.setState({ setRefresh: true })
        setTimeout(() => {
            this.setState({ setRefresh: false })
            this.componentDidMount();
        }, 5000)
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
                <Content
                    refreshControl = {
                        <RefreshControl
                            refreshing = { this.state.setRefresh }
                            onRefresh = {() => this._handleRefresh()}
                        />
                    }
                >

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
                                if (item.forumUserID == auth().currentUser.uid) {
                                    return (
                                        <Card 
                                            key = { index }
                                            containerStyle = {{ borderWidth: 2, borderColor: "#7B1FA2", borderRadius: 10 }}
                                        >
                                            <View style = {{ flex: 1, flexDirection: "row", alignSelf: "flex-end" }}>
                                                <Icon
                                                    type = "material-community"
                                                    name = "square-edit-outline"
                                                    iconStyle = {{ fontSize: 30, marginRight: "3%" }}
                                                    color = "#7B1FA2"
                                                    onPress = {() => this._handleOpenEditReplyOverlay(true, item.forumReply, item.forumReplyID)}
                                                />
                                                <Icon
                                                    type = "material-community"
                                                    name = "delete"
                                                    iconStyle = {{ fontSize: 30 }}
                                                    color = "#7B1FA2"
                                                    onPress = {() => this._handleOpenDeleteReplyOverlay(true, item.forumReplyID)}
                                                />
                                            </View>
                                            <Card.Title style = {{ alignSelf: "flex-start" }} >
                                                { item.forumUser }
                                            </Card.Title>
                                            <Text>
                                                { item.forumReply }
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
                            }
                        })
                    }

                     {/* Edit Comment Overlay */}
                     <Overlay
                        isVisible = { this.state.editReplyOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseEditReplyOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            <Card.Title style = {{ color: "#7B1FA2", marginHorizontal: "30%" }} >Edit Comment</Card.Title>
                            <Card.Divider/>
                            <Input
                                placeholder = "Reply"
                                label = "Reply"
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
                                onPress = {() => this._handleEditReply()}
                            />
                            <Button
                                title = "Close"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                onPress = {() => this._handleCloseEditReplyOverlay()}
                            />
                        </Card>
                    </Overlay>

                     {/* Delete Comment Overlay */}
                    <Overlay
                        isVisible = { this.state.deleteReplyOverlayVisibility }
                        onBackdropPress = {() => this._handleCloseDeleteReplyOverlay()}
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
                                onPress = {() => this._handleDeleteReply()}
                            />
                            <Button
                                title = "Close"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                onPress = {() => this._handleCloseDeleteReplyOverlay()}
                            />
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        )
    }
}