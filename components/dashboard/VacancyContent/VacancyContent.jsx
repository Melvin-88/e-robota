import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    fetchVacancy,
    updateVacancyActivity,
    deleteVacancy,
    copyVacancy,
    fetchScopeActivity,
    updateVacancyTitleBox,
    updateVacancyLogo,
    updateVacancyLanguages,
    updateVacancyAbout,
    updateVacancySkills,
    updateVacancyCourses,
    updateVacancyCertificates,
    updateVacancyConditions,
    fetchTimeSchedules,
    fetchAdvantages
} from '../../../actions/vacancyActions';
import {
    fetchPositions,
    fetchExperienceSpecialty,
    fetchSkills,
    fetchCities,
    fetchEmploymentTypes,
} from '../../../actions/cvActions';
import {
    dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';
import {
    fetchLanguageSkills,
    fetchLanguages,
    fetchEducationLevels,
    fetchInstitutions,
} from '../../../actions/userActions';

import { updateBreadcrumbs } from '../../../actions/commonActions';

import Avatar from '../../common/Avatar';
import Switch from '../../forms/Switch';
import Tags from '../../forms/Tags';
import CollapseSection from '../../common/CollapseSection';
import Collapsible from 'react-collapsible';
import Button from '../../forms/Button';
import moment from 'moment';
import LanguagesForm from '../ProfileLanguagesForm';
import CoursesForm from '../ProfileCoursesForm';
import ButtonWithConfirmation from '../../forms/ButtonWithConfirmation';
import EditTitleBox from '../VacancyEditTitleBox';
import VacancyEditAboutForm from '../VacancyEditAboutForm';
import VacancyEditSkillsForm from '../VacancyEditSkillsForm';
import CertificatesForm from '../ProfileCertificatesForm';
import VacancyEditConditionsForm from '../VacancyEditConditionsForm';

import s from '../ResumeContent/ResumeContent.css';


class VacancyContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isActiveResume: false,
            editTitleBox: false,
            editAboutBox: false,
            editSkillsBox: false,
            editLanguagesBox: false,
            editCoursesBox: false,
            editCertificatesBox: false,
            editConditionsBox: false,
            errors: {},
            mustSkills: [],
            otherSkills: []
        };
        this._handleFormSubmit = this._handleFormSubmit.bind(this);

        const { url } = props.match;
        let p = url.split('/');
        let path = [];
        p.map(segment => {
            if(segment != '') path.push(segment);
        });
        path.pop();
        this.baseUrl = '/' + path.join('/') + '/';
    }

    componentWillMount(){
        const { vacancyId } = this.props.match.params;
        if(vacancyId)
            this.props.fetchVacancy(vacancyId);
    }

    componentWillReceiveProps(newProps){
        const { match } = this.props;

        if(newProps.match.params.vacancyId != match.params.vacancyId) {
            this.props.fetchVacancy(newProps.match.params.vacancyId);
            this.setState({
                isActiveResume: false,
                editTitleBox: false,
                editAboutBox: false,
                editSkillsBox: false,
                editLanguagesBox: false,
                editCoursesBox: false,
                editCertificatesBox: false,
                editConditionsBox: false
            });

            // let { breadcrumbs } = newProps;
            // if (breadcrumbs.length > 1) breadcrumbs.pop();
            // this.props.updateBreadcrumbs([
            //   ...breadcrumbs,
            //   {
            //     link: newProps.match.url,
            //     label: this.props.vacancy && this.props.vacancy.header ? this.props.vacancy.header : 'Деталі вакансії'
            //   },
            // ]);
        }
        let mustSkills = [];
        let otherSkills = [];
        if(newProps.vacancy && newProps.vacancy.skills) {
            newProps.vacancy.skills.map(skill => {
                if(skill.is_must) {
                    mustSkills.push(skill);
                } else {
                    otherSkills.push(skill);
                }
            });
            this.setState({mustSkills, otherSkills});
        }
    }

    _getTagsFromList(input) {
        let output = [];
        if(!input) return output;
        input.map(val => {output.push(val.name)});
        return output;
    }

    _getLanguageTags(input) {
        let output = [];
        if(!input) return output;
        input.map(val => {
            output.push(val.language_name.toLowerCase() + ' : ' + val.skill);
        });
        return output;
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

    _handleFormSubmit(form, data) {
        if(!form) return;
        let submitFunc;
        switch(form){
            case "activity":
                submitFunc = this.props.updateVacancyActivity;
                break;

            case "titleBox":
                submitFunc = this.props.updateVacancyTitleBox;
                break;

            case "logo":
                submitFunc = this.props.updateVacancyLogo;
                break;

            case "about":
                submitFunc = this.props.updateVacancyAbout;
                break;

            case "languages":
                data.map(l => {
                   l.is_must = true;
                });
                submitFunc = this.props.updateVacancyLanguages;
                break;

            case "skills":
                submitFunc = this.props.updateVacancySkills;
                break;

            case "courses":
                submitFunc = this.props.updateVacancyCourses;
                data.map(c => {
                    c.name = c.name || c.course;
                    c.is_must = true;
                });
                break;

            case "certificates":
                submitFunc = this.props.updateVacancyCertificates;
                data.map(c => {
                    c.name = c.name || c.certificate;
                    c.is_must = true;
                });
                break;

            case "conditions":
                submitFunc = this.props.updateVacancyConditions;
                break;
        }

        submitFunc(this.props.vacancy.id, data)
            .then(response => {
                if(response.error){
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: true,
                        text: gettext('Не оновлено. Перевiрте введенi данi.')
                    });
                } else {
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Данi оновлено.'),
                    });
                    switch (form) {
                        case 'titleBox':
                            this.setState({editTitleBox: false});
                            break;

                        case 'about':
                            this.setState({editAboutBox: false});
                            break;

                        case 'languages':
                            this.setState({editLanguagesBox: false});
                            break;

                        case 'skills':
                            this.setState({editSkillsBox: false});
                            break;

                        case 'courses':
                            this.setState({editCoursesBox: false});
                            break;

                        case 'certificates':
                            this.setState({editCertificatesBox: false});
                            break;

                        case 'conditions':
                            this.setState({editConditionsBox: false});
                            break;
                    }
                }
                setTimeout(() => {
                    this.props.dispatchServiceMessage({show: false});
                }, 3000);
            })
    }

    _deleteVacancy(){
        this.props.deleteVacancy(this.props.vacancy.id)
            .then(response => {
                if(!response.error){
                    this.props.history.push(this.baseUrl);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Вакансію видалено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
                }
            });
    }

    _copyVacancy(){
        this.props.copyVacancy(this.props.vacancy.id)
            .then(response => {
                if(!response.error){
                    this.props.history.push(`${this.baseUrl}${response.payload.data.id}`);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Копiю створено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
                }
            })
    }


    render() {
        const { match, vacancy } = this.props;
        const { errors } = this.state;

        return (
            <div>
                <div className={s.topBoxResume + ' ' + (vacancy.is_active ? s.topBoxResume_active : '')}>
                    <div className={s.topBoxResume__header}>
                        <p>Код ваканії:&nbsp;&nbsp;<span className={s.value}>{vacancy.id_code}</span></p>
                        <p>Створено:&nbsp;&nbsp;
                            <span className={s.value}>
                                {moment(vacancy.date_created).format("DD.MM.YYYY")}
                            </span>
                        </p>
                        <Switch
                            label="Активно для пошуку"
                            className={ s.resumeActivitySwitcher }
                            handleChange={is_active => { if(is_active != vacancy.is_active) this._handleFormSubmit('activity', {is_active})}}
                            value={vacancy.is_active}
                        />
                        {
                            this.props.vacancyErrors.error_msg &&
                            <ul className="errorList">
                                <li>{this.props.vacancyErrors.error_msg}</li>
                            </ul>
                        }
                    </div>

                    {!this.state.editTitleBox &&
                    <div>
                        <div className={s.topBoxResume__content}>
                            <div className={s.topBoxResume__leftPart}>
                                <Avatar
                                    size="large"
                                    src={vacancy.logo_company}
                                />
                            </div>
                            <div className={s.topBoxResume__rightPart}>
                                <div className={s.topBoxResume__titlePart}>
                                    <h2>{vacancy.header}</h2>
                                    <p>
                                        {vacancy.address}
                                    </p>
                                    <h3>{vacancy.name_company}</h3>
                                    <Tags
                                        tags={this._getTagsFromList(vacancy.scope_activity)}
                                    />
                                </div>
                                {vacancy.salary &&
                                <div className={s.topBoxResume__sidePart}>
                                    <h3>
                                        { vacancy.salary }
                                        <span className={s.small}> {vacancy.currency && vacancy.currency.toUpperCase()}</span>
                                    </h3>
                                </div>
                                }
                            </div>
                        </div>
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.editTitleBoxButton}
                            handleClick={e => this.setState({editTitleBox: true})}
                        />
                    </div>
                    }

                    {this.state.editTitleBox &&
                    <div className={s.topBoxResume__content}>
                        <EditTitleBox
                            handleClose={e => {this.setState({editTitleBox: false})}}
                            data={vacancy}
                            errors={this.props.vacancyErrors}
                            handleSubmit={this._handleFormSubmit}
                            fetchScopeActivityOptions={this.props.fetchScopeActivity}
                        />
                    </div>
                    }
                </div>

                <Collapsible
                    trigger={
                        <CollapseSection
                            label='Про вакансію'
                        />
                    }
                    transitionTime={200}
                    open={true}
                >
                    {!this.state.editAboutBox &&
                    <div className={s.mainBoxResume}>
                        <ul className='listTable'>
                            <li>
                                <label>Опис вакансії:</label>
                                <div className='listTable__value'>
                                    {vacancy.about}
                                </div>
                            </li>
                            <li>
                                <label>Обов'язки:</label>
                                <div className='listTable__value'>
                                    {vacancy.description}
                                </div>
                            </li>
                            <li>
                                <label>Про компанію:</label>
                                <div className='listTable__value'>
                                    {vacancy.about_company}
                                </div>
                            </li>
                        </ul>
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.resumeSectionEditButton}
                            handleClick={e => {this.setState({editAboutBox: true})}}
                        />
                    </div>
                    }
                    {
                        this.state.editAboutBox &&
                        <div className={s.mainBoxResume}>
                            <VacancyEditAboutForm
                                data={vacancy}
                                handleClose={e => this.setState({editAboutBox: false})}
                                errors={this.props.vacancyErrors}
                                handleSubmit={this._handleFormSubmit}
                            />
                        </div>
                    }
                </Collapsible>

                <Collapsible
                    trigger={
                        <CollapseSection
                            label='Компетенції'
                        />
                    }
                    transitionTime={200}
                    open={true}
                >
                    {!this.state.editSkillsBox &&
                    <div className={s.mainBoxResume}>
                        <ul className='listTable'>
                            <li>
                                <label>Освіта:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(vacancy.education_levels)}
                                    />
                                </div>
                            </li>
                            <li>
                                <label>Досвід:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(vacancy.experience_specialty)}
                                    />
                                </div>
                            </li>
                            <li>
                                <label>Ключові компетенціі:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(this.state.mustSkills)}
                                    />
                                </div>
                            </li>
                            <li>
                                <label>Бажані компетенціі:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(this.state.otherSkills)}
                                    />
                                </div>
                            </li>
                        </ul>
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.resumeSectionEditButton}
                            handleClick={e => {this.setState({editSkillsBox: true})}}
                        />
                    </div>
                    }
                    {
                        this.state.editSkillsBox &&
                        <div className={s.mainBoxResume}>
                            <VacancyEditSkillsForm
                                data={ vacancy }
                                fetchEducationLevelsOptions={this.props.fetchEducationLevels}
                                fetchExperienceSpecialtyOptions={this.props.fetchExperienceSpecialty }
                                handleCancel={e => {this.setState({editSkillsBox: false})}}
                                handleSubmit={this._handleFormSubmit}
                                errors={this.props.vacancyErrors}
                                fetchSkillsOptions={this.props.fetchSkills}
                            />
                        </div>
                    }
                </Collapsible>


                <Collapsible
                    trigger={
                        <CollapseSection
                            label='Умови'
                        />
                    }
                    transitionTime={200}
                    open={true}
                >
                    {!this.state.editConditionsBox &&
                    <div className={s.mainBoxResume}>
                        <ul className='listTable'>
                            <li>
                                <label>Вид зайнятостi:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(vacancy.employment_type)}
                                    />
                                </div>
                            </li>
                            <li>
                                <label>Графiк:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(vacancy.time_schedules)}
                                    />
                                </div>
                            </li>
                            <li>
                                <label>Умови:</label>
                                <div className='listTable__value'>
                                    {vacancy.working_conditions}
                                </div>
                            </li>
                            <li>
                                <label>Переваги:</label>
                                <div className='listTable__value'>
                                    <Tags
                                        tags={this._getTagsFromList(vacancy.advantages)}
                                    />
                                </div>
                            </li>
                        </ul>
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.resumeSectionEditButton}
                            handleClick={e => {this.setState({editConditionsBox: true})}}
                        />
                    </div>
                    }
                    {
                        this.state.editConditionsBox &&
                        <div className={s.mainBoxResume}>
                            <VacancyEditConditionsForm
                                data={ vacancy }
                                handleCancel={e => {this.setState({editConditionsBox: false})}}
                                handleSubmit={this._handleFormSubmit}
                                errors={this.props.vacancyErrors}
                                fetchEmploymentTypeOptions={this.props.fetchEmploymentTypes}
                                fetchTimeScheduleOptions={this.props.fetchTimeSchedules}
                                fetchAdvantageOptions={this.props.fetchAdvantages}
                            />
                        </div>
                    }
                </Collapsible>


                <Collapsible
                    trigger={
                        <CollapseSection
                            label='Володiння мовами'
                        />
                    }
                    transitionTime={200}
                    open={vacancy.language_skills && vacancy.language_skills.length > 0}
                >
                    {!this.state.editLanguagesBox &&
                    <div className={s.mainBoxResume}>
                        <ul className='listTable'>
                            <li>
                                <label>Мови:</label>
                                <div className='listTable__value'>
                                    <Tags tags={this._getLanguageTags(vacancy.language_skills)}/>
                                </div>
                            </li>
                        </ul>
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.resumeSectionEditButton}
                            handleClick={e => {this.setState({editLanguagesBox: true})}}
                        />
                    </div>
                    }
                    {
                        this.state.editLanguagesBox &&
                        <div className={s.mainBoxResume}>
                            <LanguagesForm
                                user={{language_skills: vacancy.language_skills}}
                                handleCancel={e => {this.setState({editLanguagesBox: false})}}
                                languageOptions={this.props.languages}
                                languageSkillOptions={this.props.languageSkills}
                                fetchLanguages={this.props.fetchLanguages}
                                fetchLanguageSkills={this.props.fetchLanguageSkills}
                                handleSubmit={this._handleFormSubmit}
                                errors={this.props.vacancyErrors}
                            />
                        </div>
                    }
                </Collapsible>


                <Collapsible
                    trigger={
                        <CollapseSection
                            label='Курси'
                        />
                    }
                    transitionTime={200}
                    open={vacancy.courses && vacancy.courses.length > 0}
                >
                    {!this.state.editCoursesBox &&
                    <div className={s.mainBoxResume}>
                        {
                            vacancy.courses && vacancy.courses.map((item, i) => {
                                return (
                                    <div key={'courses-' + i} className={s.listBlock}>
                                        <h2>{ item.name }</h2>
                                    </div>
                                )
                            })
                        }
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.resumeSectionEditButton}
                            handleClick={e => {this.setState({editCoursesBox: true})}}
                        />
                    </div>
                    }
                    {
                        this.state.editCoursesBox &&
                        <div className={s.mainBoxResume}>
                            <CoursesForm
                                user={{ education_courses: vacancy.courses }}
                                handleSubmit={this._handleFormSubmit}
                                hideDate
                                errors={this.props.vacancyErrors}
                                handleCancel={e => { this.setState({editCoursesBox: false}) }}
                            />
                        </div>
                    }
                </Collapsible>


                <Collapsible
                    trigger={
                        <CollapseSection
                            label='Сертифiкати'
                        />
                    }
                    transitionTime={200}
                    open={vacancy.certificates && vacancy.certificates.length > 0}
                >
                    {!this.state.editCertificatesBox &&
                    <div className={s.mainBoxResume}>
                        {
                            vacancy.certificates && vacancy.certificates.map((item, i) => {
                                return (
                                    <div key={'certificate-' + i} className={s.listBlock}>
                                        <h2>{ item.name }</h2>
                                    </div>
                                )
                            })
                        }
                        <Button
                            icon="icon-pencil"
                            className={'default_button_outline ' + s.resumeSectionEditButton}
                            handleClick={e => {this.setState({editCertificatesBox: true})}}
                        />
                    </div>
                    }
                    {
                        this.state.editCertificatesBox &&
                        <div className={s.mainBoxResume}>
                            <CertificatesForm
                                user={{ education_certificates: vacancy.certificates }}
                                handleSubmit={this._handleFormSubmit.bind(this)}
                                handleCancel={e => { this.setState({editCertificatesBox: false}) }}
                                errors={this.props.vacancyErrors}
                                hideDates
                            />
                        </div>
                    }
                </Collapsible>


                <div className={s.resumeFooter}>
                    <ButtonWithConfirmation
                        label='Видалити'
                        buttonClassName='default_button_outline'
                        handleClick={this._deleteVacancy.bind(this)}
                    />
                    <Button
                        label='Створити копiю'
                        className='default_button_outline'
                        handleClick={this._copyVacancy.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchServiceMessage,
        fetchVacancy,
        deleteVacancy,
        copyVacancy,
        updateVacancyActivity,
        fetchPositions,
        fetchExperienceSpecialty,
        fetchSkills,
        fetchCities,
        fetchEmploymentTypes,
        fetchLanguageSkills,
        fetchLanguages,
        fetchEducationLevels,
        fetchInstitutions,
        fetchScopeActivity,
        updateVacancyTitleBox,
        updateVacancyLogo,
        updateVacancyLanguages,
        updateVacancyAbout,
        updateVacancySkills,
        updateVacancyCourses,
        updateVacancyCertificates,
        updateVacancyConditions,
        fetchTimeSchedules,
        fetchAdvantages,
        updateBreadcrumbs
    }, dispatch);
}

function mapStateTopProps(state) {
    return {
        vacancy: state.vacancy,
        languages: state.languages,
        languageSkills: state.languageSkills,
        vacancyErrors: state.vacancyErrors,
        breadcrumbs: state.breadcrumbs
    };
}

export default connect(mapStateTopProps, mapDispatchToProps)(VacancyContent);
