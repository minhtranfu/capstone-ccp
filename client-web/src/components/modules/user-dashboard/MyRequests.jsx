import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import ccpApiService from '../../../services/domain/ccp-api-service';
import { TRANSACTION_STATUSES } from '../../../common/consts';

class MyRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterStatus: 'all',
        };
    }

    _loadData = async () => {
        const REQUESTER_ID = 12;
        const transactions = await ccpApiService.getTransactionsByRequesterId(REQUESTER_ID);
        this.setState({
            transactions
        });
    };

    componentDidMount() {
        this._loadData();
    }

    _handleFilterChange = e => {
        const value = e.target.value;
        this.setState({
            filterStatus: value,
        });
    };

    render() {
        const { transactions, filterStatus } = this.state;

        return (
            <div>
                <div>
                    <h4 className="d-inline">My Requests</h4>
                    <span className="float-right form-inline">
                        Shows:
                        <select className="form-control-sm ml-2" onChange={this._handleFilterChange}>
                            <option value="all">All</option>
                            {Object.keys(TRANSACTION_STATUSES).map(status => <option value={TRANSACTION_STATUSES[status]}>{TRANSACTION_STATUSES[status]}</option>)}
                        </select>
                    </span>
                </div>
                {transactions &&
                    <TransitionGroup>
                        {transactions.map(transaction => {
                            const { equipment } = transaction;

                            if (filterStatus !== 'all' && transaction.status !== filterStatus) {
                                return null;
                            }

                            const days = moment(transaction.endDate).diff(moment(transaction.beginDate), 'days') + 1;

                            let statusClasses = 'badge ';
                            switch (transaction.status) {
                                case TRANSACTION_STATUSES.PENDING:
                                    statusClasses += ' badge-info';
                                    break;

                                case TRANSACTION_STATUSES.ACCEPTED:
                                    statusClasses += ' badge-success';
                                    break;

                                case TRANSACTION_STATUSES.DENIED:
                                    statusClasses += 'badge-danger';
                                    break;
                            }

                            return (
                                <CSSTransition
                                    key={transaction.id}
                                    classNames="fade"
                                    timeout={500}
                                >
                                    <div className="d-flex transaction my-3 rounded">
                                        <div className="image flex-fill">
                                            <img src="https://via.placeholder.com/300x200.png?text=CCP+Capstone" />
                                        </div>
                                        <div className="detail flex-fill p-2">
                                            <h6><span className={statusClasses}>{transaction.status}</span> {equipment.name}</h6>
                                            <div>
                                                <span>Days: {days}</span>
                                                <span className="ml-2 text-muted">({transaction.beginDate} to {transaction.endDate})</span>
                                            </div>
                                            <div>
                                                <span className="">Daily Price: ${equipment.dailyPrice}</span>
                                                <span className="ml-2 pl-2 border-left">Total fee: ${equipment.dailyPrice * days}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(MyRequests);