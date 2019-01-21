import React from 'react';
import PropTypes from 'prop-types';

const Footer = () => {
  return (
    <footer class="page-footer font-small bg-dark text-light pt-4">
      <div class="container text-center text-md-left">
        <div class="row">
          <div class="col-md-6 mt-md-0 mt-3">
            <h5 class="text-uppercase">Footer Content</h5>
            <p>Here you can use rows and columns here to organize your footer content.</p>
          </div>
          <hr class="clearfix w-100 d-md-none pb-3" />
          <div class="col-md-3 mb-md-0 mb-3">
            <h5 class="text-uppercase">Links</h5>
            <ul class="list-unstyled">
              <li>
                <a href="#!">Link 1</a>
              </li>
              <li>
                <a href="#!">Link 2</a>
              </li>
              <li>
                <a href="#!">Link 3</a>
              </li>
              <li>
                <a href="#!">Link 4</a>
              </li>
            </ul>
          </div>
          <div class="col-md-3 mb-md-0 mb-3">
            <h5 class="text-uppercase">Links</h5>
            <ul class="list-unstyled">
              <li>
                <a href="#!">Link 1</a>
              </li>
              <li>
                <a href="#!">Link 2</a>
              </li>
              <li>
                <a href="#!">Link 3</a>
              </li>
              <li>
                <a href="#!">Link 4</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-copyright text-center py-3 bg-black">
      <hr/>
      © 2019 Copyright
      <a href="#"> CCP Project Team</a>
      </div>
    </footer>
  );
};

const GithubButton = ({
  label,
  icon,
  href,
  ariaLabel
}) => {
  return (
    <div style={{ margin: 5 }}>
      <a className="github-button"
        href={`https://github.com/${href}`}
        data-icon={icon}
        data-size="large"
        data-show-count={true}
        aria-label={ariaLabel}>
        {label}
      </a>
    </div>
  );
};

GithubButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired
};

export default Footer;
