import { combineReducers } from "redux";
import UserReducer from './reducerUser';
import ProfileErrorsReducer from './reducerProfileErrors';
import LanguagesReducer from './reducerLanguages';
import LanguageSkillsReducer from './reducerLanguageSkills';
import PositionsReducer from './reducerPositions';
import LevelInstitutionsReducer from './reducerLevelInstitutions';
import InstitutionsReducer from './reducerInstitutions';
import ServiceMessageReducer from './reducerServiceMessage';

import EmployerReducer from './reducerEmployer';
import EmployerErrorsReducer from './reducerEmployerErrors';

import MyCVsReducer from './reducerMyCVs';
import CVReducer from './reducerCV';
import CVErrorsReducer from './reducerCVErrors';

import VacanciesReducer from './reducerVacancies';
import VacancyReducer from './reducerVacancy';
import VacancyErrorsReducer from './reducerVacancyErrors';

import SearchReducer from './reducerSearch';
import SearchVacancyReducer from './reducerSearchVacancy';
import SearchCVReducer from './reducerSearchCV';

import BreadcrumbsReducer from './reducerBreadcrumbs';

import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  router: routerReducer,
  user: UserReducer,
  profileErrors: ProfileErrorsReducer,
  languages: LanguagesReducer,
  languageSkills: LanguageSkillsReducer,
  positions: PositionsReducer,
  levelInstitutions: LevelInstitutionsReducer,
  institutions: InstitutionsReducer,
  serviceMessage: ServiceMessageReducer,
  employer: EmployerReducer,
  employerErrors: EmployerErrorsReducer,
  myCVs: MyCVsReducer,
  cv: CVReducer,
  cvErrors: CVErrorsReducer,
  vacancies: VacanciesReducer,
  vacancy: VacancyReducer,
  vacancyErrors: VacancyErrorsReducer,
  dataSearch: SearchReducer,
  vacancySearch: SearchVacancyReducer,
  cvSearch: SearchCVReducer,
  breadcrumbs: BreadcrumbsReducer
});

export default rootReducer;
