import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';


class MaterialCart extends Component {
  state = {
    isChanged: false
  };
  materialCartCount = 0;

  componentDidUpdate() {
    const { isChanged } = this.state;
    const { materialCart } = this.props;
    if (materialCart.count !== this.materialCartCount) {
      this.materialCartCount = materialCart.count;

      this.setState({
        isChanged: true
      });
    }

    if (isChanged) {
      setTimeout(() => {
        this.setState({
          isChanged: false
        });
      }, 1300);
    }
  }

  render() {
    const { isChanged } = this.state;
    const { materialCart } = this.props;

    return (
      <li className="nav-item">
        <Link to={getRoutePath(routeConsts.MATERIAL_CART)} className="text-dark d-flex h-100 align-items-center px-3">
          <i className="fal fa-shopping-cart"></i>
          {materialCart.count > 0 &&
            <span className={`badge badge-pill badge-danger ${isChanged ? 'heartBeat' : ''}`}>{materialCart.count}</span>
          }
        </Link>
      </li>
    );
  }
}


const mapStateToProps = state => {
  const { materialCart } = state;
  
  return {
    materialCart
  };
};

export default connect(mapStateToProps)(MaterialCart);
