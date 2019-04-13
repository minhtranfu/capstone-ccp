import { Component } from 'react';
import PropTypes from 'prop-types';

class Step extends Component {
    _handleStepDone = async (data) => {
      const { onStepDone } = this.props;
      onStepDone && await onStepDone(data);
    };

    _handleBackStep = () => {
      const { onBackStep } = this.props;
      onBackStep && onBackStep();
    };
}

Step.propTypes = {
  onStepDone: PropTypes.func.isRequired,
  onBackStep: PropTypes.func.isRequired,
  currentState: PropTypes.object.isRequired
};

export default Step;
