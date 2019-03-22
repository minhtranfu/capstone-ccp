import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Alert } from 'reactstrap';
import classnames from 'classnames';
import {
  CSSTransition
} from 'react-transition-group';
import { Redirect, Link } from 'react-router-dom';

import Step1 from './Step1';
import Step2 from './Step2';

import { debrisServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';

class PostDebrisRequest extends Component {
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
        name: 'More Information',
        component: Step2
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

    const { constructionId } = this.data;
    this.data.construction = {
      id: +constructionId
    };
    this.data.equipmentTypeId = undefined;
    this.data.constructionId = undefined;

    this.setState({
      isPosting: true
    });
    
    try {
      const data = await debrisServices.postDebris(this.data);
      if (data && data.id) {
        this.setState({
          message: null,
          materialId: data.id,
          isPosting: false
        });
      }
    } catch (error) {
      console.log(error);
      const message = getErrorMessage(error);
      this.setState({
        message,
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
        {this.state.materialId &&
          <Redirect to={`/debrises/${this.state.materialId}`} />
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

  /**
   * Clear error message to dimiss error alert
   */
  _clearMessage = () => {
    this.setState({message: null});
  };

  render() {
    const { message } = this.state;

    return (
      <div className="container pb-5">
        <div className="row">
          <div className="col-12">
            <h2 className="my-4 text-center">
              <Link to="/dashboard/requester/debrises" className="btn btn-outline-primary float-left"><i className="fal fa-chevron-left"></i> Back to list</Link>
              Request debris service
            </h2>
            <hr />
            <Alert color="danger" isOpen={!!message} toggle={this._clearMessage}>
              <i className="fal fa-exclamation-circle"></i> {message}
            </Alert>
          </div>
        </div>
        {this._renderSteps()}
      </div >
    );
  }
}

export default PostDebrisRequest;
