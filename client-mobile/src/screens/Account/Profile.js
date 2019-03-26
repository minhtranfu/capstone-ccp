import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert, Animated
} from 'react-native';
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import {
  getContractorDetail,
  updateContractorDetail
} from "../../redux/actions/contractor";

import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import InputField from "../../components/InputField";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";
import ParallaxList from '../../components/ParallaxList';

@connect(
  state => ({
    contractor: state.contractor.info
  }),
  dispatch => ({
    fetchGetContractorDetail: id => {
      dispatch(getContractorDetail(id));
    },
    fetchUpdateContractorDetail: (id, contractor) => {
      dispatch(updateContractorDetail(id, contractor));
    }
  })
)
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      thumbnailImage: "",
      data: {},
      dataChanged: false,
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
    let newData = { ...this.state.data };
    newData[field] = value;
    this.setState({ data: newData, dataChanged: true });
  };

  _handleSave = () => {
    const { data } = this.state;
    const { contractorId } = this.props.navigation.state.params;
    try {
      this.props.fetchUpdateContractorDetail(contractorId, data);
    } catch (error) {
      this._showAlert(error);
    }
    this.props.navigation.goBack();
  };

  _showAlert = msg => {
    Alert.alert("Error", msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _renderScrollViewItem = () => {
    const { data } = this.state;
    return (
      <View style={{ paddingHorizontal: 15, paddingTop: 15, }}>
        <InputField
          label={"Name"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text50}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("name", value)}
          value={data.name}
          returnKeyType={"next"}
        />
        <InputField
          label={"Email"}
          placeholder={"Input your equipment name"}
          placeholderTextColor={colors.text50}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("email", value)}
          value={data.email}
          returnKeyType={"next"}
        />
        <InputField
          label={"Phone"}
          placeholder={"Input your phone number"}
          placeholderTextColor={colors.text50}
          customWrapperStyle={{ marginBottom: 20 }}
          inputType="text"
          onChangeText={value => this._handleInputChange("phoneNumber", value)}
          value={data.phoneNumber}
          returnKeyType={"next"}
        />
      </View>
    );
  };

  _renderNextButton = () => (
    <TouchableOpacity style={styles.buttonWrapper}>
      <Text style={styles.text}>Submit</Text>
    </TouchableOpacity>
  );

  render() {
    const { contractor } = this.props;
    const { dataChanged } = this.state;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.containter}
      >
        {contractor ? (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <ParallaxList
              title={"Edit Profile"}
              hasLeft={true}
              hasCart={false}
              scrollElement={<Animated.ScrollView />}
              renderScrollItem={this._renderScrollViewItem}
            />
            <SafeAreaView
              forceInset={{ bottom: "always" }}
              style={{backgroundColor: dataChanged ? colors.secondaryColor : '#a5acb8'}}
            >
              <Button
                text={"Save"}
                onPress={this._handleSave}
                disabled={!dataChanged}
                buttonStyle={{backgroundColor:'transparent'}}
              />
            </SafeAreaView>
          </View>
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
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: "white"
  }
});

export default Profile;
