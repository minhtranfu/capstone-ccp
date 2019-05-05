import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import className from 'classnames';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { AddressInput, ComponentBlocking, PopConfirm } from 'Components/common';
import { getErrorMessage } from 'Utils/common.utils';
import { withTranslation } from 'react-i18next';
import { constructionServices } from 'Services/domain/ccp';

class MyConstructions extends Component {
  state = {
    isFetching: true,
    isAddingConstruction: false,
    isPosting: false,
    isUpdating: false,
    isDeleting: false,
    errorMessage: null,
  };

  _loadData = async () => {
    const { contractor } = this.props;

    const constructions = await ccpApiService.getConstructionsByContractorId(contractor.id);
    this.setState({
      constructions,
      isFetching: false,
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
        [name]: value,
      },
    });
  };

  _handleSelectAddress = location => {
    const { construction } = this.state;
    const { longitude, latitude, address } = location;

    this.setState({
      construction: {
        ...construction,
        longitude,
        latitude,
        address,
      },
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
    const { contractor } = this.props;
    const { construction, constructions } = this.state;

    try {
      this.setState({ isPosting: true, errorMessage: null });
      const savedConstruction = await ccpApiService.postConstruction(contractor.id, construction);

      this.setState({
        constructions: [savedConstruction, ...constructions],
        construction: null,
        isPosting: false,
        isAddingConstruction: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isPosting: false,
      });
    }
  };

  _updateConstruction = async () => {
    const { contractor } = this.props;
    const { construction, constructions } = this.state;

    try {
      this.setState({ isUpdating: true, errorMessage: null });
      const res = await ccpApiService.updateConstruction(
        contractor.id,
        construction.id,
        construction
      );
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
        isUpdating: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isUpdating: false,
      });
    }
  };

  _renderEditingConstructionCard = construction => {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="">
            Construction name: <i className="text-danger">*</i>
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            onChange={this._handleChangeField}
            defaultValue={construction.name}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="">
            Address: <i className="text-danger">*</i>
          </label>
          {/* <input type="text" className="form-control" name="address" onChange={this._handleChangeField} defaultValue={construction.address} /> */}
          <AddressInput onSelect={this._handleSelectAddress} address={construction.address || ''} />
        </div>
        <div className="form-group">
          <span className="float-right">
            <button className="btn btn-success btn-sm" onClick={this._handleSaveConstruction}>
              <i className="fal fa-save" /> Save
            </button>
            <button
              className="btn btn-outline-primary btn-sm ml-2"
              onClick={() => this._setEdittingConstructionId(null)}
            >
              <i className="fal fa-times" /> Cancel
            </button>
          </span>
          <span className="clearfix" />
        </div>
      </div>
    );
  };

  // Handle delete construction
  _handleDeleteConstruction = async id => {
    this.setState({
      isDeleting: true,
      errorMessage: null,
    });
    const { contractor } = this.props;

    try {
      const isDeleted = await constructionServices.deleteConstruction(contractor.id, id);
      const { constructions } = this.state;

      this.setState({
        isDeleting: false,
        constructions: constructions.filter(construction => construction.id !== id),
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isDeleting: false,
      });
    }
  };

  _renderShowingConstructionCard = construction => {
    return (
      <div style={{ height: '252px' }}>
        <h4 className="m-0">
          {construction.name}
          <span className="float-right">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => this._setEdittingConstructionId(construction.id, construction)}
            >
              <i className="fal fa-edit" />
            </button>
            <button
              id={`_${construction.id}-delete`}
              className="btn btn-outline-danger btn-sm ml-2"
            >
              <i className="fal fa-trash" />
              <PopConfirm
                target={`_${construction.id}-delete`}
                title="Delete this construction?"
                message="Are you sure to delete this construction?"
                confirmText="Yes, delete it"
                onConfirm={() => this._handleDeleteConstruction(construction.id)}
              />
            </button>
          </span>
          <span className="clearfix" />
        </h4>
        <p>Address: {construction.address}</p>
      </div>
    );
  };

  _renderConstructionCard = construction => {
    const { edittingId } = this.state;

    return (
      <CSSTransition key={construction.id} timeout={500} classNames="item">
        <div
          className={`construction-card ${
            construction.id === edittingId ? 'editting' : ''
          } bg-white shadow-sm my-3 p-3 rounded`}
        >
          {construction.id === edittingId
            ? this._renderEditingConstructionCard(construction)
            : this._renderShowingConstructionCard(construction)}
        </div>
      </CSSTransition>
    );
  };

  _setEdittingConstructionId = (edittingId, construction) => {
    this.setState({
      edittingId,
      construction,
      isAddingConstruction: false,
    });
  };

  _generatePlaceholders = () => {
    const result = [];

    for (let i = 0; i < 5; i++) {
      result.push(
        <div key={i} className={`construction-card bg-white shadow-sm my-3 p-3 rounded`}>
          <div style={{ height: '252px' }}>
            <h4 className="m-0">
              <Skeleton width={320} />
              <span className="float-right">
                <Skeleton width={35} />
                <span className="ml-2">
                  <Skeleton width={35} />
                </span>
              </span>
              <span className="clearfix" />
            </h4>
            <p>
              <Skeleton width={400} />
            </p>
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
      construction: {},
    };

    this.setState(newState);
  };

  _renderComponentBlocking = () => {
    const { isDeleting, isPosting, isUpdating } = this.state;
    const { t } = this.props;

    if (isDeleting) {
      return <ComponentBlocking message={t('common.deleting')} />;
    }

    if (isPosting || isUpdating) {
      return <ComponentBlocking message={t('common.processing')} />;
    }
  };

  _renderError = () => {
    const { errorMessage } = this.state;

    if (!errorMessage) {
      return null;
    }

    return (
      <div className="my-2 alert alert-warning">
        <i className="fal fa-info-circle" /> {errorMessage}
      </div>
    );
  };

  render() {
    const { constructions, isFetching, isAddingConstruction, construction } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>
              My Constructions
              <button
                className="btn btn-success btn-sm float-right"
                onClick={this._toggleAddNewConstruction}
              >
                <i
                  className={className('fa', {
                    'fa-times': isAddingConstruction,
                    'fa-plus': !isAddingConstruction,
                  })}
                />{' '}
                {isAddingConstruction ? 'Close' : 'Add new'}
              </button>
            </h4>
            <div className="clearfix" />
            {this._renderError()}
            {this._renderComponentBlocking()}
            {!constructions && isFetching && this._generatePlaceholders()}
            {isAddingConstruction && (
              <div className={`construction-card editting bg-white shadow-sm my-3 p-3 rounded`}>
                {this._renderEditingConstructionCard(construction || {})}
              </div>
            )}
            {constructions && constructions.map(this._renderConstructionCard)}
          </div>
          <div className="col-md-3" />
        </div>
      </div>
    );
  }
}

MyConstructions.props = {
  authentication: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(withTranslation()(MyConstructions));
