import React, { Component } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  searchCVs,
  searchVacancies,
} from '../../../actions/searchActions';

import SubNavigation from '../../dashboard/SubNavigation';
import SearchVacancy from '../SearchVacancy';
import VacancyDetail from '../VacancyDetail';
import CVDetail from '../CVDetail';
import SearchCV from '../SearchCV';
import Button from '../../forms/Button';
import Checkbox from '../../forms/Checkbox';
import NavPanel from '../../dashboard/NavPanel';
import HeaderPanel from '../../dashboard/HeaderPanel';
import Collapsible from 'react-collapsible';
import Slider, { Range } from 'rc-slider';
import Select from '../../forms/Select';

import s from './Search.css';
import 'rc-slider/assets/index.css';


class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kind: '',
      preloader: false,
      searchResults: [],
      showDetail: false,
      idCode: null,
      queryString: ''
    };

    this.filters = {
      experience_specialty: new Set(),
      employment_type: new Set(),
      time_schedules: new Set(),
      scope_activity: new Set(),
    };
    this.salaryMin = null;
    this.salaryMax = null;
    this.sort = '';
  }

  componentWillMount(){
    let search = this.props.location.search;
    let kind;

    if (search) {
      kind = this._getParameterByName('kind', search);
      this.setState({kind: kind, queryString: search});
    } else {
      let kind = this.props.location.pathname.split('/')[2];
      if (kind == 'vacancy' || kind == 'cv' ) {
        this.setState({
          showDetail: true,
          kind: kind
        });
      }
    }
    this._search(search, kind);

  }

  componentWillReceiveProps(newProps){
    if (newProps.dataSearch.results) {
      if (this.state.preloader) {
        let newSearchResults = this.state.searchResults.concat(newProps.dataSearch.results.search_results);
        this.setState({searchResults: newSearchResults, preloader: false})
      } else {
        this.setState({searchResults: newProps.dataSearch.results.search_results})
      }

      let query = newProps.dataSearch.results.query;
      for (let nameQuery in query) {
        if (nameQuery != 'sort' && nameQuery != 'salary_min' && nameQuery != 'salary_max') {
          this.filters[nameQuery] = new Set(query[nameQuery])
        }
      }
      this.sort = newProps.dataSearch.results.query.sort || 'date_update';
      this.salaryMin = newProps.dataSearch.results.query.salary_min;
      this.salaryMax = newProps.dataSearch.results.query.salary_max;
    }
  }

  _getParameterByName(name, search) {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  _loadMore() {
    this.setState({preloader: true});
    let next = this.props.dataSearch.next.split('/?')[1];
    this._search('?' + next);
  }

  _search(query, kind) {
    if (this.state.kind == 'cv' || kind == 'cv') {
      this.props.searchCVs(query)
      .then(response => {
          //TODO preloader
      })
      .catch(error => {
          console.log(error);
      })
    } else if (this.state.kind == 'vacancy' || kind == 'vacancy'){
      this.props.searchVacancies(query)
      .then(response => {
          //TODO preloader
      })
      .catch(error => {
          console.log(error);
      })
    }
  }

  _buildFilters() {
    let query = '?';
    for (let nameFilter in this.filters) {
      for (let value of this.filters[nameFilter]) {
        query += nameFilter + '=' + value + '&'
      }
    }
    query += 'kind=' + this.state.kind + '&';

    if (this.salaryMin) {
      query += 'salary_min=' + this.salaryMin + '&';
    }

    if (this.salaryMax) {
      query += 'salary_max=' + this.salaryMax + '&';
    }

    query += 'sort=' + this.sort + '&';
    history.pushState(null, null, query);
    this.setState({ queryString: query});
    this._search(query)
  }

  toggleCheckbox = (name, label) => {
    if (this.filters[name].has(label)) {
      this.filters[name].delete(label);
    } else {
      this.filters[name].add(label);
    }
    this._buildFilters()
  };

  changeSalary = (value) => {
    this.salaryMin = value[0];
    this.salaryMax = value[1];
    this._buildFilters()
  };

  changeSort = (value) => {
    if (this.sort != value.value) {
      this.sort = value.value;
      this._buildFilters()
    }
  };

  selectDetail = () => {
    this.setState({showDetail: true});
  };

  selectList = (e) => {
    this.setState({showDetail: false});

    if (!this.state.queryString) {
      this._buildFilters();
    }
  };

  render(){
    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);
    const searchResults = this.state.searchResults;
    const kind = this.state.kind;
    const filters = (this.props.dataSearch &&
                     this.props.dataSearch.results &&
                     this.props.dataSearch.results.filters) || {};
    const marks = {};
    let salaryValue = [0, 0];
    if (filters.salary) {
      marks[filters.salary.min] = filters.salary.min;
      marks[filters.salary.max] = filters.salary.max;
      salaryValue = [filters.salary.min, filters.salary.max];
      if (this.salaryMin && this.salaryMax) {
        salaryValue = [parseInt(this.salaryMin), parseInt(this.salaryMax)]
      }
    }
    return (
      <div className="dashboard">
        <div className="dashboard__content">
          <div className="dashboardContentWrapper">
            <div className="dashboardContentWrapper__row">

              {/*LEFT SIDEBAR*/}
              {!this.state.showDetail &&
              <div className="dashboardSidePanel sidepanel">
                <SubNavigation>
                  {filters.salary &&
                  <Collapsible
                    trigger={
                      <li className="sidepanel__title subnavigation__item">
                        {gettext('Зарплата')}
                      </li>
                    }
                    triggerDisabled={true}
                    open={true}
                  >
                    <div className="dashboardContentWrapper__wrapper-range">
                      <Range
                        min={filters.salary.min}
                        max={filters.salary.max}
                        marks={marks}
                        allowCross={false}
                        defaultValue={salaryValue}
                        onAfterChange={this.changeSalary}
                      />
                    </div>
                  </Collapsible>
                  }

                  {filters.experience_specialty &&
                  <Collapsible
                    trigger={
                      <li className="sidepanel__title subnavigation__item">
                        {gettext('Досвід роботи')}
                      </li>
                    }
                    triggerDisabled={true}
                    open={true}
                  >
                    {
                      filters.experience_specialty.map((experience_specialty, i) => {
                        return (
                          <Checkbox
                            id={'experience-specialty-link-' + i}
                            key={'experience-specialty-link-' + i}
                            name="experience_specialty"
                            label={experience_specialty[0]}
                            info={experience_specialty[1]}
                            isChecked={this.filters.experience_specialty.has(experience_specialty[0])}
                            handleCheckboxChange={this.toggleCheckbox}
                          />
                        );
                      })
                    }

                  </Collapsible>
                  }

                  {filters.employment_type &&
                  <Collapsible
                    trigger={
                      <li className="sidepanel__title subnavigation__item">
                        {gettext('Тип зайнятості')}
                      </li>
                    }
                    triggerDisabled={true}
                    open={true}
                  >
                    {
                      filters.employment_type.map((employment_type, i) => {
                        return (
                          <Checkbox
                            id={'employment-type-link-' + i}
                            key={'employment-type-link-' + i}
                            name="employment_type"
                            label={employment_type[0]}
                            info={employment_type[1]}
                            isChecked={this.filters.employment_type.has(employment_type[0])}
                            handleCheckboxChange={this.toggleCheckbox}
                          />
                        );
                      })
                    }

                  </Collapsible>
                  }

                  {filters.time_schedules &&
                  <Collapsible
                    trigger={
                      <li className="sidepanel__title subnavigation__item">
                        {gettext('Графік роботи')}
                      </li>
                    }
                    triggerDisabled={true}
                    open={true}
                  >
                    {
                      filters.time_schedules.map((time_schedule, i) => {
                        return (
                          <Checkbox
                            id={'time-schedule-link-' + i}
                            key={'time-schedule-link-' + i}
                            name="time_schedules"
                            label={time_schedule[0]}
                            info={time_schedule[1]}
                            isChecked={this.filters.time_schedules.has(time_schedule[0])}
                            handleCheckboxChange={this.toggleCheckbox}
                          />
                        );
                      })
                    }

                  </Collapsible>
                  }

                  {filters.scope_activity &&
                  <Collapsible
                    trigger={
                      <li className="sidepanel__title subnavigation__item">
                        {gettext('Галузь компанії')}
                      </li>
                    }
                    triggerDisabled={true}
                    open={true}
                  >
                    {
                      filters.scope_activity.map((scope_activity, i) => {
                        return (
                          <Checkbox
                            id={'scope-activity-link-' + i}
                            key={'scope-activity-link-' + i}
                            name="scope_activity"
                            label={scope_activity[0]}
                            info={scope_activity[1]}
                            isChecked={this.filters.scope_activity.has(scope_activity[0])}
                            handleCheckboxChange={this.toggleCheckbox}
                          />
                        );
                      })
                    }

                  </Collapsible>
                  }

                </SubNavigation>
              </div>
              }

              {/*CENTRAL CONTENT*/}
              <div className={'dashboardContentWrapper__dashboardContent dashboardContentWrapper__dashboardContent_padding' + ' ' + (this.state.showDetail ? 'dashboardContentWrapper__dashboardContent_small' : '')}>
                <div className={s.dashboardContentWrapper__title_flex}>

                  {this.props.dataSearch.count != undefined &&
                  <p className={s.dashboardContentWrapper__title}>
                    {gettext('Результати пошуку :')}
                    <span>{this.props.dataSearch.count}</span>
                  </p>
                  }

                  {!this.state.showDetail &&
                  <div className={s.dashboardContentWrapper__sorting}>
                    <Select
                        label={gettext("Сортувати")}
                        className="halfrow"
                        value={this.sort}
                        handleChange={this.changeSort}
                        options={[
                          { value: 'date_update', label: gettext('Сортувати за датою публікації') },
                          { value: 'salary', label: gettext('Сортувати за заробітною платoю') }
                          ]}
                    />
                  </div>
                  }
                </div>
                {
                  searchResults && searchResults.map((result, i) => {
                    return (
                      <div key={'search-result-' + i}>
                      { kind == 'cv' && <SearchCV result={result} selectDetail={this.selectDetail} /> }
                      { kind == 'vacancy' && <SearchVacancy result={result} selectDetail={this.selectDetail} /> }
                      </div>
                    );
                  })
                }

                {
                  this.props.dataSearch.next &&
                  <Button
                    label={gettext('показати ще')}
                    handleClick={this._loadMore.bind(this)}
                  />
                }

              </div>
              <div className="dashboardContentWrapper__dashboardContent">
                {this.state.showDetail && this.state.kind == 'vacancy' &&
                  <div className="dashboardContentWrapper__title_flex-small">
                    <p className="dashboardContentWrapper__title">{gettext('Деталі вакансії')}</p>
                    <Link className = "details-back" to={`/search/${this.state.queryString || '?kind=vacancy'}`} onClick={this.selectList}>
                      {gettext('До списку вакансiй')}
                    </Link>
                  </div>
                }
                {this.state.showDetail && this.state.kind == 'cv' &&
                  <div className="dashboardContentWrapper__title_flex-small">
                    <p className="dashboardContentWrapper__title">{gettext('Деталі резюме')}</p>
                    <Link className = "details-back" to={`/search/${this.state.queryString || '?kind=cv'}`} onClick={this.selectList}>
                      {gettext('До списку резюме')}
                    </Link>
                  </div>
                }

                <Route exact path="/search/vacancy/:id" component={VacancyDetail}/>
                <Route exact path="/search/cv/:id" component={CVDetail}/>
              </div>
              {/*RIGHT SIDEPANEL*/}
              <div className="dashboardSidePanel sidepanel sidepanel_right">
                <SubNavigation>
                </SubNavigation>
              </div>

            </div>
          </div>
        </div>
        <HeaderPanel />
        <NavPanel />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    dataSearch: state.dataSearch,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    searchCVs,
    searchVacancies
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);