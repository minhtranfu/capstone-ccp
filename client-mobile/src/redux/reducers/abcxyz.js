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


<KeyboardAvoidingView style={styles.formWrapper} behavior="position">
            <InputField
              label={"Username"}
              placeholder={"Input your username"}
              customWrapperStyle={{ marginBottom: 20 }}
              autoCapitalize={"none"}
              inputType="text"
              onChangeText={value => this.setState({ username: value })}
              value={username}
              returnKeyType={"next"}
            />
            <InputField
              label={"Password"}
              placeholder={"Password"}
              autoCapitalize={"none"}
              customWrapperStyle={{ marginBottom: 20 }}
              inputType="password"
              onChangeText={value => this.setState({ password: value })}
              value={password}
            />
          </KeyboardAvoidingView>
          <Button
            text={"Log in"}
            wrapperStyle={styles.wrapperStyle}
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            onPress={() => this._signIn()}
          />
//Tab
          <View style={styles.tabViewWrapper}>
          <View style={styles.itemTabWrapper}>
            {tabs.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => this._onChangeTab(index)}
                style={[
                  styles.tabButton,
                  activeTab === index ? styles.activeButton : null
                ]}
              >
                <Text
                  style={
                    activeTab === index ? styles.activeText : styles.disableText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

tabViewWrapper: {
  height: 50,
  shadowColor: "#3E3E3E",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 2,
  elevation: 2
},
itemTabWrapper: {
  paddingTop: 10,
  backgroundColor: "white",
  flexDirection: "row",
  alignItems: "center"
},
tabButton: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 15
},
activeText: {
  color: colors.text,
  fontSize: fontSize.bodyText,
  fontWeight: "bold"
},
disableText: {
  color: colors.text50,
  fontSize: fontSize.bodyText,
  fontWeight: "bold"
},


{/* {materialList.materialTransactionDetails.map(item => (
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
                quantity={item.quantity}
                onPress={() =>
                  this.props.navigation.navigate("MaterialRequesterDetail", {
                    id: item.id
                  })
                }
              />
            ))} */}



            <Calendar
            i18n="en"
            ref={calendar => {
              this.calendar = calendar;
            }}
            customI18n={customI18n}
            color={color}
            format="YYYY-MM-DD"
            minDate={this._handleFormatDate(new Date())}
            maxDate="2019-04-30"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onConfirm={this._confirmDate}
          />