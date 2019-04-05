import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import {
  addTypeServices,
  removeTypeServices,
  getAllDebrisServiceTypes
} from "../../redux/actions/debris";

import Title from "../../components/Title";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import { ScrollView } from "react-native-gesture-handler";

@connect(
  state => ({
    debrisTypes: state.debris.debrisTypes,
    typeServices: state.debris.typeServices,
    loading: state.debris.loading
  }),
  dispatch => ({
    addTypeServices: data => dispatch(addTypeServices(data)),
    fetchGetTypeSerivces: () => {
      dispatch(getAllDebrisServiceTypes());
    }
  })
)
class AddServicesTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      listType: []
    };
  }

  componentDidMount() {
    this.props.fetchGetTypeSerivces();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      nextProps.typeServices.length > 0 &&
      Object.keys(prevState.listType).length === 0
    ) {
      return {
        listType: nextProps.typeServices
      };
    }
    return null;
  }

  _handleOnChangeText = value => {
    this.setState({ keyword: value });
  };

  _checkItemIsExist = id => {
    return this.state.listType.some(item => item.id === id);
  };

  _handleRemoveItem = id => {
    this.setState({
      listType: this.state.listType.filter(item => item.id !== id)
    });
  };

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleAddItem = item => {
    console.log("add", item);
    this.setState({ listType: [...this.state.listType, item] });
  };

  _renderSelectedItem = item => (
    <View
      key={item.id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Text style={styles.text}>{this._capitalizeLetter(item.name)}</Text>
      <TouchableOpacity onPress={() => this._handleRemoveItem(item.id)}>
        <Image
          source={require("../../../assets/icons/icon_remove.png")}
          resizeMode={"contain"}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
    </View>
  );

  _renderItem = item => (
    <View
      key={item.id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Text style={styles.text}>{this._capitalizeLetter(item.name)}</Text>
      <TouchableOpacity
        onPress={() =>
          this._checkItemIsExist(item.id)
            ? this._handleRemoveItem(item.id)
            : this._handleAddItem(item)
        }
      >
        <Text style={styles.text}>
          {this._checkItemIsExist(item.id) ? (
            <Image
              source={require("../../../assets/icons/icon_remove.png")}
              resizeMode={"contain"}
              style={{ width: 24, height: 24 }}
            />
          ) : (
            <Image
              source={require("../../../assets/icons/icon_add.png")}
              resizeMode={"contain"}
              style={{ width: 24, height: 24 }}
            />
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { debrisTypes, loading, navigation } = this.props;
    const { listType } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.title}>Cancel</Text>
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.addTypeServices(listType);
                this.props.navigation.goBack();
              }}
            >
              <Text style={styles.title}>Done</Text>
            </TouchableOpacity>
          )}
        >
          <Text style={styles.title}>Select your services</Text>
        </Header>
        {!loading ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
            <Title title={"Select your services"} />
            {listType.length > 0 ? (
              listType.map(item => this._renderSelectedItem(item))
            ) : (
              <Text style={styles.text}>List is empty</Text>
            )}
            <View style={styles.divider} />
            <Title title={"Type services"} />
            {debrisTypes.map(item => this._renderItem(item))}
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
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.text
  },
  text: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    marginBottom: 5
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.text25,
    marginVertical: 5
  }
});

export default AddServicesTypes;
