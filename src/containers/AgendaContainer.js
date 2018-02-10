import React, { Component } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { connect } from "react-redux";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { createSelector } from "reselect";
import moment from "moment";

import Colors from "../util/Colors";
import Icons from "../util/Icons";

import AgendaList from "../components/AgendaList";

const eventsSelector = state => state.conf.get("events");
const dayOneDate = moment("2018-02-01");
const dayTwoDate = moment("2018-02-02");
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
  };
}

class AgendaContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [{ key: "first", title: "Day 1" }, { key: "second", title: "Day 2" }],
    };

    this.props.navigator.setButtons({
      leftButtons: [
        {
          icon: Icons.menu, // for icon button, provide the local image asset name
          id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        },
      ],
    });
    this.props.navigator.setOnNavigatorEvent(event => {
      console.log(event);
      if (event.id === "menu") {
        this.props.navigator.toggleDrawer({
          side: "left",
          animated: true,
        });
      }
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
          return <Text style={{ color: color, fontSize: 16, margin: 4 }}>{props.route.title}</Text>;
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
          first: () => <AgendaList events={this.props.dayOne} day={"2018-02-01"} />,
          second: () => <AgendaList events={this.props.dayTwo} day={"2018-02-02"} />,
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
