import striptags from "striptags";
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();
const queryString = require("query-string");

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

export const transformGeoLink = geoLink => {
  // geo:0,0?q=42.3497511,-71.0673111(Chinatown)
  if (geoLink && geoLink.startsWith("geo:")) {
    const params = queryString.parse(geoLink);
    const coordsString = params["geo:0,0?q"];
    if (coordsString) {
      const coords = coordsString.replace(/\([^)]*\)/, "");
      return `http://www.google.com/maps/place/${coords}`;
    }
  }
  return geoLink;
};

export const transformDBDataToLocalState = dbData => {
  return {
    chat: dbData.chat,
    about: dbData.about,
    conductCode: dbData.conductCode,
    events: dbData.conferenceData && dbData.conferenceData.events,
    rooms: dbData.conferenceData && dbData.conferenceData.rooms,
    sections: dbData.conferenceData && dbData.conferenceData.sections,
    speakers: dbData.conferenceData && dbData.conferenceData.speakers,
    tracks: dbData.conferenceData && dbData.conferenceData.tracks,
    faq: dbData.faq,
    volunteers: dbData.volunteers,
  };
};
