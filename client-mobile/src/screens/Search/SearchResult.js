import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";

import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(state => ({
  equipment: state.equipment.equipment
}))
class SearchResult extends Component {
  getSearchResult = equipmentList => {
    const { query, lat, long } = this.props.navigation.state.params;

    const result = equipmentList.filter(item => item.address === query);
    console.log(result);
    return result ? result : equipmentList;
  };

  render() {
    const { equipment } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        {equipment ? (
          <ScrollView>
            {this.getSearchResult(equipment).map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  this.props.navigation.navigate("Detail", { id: item.id })
                }
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SearchResult;
