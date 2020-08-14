import React from 'react';
import { Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, CardItem, Body, Icon, Button, ListItem, Left, Right } from 'native-base';
import { Avatar } from 'react-native-elements';
import { db, firebase } from '../components/FirebaseSetup';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = ({
            name: '',
            email: '',
        })
    }

    getUser = async (uid) => {
        await db.collection('users')
            .doc(uid)
            .onSnapshot(doc => {
                this._isMounted && this.setState({
                    name: doc.data().displayName,
                    email: doc.data().email
                })
            })
    }

    logOff = () => {
        firebase.auth().signOut()
            .then(() => {
                this.props.navigation.navigate("LogIn");
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    }

    componentDidMount = () => {
        var userID;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                userID = user.uid;
                this.getUser(userID);
            }
        })
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <Text style={styles.head}>Home</Text>
                <Card style={styles.card}>
                    <CardItem style={styles.border}>
                        <Body style={styles.avatar}>
                            <Avatar
                                size='xlarge'
                                rounded
                                source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                            />
                            <Text style={{ color: '#fff', marginTop: 30, fontSize: 25, marginBottom: 10, alignSelf: 'center' }}>{this.state.name}</Text>
                            <Text style={{ fontSize: 15, color: '#fff', alignSelf: 'center' }}>{this.state.email}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <ListItem icon style={styles.list}>
                    <Left>
                        <Button>
                            <Icon active name='information-circle-outline' type='Ionicons' />
                        </Button>
                    </Left>
                    <Body>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <Text style={{ fontSize: 22, color: 'white' }}>Profile</Text>
                        </TouchableOpacity>
                    </Body>
                    <Right>
                        <Icon active name='arrow-forward' />
                    </Right>
                </ListItem>
                <ListItem icon style={styles.list}>
                    <Left>
                        <Button>
                            <Icon active name='receipt' type='FontAwesome5' />
                        </Button>
                    </Left>
                    <Body>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Receipts')}>
                            <Text style={{ fontSize: 22, color: 'white' }}>Receipts</Text>
                        </TouchableOpacity>
                    </Body>
                    <Right>
                        <Icon active name='arrow-forward' />
                    </Right>
                </ListItem>
                <ListItem icon style={styles.list}>
                    <Left>
                        <Button>
                            <Icon active name='logout' type='AntDesign' />
                        </Button>
                    </Left>
                    <Body>
                        <TouchableOpacity onPress={this.logOff}>
                            <Text style={{ fontSize: 22, color: 'white' }}>Sign Out</Text>
                        </TouchableOpacity>
                    </Body>
                    <Right>
                        <Icon active name='arrow-forward' />
                    </Right>
                </ListItem>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'grey',
        flex: 1,
    },
    head: {
        fontSize: 30,
        marginTop: 20,
        color: 'white',
        alignSelf: 'center',
        marginBottom: 20,
    },
    card: {
        height: 280,
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
        backgroundColor: 'grey',
        marginBottom: 120,
        borderRadius: 20
    },
    avatar: {
        alignItems: 'center',
        marginTop: 15,
    },
    border: {
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: 'grey'
    },
    list: {
        marginLeft: 30,
        marginBottom: 20,
        marginRight: 30,
    },
});

export default Home;