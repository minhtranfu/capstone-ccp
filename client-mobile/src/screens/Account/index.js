import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  Switch,
  Image as RNImage,
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

import Login from "../Login";
import RowItem from "./components/RowItem";
import Loading from "../../components/Loading";
import { Header, Left, Right, Button as HeaderButton, Body } from "../../components/AnimatedHeader";
import LogoutIcon from "../../../assets/icons/icons8-export.png";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const ROW_ITEM_VALUE = [
  {
    id: 1,
    value: "Edit profile",
    code: "Profile"
  },
  {
    id: 2,
    value: "My constructions",
    code: "Construction"
  },
  {
    id: 4,
    value: "My subscription",
    code: "Subcription"
  },
  {
    id: 5,
    value: "Push notifications",
    code: "Notifications"
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

  async componentDidMount() {
    const { user, isLoggedIn } = this.props;
    if (isLoggedIn) {
      //await this._handlePermissionNotification();
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
    console.log(token);
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
        uri={"https://www.bimcommunity.com/files/images/userlib/construction_trends_bimcommunity.jpg"}
        style={styles.thumbnail}
        resizeMode={"cover"}
      />
      <View style={styles.avatarWrapper}>
        <Image
          uri={
            "http://bootstraptema.ru/snippets/icons/2016/mia/2.png"
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
    if (isLoggedIn) {
      if (this.state.switchValue === true) {
        this._handlePermissionNotification();
        this._registerForPushNotificationsAsync();
      } else {
        this._handleRemoveToken();
      }
      return (
        <SafeAreaView
          style={styles.container}
          forceInset={{ bottom: "never", top: "always" }}
        >
          <Header style={{position: 'relative'}}>
            <Left/>
            <Body title="Settings" />
            <Right>
              <TouchableOpacity onPress={this._handleLogout}>
                <RNImage
                  source={LogoutIcon}
                  style={{ width: 22, height: 22, marginRight: 5}}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            </Right>
          </Header>
          <ScrollView>
            {contractor ? (
              <View>
                {this._renderImageProfile(thumbnailImage)}
                <View style={styles.nameWrapper}>
                  <Text style={styles.name}>
                    {user.contractor.name}
                  </Text>
                  <Text style={styles.text}>
                    Joined {this._dateConverter(user.contractor.createdTime)}
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
    marginTop: -40,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  nameWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: colors.primaryColor,
    paddingVertical: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: colors.secondaryColor,
  },
  thumbnail: {
    height: 145
  },
  header: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "600"
  },
  name: {
    fontSize: fontSize.h3,
    fontWeight: "700"
  },
  text: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "400"
  }
});

export default Account;
