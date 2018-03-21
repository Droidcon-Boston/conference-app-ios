import { AsyncStorage } from "react-native";
import striptags from "striptags";
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

export function getEventLocation(event, rooms) {
  if (!event || !event.get("roomIds")) {
    return undefined;
  }
  let location = "";
  const roomIds = event.get("roomIds").keySeq();
  roomIds.forEach(id => {
    const room = rooms.get(id);
    if (room && room.get("name")) {
      location = location + room.get("name");
    }
  });
  return location;
}

export function getEventSpeakerId(event) {
  if (event.get("speakerIds") && event.get("speakerIds").size > 0) {
    return event
      .get("speakerIds")
      .keySeq()
      .get(0);
  }
  return undefined;
}

export const groupEvents = events =>
  events
    .groupBy(e => e.get("startTime"))
    .map((value, index) => {
      return {
        data: value.toArray(),
        title: index,
        key: index,
      };
    })
    .toList();

export const stripHTML = value => {
  if (!value) {
    return;
  }
  let cleaned = striptags(value, ["p"]); // keep the <p> tags
  cleaned = striptags(cleaned, [], "\n"); // replace all remaining tags (<p>) with newline
  cleaned = decodeURI(cleaned);
  cleaned = entities.decode(cleaned);
  return cleaned;
};

const CACHE_KEY = "droidcon_2018_cache";
export const getCachedData = callback => {
  AsyncStorage.getItem(CACHE_KEY)
    .then(value => {
      if (value !== null) {
        const data = JSON.parse(value);
        if (callback) {
          console.log("getting callback from asyncstorage");
          callback(null, data);
        }
      } else {
        if (callback) {
          console.log("getting callback from bundle");
          callback(null, require("../../droidcon-bos-export.json"));
        }
      }
    })
    .catch(error => {
      console.log("Error getting cached data", error);
      if (callback) {
        callback(error, null);
      }
    });
};

export const cacheData = (data, callback) => {
  const value = JSON.stringify(data);
  AsyncStorage.setItem(CACHE_KEY, value)
    .then(value => {
      if (callback) {
        callback(null);
      }
    })
    .catch(error => {
      // Error saving data
      console.log("Error saving data cache", error);
      if (callback) {
        callback(error);
      }
    });
};
