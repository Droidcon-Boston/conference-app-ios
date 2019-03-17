import { createSelector } from "reselect";

const searchTextSelector = state => state.conf.get("searchText");
const eventsSelector = state => state.conf.get("events");

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
