import React from 'react';
import Step from './Step';
import PropTypes from 'prop-types';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';

import 'bootstrap-daterangepicker/daterangepicker.css';

import { fetchEquipmentTypes, fetchEquipmentTypeSpecs } from '../../../redux/actions/thunks';
import { connect } from 'react-redux';

class AddEquipmentStep3 extends Step {
  constructor (props) {
    super(props);

    this.state = {
    };
  }

    _onChangeDescription = (description) => {
      this.setState({ description });
    };

    _handleFieldChange = e => {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({
        [name]: value
      });
    };

    _handleSubmitForm = () => {
      this._handleStepDone({
        data: this.state
      });
    };

    render () {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h4 className="my-3">More information</h4>
            </div>
            <div className="col-md-6">
                        Upload thêm hình của bạn
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="">Mô tả</label>
                <FroalaEditor tag="textarea" config={{
                  placeholderText: 'Mô tả thiết bị của bạn',
                  maxLength: 10,
                  height: 260,
                  htmlExecuteScripts: false
                }} rows="10"
                model={this.state.description}
                onModelChange={this._onChangeDescription}
                />
              </div>
            </div>
            <div className="col-md-12 text-center">
              <div className="form-group">
                <button className="btn btn-outline-primary mr-2" onClick={this._handleBackStep}><i className="fa fa-chevron-left"></i> PREVIOUS STEP</button>
                <button className="btn btn-success ml-2" onClick={this._handleSubmitForm}>NEXT STEP <i className="fa fa-chevron-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

AddEquipmentStep3.propTypes = {
  entities: PropTypes.object.isRequired
};

export default connect(
  (state) => {
    return { entities: { ...state.entities } };
  },
  { fetchEquipmentTypes, fetchEquipmentTypeSpecs }
)(AddEquipmentStep3);
