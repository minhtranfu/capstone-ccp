import React, { PureComponent } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Pagination, Image, PopConfirm, ComponentBlocking } from 'Components/common';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';

import { EQUIPMENT_SHOWABLE_STATUSES, routeConsts, CONTRACTOR_STATUSES } from 'Common/consts';
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import { equipmentServices } from 'Services/domain/ccp';

class MyEquipments extends PureComponent {
  constructor(props) {
    super(props);

    const queryParams = qs.parse(props.location.search);
    this.state = {
      status: queryParams.status || 'all',
      page: +queryParams.page || 1,
      isFetching: false,
      isFirstLoad: true,
      isDeleting: false,
      deleteError: null,
    };
  }

  pageSize = 6;

  _loadData = async ({ status, page }) => {
    const { history } = this.props;
    const { isFirstLoad } = this.state;

    if (!isFirstLoad) {
      if (status === this.state.status && page === this.state.page) {
        return;
      }

      const newUrl = getRoutePath(routeConsts.EQUIPMENT_MY);
      let queryString = '';
      if (status !== 'all' || page != 1) {
        queryString = qs.stringify({
          status,
          page,
        });
      }

      if (queryString) {
        queryString = `?${queryString}`;
      }

      history.push(`${newUrl}${queryString}`);
    }

    this.setState({
      isFetching: true,
    });

    const equipments = await equipmentServices.getEquipmentsByContractorId({
      offset: (page - 1) * this.pageSize,
      limit: this.pageSize,
      status: status === 'all' ? undefined : status,
    });

    this.setState({
      page,
      status,
      equipments: equipments,
      isFetching: false,
      isFirstLoad: false,
    });
  };

  componentDidMount() {
    const { page, status } = this.state;
    this._loadData({
      status,
      page,
    });
  }

  // Render loading placeholder
  _renderListPlaceholders = () => {
    const loadingPlacholders = [];
    for (let i = 0; i < this.pageSize; i++) {
      loadingPlacholders.push(
        <div key={i} className="d-flex transaction my-3 rounded shadow-sm">
          <div className="image flex-fill">
            <Skeleton width={300} height={168} className="rounded-left" />
          </div>
          <div className="detail flex-fill p-2">
            <h6>
              <Skeleton width={300} />
              <span className="float-right">
                <Skeleton width={30} height={30} />
                <span className="ml-2">
                  <Skeleton width={30} height={30} />
                </span>
              </span>
              <span className="clearfix" />
            </h6>
            <div>
              <Skeleton width={150} />
            </div>
          </div>
        </div>
      );
    }

    return loadingPlacholders;
  };

  // Render no equipment
  _renderNoEquipment = () => {
    const { contractor, t } = this.props;

    // Verify account to add new
    if (contractor.status !== CONTRACTOR_STATUSES.ACTIVATED) {
      return (
        <div className="py-5 text-center">
          <h2>Your account is not activated!</h2>
          <p className="text-muted my-2">What you need to do?</p>
          <Link to={getRoutePath(routeConsts.PROFILE)}>
            <button className="btn btn-success btn-lg">Post images to verify</button>
          </Link>
        </div>
      );
    }

    return (
      <div className="py-5 text-center">
        <h2>You have no equipment!</h2>
        <Link to={getRoutePath(routeConsts.EQUIPMENT_ADD)}>
          <button className="btn btn-success btn-lg">
            <i className="fal fa-plus" /> {t('equipment.newNow')}
          </button>
        </Link>
      </div>
    );
  };

  _handleDeleteEquipment = async id => {
    this.setState({
      isDeleting: true,
      deleteError: null,
    });

    try {
      const isDeleted = await equipmentServices.deleteEquipment(id);
      const { equipments } = this.state;

      this.setState({
        isDeleting: false,
        equipments: {
          ...equipments,
          items: equipments.items.filter(equipment => equipment.id !== id)
        },
      });
    } catch (error) {
      const deleteError = getErrorMessage(error);

      this.setState({
        deleteError,
        isDeleting: false,
      });
    }
  };

  _renderEquipmentCard = equipment => {
    const thumbnail = equipment.thumbnailImage
      ? equipment.thumbnailImage.url
      : '/public/upload/product-images/unnamed-19-jpg.jpg';

    return (
      <div className="d-flex transaction my-3 rounded shadow-sm">
        <div className="image flex-fill">
          <Link to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, { id: equipment.id })}>
            <Image src={thumbnail} className="rounded-left" height={168} />
          </Link>
        </div>
        <div className="detail flex-fill p-2">
          <h6>
            <Link to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, { id: equipment.id })}>
              {equipment.name}
            </Link>
            <span className="float-right">
              <Link
                to={getRoutePath(routeConsts.EQUIPMENT_EDIT, { id: equipment.id })}
                className="btn btn-outline-primary btn-sm"
              >
                <i className="fal fa-edit" />
              </Link>
              <button id={`_${equipment.id}-delete`} className="btn btn-outline-danger btn-sm ml-2">
                <i className="fal fa-trash" />
                <PopConfirm
                  target={`_${equipment.id}-delete`}
                  title="Delete this equipment?"
                  message="Are you sure to delete this equipment? All pending requests will be denied, all transactions of this equipment will be kept!"
                  onConfirm={() => this._handleDeleteEquipment(equipment.id)}
                  confirmText="Yes, delete it"
                />
              </button>
            </span>
            <span className="clearfix" />
          </h6>
          <div>Status: {EQUIPMENT_SHOWABLE_STATUSES[equipment.status]}</div>
        </div>
      </div>
    );
  };

  // Render list equipments
  _renderListEquipments = () => {
    const { equipments, isFetching } = this.state;

    if (isFetching) {
      return this._renderListPlaceholders();
    }

    if (!equipments || equipments.items.length === 0) {
      return this._renderNoEquipment();
    }

    const cards = equipments.items.map(equipment => {
      return (
        <CSSTransition key={equipment.id} timeout={500} classNames="item">
          {this._renderEquipmentCard(equipment)}
        </CSSTransition>
      );
    });

    return <TransitionGroup>{cards}</TransitionGroup>;
  };

  _handleStatusChanged = e => {
    const { value: status } = e.target;

    this._loadData({
      status,
      page: 1,
    });
  };

  _renderStatusFilter = () => {
    const { status } = this.state;

    const options = Object.keys(EQUIPMENT_SHOWABLE_STATUSES).map(status => {
      return (
        <option value={status} key={status}>
          {EQUIPMENT_SHOWABLE_STATUSES[status]}
        </option>
      );
    });

    return (
      <span className="form-inline d-inline">
        <select
          name="equipment_status"
          className="form-control form-control-sm ml-3"
          value={status}
          onChange={this._handleStatusChanged}
        >
          <option value="all">All</option>
          {options}
        </select>
      </span>
    );
  };

  _handlePageChanged = page => {
    const { status } = this.state;

    this._loadData({
      page,
      status,
    });
  };

  render() {
    const { equipments, page, isDeleting, deleteError } = this.state;
    const { t, contractor } = this.props;

    return (
      <div className="container py-4">
        {isDeleting && <ComponentBlocking message="Deleting..." />}
        <div className="row">
          <div className="col-md-9">
            <h4 className="d-inline">{t('menu.equipments.my')}</h4>
            {contractor.status === CONTRACTOR_STATUSES.ACTIVATED &&
              this._renderStatusFilter()
            }
            {contractor.status === CONTRACTOR_STATUSES.ACTIVATED &&
              <Link to={getRoutePath(routeConsts.EQUIPMENT_ADD)} className="float-right">
                <button className="btn btn-success">
                  <i className="fal fa-plus" /> {t('equipment.new')}
                </button>
              </Link>
            }
            <div className="clearfix" />
            {deleteError &&
              <div className="my-2 alert alert-warning">
                <i className="fal fa-info-circle"></i> {deleteError}
              </div>
            }
            {this._renderListEquipments()}
            {equipments && equipments.totalItems > this.pageSize && (
              <div className="text-center">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={this.pageSize}
                  totalItemsCount={equipments.totalItems}
                  pageRangeDisplayed={5}
                  onChange={this._handlePageChanged}
                />
              </div>
            )}
          </div>
          <div className="col-md-3" />
        </div>
      </div>
    );
  }
}

MyEquipments.props = {
  contractor: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(withTranslation()(withRouter(MyEquipments)));
