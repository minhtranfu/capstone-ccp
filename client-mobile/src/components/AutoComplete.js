import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import Autocomplete from "react-native-autocomplete-input";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

class AutoComplete extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    data: PropTypes.array
  };
  render() {
    const {
      label,
      onFocus,
      hideResults,
      editable,
      data,
      value,
      onChangeText,
      labelStyle,
      placeholderStyle,
      placeholder,
      placeholderTextColor,
      autoCapitalize,
      renderItem
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          autoCorrect={false}
          onFocus={onFocus}
          autoCapitalize={autoCapitalize}
          style={[styles.placeholder, placeholderStyle]}
        />
        {data && data.length > 0 ? (
          <ScrollView
            style={{
              height: 250,
              backgroundColor: "white"
            }}
            contentContainerStyle={{
              justifyContent: "center"
            }}
          >
            {data.slice(0, 5).map(item => renderItem(item))}
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  label: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    fontWeight: "400",
    marginTop: 5
  },
  placeholder: {
    fontSize: fontSize.bodyText,
    color: colors.text,
    fontWeight: "400",
    marginBottom: 5,
    paddingVertical: 10,
    borderBottomColor: colors.text25,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

export default AutoComplete;
