import React, { Component } from 'react';
import AvatarDrop from '../../forms/AvatarDrop';
import TextInput from '../../forms/TextInput';
import Select from '../../forms/Select';
import FormFooter from '../../forms/FormFooter';
import DayMonthYearRow from '../../forms/DayMonthYearRow';
import MultiSelect from '../../forms/MultiSelect';
import { CURRENCY_OPTIONS, max_upload_file_size } from '../../../constants';
import { convertToOptionsList } from '../../../utils/convertors';

import s from './ResumeEditTitleBox.css';

export default class ResumeEditTitleBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bDay: null,
            bMonth: null,
            bYear: null,
            formData: {},
            positionOptions: [],
            uploadingPhoto: false
        };
        ymaps.load(this._onLoad.bind(this));
        this._selectSuggestView = this._selectSuggestView.bind(this);
        this._fetchPositionOptions = this._fetchPositionOptions.bind(this);
    }

    _onLoad() {
        this.suggestView = new window.ymaps.SuggestView('suggest-address');
        this.suggestView.events.add('select', this._selectSuggestView);
    }

    _selectSuggestView (e) {
        const { formData } = this.state;
        let displayName = e.get('item').displayName;
        this.setState({formData: {...formData, jobseeker_address: displayName}})
    }

    _handlePositionsChange(val) {
        const positions = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, positions}});
    }

    _handlePositionCreate(e) {
        return {
            label: e.label,
            value: {
                name: e.label
            }
        }
    }

    _handleSubmit(){
        const {
            formData,
            bDay,
            bMonth,
            bYear
        } = this.state;
        const { handleSubmit } = this.props;
        let d = formData || {};
        const birthday = bYear && (bMonth >= 0) && bDay ? `${bYear}-${bMonth+1}-${bDay}` : null;
        if(birthday)
            d.jobseeker_birthday = birthday;
        handleSubmit('titleBox', d);
    }

    componentWillReceiveProps(newProps) {
        this.setState({uploadingPhoto: false});
    }

    componentWillMount(){
        const { data } = this.props;
        let year = null;
        let month = null;
        let day = null;
        if (data.jobseeker_birthday) {
            let birthday = new Date(data.jobseeker_birthday);
            year = birthday.getFullYear();
            month = birthday.getMonth();
            day = birthday.getDate();
        }
        this.setState({
            bYear: year,
            bMonth: month,
            bDay: day,
            formData: data
        });
    }

    _handleAvaDrop(files){
        const file = files[0];
        const data = new FormData();
        if (file && file.size > max_upload_file_size ) {
            this.setState({errors : { photo: [gettext('Розмір файла завеликий, максимальний розмір 2Mb')] }})
        } else {
            data.append("photo", file);
            this.setState({uploadingUserpic: true, errors: null});
            this.props.handleSubmit('photo', data);
        }
    }

    _fetchPositionOptions(query) {
        this.props.fetchPositions(this.props.data.id, query)
            .then(response => {
                if(!response.error){
                    this.setState({positionOptions: response.payload.data});
                }
            })
    }

    render(){
        const { formData } = this.state;
        const { errors, data } = this.props;
        return (
           <div className={s.resumeEditTitleBox}>
               <div className={s.resumeEditTitleBox__avatar}>
                   <AvatarDrop
                       img={data.jobseeker_photo}
                       uploading={this.state.uploadingPhoto}
                       handleDrop={this._handleAvaDrop.bind(this)}
                       errors={ (this.state.errors && this.state.errors.photo) || errors.photo }
                   />
               </div>
               <div className={s.resumeEditTitleBox__form}>
                   <TextInput
                        label={gettext("Iм'я")}
                        value={typeof formData.jobseeker_name === 'undefined' ? data.jobseeker_name : formData.jobseeker_name || ''}
                        handleChange={(e) => {this.setState({formData: {...formData, jobseeker_name: e.target.value} })}}
                        errors={errors.jobseeker_name}
                   />
                   <TextInput
                       label={gettext("Назва резюме")}
                       value={typeof formData.header === 'undefined' ? data.header : formData.header || ''}
                       handleChange={(e) => {this.setState({formData: {...formData, header: e.target.value} })}}
                       errors={errors.header}
                   />
                   <MultiSelect
                       label="Посада, на якiй хочете працювати"
                       options={this.state.positionOptions}
                       value={convertToOptionsList(typeof formData.positions === 'undefined' ? data.positions : formData.positions)}
                       handleChange={this._handlePositionsChange.bind(this)}
                       newOptionCreator={this._handlePositionCreate.bind(this)}
                       onInputChange={val => {this._fetchPositionOptions(val)}}
                       creatable
                   />
                   <div className="formrow">
                       <TextInput
                           name="salary"
                           label={gettext("Сума винагородження")}
                           className="halfrow"
                           value={typeof formData.salary === 'undefined' ? data.salary : formData.salary || ''}
                           handleChange={(e) => {this.setState({formData: {...formData, salary: (e.target.value || null)} })}}
                           errors={errors.salary}
                           validation={['onlyNumbers']}
                           handleFieldErrors={this.props.handleFieldErrors}
                       />
                       <Select
                           label={gettext("Валюта")}
                           className="halfrow"
                           value={typeof formData.currency === 'undefined' ? data.currency : formData.currency }
                           handleChange={(val) => { this.setState({formData: {...formData, currency: val.value} })}}
                           errors={errors.currency}
                           options={CURRENCY_OPTIONS}
                       />
                   </div>

                   <TextInput
                       id="suggest-address"
                       label={gettext("Адреса")}
                       value={typeof formData.jobseeker_address === 'undefined' ? data.jobseeker_address : formData.jobseeker_address}
                       handleChange={(e) => {this.setState({formData: {...formData, jobseeker_address: e.target.value} })}}
                       handleEnterPressed={(e) => {this.setState({formData: {...formData, jobseeker_address: e.target.value} })}}
                       errors={errors.jobseeker_address}
                   />

                   <DayMonthYearRow
                       day={this.state.bDay}
                       month={this.state.bMonth}
                       year={this.state.bYear}
                       handleChange={(data) => { this.setState(data) }}
                       errors={errors.birthday}
                   />
                   <FormFooter
                       handleCancel={this.props.handleClose}
                       handleSubmit={this._handleSubmit.bind(this)}
                   />
               </div>
           </div>
       );
   }
}