import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Feather } from "@expo/vector-icons";

import colors from "../../../config/colors";
import fontSize from "../../../config/fontSize";

const width = Dimensions.get("window").width;

class AddModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    routeName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { title, routeName, onPress, visible, setModalVisible } = this.props;
    return (
      <View style={{ marginBottom: 20 }}>
        <Modal transparent={true} visible={visible}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: 15
                }}
                onPress={() => {
                  setModalVisible(!visible);
                }}
              >
                <Text style={styles.textDone}>Cancel</Text>
              </TouchableOpacity>
              {this.props.children}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  titleContainer: {
    borderRadius: 5,
    width: width,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  textDone: {
    fontWeight: "500",
    fontSize: fontSize.bodyText,
    color: colors.secondaryColor,
    paddingTop: 15,
    paddingBottom: 15
  },
  divider: {
    backgroundColor: "#D8D8D8",
    height: 1,
    width: width
  }
});

export default AddModal;
