import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class SubHeader extends Component {

  menus = [
    {
      to: '/dashboard/supplier',
      name: 'Transactions',
      exact: true
    },
    {
      to: '/dashboard/supplier/constructions',
      name: 'Constructions'
    },
    {
      to: '/dashboard/supplier/equipments',
      name: 'Equipments'
    }
  ];

  _isMenuActive = (menu) => {
    const { location } = this.props;

    if (menu.exact) {
      return location.pathname === menu.to;
    }

    return location.pathname.indexOf(menu.to) === 0;
  };

  render() {
    const { location } = this.props;

    if (location.pathname.indexOf('/dashboard/supplier') != 0 && location.pathname.indexOf('/dashboard/requester') != 0) {
      return null;
    }

    return (
      <div className="nav-scroller bg-white shadow-sm">
        <nav className="nav nav-underline container">
          {/* <span className="badge badge-pill badge-success align-text-bottom ml-1">27</span> */}
          {this.menus.map(menu => {
            return (
              <li key={menu.name} className={`nav-item ${this._isMenuActive(menu) ? 'active' : ''}`}>
                <Link className="nav-link" to={menu.to}>{menu.name}</Link>
              </li>
            );
          })}
        </nav>
      </div>
    );
  }
}

export default withRouter(SubHeader);