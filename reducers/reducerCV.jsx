import * as types from '../actions/actionsTypes_cv';

export default function(state={}, action) {
    switch(action.type) {
        case types.FETCH_CV_SUCCESS:
        case types.UPDATE_CV_TITLEBOX_SUCCESS:
        case types.UPDATE_SUMMARYBOX_SUCCESS:
        case types.UPDATE_CV_LANGUAGES_SUCCESS:
        case types.UPDATE_CV_EXPERIENCE_SUCCESS:
        case types.UPDATE_CV_EDUCATION_SUCCESS:
        case types.UPDATE_CV_COURSES_SUCCESS:
        case types.CREATE_CV_SUCCESS:
        case types.COPY_CV_SUCCESS:
            return action.payload.data;

        case types.UPDATE_CV_PHOTO_SUCCESS:
            return {...state, jobseeker_photo: action.payload.data.jobseeker_photo};

        case types.UPDATE_CV_ACTIVITY_SUCCESS:
            return {...state, is_active: action.payload.data.is_active};
    }
    return state;
}