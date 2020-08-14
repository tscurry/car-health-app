import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Modal, Keyboard, Image } from 'react-native';
import { ActionSheet, Root, Form } from 'native-base';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import { firebase, db } from '../components/FirebaseSetup';

class EntryCreation extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.isFormComplete = false;
        this.state = {
            modalVisible: false,
            isDatePickerVisible: false,
            showDate: '',
            image: null,
            clickedTwo: null,
            jobType: '',
            mechanic: '',
            number: '',
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    openModal = () => {
        this._isMounted && this.setState({ modalVisible: true })
    }

    closeModal = () => {
        this._isMounted && this.setState({ modalVisible: false })
    }

    showDatePicker = () => {
        this._isMounted && this.setState({ isDatePickerVisible: true })
        Keyboard.dismiss()
    }

    hideDatePicker = () => {
        this._isMounted && this.setState({ isDatePickerVisible: false })
    }

    handleConfirm = (value) => {
        this._isMounted && this.setState({ showDate: value })
        this.hideDatePicker();
    }

    receiptOption = () => {
        const BUTTONS = ['Take Photo', 'Choose Photo', 'Cancel'];
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: 2,
                title: 'Select Photo of Receipt'
            },
            buttonIndex => {
                this._isMounted && this.setState({ clickedTwo: BUTTONS[buttonIndex] })
                if (this.state.clickedTwo === BUTTONS[0]) {
                    this.cameraPermissionAsync();
                }

                if (this.state.clickedTwo === BUTTONS[1]) {
                    this.cameraRollPermissionAsync();
                }
            }
        )
    }

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this._isMounted && this.setState({ image: result.uri });
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };

    _takeImage = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: true,
            });

            if (!result.cancelled) {
                this._isMounted && this.setState({ image: result.uri })
            }
        } catch (E) {
            console.log(E)
        };
    }

    cameraPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            if (status === 'granted') {
                this._isMounted && this._takeImage();
            }

            else {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    cameraRollPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === 'granted') {
                this._isMounted && this._pickImage();
            }
            else {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    databaseWrite = () => {
        const uid = firebase.auth().currentUser.uid;
        const user = firebase.auth().currentUser.displayName;

        db.collection('receipts').add({
            userID: uid,
            jobType: this.state.jobType,
            mechanic: this.state.mechanic,
            mechanicNumber: this.state.number,
            date: this.state.showDate,
            imageURL: this.state.image
        })
            .then(() => {
                this.clearFields();
                this.closeModal();
                console.log('Receipt uploaded successfully!')
            })

            .catch((error) => {
                console.error('Error uploading info: ', error)
            })
    }

    clearFields = () => {
        this._isMounted && this.setState({ image: null, mechanic: '', number: '', jobType: '', showDate: '' })
        this.closeModal();
    }

    entryComplete = () => {
        const firstPass = (this.state.jobType != '' && this.state.mechanic != '' && this.state.number.length === 10);
        const secondPass = (this.state.showDate != null && this.state.image != null)

        this.isFormComplete = firstPass && secondPass;
    }

    render() {
        return (
            <Root>
                <SafeAreaView style={{ flex: 1 }}>
                    <Modal
                        visible={this.state.modalVisible}
                        animationType='slide'
                        transparent
                    >
                        <SafeAreaView style={styles.modal}>
                            <View style={styles.modalView}>
                                {this.entryComplete()}
                                <TouchableOpacity onPress={this.clearFields}>
                                    <Text style={{ color: '#fff', fontSize: 20, marginLeft: 15 }}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={styles.head}>Entry Creation</Text>
                                <TouchableOpacity onPress={this.databaseWrite} disabled={!this.isFormComplete}>
                                    <Text style={{ color: '#fff', fontSize: 20, marginRight: 15 }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {this.state.image && <Image source={{ uri: this.state.image }} style={styles.image} />}
                                <TextInput
                                    mode='outlined'
                                    onChangeText={(jobType) => this.setState({ jobType })}
                                    label='Type of Repair'
                                    value={this.state.jobType}
                                    style={styles.textInputs}
                                    selectionColor='grey'
                                    theme={{ colors: { primary: 'grey' } }}
                                    autoCorrect={false}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextInput
                                        mode='outlined'
                                        onChangeText={(mechanic) => this.setState({ mechanic })}
                                        label='Place of Repair'
                                        value={this.state.mechanic}
                                        style={{ marginTop: 10, marginLeft: 15, width: 220 }}
                                        selectionColor='black'
                                        theme={{ colors: { primary: 'grey' } }}
                                        autoCorrect={false}
                                    />
                                    <TextInput
                                        mode='outlined'
                                        value={this.state.mechanicNumber}
                                        onChangeText={(number) => this.setState({ number })}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        label='Telephone Number'
                                        style={{ marginTop: 10, width: 150, marginRight: 15 }}
                                        selectionColor='black'
                                        theme={{ colors: { primary: 'grey' } }}
                                        autoCorrect={false}
                                    />
                                </View>
                                <Form onPress={this.showDatePicker}>
                                    <TextInput
                                        mode='outlined'
                                        value={this.state.showDate ? moment(this.state.showDate).format('DD/MM/YYYY') : ''}
                                        onFocus={() => this.showDatePicker()}
                                        onKeyPress={() => this.showDatePicker()}
                                        label='Select Date of Repair'
                                        style={styles.textInputs}
                                        selectionColor='black'
                                        theme={{ colors: { primary: 'grey' } }}
                                        autoCorrect={false}
                                    />
                                </Form>
                                <TouchableOpacity onPress={this.receiptOption}>
                                    <Text style={{ color: 'grey', fontSize: 18, alignSelf: 'center', marginTop: 20 }}>Attach Receipt Photo</Text>
                                </TouchableOpacity>
                            </ScrollView>
                            <View>
                                <DateTimePickerModal
                                    value={this.state.showDate ? new Date(this.state.showDate) : new Date()}
                                    isVisible={this.state.isDatePickerVisible}
                                    mode="date"
                                    onConfirm={this.handleConfirm}
                                    onCancel={this.hideDatePicker}
                                    isDarkModeEnabled={true}
                                />
                            </View>
                        </SafeAreaView>
                    </Modal>
                </SafeAreaView>
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    head: {
        fontSize: 25,
        color: '#fff',
        marginTop: 20,
        marginBottom: 20,
    },
    modal: {
        flex: 1,
        backgroundColor: '#efecf4',
        marginTop: 120,
    },
    modalView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'grey',
        alignItems: 'center',
    },
    textInputs: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        backgroundColor: '#ffff',
    },
    image: {
        marginLeft: 15,
        marginTop: 30,
        height: 200,
        width: 200,
        alignSelf: 'center',
    },
})

export default EntryCreation;