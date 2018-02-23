import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { createSelector } from "reselect";
import moment from "moment";

import Colors from "../util/Colors";
import Icons from "../util/Icons";
import Constants from "../util/Constants";
import { setRootNavigatorActions } from "../util/UtilNavigation";

import { AgendaList, Text } from "../components";

const eventsSelector = state => state.conf.get("events");
const dayOneDate = moment("2018-03-26");
const dayTwoDate = moment("2018-03-27");
const dayOneSelector = createSelector(eventsSelector, events =>
  events
    .filter(value => {
      return moment(value.get("startTime")).isSame(dayOneDate, "day");
    })
    .sort((a, b) => {
      return moment(a.get("startTime")).valueOf() - moment(b.get("startTime")).valueOf();
    })
    .map((value, index) => {
      return value.set("key", index);
    })
);
const dayTwoSelector = createSelector(eventsSelector, events =>
  events
    .filter(value => {
      return moment(value.get("startTime")).isSame(dayTwoDate, "day");
    })
    .sort((a, b) => {
      return moment(a.get("startTime")).valueOf() - moment(b.get("startTime")).valueOf();
    })
    .map((value, index) => {
      return value.set("key", index);
    })
);

const initialLayout = {
  height: 55,
  width: Dimensions.get("window").width,
};

function mapStateToProps(state) {
  return {
    events: state.conf.get("events"),
    dayOne: dayOneSelector(state),
    dayTwo: dayTwoSelector(state),
    rooms: state.conf.get("rooms"),
    speakers: state.conf.get("speakers"),
  };
}

class AgendaContainer extends Component {
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
          console.log(props);
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
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={SceneMap({
          first: () => (
            <AgendaList
              onSelect={id => this.onSelect(id)}
              events={this.props.dayOne}
              day={"2018-02-01"}
              rooms={this.props.rooms}
              speakers={this.props.speakers}
            />
          ),
          second: () => (
            <AgendaList
              onSelect={id => this.onSelect(id)}
              events={this.props.dayTwo}
              day={"2018-02-02"}
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
