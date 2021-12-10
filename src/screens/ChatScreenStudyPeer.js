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
            documentID: this.props.route.params.documentID,
            otherUserID: this.props.route.params.otherUserID,
            currentUserLastName: this.props.route.params.currentUserLastName,
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
        firestore()
            .collection('Chat')
            .doc(this.state.documentID)
            .collection("Messages")
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
    }

    _handleSendMessage = (messages) => {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));

        var text = messages[0].text;
        firestore()
            .collection('Chat')
            .doc(this.state.documentID)
            .collection("Messages")
            .add({
                text,
                createdAt: new Date().getTime(),
                system: false,
                user: {
                    _id: this.state.currentUserID,
                    displayName: this.state.currentUserLastName
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