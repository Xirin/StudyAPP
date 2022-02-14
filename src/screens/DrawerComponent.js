import React, { Component } from 'react';

import {
    StyleSheet,
} from 'react-native';

import {
    Container,
    Content,
    View,
} from 'native-base'


import {
    Card,
    Text,
    Button,
    Avatar,
} from 'react-native-elements';

import auth, { firebase } from '@react-native-firebase/auth';

export default class DrawerComponent extends Component {

    constructor(props) {
        super(props);
    }

    _handleProfileScreenNavigation = () => {
        this.props.navigation.navigate('Profile')
    }

    _handleStudyPeerScreenNavigation = () => {
        this.props.navigation.navigate("Study Peer")
    }

    _handleUserGroupScreenNavigation = () => {
        this.props.navigation.navigate('User Group')
    }

    _handleForumsScreenNavigation = () => {
        this.props.navigation.navigate('Forums')
    }

    _handleSignOut = () => {
        auth().signOut();
        this.props.navigation.navigate('Sign In');
    }

    render() {
        var logo = require("./assets/logo.jpg");
        
        return (
            <Container>
                <Content>
                    <Card 
                        containerStyle = { drawerComponentStyle.dcCardContainterTitle} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapperTitle} 
                    >
                        <View style = {{ flex: 1, flexDirection: "row", alignSelf: "center" }}>
                            <Avatar
                                source = { logo }
                                rounded
                                size = "small"
                                activeOpacity = { 0.5 }
                                containerStyle = {{ backgroundColor: "#7B1FA2" ,alignSelf: "center", marginBottom: 10 }}
                            >
                            </Avatar>
                            <Card.Title style = { drawerComponentStyle.dcCardWrapperTitle } >
                                StudyMate
                            </Card.Title>
                        </View>
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Profile"
                            titleStyle  = {{ color: "#7B1FA2" }}
                            type = "outline"
                            icon = {{ type: "ion-icon", name: "person", color: "#7B1FA2" }}
                            onPress = {() => this._handleProfileScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Study Peers"
                            titleStyle  = {{ color: "#7B1FA2" }}
                            type = "outline"
                            icon = {{ type: "material-community", name: "account-group", color: "#7B1FA2" }}
                            onPress = {() => this._handleStudyPeerScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Groups"
                            titleStyle  = {{ color: "#7B1FA2" }}
                            type = "outline"
                            icon = {{ type: "ion-icon", name: "people", color: "#7B1FA2" }}
                            onPress = {() => this._handleUserGroupScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button  
                            title = "Forums"
                            titleStyle  = {{ color: "#7B1FA2" }}
                            type = "outline"
                            icon = {{ type: "font-awesome", name: "comments", color: "#7B1FA2" }}
                            onPress = {() => this._handleForumsScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Logout"
                            titleStyle  = {{ color: "#7B1FA2" }}
                            type = "outline"
                            icon = {{ type: "material-community", name: "logout", color: "#7B1FA2" }}
                            onPress = {() => this._handleSignOut()}
                        />
                    </Card>
                </Content>
            </Container>
        );
    }
}

const drawerComponentStyle = StyleSheet.create({

    dcCardContainterTitle: {
        marginTop: 27,
        marginHorizontal: 0,
        paddingBottom: 0,
        backgroundColor: "#fff",
    },
    
    dcCardWrapperTitle: {
        marginTop: 6,
        marginLeft: 10,
        color: "#7B1FA2",
    },

    dcCardContent: {
        margin: 0,
        padding: 0,
        backgroundColor: "#fff",
    },

    dcCardWrapper: {
        marginTop: 10,
    }

});