import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import {
  CSSTransition
} from 'react-transition-group';
import { Redirect } from 'react-router-dom';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

import ccpApiService from '../../../services/domain/ccp-api-service';

class AddEquipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      data: {}
    };

    this.data = {
      contractor: {
        id: 12
      } // Todo: Get constructorId from user data
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

    const data = await ccpApiService.postEquipment(this.data);
    if (data && data.id) {
      this.setState({
        equipmentId: data.id
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
        <NavItem key={index}>
          <NavLink
            className={classnames({ active: this.state.activeStep === index })}
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
          <Redirect to={`/equip-detail/${this.state.equipmentId}`} />
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
    return (
      <div className="container pb-5">
        <div className="row">
          <div className="col-12">
            <h2 className="my-4">Post equipment</h2>
            <hr />
          </div>
        </div>
        {this._renderSteps()}
      </div >
    );
  }
}

export default AddEquipment;
