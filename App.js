import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions = {{ headerShown: false }}>
        <Stack.Screen name = "Sign In" component = { SignInScreen } />
        <Stack.Screen name = "Sign Up" component = { SignUpScreen } />
        <Stack.Screen name = "Profile" component = { ProfileScreen } />
        <Stack.Screen 
            name = "Chat" 
            component = { ChatScreen } 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;