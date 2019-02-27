import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-navigation";
import { withNavigation } from "react-navigation";

import Button from "../../components/Button";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width } = Dimensions.get("window");

class RequireLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation, title } = this.props;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.container}
      >
        <View style={styles.contentWrapper}>
          <Image
            source={require("../../../assets/images/intro.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Login to share your equipment</Text>
          <Button
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            text={"Login"}
            onPress={() => navigation.navigate("Account")}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: fontSize.bodyText,
    color: colors.primaryColor
  },
  contentWrapper: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 260,
    height: 260
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "400",
    marginVertical: 10
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 70,
    marginVertical: 10
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    flex: 1
  },
  textOr: {
    color: "#9B9B9B",
    fontSize: fontSize.xsmall,
    paddingHorizontal: 8
  },
  wrapperStyle: {
    marginTop: 0
  },
  buttonStyle: {
    backgroundColor: colors.lightYellow,
    width: width / 2 + 100
  },
  textStyle: {
    fontSize: fontSize.secondaryText,
    color: colors.dark
  }
});

export default withNavigation(RequireLogin);
