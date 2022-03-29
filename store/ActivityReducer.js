import { combineReducers } from 'redux';

import { session } from "../utils/session";

const INITIAL_STATE = {
  profil: {
    solde: 0.00000567001
  },
  etat: {},
  posts: []
};

function monReducer (state = INITIAL_STATE, action) {
  let nextState
  switch(action.type) {

    case 'STATE':

      state.etat[action.payload.index] = action.payload.value;

      nextState = {
          ...state,
          myState: state.etat
      }
      return nextState;

      case 'GETPOSTS':

      state.posts = action.payload;

      nextState = {
          ...state,
          myState: state.posts
      }
      return nextState

    //...
    default:
      return state
  }
}

export default combineReducers({
  data: monReducer
});
