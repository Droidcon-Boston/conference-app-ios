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

export default function reducer(state = InitialState, action) {
  switch (action.type) {
    case ACTION_RECEIVED_DATA:
      return state.mergeDeep(immutable.fromJS(action.payload));
  }
  return state;
}
