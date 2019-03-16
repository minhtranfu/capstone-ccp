import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { EQUIPMENT_SHOWABLE_STATUSES } from '../../../common/consts';

class MyEquipments extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filterStatus: 'all'
    };
  }

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
                  <i className="fa fa-plus"></i> New equipment
              </button>
              </Link>
            </h4>
            {equipments && equipments.map(equipment => {
              return (
                <div key={equipment.id} className="d-flex transaction my-3 rounded shadow-sm">
                  <div className="image flex-fill">
                    <img src={equipment.thumbnailImage.url || '/public/upload/product-images/unnamed-19-jpg.jpg'} className="rounded-left" />
                  </div>
                  <div className="detail flex-fill p-2">
                    <h6>
                      {equipment.name}
                      <span className="float-right">
                        <button className="btn btn-outline-success btn-sm"><i className="fa fa-pencil"></i></button>
                        <button className="btn btn-outline-danger btn-sm ml-2"><i className="fa fa-trash"></i></button>
                      </span>
                      <span className="clearfix"></span>
                    </h6>
                    <div>Status: {EQUIPMENT_SHOWABLE_STATUSES[equipment.status]}</div>
                  </div>
                </div>
              );
            })}
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
