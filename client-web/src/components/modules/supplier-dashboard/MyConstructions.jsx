import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import ccpApiService from '../../../services/domain/ccp-api-service';

class MyConstructions extends Component {
  state = {
    isFetching: true
  };

  _loadData = async () => {
    const { user } = this.props;
    
    const constructions = await ccpApiService.getConstructionsByContractorId(user.id);
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

  _handleSaveConstruction = async () => {
    const { user } = this.props;
    const { construction, constructions } = this.state;

    try {
      this.setState({ isFetching: true });
      const res = await ccpApiService.updateConstruction(user.id, construction.id, construction);
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
          <label htmlFor="">Construction name:</label>
          <input type="text" className="form-control" name="name" onChange={this._handleChangeField} defaultValue={construction.name} autoFocus />
        </div>
        <div className="form-group">
          <label htmlFor="">Address:</label>
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
    this.setState({ edittingId, construction });
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

  render() {
    const { constructions, isFetching, edittingId } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>My Constructions <button className="btn btn-success btn-sm float-right"><i className="fa fa-plus"></i> Add new</button></h4>
            {!constructions && isFetching && this._generatePlaceholders()}
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
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { user } = state;

  return {
    user
  };
};

export default connect(mapStateToProps)(MyConstructions);
