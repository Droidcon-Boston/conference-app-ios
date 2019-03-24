import { AsyncStorage } from "react-native";
import { transformDBDataToLocalState } from "./Utility";

const CACHE_KEY = "droidcon_2019_cache_v4";

export const getCachedData = callback => {
  AsyncStorage.getItem(CACHE_KEY)
    .then(value => {
      if (value !== null) {
        const data = JSON.parse(value);
        if (callback) {
          callback(null, data);
        }
      } else {
        if (callback) {
          console.log("getting callback from bundle");
          const dbExport = require("../../droidcon-bos-export.json");
          const localState = transformDBDataToLocalState(dbExport);
          callback(null, localState);
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
