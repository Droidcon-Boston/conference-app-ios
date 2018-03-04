import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import moment from "moment";

import Icons from "../util/Icons";
import Colors from "../util/Colors";
import { setRootNavigatorActions } from "../util/UtilNavigation";

import AgendaList from "../components/AgendaList";
import { groupEvents } from "../util/Utility";

const eventsSelector = state => state.conf.get("events");
const savedEventsSelector = state => state.conf.get("savedEvents");
const myEventsSelector = createSelector(eventsSelector, savedEventsSelector, (events, savedEvents) =>
  savedEvents
    .map((value, index) => {
      return events.get(value).set("key", index);
    })
    .sort((a, b) => {
      return moment(a.get("startTime")).valueOf() - moment(b.get("startTime")).valueOf();
    })
);
const groupEventsSelector = createSelector(myEventsSelector, events => groupEvents(events));

function mapStateToProps(state) {
  return {
    events: state.conf.get("events"),
    myEvents: myEventsSelector(state),
    groups: groupEventsSelector(state),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers"),
  };
}
class MyScheduleContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "MyScheduleContainer",
      title: "My Schedule",
    });
  }

  onSelect(eventId) {
    this.props.navigator.push({
      screen: "SessionContainer",
      title: "Session Details",
      backButtonTitle: "",
      passProps: {
        eventId: eventId,
      },
    });
  }

  render() {
    return (
      <View style={{ backgroundColor: Colors.background, flex: 1 }}>
        <AgendaList
          onSelect={id => this.onSelect(id)}
          events={this.props.myEvents}
          groups={this.props.groups}
          rooms={this.props.rooms}
          speakers={this.props.speakers}
        />
      </View>
    );
  }
}
export default connect(mapStateToProps)(MyScheduleContainer);
