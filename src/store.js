import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import immutable from "immutable";

import conf from "./reducers/conf";

const InitialState = immutable.fromJS({});

export function initStore() {
  const reducer = combineReducers({
    conf,
  });

  const middleware = [thunk];
  const windowIfDefined = typeof window === "undefined" ? null : window;
  const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(reducer, {}, composeEnhancers(applyMiddleware(...middleware)));

  return store;
}
