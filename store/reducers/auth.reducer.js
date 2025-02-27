import * as actions from "store/actions/auth.actions";
import { REHYDRATE } from "redux-persist/lib/constants";
import { REINITIALIZE_REDUX } from "store/rootActions";

// default to isAutoLogin=true (https://github.com/DiscipleTools/disciple-tools-mobile-app/issues/632)
const initialState = {
  rehydrate: false,
  isAutoLogin: true,
  rememberLoginDetails: null,
  cnonceLogin: null,
  hasPIN: null,
  cnoncePIN: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        rehydrate: true,
      };
    case REINITIALIZE_REDUX:
      return initialState;
    case actions.AUTH_TOGGLE_AUTO_LOGIN:
      return {
        ...state,
        isAutoLogin: !state.isAutoLogin,
        rehydrate: false,
      };
    case actions.AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS:
      return {
        ...state,
        rememberLoginDetails: !state.rememberLoginDetails,
        rehydrate: false,
      };
    case actions.AUTH_SET_CNONCE_LOGIN:
      return {
        ...state,
        cnonceLogin: action?.cnonceLogin,
        rehydrate: false,
      };
    case actions.AUTH_SET_HAS_PIN:
      return {
        ...state,
        hasPIN: action?.hasPIN,
        rehydrate: false,
      };
    case actions.AUTH_SET_CNONCE_PIN:
      return {
        ...state,
        cnoncePIN: action?.cnoncePIN,
        rehydrate: false,
      };
    default:
      return {
        ...state,
        rehydrate: false,
      };
  }
}
