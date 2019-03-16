import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  Switch
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import axios from "axios";
import { Notifications, Permissions } from "expo";

import { getConstructionList } from "../../redux/actions/contractor";
import { logOut } from "../../redux/actions/auth";
import {
  deleteNoticationToken,
  allowPushNotification
} from "../../redux/actions/notification";

import RequireLogin from "../Login/RequireLogin";
import Login from "../Login";
import RowItem from "./components/RowItem";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Button from "../../components/Button";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const ROW_ITEM_VALUE = [
  {
    id: 1,
    value: "Edit Profile",
    code: "Profile"
  },
  {
    id: 2,
    value: "Manage your construction",
    code: "Construction"
  },
  {
    id: 3,
    value: "History renting",
    code: "Renting"
  },
  {
    id: 4,
    value: "History lease",
    code: "Lease"
  },
  {
    id: 5,
    value: "Push Notifications",
    code: "Notifications"
  },
  {
    id: 6,
    value: "Feedback",
    code: "Feedback"
  },
  {
    id: 7,
    value: "About us",
    code: "AboutUs"
  },
  {
    id: 8,
    value: "Call or text us",
    code: "Call"
  }
];

@connect(
  state => {
    return {
      isLoggedIn: state.auth.userIsLoggin,
      contractor: state.contractor.info,
      user: state.auth.data,
      status: state.status,
      allowPushNotification: state.notification.allowPushNotification
    };
  },
  dispatch => ({
    fetchLogout: () => {
      dispatch(logOut());
    },
    fetchGetConstructionList: userId => {
      dispatch(getConstructionList(userId));
    },
    fetchRemoveNotiToken: token => {
      dispatch(deleteNoticationToken(token));
    },
    fetchAllowPushNotification: () => {
      dispatch(allowPushNotification());
    }
  })
)
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      switchValue: null
    };
  }

  componentDidMount() {
    const { user, isLoggedIn } = this.props;
    if (isLoggedIn) {
      this._handlePermissionNotification();
      //this._registerForPushNotificationsAsync();
      this.props.fetchGetConstructionList(user.contractor.id);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.allowPushNotification && state.switchValue === null) {
      return {
        switchValue: props.allowPushNotification
      };
    }
    return null;
  }

  _handlePermissionNotification = async () => {
    const { existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
    this.props.fetchAllowPushNotification();
  };

  _registerForPushNotificationsAsync = async () => {
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    if (token) {
      const notiToken = {
        registrationToken: token,
        deviceType: "EXPO"
      };
      axios.post(`notificationTokens`, notiToken).then(
        res => {
          console.log(res.data);
          AsyncStorage.setItem("NotiToken", res.data.id.toString());
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  _handleRemoveToken = async () => {
    const tokenId = await AsyncStorage.getItem("NotiToken");
    if (tokenId) {
      await this.props.fetchRemoveNotiToken(tokenId);
      AsyncStorage.removeItem("NotiToken");
    }
  };

  _handleLogout = async () => {
    this._handleRemoveToken();
    this.props.fetchLogout();
  };

  _handleOnSwitchChange = value => {
    this.setState({ switchValue: value });
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

  _dateConverter = timeStamp => {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    let date = new Date(timeStamp);
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let day = date.getDay();
    return month + " " + day + ", " + year;
  };

  render() {
    const { isLoggedIn, contractor, status, user } = this.props;
    const { name, thumbnailImage, createdTime } = this.props.contractor;
    if (this.state.switchValue === true) {
      this._registerForPushNotificationsAsync();
    } else {
      this._handleRemoveToken();
    }
    if (isLoggedIn) {
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "never", top: "always" }}
        >
          <Header>
            <Text style={styles.header}>Account</Text>
          </Header>
          <ScrollView>
            {contractor ? (
              <View>
                {this._renderImageProfile(thumbnailImage)}
                <View style={styles.nameWrapper}>
                  <Text style={styles.text}>{user.contractor.name}</Text>
                  <Text style={styles.text}>
                    Created: {this._dateConverter(user.contractor.createdTime)}
                  </Text>
                </View>
                <View style={styles.contentWrapper}>
                  {ROW_ITEM_VALUE.map(item => (
                    <RowItem
                      key={item.id}
                      value={item.value}
                      onSwitchValue={this.state.switchValue}
                      onSwitchChange={this._handleOnSwitchChange}
                      onPress={() =>
                        this.props.navigation.navigate(item.code, {
                          contractorId: user.contractor.id
                        })
                      }
                    />
                  ))}
                  <Button
                    wrapperStyle={{ paddingBottom: 15 }}
                    buttonStyle={{ backgroundColor: "#FF5C5C" }}
                    text={"Logout"}
                    onPress={() => {
                      this._handleLogout();
                    }}
                  />
                </View>
              </View>
            ) : (
              <Loading />
            )}
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return <Login navigation={this.props.navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentWrapper: {
    paddingHorizontal: 15
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
  nameWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primaryColor,
    paddingVertical: 10,
    marginBottom: 10
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  thumbnail: {
    height: 120
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "400"
  }
});

export default Account;
