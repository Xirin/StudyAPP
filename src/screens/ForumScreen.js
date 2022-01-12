
import React, { Component } from 'react';

import {
    StyleSheet,
} from 'react-native';

import {
    Container,
    Content,
    Textarea,
    View
} from 'native-base';

import {
    Header,
    Icon,
    Overlay,
    Card,
    Input,
    Button,
    Text,
    SearchBar,
} from 'react-native-elements';

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ForumScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            forumCreateVisbility: false,
            forumTitle: "",
            forumContent: "",
            forumCard: [''],
            searchForumText: "",
            searcForumCollection: [''],
            arrayIntitalizer: [''],
            forumTitleFormValidation: "",
            forumContentFormValidation: "",
            forumEditVisibility: false,
            forumDeleteVisibility: false,
            forumEditCollection: [""],
            forumEditCreatorID: "",
            forumEditCreatorName: "",
            forumEditTitle: "",
            forumEditContent: "",
        }
    }

    componentDidMount = () => {
        firestore()
            .collection("Users")
            .doc(auth().currentUser.uid)
            .get()
            .then((snapShot) => {
                this.setState({ userName: snapShot.data().firstName.concat(" ", snapShot.data().lastName) })
            })

        var forumIDArray = [];
        var forumCollection = [];
        firestore()
            .collection("Forum")
            .orderBy("createdAt", "desc")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    forumIDArray.push(doc.id)
                })
            })
            .then(() => {
                for (let index = 0; index < forumIDArray.length; index++) {
                    firestore()
                        .collection("Forum")
                        .doc(forumIDArray[index])
                        .get()
                        .then((snapShot) => {
                            forumCollection.push({
                                forumID: forumIDArray[index],
                                forumTitle: snapShot.data().forumTitle,
                                forumContent: snapShot.data().forumContent,
                                creatorID: snapShot.data().creatorID,
                                creatorName: snapShot.data().creatorName
                            })
                            this.setState({ forumCard: forumCollection })
                        })
                }
            })
    }

    _handleOpenDrawer = () => {
        this.props.navigation.openDrawer();
    } 

    _handleOpenForumCreateOverlayVisibility = () => {
        this.setState({ forumCreateVisbility: !this.state.forumCreateVisbility });
    }

    _handleCloseForumCreateOverlayVisibility = () => {
        this.setState({ forumCreateVisbility: false });
    }

    _handleCreateForum = () => {
        //Form Validation for Create Forum Fields
        var errorCounter = 0;
        if (this.state.forumTitle == "") {
            errorCounter = errorCounter + 1;
            this.setState({ forumTitleFormValidation: "Forum Title is required*" })
        } else {
            this.setState({ forumTitleFormValidation: "" })
        }

        if (this.state.forumContent == "") {
            errorCounter = errorCounter + 1;
            this.setState({ forumContentFormValidation: "Forum Content is required*" })
        } else {
            this.setState({ forumContentFormValidation: "" })
        }
        
        if (errorCounter == 0) {
            //Store the data of the forum in database
            firestore()
                .collection("Forum")
                .doc()
                .set({
                    forumTitle: this.state.forumTitle,
                    forumContent: this.state.forumContent, 
                    createdAt: new Date().getTime(),
                    creatorID: auth().currentUser.uid,
                    creatorName: this.state.userName
                })
        
            this._handleCloseForumCreateOverlayVisibility();
            this.componentDidMount();
        }
    }

    _handleSearchForum = (searchText) => {
        this.setState({ searchForumText: searchText })
        var searchForumIDArray = [];
        var searchForumCollection = [];
        firestore()
            .collection("Forum")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    searchForumIDArray.push(doc.id)
                })
                
            })
            .then(() => {
                for (let index = 0; index < searchForumIDArray.length; index++) {
                    firestore()
                        .collection("Forum")
                        .doc(searchForumIDArray[index])
                        .get()
                        .then((snapShot) => {
                            if(this.state.searchForumText === snapShot.data().forumTitle) {
                                searchForumCollection.push({
                                    forumID: searchForumIDArray[index],
                                    forumTitle: snapShot.data().forumTitle,
                                    forumContent: snapShot.data().forumContent
                                })
                                this.setState({ searcForumCollection: searchForumCollection })
                            }
                        })
                }
            })
    }

    _handleSearchForumCancel = () => {
        this.setState({ searcForumCollection: this.state.arrayIntitalizer })
    }

    _handleForumComment = (forumTitle, forumID) => {
        this.props.navigation.navigate("Forum Topic", {
            forumTopic: forumTitle,
            forumID: forumID
        })
    }

    _handleOpenForumEditOverlay = (visibile, creatorID, creatorName, forumTitle, forumContent) => {
        this.setState({ forumEditVisibility: visibile })
        this.setState({ forumEditCreatorID: creatorID })
        this.setState({ forumEditCreatorName: creatorName })
        this.setState({ forumEditTitle: forumTitle })
        this.setState({ forumEditContent: forumContent })
    }

    _handleCloseForumEditOverlay = () => {
        this.setState({ forumEditVisibility: false })
    }

    _handleEditForum = () => {
        var forumThreadID = "";
        firestore()
            .collection("Forum")
            .where("creatorID", "==", this.state.forumEditCreatorID)
            .where("creatorName", "==", this.state.forumEditCreatorName)
            .where("forumTitle", "==", this.state.forumEditTitle)
            .where("forumContent", "==", this.state.forumEditContent)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    forumThreadID = doc.id
                })
            })
            .then(() => {
                firestore()
                    .collection("Forum")
                    .doc(forumThreadID)
                    .update({
                        forumTitle: this.state.forumEditTitle,
                        forumContent: this.state.forumEditContent
                    })
            })
        
        this._handleCloseForumEditOverlay();
        this.componentDidMount()
    }

    render() {
        return (
            
            <Container>
                <Header 
                    containerStyle = {{ backgroundColor: "#7B1FA2" }}
                    leftComponent = {{ 
                        icon: "menu",
                        color: "#fff",
                        onPress: () => this._handleOpenDrawer(),
                    }}
                    centerComponent = {{
                        text: "Forum",
                        style: {color: "#fff"}
                    }}
                    rightComponent = {{
                        icon: "add",
                        color: "#fff",
                        onPress: () => this._handleOpenForumCreateOverlayVisibility()
                    }}
                />
                <Content>

                    <SearchBar
                        lightTheme
                        placeholder = "Search Forum"
                        onChangeText = {this._handleSearchForum}
                        value = { this.state.searchForumText }
                        onClear = { this._handleSearchForumCancel }
                        containerStyle = {{
                            backgroundColor: "#7B1FA2"
                        }}
                    />

                    {
                        this.state.searcForumCollection == "" ?
                        this.state.forumCard.map((item, index) => {
                            if (this.state.forumCard == "") {
                                return (
                                    <Text h4 style = {{  color: "#7B1FA2", alignSelf: "center", marginTop: 50 }}>
                                        No available Topics
                                    </Text>
                                )
                            }
                            else {
                                if (item.creatorID == auth().currentUser.uid) {
                                    return(
                                        <Card
                                            key = { index }
                                            containerStyle = { forumScreenStyle.fCard }
                                        >   
                                            <View style = {{ flex: 1, flexDirection: "row", alignSelf: "flex-end" }} >
                                                <Icon
                                                    type = "material-community"
                                                    name = "square-edit-outline"
                                                    iconStyle = {{ fontSize: 30, marginRight: "5%" }}
                                                    color = "#7B1FA2"
                                                    onPress = {() => this._handleOpenForumEditOverlay(true, item.creatorID, item.creatorName, item.forumTitle, item.forumContent)}
                                                />
                                                <Icon
                                                    type = "material-community"
                                                    name = "delete"
                                                    iconStyle = {{ fontSize: 30 }}
                                                    color = "#7B1FA2"
                                                />
                                            </View>
                                            <Card.Title>
                                                { item.forumTitle }
                                            </Card.Title>
                                            <Text style = {{ marginBottom: 15, alignSelf: "flex-start" }} >
                                                { item.forumContent }
                                            </Text>
                                            <View style = {{ flex: 1, flexDirection: "row" }} >
                                                <Icon 
                                                    type = "fontisto" 
                                                    name = "commenting" 
                                                    onPress = {() => this._handleForumComment(item.forumTitle, item.forumID)}
                                                    iconStyle = {{ alignSelf: "flex-start" }} 
                                                    color = "#7B1FA2"
                                                />
                                                <Text style = {{ marginLeft: 12 }} >Comment</Text>
                                            </View>
                                        </Card>
                                    )
                                } else {
                                    return(
                                        <Card
                                            key = { index }
                                            containerStyle = { forumScreenStyle.fCard }
                                        >   
                                            <Card.Title>
                                                { item.forumTitle }
                                            </Card.Title>
                                            <Text style = {{ marginBottom: 15, alignSelf: "flex-start" }} >
                                                { item.forumContent }
                                            </Text>
                                            <View style = {{ flex: 1, flexDirection: "row" }} >
                                                <Icon 
                                                    type = "fontisto" 
                                                    name = "commenting" 
                                                    onPress = {() => this._handleForumComment(item.forumTitle, item.forumID)}
                                                    iconStyle = {{ alignSelf: "flex-start" }} 
                                                    color = "#7B1FA2"
                                                />
                                                <Text style = {{ marginLeft: 12 }} >Comment</Text>
                                            </View>
                                        </Card>
                                    )
                                }
                            }
                        }) 
                        :
                        this.state.searcForumCollection.map((item, index) => {
                            return(
                                <Card
                                    key = { index }
                                    containerStyle = { forumScreenStyle.fCard }
                                >
                                    <Card.Title>
                                        { item.forumTitle }
                                    </Card.Title>
                                    <Card.Divider style = {{ borderWidth: 1, borderColor: "#7B1FA2" }} />
                                    <Text style = {{ marginBottom: 15, alignSelf: "center" }} >
                                        { item.forumContent }
                                    </Text>
                                    <Card.Divider style = {{ borderWidth: 1, borderColor: "#7B1FA2" }} />
                                    <View style = {{ flex: 1, flexDirection: "row" }} >
                                            <Icon 
                                                type = "fontisto" 
                                                name = "commenting" 
                                                onPress = {() => this._handleForumComment(item.forumTitle, item.forumID)}
                                                iconStyle = {{ alignSelf: "flex-start" }} 
                                                color = "#7B1FA2"
                                            />
                                            <Text style = {{ marginLeft: 12 }} >Comment</Text>
                                        </View>
                                </Card>
                            )
                        }) 
                    }

                    <Overlay
                        isVisible = { this.state.forumCreateVisbility }
                        onBackdropPress = {() => this._handleCloseForumCreateOverlayVisibility()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            <Card.Title
                                style = { forumScreenStyle.fsOverlayCard }
                            >
                                Create Forum
                            </Card.Title>
                            <Card.Divider/>
                            <Input
                                placeholder = "Title"
                                onChangeText = {(forumTitle) => this.setState({ forumTitle })}
                                value = { this.state.forumTitle }
                                errorStyle = {{ color: "red" }}
                                errorMessage = { this.state.forumTitleFormValidation }
                            />
                            <Input
                                placeholder = "Content"
                                InputComponent = { Textarea }
                                rowSpan = { 5 }
                                onChangeText = {(forumContent) => this.setState({ forumContent })}
                                value = { this.state.forumContent }
                                errorStyle = {{ color: "red" }}
                                errorMessage = { this.state.forumContentFormValidation }
                            />
                            <Button
                                title = "Save"
                                type = "solid"
                                buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                onPress = {() => this._handleCreateForum()}
                            />
                        </Card>
                    </Overlay>

                    <Overlay
                        isVisible = { this.state.forumEditVisibility }
                        onBackdropPress = {() => this._handleCloseForumEditOverlay()}
                        overlayStyle = {{ padding: 0, paddingBottom: 15, borderWidth: 5, borderColor: "#7B1FA2" }}
                    >
                        <Card>
                            <Card.Title
                                style = { forumScreenStyle.fsOverlayCard }
                            >
                                Edit Forum
                            </Card.Title>
                            <Card.Divider/>
                                <Input
                                    placeholder = "Title"
                                    label = "Title"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    onChangeText = {(forumEditTitle) => this.setState({ forumEditTitle })}
                                    value = { this.state.forumEditTitle }
                                />
                                <Input
                                    placeholder = "Content"
                                    label = "Content"
                                    labelStyle = {{ color: "#7B1FA2" }}
                                    InputComponent = { Textarea }
                                    rowSpan = { 5 }
                                    onChangeText = {(forumEditContent) => this.setState({ forumEditContent })}
                                    value = { this.state.forumEditContent }
                                />
                                <Button
                                    title = "Edit"
                                    type = "solid"
                                    buttonStyle = {{ backgroundColor: "#7B1FA2" }}
                                    onPress = {() => this._handleEditForum()}
                                />
                                <Button
                                    title = "Close"
                                    type = "solid"
                                    buttonStyle = {{ backgroundColor: "#7B1FA2", marginTop: "3%" }}
                                    onPress = {() => this._handleCloseForumEditOverlay()}
                                />
                        </Card>
                    </Overlay>
                </Content>
            </Container>
        );
    }
}

const forumScreenStyle  = StyleSheet.create({

    fsOverlayCard: {
        marginHorizontal: 95,
        color: "#7B1FA2"
    },

    fCard: {
        borderWidth: 2,
        borderColor: "#7B1FA2",
        borderRadius: 10
    }

});