import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-navigation";
import { withNavigation } from "react-navigation";

import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

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
        <View style={{ flex: 1 }} />
        <View style={styles.contentWrapper}>
          <View style={styles.circle}>
            <Image
              source={require("../../../assets/images/crane.png")}
              style={styles.image}
            />
          </View>
          <Text style={styles.title}>
            {title || "Your equipment live here"}
          </Text>
          <Text style={styles.text}>
            Sign up or login to access your equipment
          </Text>
          <Button
            wrapperStyle={styles.buttonWrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            text={"Login"}
            onPress={() => navigation.navigate("Account", { isModal: true })}
          />
        </View>
        <View style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  circle: {
    backgroundColor: `${colors.secondaryColor}2A`,
    padding: 45,
    borderRadius: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    marginBottom: 15
  },
  title: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 5
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20
  },
  image: {
    width: 70,
    aspectRatio: 1,
    marginRight: -5
  },
  text: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "400",
    marginBottom: 10
  },
  buttonStyle: {
    backgroundColor: colors.secondaryColor
  },
  buttonWrapperStyle: {
    alignSelf: "stretch",
    paddingHorizontal: 25,
    marginTop: 20
  },
  textStyle: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white"
  }
});

export default withNavigation(RequireLogin);
