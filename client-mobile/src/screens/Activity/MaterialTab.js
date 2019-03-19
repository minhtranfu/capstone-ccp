import React, { PureComponent } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MaterialItem from "../../components/MaterialItem";
import { withNavigation } from "react-navigation";
import Dropdown from "../../components/Dropdown";
import EquipmentStatus from "../../components/EquipmentStatus";
import { COLORS } from "../../Utils/Constants";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const MATERIAL_TRANSACTION_STATUSES = [
  {
    code: "PENDING",
    title: "Pending" // On Waiting,
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "DELIVERING",
    title: "Delivering"
  },
  {
    code: "FINISHED",
    title: "Finished"
  },
  {
    code: "DENIED",
    title: "Denied"
  },
  {
    code: "CANCEL",
    title: "Cancel"
  }
];

const MATERIAL_TRANSACTION_OPTIONS = [
  {
    id: 0,
    name: "All Statuses",
    value: "All Statuses"
  },
  {
    id: 1,
    name: "Pending",
    value: "Pending"
  },
  {
    id: 2,
    name: "Accepted",
    value: "Accepted"
  },
  {
    id: 3,
    name: "Delivering",
    value: "Delivering"
  },
  {
    id: 4,
    name: "Finished",
    value: "Finished"
  },
  {
    id: 5,
    name: "Denied",
    value: "Denied"
  },
  {
    id: 6,
    name: "Cancel",
    value: "Cancel"
  }
];

class MaterialTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: "All Statuses"
    };
  }

  _renderMaterial = listMaterial => (
    <View>
      {MATERIAL_TRANSACTION_STATUSES.map((materialStatus, idx) => {
        const materialList = listMaterial.filter(
          item => item.status === materialStatus.code
        );
        if (materialList.length === 0) return null;
        return (
          <View key={`sec_${idx}`}>
            <EquipmentStatus
              count={materialList.length}
              title={materialStatus.title}
              code={materialStatus.code}
            />
            {materialList.map(item => (
              <MaterialItem
                key={item.id}
                manufacturer={item.material.manufacturer}
                name={item.material.name}
                price={item.price}
                unit={item.unit}
                imageUrl={item.material.thumbnailImageUrl}
                contractor={item.material.contractor.name}
                contractorThumbnail={
                  item.material.contractor.thumbnailImage
                    ? item.material.contractor.thumbnailImage
                    : "https://microlancer.lancerassets.com/v2/services/bf/56f0a0434111e6aafc85259a636de7/large__original_PAT.jpg"
                }
                status={item.status}
                onPress={() =>
                  this.props.navigation.navigate("MaterialRequesterDetail", {
                    id: item.id
                  })
                }
              />
            ))}
          </View>
        );
      })}
    </View>
  );

  _renderEmptyComponent = () => (
    <View style={styles.actionWrapper}>
      <Text style={styles.text}>No data</Text>
    </View>
  );

  render() {
    const { listMaterial } = this.props;
    const { status } = this.state;
    return (
      <View style={styles.container}>
        <Dropdown
          label={"Filter"}
          defaultText={"All Statuses"}
          onSelectValue={value => this.setState({ status: value })}
          options={MATERIAL_TRANSACTION_OPTIONS}
          isHorizontal={true}
        />
        <ScrollView>
          {listMaterial.length > 0
            ? this._renderMaterial(listMaterial)
            : this._renderEmptyComponent()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "35%",
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#DEE4E3",
    padding: 30
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  }
});

export default withNavigation(MaterialTab);
