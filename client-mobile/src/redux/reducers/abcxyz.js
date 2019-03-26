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

// _handleUploadImage = () => {
//   //   const form = new FormData();
//   //   this.state.images.map((item, i) => {
//   //     form.append("image", {
//   //       uri: item.uri,
//   //       type: "image/jpg",
//   //       name: "image.jpg"
//   //     });
//   //   });

//   //   this.props.fetchUploadImage(form);
//   const form = new FormData();
//   form.append("image", {
//     uri: result.uri,
//     type: "image/jpg",
//     name: "image.jpg"
//   });

//   axios
//     .post(`equipmentImages`, form, {
//       headers: { "Content-Type": "multipart/form-data" },
//       onUploadProgress: progressEvent => {
//         console.log(
//           "Upload progress: " +
//             Math.round((progressEvent.loaded / progressEvent.total) * 100) +
//             "%"
//         );
//       }
//     })
//     .then(res => console.log(res));
// };

//TIME RANGE
//delete
// const { dateRanges } = this.state;
// const newRange = Object.keys(dateRanges).reduce((result, key) => {
//   if (key !== id.toString()) {
//     result[key] = dateRanges[key];
//   }
//   return result;
// }, {});
// //const newRange = delete dateRanges.id;
// const { [id]: deletedItem, ...otherItems } = dateRanges;
// this.setState({ dateRanges: otherItems });
