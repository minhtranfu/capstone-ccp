import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

import fontSize from "../config/fontSize";
import colors from "../config/colors";

class CustomFlatList extends PureComponent {
  render() {
    const {
      data,
      renderItem,
      isHorizontal,
      numColumns,
      style,
      contentContainerStyle
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <FlatList
          horizontal={isHorizontal}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={this.props.contentContainerStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  }
});

CustomFlatList.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  isHorizontal: PropTypes.bool
};

export default CustomFlatList;
