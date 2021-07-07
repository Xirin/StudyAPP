import React, { Component, useState, useEffect } from 'react';

import {
    LogBox,
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
            currentUserID: this.props.route.params.currentUserID,
            messages: [{
                _id: '',
                text: '',
                createdAt: '',
                user: {
                    _id: '',
                    name: '',
                }
            },],
        }
    }

    componentDidMount = () => {
        this.getMessage();
    }

    getMessage = () => {
        const listnerA = 
        firestore()
            .collection('Groups')
            .doc(this.state.studyGroupName)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapShot) => {
                const mData = querySnapShot.docs.map((doc) => {
                    const firebaseData = doc.data();
                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    }
                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            _id: firebaseData.user._id,
                            name: firebaseData.user.displayName
                        }
                    }
                    
                    return data;
                })

                this.setState({ messages: mData });

            })
            return () => listnerA();
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
                    _id: this.state.currentUserID,
                    displayName: this.state.currentUserName
                }
            });
    }

    render() {
        LogBox.ignoreAllLogs();
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(messages) => this._handleSendMessage(messages)}
                user={{
                    _id: this.state.currentUserID
                }}
            />            
        );
    }

}