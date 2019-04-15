import { constructionActionTypes } from "Redux/_types";
import { constructionServices } from "Services/domain/ccp";
import { getErrorMessage } from "Utils/common.utils";

export const constructionActions = {
  loadAllConstructions,
};

function loadAllConstructions(contractorId) {
  return async dispatch => {
    dispatch({
      type: constructionActionTypes.CONSTRUCTION_ALL_REQUEST,
    });

    try {
      const items = await constructionServices.getConstructionsByContractorId(contractorId);
      dispatch({
        type: constructionActionTypes.CONSTRUCTION_ALL_SUCCESS,
        items,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: constructionActionTypes.CONSTRUCTION_ALL_FAILURE,
        errorMessage,
      });
    }
  };
};
