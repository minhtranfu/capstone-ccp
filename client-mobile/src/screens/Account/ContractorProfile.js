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
  TextInput,
  Dimensions
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import {
  getContractorDetail,
  createNewFeedback,
  listFeedbackTypes
} from "../../redux/actions/contractor";
import { Feather } from "@expo/vector-icons";
import TabView from "../../components/TabView";
import axios from "axios";

import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const maxLength = 100;

const { width } = Dimensions.get("window");
const DROPDOWN_FEEDBACK_OPTIONS = [
  {
    id: 0,
    name: "Select your reason",
    value: "Select your reason"
  }
];

const FeedbackStatus = ({ totalFeedbackType, feedbackType, lastIndex }) => (
  <View
    style={[
      {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: (width - 30) / 3,
        height: 100
      },
      !lastIndex ? { borderRightWidth: 1, borderRightColor: "white" } : null
    ]}
  >
    <Text style={[styles.text, { marginBottom: 10 }]}>{totalFeedbackType}</Text>
    <Text style={[styles.text, { textAlign: "center" }]}>{feedbackType}</Text>
  </View>
);

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
      feedbackIndex: 0,
      activeTab: 0,
      materialFeedback: [],
      equipmentFeedback: [],
      debrisFeedback: []
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetContractorDetail(id);
    this.props.fetchListFeedbackTypes();
    this._loadMaterialFeedback();
    this._loadEquipmentFeedback();
    this._loadDebrisFeedback();
  }

  _loadMaterialFeedback = async () => {
    const { id } = this.props.navigation.state.params;
    const res = await axios.post(
      `materialFeedbacks?limit=100&offset=0&orderBy=createdTime.desc&supplierId=${id}`
    );
    if (res) {
      console.log(res);
    }
  };

  _loadEquipmentFeedback = async () => {
    const { id } = this.props.navigation.state.params;
    const res = await axios.post(
      `equipmentFeedbacks?limit=100&offset=0&orderBy=createdTime.desc&supplierId=${id}`
    );
    if (res) {
      console.log(res);
    }
  };

  _loadDebrisFeedback = async () => {
    const { id } = this.props.navigation.state.params;
    const res = await axios.post(
      `debrisFeedbacks?limit=100&offset=0&orderBy=createdTime.desc&supplierId=${id}`
    );
    if (res) {
      console.log(res);
    }
  };

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _handleOnSubmit = () => {
    const { id } = this.props.navigation.state.params;
    const { text, checked, feedbackIndex, feedback } = this.state;
    const { user } = this.props;
    const feedBackList = this._handleFeedbackDropdown();
    console.log(feedbackIndex);
    if (!feedback) {
      console.log("error");
    } else {
      const feedback = {
        content: text,
        toContractor: {
          id
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

  _renderImageProfile = contractor => (
    <View style={{ flex: 1 }}>
      <Image
        uri={contractor.thumbnailImageUrl}
        style={styles.thumbnail}
        resizeMode={"cover"}
      />
      <View style={styles.avatarWrapper}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.primaryColor
          }}
        >
          <Image
            uri={
              contractor.thumbnailImageUrl ||
              "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
            }
            resizeMode={"cover"}
            style={styles.avatar}
          />
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{contractor.name}</Text>
            <Text style={styles.phone}>{contractor.phoneNumber}</Text>
            <Text style={styles.email}>{contractor.email}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: 180,
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: "#7F859A",
              borderRadius: 5,
              marginRight: 20
            }}
          >
            <Text style={styles.text}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: 180,
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: "#7F859A",
              borderRadius: 5
            }}
          >
            <Text style={styles.text}>Call</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <FeedbackStatus
            totalFeedbackType={contractor.finishedHiringTransactionCount}
            feedbackType={"Finished equipment transaction"}
          />
          <FeedbackStatus
            totalFeedbackType={contractor.finishedMaterialTransactionCount}
            feedbackType={"Finished material transaction"}
          />
          <FeedbackStatus
            totalFeedbackType={contractor.finishedDebrisTransactionCount}
            feedbackType={"Finished debris transaction"}
            lastIndex={true}
          />
        </View>
      </View>
    </View>
  );

  _handleActiveTab = index => {
    switch (index) {
      case 1:
        return <Text>J</Text>;
      case 2:
        return <Text>H</Text>;
      default:
        return <Text>K</Text>;
    }
  };

  _onChangeTab = tab => {
    this.setState({ activeTab: tab });
  };

  _renderListItem = () => {
    const { contractor } = this.props;
    const { activeTab } = this.state;
    return (
      <ScrollView>
        {this._renderImageProfile(contractor)}
        <TabView
          tabs={["Equipment", "Material", "Debris"]}
          onChangeTab={this._onChangeTab}
          activeTab={activeTab}
        />
        {this._renderFeedbackModal()}
        {this._handleActiveTab(activeTab)}
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
              <Feather name={"chevron-left"} size={24} />
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
    justifyContent: "center",
    paddingVertical: 10,
    paddingLeft: 15
  },
  avatarWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingHorizontal: 15
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.primaryColor
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  name: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.white,
    marginBottom: 5
  },
  phone: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.secondaryColor,
    marginBottom: 5
  },
  email: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    color: colors.grayWhite,
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500",
    color: colors.white
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  thumbnail: {
    height: 320
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
