import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import moment from "moment";

import { eventSearchFilterSelector, savedEventsSelector } from "../selectors";
import Constants from "../util/Constants";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { groupEvents } from "../util/Utility";

import { AgendaTabs, Text } from "../components";
import { Navigation } from "react-native-navigation";
import { getIcon } from "../util/Icons";
import Colors from "../util/Colors";
import { getTopBarTitle } from "../util/Navigation";
import { searchChanged, searchCanceled } from "../reducers/conf";

const eventsSelector = eventSearchFilterSelector;
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
    events: eventSearchFilterSelector(state),
    savedEvents: savedEventsSelector(state),
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
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        barStyle: "black",
        title: getTopBarTitle("Droidcon Boston"),
        searchBar: true,
        searchBarHiddenWhenScrolling: true,
        searchBarPlaceholder: "Speaker, Talk, Topic...",
        navBarHideOnScroll: true,
        statusBarHideWithNavBar: true,
        leftButtons: [
          {
            id: "menu",
            icon: getIcon("menu"),
            color: Colors.white,
          },
        ],
        rightButtons: [],
        rightButtonStyle: {
          color: Colors.white,
        },
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

  searchBarUpdated({ text, isFocused }) {
    this.props.dispatch(searchChanged(text));
  }

  searchBarCancelPressed() {
    this.props.dispatch(searchCanceled());
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
