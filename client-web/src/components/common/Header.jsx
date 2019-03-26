import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../redux/actions';

import LoginModal from '../modules/login/LoginModal';
import { authConstants } from '../../redux/_constants';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class Header extends Component {

  leftMenus = [
    {
      to: getRoutePath(routeConsts.HOME),
      name: 'Home',
      exact: true
    },
    {
      to: getRoutePath(routeConsts.EQUIPMENTS),
      name: 'Equipments'
    },
    {
      to: getRoutePath(routeConsts.MATERIALS),
      name: 'Materials'
    },
    {
      to: getRoutePath(routeConsts.DEBRISES),
      name: 'Debrises'
    }
  ];

  state = {
    showOffCanvas: false
  };

  rightMenus = [
    {
      to: getRoutePath(routeConsts.CONSTRUCTIONS),
      name: 'My Constructions',
      requiredAuth: true
    },
  ];

  _toggleOffCanvas = () => {
    const { showOffCanvas } = this.state;

    this.setState({
      showOffCanvas: !showOffCanvas
    });
  };

  _closeOffCanvas = () => {
    this.setState({
      showOffCanvas: false
    });
  };

  _isMenuActive = (menu) => {
    const { location } = this.props;

    if (menu.exact) {
      return location.pathname === menu.to;
    }

    return location.pathname.indexOf(menu.to) === 0;
  };

  _logout = () => {
    const { logout } = this.props;

    logout();
  };

  _toggleLoginModal = () => {
    const { location, toggleLoginModal } = this.props;

    // Don't show login modal when user on login page
    if (location.pathname === '/login') {
      return;
    }

    this.setState({
      showOffCanvas: false, // Close offcanvas too
    });

    toggleLoginModal();
  };

  _renderMenus = menus => {
    const { authentication } = this.props;

    return menus.map(menu => {
                
      if (menu.requiredAuth && !authentication.isAuthenticated) {
        return null;
      }

      return (
        <li key={menu.name} className={`nav-item ${this._isMenuActive(menu) ? 'active' : ''}`}>
          <Link className="nav-link" to={menu.to} onClick={this._closeOffCanvas}>{menu.name}</Link>
        </li>
      );
    });
  };

  render() {
    const { showOffCanvas } = this.state;
    const { authentication } = this.props;

    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand py-0 text-uppercase font-weight-bold text-monospace" to="/">
            <img src="/public/assets/images/logo.png" width="40" height="40" className="d-inline-block align-top mr-1" alt="" />
            CCP
          </Link>
          <button className="navbar-toggler" type="button" onClick={this._toggleOffCanvas}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`navbar-collapse offcanvas-collapse ${showOffCanvas ? 'open' : ''}`} id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              {this._renderMenus(this.leftMenus)}
            </ul>
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              {this._renderMenus(this.rightMenus)}
            </ul>
            {authentication.isAuthenticated &&
              <ul className="navbar-nav">
                <li className="nav-item dropdown notifications mr-2">
                  <a className="text-light d-flex h-100 align-items-center px-3" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <i className="fal fa-bell"></i>
                    <span className="badge badge-pill badge-danger">10</span>
                  </a>
                  <div className="dropdown-menu shadow mt-2 rounded-top-0">
                    <div className="list-notifications custom-scrollbar">
                      <a className="dropdown-item" href="#">
                        <div>Profile</div>
                        <p className="text-muted mb-0">Ahihi đồ ngốc</p>
                      </a>
                      <a className="dropdown-item" href="#">
                        <div>Profile</div>
                        <p className="text-muted mb-0">Ahihi đồ ngốc</p>
                      </a>
                      <a className="dropdown-item" href="#">
                        <div>Profile</div>
                        <p className="text-muted mb-0">Ahihi đồ ngốc</p>
                      </a>
                      <a className="dropdown-item" href="#">
                        <div>Profile</div>
                        <p className="text-muted mb-0">Ahihi đồ ngốc</p>
                      </a>
                      <a className="dropdown-item" href="#">
                        <div>Profile</div>
                        <p className="text-muted mb-0">Ahihi đồ ngốc</p>
                      </a>
                      <a className="dropdown-item" href="#">
                        <div>Profile</div>
                        <p className="text-muted mb-0">Ahihi đồ ngốc</p>
                      </a>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item text-center" href="#">View all <i className="fal fa-chevron-right"></i></a>
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <a className="dropdown-toggle text-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <img src={authentication.user.contractor.thumbnailImage} className="rounded-circle mr-2" width={40} height={40} />
                    {authentication.user.contractor.name}
                  </a>
                  <div className="dropdown-menu shadow mt-2 rounded-top-0">
                    <a className="dropdown-item" href="#"><i className="fal fa-user-circle"></i> Profile</a>
                    <a className="dropdown-item" href="#"><i className="fal fa-cogs"></i> Settings</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#" onClick={this._logout}><i className="fal fa-sign-out"></i> Logout</a>
                  </div>
                </li>
              </ul>
            }
            {!authentication.isAuthenticated &&
              <span>
                <button className="btn btn-outline-primary my-2 my-sm-0 mx-2" onClick={this._toggleLoginModal}>Login</button>
                <Link to="/signup"><button className="btn btn-primary my-2 my-sm-0 mx-2" onClick={this._closeOffCanvas}>Sign Up</button></Link>
              </span>
            }
          </div>
        </div>
        {!authentication.isAuthenticated &&
          <LoginModal isOpen={authentication.isShowLoginModal} onClose={this._toggleLoginModal} />
        }
      </nav>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;

  return {
    authentication
  };
};

const mapDispatchToProps = {
  logout: authActions.logout,
  showLoginModal: authActions.showLoginModal,
  hideLoginModal: authActions.hideLoginModal,
  toggleLoginModal: authActions.toggleLoginModal
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
