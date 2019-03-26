import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";
import { Header, Left, Right, Button, Body } from "./AnimatedHeader";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedBody = Animated.createAnimatedComponent(Body);
const AnimatedHeader = Animated.createAnimatedComponent(Header);
const HEADER_HEIGHT = 44;

class ParallaxList extends Component {
  nativeScroll = new Animated.Value(0);

  //default value scroll animated
  scroll = new Animated.Value(0);
  navOpacity = this.nativeScroll.interpolate({
    inputRange: [0, 40, 50],
    outputRange: [0, 1, 1]
  });
  headerOpacity = this.nativeScroll.interpolate({
    inputRange: [0, 35, 50],
    outputRange: [1, 0, 0]
  });
  constructor(props) {
    super(props);
    this.nativeScroll.addListener(
      Animated.event([{ value: this.scroll }], { useNativeDriver: false })
    );
  }

  renderHeader = () => (
    <Animated.View
      style={{
        opacity: this.titleOpacity
      }}
    >
      <Text style={styles.title}>{this.props.title}</Text>
    </Animated.View>
  );

  renderNavigation = () => (
    <AnimatedHeader>
      <Left back={this.props.hasLeft} />
      <AnimatedBody
        title={this.props.title}
        style={{ opacity: this.props.opacity || this.navOpacity }}
      />
      <Right
        hasRight={this.props.hasRight}
        hasSearch={this.props.hasSearch}
        hasFavorite={this.props.hasFavorite}
        hasAdd={this.props.hasAdd}
        hasClose={this.props.hasClose}
        onPress={this.props.onRightPress}
        onCartPress={this.props.onCartPress}
        hasCart={this.props.hasCart}
      />
    </AnimatedHeader>
  );

  renderBackground = () => (
    <AnimatedImage
      style={{
        height: 300,
        width: "100%",
        opacity: 1,
        transform: [
          {
            translateY: this.nativeScroll.interpolate({
              inputRange: [0, 200, 300],
              outputRange: [0, 1, 1],
              extrapolateRight: "extend",
              extrapolateLeft: "clamp"
            })
          },
          {
            scale: this.nativeScroll.interpolate({
              inputRange: [-100, 0, 150],
              outputRange: [1.5, 1, 1],
              extrapolate: "clamp"
            })
          }
        ]
      }}
      source={{ uri: this.props.imageURL }}
      resizeMode={"cover"}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigation()}
        {React.cloneElement(
          this.props.scrollElement,
          {
            style: { marginTop: 44, backgroundColor: "transparent", flex: 1, },
            onScroll: Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.nativeScroll } } }],
              { useNativeDriver: true }
            ),
            scrollEventThrottle: 1,
            ListHeaderComponent: this.props.removeTitle
              ? null
              : this.renderHeader()
          },
          [
            this.props.removeTitle ? null : (
              <View key="title">{this.renderHeader()}</View>
            ),
            this.props.hasThumbnail ? (
              <View key="thumbnail">{this.renderBackground()}</View>
            ) : null,
            this.props.renderScrollItem ? (
              <View key="scroll">{this.props.renderScrollItem()}</View>
            ) : null
          ]
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  title: {
    alignItems: "center",
    color: colors.primaryColor,
    fontSize: fontSize.h2,
    marginLeft: 15,
    fontWeight: "700"
  },
  titleFade: {
    color: colors.secondaryColor,
    fontSize: fontSize.bodyText,
    textAlign: "center",
    width: 300
  }
});

ParallaxList.propTypes = {
  title: PropTypes.string,
  scrollElement: PropTypes.element,
  renderScrollViewItem: PropTypes.func,
  hasLeft: PropTypes.bool,
  hasProfile: PropTypes.bool,
  hasFavorite: PropTypes.bool
};

export default ParallaxList;
