import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import moment from "moment";

import Icons from "../util/Icons";
import Colors from "../util/Colors";
import Constants from "../util/Constants";
import { setRootNavigatorActions } from "../util/UtilNavigation";

import { Text, AgendaTabs } from "../components";
import { groupEvents } from "../util/Utility";

const dayOneDate = moment(Constants.dayOneDate);
const dayTwoDate = moment(Constants.dayTwoDate);

const filterSavedEvents = (savedEvents, allEvents, date) =>
  savedEvents
    .filter(eventId => {
      const event = allEvents.get(eventId);
      return moment(event.get("startTime")).isSame(date, "day");
    })
    .sort((a, b) => {
      const eventA = allEvents.get(a);
      const eventB = allEvents.get(b);
      return moment(eventA.get("startTime")).valueOf() - moment(eventB.get("startTime")).valueOf();
    })
    .map((eventId, index) => {
      return allEvents.get(eventId).set("key", index);
    });

const eventsSelector = state => state.conf.get("events");
const savedEventsSelector = state => state.conf.get("savedEvents");

const dayOneSelector = createSelector(savedEventsSelector, eventsSelector, (savedEvents, allEvents) =>
  filterSavedEvents(savedEvents, allEvents, dayOneDate)
);
const dayTwoSelector = createSelector(savedEventsSelector, eventsSelector, (savedEvents, allEvents) =>
  filterSavedEvents(savedEvents, allEvents, dayTwoDate)
);

const dayOneGroupsSelector = createSelector(dayOneSelector, events => groupEvents(events));
const dayTwoGroupsSelector = createSelector(dayTwoSelector, events => groupEvents(events));

function mapStateToProps(state) {
  return {
    events: state.conf.get("events"),
    savedEvents: state.conf.get("savedEvents"),
    dayOne: dayOneSelector(state),
    dayOneGroups: dayOneGroupsSelector(state),
    dayTwo: dayTwoSelector(state),
    dayTwoGroups: dayTwoGroupsSelector(state),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers")
  };
}
class MyScheduleContainer extends Component {
  constructor(props) {
    super(props);

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "MyScheduleContainer",
      title: "My Schedule"
    });
  }

  onSelect(eventId) {
    this.props.navigator.push({
      screen: "SessionContainer",
      title: "Session Details",
      backButtonTitle: "",
      passProps: {
        eventId: eventId
      }
    });
  }

  render() {
    if (!this.props.savedEvents || this.props.savedEvents.size === 0) {
      return (
        <View style={{ backgroundColor: Colors.background, flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ margin: 20 }}>{"Add some events to your schedule by tapping the star!"}</Text>
        </View>
      );
    }
    return (
      <AgendaTabs
        events={this.props.events}
        savedEvents={this.props.savedEvents}
        dayOne={this.props.dayOne}
        dayOneGroups={this.props.dayOneGroups}
        dayTwo={this.props.dayTwo}
        dayTwoGroups={this.props.dayTwoGroups}
        rooms={this.props.rooms}
        speakers={this.props.speakers}
        onSelect={eventId => this.onSelect(eventId)}
      />
    );
  }
}
export default connect(mapStateToProps)(MyScheduleContainer);
