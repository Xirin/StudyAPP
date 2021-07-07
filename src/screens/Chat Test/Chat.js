import React, { useState } from 'react'

import { 
    TouchableOpacity,
    Modal,
    StyleSheet,
    View,
} from "react-native";

import { 
  Container, 
  Content, 
  Card,
  CardItem,
  Icon,
  Button,
  Text,
  Radio,
  Right,
  Left,
  Item,
  Input,
  Label,
} from 'native-base';

import {
    Avatar,
} from 'react-native-elements'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';

export default function Chat() {

    const [ userName, setUsername ]  = useState();
    const [ firstName, setFirstName ] = useState();
    const [ lastName, setLastName ] = useState();
    const [ studyTopicSelected, setStudyTopicSelected ] = useState();
    const [ studyGroupName, setStudyGroupName ] = useState();
    const [ studyGroupListCreating, setStudyGroupListCreating ] = useState([]);
    const [ studyGroupListJoining, setStudyGroupListJoining ] = useState([]);
    // const [ study ]

    return(
        <GiftedChat/>
    )
}

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


        //             this.setState({ messages:  [
        //     {
        //         _id: 1,
        //         text: 'Nice',
        //         createdAt: new Date().getTime(),
        //         system: true
        //     },],
        // })


                        // this.setState({ messages: [
                //     {
                //         _id: messageData._id,
                //         text: messageData.text,
                //         createdAt: messageData.createdAt,
                //         system: messageData.system,
                //         // user: {
                //         //     _id: messageData.user._id,
                //         //     displayName: messageData.user.displayName
                //         // }
                //     },],
                // })
                // console.log(this.state.messageData)


                _handleChatAndVideoCallModalvisivility = (studyGroupName) => {
                    // this.props.navigation.navigate('Chat', {
                    //     studyGroupName: studyGroupName,
                    //     currentUserName: this.state.lastName,
                    //     currentUserID: auth().currentUser.uid
                    // })
            }
            <TouchableOpacity onPress = {() => this._handleGroupNavigation(item.groupName)}></TouchableOpacity>
            