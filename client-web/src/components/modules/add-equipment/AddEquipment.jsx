import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import {
  CSSTransition
} from 'react-transition-group';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

import ccpApiService from '../../../services/domain/ccp-api-service';

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
    this.data.latitude = '10.12313';
    this.data.longitude = '10.12313';
    this.data.equipmentTypeId = undefined;
    this.data.constructionId = undefined;

    this.setState({
      isPosting: true
    });
    const data = await ccpApiService.postEquipment(this.data);
    if (data && data.id) {
      this.setState({
        equipmentId: data.id,
        isPosting: false
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
            <h2 className="my-4 text-center">Post equipment</h2>
            <hr />
          </div>
        </div>
        {this._renderSteps()}
      </div >
    );
  }
}

export default AddEquipment;
