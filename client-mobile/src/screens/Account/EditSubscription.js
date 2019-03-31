import React, { Component } from 'react';
import {SafeAreaView} from 'react-navigation';
import { View, Text, StyleSheet } from 'react-native';

class EditSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default EditSubscription;
