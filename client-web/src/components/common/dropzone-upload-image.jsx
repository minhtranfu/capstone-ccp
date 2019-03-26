import React, { Component } from "react";
import DropZone from "react-dropzone";

class DropzoneUploadImage extends Component {
  constructor() {
    super();
    this.state = {
      files: []
    };
  }

  _onDrop = files => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(files);
    }
  }

  render() {

    return (
      <section>
        <DropZone accept="image/*" onDrop={this._onDrop}>
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
      </section>
    );
  }
}

export default DropzoneUploadImage;
