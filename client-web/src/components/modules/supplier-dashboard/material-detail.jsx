import React, { Component } from 'react';
import { Image } from "Components/common";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { materialServices } from "Services/domain/ccp";
import { formatDate } from "Utils/format.utils";

class MaterialDetail extends Component {

  state = {
    material: {}
  };

  /**
   * Load material detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await materialServices.getMaterialById(id);

    this.setState({
      material: data
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _renderPlaceholders = () => {
    const numOfPlaceholder = 5;

    const placeholders = [];
    for (let i = 0; i < numOfPlaceholder; i++) {
      placeholders.push(
        <div key={i} className="col-md-12">
            <div className="my-2 shadow lh-1">
              <Skeleton height={200} />
            </div>
        </div>
      );
    }

    return placeholders;
  };

  render() {
    const { material } = this.state;

    return (
      <div className="container py-3">
        <h4 className="mb-3">Material detail <Link to="/dashboard/supplier/materials" className="btn btn-sm btn-outline-primary float-right"><i className="fal fa-chevron-left"></i> Back to list</Link></h4>
        <div className="d-flex flex-row bg-white shadow">
          <Image src="http://localhost:3060/public/upload/product-images/unnamed-19-jpg.jpg" style={{maxHeight: '250px'}} />
          <div className="flex-fill p-2">
            <h6>{material.name}</h6>
            <p className="text-muted">Price: {material.price}/{material.unit}</p>
            <p className="text-muted">Manufacturer: {material.manufacturer}</p>
            <p className="text-muted">Post at: {formatDate(material.createdTime)}</p>
          </div>
        </div>
        <h4 className="my-3">Transactions of material</h4>
        <div className="row">
          {this._renderPlaceholders()}
          <div className="col-md-12">
            <div className="bg-white p-5 my-2"></div>
          </div>
          <div className="col-md-12">
            <div className="bg-white p-5 my-2"></div>
          </div>
          <div className="col-md-12">
            <div className="bg-white p-5 my-2"></div>
          </div>
          <div className="col-md-12">
            <div className="bg-white p-5 my-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialDetail;