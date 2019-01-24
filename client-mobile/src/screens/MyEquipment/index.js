import React, { Component } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-navigation";

import ParallaxList from "../../components/ParallaxList";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class MyEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderScrollItem = () => {
    return (
      <View style={styles.scrollWrapper}>
        <Text>No Data</Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <ParallaxList
          title={"Equipment"}
          opacity={1}
          removeTitle={true}
          hasLeft={false}
          hasAdd={true}
          onPress={() => this.props.navigation.navigate("AddNewEquipment")}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this.renderScrollItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default MyEquipment;
