import { withRouter } from "react-router-dom";

import { materialFeedbackServices } from 'Services/domain/ccp';
import Feedbacks from './feedbacks';

class MaterialFeebacks extends Feedbacks {

  _requestDataFromService = async (contractorId, criteria) => {
    return await materialFeedbackServices.getFeedbackBySupplierId(contractorId, criteria);
  };
}

MaterialFeebacks.defaultProps = {
  feedbackType: 'mateiral',
};

export default withRouter(MaterialFeebacks);
