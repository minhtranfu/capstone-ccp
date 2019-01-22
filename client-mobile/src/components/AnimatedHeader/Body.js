import React from "react";
import { View, Text } from "react-native";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class Body extends React.PureComponent {
  render() {
    const titleStyle = [
      {
        color: colors.primaryColor,
        fontSize: fontSize.bodyText,
        fontWeight: "600"
      }
    ];
    return (
      <View
        style={[
          {
            flex: 3,
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          },
          this.props.style
        ]}
      >
        <Text style={titleStyle} numberOfLines={1}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

export default Body;
