import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import {
    CSSTransition,
} from 'react-transition-group';

import Step1 from './Step1';

class AddEquipment extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        return (
            <div className="container py-5">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Step 1
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Next step
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>

                    <TabPane tabId="1" className="p-1">
                        <CSSTransition
                            in={this.state.activeTab == 1}
                            unmountOnExit
                            timeout={500}
                            classNames="fade"
                        >
                            <Row>
                                <Col sm="12">
                                    <Step1 />
                                </Col>
                            </Row>
                        </CSSTransition>
                    </TabPane>

                    <TabPane tabId="2" className="p-1">
                        <CSSTransition
                            in={this.state.activeTab == 2}
                            timeout={500}
                            classNames="fade"
                        >
                            <Row>
                                <Col sm="12">
                                    <Step1 />
                                </Col>
                            </Row>
                        </CSSTransition>
                    </TabPane>
                </TabContent>
            </div >
        );
    }
}

// export default connect()(AddEquipment);
export default AddEquipment;