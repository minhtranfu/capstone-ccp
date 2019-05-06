import React, { PureComponent } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";

import MaterialSearchItem from "../../components/MaterialSearchItem";
import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

class MaterialTab extends PureComponent {
  render() {
    return this.props.listMaterial.map(item => (
      <MaterialSearchItem
        key={item.id}
        onPress={() =>
          this.props.navigation.navigate("MyMaterialDetail", {
            id: item.id
          })
        }
        imageUrl={
          item.thumbnailImageUrl
            ? item.thumbnailImageUrl
            : "http://lamnha.com/images/G01-02-1.png"
        }
        name={item.name}
        manufacturer={item.manufacturer}
        price={item.price}
        description={item.description}
      />
    ));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default withNavigation(MaterialTab);
