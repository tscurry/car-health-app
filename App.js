import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StackNavigation } from './src/components/index';

export default class Main extends Component {
  render() {
    return (
       <StackNavigation />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});