import striptags from "striptags";

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
  let cleaned = striptags(value);
  cleaned = unescape(cleaned);
  // const reNBSP = new RegExp(String.fromCharCode(160), "g");
  // cleaned = cleaned.replace(reNBSP, " ");
  return cleaned;
};
