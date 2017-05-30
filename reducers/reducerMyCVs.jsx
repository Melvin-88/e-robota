import * as types from '../actions/actionsTypes_cv';

export default function(state=[], action) {
    switch(action.type) {
        case types.FETCH_MY_CVS_SUCCESS:
            return action.payload.data;
        case types.UPDATE_CV_ACTIVITY_SUCCESS:
        case types.UPDATE_CV_TITLEBOX_SUCCESS:
            let cvs = [];
            state.map(cv => {
                if(cv.id == action.payload.data.id){
                    cvs.push(action.payload.data);
                } else {
                    cvs.push(cv);
                }
            });
            return cvs;
        case types.CREATE_CV_SUCCESS:
        case types.COPY_CV_SUCCESS:
            return [...state, action.payload.data];

        case types.DELETE_CV_SUCCESS:
            let deletedPath = action.payload.config.url.split('/');
            const deletedId = deletedPath.splice(-2,1)[0];
            let updCvs = [];
            state.map(cv => {
                if(cv.id != deletedId)
                    updCvs.push(cv);
            });
            return updCvs;
    }
    return state;
}