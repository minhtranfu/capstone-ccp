import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class SubHeader extends Component {
    render() {
        const { location } = this.props;

        if (location.pathname.indexOf('/dashboard/supplier') != 0) {
            return null;
        }

        return (
            <div className="nav-scroller bg-white shadow-sm">
                <nav className="nav nav-underline container">
                    <a className="nav-link active" href="#">
                        Transactions
                        <span className="badge badge-pill badge-success align-text-bottom ml-1">27</span>
                    </a>
                    <a className="nav-link" href="#">Constructions</a>
                    <a className="nav-link" href="#">Equipments</a>
                    <a className="nav-link" href="#">Received feedback</a>
                </nav>
            </div>
        );
    }
}

export default withRouter(SubHeader);