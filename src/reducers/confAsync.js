import { AsyncStorage } from "react-native";
import firebase from "react-native-firebase";

import { receivedSavedEvents, errorReceivingSavedEvents, setFeedback } from "./conf";

export const ASYNCSTORAGE_SAVED_EVENTS = "ASYNCSTORAGE_SAVED_EVENTS_2019";

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

    const user = getState().auth.get("user");
    if (!user || !user.get("uid")) {
      return;
    }
    const userId = user.get("uid");

    const savedSessionsRef = firebase.database().ref(`users/${userId}/savedSessionIds`);
    return savedSessionsRef.child(id).set(id);
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

    const user = getState().auth.get("user");
    if (!user || !user.get("uid")) {
      return;
    }
    const userId = user.get("uid");

    const savedSessionsRef = firebase.database().ref(`users/${userId}/savedSessionIds`);
    return savedSessionsRef.child(id).remove();
  };
}

export function rateSession(sessionId, rating, feedbackText) {
  return (dispatch, getState) => {
    const user = getState().auth.get("user");
    if (!user || !user.get("uid")) {
      return;
    }
    const userId = user.get("uid");

    dispatch(setFeedback(userId, sessionId, rating, feedbackText));

    const sessionFeedbackRef = firebase.database().ref(`users/${userId}/sessionFeedback/${sessionId}`);
    const feedbackObject = {
      feedback: feedbackText,
      rating,
    };

    return sessionFeedbackRef.update(feedbackObject);
  };
}
