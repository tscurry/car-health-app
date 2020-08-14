import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Left, ListItem, Icon, Button, ActionSheet, Root, List, Body, Right } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { firebase, db } from '../components/FirebaseSetup';
import EntryCreation from './EntryCreation';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';

var filter = ['Alphabetically', 'By Earliest Date', 'By Latest Date', 'By Featured', 'Cancel'];

class Receipts extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = ({
            clicked: 'By Featured',
            receiptData: [],
            data: [],
            search: '',
            editRepair: '',
            editMechanic: '',
            editDate: null,
            editImage: null,
            editNumber: 0,
        })
    }

    searchFilter = searchOption => {
        const receiptFilter = this.state.data.filter(item => {
            var repairLowercase = item.jobType.toLowerCase();
            var mechanicLowercase = item.mechanic.toLowerCase();

            var searchLowercase = searchOption.toLowerCase();

            return mechanicLowercase.indexOf(searchLowercase) > -1 || repairLowercase.indexOf(searchLowercase) > -1;
        });
        this._isMounted && this.setState({ receiptData: receiptFilter });
    }

    componentDidMount = () => {
        this._isMounted = true;
        var userID;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                userID = user.uid;
                this.databaseRead(userID);
            }
        })
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    databaseRead = async (uid) => {
        await db.collection('receipts').where('userID', '==', uid)
            .onSnapshot(querySnapshot => {
                var receipts = [];
                querySnapshot.forEach(doc => {
                    receipts.push(doc.data())
                })
                this._isMounted && this.setState({ receiptData: receipts, data: receipts })
            })
    }

    alphabeticallyFilter = async () => {
        const userID = firebase.auth().currentUser.uid
        await db.collection('receipts').where('userID', '==', userID).orderBy('jobType')
            .onSnapshot((querySnapshot) => {
                var rData = [];
                querySnapshot.forEach(doc => {
                    rData.push(doc.data())
                })
                this._isMounted && this.setState({ receiptData: rData, data: rData })
            })
    }

    earliestDateFilter = async () => {
        const userID = firebase.auth().currentUser.uid
        await db.collection('receipts').where('userID', '==', userID).orderBy('date')
            .onSnapshot((querySnapshot) => {
                var rData = [];
                querySnapshot.forEach(doc => {
                    rData.push(doc.data())
                })
                this._isMounted && this.setState({ receiptData: rData, data: rData })
            })
    }

    latestDateFilter = async () => {
        const userID = firebase.auth().currentUser.uid
        await db.collection('receipts').where('userID', '==', userID).orderBy('date', 'desc')
            .onSnapshot((querySnapshot) => {
                var rData = [];
                querySnapshot.forEach(doc => {
                    rData.push(doc.data())
                })
                this._isMounted && this.setState({ receiptData: rData, data: rData })
            })
    }

    receiptCheck = () => {
        return (
            <View style={{ marginTop: 180, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#fff' }}>No Receipts Found</Text>
            </View>
        )
    }

    deleteReceiptData = async (image) => {
        const userID = firebase.auth().currentUser.uid
        await db.collection('receipts').where('imageURL', '==', image).where('userID', '==', userID)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    this._isMounted && doc.ref.delete()
                    console.log('Delete successful')
                })
            })
    }

    renderPost = receipt => {
        return (
            <View style={styles.receiptsView}>
                <List>
                    <ListItem avatar>
                        <Left>
                            <Image source={{ uri: receipt.imageURL }} style={styles.image} />
                        </Left>
                        <Body>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{receipt.jobType}</Text>
                            <Text>Place of Repair: {receipt.mechanic}</Text>
                            <Text>Contact Info: {receipt.mechanicNumber}</Text>
                        </Body>
                        <Right>
                            <Text style={{ alignSelf: 'center' }}>{moment(receipt.date.toDate()).format('DD/MM/YYYY')}</Text>
                            <TouchableOpacity onPress={() => Alert.alert(
                                'Warning',
                                'Are you sure you want to delete this entry?',
                                [
                                    {
                                        text: 'No',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Yes',
                                        style: 'destructive',
                                        onPress: () => this.deleteReceiptData(receipt.imageURL)
                                    }
                                ],
                            )}>
                                <Text style={{ fontSize: 16, color: 'red', marginTop: 25 }}>Delete</Text>
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                </List>
            </View>
        )
    }

    render() {
        return (
            <Root>
                <SafeAreaView style={{ backgroundColor: 'grey', flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: '#fff', borderBottomWidth: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                            <Text style={{ color: '#fff', fontSize: 20, marginLeft: 15 }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.head}>Receipts</Text>
                    </View>
                    <SearchBar
                        containerStyle={styles.container}
                        autoCorrect={false}
                        placeholder='Search'
                        value={this.state.search}
                        onChangeText={(search) => { this.searchFilter(search); this.setState({ search }) }}
                        platform='ios'
                        keyboardType='web-search'
                        cancelButtonProps={{ color: 'white' }}
                    />
                    <ListItem icon style={styles.sorting}>
                        <Left>
                            <Button>
                                <Icon active name='sort' type='MaterialIcons' />
                            </Button>
                            <TouchableOpacity
                                onPress={() =>
                                    ActionSheet.show(
                                        {
                                            title: 'Sorting by',
                                            cancelButtonIndex: 4,
                                            options: filter,
                                        },

                                        buttonIndex => {
                                            this.setState({ clicked: filter[buttonIndex] })

                                            if (this.state.clicked === 'Alphabetically') {
                                                this.alphabeticallyFilter();
                                            }

                                            if (this.state.clicked === 'By Earliest Date') {
                                                this.earliestDateFilter();
                                            }

                                            if (this.state.clicked === 'By Latest Date') {
                                                this.latestDateFilter();
                                            }
                                            if (this.state.clicked === 'Cancel') {
                                                this.setState({ clicked: '' })
                                            }
                                        }
                                    )}
                            >
                                <Text style={styles.filters}>Sort: {this.state.clicked}</Text>
                            </TouchableOpacity>
                        </Left>
                    </ListItem>
                    <FlatList
                        data={this.state.receiptData}
                        keyExtractor={item => Math.floor(Math.random(item) * 9999999).toString(16)}
                        renderItem={({ item }) => this.renderPost(item)}
                        ListEmptyComponent={this.receiptCheck}
                    />
                    <EntryCreation ref={(modal) => this.modalRef = modal}></EntryCreation>
                    <View style={styles.buttonPosition}>
                        <Button
                            large
                            icon
                            rounded
                            style={styles.button}
                            onPress={() => this.modalRef.openModal()}
                        >
                            <Icon name='add' type='MaterialIcons' style={{ fontSize: 35 }} />
                        </Button>
                    </View>
                </SafeAreaView>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        backgroundColor: 'grey',
    },
    head: {
        fontSize: 25,
        color: '#fff',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 120
    },
    filters: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 20
    },
    buttonPosition: {
        marginBottom: 20,
        alignItems: 'flex-end',
        marginRight: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
        borderRadius: 20,
    },
    button: {
        bottom: 0,
        position: 'absolute',
    },
    image: {
        height: 70,
        width: 70,
        marginBottom: 20
    },
    receiptsView: {
        marginLeft: 10,
        marginTop: 15,
        marginRight: 10,
        backgroundColor: '#D3D3D3',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
        borderRadius: 10,
    },
    sorting: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
});

export default Receipts;