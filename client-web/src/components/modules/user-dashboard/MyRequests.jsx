import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import SweetAlert from 'react-bootstrap-sweetalert';
import Skeleton from 'react-loading-skeleton';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { TRANSACTION_STATUSES } from '../../../common/consts';

class MyRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterStatus: 'all',
            confirm: {},
            alert: {},
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

    _handleChangeStatus = (transactionId, isAccept) => {
        const confirm = {
            isAccept,
            transactionId,
            show: true,
            onConfirm: this._handleChangeStatusConfirm,
            confirmText: "Confirm",
            confirmStyle: "info",
            showCancel: true,
            onCancel: this._removeConfirm,
        };
        confirm.title = `${isAccept ? "Accept" : "Deny"} request confirm`;
        confirm.message = `You are going to ${isAccept ? "accept" : "deny"} this transaction. Please confirm!`;

        this.setState({
            confirm,
        });
    };

    _showLoadingConfirm = () => {
        const { confirm } = this.state;
        this.setState({
            confirm: {
                ...confirm,
                confirmText: <span><span className="spinner-border" role="status" aria-hidden="true"></span> Changing...</span>,
                confirmClass: "disabled",
                showCancel: false,
                onCancel: undefined,
                onConfirm: () => {},
            },
        });
    };

    _handleChangeStatusConfirm = async () => {
        const { confirm } = this.state;

        this._showLoadingConfirm();
        const data = {
            status: confirm.isAccept ? TRANSACTION_STATUSES.ACCEPTED : TRANSACTION_STATUSES.DENIED,
        };

        const transaction = await ccpApiService.updateTransactionById(confirm.transactionId, data);

        // Error: can not get the result
        if (!transaction) {
            this.setState({
                alert: {
                    danger: true,
                    title: "An error occur!",
                    message: "Please try again!",
                },
                confirm: {},
            });

            return;
        }

        // Error: status was not changed
        if (transaction.status !== data.status) {
            this.setState({
                alert: {
                    danger: true,
                    title: "Something went wrong!",
                    message: "Status was not changed, please try again!",
                },
                confirm: {},
            });
            return;
        }

        // Success, alert success and update current list
        const alert = {
            success: true,
            title: "Success!",
            message: `Transaction was ${confirm.isAccept ? "accepted" : "denied"}.`,
        };
        const transactions = this._getUpdatedTransactionsList(transaction);
        this.setState({
            alert,
            confirm: {},
            transactions,
        });
    };

    _getUpdatedTransactionsList = updatedTransaction => {
        let { transactions } = this.state;

        return transactions.map(transaction => {
            if (transaction.id !== updatedTransaction.id) {
                return transaction;
            }

            // Update information of transaction
            transaction = {
                ...transaction,
                ...updatedTransaction,
            };

            return transaction;
        });
    };

    _removeAlert = () => {
        this.setState({
            alert: {},
        });
    };
    
    _removeConfirm = () => {
        this.setState({
            confirm: {},
        });
    };

    render() {
        const { transactions, filterStatus, confirm, alert } = this.state;

        const loadingTransactions = [];
        if (!transactions) {
            for (let i = 0; i < 10; i++) {
                loadingTransactions.push(
                    <div className="d-flex transaction my-3 rounded">
                        <div className="image flex-fill">
                            <Skeleton width={300} height={200} />
                        </div>
                        <div className="detail flex-fill p-2">
                            <h6><Skeleton width={40} className="d-inline" /> <Skeleton width={300} className="d-inline" /></h6>
                            <div className="white-space-normal">
                                <Skeleton count={3} width={300} />
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div>
                {confirm.title &&
                    <SweetAlert
                        info
                        showCancel={confirm.showCancel}
                        confirmBtnText={confirm.confirmText}
                        confirmBtnBsStyle={confirm.confirmStyle}
                        confirmBtnCssClass={confirm.confirmClass}
                        title={confirm.title}
                        onConfirm={confirm.onConfirm}
                        onCancel={confirm.onCancel}
                    >
                        {confirm.message}
                    </SweetAlert>
                }
                {alert.title &&
                    <SweetAlert {...alert} onConfirm={this._removeAlert}/>
                }
                <div>
                    <h4 className="d-inline">My Requests</h4>
                    <span className="float-right form-inline">
                        Shows:
                        <select className="form-control-sm ml-2" onChange={this._handleFilterChange}>
                            <option value="all">All</option>
                            {Object.keys(TRANSACTION_STATUSES).map(status => <option key={status} value={TRANSACTION_STATUSES[status]}>{TRANSACTION_STATUSES[status]}</option>)}
                        </select>
                    </span>
                </div>
                {loadingTransactions}
                {transactions &&
                    <TransitionGroup>
                        {transactions.map(transaction => {
                            const { equipment } = transaction;

                            if (filterStatus !== 'all' && transaction.status !== filterStatus) {
                                return null;
                            }

                            const days = moment(transaction.endDate).diff(moment(transaction.beginDate), 'days') + 1;

                            let statusClasses = 'badge ';
                            let changeStatusButtons = '';
                            switch (transaction.status) {
                                case TRANSACTION_STATUSES.PENDING:
                                    statusClasses += ' badge-info';
                                    changeStatusButtons = (
                                        <div className="mt-2">
                                            <button className="btn btn-success" onClick={() => this._handleChangeStatus(transaction.id, true)}>Accept</button>
                                            <button className="btn btn-outline-danger ml-2" onClick={() => this._handleChangeStatus(transaction.id, false)}>Deny</button>
                                        </div>
                                    );
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
                                            <img src="/upload/product-images/unnamed-19-jpg.jpg" className="rounded-left" />
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
                                            {changeStatusButtons}
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