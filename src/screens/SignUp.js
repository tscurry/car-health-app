import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { firebase, db } from '../components/FirebaseSetup';
import { Icon, Card, CardItem, Body } from 'native-base';
import * as Google from 'expo-google-app-auth';

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = ({
            email: '',
            password: '',
            passwordConfirm: '',
        })
    };

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
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
        else {
            return false;
        }
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
                    .then(() => {
                        const userID = firebase.auth().currentUser.uid;
                        const user = firebase.auth().currentUser;

                        user.providerData.forEach((profile) => {
                            this._isMounted && this.setState({
                                fulName: profile.displayName,
                                email: profile.email,
                            })
                        })

                        db.collection('users').doc(userID).set({
                            displayName: this.state.fulName,
                            email: this.state.email,
                        })
                            .then(() => {
                                this.props.navigation.navigate('ProfileForm')
                                console.log('Document written successfully!')
                            })

                            .catch((error) => {
                                console.log('Error adding document', error)
                            })
                    })
                    .catch(function (error) {
                        console.log(error)
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
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    emailSignUp = () => {
        if (this.state.password !== this.state.passwordConfirm) {
            Alert.alert("Passwords do not match")
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                const userID = firebase.auth().currentUser.uid;
                db.collection('users').doc(userID).set({
                    email: this.state.email,
                })
                    .then(() => {
                        this.props.navigation.navigate('ProfileForm')
                        console.log('Document written succesfully!')
                    })

                    .catch((error) => {
                        console.log('Error adding document', error)
                    })
            })

            .catch((error) => {
                Alert.alert(error.message)
            })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.head}>Let's Get Started....</Text>
                <Card style={styles.card}>
                    <CardItem style={styles.border}>
                        <Body>
                            <Input
                                inputStyle={styles.form}
                                placeholder='youremail@address.com'
                                label='E-mail Address'
                                leftIcon={<Icon name='mail' />}
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                            />
                            <Input
                                inputStyle={styles.form}
                                placeholder='Enter Password'
                                label='Password'
                                leftIcon={<Icon name='lock' />}
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                            />
                            <Input
                                inputStyle={styles.form}
                                placeholder='Confirm Password'
                                label='Confirm Password' i
                                leftIcon={<Icon name='lock' />}
                                secureTextEntry={true}
                                value={this.state.passwordConfirm}
                                onChangeText={(passwordConfirm) => this.setState({ passwordConfirm })}
                            />
                            <Button
                                title='Create Account'
                                type='outline'
                                style={styles.buttonOne}
                                onPress={this.emailSignUp}
                            />
                            <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>Or</Text>
                            <Button
                                style={styles.buttonTwo}
                                title=' Create Account with Google'
                                type='outline'
                                onPress={() => this.signInWithGoogleAsync()}
                            />
                        </Body>
                    </CardItem>
                </Card>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("LogIn")}>
                    <Text style={styles.touchable}>I Already Have An Account</Text>
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
    form: {
        marginLeft: 10
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
        marginBottom: 40,
        borderRadius: 20,
        marginTop: 20
    },
    head: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 30,
        marginLeft: 25,
        color: 'white'
    },
    buttonTwo: {
        width: 312,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 10,
        marginLeft: 10,
        color: 'white'
    },
    buttonOne: {
        width: 312,
        marginBottom: 10,
        marginLeft: 10,
    },
    touchable: {
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
});

export default SignUp;