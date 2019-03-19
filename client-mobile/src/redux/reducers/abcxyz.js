import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  list: []
};

export default function cartReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.ADD_NEW_CART: {
      return {
        ...state,
        list: [...state.list, ...payload]
      };
    }
    case Actions.UPDATE_CART: {
      return {
        ...state,
        list: state.list.map(item => {
          if (item.id === payload.id)
            return Object.assign({}, item, { quantity: payload.quantity });
          return item;
        })
      };
    }
    case Actions.REMOVE_ITEM_EQUIPMENT:
      return {
        ...state,
        list: state.list.filter(x => x.id !== action.id)
      };
    case Actions.REMOVE_EQUIPMENT:
      return {
        ...state,
        list: []
      };
    default:
      return state;
  }
}

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  }}
>
  {RADIO_BUTON_DATA.map((item, key) =>
    checked === key ? (
      <TouchableOpacity
        key={key}
        style={{
          marginRight: 10,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={[styles.cirleIcon, { backgroundColor: colors.secondaryColor }]}
        />
        <Text style={styles.text}>{item.value}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        key={key}
        style={{
          marginRight: 10,
          flexDirection: "row",
          alignItems: "center"
        }}
        onPress={() => this.setState({ checked: key })}
      >
        <View style={styles.cirleIcon} />
        <Text style={styles.text}>{item.value}</Text>
      </TouchableOpacity>
    )
  )}
</View>;

// _renderStatusHeader = listMaterial => {
//   const { status } = this.state;
//   if (status === "All Statuses") {
//     return (
//       <View>
//         {MATERIAL_TRANSACTION_STATUSES.map(materialStatus => {
//           const materialList = listMaterial.filter(
//             item => item.status === materialStatus.code
//           );
//           if (materialList.length === 0) return null;
//           return (
//             <EquipmentStatus
//               count={materialList.length}
//               title={materialStatus.title}
//               code={materialStatus.code}
//             />
//           );
//         })}
//       </View>
//     );
//   } else {
//     return (
//       <EquipmentStatus
//         count={this._filterResult(listMaterial).length}
//         title={status}
//         code={status.toUpperCase()}
//       />
//     );
//   }
// };

// _renderItem = ({ item }) => {
//   return (
//     <MaterialItem
//       manufacturer={item.manufacturer}
//       name={item.name}
//       price={item.price}
//       unit={item.unit}
//       imageUrl={item.thumbnailImageUrl}
//       contractor={item.material.contractor.name}
//       contractorThumbnail={item.material.contractor.thumbnailImage}
//       status={item.status}
//     />
//   );
// };
