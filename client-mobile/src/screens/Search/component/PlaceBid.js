import React, { Component } from "react";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";

import Header from "../../../components/Header";
import TextArea from "../../../components/TextArea";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

class PlaceBid extends Component {
  static propTypes = {
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      description: ""
    };
  }

  render() {
    const { visible, onPress } = this.props;
    const { price, description } = this.state;
    return (
      <Modal
        animationType={"slide"}
        transparent={transparent}
        visible={visible}
      >
        <SafeAreaView
          forceInset={{ bottom: "always", top: "always" }}
          style={styles.container}
        >
          <Header
            renderLeftButton={() => (
              <TouchableOpacity>
                <Feather name={"x"} size={26} onPress={onLeftButtonPress} />
              </TouchableOpacity>
            )}
          />
          <ScrollView>
            <Text>Place a bid on</Text>
            <Text>{title}</Text>
            <Text>Paid to you</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.inputWrapper}
                onChangeText={value => this.setState({ price: value })}
                value={price}
              />
              <Text> VND </Text>
              <Text>Describe your bid</Text>
              <TextArea
                value={description}
                onChangeText={value => this.setState({ description: value })}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputWrapper: {
    paddingLeft: 10,
    borderColor: "#000000",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400"
  }
});

export default PlaceBid;
