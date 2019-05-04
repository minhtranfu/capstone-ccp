import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert/lib/dist/SweetAlert';
import { formatDate } from 'Utils/format.utils';
import { equipmentTransactionServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';

class ExtendTimeModal extends PureComponent {
  state = {
    isSending: false,
    isSubmitSuccess: false,
    request: null,
    requestedEndDate: null,
  };

  /**
   * Check date is invalid for disabling date of date range picker
   */
  _isInvalidDate = date => {
    const { extendableTimeRange } = this.props;

    return !extendableTimeRange || (
      date.isBefore(extendableTimeRange.beginDate) ||
      date.isAfter(extendableTimeRange.endDate)
    );
  };

  /**
   * Render error of submitting form
   */
  _renderError = () => {
    const { errorMessage } = this.state;

    if (!errorMessage) {
      return null;
    }

    return <span className="text-danger mr-auto">{errorMessage}</span>;
  };

  /**
   * Reset modal data and call close modal
   */
  _handleCloseModal = () => {
    const { request, isSubmitSuccess } = this.state;
    const { onClose } = this.props;
    // Reset form
    this.data = {};
    this.setState({
      validateResult: {},
      requestedEndDate: null,
    });

    onClose && onClose(request, isSubmitSuccess);
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
      />
    );
  };

  /**
   * Handle changing date range
   */
  _onChangeDateRanage = (e, picker) => {

    this.setState({
      requestedEndDate: picker.startDate,
    });
  };

  /**
   * Get label for show value of date range picker
   */
  _getLabelOfRange = () => {
    const { requestedEndDate } = this.state;

    if (!requestedEndDate) {
      return 'Pick a date';
    }

    return formatDate(requestedEndDate);
  };

  /**
   * Close success alert
   */
  _closeSuccessAlert = () => {
    this.setState(
      {
        isSubmitSuccess: undefined,
      },
      () => {
        this._handleCloseModal();
      }
    );
  };

  _renderForm = () => {
    const { transaction } = this.props;

    if (!transaction) {
      return null;
    }

    return (
      <div>
        <h6>Current hiring time:</h6>
        <div>
          {formatDate(transaction.beginDate)} - {formatDate(transaction.endDate)}
        </div>
        <div className="form-group">
          <label htmlFor="extend_end_date">
            Extend hiring time to: <i className="text-danger">*</i>
          </label>
          <DateRangePicker
            singleDatePicker
            isInvalidDate={this._isInvalidDate}
            minDate={moment()}
            onApply={this._onChangeDateRanage}
            containerClass="w-100"
          >
            <div className="input-group date-range-picker">
              <input
                type="text"
                id="timeRange"
                className="form-control"
                readOnly
                value={this._getLabelOfRange() || ''}
              />
              <div className="input-group-append">
                <button className="input-group-text bg-primary text-white" id="basic-addon2">
                  <i className="fal fa-calendar" />
                </button>
              </div>
            </div>
          </DateRangePicker>
        </div>
      </div>
    );
  };

  _hanleSubmit = async e => {
    e.preventDefault();
    const { requestedEndDate } = this.state;
    const { transaction } = this.props;

    try {
      const data = {
        hiringTransactionEntity: {
          id: transaction.id,
        },
        requestedEndDate: requestedEndDate.format('YYYY-MM-DD'),
      };
      const requestResult = await equipmentTransactionServices.extendHiringTime(data);

      this.setState({
        request: requestResult,
        isSubmitSuccess: true,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFetching: false,
      });
    }
  };

  render() {
    const { isOpen, className } = this.props;
    const { isSending } = this.state;

    return (
      <div>
        {this._renderAlert()}
        <Modal isOpen={isOpen} toggle={this._handleCloseModal} className={className} size="md">
          <form onSubmit={this._hanleSubmit}>
            <ModalHeader toggle={this._handleCloseModal}>Extend hiring time</ModalHeader>
            <ModalBody>{this._renderForm()}</ModalBody>
            <ModalFooter>
              {this._renderError()}
              <button type="submit" className="btn btn-primary" disabled={!!isSending}>
                {isSending && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}{' '}
                Send
              </button>
              <button
                type="button"
                className="btn btn-outline-info"
                onClick={this._handleCloseModal}
              >
                Cancel
              </button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}

export default ExtendTimeModal;
