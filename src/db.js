import firebase from "react-native-firebase";

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
  return dispatch => {
    return new Promise(resolve => {
      console.log("getUserData: ", userId);
      firebase
        .database()
        .ref(`users/${userId}`)
        .once("value", snapshot => {
          const value = snapshot.val();
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

    const userInfo = {
      id: userId,
      displayName: user.get("displayName"),
      pictureUrl: user.get("photoURL"),
      twitter: "",
      username: user.get("email"),
      savedSessionIds: savedEvents ? savedEvents.keySeq().toJS() : [],
    };

    return userRef.update(userInfo);
  };
}
