
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
        }
    }

    componentDidMount = () => {
        var docIDArray = [];
        var forumCollection = [];
        firestore()
            .collection("Forum")
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    docIDArray.push(doc.id)
                })
            })
            .then(() => {
                for (let index = 0; index < docIDArray.length; index++) {
                    firestore()
                        .collection("Forum")
                        .doc(docIDArray[index])
                        .get()
                        .then((snapShot) => {
                            forumCollection.push({
                                docID: docIDArray[index],
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
                            text: "Search Forum",
                            style: {color: "#fff"}
                        }}
                        rightComponent = {{
                            icon: "add",
                            color: "#fff",
                            onPress: () => this._handleOpenForumCreateOverlayVisibility()
                        }}
                />
                <Content>
                    
                    {
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