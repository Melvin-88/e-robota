import * as types from "../actions/actionTypes_employer";

export default function(state={}, action) {
    switch(action.type) {
        case types.UPDATE_COMPANY_INFO_FAIL:
        case types.UPDATE_COMPANY_LOGO_FAIL:
        case types.UPDATE_COMPANY_HEADOFFICE_FAIL:
        case types.UPDATE_COMPANY_BRANCHES_FAIL:
            return action.error.response.data;

        case types.UPDATE_COMPANY_INFO_SUCCESS:
        case types.UPDATE_COMPANY_LOGO_SUCCESS:
        case types.UPDATE_COMPANY_HEADOFFICE_SUCCESS:
        case types.UPDATE_COMPANY_BRANCHES_SUCCESS:
            return {};
    }
    return state;
}
