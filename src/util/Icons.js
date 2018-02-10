import { PixelRatio, Platform } from "react-native";
const Ionicons = require("react-native-vector-icons/Ionicons");
import Colors from "./Colors";

const icons = {
  menu: {
    type: "ion",
    name: "md-menu",
    size: 22,
    color: Colors.white,
  },
};

let loadedIcons = {};

export const loadIcons = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName => {
      iconData = icons[iconName];
      if (iconData.type === "ion") {
        return Ionicons.getImageSource(iconData.name, iconData.size, iconData.color);
      }
    })
  )
    .then(sources => {
      Object.keys(icons).forEach((iconName, idx) => (loadedIcons[iconName] = sources[idx]));
      resolve(true);
    })
    .catch(error => {
      console.log(error);
      reject();
    });
});

export function getIcon(name) {
  return loadedIcons[name];
}

export default loadedIcons;
