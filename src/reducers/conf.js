import immutable from "immutable";
import { ACTION_LOGOUT } from "./auth";

const InitialState = immutable.fromJS({
  chat: false,
  about: undefined,
  conductCode: undefined,
  events: {},
  rooms: {},
  sections: {},
  speakers: {},
  tracks: {},
  faq: [],
  volunteers: [],
  users: {},

  loading: false,
  savedEvents: {},
  errorSavedEvents: undefined,

  searchText: "",
});

const ACTION_REQUESTED_DATA = "ACTION_REQUESTED_DATA";
const ACTION_RECEIVED_DATA_ABOUT = "ACTION_RECEIVED_DATA_ABOUT";
const ACTION_RECEIVED_DATA_CONDUCTCODE = "ACTION_RECEIVED_DATA_CONDUCTCODE";
const ACTION_RECEIVED_DATA_CONFDATA = "ACTION_RECEIVED_DATA_CONFDATA";
const ACTION_RECEIVED_DATA_FAQ = "ACTION_RECEIVED_DATA_FAQ";
const ACTION_RECEIVED_DATA_VOLUNTEERS = "ACTION_RECEIVED_DATA_VOLUNTEERS";

const ACTION_RECEIVED_USER_DATA = "ACTION_RECEIVED_USER_DATA";

const ACTION_RECEIVED_CACHED_DATA = "ACTION_RECEIVED_CACHED_DATA";

const ACTION_RECEIVED_SAVED_EVENTS = "ACTION_RECEIVED_SAVED_EVENTS";
const ACTION_ERROR_SAVED_EVENTS = "ACTION_ERROR_SAVED_EVENTS";

const ACTION_RATE_SESSION = "ACTION_RATE_SESSION";

export function receivedSavedEvents(events) {
  return {
    type: ACTION_RECEIVED_SAVED_EVENTS,
    events: events,
  };
}

export function errorReceivingSavedEvents(error) {
  return {
    type: ACTION_ERROR_SAVED_EVENTS,
    error: error,
  };
}

export function requestData() {
  return {
    type: ACTION_REQUESTED_DATA,
  };
}

export function receivedAboutData(about) {
  return {
    type: ACTION_RECEIVED_DATA_ABOUT,
    value: about,
  };
}
export function receivedConductCodeData(conductCode) {
  return {
    type: ACTION_RECEIVED_DATA_CONDUCTCODE,
    value: conductCode,
  };
}
export function receivedConferenceData(conferenceData) {
  return {
    type: ACTION_RECEIVED_DATA_CONFDATA,
    value: {
      events: conferenceData.events,
      rooms: conferenceData.rooms,
      sections: conferenceData.sections,
      speakers: conferenceData.speakers,
      tracks: conferenceData.tracks,
    },
  };
}
export function receivedFaqData(faq) {
  return {
    type: ACTION_RECEIVED_DATA_FAQ,
    value: faq,
  };
}
export function receivedVolunteersData(volunteers) {
  return {
    type: ACTION_RECEIVED_DATA_VOLUNTEERS,
    value: volunteers,
  };
}

export function receivedUserData(userId, data) {
  return {
    type: ACTION_RECEIVED_USER_DATA,
    userId,
    data,
  };
}
export function receivedCachedData(data) {
  return {
    type: ACTION_RECEIVED_CACHED_DATA,
    value: data,
  };
}

export function setFeedback(userId, sessionId, rating, feedback) {
  return {
    type: ACTION_RATE_SESSION,
    userId,
    sessionId,
    rating,
    feedback,
  };
}

const ACTION_SEARCH_CHANGED = "ACTION_SEARCH_CHANGED";
const ACTION_SEARCH_CANCELED = "ACTION_SEARCH_CANCELED";

export function searchChanged(text) {
  return {
    type: ACTION_SEARCH_CHANGED,
    text,
  };
}

export function searchCanceled() {
  return {
    type: ACTION_SEARCH_CANCELED,
  };
}

export default function reducer(state = InitialState, action) {
  switch (action.type) {
    case ACTION_REQUESTED_DATA:
      return state.set("loading", true);
    case ACTION_RECEIVED_DATA_ABOUT:
      return state.set("loading", false).set("about", immutable.fromJS(action.value));
    case ACTION_RECEIVED_DATA_CONDUCTCODE:
      return state.set("loading", false).set("conductCode", immutable.fromJS(action.value));
    case ACTION_RECEIVED_DATA_CONFDATA:
      return state
        .set("loading", false)
        .set("events", immutable.fromJS(action.value.events))
        .set("rooms", immutable.fromJS(action.value.rooms))
        .set("sections", immutable.fromJS(action.value.sections))
        .set("speakers", immutable.fromJS(action.value.speakers))
        .set("tracks", immutable.fromJS(action.value.tracks));
    case ACTION_RECEIVED_DATA_FAQ:
      return state.set("loading", false).set("faq", immutable.fromJS(action.value));
    case ACTION_RECEIVED_DATA_VOLUNTEERS:
      return state.set("loading", false).set("volunteers", immutable.fromJS(action.value));

    case ACTION_RECEIVED_USER_DATA:
      return state.setIn(["users", action.userId], immutable.fromJS(action.data));

    case ACTION_RECEIVED_CACHED_DATA:
      return state.mergeDeep(action.value);

    case ACTION_RECEIVED_SAVED_EVENTS:
      return state.set("savedEvents", immutable.fromJS(action.events));
    case ACTION_ERROR_SAVED_EVENTS:
      return state.set("errorSavedEvents", action.error);

    case ACTION_RATE_SESSION:
      return state.setIn(
        ["users", action.userId, "sessionFeedback", action.sessionId],
        immutable.fromJS({
          rating: action.rating,
          feedback: action.feedback,
        })
      );

    case ACTION_SEARCH_CHANGED:
      return state.set("searchText", action.text);
    case ACTION_SEARCH_CANCELED:
      return state.set("searchText", "");

    case ACTION_LOGOUT:
      return;
  }
  return state.set("users", InitialState.get("users"));
}
