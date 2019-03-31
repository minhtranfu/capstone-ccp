import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import {
  addTypeServices,
  removeTypeServices,
  clearTypeServices,
  editArticle
} from "../../redux/actions/debris";
import Feather from "@expo/vector-icons/Feather";

import AutoComplete from '../../components/AutoComplete';
import Button from "../../components/Button";
import Header from "../../components/Header";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  (state, ownProps) => {
    const { id } = ownProps.navigation.state.params;
    return {
      articleDetail: state.debris.debrisArticles.find(item => item.id === id),
      typeServices: state.debris.typeServices
    };
  },
  dispatch => ({
    addTypeServices: data => dispatch(addTypeServices(data)),
    fetchRemoveTypeServices: id => {
      dispatch(removeTypeServices(id));
    },
    fetchClearTypeServices: () => {
      dispatch(clearTypeServices());
    },
    fetchEditArticle: (articleId, article) => {
      dispatch(editArticle(articleId, article));
    }
  })
)
class MyPostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      title: "",
      address: "",
      debrisServiceTypes: []
    };
  }

  componentDidMount() {
    this.props.addTypeServices(this.props.articleDetail.debrisServiceTypes);
  }

  componentWillUnmount() {
    this.props.fetchClearTypeServices();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.articleDetail !== prevState.data
    ) {
      return {
        data: nextProps.articleDetail
      };
    }
    return null;
  }

  _capitalizeLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleInputChanged = (field, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [field]: value
      }
    });
  };

  _handleSubmitEdit = () => {
    const { data } = this.state;
    const { typeServices } = this.props;
    const article = {
      title: data.title,
      address: data.address,
      latitude: 10.001,
      longitude: 106.121313,
      debrisServiceTypes: typeServices.map(item => {
        return { id: item.id };
      })
    };
    this.props.fetchEditArticle(data.id, article);
    this.props.navigation.goBack();
  };

  _renderContent = () => {
    const { data } = this.state;
    const { typeServices } = this.props;
    return (
      <View>
        <InputField
          label={"Tittle"}
          placeholder={"Input your title"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("title", value)}
          value={data.title}
          returnKeyType={"next"}
        />
        <InputField
          label={"Address"}
          placeholder={"Input your address"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChanged("address", value)}
          value={data.address}
          returnKeyType={"next"}
        />
        <Text style={styles.text}>Debris services types</Text>
        <View>
          {typeServices !== undefined && typeServices.length > 0 ? (
            typeServices.map(item => (
              <View style={styles.rowTypeWrapper} key={item.id}>
                <Text style={styles.text}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => this.props.fetchRemoveTypeServices(item.id)}
                >
                  <Text style={styles.text}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No services type</Text>
          )}

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => this.props.navigation.navigate("AddServicesTypes")}
          >
            <Feather name="plus-circle" size={20} />
            <Text style={styles.text}>Add types</Text>
          </TouchableOpacity>
        </View>
        <Button text={"Edit"} onPress={() => this._handleSubmitEdit()} />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text>Detail</Text>
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

export default MyPostDetail;
