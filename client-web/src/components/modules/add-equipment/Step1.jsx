import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';

import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Skeleton from 'react-loading-skeleton';

import { fetchEquipmentTypes, fetchEquipmentTypeInfos } from '../../../redux/actions/thunks';
import { ENTITY_KEY } from '../../../common/app-const';
import { connect } from 'react-redux';

class AddEquipmentStep1 extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            description: "",
            additionField: [],
            additionField1: [
                {
                    key: 'model',
                    name: 'Mã hiệu',
                    type: 'text',
                },
                {
                    key: 'manufactor',
                    name: 'Nhà sản xuất',
                    type: 'text',
                },
            ],
        }
    }

    componentDidMount() {
        this.setState({
            additionField: this.state.additionField1
        });

        this._loadEquipmentTypes();
    }

    _loadEquipmentTypes = () => {
        const { fetchEquipmentTypes } = this.props;

        fetchEquipmentTypes();
    };

    _onChangeEquipType = (e) => {
        const equipTypeId = e.target.value;
        const { fetchEquipmentTypeInfos} = this.props;

        fetchEquipmentTypeInfos(equipTypeId);
    };

    _onChangeDescription = (description) => {
        this.setState({description});
    };

    _onChangeDateRanage = (e, picker) => {
        const { ranges } = this.state;
        const rangeId = e.target.dataset.rangeId;
        
        if (ranges[rangeId] == undefined) {
            ranges[rangeId] = {};
        }

        ranges[rangeId].startDate = picker.startDate;
        ranges[rangeId].endDate = picker.endDate;
        this.setState({
            ranges: [...ranges],
        })
    };

    _getLabelOfRange = (rangeId) => {
        const { ranges } = this.state;
        const range = ranges[rangeId];
        if (range == undefined) {
            return '';
        }

        return `${range.startDate} - ${range.endDate}`;
    }

    render() {
        const { entities } = this.props;
        console.log(this.props.entities);
        const equipmentTypes = entities[ENTITY_KEY.EQUIPMENT_TYPES];
        const equipmentTypeInfos = entities[ENTITY_KEY.EQUIPMENT_TYPE_INFOS];

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="my-4">Đăng thiết bị mới</h2>
                        <hr/>
                    </div>
                    <div className="col-md-6">
                        <h4 className="mb-3">Thông tin chung</h4>
                        <div className="form-group">
                            <label htmlFor="">Tên thiết bị <i className="text-danger">*</i></label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Loại thiết bị <i className="text-danger">*</i></label>
                            <select onChange={this._onChangeEquipType} data-live-search="true" name="equip_type_id" id="equip_type_id" className="form-control selectpicker">
                                {equipmentTypes && equipmentTypes.data && equipmentTypes.data.map(type => {
                                    return (<option value={type.id} key={type.id}>{type.name}</option>);
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Công trường <i className="text-danger">*</i></label>
                            <select name="equip_type_id" id="equip_type_id" className="form-control">
                                
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Số lượng <i className="text-danger">*</i></label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Thời gian rảnh</label>
                            <DateRangePicker startDate="1/1/2014" endDate="3/1/2014" autoUpdateInput timePicker timePicker24Hour>
                            <input type="text" className="form-control" value=""/>
                            </DateRangePicker>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Mã vật tư <i className="text-dangerr">*</i></label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Đơn vị tính</label>
                            <select name="" id="" className="form-control">
                                <option value="">Cái</option>
                                <option value="">Kg</option>
                                <option value="">Lít</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Mô tả</label>
                            {/* <textarea name="" id="" rows="8" className="form-control" placeholder="Mô tả ở đây..."></textarea> */}
                            
                            <p>Preview:</p>
                            <div className="mb-2" dangerouslySetInnerHTML={{__html: this.state.description}} />

                            <FroalaEditor tag="textarea" config={{
                                placeholderText: "Mô tả thiết bị của bạn",
                                maxLength: 10,
                                height: 260,
                                htmlExecuteScripts: false,
                                }} rows="10"
                                model={this.state.description}
                                onModelChange={this._onChangeDescription}
                                />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h4 className="mb-3">Thông tin đặc biệt</h4>
                        {equipmentTypeInfos && equipmentTypeInfos.data && equipmentTypeInfos.data.map(field => {
                            return (
                                <div key={field.id} className="form-group">
                                    <label htmlFor="">{field.name}</label>
                                    <input type="text" name={field.id} className="form-control"/>
                                </div>
                            );
                        })}
                        {(!equipmentTypeInfos || !equipmentTypeInfos.data) &&
                            <div>
                                <Skeleton width={100}/>
                                <Skeleton/>
                                <Skeleton width={100}/>
                                <Skeleton/>
                                <Skeleton width={100}/>
                                <Skeleton/>
                                <Skeleton width={100}/>
                                <Skeleton/>
                            </div>
                        }
                        {/* <div className="form-group">
                            <label htmlFor="">Mã hiệu</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Nhà sản xuất</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Màu sắc</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Kích thước</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Tiêu chuẩn</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Nguồn gốc</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Cường độ</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Tỉ trọng</label>
                            <input type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success">Đăng</button>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

AddEquipmentStep1.propTypes = {
    entities: PropTypes.object.isRequired,
    fetchEquipmentTypes: PropTypes.func.isRequired,
    fetchEquipmentTypeInfos: PropTypes.func.isRequired,
};

export default connect(
(state) => {
    return {entities: {...state.entities}}
},
    { fetchEquipmentTypes, fetchEquipmentTypeInfos }
)(AddEquipmentStep1);
