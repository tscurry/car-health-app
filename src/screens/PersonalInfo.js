import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
import { db, firebase } from '../components/FirebaseSetup';

class PersonalInfo extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = ({
            address: {
                name: '',
                phoneNumber: 0,
                email: '',
                street: '',
                additionalInfo: '',
                city: '',
                province: '',
                postalCode: '',
            },

            vehicleInfo: {
                manufacturer: '',
                year: '',
                model: '',
            }
        })
    }

    componentDidMount = () => {
        var userID;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                userID = user.uid;
                this.userInfo(userID);
            }
        })
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    userInfo = async (uid) => {
        await db.collection('users')
            .doc(uid)
            .onSnapshot(doc => {
                this._isMounted && this.setState({
                    name: doc.data().displayName,
                    email: doc.data().email,
                    number: doc.data().telephoneNumber,
                    address: {
                        street: doc.data().address.streetName,
                        additionalInfo: doc.data().address.additionalAddress,
                        city: doc.data().address.city,
                        postalCode: doc.data().address.postalCode,
                        province: doc.data().address.province,
                    },

                    vehicleInfo: {
                        manufacturer: doc.data().vehicle.manufacturer,
                        year: doc.data().vehicle.year,
                        model: doc.data().vehicle.model,
                    }
                })
            })
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: 'grey', flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#fff' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                        <Text style={{ color: '#fff', fontSize: 20, marginLeft: 15 }}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.head}>Profile</Text>
                </View>
                <ScrollView>
                    <Text style={{ color: '#fff', marginTop: 40, fontSize: 40, fontWeight: 'bold', marginLeft: 30 }}>Review Profile</Text>
                    <Card style={styles.card}>
                        <CardItem style={styles.border}>
                            <Body>

                                <Text style={{ fontSize: 30, color: '#fff', fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Personal Information</Text>
                                <Text style={styles.subheadings}>Address</Text>
                                <Text style={styles.data}>{this.state.address.additionalInfo} - {this.state.address.street}</Text>
                                <Text style={styles.data}>{this.state.address.city}, {this.state.address.province}</Text>
                                <Text style={styles.data}>{this.state.address.postalCode}</Text>
                                <Text style={styles.subheadings}>Vehicle Info</Text>
                                <Text style={styles.data}>{this.state.vehicleInfo.manufacturer} {this.state.vehicleInfo.model} {this.state.vehicleInfo.year}</Text>
                                <Text style={styles.subheadings}>Contact Info</Text>
                                <Text style={styles.data}>Email: {this.state.email}</Text>
                                <Text style={styles.data}>Phone Number: {this.state.number}</Text>

                            </Body>
                        </CardItem>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    head: {
        fontSize: 25,
        color: '#fff',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 125,
    },
    card: {
        height: 400,
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
        marginTop: 50,
        borderRadius: 20
    },
    border: {
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: 'grey'
    },
    data: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        marginBottom: 5,
    },
    subheadings: {
        fontSize: 25,
        color: '#fff',
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 10,
        textDecorationLine: 'underline'
    },
})

export default PersonalInfo;