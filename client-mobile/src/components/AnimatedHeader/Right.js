import React from "react";
import { withNavigation } from "react-navigation";
import { View } from "react-native";
import Button from "./Button";

class Right extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 0.5,
          alignSelf: "center",
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 15
        }}
      >
        {this.props.hasRight ? <Button.Profile /> : null}

        {this.props.hasSearch ? (
          <Button.Search onPress={this.props.onPress} />
        ) : null}
        {this.props.hasCart ? (
          <Button.Cart onPress={this.props.onCartPress} />
        ) : null}
        {this.props.hasFavorite ? <Button.Favorite /> : null}
        {this.props.hasAdd ? <Button.Add onPress={this.props.onPress} /> : null}
        {this.props.hasClose ? (
          <Button.Close navigation={this.props.navigation} />
        ) : null}
      </View>
    );
  }
}

export default withNavigation(Right);
