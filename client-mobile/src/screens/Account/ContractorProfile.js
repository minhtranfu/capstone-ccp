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
  createNewFeedback
} from "../../redux/actions/contractor";
import { Feather } from "@expo/vector-icons";

import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const maxLength = 100;

const RADIO_BUTON_DATA = [
  {
    id: 1,
    value: "Good Crime"
  },
  {
    id: 2,
    value: "Bad Crime"
  }
];

@connect(
  state => ({
    contractor: state.contractor.info,
    loading: state.contractor.loading
  }),
  dispatch => ({
    fetchGetContractorDetail: id => {
      dispatch(getContractorDetail(id));
    },
    fetchSendFeedback: feedback => {
      dispatch(createNewFeedback(feedback));
    }
  })
)
class ContractorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      text: "",
      textLength: 0,
      checked: 0
    };
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;
    this.props.fetchGetContractorDetail(id);
  }

  _setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _handleOnSubmit = () => {
    const { id } = this.props.navigation.state.params;
    const { text, checked } = this.state;
    const feedback = {
      content: text,
      toContractor: {
        id: id
      },
      fromContractor: {
        id: 12
      },
      feedbackType: {
        id: RADIO_BUTON_DATA[checked].id
      }
    };
    this.props.fetchSendFeedback(feedback);
    this._setModalVisible(false);
  };

  _renderFeedbackModal = () => {
    const { text, textLength, checked, modalVisible } = this.state;
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <SafeAreaView
          forceInset={{ bottom: "never", top: "always" }}
          style={[styles.container, { paddingHorizontal: 15 }]}
        >
          <Text>Content</Text>
          <TextInput
            style={{ height: 200, borderColor: "#000000", borderWidth: 1 }}
            multiline={true}
            numberOfLines={4}
            onChangeText={text =>
              this.setState({ text, textLength: maxLength - text.length })
            }
            value={this.state.text}
            editable={true}
            maxLength={maxLength}
          />
          <Text>
            {textLength} / {maxLength}
          </Text>
          <Text>Reason to feedback</Text>
          {RADIO_BUTON_DATA.map((item, key) => (
            <View key={key}>
              {checked === key ? (
                <TouchableOpacity>
                  <Text>{item.value} checked</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.setState({ checked: key })}
                >
                  <Text>{item.value}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={() => this._handleOnSubmit()}>
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity>
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
        <TouchableOpacity
          style={{ maringLeft: 15 }}
          onPress={() => {
            this._setModalVisible(true);
          }}
        >
          <Text style={styles.text}>Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  render() {
    const { loading, navigation } = this.props;
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "always" }}
        style={styles.container}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name={"arrow-left"} size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Profile</Text>
        </Header>
        {!loading ? this._renderListItem() : <Loading />}
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
  }
});

export default ContractorProfile;
