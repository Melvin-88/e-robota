import * as types from './actionsTypes_search';


export function searchCVs(query='') {
    return {
        type: types.SEARCH_CVS,
        payload: {
            request: {
                url: `api/search_cv/${query}`,
                method: 'get'
            }
        }
    };
}

export function searchVacancies(query='') {
    return {
        type: types.SEARCH_VACANCIES,
        payload: {
            request: {
                url: `api/search_vacancy/${query}`,
                method: 'get',
            }
        }
    };
}

export function getVacancy(id_code) {
    return {
        type: types.GET_VACANCY,
        payload: {
            request: {
                url: `api/vacancy/${id_code}/`,
                method: 'get',
            }
        }
    };
}

export function getCV(id_code) {
    return {
        type: types.GET_CV,
        payload: {
            request: {
                url: `api/cv/${id_code}/`,
                method: 'get',
            }
        }
    };
}
