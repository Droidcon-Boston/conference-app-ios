import immutable from "immutable";

const InitialState = immutable.fromJS({
  chat: false,
  events: {},
  rooms: {},
  sections: {},
  speakers: {},
  tracks: {},
  users: false,
});

const ACTION_RECEIVED_DATA = "ACTION_RECEIVED_DATA";

export function receivedData(data) {
  return {
    type: ACTION_RECEIVED_DATA,
    payload: {
      chat: data.chat,
      events: data.conferenceData.events,
      rooms: data.conferenceData.rooms,
      sections: data.conferenceData.sections,
      speakers: data.conferenceData.speakers,
      tracks: data.conferenceData.tracks,
      users: data.users,
    },
  };
}

// export function deleteTransfer(id) {
//   return (dispatch, getState) => {
//     const transfer = getState()
//       .transfers.getIn(["list", id])
//       .toJS();

//     dispatch(requestDelete());
//     return deleteTransferAPI(transfer)
//       .then(() => {
//         dispatch(responseDelete(id));
//         return Promise.resolve(id);
//       })
//       .catch(error => {
//         dispatch(errorDelete(error));
//         return Promise.reject(error);
//       });
//   };
// }

export default function reducer(state = InitialState, action) {
  switch (action.type) {
    case ACTION_RECEIVED_DATA:
      return state.mergeDeep(immutable.fromJS(action.payload));
  }
  return state;
}
