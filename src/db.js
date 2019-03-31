import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";
import { ASYNCSTORAGE_SAVED_EVENTS } from "./reducers/confAsync";

import {
  receivedConferenceData,
  receivedAboutData,
  receivedConductCodeData,
  receivedFaqData,
  receivedVolunteersData,
  requestData,
  receivedUserData,
} from "./reducers/conf";
import { cacheData } from "./util/Cache";

export function getUserData(userId) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      console.log("getUserData: ", userId);
      firebase
        .database()
        .ref(`users/${userId}`)
        .once("value", snapshot => {
          const value = snapshot.val();

          // cache new savedSessionIds loclly if necessary
          // this should probably go inside some middleware instead of this file.
          if (value.savedSessionIds) {
            console.log(" valaue saved sessionids", value.savedSessionIds);
            let savedEvents = getState().conf.get("savedEvents");
            const events = savedEvents.toJS();
            console.log("events: ", events);
            for (const id of Object.keys(value.savedSessionIds)) {
              events[id] = id;
            }
            console.log("setting for events: ", events);
            AsyncStorage.setItem(ASYNCSTORAGE_SAVED_EVENTS, JSON.stringify(events), err => {
              if (err) {
                throw err;
              }
            });
          }

          dispatch(receivedUserData(userId, value));
          resolve(value);
        });
    });
  };
}

export function getAllData() {
  return (dispatch, getState) => {
    dispatch(requestData());
    return Promise.all([
      new Promise(resolve => {
        firebase
          .database()
          .ref("conferenceData")
          .once("value", snapshot => {
            const value = snapshot.val();
            dispatch(receivedConferenceData(value));
            resolve(value);
          });
      }),
      new Promise(resolve => {
        firebase
          .database()
          .ref("about")
          .once("value", snapshot => {
            const value = snapshot.val();
            dispatch(receivedAboutData(value));
            resolve(value);
          });
      }),
      new Promise(resolve => {
        firebase
          .database()
          .ref("conductCode")
          .once("value", snapshot => {
            const value = snapshot.val();
            dispatch(receivedConductCodeData(value));
            resolve(value);
          });
      }),
      new Promise(resolve => {
        firebase
          .database()
          .ref("faq")
          .once("value", snapshot => {
            const value = snapshot.val();
            dispatch(receivedFaqData(value));
            resolve(value);
          });
      }),
      new Promise(resolve => {
        firebase
          .database()
          .ref("volunteers")
          .once("value", snapshot => {
            const value = snapshot.val();
            dispatch(receivedVolunteersData(value));
            resolve(value);
          });
      }),
    ]).then(() => {
      const data = getState().conf;
      cacheData(data);
    });
  };
}

export function syncUserData() {
  return (dispatch, getState) => {
    const user = getState().auth.get("user");
    if (!user || !user.get("uid")) {
      return;
    }
    const userId = user.get("uid");
    const savedEvents = getState().conf.get("savedEvents");

    const userRef = firebase.database().ref(`users/${userId}`);
    userRef.update({
      id: userId,
      displayName: user.get("displayName"),
      pictureUrl: user.get("photoURL"),
      username: user.get("email"),
    });

    // update saved session ids separately.
    // if we updated with the rest of the user data,
    // we could overwrite existing saved session data
    const savedSessionsRef = userRef.child("savedSessionIds");
    const savedSessionIds = {};
    if (savedEvents && savedEvents.keySeq()) {
      const list = savedEvents.keySeq().toJS();
      for (const sessionId of list) {
        savedSessionIds[sessionId] = sessionId;
      }
    }
    savedSessionsRef.update(savedSessionIds);
  };
}
