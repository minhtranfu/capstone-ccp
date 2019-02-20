import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { ImagePicker, Permissions } from "expo";

import CustomInput from "../../components/CustomInput";
import Title from "../../components/Title";
import Button from "../../components/Button";
import ParallaxList from "../../components/ParallaxList";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const config = {
  image: "https://ak4.picdn.net/shutterstock/videos/6731134/thumb/1.jpg"
};

class AddIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentImage: config.image
    };
  }

  renderScrollItem = () => {
    return (
      <View>
        <Button buttonStyle={styles.buttonStyle} text={"Add Image"} />
        <Title titleStyle={styles.titleStyle} title={"Name"} />
        <CustomInput placeholder={"Input name"} />
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
          title={"Let's get you ready to post"}
          hasLeft={false}
          hasClose={true}
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
  buttonStyle: {
    backgroundColor: "grey",
    borderRadius: 5,
    height: 100
  },
  titleStyle: {
    fontSize: fontSize.secondaryText
  }
});

export default AddIntro;
