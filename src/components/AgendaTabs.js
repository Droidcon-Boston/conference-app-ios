import React, { PureComponent } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import moment from "moment";

import Colors from "../util/Colors";
import Constants from "../util/Constants";

import AgendaList from "./AgendaList";
import Text from "./Text";
import Fonts from "../util/Fonts";

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
    onSelectEvent: PropTypes.func,
  };
  constructor(props) {
    super(props);

    let startingIndex = 0;
    if (moment().isSame(dayTwoDate, "day")) {
      startingIndex = 1;
    }

    this.state = {
      index: startingIndex,
      routes: [{ key: "first", title: "Day 1" }, { key: "second", title: "Day 2" }],
    };
  }

  onSelect(eventId) {
    this.props.onSelectEvent(eventId);
  }

  renderTabBar(props) {
    return (
      <View>
        <TabBar
          {...props}
          style={{ backgroundColor: Colors.blueberry }}
          useNativeDriver={true}
          renderLabel={props => {
            const color = props.focused ? Colors.lightMossGreen : Colors.white;
            const fontFamily = props.focused ? Fonts.SemiBold : Fonts.Light;
            return (
              <Text style={{ color: color, fontFamily: fontFamily, fontSize: 16, margin: 4 }}>{props.route.title}</Text>
            );
          }}
          indicatorStyle={{ backgroundColor: Colors.lightMossGreen, height: 3 }}
        />
      </View>
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
          ),
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
    backgroundColor: Colors.background,
  },
});
