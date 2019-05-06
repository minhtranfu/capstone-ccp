import { withRouter } from "react-router-dom";

import { debrisFeedbackServices } from 'Services/domain/ccp';
import Feedbacks from './feedbacks';

class DebrisFeebacks extends Feedbacks {

  _requestDataFromService = async (contractorId, criteria) => {
    return await debrisFeedbackServices.getFeedbackBySupplierId(contractorId, criteria);
  };
}

DebrisFeebacks.defaultProps = {
  feedbackType: 'debris',
};

export default withRouter(DebrisFeebacks);
