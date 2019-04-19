import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import { routeConsts } from 'Common/consts';
import { getRoutePath, toQueryString, parseQueryString } from 'Utils/common.utils';
import { Pagination } from 'Components/common';
import FeedbackPlaceholder from './feedback-placeholder';
import Feedback from './feedback';

class Feebacks extends PureComponent {

  pageSize = 6;

  constructor(props) {
    super(props);

    let queryParams = parseQueryString(props.location.search);
    if (queryParams.feedbackType !== props.feedbackType) {
      queryParams = {};
    }
    
    this.state = {
      page: +queryParams.page || 1,
      isFetching: false,
      isFirstLoad: true,
      feedbacks: {
        items: []
      },
    };
  }

  // abstract
  _requestDataFromService = async () => {
    throw new Error('Need implement method for loading data!');
  };

  _loadData = async (page) => {
    const { history, contractorId, feedbackType } = this.props;
    const { isFirstLoad } = this.state;

    if (!isFirstLoad) {

      if (page === this.state.page) {
        return;
      }

      const newUrl = getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: contractorId });
      
      let queryString = toQueryString({
        page,
        feedbackType,
      });

      if (queryString) {
        queryString = `?${queryString}`;
      }
      
      history.replace(`${newUrl}${queryString}`);
    }

    this.setState({
      isFetching: true
    });

    const criteria = {
      offset: (page - 1) * this.pageSize,
      limit: this.pageSize,
      orderBy: 'createdTime.desc',
    };

    const feedbacks = await this._requestDataFromService(contractorId, criteria);

    this.setState({
      page,
      feedbacks,
      isFetching: false,
      isFirstLoad: false,
    });
  };

  componentDidMount() {
    const { page } = this.state;
    this._loadData(page);
  }

  _renderListPlaceholders = () => {

    const placeholders = [];
    for (let i = 0; i < this.pageSize; i++) {
      placeholders.push(
        <FeedbackPlaceholder key={i} />
      );
    }

    return placeholders;
  };

  _renderNoFeedback = () => {

    return (
      <div className="my-3 alert alert-info">
        <i className="fal fa-info-circle"></i> There is no feedback now!
      </div>
    );
  };

  _renderListFeedbacks = () => {
    const { feedbacks, isFetching } = this.state;

    if (isFetching) {
      return this._renderListPlaceholders();
    }

    if (feedbacks.items.length === 0) {
      return this._renderNoFeedback();
    }

    return feedbacks.items.map(feedback => <Feedback key={feedback.id} feedback={feedback} />);
  };

  componentDidUpdate(prevProps) {
    this._checkForUpdateContractor(prevProps);
  }

  /**
   * Check for update contractor to load new contractor information
   */
  _checkForUpdateContractor = prevProps => {
    const { contractorId } = this.props;

    const { contractorId: prevContractorId } = prevProps;

    if (contractorId !== prevContractorId) {
      console.log('CHANGEDDDDD!', {contractorId, prevContractorId});
      this._loadData(1);
      this.setState({
        page: null,
      }, () => {
        this._loadData(1);
      });
    }
  };

  render() {
    const { isShow, isFetching, feedbacks, page } = this.state;
    return (
      <CSSTransition
        in={isShow}
        timeout={500}
        classNames="fade"
      >
        <div>
          <div>
            {this._renderListFeedbacks()}
          </div>
          {!isFetching && feedbacks.totalItems > this.pageSize &&
            <div className="text-center mt-3">
              <Pagination
                activePage={page}
                itemsCountPerPage={this.pageSize}
                totalItemsCount={feedbacks.totalItems}
                pageRangeDisplayed={5}
                onChange={this._loadData}
              />
            </div>
          }
        </div>
      </CSSTransition>
    );
  }
}

Feebacks.props = {
  contractorId: PropTypes.number.isRequired,
  feedbackType: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

Feebacks.defaultProps = {
  feedbackType: '',
};

export default Feebacks;
