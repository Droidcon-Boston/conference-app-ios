import { AsyncStorage } from "react-native";

import { receivedSavedEvents, errorReceivingSavedEvents } from "./conf";

const ASYNCSTORAGE_SAVED_EVENTS = "ASYNCSTORAGE_SAVED_EVENTS";

export function getSavedEvents() {
  return (dispatch, getState) => {
    AsyncStorage.getItem(ASYNCSTORAGE_SAVED_EVENTS, (err, result) => {
      if (err) {
        dispatch(errorReceivingSavedEvents(err));
      } else {
        let events = JSON.parse(result);
        if (!events || events.length === 0) {
          events = {};
        }
        dispatch(receivedSavedEvents(events));
      }
    });
  };
}

export function saveEvent(id) {
  return (dispatch, getState) => {
    let savedEvents = getState().conf.get("savedEvents");
    savedEvents = savedEvents.set(id, id);
    const events = savedEvents.toJS();
    AsyncStorage.setItem(ASYNCSTORAGE_SAVED_EVENTS, JSON.stringify(events), err => {
      if (err) {
        dispatch(errorReceivingSavedEvents(err));
      } else {
        dispatch(receivedSavedEvents(events));
      }
    });
  };
}

export function removeSavedEvent(id) {
  return (dispatch, getState) => {
    let savedEvents = getState().conf.get("savedEvents");
    savedEvents = savedEvents.delete(id);
    const events = savedEvents.toJS();
    AsyncStorage.setItem(ASYNCSTORAGE_SAVED_EVENTS, JSON.stringify(events), err => {
      if (err) {
        dispatch(errorReceivingSavedEvents(err));
      } else {
        dispatch(receivedSavedEvents(events));
      }
    });
  };
}
