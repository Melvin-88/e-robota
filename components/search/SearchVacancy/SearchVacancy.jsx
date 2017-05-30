import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import s from './SearchVacancy.css';


export default class SearchVacancy extends Component {
  render() {
    const result = this.props.result;
    const handleClick = this.props.selectDetail;
    return (
      <div className={s.searchVacansy}>
        <div className={s.searchVacansy__card}>
          <div className='searchVacansy__card-top'>
            <h4 className='searchVacansy__card-title'>{result.header}</h4>
            <h4 className='searchVacansy__card-price'>{gettext('від')} {result.salary} {result.currency}</h4>
          </div>
          <div className='searchVacansy__card-middle'>
            <p className='searchVacansy__card-firm'>
              <span className={s.searchVacansy__card_check + ' i-figure icon-check'}></span>
              {result.name_company}
            </p>
            <ul className='searchVacansy__card-list'>
              <li><a className='searchVacansy__card-link searchVacansy__card-item' href='#'>1</a></li>
              <li><a className='searchVacansy__card-link i-figure icon-star' href='#'></a></li>
              <li><a className='searchVacansy__card-link i-figure icon-badge' href='#'></a></li>
              <li><a className='searchVacansy__card-link i-figure icon-user-following' href='#'></a></li>
              <li><a className='searchVacansy__card-link i-figure icon-fire' href='#'></a></li>
              <li><a className='searchVacansy__card-link i-figure icon-like' href='#'></a></li>
            </ul>
            <p className='searchVacansy__card-type'>
              {
                result.time_schedules.map((time_schedule, i) => {
                  return (
                    <span key={'time-schedule-' + i}> {time_schedule.name}{result.time_schedules.length > (i+1) && ','}</span>
                  );
                })
              }
            </p>
          </div>
          <div className='searchVacansy__card-bottom'>
            {/*<p className='searchVacansy__card-description'>Обов'язковi умови: Робота в складi бригади...</p>*/}
            <p className='searchVacansy__card-expirience'>
              {gettext('Досвiд роботи:')}
              {
                result.experience_specialty.map((experience_specialty, i) => {
                  return (
                    <span  key={'experience-specialty-' + i}> {experience_specialty.name}{result.experience_specialty.length > (i+1) && ','}</span>
                  );
                })
              }
            </p>
            <p className='searchVacansy__card-city'>{result.address}</p>
          </div>
          <div className='searchVacansy__card-hover'>
            <Link to={`/search/vacancy/${result.id_code}/`}
                  className='searchVacansy__card-details'
                  onClick={handleClick}>
              {gettext('Деталі вакансії')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}