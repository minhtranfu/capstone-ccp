import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';
import SweetAlert from 'react-bootstrap-sweetalert';
import StarRatings from 'react-star-ratings';

import { feedbackServices } from 'Services/domain/ccp';

class RatingModal extends Component {

  state = {
    validateResult: {},
    rating: 0,
  };
  // Store data of fields
  data = {};
  // Store ref of fields
  formFields = {};

  // /**
  //  * Load feedback types if not be loaded
  //  */
  // componentDidMount() {
  //   const { feedbackTypeEntity, fetchFeedbackTypes } = this.props;
  //   if (!feedbackTypeEntity.data || !feedbackTypeEntity.data.length === 0) {
  //     fetchFeedbackTypes();
  //   }
  // }

  // /**
  //  * Focus an field when modal entered
  //  */
  // _focusInput = () => {
  //   const { feedbackTypeId } = this.formFields;
  //   feedbackTypeId && feedbackTypeId.focus();
  // };

  /**
   * Handle form submit event
   * Validate form and submit form
   */
  _hanleSubmit = async e => {
    e.preventDefault();
    
    const validateResult = this._validateForm();

    if (!validateResult.isValid) {
      this._focusInputOnInvalid(validateResult);

      this.setState({
        validateResult
      });

      return;
    }

    const { transaction } = this.props;

    // Submit form
    this.setState({
      validateResult,
      isSending: true
    });
    this.data.debrisTransaction = {
      id: transaction.id
    }
    try {
      const feebback = await feedbackServices.feedbackDebris(this.data);

      // Submit success, close modal
      this.setState({
        isSending: false,
        isSubmitSuccess: true,
        feebback
      });
    } catch (error) {
      this.setState({
        isSending: false,
        error
      });
    }
  };

  /**
   * Focus on first field has invalid value
   */
  _focusInputOnInvalid = (validateResult) => {
    const { isValid, ...fields } = validateResult;

    const firstFieldName = Object.keys(fields)[0];
    this.formFields[firstFieldName] && this.formFields[firstFieldName].focus();
  };

  /**
   * Validate form
   */
  _validateForm = () => {
    const { rating, content } = this.data;
    const result = {
      isValid: true
    };

    if (!rating) {
      result.isValid = false;
      result.rating = 'Please rate';
    }

    if (!content) {
      result.isValid = false;
      result.content = 'Please choose a reason';
    } else if (content.length < 10) {
      result.isValid = false;
      result.content = 'Feedback content must at least 10 characters';
    }

    return result;
  };

  /**
   * Handle when user change field value
   */
  _handleFieldChange = e => {
    let { name, value } = e.target;

    if (!isNaN(value)) {
      value = +value;
    }

    this.data[name] = value;
  };

  /**
   * Get feedback message from validate result for a field
   */
  _getValidateFeeback = fieldName => {
    const { validateResult } = this.state;

    if (!validateResult[fieldName]) {
      return null;
    }

    return (
      <div className="invalid-feedback d-block">
        {validateResult[fieldName]}
      </div>
    );
  };

  // /**
  //  * Render equipment and partner information of transaction
  //  */
  // _renderTransactionInfo = () => {
  //   const { transaction, contractor } = this.props;

  //   if (!transaction) {
  //     return null;
  //   }

  //   const partner = transactionUtils.getTransactionPartner(transaction, contractor);
  //   const thumbnail = transaction.equipment.thumbnailImage ? transaction.equipment.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
  //   const { equipment } = transaction;
  //   return (
  //     <div className="row mb-3">
  //       <div className="col-md-6">
  //         <div className="d-flex">
  //           <div className="mr-2">
  //             <img src={thumbnail} alt="Equipment images" style={{maxHeight: '80px'}}/>
  //           </div>
  //           <div className="flex-fill">
  //             <div><strong>{equipment.name}</strong></div>
  //             <div className="text-muted">From: {transaction.beginDate}</div>
  //             <div className="text-muted">To: {transaction.endDate}</div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="col-md-6">
  //         <div className="d-flex">
  //           <div className="mr-2">
  //             <img src={partner.thumbnailImageUrl} alt={`${partner.name}'s avatar`} style={{width: '50px', height: '50px'}}/>
  //           </div>
  //           <div className="flex-fill">
  //             <div><strong>{partner.name}</strong></div>
  //             <div className="text-muted">{moment(parent.createdTime).format('DD-MM-YYY')}</div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  /**
   * Render form fields
   */
  _renderForm = () => {
    const { transaction } = this.props;
    const { validateResult } = this.state;

    if (!transaction) {
      return null;
    }

    return (
      <div>
        <div className="form-group">
          <label>Rate for this supplier: <i className="text-danger">*</i></label>
          <div className="text-center">
            <StarRatings
              rating={this.state.rating}
              numberOfStars={5}
              changeRating={this._changeRating}
              starRatedColor="#ffac00"
              starDimension="40px"
              starSpacing="10px"
            />
            {this._getValidateFeeback('rating')}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="feedback_content">Feedback: <i className="text-danger">*</i></label>
          <textarea
            name="content"
            id="feedback_content"
            cols="30" rows="5"
            placeholder="Please fill in your feedback"
            className={classnames('form-control', {'is-invalid': validateResult.content})}
            ref={(e) => { this.formFields.content = e; }}
            onChange={this._handleFieldChange}
            ></textarea>
          {this._getValidateFeeback('content')}
        </div>
      </div>
    );
  };

  /**
   * Render error of submitting form
   */
  _renderError = () => {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    if (error.response && error.response.data) {
      return (
        <span className="text-danger float-left">{error.response.data.message}</span>
      );
    }

    return (
      <span className="text-danger mr-auto">{error.message}</span>
    );
  };

  /**
   * Reset modal data and call close modal
   */
  _handleCloseModal = () => {
    const { feebback } = this.state;
    const { onClose } = this.props;
    // Reset form
    this.data = {};
    this.setState({
      validateResult: {}
    });

    onClose && onClose(feebback);
  };

  /**
   * Render alert for submit success
   */
  _renderAlert = () => {
    const { isSubmitSuccess } = this.state;

    if (!isSubmitSuccess) {
      return null;
    }

    return (
      <SweetAlert
        success
        focusConfirmBtn
        confirmBtnText="OK"
        confirmBtnBsStyle="primary"
        title="Send feedback successfully!"
        onConfirm={this._closeSuccessAlert}
        onCancel={this._closeSuccessAlert}
      >
      </SweetAlert>
    );
  };

  /**
   * Close success alert
   */
  _closeSuccessAlert = () => {

    this.setState({
      isSubmitSuccess: undefined
    }, () => {
      this._handleCloseModal();
    });
  };

  _changeRating = rating => {
    this.data.rating = rating;
    this.setState({
      rating
    });
  };

  render() {
    const { isOpen, className } = this.props;
    const { isSending } = this.state;

    return (
      <div>
        {this._renderAlert()}
        <Modal isOpen={isOpen} toggle={this._handleCloseModal} className={className} size="lg" onOpened={this._focusInput}>
          <form onSubmit={this._hanleSubmit}>
            <ModalHeader toggle={this._handleCloseModal}>Feedback transaction</ModalHeader>
            <ModalBody>
              {/* {this._renderTransactionInfo()} */}
              {this._renderForm()}
            </ModalBody>
            <ModalFooter>
              {this._renderError()}
              <button type="submit" className="btn btn-success" disabled={!!isSending}>
                {isSending && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Send
              </button>
              <span tabIndex="0" className="btn btn-outline-info" onClick={this._handleCloseModal}>Cancel</span>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}

RatingModal.props = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  transaction: PropTypes.object.isRequired,
};

// const mapStateToProps = state => {
//   const { entities, authentication } = state;
//   const { user } = authentication;
//   const { contractor } = user;

//   return {
//     feedbackTypeEntity: entities[ENTITY_KEY.FEEDBACK_TYPES],
//     contractor
//   };
// };

export default connect()(RatingModal);
