import React, { Component } from 'react';

import {
    StyleSheet
} from 'react-native';

import {
    Container,
    Content,
} from 'native-base'


import {
    Card,
    Text,
    Button,
} from 'react-native-elements';

import auth, { firebase } from '@react-native-firebase/auth';

export default class DrawerComponent extends Component {

    constructor(props) {
        super(props);
    }

    _handleProfileScreenNavigation = () => {
        this.props.navigation.navigate('Profile')
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
        return (
            <Container>
                <Content>
                    <Card 
                        containerStyle = { drawerComponentStyle.dcCardContainterTitle} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapperTitle} 
                    >
                        <Card.Title style = { drawerComponentStyle.dcCardWrapperTitle } >
                            StudyMate
                        </Card.Title>
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Profile"
                            type = "outline"
                            icon = {{ type: "ion-icon", name: "person", color: "#2288DC" }}
                            onPress = {() => this._handleProfileScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Groups"
                            type = "outline"
                            icon = {{ type: "ion-icon", name: "people", color: "#2288DC" }}
                            onPress = {() => this._handleUserGroupScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button  
                            title = "Forums"
                            type = "outline"
                            icon = {{ type: "font-awesome", name: "comments", color: "#2288DC" }}
                            onPress = {() => this._handleForumsScreenNavigation()}
                        />
                    </Card>
                    <Card
                        containerStyle = { drawerComponentStyle.dcCardContent} 
                        wrapperStyle = {drawerComponentStyle.dcCardWrapper} 
                    >
                        <Button
                            title = "Logout"
                            type = "outline"
                            icon = {{ type: "material-community", name: "logout", color: "#2288DC" }}
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
        margin: 0,
        padding: 0,
        color: "#2288DC",
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