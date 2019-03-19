import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../config/colors";
import fontSize from "../config/fontSize";

class TabView extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     activeTab: 0
  //   };
  // }

  // _onChangeTab = tab => {
  //   this.setState({ activeTab: tab });
  // };

  render() {
    const { children, tabs, onChangeTab, activeTab } = this.props;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          {tabs.map((item, index) => (
            <TouchableOpacity
              onPress={() => onChangeTab(index)}
              style={[
                styles.buttonWrapper,
                activeTab === index ? styles.activeButton : null
              ]}
            >
              <Text
                style={activeTab === index ? styles.activeText : styles.text}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    paddingHorizontal: 5,
    marginBottom: 10
  },
  activeButton: {
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryColor
  },
  activeText: {
    color: colors.primaryColor,
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  text: {
    color: colors.secondaryColorOpacity,
    fontSize: fontSize.bodyText
  }
});

export default TabView;
