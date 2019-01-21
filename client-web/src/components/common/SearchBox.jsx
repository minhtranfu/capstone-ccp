import React, { PureComponent } from 'react';

class SearchBox extends PureComponent {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h3>Tìm thuê thiết bị</h3>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="equipment_type">Loại thiết bị:</label>
                        <select name="equipment_type" id="equipment_type" className="form-control">
                            <option value="">--Chọn--</option>
                            <option value="1">Xe múc</option>
                            <option value="2">Xe ủi</option>
                            <option value="3">Xe lu</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="time">Thời gian</label>
                        <div className="row">
                            <div className="col-md-6">
                                <input type="date" className="form-control" name="start_at" id="time"/>
                            </div>
                            <div className="col-md-6 mt-md-0 mt-2">
                                <input type="date" className="form-control" name="end_at"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-success">Tìm</button>
                </div>
            </div>
        );
    }
}

export default SearchBox;