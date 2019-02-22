import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";

import { getContractorDetail } from "../../redux/actions/contractor";
import { logOut } from "../../redux/actions/auth";
import { isSignedIn, onSignOut } from "../../config/auth";

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
      auth: state.auth.userIsLoggin,
      contractor: state.contractor.info
    };
  },
  dispatch => ({
    fetchLogout: () => {
      dispatch(logOut());
    },
    fetchContractorInfo: id => {
      dispatch(getContractorDetail(id));
    }
  })
)
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    if (auth) {
      this.props.fetchContractorInfo(12);
    }
  }

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
    const { auth, contractor } = this.props;
    const { name, thumbnailImage, createdTime } = this.props.contractor;
    if (auth) {
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
                  <Text style={styles.text}>{name}</Text>
                  <Text style={styles.text}>
                    Created: {this._dateConverter(createdTime)}
                  </Text>
                </View>
                <View style={styles.contentWrapper}>
                  {ROW_ITEM_VALUE.map(item => (
                    <RowItem
                      key={item.id}
                      value={item.value}
                      onPress={() =>
                        this.props.navigation.navigate(item.code, {
                          contractorId: 12
                        })
                      }
                    />
                  ))}
                  <Button
                    wrapperStyle={{ paddingBottom: 15 }}
                    buttonStyle={{ backgroundColor: "#FF5C5C" }}
                    text={"Logout"}
                    onPress={() => {
                      this.props.fetchLogout();
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
