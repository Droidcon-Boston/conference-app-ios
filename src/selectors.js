import { createSelector } from "reselect";

const searchTextSelector = state => state.conf.get("searchText");
const eventsSelector = state => state.conf.get("events");

export const userIdSelector = state => state.auth.getIn(["user", "uid"]);
export const isLoggedIn = createSelector(
  userIdSelector,
  userId => !!userId
);
export const usersSelector = state => state.conf.get("users");

export const feedbackSelector = createSelector(
  userIdSelector,
  usersSelector,
  (userId, users) => {
    if (!userId) {
      return undefined;
    }
    const userData = users.get(userId);
    if (!userData) {
      return undefined;
    }
    return userData.get("sessionFeedback");
  }
);

export const sessionIdsSelector = createSelector(
  userIdSelector,
  usersSelector,
  (userId, users) => {
    if (!userId) {
      return undefined;
    }
    const userData = users.get(userId);
    if (!userData) {
      return undefined;
    }
    return userData.get("savedSessionIds");
  }
);

// speaker, talk, or topic
export const eventSearchFilterSelector = createSelector(
  eventsSelector,
  searchTextSelector,
  (events, searchText) => {
    if (searchText) {
      return events.filter(event => {
        // event name
        const eventName = event.get("name") || "";
        if (eventName.toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }

        // event description
        const eventDescription = event.get("description") || "";
        if (eventDescription.toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }

        // speaker names
        const speakerNames = event.get("speakerNames");
        if (speakerNames) {
          const matchingNames = speakerNames.filter((value, key) => {
            const name = key;
            if (name.toLowerCase().includes(searchText.toLowerCase())) {
              return true;
            }
            return false;
          });
          if (matchingNames.size > 0) {
            return true;
          }
        }
        return false;
      });
    } else {
      return events;
    }
  }
);

export const savedEventsSelector = createSelector(
  sessionIdsSelector,
  state => state.conf.get("savedEvents"),
  (sessionIds, savedEvents) => {
    if (sessionIds) {
      let idMap = savedEvents;
      sessionIds.forEach(id => {
        if (!idMap.get(id)) {
          idMap = idMap.set(id, id);
        }
      });
      return idMap;
    } else {
      return savedEvents;
    }
  }
);
