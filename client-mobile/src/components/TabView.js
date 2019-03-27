import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";
import colors from "../config/colors";
import fontSize from "../config/fontSize";

class TabView extends React.PureComponent {

  render() {
    const { children, tabs, onChangeTab, activeTab } = this.props;
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {tabs.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onChangeTab(index)}
              style={[
                styles.buttonWrapper,
                activeTab === index ? styles.activeButton : {}
              ]}
            >
              <Text style={activeTab === index ? styles.activeText : styles.text}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeButton: {
  },
  activeText: {
    color: colors.text,
    fontSize: fontSize.secondaryText,
    fontWeight: "600",
  },
  text: {
    color: colors.text25,
    fontSize: fontSize.secondaryText,
    fontWeight: "600",
  }
});

export default TabView;
