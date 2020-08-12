import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spinner } from 'react-native-spinkit';

export const LoadingSpinner = () => {
    return (
        <View style={styles.container}>
            <Spinner
                color='#007aff'
                size={100}
                isVisible={true}
                type='Pulse'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})