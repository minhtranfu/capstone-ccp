import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { Feather } from "@expo/vector-icons";

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
      handleOnChangeText,
      icon,
      placeholder,
      style
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        {renderLeftButton ? renderLeftButton() : null}
        <View
          style={[
            styles.buttonWrapper,
            renderLeftButton ? { marginLeft: 5 } : null,
            renderRightButton ? { marginRight: 5 } : null
          ]}
        >
          <Feather name={icon || "search"} size={16} />
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.setState({ keyword: text });
              handleOnChangeText(text);
            }}
            placeholder={placeholder || "Search"}
            placeholderTextColor={colors.text50}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    paddingVertical: 5
  },
  buttonWrapper: {
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    backgroundColor: "transparent",
    fontSize: fontSize.secondaryText + 1,
    lineHeight: fontSize.secondaryText + 1,
  }
});

export default SearchBar;
