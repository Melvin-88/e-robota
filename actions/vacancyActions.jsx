import * as types from './actionsTypes_vacancies';

export function fetchMyVacancies(){
    return {
        type: types.FETCH_MY_VACANCIES,
        payload: {
            request: {
                url: '/api/owner_vacancies/',
                method: 'get'
            }
        }
    }
}

export function fetchVacancy(id) {
    return {
        type: types.FETCH_VACANCY,
        payload: {
            request: {
                url: `/api/owner_vacancies/${id}/`,
                method: 'get'
            }
        }
    }
}

export function updateVacancyActivity(id, data) {
    return {
        type: types.UPDATE_VACANCY_ACTIVITY,
        payload: {
            request: {
                url: `/api/owner_vacancies/${id}/set_publish/`,
                method: 'post',
                data
            }
        }
    }
}

export function createVacancy() {
    return {
        type: types.CREATE_VACANCY,
        payload: {
            request: {
                url: `api/owner_vacancies/new_create/`,
                method: 'post',
            }
        }
    };
}

export function deleteVacancy(id) {
    return {
        type: types.DELETE_VACANCY,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/`,
                method: 'delete',
            }
        }
    };
}

export function copyVacancy(id) {
    return {
        type: types.COPY_VACANCY,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/copy/`,
                method: 'post',
            }
        }
    };
}

export function fetchScopeActivity(query='') {
    return {
        type: types.FETCH_SCOPE_ACTIVITY,
        payload: {
            request: {
                url: `/api/scope_activity_options/?name=${query}`,
                method: 'get'
            }
        }
    }
}

export function updateVacancyTitleBox(id, data) {
    return {
        type: types.UPDATE_VACANCY_TITLEBOX,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_info_title/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyLanguages(id, data) {
    return {
        type: types.UPDATE_VACANCY_LANGUAGES,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_vacancy_language_skills/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyAbout(id, data) {
    return {
        type: types.UPDATE_VACANCY_ABOUT,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_about/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyLogo(id, data) {
    return {
        type: types.UPDATE_VACANCY_LOGO,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_logo/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancySkills(id, data) {
    return {
        type: types.UPDATE_VACANCY_SKILLS,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_requirements_candidate/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyCourses(id, data) {
    return {
        type: types.UPDATE_VACANCY_COURSES,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_vacancy_courses/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyCertificates(id, data) {
    return {
        type: types.UPDATE_VACANCY_CERTIFICATES,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_vacancy_certificates/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateVacancyConditions(id, data) {
    return {
        type: types.UPDATE_VACANCY_CONDITIONS,
        payload: {
            request: {
                url: `api/owner_vacancies/${id}/set_working_conditions/`,
                method: 'post',
                data
            }
        }
    };
}

export function fetchTimeSchedules(query=''){
    return {
        type: types.FETCH_TIME_SCHEDULES,
        payload: {
            request: {
                url: `/api/time_schedule_options/`,
                method: 'get'
            }
        }
    };
}

export function fetchAdvantages(query='') {
    return {
        type: types.FETCH_VACANCY_ADVANTAGES,
        payload: {
            request: {
                url: `/api/advantage_options/?name=${query}`,
                method: 'get'
            }
        }
    };
}