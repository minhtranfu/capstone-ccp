import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import className from 'classnames';

import ccpApiService from '../../../services/domain/ccp-api-service';

class MyConstructions extends Component {
  state = {
    isFetching: true,
    isAddingConstruction: false
  };

  _loadData = async () => {
    const { contractor } = this.props;
    
    const constructions = await ccpApiService.getConstructionsByContractorId(contractor.id);
    this.setState({
      constructions,
      isFetching: false
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _handleChangeField = e => {
    const { construction } = this.state;

    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      construction: {
        ...construction,
        [name]: value
      }
    });
  };

  _handleSaveConstruction = () => {
    const { construction } = this.state;

    if (construction.id) {
      return this._updateConstruction();
    }

    this._postConstruction();
  };

  _postConstruction = async () => {
    const { constractor } = this.props;
    const { construction, constructions } = this.state;

    try {
      this.setState({ isFetching: true });
      const savedConstruction = await ccpApiService.postConstruction(constractor.id, construction);

      this.setState({
        constructions: [
          savedConstruction,
          ...constructions
        ],
        construction: null,
        isFetching: false,
        isAddingConstruction: false
      });
    } catch (error) {
      window.alert('Save error! ' + error.response.data.message);
    }
  };

  _updateConstruction = async () => {
    const { constractor } = this.props;
    const { construction, constructions } = this.state;

    try {
      this.setState({ isFetching: true });
      const res = await ccpApiService.updateConstruction(constractor.id, construction.id, construction);
      const updatedConstructions = constructions.map(item => {
        if (item.id !== construction.id) {
          return item;
        }

        return construction;
      });

      this.setState({
        constructions: updatedConstructions,
        edittingId: null,
        construction: null,
        isFetching: false
      });
    } catch (error) {
      window.alert('Save error! ' + error.response.data.message);
    }
  };

  _renderEditingConstructionCard = construction => {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="">Construction name: <i className="text-danger">*</i></label>
          <input type="text" className="form-control" name="name" onChange={this._handleChangeField} defaultValue={construction.name} autoFocus />
        </div>
        <div className="form-group">
          <label htmlFor="">Address: <i className="text-danger">*</i></label>
          <input type="text" className="form-control" name="address" onChange={this._handleChangeField} defaultValue={construction.address} />
        </div>
        <div className="form-group">
          <span className="float-right">
            <button className="btn btn-success btn-sm" onClick={this._handleSaveConstruction}><i className="fa fa-save"></i> Save</button>
            <button className="btn btn-outline-success btn-sm ml-2" onClick={() => this._setEdittingConstructionId(null)}><i className="fa fa-times"></i> Cancel</button>
          </span>
          <span className="clearfix"></span>
        </div>
      </div>
    );
  };

  _renderConstructionCard = construction => {
    return (
      <div style={{ height: "252px" }}>
        <h4 className="m-0">
          {construction.name}
          <span className="float-right">
            <button className="btn btn-outline-success btn-sm" onClick={() => this._setEdittingConstructionId(construction.id, construction)}><i className="fa fa-pencil"></i></button>
            <button className="btn btn-outline-danger btn-sm ml-2"><i className="fa fa-trash"></i></button>
          </span>
          <span className="clearfix"></span>
        </h4>
        <p>Address: {construction.address}</p>
      </div>
    );
  };

  _setEdittingConstructionId = (edittingId, construction) => {
    this.setState({
      edittingId,
      construction,
      isAddingConstruction: false
    });
  };

  _generatePlaceholders = () => {
    const result = [];

    for (let i = 0; i < 5; i++) {
      result.push(
        <div key={i} className={`construction-card bg-white shadow-sm my-3 p-3 rounded`}>
          <div style={{ height: "252px" }}>
            <h4 className="m-0">
              <Skeleton width={320}/>
              <span className="float-right">
                <Skeleton width={35}/>
                <span className="ml-2">
                  <Skeleton width={35}/>
                </span>
              </span>
              <span className="clearfix"></span>
            </h4>
            <p><Skeleton width={400}/></p>
          </div>
        </div>
      );
    }

    return result;
  };

  _toggleAddNewConstruction = () => {
    const { isAddingConstruction } = this.state;
    const newState = {
      isAddingConstruction: !isAddingConstruction,
      edittingId: null,
      construction: {}
    };

    this.setState(newState);
  };

  render() {
    const { constructions, isFetching, edittingId, isAddingConstruction, construction } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>My Constructions
              <button className="btn btn-success btn-sm float-right" onClick={this._toggleAddNewConstruction}>
                <i className={className('fa',{
                  'fa-times': isAddingConstruction,
                  'fa-plus': !isAddingConstruction
                  })}></i> {isAddingConstruction ? 'Close' : 'Add new'}
              </button>
            </h4>
            {!constructions && isFetching && this._generatePlaceholders()}
            {isAddingConstruction &&
              <div className={`construction-card editting bg-white shadow-sm my-3 p-3 rounded`}>
                {this._renderEditingConstructionCard(construction || {})}
              </div>
            }
            {constructions && constructions.map(construction => {
              return (
                <div key={construction.id} className={`construction-card ${construction.id === edittingId ? 'editting' : ''} bg-white shadow-sm my-3 p-3 rounded`}>
                  {construction.id === edittingId ? this._renderEditingConstructionCard(construction) : this._renderConstructionCard(construction)}
                </div>
              );
            })}
          </div>
          <div className="col-md-3">
            <div className="h-100 bg-dark text-light text-center">
              <h6>USER MENU PLACEHOLDER</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyConstructions.props = {
  authentication: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { user } = authentication;
  const { contractor } = user;

  return {
    contractor
  };
};

export default connect(mapStateToProps)(MyConstructions);
