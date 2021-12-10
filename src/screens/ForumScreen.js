
import React, { Component } from 'react';

import {
    StyleSheet,
} from 'react-native';

import {
    Container,
    Content,
    Textarea
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
            forumCreateVisbility: false,
            forumTitle: "",
            forumContent: "",
            forumCard: [''],
            searchForumText: "",
            searcForumCollection: [''],
            arrayIntitalizer: [''],
            forumTitleFormValidation: "",
            forumContentFormValidation: "",
        }
    }

    componentDidMount = () => {
        var forumIDArray = [];
        var forumCollection = [];
        firestore()
            .collection("Forum")
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
                                forumContent: snapShot.data().forumContent
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
                    forumContent: this.state.forumContent
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

    render() {
        return (
            
            <Container>
                <Header 
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
                        placeholder = "Search Forum"
                        onChangeText = {this._handleSearchForum}
                        value = { this.state.searchForumText }
                        onClear = { this._handleSearchForumCancel }
                        containerStyle = {{
                            backgroundColor: "#2288DC"
                        }}
                    />

                    {
                        this.state.searcForumCollection == "" ?
                        this.state.forumCard.map((item, index) => {
                            if (this.state.forumCard == "") {
                                return (
                                    <Text h4 style = {{  color: "#2288DC", alignSelf: "center", marginTop: 50 }}>
                                        No available Topics
                                    </Text>
                                )
                            }
                            else {
                                return(
                                    <Card
                                        key = { index }
                                    >
                                        <Card.Title>
                                            { item.forumTitle }
                                        </Card.Title>
                                        <Card.Divider/>
                                        <Text>
                                            { item.forumContent }
                                        </Text>
                                        <Card.Divider/>
                                        <Icon 
                                            type = "fontisto" 
                                            name = "commenting" 
                                            onPress = {() => this._handleForumComment(item.forumTitle, item.forumID)}
                                            iconStyle = {{ alignSelf: "flex-start" }} 
                                        />
                                    </Card>
                                )
                            }
                        }) 
                        :
                        this.state.searcForumCollection.map((item, index) => {
                            return(
                                <Card
                                    key = { index }
                                >
                                    <Card.Title>
                                        { item.forumTitle }
                                    </Card.Title>
                                    <Card.Divider/>
                                    <Text>
                                        { item.forumContent }
                                    </Text>
                                    <Card.Divider/>
                                    <Icon 
                                        type = "fontisto" 
                                        name = "commenting" 
                                        onPress = {() => this._handleForumComment(item.forumTitle, item.forumID)}
                                        iconStyle = {{ alignSelf: "flex-start" }} 
                                    />
                                </Card>
                            )
                        }) 
                        
                        
                    }

                    <Overlay
                        isVisible = { this.state.forumCreateVisbility }
                        onBackdropPress = {() => this._handleCloseForumCreateOverlayVisibility()}
                        overlayStyle = {{ backgroundColor: "#2288DC", padding: 0, paddingBottom: 15 }}
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
                                type = "outline"
                                onPress = {() => this._handleCreateForum()}
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
        color: "#2288DC"
    }

});