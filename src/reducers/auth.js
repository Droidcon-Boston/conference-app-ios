import immutable from "immutable";

const InitialState = immutable.fromJS({
  user: undefined,

  loading: false,
  error: undefined,
});

const ACTION_LOGIN_INIT_REQUESTED = "ACTION_LOGIN_INIT_REQUESTED";
const ACTION_LOGIN_INIT_AUTHENTICATED = "ACTION_LOGIN_INIT_AUTHENTICATED";
const ACTION_LOGIN_INIT_NO_USER = "ACTION_LOGIN_INIT_NO_USER";
const ACTION_LOGIN_INIT_ERROR = "ACTION_LOGIN_INIT_ERROR";
export function loginInitRequested() {
  return { type: ACTION_LOGIN_INIT_REQUESTED };
}
export function loginInitAuthenticated(user) {
  return { type: ACTION_LOGIN_INIT_AUTHENTICATED, user };
}
export function loginInitNoUser() {
  return { type: ACTION_LOGIN_INIT_NO_USER };
}
export function loginInitError(error) {
  return { type: ACTION_LOGIN_INIT_ERROR, error };
}

const ACTION_LOGIN_REQUESTED = "ACTION_LOGIN_REQUESTED";
const ACTION_LOGIN_SUCCEEDED = "ACTION_LOGIN_SUCCEEDED";
const ACITON_LOGIN_FAILED = "ACITON_LOGIN_FAILED";

export function loginRequested() {
  return {
    type: ACTION_LOGIN_REQUESTED,
  };
}
export function loginSucceeded(user) {
  return {
    type: ACTION_LOGIN_SUCCEEDED,
    user,
  };
}
export function loginFailed(error) {
  return {
    type: ACITON_LOGIN_FAILED,
    error,
  };
}

export default function reducer(state = InitialState, action) {
  switch (action.type) {
    case ACTION_LOGIN_INIT_REQUESTED:
      return state.set("loading", true).set("error", undefined);

    case ACTION_LOGIN_INIT_AUTHENTICATED:
      return state
        .set("loading", false)
        .set("error", undefined)
        .mergeDeep(immutable.fromJS({ user: action.user }));

    case ACTION_LOGIN_INIT_NO_USER:
      return state.set("loading", false).set("error", undefined);
    case ACTION_LOGIN_INIT_ERROR:
      return state.set("loading", false).set("error", action.error);

    case ACTION_LOGIN_REQUESTED:
      return state.set("loading", true).set("error", undefined);
    case ACTION_LOGIN_SUCCEEDED:
      return state
        .mergeDeep(immutable.fromJS({ user: action.user }))
        .set("loading", false)
        .set("error", undefined);
    case ACITON_LOGIN_FAILED:
      return state.set("error", action.error).set("loading", false);
  }
  return state;
}
