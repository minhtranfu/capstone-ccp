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
    fetchSearchDebris: debrisTypeId => {
      dispatch(searchDebris(debrisTypeId));
    }
  })
)
class BidResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { typeId } = this.props.navigation.state.params;
    this.props.fetchSearchDebris(typeId);
  }

  _renderContent = () => {
    const { results, navigation } = this.props;
    return (
      <View>
        {results.map(item => (
          <DebrisSearchItem
            key={item.id}
            imageUrl={item.debrisImages[0]}
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
    const { loading } = this.props;
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
            {this._renderContent()}
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
