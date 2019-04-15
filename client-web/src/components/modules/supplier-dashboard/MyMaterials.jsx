import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { routeConsts } from 'Common/consts';
import { getRoutePath } from 'Utils/common.utils';
import { materialServices } from 'Services/domain/ccp';
import { Pagination } from 'Components/common';

class MyMaterials extends PureComponent {
  state = {
    filterStatus: 'all',
    activePage: 1,
    isFetching: false
  };
  pageSize = 6;

  _loadData = async activePage => {
    this.setState({
      isFetching: true
    });
    
    const materials = await materialServices.getMaterialsBySupplierId({
      offset: (activePage - 1) * this.pageSize,
      limit: this.pageSize,
    });
    this.setState({
      activePage,
      materials,
      isFetching: false
    });
  };

  componentDidMount() {
    const { activePage } = this.state;
    this._loadData(activePage);
  }

  // Render loading placeholder
  _renderListPlaceholders = () => {
    const numOfPlaceholder = 6;

    const loadingPlacholders = [];
    for (let i = 0; i < numOfPlaceholder; i++) {
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
        <h2>You have no material!</h2>
        <Link to={getRoutePath(routeConsts.MATERIAL_ADD)}>
          <button className="btn btn-success btn-lg">
            <i className="fal fa-plus"></i> Add new material now
          </button>
        </Link>
      </div>
    );
  };

  // Render list materials
  _renderListMaterials = () => {
    const { materials, isFetching } = this.state;

    if (isFetching) {
      return this._renderListPlaceholders();
    }

    if (!materials || materials.items.length === 0) {
      return this._renderNoEquipment();
    }

    return (
      materials.items.map(equipment => {
        const thumbnail = equipment.thumbnailImageUrl || '/public/upload/product-images/unnamed-19-jpg.jpg';
        return (
          <div key={equipment.id} className="d-flex transaction my-3 rounded shadow-sm">
            <div className="image flex-fill">
              <img src={thumbnail} className="rounded-left" />
            </div>
            <div className="detail flex-fill p-2">
              <h6>
                <Link to={getRoutePath(routeConsts.MATERIAL_MY_DETAIL, {id: equipment.id})}>{equipment.name}</Link>
                <span className="float-right">
                  <Link to={getRoutePath(routeConsts.MATERIAL_EDIT, {id: equipment.id})} className="btn btn-outline-success btn-sm"><i className="fal fa-pencil"></i></Link>
                  <button className="btn btn-outline-danger btn-sm ml-2"><i className="fal fa-trash"></i></button>
                </span>
                <span className="clearfix"></span>
              </h6>
              <div><i className="fal fa-user-circle"></i> {equipment.manufacturer}</div>
              <div><i className="fal fa-money-bill"></i> {equipment.price}/{equipment.unit}</div>
              <div><i className="fal fa-bullseye"></i> {equipment.construction.name}</div>
            </div>
          </div>
        );
      })
    );
  };

  render() {
    const { materials, activePage } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>
              My materials
              <Link to={getRoutePath(routeConsts.MATERIAL_ADD)} className="float-right">
                <button className="btn btn-success">
                  <i className="fal fa-plus"></i> New material
                </button>
              </Link>
            </h4>
            {this._renderListMaterials()}
            {materials && materials.totalItems > this.pageSize &&
              <div className="text-center">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={this.pageSize}
                  totalItemsCount={materials.totalItems}
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

MyMaterials.props = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { user } = authentication;

  return {
    user
  };
};

export default connect(mapStateToProps)(MyMaterials);
