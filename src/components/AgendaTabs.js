import React, { PureComponent } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import moment from "moment";
import immutable from "immutable";

import Colors from "../util/Colors";
import Icons from "../util/Icons";
import Constants from "../util/Constants";
import { groupEvents } from "../util/Utility";

import AgendaList from "./AgendaList";
import Text from "./Text";

const initialLayout = {
  height: 55,
  width: Dimensions.get("window").width
};
const dayOneDate = moment(Constants.dayOneDate);
const dayTwoDate = moment(Constants.dayTwoDate);

export default class AgendaTabs extends PureComponent {
  static propTypes = {
    events: PropTypes.any,
    savedEvents: PropTypes.any,
    dayOne: PropTypes.any,
    dayOneGroups: PropTypes.any,
    dayTwo: PropTypes.any,
    dayTwoGroups: PropTypes.any,
    rooms: PropTypes.any,
    speakers: PropTypes.any,
    onSelectEvent: PropTypes.func
  };
  constructor(props) {
    super(props);

    let startingIndex = 0;
    if (moment().isSame(dayTwoDate, "day")) {
      startingIndex = 1;
    }

    this.state = {
      index: startingIndex,
      routes: [{ key: "first", title: "Day 1" }, { key: "second", title: "Day 2" }]
    };
  }

  onSelect(eventId) {
    this.props.onSelectEvent(eventId);
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
          )
        })}
        renderHeader={props => this.renderTabBar(props)}
        onIndexChange={index => this.setState({ index })}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  }
});
