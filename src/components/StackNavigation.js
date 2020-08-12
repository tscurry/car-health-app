import React, { useState, useEffect } from 'react';
import Home from '../screens/Home';
import LogIn from '../screens/LogIn';
import SignUp from '../screens/SignUp';
import Receipts from '../screens/Receipts';
import ProfileForm from '../screens/ProfileForm';
import EntryCreation from '../screens/EntryCreation';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { firebaseConfig } from './FirebaseSetup';
import * as firebase from 'firebase';

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const Stack = createStackNavigator();

const AuthListening = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    const WithoutAuth = () => {
        return (
            <Stack.Navigator initialRouteName="LogIn">
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="ProfileForm"
                    component={ProfileForm}
                />
                <Stack.Screen
                    name="Home"
                    options={{ headerShown: false }}
                    component={Home}
                />
            </Stack.Navigator>
        );
    }

    const WithAuth = () => {
        return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    options={{ headerShown: false }}
                    component={Home}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="ProfileForm"
                    component={ProfileForm}
                />
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Receipts"
                    component={Receipts}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='EntryCreation'
                    component={EntryCreation}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        );
    }


    if (initializing) {
        return null;
    }

    if (user) {
        return (
            <WithAuth />
        );
    }

    return (
        <WithoutAuth />
    );
}

const StackNavigation = () => {
    return (
        <NavigationContainer>
            <AuthListening />
        </NavigationContainer>

    );
}

export default StackNavigation;