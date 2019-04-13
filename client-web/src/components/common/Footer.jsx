import React from 'react';
import PropTypes from 'prop-types';

const Footer = () => {
  return (
    <footer className="page-footer font-small bg-dark text-light pt-4 mt-auto">
      <div className="container text-center text-md-left">
        <div className="row">
          <div className="col-md-12 mt-md-0 mt-3 text-center">
            <h5 className="text-uppercase mb-3">A capstone project at</h5>
            <img src="https://seeklogo.com/images/F/fpt-university-logo-B3B6D84292-seeklogo.com.png"
              alt="FPT University logo" height="80"/>
          </div>
        </div>
      </div>
      <div className="footer-copyright text-center py-3 bg-black">
        <hr/>
      © 2019 Copyright
        <a href="#"> CCP Project Team</a>
      </div>
    </footer>
  );
};

export default Footer;
