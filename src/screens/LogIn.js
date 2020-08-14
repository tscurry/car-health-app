import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { firebase } from '../components/FirebaseSetup';
import { Icon, Card, CardItem, Body } from 'native-base';
import * as Google from 'expo-google-app-auth';

class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = ({
            password: '',
            email: '',
        });
    }

    componentDidMount = () => {
        this._isMounted = true;
    }
    
    componentWillUnmount = () => {
        this._isMounted = false;
    }

    passwordReset = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert("Password reset email has been sent")
            },
                (error) => {
                    Alert.alert(error.message)
                });
    }

    emailSignIn = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.navigation.navigate("Home");
            },
                (error) => {
                    Alert.alert(error.message);
                });
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    return true;
                }
            }
        }
        return false;
    }

    onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);

        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();

            if (!this.isUserEqual(googleUser, firebaseUser)) {
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken);

                firebase.auth().signInWithCredential(credential)
                    .catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;
                    });

            } else {
                Alert.alert('User already sign-in');
            }
        }.bind(this));
    }

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                iosClientId: '328724028958-i9a05mia9h77qapslpuh1bmto5nsqihm.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.props.navigation.navigate('Home')
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.head}>Welcome....</Text>
                <Card style={styles.card}>
                    <CardItem style={styles.border}>
                        <Body>
                            <Input
                                containerStyle={{ color: 'white' }}
                                inputStyle={styles.form}
                                placeholder='youremail@address.com'
                                label='E-mail Address'
                                leftIcon={<Icon name='mail' />}
                                onChangeText={(email) => this.setState({ email })}
                                keyb
                            />
                            <Input
                                inputStyle={styles.form}
                                placeholder='Enter Password'
                                label='Password'
                                leftIcon={<Icon name='lock' />}
                                secureTextEntry={true}
                                onChangeText={(password) => this.setState({ password })}
                            />
                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.passwordReset}>
                                <Text style={styles.forgotButton}>Forgot Password?</Text>
                            </TouchableOpacity>
                            <Button
                                title='Log In'
                                type='outline'
                                style={styles.buttonOne}
                                onPress={this.emailSignIn}
                            />
                            <Button
                                style={styles.buttonTwo}
                                title=' Google Sign In'
                                type='outline'
                                onPress={() => this.signInWithGoogleAsync()}
                            />
                        </Body>
                    </CardItem>
                </Card>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")}>
                    <Text style={styles.touchable}>I Don't Have An Account</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'grey'
    },
    forgotButton: {
        marginBottom: 20,
        fontSize: 17,
        fontWeight: 'bold',
    },
    form: {
        marginLeft: 10,
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
        borderColor: 'grey',
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 60,
        borderRadius: 20
    },
    head: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        marginLeft: 25,
        color: 'white'
    },
    buttonOne: {
        width: 305,
        marginBottom: 30,
        marginTop: 15,
        marginLeft: 10,
    },
    touchable: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    border: {
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    buttonTwo: {
        width: 312,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 10,
        marginLeft: 10,
        color: 'white'
    },
});

export default LogIn;