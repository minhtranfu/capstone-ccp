import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import { withNavigation } from "react-navigation";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const Touchable =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;

class Item extends Component {
  //Upper-case letter
  capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const { name, uploaded } = this.props;
    return (
      <Touchable style={styles.container} onPress={this.props.onPress}>
        <View>
          <Image
            source={require("../../../../assets/images/construction.png")}
            resizeMode={"cover"}
            style={styles.image}
          />
          <View style={styles.overlay}>
            <Text style={styles.text}>{this.capitalizeLetter(name)}</Text>
            <Text style={styles.text}>Publish on{uploaded}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginLeft: 15,
    marginBottom: 10
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "column",
    justifyContent: "flex-end",
    borderRadius: 10,
    paddingBottom: 5,
    paddingLeft: 5
  },
  image: {
    width: 275,
    height: 155,
    borderRadius: 10
  },
  text: {
    color: colors.white,
    marginLeft: 10,
    fontSize: fontSize.medium,
    fontWeight: "500"
  },
  icon: {
    width: 15,
    height: 25,
    marginRight: 10
  }
});

export default withNavigation(Item);
