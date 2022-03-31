import { combineReducers } from 'redux';

import { session } from "../utils/session";

const INITIAL_STATE = {
  user: {
    id: "",
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

    case 'USER':

      state.user[action.index] = action.value;

      //session(state.user);

      nextState = {
          ...state,
          user: state.user
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
