import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import moment from "moment";

import Constants from "../util/Constants";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { groupEvents } from "../util/Utility";

import { AgendaTabs, Text } from "../components";
import { Navigation } from "react-native-navigation";

const eventsSelector = state => state.conf.get("events");
const dayOneDate = moment(Constants.dayOneDate);
const dayTwoDate = moment(Constants.dayTwoDate);

const filterEvents = (events, date) =>
  events
    .filter(value => {
      return moment(value.get("startTime")).isSame(date, "day");
    })
    .sort((a, b) => {
      return moment(a.get("startTime")).valueOf() - moment(b.get("startTime")).valueOf();
    })
    .map((value, index) => {
      return value.set("key", index);
    });

const dayOneSelector = createSelector(
  eventsSelector,
  events => filterEvents(events, dayOneDate)
);
const dayTwoSelector = createSelector(
  eventsSelector,
  events => filterEvents(events, dayTwoDate)
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
    savedEvents: state.conf.get("savedEvents"),
    dayOne: dayOneSelector(state),
    dayOneGroups: dayOneGroupsSelector(state),
    dayTwo: dayTwoSelector(state),
    dayTwoGroups: dayTwoGroupsSelector(state),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers"),
  };
}

class AgendaContainer extends PureComponent {
  constructor(props) {
    super(props);

    // setRootNavigatorActions({
    //   navigator: this.props.navigator,
    //   currentScreen: "AgendaContainer",
    //   title: "Droidcon Boston",
    // });
  }

  onSelect(eventId) {
    Navigation.push(this.props.componentId, {
      component: {
        name: "SessionContainer",
        passProps: {
          eventId: eventId,
        },
        options: {
          topBar: {
            title: {
              text: "Session Details",
            },
          },
        },
      },
    });

    // this.props.navigator.push({
    //   screen: "SessionContainer",
    //   title: "Session Details",
    //   backButtonTitle: "",
    //   passProps: {
    //     eventId: eventId,
    //   },
    // });
  }

  render() {
    console.log("render method in AgendaContianer");
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
export default connect(mapStateToProps)(AgendaContainer);
