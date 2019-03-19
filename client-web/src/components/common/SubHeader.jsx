import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class SubHeader extends Component {

  menu = [
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
    },
    {
      to: '/dashboard/supplier/materials',
      name: 'Materials'
    },
    {
      to: '/dashboard/supplier/material-transactions',
      name: 'Material Transactions'
    }
  ];

  requesterMenu = [
    {
      to: '/dashboard/requester',
      name: 'Transactions',
      exact: true
    },
    {
      to: '/dashboard/requester/constructions',
      name: 'Constructions'
    },
    {
      to: '/dashboard/requester/material-transactions',
      name: 'Material Transactions'
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

    let menus = null;
    if (location.pathname.indexOf('/dashboard/supplier') === 0) {
      menus = this.menu;
    }

    if (location.pathname.indexOf('/dashboard/requester') === 0) {
      menus = this.requesterMenu;
    }

    if (!menus) {
      return null;
    }

    return (
      <div className="nav-scroller bg-white shadow-sm">
        <nav className="nav nav-underline container">
          {/* <span className="badge badge-pill badge-success align-text-bottom ml-1">27</span> */}
          {menus.map(menu => {
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