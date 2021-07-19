
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
    FAB,
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
                                docID: forumIDArray[index],
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
        firestore()
            .collection("Forum")
            .doc()
            .set({
                forumTitle: this.state.forumTitle,
                forumContent: this.state.forumContent
            })
        
        this._handleCloseForumCreateOverlayVisibility();
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
                                console.log(this.state.searcForumCollection)
                            }
                        })
                }
            })
    }

    _handleSearchForumCancel = () => {
        this.setState({ searcForumCollection: this.state.arrayIntitalizer })
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
                        // onSubmitEditing = {() => this._handleSearchForum()}
                        value = { this.state.searchForumText }
                        onClear = { this._handleSearchForumCancel }
                        containerStyle = {{
                            backgroundColor: "#2288DC"
                        }}
                    />

                    {
                        this.state.searcForumCollection == "" ?
                        this.state.forumCard.map((item, index) => {
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
                                </Card>
                            )
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
                                </Card>
                            )
                        }) 
                        
                        
                    }

                    {/* {
                        this.state.forumCard.map((item, index) => {
                            return(
                                <Card
                                    key = { index }
                                >
                                    <Card.Title>
                                        { item.forumTitle }
                                    </Card.Title>
                                    <Card.Divider/>
                                <Text>{ item.forumContent }</Text>
                                </Card>
                            )
                        })
                    } */}

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
                            />
                            <Input
                                placeholder = "Content"
                                InputComponent = { Textarea }
                                rowSpan = { 5 }
                                onChangeText = {(forumContent) => this.setState({ forumContent })}
                                value = { this.state.forumContent }
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