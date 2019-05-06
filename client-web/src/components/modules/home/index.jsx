import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class Home extends PureComponent {
  render() {
    return (
      <div className="bg-dark flex-fill d-flex align-items-center flex-column justify-content-center section-introduce">
        <div className="content container">
          <div className="row">
            <div className="col-md-4">
              <div className="service">
                <h2>Equipment</h2>
                <div className="mt-3">
                  <Link className="btn btn-outline-primary" to={getRoutePath(routeConsts.EQUIPMENTS)}>
                    <i className="fal fa-search"></i> Find
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service">
                <h2>Material</h2>
                <div className="mt-3">
                  <Link className="btn btn-outline-primary" to={getRoutePath(routeConsts.MATERIALS)}>
                    <i className="fal fa-search"></i> Find
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service">
                <h2>Debris</h2>
                <div className="mt-3">
                  <Link className="btn btn-outline-primary" to={getRoutePath(routeConsts.DEBRISES)}>
                    <i className="fal fa-search"></i> Find
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
