import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import {
  getContractorDetail,
  createNewFeedback,
  listFeedbackTypes
} from "../../redux/actions/contractor";
import { Feather } from "@expo/vector-icons";

import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const maxLength = 100;

const DROPDOWN_FEEDBACK_OPTIONS = [
  {
    id: 0,
    name: "Select your reason",
    value: "Select your reason"
  }
];

@connect(
  state => ({
    contractor: state.contractor.detail,
    loading: state.contractor.loading,
    types: state.contractor.feedbackTypes,
    user: state.auth.data
  }),
  dispatch => ({
    fetchGetContractorDetail: id => {
      dispatch(getContractorDetail(id));
    },
    fetchSendFeedback: feedback => {
      dispatch(createNewFeedback(feedback));
    },
    fetchListFeedbackTypes: () => {
      dispatch(listFeedbackTypes());
    }
  })
)
class ContractorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      text: "",
      textLength: maxLength,
      feedback: "",
      feedbackIndex: 0
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetContractorDetail(id);
    this.props.fetchListFeedbackTypes();
  }

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _handleOnSubmit = () => {
    const { id } = this.props.navigation.state.params;
    const { text, checked, feedbackIndex, feedback } = this.state;
    const { user } = this.props;
    const feedBackList = this._handleFeedbackDropdown();
    if (!feedback) {
      console.log("error");
    } else {
      const feedback = {
        content: text,
        toContractor: {
          id: id
        },
        fromContractor: {
          id: user.contractor.id
        },
        feedbackType: {
          id: feedBackList[feedbackIndex].id
        }
      };
      this.props.fetchSendFeedback(feedback);
      this._setModalVisible(false);
    }
  };

  _capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  _handleFeedbackDropdown = () => {
    const { types } = this.props;
    const newFeedbackDropdown = types.map(item => ({
      id: item.id,
      name: this._capitalizeFirstLetter(item.name),
      value: this._capitalizeFirstLetter(item.name)
    }));
    return [...DROPDOWN_FEEDBACK_OPTIONS, ...newFeedbackDropdown];
  };

  _renderFeedbackModal = () => {
    const { text, textLength, checked, modalVisible } = this.state;
    const { types } = this.props;
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <SafeAreaView
          forceInset={{ bottom: "never", top: "always" }}
          style={styles.container}
        >
          <Header
            renderLeftButton={() => (
              <TouchableOpacity onPress={() => this._setModalVisible(false)}>
                <Feather name={"chevron-left"} size={24} />
              </TouchableOpacity>
            )}
          >
            <Text style={styles.header}>Feedback</Text>
          </Header>
          <View style={{ paddingHorizontal: 15 }}>
            <Text style={styles.text}>Content</Text>
            <TextInput
              style={{ height: 200, borderColor: "#000000", borderWidth: 1 }}
              multiline={true}
              numberOfLines={4}
              onChangeText={value =>
                this.setState({
                  text: value,
                  textLength: maxLength - text.length
                })
              }
              value={text}
              editable={true}
              maxLength={maxLength}
            />
            <Text style={styles.text}>
              {maxLength} / {textLength}
            </Text>
            <Dropdown
              label={"Reason to feedback"}
              defaultText={"Select your reason"}
              onSelectValue={(value, index) =>
                this.setState({ feedbackIndex: index, feedback: value })
              }
              options={this._handleFeedbackDropdown()}
            />

            <TouchableOpacity
              onPress={() => this._handleOnSubmit()}
              style={{
                marginTop: 10,
                backgroundColor: colors.primaryColor,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={[styles.text, { color: "white" }]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  _renderImageProfile = thumbnailImage => (
    <View style={{ flex: 1 }}>
      <Image
        uri={"https://ak4.picdn.net/shutterstock/videos/6731134/thumb/1.jpg"}
        style={styles.thumbnail}
        resizeMode={"cover"}
      />
      <View style={styles.avatarWrapper}>
        <Image
          uri={
            "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
          }
          resizeMode={"cover"}
          style={styles.avatar}
        />
      </View>
    </View>
  );

  _renderListItem = () => {
    const { name, thumbnailImage, email, phoneNumber } = this.props.contractor;
    return (
      <ScrollView>
        {this._renderImageProfile(thumbnailImage)}
        <View style={styles.nameWrapper}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.text}>Phone Number: {phoneNumber}</Text>
          <Text style={styles.text}>Email: {email}</Text>
        </View>
        {this._renderFeedbackModal()}
        <Button
          wrapperStyle={{ marginHorizontal: 15 }}
          text={"Report"}
          onPress={() => {
            this._setModalVisible(true);
          }}
        />
      </ScrollView>
    );
  };

  render() {
    const { loading, navigation, types } = this.props;
    console.log(this.props.types);
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.container}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name={"x"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Profile</Text>
        </Header>
        {!loading && types.length > 0 ? this._renderListItem() : <Loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nameWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primaryColor,
    paddingVertical: 10,
    marginBottom: 10
  },
  avatarWrapper: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  header: {
    fontSize: fontSize.h4
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "400"
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  thumbnail: {
    height: 120
  },
  cirleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondaryColor,
    marginRight: 10
  }
});

export default ContractorProfile;
