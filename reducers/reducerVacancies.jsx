import * as types from '../actions/actionsTypes_vacancies';

export default function(state=[], action) {
    switch(action.type) {
        case types.FETCH_MY_VACANCIES_SUCCESS:
            return action.payload.data;

        case types.UPDATE_VACANCY_ACTIVITY_SUCCESS:
        case types.UPDATE_VACANCY_TITLEBOX_SUCCESS:
            let vacancies = [];
            state.map(vac => {
                if(vac.id == action.payload.data.id){
                    vacancies.push(action.payload.data);
                } else {
                    vacancies.push(vac);
                }
            });
            return vacancies;

        case types.CREATE_VACANCY_SUCCESS:
        case types.COPY_VACANCY_SUCCESS:
            return [...state, action.payload.data];

        case types.DELETE_VACANCY_SUCCESS:
            let deletedPath = action.payload.config.url.split('/');
            const deletedId = deletedPath.splice(-2,1)[0];
            let updVacancies = [];
            state.map(vac => {
                if(vac.id != deletedId)
                    updVacancies.push(vac);
            });
            return updVacancies;
    }
    return state;
}