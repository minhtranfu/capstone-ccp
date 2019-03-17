import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Feather from "@expo/vector-icons/Feather";
import {
  getAllNotification,
  readNotification
} from "../../redux/actions/notification";

import Loading from "../../components/Loading";
import Header from "../../components/Header";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    loading: state.notification.loading,
    listNotification: state.notification.listNotification
  }),
  dispatch => ({
    fetchGetNotification: () => {
      dispatch(getAllNotification());
    },
    fetchReadNotifiction: (notificationId, content) => {
      dispatch(readNotification(notificationId, content));
    }
  })
)
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchGetNotification();
  }

  _handleClickAction = string => {};

  _handleReadNotification = (id, isRead) => {
    this.props.fetchReadNotifiction(id, { read: isRead });
  };

  _findDiffDayFromToday = date => {
    let firstDate = new Date(date);
    let secondDate = new Date(Date.now());

    let oneDay = 24 * 60 * 60 * 1000;
    let dayNow = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    let dayDuration = Math.round(
      (secondDate.getTime() - firstDate.getTime()) / oneDay
    );
    if (dayDuration < 0) {
      return "Less than 1 days";
    } else {
      return `${dayDuration} days ago`;
    }
  };

  _renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationWrapper,
        item.read
          ? { backgroundColor: "white" }
          : { backgroundColor: "#DDDDDD" }
      ]}
    >
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.content}</Text>
        <Text style={styles.caption}>
          {this._findDiffDayFromToday(item.createdTime)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => this._handleReadNotification(item.id, true)}
        style={item.read ? { backgroundColor: "blue" } : null}
      >
        <Text style={styles.text}>Mark as read</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  render() {
    const { loading, listNotification } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          )}
        >
          <Text style={styles.text}>Notification</Text>
        </Header>
        {!loading ? (
          <FlatList
            data={listNotification}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primaryColor,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden"
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "bold"
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: "500",
    color: "red"
  }
});

export default Notification;
