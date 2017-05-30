import React, { Component } from 'react';
import AvatarDrop from '../../forms/AvatarDrop';
import TextInput from '../../forms/TextInput';
import Select from '../../forms/Select';
import FormFooter from '../../forms/FormFooter';
import MultiSelect from '../../forms/MultiSelect';
import { CURRENCY_OPTIONS, max_upload_file_size } from '../../../constants';
import { convertToOptionsList } from '../../../utils/convertors';

import s from '../ResumeEditTitleBox/ResumeEditTitleBox.css';

export default class VacancyEditTitleBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            uploadingPhoto: false
        };
        ymaps.load(this._onLoad.bind(this));
        this._selectSuggestView = this._selectSuggestView.bind(this);
        this._fetchScopeActivityOptions = this._fetchScopeActivityOptions.bind(this);
    }

    componentWillMount(){
        this.setState({
            formData: {
                header: this.props.data.header,
                name_company: this.props.data.name_company,
                scope_activity: this.props.data.scope_activity,
                address: this.props.data.address,
                salary: this.props.data.salary,
                currency: this.props.data.currency,
            }
        })
    }

    _onLoad() {
        this.suggestView = new window.ymaps.SuggestView('suggest-address');
        this.suggestView.events.add('select', this._selectSuggestView);
    }

    _selectSuggestView (e) {
        const { formData } = this.state;
        let displayName = e.get('item').displayName;
        this.setState({formData: {...formData, address: displayName}})
    }

    _handleScopeActivityChange(val) {
        const scope_activity = convertToOptionsList(val, true);
        this.setState({formData : {...this.state.formData, scope_activity}});
    }

    _handleScopeActivityCreate(e) {
        return {
            label: e.label,
            value: {
                name: e.label
            }
        }
    }

    _handleSubmit(){
        this.props.handleSubmit('titleBox', this.state.formData);
    }

    componentWillReceiveProps(newProps) {
        this.setState({uploadingPhoto: false});
    }

    _handleAvaDrop(files){
        const file = files[0];
        const data = new FormData();
        if (file && file.size > max_upload_file_size ) {
            this.setState({errors : { photo: [gettext('Розмір файла завеликий, максимальний розмір 1Mb')] }})
        } else {
            data.append("logo", file);
            this.setState({uploadingLogo: true}, () => {
                this.props.handleSubmit('logo', data);
            });
        }
    }

    _fetchScopeActivityOptions(query) {
        return this.props.fetchScopeActivityOptions(query.trim())
            .then(response => {
                if(!response.error){
                    return {options: response.payload.data};
                }
            })
    }

    _isValidNewOption(newOption) {
      return newOption.label && (newOption.label).trim().length != 0
    }

    render(){
        const { formData } = this.state;
        const { errors, data } = this.props;
        return (
            <div className={s.resumeEditTitleBox}>
                <div className={s.resumeEditTitleBox__avatar}>
                    <AvatarDrop
                        img={data.logo_company}
                        uploading={this.state.uploadingPhoto}
                        handleDrop={this._handleAvaDrop.bind(this)}
                        errors={ (this.state.errors && this.state.errors.photo) || errors.photo }
                    />
                </div>
                <div className={s.resumeEditTitleBox__form}>
                    <TextInput
                        label={gettext("Назва вакансії")}
                        value={formData.header}
                        handleChange={(e) => {this.setState({formData: {...formData, header: e.target.value} })}}
                        errors={errors.header}
                    />
                    <TextInput
                        label={gettext("Назва компанії")}
                        value={formData.name_company}
                        handleChange={(e) => {this.setState({formData: {...formData, name_company: e.target.value} })}}
                        errors={errors.name_company}
                    />
                    <MultiSelect
                        label="Види діяльності"
                        value={convertToOptionsList(formData.scope_activity)}
                        handleChange={this._handleScopeActivityChange.bind(this)}
                        newOptionCreator={this._handleScopeActivityCreate.bind(this)}
                        loadOptions={this._fetchScopeActivityOptions.bind(this)}
                        isValidNewOption={this._isValidNewOption.bind(this)}
                        creatable
                        async
                    />
                    <TextInput
                        id="suggest-address"
                        label={gettext("Адреса")}
                        value={formData.address}
                        handleChange={(e) => {this.setState({formData: {...formData, address: e.target.value} })}}
                        handleEnterPressed={(e) => {this.setState({formData: {...formData, address: e.target.value} })}}
                        errors={errors.address}
                    />
                    <div className="formrow">
                        <TextInput
                            name="salary"
                            label={gettext("Винагороди")}
                            className="halfrow"
                            value={formData.salary}
                            handleChange={(e) => { this.setState({formData: {...formData, salary: (e.target.value || null)} })}}
                            errors={errors.salary}
                        />
                        <Select
                            label={gettext("Валюта")}
                            className="halfrow"
                            value={formData.currency}
                            handleChange={(val) => { this.setState({formData: {...formData, currency: val.value} })}}
                            errors={errors.currency}
                            options={CURRENCY_OPTIONS}
                        />
                    </div>

                    <FormFooter
                        handleCancel={this.props.handleClose}
                        handleSubmit={this._handleSubmit.bind(this)}
                    />
                </div>
            </div>
        );
    }
}