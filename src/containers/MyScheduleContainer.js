import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import moment from "moment";

import Icons, { getIcon } from "../util/Icons";
import Colors from "../util/Colors";
import Constants from "../util/Constants";

import { Text, AgendaTabs } from "../components";
import { groupEvents } from "../util/Utility";
import { getTopBarTitle } from "../util/Navigation";
import { Navigation } from "react-native-navigation";
import { savedEventsSelector } from "../selectors";

const dayOneDate = moment(Constants.dayOneDate);
const dayTwoDate = moment(Constants.dayTwoDate);

const filterSavedEvents = (savedEvents, allEvents, date) => {
  if (!savedEvents || savedEvents.length === 0) {
    return undefined;
  }
  return savedEvents
    .filter(eventId => {
      const event = allEvents.get(eventId);
      if (!event) {
        return false;
      }
      return moment(event.get("startTime")).isSame(date, "day");
    })
    .sort((a, b) => {
      const eventA = allEvents.get(a);
      const eventB = allEvents.get(b);
      if (!eventA || !eventB) {
        return 0;
      }
      return moment(eventA.get("startTime")).valueOf() - moment(eventB.get("startTime")).valueOf();
    })
    .map((eventId, index) => {
      return allEvents.get(eventId).set("key", index);
    });
};

const eventsSelector = state => state.conf.get("events");

const dayOneSelector = createSelector(
  savedEventsSelector,
  eventsSelector,
  (savedEvents, allEvents) => filterSavedEvents(savedEvents, allEvents, dayOneDate)
);
const dayTwoSelector = createSelector(
  savedEventsSelector,
  eventsSelector,
  (savedEvents, allEvents) => filterSavedEvents(savedEvents, allEvents, dayTwoDate)
);

const dayOneGroupsSelector = createSelector(
  dayOneSelector,
  events => groupEvents(events)
);
const dayTwoGroupsSelector = createSelector(
  dayTwoSelector,
  events => groupEvents(events)
);

function mapStateToProps(state) {
  return {
    events: state.conf.get("events"),
    savedEvents: savedEventsSelector(state),
    dayOne: dayOneSelector(state),
    dayOneGroups: dayOneGroupsSelector(state),
    dayTwo: dayTwoSelector(state),
    dayTwoGroups: dayTwoGroupsSelector(state),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers"),
  };
}
class MyScheduleContainer extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        title: getTopBarTitle("My Schedule"),
        leftButtons: [
          {
            id: "menu",
            icon: getIcon("menu"),
            color: Colors.white,
          },
        ],
        rightButtons: [],
      },
    };
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === "menu") {
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

  onSelect(eventId) {
    Navigation.push(this.props.componentId, {
      component: {
        name: "SessionContainer",
        passProps: {
          eventId: eventId,
        },
      },
    });
  }

  render() {
    if (!this.props.savedEvents || this.props.savedEvents.length === 0) {
      return (
        <View style={{ backgroundColor: Colors.background, flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ margin: 20 }}>{"Add some events to your schedule by tapping the heart!"}</Text>
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
        onSelectEvent={eventId => this.onSelect(eventId)}
      />
    );
  }
}
export default connect(mapStateToProps)(MyScheduleContainer);
