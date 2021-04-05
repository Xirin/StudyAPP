import React, { Component, useState, useEffect } from 'react';

import {
    ActivityIndicator
} from 'native-base';

import { GiftedChat } from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

var st = "";
class s extends Component {
    constructor(props) {
        super(props);
        st = this.props.route.params.studyGroupName;
        console.log(st)
    }
}
export default function ChatScreen({ route }) {

    const { thread } = useState(props.params.studyGroupName)
    const user = auth().currentUser.toJSON()

    // constructor (props) {
    //     super (props);
    //     var studyGroupName = this.props.route.params.studyGroupName;
    //     this.state = {
    //         studyGroupName: studyGroupName,
    //         messages: [''],
    //     }
    // }
    
    // componentDidMount = () => {
        
    // }

    // render() {
    //     return (
    //         <GiftedChat  />
    //     );
    // }
    console.log(thread)
    
    const [messages, setMessages] =  useState([
        {
            _id: 0,
            text: 'thread created',
            createdAt: new Date().getTime(),
            system: true
        },
        {
            _id: 1,
            text: 'hello!',
            createdAt: new Date().getTime(),
            user: {
              _id: 2,
              name: 'Demo'
            }
        }
    ]);

    async function handleSend(messages) {
        const text = messages[0].text
        firestore()
            .collection('Groups')
            .doc()
            
    }

    // useEffect(() => {
    //     const unsubscribeListener = 
    //         firestore()
    //             .collection('Groups')
    //             .doc(studyGroupName)
    //             .collection('Message Threads')
    //             .orderBy('createdAt', 'desc')
    //             .onSnapshot(querySnapShot => {
    //                 const messages = querySnapShot.docs.map(doc => {
    //                     const firebaseData = doc.data()

    //                     const data = {
    //                         _id: doc.id,
    //                         text: '',
    //                         createdAt: new Date().getTime(),
    //                         ...firebaseData
    //                     }

    //                     if (!firebaseData.system) {
    //                         data.user = {
    //                             ...firebaseData.user,
    //                             name: firebaseData.user.displayName
    //                         }
    //                     }

    //                     return data
    //                 })

    //                 setMessages(messages)
    //             })

    //             return() => unsubscribeListener()
    // })

    return (
        <GiftedChat
            messages={messages}
            onSend={newMessage => handleSend()}
            user={{
                _id: 1
            }}
        />
    )
}
// var messagesDB = [];
        // var messageArray = [];
        // firestore()
        //     .collection('Groups')
        //     .doc(this.state.studyGroupName)
        //     .collection('Message Threads')
        //     .get()
        //     .then((snapShot) => {
        //         snapShot.docs.map(doc => {
        //             messagesDB = doc.data();
        //             messageArray = [{
        //                 text: messagesDB.latestMessage.text,
        //                 createdAt: messagesDB.latestMessage.createdAt,
        //                 user: {
        //                     _id: messagesDB.user._id,
        //                     name: messagesDB.user.displayName
        //                 },
        //                 system: messagesDB.system
        //             }]
        //         })
        //         this.setState({ nice: messageArray });
        //     });