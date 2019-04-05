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
  readNotification,
  readAllNotification
} from "../../redux/actions/notification";
import axios from "axios";

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
    },
    fetchReadAllNotifcation: () => {
      dispatch(readAllNotification());
    }
  })
)
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readAllLoading: null
    };
  }

  componentDidMount() {
    this.props.fetchGetNotification();
  }

  _handleClickAction = async (notificaitonId, string, read) => {
    let parts = string.split("/");
    let actionId = parts[parts.length - 1];

    switch (string) {
      case string.includes("debrisTransactions"): {
        this.props.navigation.navigate("DebrisDetail", { id: actionId });
        this.props.fetchReadNotifiction(notificaitonId, { read: isRead });
      }
      case string.includes("materialTransactions"): {
        this.props.navigation.navigate("MaterialRequesterDetail", {
          id: actionId
        });
        this.props.fetchReadNotifiction(notificaitonId, { read: isRead });
      }
      case string.includes("equipments"): {
        this.props.navigation.navigate("MyEquipmentDetail", { id: actionId });
        this.props.fetchReadNotifiction(notificaitonId, { read: isRead });
      }
      default:
        return null;
    }
    // if (string.includes("equipments")) {
    //   this.props.navigation.navigate("MyEquipmentDetail", { id: 37 });
    //   this.props.fetchReadNotifiction(notificaitonId, { read: isRead });
    // } else if (string.includes("transactions")) {
    //   const res = await axios.get("transactions/14");
    //   this.props.fetchReadNotifiction(notificaitonId, { read: isRead });
    //   //If contractor.id === requester.id => user is requester else user is supplier
    //   if (res.data.equipment.contractor.id === res.data.requester.id) {
    //     this.props.navigation.navigate("Detail", { id: 14 });
    //   } else {
    //     this.props.navigation.navigate("MyTransactionDetail", { id: 14 });
    //   }
    // }
  };

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

  _handleReadAll = async () => {
    try {
      this.setState({ readAllLoading: true });
      await this.props.fetchReadAllNotifcation();
      this.setState({ readAllLoading: false });
    } catch (error) {
      this.setState({ readAllLoading: false });
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
      onPress={() => this._handleClickAction(item.id, item.clickAction, true)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.content}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Text style={styles.caption}>
          {this._findDiffDayFromToday(item.createdTime)}
        </Text>
        <TouchableOpacity
          onPress={() => this._handleReadNotification(item.id, true)}
          style={item.read ? { backgroundColor: "blue" } : null}
        >
          <Text style={[styles.caption, { color: colors.text }]}>
            Mark as read
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { loading, listNotification } = this.props;
    const { readAllLoading } = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <Header
          renderLeftButton={() => (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          )}
          renderRightButton={() => (
            <TouchableOpacity
              onPress={() => {
                this.props.fetchReadAllNotifcation();
              }}
            >
              <Text>Mark all as read</Text>
            </TouchableOpacity>
          )}
        >
          <Text style={styles.header}>Notification</Text>
        </Header>
        {readAllLoading ? <Loading /> : null}
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
    marginHorizontal: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    ...colors.shadow
  },
  header: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 5
  },
  text: {
    fontSize: fontSize.secondaryText,
    color: colors.text68,
    marginBottom: 5
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: "600",
    color: "red"
  }
});

export default Notification;
