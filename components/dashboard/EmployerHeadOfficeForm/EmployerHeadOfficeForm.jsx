import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import ReactTelInput from 'react-telephone-input'

import s from './EmployerHeadOfficeForm.css';

export default class EmployerHeadOfficeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headoffice: {},
            errors: {}
        };
        this._handlePhoneChange = this._handlePhoneChange.bind(this);
        this._selectSuggestView = this._selectSuggestView.bind(this);
        ymaps.load(this._onLoad.bind(this))
    }

    componentWillMount(){
        this.props.handleFormInit(gettext('Головний офіс')); //pass form title to parent component
        this.setState({
            headoffice: {
            ...this.state.headoffice,
            phone: this.props.employer.phone,
            website: this.props.employer.website,
            address: this.props.employer.address
            }
        });
    }

    componentDidMount() {
        this.refs.inputElementFocus && this.refs.inputElementFocus.refs.instance.refs.numberInput.focus();
    }

    componentWillReceiveProps(newProps){
        if (newProps.employer && Object.keys(newProps.errors).length == 0 && !newProps.fetching) {
            this.setState({headoffice: {
                ...this.state.headoffice,
                phone: newProps.employer.phone,
                website: newProps.employer.website,
                address: newProps.employer.address
            }});
        }
    }

    _handleFieldErrors(f){
        let errors = this.state.errors;
        if(f.errors.length < 1 && typeof errors[f.field] != 'undefined') {
            delete errors[f.field];
        } else if(f.errors.length > 0){
            errors[f.field] = f.errors;
        }
        this.setState({errors});
    }

    _handlePhoneChange(telNumber, selectedCountry) {
        if (!this.state.headoffice)
            return;
        telNumber = telNumber.substr(0,17);

        if (telNumber.length < 4) {
            this.setState({headoffice: {...this.state.headoffice, phone: '+380'}})
        } else {
            this.setState({headoffice: {...this.state.headoffice, phone: telNumber}})
        }
    }

    _onLoad() {
        this.suggestView = new window.ymaps.SuggestView('suggest-head-office-address');
        this.suggestView.events.add('select', this._selectSuggestView);
    }

    _selectSuggestView (e) {
        const { headoffice } = this.state;
        let displayName = e.get('item').displayName;
        this.setState({headoffice: {...headoffice, address: displayName}})
    }

    render(){
        const { headoffice } = this.state;
        const { errors } = this.props;
        return (
            <div>
                <label className='inputLabel inputLabel_default'>{gettext("Контактний телефон")}</label>
                <ReactTelInput
                    defaultCountry="ua"
                    value={headoffice.phone}
                    onlyCountries={[{name: 'Україна', iso2: 'ua', dialCode: '380', format: '+...(..)...-..-..', priority: 0}]}
                    onChange={this._handlePhoneChange}
                    flagsImagePath="/static/img/flags.png"
                    classNames="reactTelephoneInput"
                    ref='inputElementFocus'
                />
                { errors.phone &&
                  <ul className={s.errorList}>
                    {errors.phone.map((error, i) => {
                      return (
                        <li key={"error-" + i}>{error}</li>
                      )})
                    }
                  </ul>
                }
                <TextInput
                    label={gettext("Адреса сайту")}
                    name="website"
                    value={headoffice.website}
                    handleChange={(e) => {this.setState({headoffice: {...headoffice, website: e.target.value} })}}
                    errors={this.state.errors.website || errors.website}
                    validation={['url']}
                    handleFieldErrors={this._handleFieldErrors.bind(this)}
                    placeholder='http://example.com'
                />
                <TextInput
                  id="suggest-head-office-address"
                  label={gettext("Адреса")}
                  value={headoffice.address}
                  handleChange={(e) => {this.setState({headoffice: {...headoffice, address: e.target.value} })}}
                  handleEnterPressed={(e) => {this.setState({headoffice: {...headoffice, address: e.target.value} })}}
                  errors={errors.address}
                />
                <FormFooter
                    handleSubmit={() => { this.props.handleSubmit('headoffice', headoffice) }}
                    handleCancel={() => {}}
                    fetching={this.props.fetching}
                    //submitDisabled={Object.keys(this.state.errors).length > 0}
                />
            </div>
        )
    }
}