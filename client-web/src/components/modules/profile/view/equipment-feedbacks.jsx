import { withRouter } from "react-router-dom";

import { equipmentFeedbackServices } from 'Services/domain/ccp';
import Feedbacks from './feedbacks';

class EquipmentFeebacks extends Feedbacks {

  _requestDataFromService = async (contractorId, criteria) => {
    return await equipmentFeedbackServices.getFeedbackBySupplierId(contractorId, criteria);
  };
}

EquipmentFeebacks.defaultProps = {
  feedbackType: 'equipment',
};

export default withRouter(EquipmentFeebacks);
