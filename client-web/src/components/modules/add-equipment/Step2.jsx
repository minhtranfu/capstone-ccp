import React from 'react';
import Step from './Step';
import { connect } from 'react-redux';

import { ENTITY_KEY } from '../../../common/app-const';

class AddEquipmentSpecs extends Step {
  constructor (props) {
    super(props);

    this.state = {
    };
  }

    _handleSubmitForm = () => {
      // Todo: Validate form

      this._handleStepDone({
        data: this.state
      });
    };

    _handleFieldChange = e => {
      const name = e.target.name;
      const value = e.target.value;

      this.setState({
        [name]: {
          name,
          value
        }
      });
    };

    _handleSubmitForm = () => {
      // Todo: Validate form

      const additionalSpecsValues = Object.keys(this.state).map(specKey => {
        return this.state[specKey];
      });
      this._handleStepDone({
        data: {
          additionalSpecsValues
        }
      });
    };

    render () {
      const { entities } = this.props;
      const equipmentTypeInfos = entities[ENTITY_KEY.EQUIPMENT_TYPE_INFOS];

      return (
        <div className="row">
          <div className="col-md-12"><h4 className="mb-3">Specs</h4></div>
          {equipmentTypeInfos && equipmentTypeInfos.data && equipmentTypeInfos.data.map(field => {
            return (
              <div key={field.id} className="col-md-6">
                <div className="form-group">
                  <label htmlFor="">{field.name}</label>
                  <input type={field.dataType} name={field.id} onChange={this._handleFieldChange} className="form-control" />
                </div>
              </div>
            );
          })}
          <div className="col-12 text-center">
            <div className="form-group">
              <button className="btn btn-outline-primary mr-2" onClick={this._handleBackStep}><i className="fa fa-chevron-left"></i> PREVIOUS STEP</button>
              <button className="btn btn-success ml-2" onClick={this._handleSubmitForm}>NEXT STEP <i className="fa fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      );
    }
}

const mapStateToProps = state => {
  return { entities: { ...state.entities } };
};

export default connect(mapStateToProps, null)(AddEquipmentSpecs);
