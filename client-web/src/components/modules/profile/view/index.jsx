import React, { PureComponent } from 'react';
import { withRouter } from "react-router-dom";
import classnames from 'classnames';

import { Image, StarRatings } from "Components/common";
import { userServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import { formatDate, formatFloat } from 'Utils/format.utils';
import EquipmentFeebacks from './equipment-feedbacks';
import MaterialFeebacks from './material-feedbacks';
import DebrisFeebacks from './debris-feedbacks';

import IconMaterials from 'Assets/icons/materials.svg';
import IconEquipments from 'Assets/icons/equipments.svg';
import IconDebris from 'Assets/icons/debris.svg';
import { CONTRACTOR_STATUS_INFOS } from 'Common/consts';

class ViewProfile extends PureComponent {

  state = {
    errorMessage: null,
    contractor: {},
    isFetching: true,
    activeFeedbackTab: 0,
  };

  feedbackTabs = [
    {
      name: 'Equipment',
      component: EquipmentFeebacks
    },
    {
      name: 'Material',
      component: MaterialFeebacks
    },
    {
      name: 'Debris',
      component: DebrisFeebacks
    }
  ];

  /**
   * Load contractor detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    try {
      const contractor = await userServices.getUserInfoById(id);

      this.setState({
        contractor,
        isFeching: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFeching: false,
      });
    }
  };

  componentDidMount() {
    this._loadData();
  }

  _renderContractorCard = () => {
    const { contractor } = this.state;

    const statusBsColor = contractor.status ? CONTRACTOR_STATUS_INFOS[contractor.status].bsColor : '';
    const statusName = contractor.status ? CONTRACTOR_STATUS_INFOS[contractor.status].name : '';

    return (
      <div className="bg-white py-3 px-2 shadow-sm">
        <div className="text-center">
          <Image
            width={200} height={200}
            className="rounded-circle"
            src={contractor.thumbnailImageUrl}
          />
          <h5 className="mt-2">{contractor.name}</h5>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Status:</span>
          <span className={`badge badge-pill pt-1 badge-${statusBsColor}`}>{statusName}</span>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Phone:</span>
          <span>{contractor.phoneNumber}</span>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Email:</span>
          <span className="ml-2 text-truncate">{contractor.email}</span>
        </div>
        <div className="d-flex justify-content-between p-2">
          <span className="text-muted">Joined:</span>
          <span>{formatDate(contractor.createdTime)}</span>
        </div>
      </div>
    );
  };

  _setActiveFeedbackTab = activeFeedbackTab => {
    if (activeFeedbackTab === this.state.activeFeedbackTab) {
      return;
    }

    this.setState({
      activeFeedbackTab
    });
  };

  _renderFeedbacksCard = () => {
    const { activeFeedbackTab, contractor } = this.state;

    let TabComponent = null;
    return (
      <div className="card shadow-sm">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {this.feedbackTabs.map((tab, index) => {
              const isTabActive = index === activeFeedbackTab;
              if (isTabActive) {
                TabComponent = tab.component;
              }
              return (
                <li key={index} className="nav-item">
                  <span className={classnames('nav-link', {'active': isTabActive, 'cursor-poiner': !isTabActive })}
                    onClick={() => this._setActiveFeedbackTab(index)}
                  >
                    {tab.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-body">
          {TabComponent &&
            <TabComponent contractorId={contractor.id} />
          }
        </div>
      </div>
    );
  };

  _renderProfile = () => {
    const { contractor } = this.state;

    return (
      <div>
        <div className="bg-white py-4 mt-4 shadow-sm">
          <div className="row">
            <div className="col-md-4 text-center">
              <Image src={IconEquipments} width={80} height={80} />
              <div className="my-2">
                <StarRatings
                  rating={contractor.averageEquipmentRating}
                />
              </div>
              <div>{formatFloat(contractor.averageEquipmentRating)}/{contractor.equipmentFeedbacksCount} feedbacks</div>
            </div>
            <div className="col-md-4 text-center">
              <Image src={IconMaterials} width={80} height={80} />
              <div className="my-2">
                <StarRatings
                  rating={contractor.averageMaterialRating}
                />
              </div>
              <div>{formatFloat(contractor.averageMaterialRating)}/{contractor.materialFeedbacksCount} feedbacks</div>
            </div>
            <div className="col-md-4 text-center">
              <Image src={IconDebris} width={80} height={80} />
              <div className="my-2">
                <StarRatings
                  rating={contractor.averageDebrisRating}
                />
              </div>
              <div>{formatFloat(contractor.averageDebrisRating)}/{contractor.debrisFeedbacksCount} feedbacks</div>
            </div>
          </div>
        </div>
        <h4 className="my-3">Feedbacks</h4>
        {this._renderFeedbacksCard()}
      </div>
    );
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            {this._renderContractorCard()}
          </div>
          <div className="col-md-9">
            {this._renderProfile()}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewProfile);
