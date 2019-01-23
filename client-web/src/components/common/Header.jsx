import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Header extends PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand py-0" to="/">
                        <img src="/assets/images/logo.png" width="40" height="40" className="d-inline-block align-top" alt=""/>
                        ConstuctionSharing
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="#">Disabled</a>
                            </li>
                        </ul>
                        <Link to="/add-equipment"><button className="btn btn-danger my-2 my-sm-0 mx-2" type="submit"><i class="fa fa-plus"></i></button></Link>
                        <Link to="/signup"><button className="btn btn-success my-2 my-sm-0 mx-2" type="submit">Đăng ký</button></Link>
                        <Link to="/login"><button className="btn btn-outline-primary my-2 my-sm-0 mx-2" type="submit">Đăng nhập</button></Link>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withRouter(Header);