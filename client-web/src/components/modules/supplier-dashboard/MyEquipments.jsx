import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Pagination } from 'Components/common';

import { EQUIPMENT_SHOWABLE_STATUSES, routeConsts } from '../../../common/consts';
import { getRoutePath } from 'Utils/common.utils';
import { equipmentServices } from 'Services/domain/ccp';

class MyEquipments extends PureComponent {
  state = {
    filterStatus: 'all',
    activePage: 1
  };
  pageSize = 6;

  _loadData = async (activePage) => {
    const equipments = await equipmentServices.getEquipmentsByContractorId({
      offset: (activePage - 1) * this.pageSize,
      limit: this.pageSize,
    });

    this.setState({
      activePage,
      equipments: equipments
    });
  };

  componentDidMount() {
    const { activePage } = this.state;
    this._loadData(activePage);
  }

  // Render loading placeholder
  _renderListPlaceholders = () => {

    const loadingPlacholders = [];
    for (let i = 0; i < this.pageSize; i++) {
      loadingPlacholders.push(
        <div key={i} className="d-flex transaction my-3 rounded shadow-sm">
          <div className="image flex-fill">
            <Skeleton width={300} height={200} className="rounded-left" />
          </div>
          <div className="detail flex-fill p-2">
            <h6>
              <Skeleton width={300} />
              <span className="float-right">
                <Skeleton width={30} height={30}/>
                <span className="ml-2"><Skeleton width={30} height={30}/></span>
              </span>
              <span className="clearfix"></span>
            </h6>
            <div><Skeleton width={150}/></div>
          </div>
        </div>
      );
    }

    return loadingPlacholders;
  };

  // Render no equipment
  _renderNoEquipment = () => {
    return (
      <div className="py-5 text-center">
        <h2>You have no equipment!</h2>
        <Link to={getRoutePath(routeConsts.EQUIPMENT_ADD)} className="float-right">
          <button className="btn btn-success btn-lg">
            <i className="fal fa-plus"></i> Add new equipment now
          </button>
        </Link>
      </div>
    );
  };

  // Render list equipments
  _renderListEquipments = () => {
    const { equipments } = this.state;

    if (!equipments) {
      return this._renderListPlaceholders();
    }

    if (equipments.items.length === 0) {
      return this._renderNoEquipment();
    }

    return (
      equipments.items.map(equipment => {
        const thumbnail = equipment.thumbnailImage ? equipment.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
        return (
          <div key={equipment.id} className="d-flex transaction my-3 rounded shadow-sm">
            <div className="image flex-fill">
              <Link to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, {id: equipment.id})}>
                <img src={thumbnail} className="rounded-left" />
              </Link>
            </div>
            <div className="detail flex-fill p-2">
              <h6>
                <Link to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, {id: equipment.id})}>{equipment.name}</Link>
                <span className="float-right">
                  <Link to={getRoutePath(routeConsts.EQUIPMENT_EDIT, {id: equipment.id})} className="btn btn-outline-success btn-sm"><i className="fal fa-pencil"></i></Link>
                  <button className="btn btn-outline-danger btn-sm ml-2"><i className="fal fa-trash"></i></button>
                </span>
                <span className="clearfix"></span>
              </h6>
              <div>Status: {EQUIPMENT_SHOWABLE_STATUSES[equipment.status]}</div>
            </div>
          </div>
        );
      })
    );
  };

  render() {
    const { equipments, activePage } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>
              My equipments
              <Link to={getRoutePath(routeConsts.EQUIPMENT_ADD)} className="float-right">
                <button className="btn btn-success">
                  <i className="fal fa-plus"></i> New equipment
                </button>
              </Link>
            </h4>
            {this._renderListEquipments()}
            {equipments &&
              <div className="text-center">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={this.pageSize}
                  totalItemsCount={equipments.totalItems}
                  pageRangeDisplayed={5}
                  onChange={this._loadData}
                />
              </div>
            }
          </div>
          <div className="col-md-3">
            <div className="bg-dark text-light sticky-top sticky-sidebar py-5 text-center">USER MENU PLACEHOLDER</div>
          </div>
        </div>
      </div>
    );
  }
}

MyEquipments.props = {
  contractor: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { user } = authentication;
  const { contractor } = user;

  return {
    contractor
  };
};

export default connect(mapStateToProps)(MyEquipments);
