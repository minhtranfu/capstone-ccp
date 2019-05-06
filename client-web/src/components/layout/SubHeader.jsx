import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from "react-i18next";

import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import MaterialCart from './material-cart';

class SubHeader extends Component {

  equipmentMenu = [
    {
      to: getRoutePath(routeConsts.EQUIPMENTS),
      name: 'equipments.find',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENT_MY),
      name: 'equipments.my'
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENT_SUPPLY),
      name: 'equipments.supply'
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENT_REQUEST),
      name: 'equipments.hiring'
    },
    {
      to: getRoutePath(routeConsts.SUBSCRIPTION_REQUEST),
      name: 'equipments.subscriptions'
    },
  ];

  materialMenu = [
    {
      to: getRoutePath(routeConsts.MATERIALS),
      name: 'materials.find',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.MATERIAL_MY),
      name: 'materials.my'
    },
    {
      to: getRoutePath(routeConsts.MATERIAL_SUPPLY),
      name: 'materials.selling'
    },
    {
      to: getRoutePath(routeConsts.MATERIAL_REQUEST),
      name: 'materials.buying'
    },
  ];

  debrisMenu = [
    {
      to: getRoutePath(routeConsts.DEBRISES),
      name: 'debrises.find',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.DEBRIS_MY),
      name: 'debrises.my'
    },
    {
      to: getRoutePath(routeConsts.DEBRIS_SUPPLY),
      name: 'debrises.serving'
    },
    {
      to: getRoutePath(routeConsts.DEBRIS_REQUEST),
      name: 'debrises.hiring'
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
    const { location, t } = this.props;

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
                <Link className="nav-link" to={menu.to}>{t(`menu.${menu.name}`)}</Link>
              </li>
            );
          })}
          {menus === this.materialMenu &&
            <MaterialCart/>
          }
        </nav>
      </div>
    );
  }
}

export default withRouter(withTranslation()(SubHeader));
