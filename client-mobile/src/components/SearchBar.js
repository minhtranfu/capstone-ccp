import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      keyword: ""
    };
  }

  render() {
    const { keyword } = this.state;
    const {
      onPress,
      renderRightButton,
      renderLeftButton,
      clearButtonMode,
      onSubmitEditing,
      handleOnChangeText
    } = this.props;

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.textInputContainer}>
          {renderLeftButton ? renderLeftButton() : null}
          <View
            style={[
              styles.buttonWrapper,
              renderLeftButton ? { marginLeft: 5 } : null,
              renderRightButton ? { marginRight: 5 } : null
            ]}
          >
            <Ionicons name="ios-search" size={20} />
            <TextInput
              style={styles.input}
              onChangeText={text => {
                this.setState({ keyword: text });
                handleOnChangeText(text);
              }}
              placeholder="Search"
              placeholderTextColor={colors.secondaryColorOpacity}
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode={
                clearButtonMode ? clearButtonMode : "while-editing"
              }
              onSubmitEditing={onSubmitEditing}
            />
          </View>
          {renderRightButton ? renderRightButton() : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    marginHorizontal: 15
  },
  textInputContainer: {
    height: 32,
    flexDirection: "row",
    alignItems: "center"
  },
  buttonWrapper: {
    flex: 1,
    backgroundColor: "#00000023",
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5
  },
  input: {
    flex: 1,
    height: 32,
    paddingLeft: 5,
    backgroundColor: "transparent",
    color: colors.secondaryColor,
    fontSize: fontSize.bodyText
  }
});

export default SearchBar;
