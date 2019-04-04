import React, { Component } from 'react';
import SearchBox from '../../common/SearchBox';
import EquipmentCard from '../../common/EquipmentCard';
import Helmet from 'react-helmet-async';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { Collapse, Fade } from "reactstrap";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ccpApiService from '../../../services/domain/ccp-api-service';
import SubscriptionCardAdd from '../subscription/subscription-card-add';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { authActions } from 'Redux/actions';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isFetching: false
    };
  }

  // Load search data on didmount
  _loadData = async () => {
    const products = await ccpApiService.searchEquipment({
      beginDate: moment().format('YYYY-MM-DD')
    });

    this.setState({
      products,
      isFetching: false,
      criteria: {
        beginDate: moment().format('YYYY-MM-DD')
      }
    });
  };

  // Handle criteria change from search box
  _handleSearch = async (criteria) => {

    this.setState({
      isFetching: true
    });
    const products = await ccpApiService.searchEquipment(criteria);

    this.setState({
      products,
      criteria,
      isFetching: false,
      subcription: undefined,
      isShowSubcribeBox: false
    });
  };

  // show or hide subcribe box
  _toggleSubcribeBox = () => {
    const { isShowSubcribeBox } = this.state;
    this.setState({
      isShowSubcribeBox: !isShowSubcribeBox
    });
  };

  // Handle when subcription was created by subcrib box
  _handleSubcribed = subcription => {
    this.setState({
      subcription,
      isShowSubcribeBox: false
    });
  };

  render() {
    const { products, isFetching, isShowSubcribeBox, subcription, criteria } = this.state;
    const { authentication, toggleLoginModal } = this.props;

    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className="section-search text-light">
          <div className="container">
            <SearchBox onSearch={this._handleSearch} isFetching={isFetching} />
          </div>
        </div>
        <div className="container">
          <div className="row py-3">
            <div className="col-md-12">
              <h3>Result</h3>
            </div>
            {(!products || products.length === 0) && !isFetching &&
              <div className="col-md-12 py-4">
                {!isShowSubcribeBox && !subcription &&
                  <Fade in={!isShowSubcribeBox && !subcription} className="text-center">
                    <div className="alert alert-info w-100 text-center">
                      <h2>No equipment found, please try again with another criteria!</h2>
                    </div>
                    <h2 className="text-center">OR</h2>
                    {authentication.isAuthenticated &&
                      <button className="btn btn-primary" onClick={this._toggleSubcribeBox}>
                        <i className="fal fa-binoculars"></i> Subcribe this criteria
                      </button>
                    }
                    {!authentication.isAuthenticated &&
                      <button className="btn btn-primary" onClick={toggleLoginModal}>
                        <i className="fal fa-binoculars"></i> Login to subcribe this criteria
                      </button>
                    }
                  </Fade>
                }
                <Collapse isOpen={isShowSubcribeBox}>
                  <h3 className="text-center">Subcribe to this criteria</h3>
                  {isShowSubcribeBox &&
                    <SubscriptionCardAdd
                      subscription={{
                        ...criteria,
                        equipmentType: !criteria.equipmentTypeId ? undefined : { id: +criteria.equipmentTypeId }
                      }}
                      onCancelEdit={this._toggleSubcribeBox}
                      onCreated={this._handleSubcribed}
                    />
                  }
                </Collapse>
                <Collapse isOpen={subcription}>
                  <h1 className="text-center text-success mt-3">
                    <i className="fal fa-check-circle"></i> Subcribed
                  </h1>
                  <div className="mt-2 mb-3 text-center">
                    <Link className="btn btn-outline-primary" to={getRoutePath(routeConsts.SUBSCRIPTION_REQUEST)}>View my subscriptions</Link>
                  </div>
                </Collapse>
              </div>
            }
            {isFetching &&
              <div className="bg-white p-4 w-100">
                <Skeleton height={210} count={5} />
              </div>
            }
            {!isFetching && products && products.map((product, index) => <EquipmentCard key={index} className="col-md-4" product={product} />)}
          </div>
        </div>
      </div>
    );
  }
}

Home.props = {
  authentication: PropTypes.object
};

const mapStateToProps = state => {
  const { authentication } = state;

  return {
    authentication
  };
};

const mapDispatchToProps = {
  toggleLoginModal: authActions.toggleLoginModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
