import immutable from "immutable";

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
  users: false,

  savedEvents: {},
  errorSavedEvents: undefined,

  searchText: "",
});

const ACTION_RECEIVED_DATA = "ACTION_RECEIVED_DATA";
const ACTION_RECEIVED_SAVED_EVENTS = "ACTION_RECEIVED_SAVED_EVENTS";
const ACTION_ERROR_SAVED_EVENTS = "ACTION_ERROR_SAVED_EVENTS";

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

export function receivedData(data) {
  return {
    type: ACTION_RECEIVED_DATA,
    payload: {
      chat: data.chat,
      about: data.about,
      conductCode: data.conductCode,
      events: data.conferenceData.events,
      rooms: data.conferenceData.rooms,
      sections: data.conferenceData.sections,
      speakers: data.conferenceData.speakers,
      tracks: data.conferenceData.tracks,
      users: data.users,
      faq: data.faq,
      volunteers: data.volunteers,
    },
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
    case ACTION_RECEIVED_DATA:
      return state.mergeDeep(immutable.fromJS(action.payload));
    case ACTION_RECEIVED_SAVED_EVENTS:
      return state.set("savedEvents", immutable.fromJS(action.events));
    case ACTION_ERROR_SAVED_EVENTS:
      return state.set("errorSavedEvents", action.error);
    case ACTION_SEARCH_CHANGED:
      return state.set("searchText", action.text);
    case ACTION_SEARCH_CANCELED:
      return state.set("searchText", "");
  }
  return state;
}
