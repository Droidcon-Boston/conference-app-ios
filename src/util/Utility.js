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
