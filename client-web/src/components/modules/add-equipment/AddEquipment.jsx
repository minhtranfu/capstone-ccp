import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import {
  CSSTransition
} from 'react-transition-group';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import { routeConsts, CONTRACTOR_STATUSES } from 'Common/consts';
import ComponentBlocking from 'Components/common/component-blocking';

class AddEquipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: null,
      data: {}
    };

    this.data = {
    };

    this.steps = [
      {
        name: 'General Information',
        component: Step1
      },
      {
        name: 'Specs Information',
        component: Step2
      },
      {
        name: 'More Information',
        component: Step3
      }
    ];
  }

  componentDidMount() {
    setTimeout(() => this.setState({ activeStep: 0 }), 350);
  }

  toggle = tab => {
    if (this.state.activeStep !== tab) {
      this.setState({
        activeStep: tab
      });
    }
  };

  _handleStepDone = async result => {
    this.data = {
      ...this.data,
      ...result.data
    };

    let { activeStep } = this.state;
    if (activeStep < this.steps.length - 1) {
      activeStep++;
      this.setState({
        activeStep
      });
      return;
    }

    const { equipmentTypeId, constructionId } = this.data;
    this.data.equipmentType = {
      id: +equipmentTypeId
    };
    this.data.construction = {
      id: +constructionId
    };
    this.data.equipmentTypeId = undefined;
    this.data.constructionId = undefined;
    this.data.categoryId = undefined;
    this.data.categories = undefined;

    this.setState({
      isFetching: true
    });
    try {
      const data = await ccpApiService.postEquipment(this.data);
      if (data && data.id) {
        this.setState({
          equipmentId: data.id,
          isFetching: false
        });

        return;
      }

      this.setState({
        errorMessage: 'An unknown error occured!',
        isFetching: false
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFetching: false
      });
    }
  };

  _handleBackStep = () => {
    let { activeStep } = this.state;

    if (activeStep == 0) {
      return;
    }

    activeStep--;
    this.setState({
      activeStep
    });
  }

  _renderSteps = () => {
    const tabs = [];
    const tabPanes = [];

    this.steps.forEach((step, index) => {
      tabs.push(
        <NavItem key={index} className="flex-fill text-center">
          <NavLink
            className={classnames('disabled', { active: this.state.activeStep === index, pass: this.state.activeStep > index })}
            onClick={() => { this.toggle(index); }}
          >
            {step.name}
          </NavLink>
        </NavItem>
      );

      tabPanes.push(
        <TabPane tabId={index} className="p-1" key={index}>
          <CSSTransition
            in={this.state.activeStep === index}
            timeout={500}
            classNames="fade"
          >
            <Row>
              <Col sm="12">
                <step.component onStepDone={this._handleStepDone} onBackStep={this._handleBackStep} currentState={this.data} />
              </Col>
            </Row>
          </CSSTransition>
        </TabPane>
      );
    });

    return (
      <div>
        {this.state.equipmentId &&
          <Redirect to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, {id: this.state.equipmentId})} />
        }
        <Nav tabs>
          {tabs}
        </Nav>
        <TabContent activeTab={this.state.activeStep}>
          {tabPanes}
        </TabContent>
      </div>
    );
  };

  render() {
    
    const { isFetching, errorMessage } = this.state;
    const { contractor } = this.props;

    if (contractor.status !== CONTRACTOR_STATUSES.ACTIVATED) {
      return (
        <div className="container">
          <h1 className="text-center my-3 alert alert-warning">Your account must be activated to post new equipment!</h1>
        </div>
      );
    }

    return (
      <div className="container pb-5 wizard">
        {isFetching &&
          <ComponentBlocking/>
        }
        <div className="row">
          <div className="col-12">
            <h2 className="my-4 text-center">Post equipment</h2>
            {errorMessage &&
              <div className="alert alert-warning shadown-sm">
                <i className="fal fa-info-circle"></i> {errorMessage}
              </div>
            }
            <hr />
          </div>
        </div>
        {this._renderSteps()}
      </div >
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor
  };
};

export default connect(mapStateToProps)(AddEquipment);
