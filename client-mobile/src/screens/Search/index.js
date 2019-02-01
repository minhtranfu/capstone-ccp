import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Header from "../../components/Header";
import { ScrollView } from "react-native-gesture-handler";

class Search extends Component {
  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "never", top: "always" }}
      >
        <Header>
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            minLength={2}
            autoFocus={true}
            returnKeyType={"search"}
            fetchDetails={true}
            styles={{
              textInputContainer: {
                backgroundColor: "rgba(0,0,0,0)",
                borderTopWidth: 0,
                borderBottomWidth: 0
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: "#5d5d5d",
                fontSize: 16
              },
              predefinedPlacesDescription: {
                color: "#1faadb"
              }
            }}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            renderRightButton={() => <Text>Cancel</Text>}
          />
        </Header>
        <ScrollView>
          <Text>currentLocation</Text>
          <Text>Near by</Text>
          <TouchableOpacity>
            <Text>Add new location</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Search;
