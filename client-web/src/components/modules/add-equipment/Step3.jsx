import React from "react";
import Step from "./Step";
import PropTypes from "prop-types";
import DropZone from "react-dropzone";

import "bootstrap-daterangepicker/daterangepicker.css";

import {
  fetchEquipmentTypes,
  fetchEquipmentTypeSpecs
} from "../../../redux/actions/thunks";
import { connect } from "react-redux";
import ccpApiService from "../../../services/domain/ccp-api-service";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

class DropzoneWithPreview extends React.Component {
  constructor() {
    super();
    this.state = {
      files: []
    };
  }

  onDrop(files) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(files);
    }

    this.setState({
      files: files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    });
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
  }

  render() {
    const { files } = this.state;

    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} style={img} />
        </div>
      </div>
    ));

    return (
      <section>
        <DropZone accept="image/*" onDrop={this.onDrop.bind(this)}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="image-dropzone d-flex align-items-center justify-content-center rounded"
            >
              <input {...getInputProps()} />
              <p>Click to select or drop photos here</p>
            </div>
          )}
        </DropZone>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </section>
    );
  }
}

class AddEquipmentStep3 extends Step {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _onChangeDescription = description => {
    this.setState({ description });
  };

  _handleFieldChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  _handleSelectFiles = files => {
    this.setState({ files });
  };

  _handleSubmitForm = async () => {
    const { files, description } = this.state;
    const formData = new FormData();
    files.forEach(file => {
      formData.append("file", file);
    });
    
    this.setState({
      isFetching: true
    });

    let data = {
      description
    };

    // Upload images
    if (files && files.length > 0) {
      const images = await ccpApiService.uploadEquipmentImage(formData);
      data = {
        ...data,
        equipmentImages: images.map(image => ({id: image.id})),
        thumbnailImage: {
          id: images[0].id
        }
      };
    }
    
    // Hanlde step done
    this._handleStepDone({
      data
    });

    // Remove page loader
    this.setState({
      isFetching: true
    });
  };

  render() {
    return (
      <div className="container">
        {this.state.isFetching &&
          <div className="page-loader d-flex align-items-center justify-content-center flex-column">
            <div className="spinner-border" style={{ width: '5rem', height: '5rem' }} role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div>Processing...</div>
          </div>
        }
        <div className="row">
          <div className="col-md-12">
            <h4 className="my-3">More information</h4>
          </div>
          <div className="col-md-6">
            <label htmlFor="">Upload some photo of equipment</label>
            <DropzoneWithPreview onChange={this._handleSelectFiles} />
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="">Mô tả</label>
              <textarea
                tag="textarea"
                className="form-control"
                rows="8"
                name="description"
                value={this.state.description || ""}
                onChange={this._handleFieldChange}
              />
            </div>
          </div>
          <div className="col-md-12 text-center">
            <div className="form-group">
              <button
                className="btn btn-outline-primary mr-2"
                onClick={this._handleBackStep}
              >
                <i className="fal fa-chevron-left" /> PREVIOUS STEP
              </button>
              <button
                className="btn btn-success ml-2"
                onClick={this._handleSubmitForm}
              >
                NEXT STEP <i className="fal fa-chevron-right" />
              </button>
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
  state => {
    return { entities: { ...state.entities } };
  },
  { fetchEquipmentTypes, fetchEquipmentTypeSpecs }
)(AddEquipmentStep3);
