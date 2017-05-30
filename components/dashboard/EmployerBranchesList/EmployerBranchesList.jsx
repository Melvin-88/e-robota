import React, { Component } from 'react';
import SearchField from '../../forms/SearchField';
import FilterSelect from '../../forms/FilterSelect';
import TextInput from '../../forms/TextInput';
import FormFooter from '../../forms/FormFooter';
import LayerOpener from '../../forms/LayerOpener';

import s from './EmployerBranchesList.css';

export default class EmployerBranchesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showBranchForm: false,
            newBranch: {},
            filteredOffices: null,
            cityOptions: [],
            selectedCity: {value: 'all', label: gettext('Всі міста')},
            filterQuery: '',
            errors: {},
            hasInputFocus: true
        };

        this._renderBranchForm = this._renderBranchForm.bind(this);
        this._filterByName = this._filterByName.bind(this);
        this._filterOffices = this._filterOffices.bind(this);
        this._selectSuggestView = this._selectSuggestView.bind(this);
    }

    componentWillMount(){
        this.props.handleFormInit(gettext('Представництва')); //pass form title to parent component
    }

    componentWillReceiveProps(newProps){
        const {peripheral_offices} = newProps.employer;
        this.setState({'errors': newProps.errors});
        if (newProps.updateCompany) {
            this.setState({showBranchForm: false, newBranch: {}});
        }
        if(!peripheral_offices) return;
        let cities = [];
        peripheral_offices.map(office => {
            if(office.city){
                cities.push({
                    value: office.city.toLowerCase(),
                    label: office.city.charAt(0).toUpperCase() + office.city.slice(1)
                });
            }
        });
        this.setState({cityOptions: cities});
    }

    _onLoad() {
        this.suggestView = new window.ymaps.SuggestView('suggest-branch-address');
        this.suggestView.events.add('select', this._selectSuggestView);
    }

    _selectSuggestView (e) {
        const { newBranch } = this.state;
        let displayName = e.get('item').displayName;
        this.setState({newBranch: {...newBranch, address: displayName}})
    }

    _handleSubmit(){
        const { newBranch } = this.state;
        this.props.handleSubmit('branches', {peripheral_office: newBranch})
        this.setState({hasInputFocus: true})
    }

    _filterByName(query, list){
        if(!query) return list;
        return list.filter(office => {
            const name = office.office_name.toLowerCase();
            return name.startsWith(query.toLowerCase());
        });
    }

    _filterByCity(selectedCity, list) {
        const option = selectedCity.value.toLowerCase();
        if(option != 'all'){
            return list.filter(office => {
                return office.city && office.city.toLowerCase() == option;
            });
        }
        return list;
    }

    _filterOffices(){
        const { filterQuery, selectedCity } = this.state;
        const { peripheral_offices } = this.props.employer;
        let filteredOffices = peripheral_offices || [];
        if(filterQuery)
            filteredOffices = this._filterByName(filterQuery, filteredOffices);
        if(selectedCity)
            filteredOffices = this._filterByCity(selectedCity, filteredOffices);
        this.setState({filteredOffices});
    }

    _renderBranchForm(){
        ymaps.load(this._onLoad.bind(this));
        const { newBranch } = this.state;
        const { errors } = this.state;
        return (
            <div className={s.branchesList__subform}>
                <TextInput
                    label={gettext("Назва представництва")}
                    value={newBranch.office_name}
                    handleChange={(e) => {this.setState({newBranch: {...newBranch, office_name: e.target.value}, hasInputFocus: false})}}
                    errors={errors.office_name}
                    inputRef={el => {
                        if (this.state.hasInputFocus && el) {el.focus()}
                    }}
                />
                <TextInput
                  id="suggest-branch-address"
                  label={gettext("Mісце знаходження")}
                  value={newBranch.address}
                  handleChange={(e) => {this.setState({newBranch: {...newBranch, address: e.target.value}, hasInputFocus: false })}}
                  handleEnterPressed={(e) => {this.setState({newBranch: {...newBranch, address: e.target.value} })}}
                  errors={errors.address}
                />
                <FormFooter
                    handleSubmit={this._handleSubmit.bind(this)}
                    handleCancel={(e) => {this.setState({showBranchForm: false, hasInputFocus: true})}}
                    fetching={this.props.fetching}
                />
            </div>
        );
    }

    _removeBranch(i) {
        let offices = this.props.employer.peripheral_offices;
        let removeOffice = offices.splice(i, 1)[0];
        this.props.handleSubmit('branches', {remove_office: removeOffice});
    }

    render(){
        const { showBranchForm, filteredOffices, selectedCity } = this.state;
        const { peripheral_offices } = this.props.employer;
        const officesList = filteredOffices ? filteredOffices : peripheral_offices;
        return (
            <div className={s.branchesListWrapper}>
                { peripheral_offices && peripheral_offices.length > 1 && //show filterbar only if there are more than 1 item
                    <div className={s.branchFilterBar}>
                        <div className={s.branchFilterBar__searchFieldWrapper}>
                            <SearchField
                                placeholder={gettext("Знайти представництво...")}
                                handleChange={(e) => { this.setState({filterQuery: e.target.value}, () => {this._filterOffices()}) }}
                            />
                        </div>
                        <div className={s.branchFilterBar__filterWrapper}>
                            <FilterSelect
                                placeholder={gettext("Оберіть місто")}
                                options={ [{value: 'all', label: gettext('Всі міста')}, ...this.state.cityOptions] }
                                handleChange={(selectedCity) => { this.setState({selectedCity}, () => { this._filterOffices() }) }}
                                value={ selectedCity }
                            />
                        </div>
                    </div>
                }
                {
                    !showBranchForm &&
                    <LayerOpener
                        label={gettext("+ Додати представництво")}
                        handleClick={(e) => {this.setState({showBranchForm: true, errors: {}})}}
                    />
                }
                {
                    showBranchForm && this._renderBranchForm()
                }
                {
                    peripheral_offices && peripheral_offices.length > 0 &&

                    <ul className={s.branchesList}>
                        <li className={s.branchesList__item + ' ' + s.branchesList__titleRow}>
                            <div className={s.branchesList__branchTitle}>Назва</div>
                            <div className={s.branchesList__branchAddress}>Адреса</div>
                            <div className={s.branchesList__itemAction}/>
                        </li>
                        { officesList.map((office, i) => {
                                return (
                                    <li className={s.branchesList__item} key={'office-' + i}>
                                        <div className={s.branchesList__branchTitle}>{office.office_name}</div>
                                        <div className={s.branchesList__branchAddress}>
                                            {/*<span className={s.branchAddress__city}>{ office.city }, </span>*/}
                                            <span className={s.branchAddress__address}>{office.address}</span>
                                        </div>
                                        <a
                                            className={s.branchesList__itemAction}
                                            onClick={ () => { this._removeBranch(i) }}
                                        >
                                            <i className="icon-cancel"/>
                                        </a>
                                    </li>
                                )
                            })
                        }


                    </ul>
                }
            </div>
        )
    }
}