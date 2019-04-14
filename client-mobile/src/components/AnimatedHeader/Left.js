import React from "react";
import { withNavigation } from "react-navigation";
import { View } from "react-native";
import Button from "./Button";

class Left extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 0.5,
          alignSelf: "center",
          alignItems: "flex-start",
          flexDirection: "row",
          marginLeft: 15
        }}
      >
        {this.props.back ? (
          <Button.Back navigation={this.props.navigation} />
        ) : null}
        {this.props.children}
      </View>
    );
  }
}

export default withNavigation(Left);
