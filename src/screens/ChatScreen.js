import React, { Component, useState, useEffect } from 'react';

import {
    LogBox
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default class ChatScreen extends Component {

    constructor (props) {
        super (props);
        this.state = {
            currentUserName: this.props.route.params.currentUserName,
            studyGroupName: this.props.route.params.studyGroupName,
            messages: [''],
            setMessages: ['']
        }
    }

    componentDidMount = () => { 
        
        var messages = [];
        var firebaseData = [];
        var messageData = [];
        firestore()
            .collection('Groups')
            .doc(this.state.studyGroupName)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapShot) => {
                messages = querySnapShot.docs.map((doc) => {
                    firebaseData = doc.data();
                    messageData = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    }
                    // if (!firebaseData.system) {
                    //     messageData.user = {
                    //         ...firebaseData.user,
                    //         _id: firebaseData.user._id,
                    //         name: firebaseData.user.displayName
                    //     }
                    // }
                })
                this.setState({ messages: [
                    {
                        _id: messageData._id,
                        text: messageData.text,
                        createdAt: messageData.createdAt,
                        system: messageData.system,
                        // user: {
                        //     _id: messageData.user._id,
                        //     displayName: messageData.user.displayName
                        // }
                    },],
                })
                // console.log(this.state.messages)
            })
        
        // this.setState({ messages:  [
        //     {
        //         _id: 1,
        //         text: 'Nice',
        //         createdAt: new Date().getTime(),
        //         system: true
        //     },],
        // })
    }

    _handleSendMessage = (messages) => {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));

        var text = messages[0].text;
        firestore()
            .collection('Groups')
            .doc(this.state.studyGroupName)
            .collection('Messages')
            .add({
                text,
                createdAt: new Date().getTime(),
                system: false,
                user: {
                    _id: auth().currentUser.uid,
                    displayName: this.state.currentUserName
                }
            })
            // .then(() => {
            //     firestore()
            //         .collection('Groups')
            //         .doc(this.state.studyGroupName)
            //         .set({
            //             latestMeassage: {
            //                 text,
            //                 createdAt: new Date().getTime()
            //             }
            //         }, { merge: true })
            // })
    }

    render() {
        LogBox.ignoreAllLogs();
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(messages) => this._handleSendMessage(messages)}
                user={{
                    _id: auth().currentUser.uid
                }}
            />
        );
    }

}