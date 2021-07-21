import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'

import SignInScreen from './src/screens/SignInScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import UserGroupScreen from './src/screens/UserGroupScreen';
import DrawerComponent from './src/screens/DrawerComponent';
import ForumScreen from './src/screens/ForumScreen';
import ForumTopicScreen from './src/screens/ForumTopicScreen';
import ForumReplyScreen from './src/screens/ForumReplyScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <Stack.Navigator screenOptions = {{ headerShown: false }}>
        <Stack.Screen name = "Sign In" component = { SignInScreen } />
        <Stack.Screen name = "Profile" component = { ProfileScreen } />
        <Stack.Screen name = "User Group" component = { UserGroupScreen } />
        <Stack.Screen name = "Forums" component = { ForumScreen }/>
        <Stack.Screen name = "Chat" component = { ChatScreen } />
        <Stack.Screen name = "Video Call" component = { VideoCallScreen } />
        <Stack.Screen name = "Forum Topic" component = { ForumTopicScreen } />
        <Stack.Screen name = "Forum Reply" component = { ForumReplyScreen } />
    </Stack.Navigator>
  );
}

export default function AppRouter() {
    return(
        <NavigationContainer>
            <Drawer.Navigator drawerContent = {(props) => <DrawerComponent { ...props } />}>
                <Drawer.Screen name = "Sign In" component = { SignInScreen } />
                <Drawer.Screen name = "Profile" component = { ProfileScreen } options = {{ unmountOnBlur:true }} />
                <Drawer.Screen name = "User Group" component = { UserGroupScreen } options = {{ unmountOnBlur:true }} />
                <Drawer.Screen name = "Forums" component = { ForumScreen } options = {{ unmountOnBlur:true }} />
                <Drawer.Screen name = "Chat" component = { ChatScreen } />
                <Drawer.Screen name = "Video Call" component = { VideoCallScreen } />
                <Drawer.Screen name = "Forum Topic" component = { ForumTopicScreen } options = {{ unmountOnBlur:true }} />
                <Drawer.Screen name = "Forum Reply" component = { ForumReplyScreen } options = {{ unmountOnBlur:true }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
