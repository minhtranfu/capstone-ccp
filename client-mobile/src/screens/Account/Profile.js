import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import { getContractorDetail } from "../../redux/actions/contractor";

import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Title from "../../components/Title";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    contractor: state.contractor.info
  }),
  dispatch => ({
    fetchGetContractorDetail: id => {
      dispatch(getContractorDetail(id));
    }
  })
)
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    const { contractorId } = this.props.navigation.state.params;
    this.props.fetchGetContractorDetail(contractorId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //Check data is update
    if (
      Object.keys(prevState.data).length === 0 &&
      nextProps.contractor !== prevState.data
    ) {
      return {
        data: nextProps.contractor
      };
    } else return null;
  }

  _handleInputChange = (field, value) => {
    const newData = { ...this.state.data };
    newData.field = value;
    this.setState({ data: newData });
  };

  _renderScrollViewItem = () => {
    const { contractor } = this.props;
    const { data } = this.state;
    return (
      <View>
        <InputField
          label={"Name"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("name", value)}
          value={data.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Email"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("email", value)}
          value={data.email}
          returnKeyType={"next"}
        />
        <InputField
          label={"Phone"}
          placeholder={"Input your phone number"}
          placeholderTextColor={colors.text68}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("phoneNumber", value)}
          value={data.phoneNumber}
          returnKeyType={"next"}
        />
        <Title title={"Manage your construction"} />
        {data.construction.length > 0 ? (
          <View>
            <Text>Data</Text>
          </View>
        ) : (
          <Text>Your construction list is empty</Text>
        )}
      </View>
    );
  };

  render() {
    const { contractor } = this.props;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.containter}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="arrow-left" size={22} />
            </TouchableOpacity>
          )}
        >
          <Text>Edit Profile</Text>
        </Header>
        {contractor ? (
          <ScrollView>{this._renderScrollViewItem()}</ScrollView>
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  containter: {
    flex: 1
  }
});

export default Profile;
