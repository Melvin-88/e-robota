import * as types from '../actions/actionsTypes_search';

export default function(state=[], action){
  switch(action.type){
    case types.GET_VACANCY_SUCCESS:
      return action.payload.data;
  }
  return state;
}
