import React, { PureComponent } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { createSelector } from "reselect";
import moment from "moment";
import immutable from "immutable";

import Colors from "../util/Colors";
import Icons from "../util/Icons";
import Constants from "../util/Constants";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { groupEvents } from "../util/Utility";

import { AgendaList, Text } from "../components";

const eventsSelector = state => state.conf.get("events");
const dayOneDate = moment("2018-03-26");
const dayTwoDate = moment("2018-03-27");

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

const dayOneSelector = createSelector(eventsSelector, events => filterEvents(events, dayOneDate));
const dayTwoSelector = createSelector(eventsSelector, events => filterEvents(events, dayTwoDate));

const dayOneGroupsSelector = createSelector(dayOneSelector, events => groupEvents(events));
const dayTwoGroupsSelector = createSelector(dayTwoSelector, events => groupEvents(events));

const initialLayout = {
  height: 55,
  width: Dimensions.get("window").width,
};

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

    this.state = {
      index: 0,
      routes: [{ key: "first", title: "Day 1" }, { key: "second", title: "Day 2" }],
    };

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "AgendaContainer",
      title: "Droidcon Boston",
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

  renderTabBar(props) {
    return (
      <TabBar
        {...props}
        style={{ backgroundColor: Colors.black }}
        useNativeDriver={true}
        renderLabel={props => {
          const color = props.focused ? Colors.green : Colors.white;
          return (
            <Text Light style={{ color: color, fontSize: 16, margin: 4 }}>
              {props.route.title}
            </Text>
          );
        }}
        indicatorStyle={{ backgroundColor: Colors.green, height: 3 }}
      />
    );
  }

  render() {
    // return (
    //   <AgendaList
    //     onSelect={id => this.onSelect(id)}
    //     groups={this.props.dayOneGroups}
    //     events={this.props.dayOne}
    //     savedEvents={this.props.savedEvents}
    //     rooms={this.props.rooms}
    //     speakers={this.props.speakers}
    //   />
    // );
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={SceneMap({
          first: () => (
            <AgendaList
              key={"first"}
              onSelect={id => this.onSelect(id)}
              groups={this.props.dayOneGroups}
              events={this.props.dayOne}
              savedEvents={this.props.savedEvents}
              rooms={this.props.rooms}
              speakers={this.props.speakers}
            />
          ),
          second: () => (
            <AgendaList
              key={"second"}
              onSelect={id => this.onSelect(id)}
              groups={this.props.dayTwoGroups}
              events={this.props.dayTwo}
              savedEvents={this.props.savedEvents}
              rooms={this.props.rooms}
              speakers={this.props.speakers}
            />
          ),
        })}
        renderHeader={props => this.renderTabBar(props)}
        onIndexChange={index => this.setState({ index })}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
export default connect(mapStateToProps)(AgendaContainer);
