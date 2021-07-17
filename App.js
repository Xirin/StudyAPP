import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'

import SignInScreen from './src/screens/SignInScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import PScreen from './src/screens/PScreen';
import UserGroupScreen from './src/screens/UserGroupScreen';
import DrawerComponent from './src/screens/DrawerComponent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <Stack.Navigator screenOptions = {{ headerShown: false }}>
        <Stack.Screen name = "Sign In" component = { SignInScreen } />
        <Stack.Screen name = "Profile" component = { ProfileScreen } />
        <Stack.Screen name = "Chat" component = { ChatScreen } />
        <Stack.Screen name = "Video Call" component = { VideoCallScreen } />
        <Stack.Screen name = "PScreen" component = { PScreen } />
        <Stack.Screen name = "User Group" component = { UserGroupScreen } />
    </Stack.Navigator>
  );
}

export default function AppRouter() {
    return(
        <NavigationContainer>
            <Drawer.Navigator drawerContent = {(props) => <DrawerComponent { ...props } />}>
                <Drawer.Screen name = "Profile" component = { App } />
                <Drawer.Screen name = "User Group" component = { UserGroupScreen } options = {{ unmountOnBlur:true }} />
                <Drawer.Screen name = "Sign in" component = { SignInScreen } options = {{ unmountOnBlur:true }} />
                <Drawer.Screen name = "Forums" component = { ProfileScreen } options = {{ unmountOnBlur:true }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
