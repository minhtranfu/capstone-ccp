import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";
import {
  createNewArticle,
  getAllDebrisServiceTypes,
  removeTypeServices,
  clearTypeServices
} from "../../redux/actions/debris";
import { autoCompleteSearch } from "../../redux/actions/location";

import InputField from "../../components/InputField";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    types: state.debris.debrisTypes,
    loading: state.debris.loading,
    typeServices: state.debris.typeServices
  }),
  dispatch => ({
    fetchGetDebrisType: () => {
      dispatch(getAllDebrisServiceTypes());
    },
    fetchCreateNewArticle: article => {
      dispatch(createNewArticle(article));
    },
    fetchRemoveTypeServices: id => {
      dispatch(removeTypeServices(id));
    },
    fetchClearTypeServices: () => {
      dispatch(clearTypeServices());
    }
  })
)
class AddDebrisArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      title: "",
      servicesType: []
    };
  }

  componentWillUnmount() {
    this.props.fetchClearTypeServices();
  }

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleSubmit = () => {
    const { address, title } = this.state;
    const { typeServices } = this.props;
    const article = {
      title,
      address,
      latitude: 10.001,
      longitude: 106.121313,
      debrisServiceTypes: typeServices.map(item => {
        return { id: item.id };
      })
    };
    if (typeServices && typeServices.length < 1) {
      this._showAlert("You must add services");
    } else {
      this.props.fetchCreateNewArticle(article);
      this.props.navigation.goBack();
    }
  };

  _renderContent = () => {
    const { title, address } = this.state;
    const { typeServices } = this.props;
    console.log("type", typeServices);
    return (
      <View>
        <InputField
          label={"Title"}
          placeholder={"Input your title"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ title: value })}
          value={title}
          returnKeyType={"next"}
        />
        <InputField
          label={"Address"}
          placeholder={"Input your address"}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this.setState({ address: value })}
          value={address}
          returnKeyType={"next"}
        />
        <Text style={styles.text}>Debris services types</Text>
        <View>
          {typeServices !== undefined && typeServices.length > 0
            ? typeServices.map(item => (
                <View style={styles.rowTypeWrapper} key={item.id}>
                  <Text style={styles.text}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => this.props.fetchRemoveTypeServices(item.id)}
                  >
                    <Text style={styles.text}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            : null}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => this.props.navigation.navigate("AddServicesTypes")}
          >
            <Feather name="plus-circle" size={20} />
            <Text style={styles.text}>Add types</Text>
          </TouchableOpacity>
        </View>
        <Button text={"Submit"} onPress={() => this._handleSubmit()} />
      </View>
    );
  };

  render() {
    const { navigation, loading } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Add new article</Text>
        </Header>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          {this._renderContent()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowTypeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default AddDebrisArticle;
