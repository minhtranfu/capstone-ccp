import React from 'react';
import Step from './Step';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validate from 'validate.js';

import { ENTITY_KEY } from '../../../common/app-const';
import { getValidateFeedback } from 'Utils/common.utils';
import { DATA_TYPE_RULES } from 'Common/consts/data-types.consts';

class AddEquipmentSpecs extends Step {
  state = {
    validateResult: {}
  };

  validateRules = {};
  stepData = {};

  _handleFieldChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.stepData[name] = value;

    this.setState({
      [name]: {
        additionalSpecsField: {
          id: +name
        },
        value
      }
    });
  };

  _handleSubmitForm = () => {
    
    const validateResult = validate(this.stepData, this.validateRules, {
      fullMessages: false
    });
    if (validateResult) {
      this.setState({
        validateResult
      });

      return;
    }

    const additionalSpecsValues = Object.keys(this.state).map(specKey => {
      return this.state[specKey];
    });

    this.setState({
      validateResult
    }, () => {
      this._handleStepDone({
        data: {
          additionalSpecsValues
        }
      });
    });
  };

  _getSelectedEquipmentTypeFields = () => {
    const { entities, currentState } = this.props;
    const equipmentTypes = entities[ENTITY_KEY.EQUIPMENT_TYPES].data || [];
    const { equipmentTypeId } = currentState;

    if (!equipmentTypeId) {
      return [];
    }

    // return old fields when equipment is not changed
    if (equipmentTypeId === this.equipmentTypeId) {
      return this.selectedEquipmentType.additionalSpecsFields;
    }
    this.equipmentTypeId = equipmentTypeId;

    // find selected equipment type from list
    this.selectedEquipmentType = equipmentTypes.find(equipmentType => +equipmentType.id === +equipmentTypeId);

    // Genarate validate rules
    this.validateRules = {};
    if (this.selectedEquipmentType && this.selectedEquipmentType.additionalSpecsFields) {
      this.selectedEquipmentType.additionalSpecsFields.forEach(field => {
        let rule = {
          presence: {
            allowEmpty: false,
            message: `${field.name} is required`
          },
        };

        if (DATA_TYPE_RULES[field.dataType]) {
          rule = {
            ...rule,
            ...DATA_TYPE_RULES[field.dataType]
          };
        }
        
        this.validateRules[field.id] = rule;
      });
    }

    return this.selectedEquipmentType ? this.selectedEquipmentType.additionalSpecsFields : [];
  };

  render() {
    const { validateResult } = this.state;
    const fields = this._getSelectedEquipmentTypeFields();

    return (
      <div className="row">
        <div className="col-md-12"><h4 className="mb-3">Specs</h4></div>
        {fields && fields.map(field => {
          return (
            <div key={field.id} className="col-md-6">
              <div className="form-group">
                <label htmlFor={`specs_${field.id}`}>{field.name} <i className="text-danger">*</i></label>
                <input className="form-control"
                  type={field.dataType}
                  id={`specs_${field.id}`}
                  name={field.id} onChange={this._handleFieldChange}
                />
                {getValidateFeedback(field.id, validateResult)}
              </div>
            </div>
          );
        })}
        <div className="col-12 text-center">
          <div className="form-group">
            <button className="btn btn-outline-primary mr-2"
              onClick={this._handleBackStep}>
              <i className="fal fa-chevron-left"></i> PREVIOUS STEP
            </button>
            <button className="btn btn-success ml-2"
              onClick={this._handleSubmitForm}>
              NEXT STEP <i className="fal fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

AddEquipmentSpecs.propTypes = {
  entities: PropTypes.object,
  currentState: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return { entities: { ...state.entities } };
};

export default connect(mapStateToProps, null)(AddEquipmentSpecs);
