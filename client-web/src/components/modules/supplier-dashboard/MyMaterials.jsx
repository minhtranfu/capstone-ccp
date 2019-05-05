import React, { PureComponent } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { routeConsts } from 'Common/consts';
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import { materialServices } from 'Services/domain/ccp';
import { Pagination, Image, PopConfirm, ComponentBlocking } from 'Components/common';
import { formatPrice } from 'Utils/format.utils';

class MyMaterials extends PureComponent {
  state = {
    filterStatus: 'all',
    activePage: 1,
    isFetching: false,
    isDeleting: false,
    deleteError: null,
  };
  pageSize = 6;

  _loadData = async activePage => {
    this.setState({
      isFetching: true,
    });

    const materials = await materialServices.getMaterialsBySupplierId({
      offset: (activePage - 1) * this.pageSize,
      limit: this.pageSize,
    });
    this.setState({
      activePage,
      materials,
      isFetching: false,
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

  _handleDeleteMaterial = async id => {
    this.setState({
      isDeleting: true,
      deleteError: null,
    });

    try {
      const isDeleted = await materialServices.deleteMaterial(id);
      const { materials } = this.state;

      this.setState({
        isDeleting: false,
        materials: {
          ...materials,
          items: materials.items.filter(material => material.id !== id)
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

  // Render no equipment
  _renderNoEquipment = () => {
    return (
      <div className="py-5 text-center">
        <h2>You have no material!</h2>
        <Link to={getRoutePath(routeConsts.MATERIAL_ADD)}>
          <button className="btn btn-success btn-lg">
            <i className="fal fa-plus" /> Add new material now
          </button>
        </Link>
      </div>
    );
  };

  _renderMaterialCard = material => {
    const thumbnail =
      material.thumbnailImageUrl || '/public/upload/product-images/unnamed-19-jpg.jpg';

    return (
      <CSSTransition key={material.id} timeout={500} classNames="item">
        <div className="d-flex transaction my-3 rounded shadow-sm">
          <div className="image flex-fill">
            <Image src={thumbnail} className="rounded-left" />
          </div>
          <div className="detail flex-fill p-2">
            <h6>
              <Link to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}>
                {material.name}
              </Link>
            </h6>
            <div>
              <i className="fal fa-user-circle" /> {material.manufacturer}
            </div>
            <div>
              <i className="fal fa-money-bill" /> {formatPrice(material.price)}/
              {material.materialType.unit}
            </div>
            <div>
              <i className="fal fa-bullseye" /> {material.construction.name}
            </div>
          </div>
          <div className="action-area p-2">
            <Link
              to={getRoutePath(routeConsts.MATERIAL_EDIT, { id: material.id })}
              className="btn btn-outline-primary btn-sm"
            >
              <i className="fal fa-edit" />
            </Link>
            <button id={`_${material.id}-delete`} className="btn btn-outline-danger btn-sm ml-2">
              <i className="fal fa-trash" />
              <PopConfirm
                target={`_${material.id}-delete`}
                title="Delete this material?"
                message="Are you sure? All pending requests of this material will be denied, all transactions of this equipment will be kept!"
                confirmText="Yes, delete it"
                onConfirm={() => this._handleDeleteMaterial(material.id)}
              />
            </button>
          </div>
        </div>
      </CSSTransition>
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

    const cards = materials.items.map(this._renderMaterialCard);

    return <TransitionGroup>{cards}</TransitionGroup>;
  };

  render() {
    const { materials, activePage, isDeleting, deleteError } = this.state;

    return (
      <div className="container py-3">
        {isDeleting && <ComponentBlocking message="Deleting..." />}
        <div className="row">
          <div className="col-md-9">
            <h4>
              My materials
              <Link to={getRoutePath(routeConsts.MATERIAL_ADD)} className="float-right">
                <button className="btn btn-success">
                  <i className="fal fa-plus" /> New material
                </button>
              </Link>
            </h4>
            <div className="clearfix"></div>
            {deleteError &&
              <div className="my-2 alert alert-warning">
                <i className="fal fa-info-circle"></i> {deleteError}
              </div>
            }
            {this._renderListMaterials()}
            {materials && materials.totalItems > this.pageSize && (
              <div className="text-center">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={this.pageSize}
                  totalItemsCount={materials.totalItems}
                  pageRangeDisplayed={5}
                  onChange={this._loadData}
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

MyMaterials.props = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { user } = authentication;

  return {
    user,
  };
};

export default connect(mapStateToProps)(MyMaterials);
