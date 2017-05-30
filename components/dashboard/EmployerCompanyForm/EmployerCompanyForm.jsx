import React, { Component } from 'react';
import AvatarDrop from '../../forms/AvatarDrop';
import TextInput from '../../forms/TextInput';
import TextArea from '../../forms/TextArea';
import Switch from '../../forms/Switch';
import FormFooter from '../../forms/FormFooter';
import { max_upload_file_size } from '../../../constants';

import s from './EmployerCompanyForm.css';

export default class EmployerCompanyForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            employer: null,
            hasParentCompany: false,
            uploadingLogo: true,
            errors: {}
        }
    }

    componentWillMount(){
        this.props.handleFormInit(gettext('Про компанiю')); //pass form title to parent component
    }

    componentDidMount() {
      this.inputElementFocus && this.inputElementFocus.focus();
    }

    componentWillReceiveProps(newProps) {
        const { employer } = newProps;
        if(!employer) return;
        this.setState({uploadingLogo: false});
        if(newProps.fetching || (Object.keys(newProps.errors).length != 0 && this.state.employer)) return;

        if(employer.structure_name) this.setState({hasParentCompany: true});
        this.setState({employer: employer});
    }

    _handleFieldErrors(f){
        let errors = this.state.errors;
        if(f.errors.length < 1 && typeof errors[f.field] != 'undefined') {
            delete errors[f.field];
        } else if (f.errors.length != 0) {
            errors[f.field] = f.errors;
        }
        this.setState({errors});
    }

    _handleLogoSelect(files) {
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

    _handleSubmit(){
        const { employer, hasParentCompany } = this.state;
        let data = {
            company_name: typeof employer.company_name === 'undefined' ? this.props.employer.company_name : employer.company_name,
            code: typeof employer.code === 'undefined' ? this.props.employer.code : employer.code,
            trade_mark: typeof employer.trade_mark === 'undefined' ? this.props.employer.trade_mark : employer.trade_mark,
            workers_count: typeof employer.workers_count === 'undefined' ? this.props.employer.workers_count : (employer.workers_count ? employer.workers_count : null),
            company_info: typeof employer.company_info === 'undefined' ? this.props.employer.company_info : employer.company_info,
            is_in_structure: hasParentCompany ? (typeof employer.structure_name === 'undefined' ? !!this.props.employer.structure_name : !!employer.structure_name) : false,
            structure_name: hasParentCompany ? (typeof employer.structure_name === 'undefined' ? this.props.employer.structure_name : employer.structure_name) : null,
        };
        this.props.handleSubmit('info', data);
    }

    render() {
        const { errors } = this.props;
        const employer = this.state.employer ? this.state.employer : {};
        return (
            <div>
                <AvatarDrop
                    handleDrop={ this._handleLogoSelect.bind(this) }
                    uploading={ this.state.uploadingLogo }
                    img={ this.props.employer.logo }
                    errors={ (this.state.errors && this.state.errors.photo) || errors.photo }
                />
                <TextInput
                    label={gettext("Код ЄДРПОУ")}
                    name="code"
                    value={ employer.code }
                    handleChange={(e) => {this.setState({employer: {...employer, code: e.target.value} })}}
                    errors={errors.code || this.state.errors.code}
                    validation={['onlyNumbers']}
                    handleFieldErrors={this._handleFieldErrors.bind(this)}
                    inputRef={el => this.inputElementFocus = el}
                />
                <TextInput
                    label={gettext("Повна юридична назва")}
                    value={ employer.company_name }
                    handleChange={(e) => {this.setState({employer: {...employer, company_name: e.target.value} })}}
                    errors={errors.company_name}
                />
                <TextInput
                    label={gettext("Торгова марка на ринку")}
                    value={ employer.trade_mark }
                    handleChange={(e) => {this.setState({employer: {...employer, trade_mark: e.target.value} })}}
                    errors={errors.trade_mark}
                />
                <TextInput
                    label={gettext("Кількість робітників")}
                    name="workers_count"
                    value={ employer.workers_count }
                    handleChange={(e) => {this.setState({employer: {...employer, workers_count: e.target.value} })}}
                    errors={errors.workers_count || this.state.errors.workers_count}
                    validation={['onlyNumbers']}
                    handleFieldErrors={this._handleFieldErrors.bind(this)}
                />
                <TextArea
                    label={gettext("Iнформация про компанію")}
                    value={ employer.company_info }
                    handleChange={(e) => {this.setState({employer: {...employer, company_info: e.target.value} })}}
                    errors={errors.company_info}
                />
                <Switch
                    label={gettext("Включено в структуру")}
                    value={this.state.hasParentCompany}
                    handleChange={(val) => {this.setState({hasParentCompany: val})}}
                />

                {
                    this.state.hasParentCompany &&
                    <div>
                        <TextInput
                            label={gettext("Назва структури")}
                            value={ employer.structure_name }
                            handleChange={(e) => {this.setState({employer: {...employer, structure_name: e.target.value} })}}
                            errors={errors.structure_name}
                        />
                    </div>
                }

                <FormFooter
                    handleSubmit={this._handleSubmit.bind(this)}
                    handleCancel={() => {}}
                    fetching={this.props.fetching}
                />

            </div>
        );
    }
}