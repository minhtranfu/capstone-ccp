import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { searchDebris } from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import DebrisSearchItem from "../../components/DebrisSearchItem";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    results: state.debris.listSearch,
    loading: state.debris.loading
  }),
  dispatch => ({
    fetchSearchDebris: data => {
      dispatch(searchDebris(data));
    }
  })
)
class BidResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { data } = this.props.navigation.state.params;
    console.log("h", data);
    this.props.fetchSearchDebris(data);
  }

  _renderContent = () => {
    const { results, navigation } = this.props;
    console.log(results);
    return (
      <View>
        {results.map(item => (
          <DebrisSearchItem
            key={item.id}
            imageUrl={item.thumbnailImage ? item.thumbnailImage.url : ""}
            address={item.address}
            debrisServiceTypes={item.debrisServiceTypes}
            debrisBids={item.debrisBids}
            title={item.title}
            description={item.description}
            onPress={() => navigation.navigate("BidDetail", { id: item.id })}
          />
        ))}
      </View>
    );
  };

  render() {
    const { loading, results } = this.props;
    console.log(results);
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Results</Text>
        </Header>
        {!loading ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
            {results.length > 0 ? this._renderContent() : <Text>No data</Text>}
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
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default BidResult;
