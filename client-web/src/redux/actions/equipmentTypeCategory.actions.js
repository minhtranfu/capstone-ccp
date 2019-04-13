import { equipmentTypeCategoryActionTypes } from "Redux/_types";
import { equipmentServices } from "Services/domain/ccp";
import { getErrorMessage } from "Utils/common.utils";

export const equipmentTypeCategoryActions = {
  loadAllCategories,
};

function loadAllCategories() {
  return async dispatch => {
    dispatch({
      type: equipmentTypeCategoryActionTypes.EQUIPMENT_TYPE_CATEGORY_ALL_REQUEST,
    });

    try {
      const items = await equipmentServices.getEquipmentTypeCategories();
      dispatch({
        type: equipmentTypeCategoryActionTypes.EQUIPMENT_TYPE_CATEGORY_ALL_SUCCESS,
        items,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: equipmentTypeCategoryActionTypes.EQUIPMENT_TYPE_CATEGORY_ALL_FAILURE,
        errorMessage,
      });
    }
  };
};
