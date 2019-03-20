import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { EQUIPMENT_SHOWABLE_STATUSES } from '../../../common/consts';

class MyEquipments extends PureComponent {
  state = {
    filterStatus: 'all'
  };

  _loadData = async () => {
    const REQUESTER_ID = 12;
    const equipments = await ccpApiService.getEquipmentsByContractorId(REQUESTER_ID);
    this.setState({
      equipments
    });
  };

  componentDidMount() {
    this._loadData();
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
        <h2>You have no equipment!</h2>
        <Link to="/dashboard/supplier/equipments/add" className="float-right">
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

    if (equipments.length === 0) {
      return this._renderNoEquipment();
    }

    return (
      equipments.map(equipment => {
        const thumbnail = equipment.thumbnailImage ? equipment.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
        return (
          <div key={equipment.id} className="d-flex transaction my-3 rounded shadow-sm">
            <div className="image flex-fill">
              <img src={thumbnail} className="rounded-left" />
            </div>
            <div className="detail flex-fill p-2">
              <h6>
                {equipment.name}
                <span className="float-right">
                  <button className="btn btn-outline-success btn-sm"><i className="fal fa-pencil"></i></button>
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
    const { equipments } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>
              My equipments
              <Link to="/dashboard/supplier/equipments/add" className="float-right">
                <button className="btn btn-success">
                  <i className="fal fa-plus"></i> New equipment
                </button>
              </Link>
            </h4>
            {this._renderListEquipments()}
          </div>
          <div className="col-md-3">
            <div className="bg-dark text-light sticky-top sticky-sidebar py-5 text-center">USER MENU PLACEHOLDER</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyEquipments;