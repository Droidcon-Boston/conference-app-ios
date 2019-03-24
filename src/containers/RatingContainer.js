import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleSigninButton } from "react-native-google-signin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Text } from "../components";
import Colors from "../util/Colors";
import { login } from "../reducers/authAsync";
import { isLoggedIn } from "../selectors";
import { TextInput } from "react-native-gesture-handler";
import { rateSession } from "../reducers/confAsync";

function mapStateToProps(state) {
  return {
    loadingLogin: state.auth.get("loading"),
    errorLogin: state.auth.get("error"),
    isLoggedIn: isLoggedIn(state),
  };
}
class RatingContainer extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      rating: props.rating,
      feedback: props.feedback,
    };
  }

  async signIn() {
    this.props.dispatch(login());
  }

  onSubmit() {
    this.props.dispatch(rateSession(this.props.sessionId, this.state.rating, this.state.feedback));
    this.props.onDismiss();
  }

  renderStar(selected, onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={{ padding: 1 }}>
        <Star selected={selected} />
      </TouchableOpacity>
    );
  }

  render() {
    const { width, height } = Dimensions.get("window");
    const rating = this.state.rating;
    return (
      <View style={{ width: width * 0.9, backgroundColor: Colors.white }}>
        {isLoggedIn ? (
          <View>
            <View style={{ padding: 12 }}>
              <Text large>Leave Feedback</Text>
              <View style={{ flexDirection: "row", marginVertical: 6, alignItems: "center" }}>
                {this.renderStar(rating >= 1, () => this.setState({ rating: 1 }))}
                {this.renderStar(rating >= 2, () => this.setState({ rating: 2 }))}
                {this.renderStar(rating >= 3, () => this.setState({ rating: 3 }))}
                {this.renderStar(rating >= 4, () => this.setState({ rating: 4 }))}
                {this.renderStar(rating >= 5, () => this.setState({ rating: 5 }))}
              </View>
              <TextInput
                value={this.state.feedback}
                multiline={true}
                maxLength={9999}
                style={{ backgroundColor: Colors.grey100, minHeight: 70 }}
                onChangeText={text => this.setState({ feedback: text })}
              />
            </View>
            <View style={{ height: 1, backgroundColor: Colors.grey300 }} />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => this.props.onDismiss()} style={styles.bottomButton}>
                <Text grey500>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSubmit()} style={styles.bottomButton}>
                <Text bold>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ margin: 8 }}>{"Log In to Rate & Give Feedback"}</Text>

            <GoogleSigninButton
              style={{ width: 192, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => this.signIn()}
              disabled={false}
            />
          </View>
        )}
      </View>
    );
  }
}
export default connect(mapStateToProps)(RatingContainer);

const Star = ({ selected }) => (
  <Icon
    name={"star"}
    color={selected ? Colors.lightMossGreen : "black"}
    style={{ opacity: selected ? 1.0 : 0.3 }}
    size={26}
  />
);

const styles = StyleSheet.create({
  bottomButton: {
    flex: 1,
    height: 40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
