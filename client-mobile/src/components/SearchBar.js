import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import colors from "../config/colors";

class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      keyword: ""
    };
  }

  render() {
    const { keyword } = this.state;
    const { anonymous } = this.props;

    return (
      <View style={[styles.searchWrapper, this.props.style]}>
        <TouchableOpacity style={styles.buttonWrapper}>
          <Image
            source={{ uri: "https://i.imgur.com/MMJSDpJ.png" }}
            style={styles.image}
          />
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({ keyword: text })}
            placeholder="Search"
            placeholderTextColor={"#FFFFFF4D"}
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() =>
              anonymous
                ? navigationService.navigate("SearchResultScreenWithSignIn", {
                    keyword
                  })
                : navigationService.navigate("SearchResultScreen", { keyword })
            }
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    paddingTop: 3
  },
  searchWrapper: {
    flexDirection: "row",
    backgroundColor: "#00000023",
    borderRadius: 8,
    flex: 1,
    height: 32,
    marginHorizontal: 15,
    paddingHorizontal: 5,
    alignItems: "center"
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 32,
    backgroundColor: "transparent",
    color: colors.white,
    fontSize: 15,
    lineHeight: 32
  },
  image: {
    width: 24,
    height: 16,
    marginRight: 10,
    marginLeft: 5
  }
});

export default SearchBar;
