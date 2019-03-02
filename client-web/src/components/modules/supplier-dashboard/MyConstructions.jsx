import React, { PureComponent } from 'react';

import ccpApiService from '../../../services/domain/ccp-api-service';

class MyConstructions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _loadData = async () => {
    // TODO: Remove hardcode constractor ID
    const constractorId = 12;
    const constructions = await ccpApiService.getConstructionsByContractorId(constractorId);
    this.setState({
      constructions
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _handleChangeField = e => {
    const { construction } = this.state;

    
  };

  _handleSaveConstruction = () => {

  };

  _renderEditingConstructionCard = construction => {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="">Construction name:</label>
          <input type="text" className="form-control" name="name" defaultValue={construction.name} autoFocus/>
        </div>
        <div className="form-group">
          <label htmlFor="">Address:</label>
          <input type="text" className="form-control" name="address" defaultValue={construction.address} />
        </div>
        <div className="form-group">
          <span className="float-right">
            <button className="btn btn-success btn-sm" onClick={() => this._setEdittingConstructionId(null)}><i className="fa fa-save"></i> Save</button>
            <button className="btn btn-outline-success btn-sm ml-2" onClick={() => this._setEdittingConstructionId(null)}><i className="fa fa-times"></i> Cancel</button>
          </span>
          <span className="clearfix"></span>
        </div>
      </div>
    );
  };

  _renderConstructionCard = construction => {
    return (
      <div style={{height: "252px"}}>
        <h4 className="m-0">
          {construction.name}
          <span className="float-right">
            <button className="btn btn-outline-success btn-sm" onClick={() => this._setEdittingConstructionId(construction.id, construction)}><i className="fa fa-pencil"></i></button>
            <button className="btn btn-outline-danger btn-sm ml-2"><i className="fa fa-trash"></i></button>
          </span>
          <span className="clearfix"></span>
        </h4>
        <p>Address: {construction.address}</p>
      </div>
    );
  };

  _setEdittingConstructionId = (edittingId, construction) => {
    this.setState({ edittingId, construction });
  };

  render() {
    const { constructions, edittingId } = this.state;

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h4>My Constructions <button className="btn btn-success btn-sm float-right"><i className="fa fa-plus"></i> Add new</button></h4>
            {constructions && constructions.map(construction => {
              return (
                <div key={construction.id} className={`construction-card ${construction.id === edittingId ? 'editting' : ''} bg-white shadow-sm my-3 p-3 rounded`}>
                  {construction.id === edittingId ? this._renderEditingConstructionCard(construction) : this._renderConstructionCard(construction)}
                </div>
              );
            })}
          </div>
          <div className="col-md-3">
            <div className="h-100 bg-dark text-light text-center">
              <h6>USER MENU PLACEHOLDER</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyConstructions;
