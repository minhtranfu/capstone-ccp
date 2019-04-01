import React, { Component } from "react";
import { Image } from "react-native-expo-image-cache";
import { View, Text, StyleSheet } from "react-native";

import colors from "../../../config/colors";

const mockData = [
  { id: 1, name: "a", price: 10 },
  { id: 2, name: "b", price: 10 },
  { id: 3, name: "c", price: 10 },
  { id: 4, name: "d", price: 10 }
];

class MaterialItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          {mockData.length > 4 ? (
            mockData.map(item => (
              <Image
                uri={uri}
                resizeMode={"cover"}
                style={{ width: 50, height: 50 }}
              />
            ))
          ) : (
            <Image
              uri={uri}
              resizeMode={"cover"}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    ...colors.shadow
  },
  imageWrapper: {
    width: 200,
    height: 200,
    flexWrap: "wrap"
  }
});

export default MaterialItem;
