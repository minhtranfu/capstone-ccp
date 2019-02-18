import React, { PureComponent } from 'react';

class PageLoader extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillUnmount() {
        
    }

    render() {
        return (
            <div className="page-loader"></div>
        );
    }
}

export default PageLoader;