import React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { firebase, db } from '../components/FirebaseSetup';
import { Card, CardItem, Body } from 'native-base';
import { Input } from 'react-native-elements';

class ProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.isFirstFormComplete = false;
        this.isSecondFormComplete = false;
        this._isMounted = false;
        this.state = ({
            addressDisappear: true,
            next: false,
            fullName: '',
            carType: '',
            carManufacturer: '',
            carYear: '',
            teleNumber: '',
            streetName: '',
            additionalAddress: '',
            city: '',
            postalCode: '',
            province: '',
        });
    }

    componentDidMount = () => {
        this._isMounted = true
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    next = () => {
        this._isMounted && this.setState({ addressDisappear: false, next: true })
    }

    databaseWrite = () => {
        const uid = firebase.auth().currentUser.uid;

        db.collection('users').doc(uid).update({
            displayName: this.state.fullName,
            telephoneNumber: this.state.teleNumber,
            address: {
                streetName: this.state.streetName,
                additionalAddress: this.state.additionalAddress,
                city: this.state.city,
                postalCode: this.state.postalCode,
                province: this.state.province

            },
            vehicle: {
                manufacturer: this.state.carManufacturer,
                model: this.state.carType,
                year: this.state.carYear
            }
        })
            .then(() => {
                this.props.navigation.navigate('Home');
                console.log('Vehicles details uploaded successfully!')
            })

            .catch((error) => {
                console.error('Error uploading info: ', error)
            })
    }

    addressForm = () => {
        const passFirst = (this.state.fullName && this.state.streetName && this.state.additionalAddress)
        const passSecond = (this.state.city && this.state.postalCode.length === 6 && this.state.province)

        this.isFirstFormComplete = passFirst && passSecond;

        return (
            <View>
                <Card style={styles.card}>
                    <CardItem style={styles.border}>
                        <Body>
                            <Input
                                inputStyle={styles.form}
                                placeholder='Enter Your Name'
                                label='Name'
                                value={this.state.fullName}
                                onChangeText={(fullName) => this.setState({ fullName })}
                            />
                            <Input
                                placeholder='Street Name'
                                label='Street Address'
                                onChangeText={(streetName) => this.setState({ streetName })}
                                value={this.state.streetName}
                            />
                            <Input
                                placeholder='Apt No / House No'
                                label='Additional Address Line'
                                value={this.state.additionalAddress}
                                onChangeText={(additionalAddress) => this.setState({ additionalAddress })}
                            />
                            <Input
                                placeholder='Enter City'
                                label='City'
                                onChangeText={(city) => this.setState({ city })}
                                value={this.state.city}
                            />
                            <Input
                                placeholder='A1B2C3'
                                label='Postal Code'
                                onChangeText={postalCode => this.setState({ postalCode })}
                                value={this.state.postalCode}
                                maxLength={6}
                            />
                            <Input
                                placeholder='Enter Province'
                                label='Province'
                                onChangeText={(province) => this.setState({ province })}
                                value={this.state.province}
                            />
                        </Body>
                    </CardItem>
                </Card>
                <TouchableOpacity
                    style={styles.buttonOne}
                    onPress={() => this.next()}
                    disabled={!this.isFirstFormComplete}
                >
                   <Text style={(!this.isFirstFormComplete) ? styles.lightGrey : styles.white}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }

    vehicleDetails = () => {
        const firstPass = (this.state.carType != '' && this.state.carYear.length === 4)
        const secondPass = (this.state.carManufacturer != '' && this.state.teleNumber.length === 10)

        this.isSecondFormComplete = firstPass && secondPass;

        return (
            <View>
                <Card style={styles.card}>
                    <CardItem style={styles.border}>
                        <Body>
                            <Input
                                placeholder='(234)-456-7890'
                                label='Phone Number'
                                onChangeText={(teleNumber) => this.setState({ teleNumber })}
                                value={this.state.teleNumber}
                                keyboardType='numeric'
                                maxLength={10}
                            />
                            <Input
                                placeholder='Enter Manufacturer'
                                label='Vehicle Manufacturer'
                                value={this.state.carManufacturer}
                                onChangeText={(carManufacturer) => this.setState({ carManufacturer })}
                            />
                            <Input
                                placeholder='Enter Vehicle Model'
                                label='Vehicle Model'
                                onChangeText={(carType) => this.setState({ carType })}
                                value={this.state.carType}
                            />
                            <Input
                                placeholder='Select Year'
                                label='Vehicle Year'
                                onChangeText={(carYear) => this.setState({ carYear })}
                                value={this.state.carYear}
                                maxLength={4}
                                keyboardType='numeric'
                            />
                        </Body>
                    </CardItem>
                </Card>
                <TouchableOpacity
                    style={styles.buttonOne}
                    onPress={() => this.databaseWrite()}
                    disabled={!this.isSecondFormComplete}
                >
                    <Text style={(!this.isSecondFormComplete) ? styles.lightGrey : styles.white}>Finish</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.head}>Almost There....</Text>
                {this.state.addressDisappear && this.addressForm()}
                {this.state.next && this.vehicleDetails()}
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
    buttonOne: {
        alignItems: 'flex-end',
        marginTop: 30,
        marginRight: 30,
    },
    head: {
        fontWeight: 'bold',
        fontSize: 35,
        marginLeft: 25,
        marginBottom: 30,
        color: 'white'
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
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'grey',
        borderRadius: 20
    },
    border: {
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    lightGrey: {
        color: '#D3D3D3',
        fontSize: 25,
    },
    white: {
        fontSize: 25,
        color: 'white'
    }
});

export default ProfileForm;