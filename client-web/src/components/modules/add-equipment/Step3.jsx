import React from 'react';
import Step from './Step';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';

import 'bootstrap-daterangepicker/daterangepicker.css';

import { fetchEquipmentTypes, fetchEquipmentTypeSpecs } from '../../../redux/actions/thunks';
import { connect } from 'react-redux';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

class DropzoneWithPreview extends React.Component {
  constructor() {
    super()
    this.state = {
      files: []
    };
  }

  onDrop(files) {
    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    });
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview))
  }

  render() {
    const { files } = this.state;

    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ));

    return (
      <section>
        <DropZone
          accept="image/*"
          onDrop={this.onDrop.bind(this)}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}
              className="image-dropzone d-flex align-items-center justify-content-center rounded"
            >
              <input {...getInputProps()} />
              <p>Click to select or drop photos here</p>
            </div>
          )}
        </DropZone>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
      </section>
    );
  }
}

class AddEquipmentStep3 extends Step {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  _onChangeDescription = (description) => {
    this.setState({ description });
  };

  _handleFieldChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  _handleSubmitForm = () => {
    this._handleStepDone({
      data: this.state
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h4 className="my-3">More information</h4>
          </div>
          <div className="col-md-6">
            <label htmlFor="">Upload some photo of equipment</label>
            <DropzoneWithPreview />
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="">Mô tả</label>
              <FroalaEditor tag="textarea" config={{
                placeholderText: 'Mô tả thiết bị của bạn',
                maxLength: 10,
                height: 260,
                htmlExecuteScripts: false
              }} rows="10"
                model={this.state.description}
                onModelChange={this._onChangeDescription}
              />
            </div>
          </div>
          <div className="col-md-12 text-center">
            <div className="form-group">
              <button className="btn btn-outline-primary mr-2" onClick={this._handleBackStep}><i className="fa fa-chevron-left"></i> PREVIOUS STEP</button>
              <button className="btn btn-success ml-2" onClick={this._handleSubmitForm}>NEXT STEP <i className="fa fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEquipmentStep3.propTypes = {
  entities: PropTypes.object.isRequired
};

export default connect(
  (state) => {
    return { entities: { ...state.entities } };
  },
  { fetchEquipmentTypes, fetchEquipmentTypeSpecs }
)(AddEquipmentStep3);
