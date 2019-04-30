import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SafeAreaView } from "react-navigation";
import { updateLanguage } from "../../redux/actions/contractor";
import i18n from "i18n-js";

import ParallaxList from "../../components/ParallaxList";
import Header from "../../components/Header";

const language = [
  {
    id: 1,
    text: "English",
    subText: "English",
    key: "en"
  },
  {
    id: 2,
    text: "Vietnam",
    subText: "Vietnamese",
    key: "vn"
  }
];

@connect(
  state => ({
    language: state.contractor.language
  }),
  dispatch =>
    bindActionCreators(
      {
        fetchUpdateLanguage: updateLanguage
      },
      dispatch
    )
)
class ChangeLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    return this.props.language !== nextProps.language;
  }

  renderScrollItem = () => {
    return language.map(item => (
      <TouchableOpacity
        key={item.id}
        onPress={() => this.props.fetchUpdateLanguage(item.key)}
        style={{ paddingHorizontal: 15, marginBottom: 10 }}
      >
        <Text>{item.text}</Text>
        <Text>{item.subText}</Text>
      </TouchableOpacity>
    ));
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
        <ParallaxList
          title={i18n.t("ChangeLanguage")}
          hasLeft={true}
          scrollElement={<Animated.ScrollView />}
          renderScrollItem={this.renderScrollItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ChangeLanguage;
