import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);

    this.menus = [
      {
        to: '/',
        name: 'Home',
        exact: true
      },
      {
        to: '/dashboard/supplier',
        name: 'Supplier'
      },
      {
        to: '/dashboard/requester',
        name: 'Requester'
      }
    ];

    this.state = {
      showOffCanvas: false
    };
  }

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

  render() {
    const { showOffCanvas } = this.state;

    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand py-0" to="/">
            <img src="/public/assets/images/logo.png" width="40" height="40" className="d-inline-block align-top" alt="" />
            ConstuctionSharing
          </Link>
          <button className="navbar-toggler" type="button" onClick={this._toggleOffCanvas}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`navbar-collapse offcanvas-collapse ${showOffCanvas ? 'open' : ''}`} id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              {this.menus.map(menu => {
                return (
                  <li key={menu.name} className={`nav-item ${this._isMenuActive(menu) ? 'active' : ''}`}>
                    <Link className="nav-link" to={menu.to} onClick={this._closeOffCanvas}>{menu.name}</Link>
                  </li>
                );
              })}
            </ul>
            <Link to="/signup"><button className="btn btn-success my-2 my-sm-0 mx-2" type="submit">Đăng ký</button></Link>
            <Link to="/login"><button className="btn btn-outline-primary my-2 my-sm-0 mx-2" type="submit">Đăng nhập</button></Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
