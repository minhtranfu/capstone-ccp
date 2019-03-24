import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class SubHeader extends Component {

  equipmentMenu = [
    {
      to: getRoutePath(routeConsts.EQUIPMENTS),
      name: 'Find equipments',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENT_MY),
      name: 'My equipments'
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENT_SUPPLY),
      name: 'Equipments supply'
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENT_REQUEST),
      name: 'Equipment requests'
    },
  ];

  materialMenu = [
    {
      to: getRoutePath(routeConsts.MATERIALS),
      name: 'Find materials',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.MATERIAL_MY),
      name: 'My materials'
    },
    {
      to: getRoutePath(routeConsts.MATERIAL_SUPPLY),
      name: 'Material supply'
    },
    {
      to: getRoutePath(routeConsts.MATERIAL_REQUEST),
      name: 'Material requests'
    },
  ];

  debrisMenu = [
    {
      to: getRoutePath(routeConsts.DEBRISES),
      name: 'Find debrises',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.DEBRIS_MY),
      name: 'My debrises'
    },
    {
      to: getRoutePath(routeConsts.DEBRIS_SUPPLY),
      name: 'Debris supply'
    },
    {
      to: getRoutePath(routeConsts.DEBRIS_REQUEST),
      name: 'Debris transaction'
    },
  ];

  _isMenuActive = (menu) => {
    const { location } = this.props;

    if (!menu.to || menu.to.trim().length === 0) {
      return false;
    }

    const lastPart = location.pathname.replace(`${menu.to}/`, '');
    if (lastPart.length > 0 && !isNaN(lastPart)) {
      return true;
    }

    if (menu.exact) {
      return location.pathname === menu.to;
    }

    return location.pathname.indexOf(menu.to) === 0;
  };

  render() {
    const { location } = this.props;

    let menus = null;
    if (location.pathname.indexOf('/equipments') === 0) {
      menus = this.equipmentMenu;
    }

    if (location.pathname.indexOf('/materials') === 0) {
      menus = this.materialMenu;
    }

    if (location.pathname.indexOf('/debrises') === 0) {
      menus = this.debrisMenu;
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
