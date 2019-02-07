import React, { Component } from "react";
import { View, StyleSheet, SectionList, TouchableOpacity, Dimensions, Linking } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { Text, CachedImage } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";
import { transformGeoLink } from "../util/Utility";
import { Navigation } from "react-native-navigation";
import { getTopBarTitle } from "../util/Navigation";
import { getIcon } from "../util/Icons";

const Separator = () => {
  return <View style={{ height: 1, backgroundColor: Colors.grey200 }} />;
};

const SectionSeparator = () => {
  return <View style={{ height: 20 }} />;
};

const faqSelector = state => state.conf.get("faq");
const faqSectionsSelector = createSelector(
  faqSelector,
  items =>
    items
      .map(item => {
        const returnData = {
          key: item.get("question"),
          title: item.get("question"),
          data: item.get("answers").toArray(),
        };
        return {
          key: item.get("question"),
          title: item.get("question"),
          data: item.get("answers").toArray(),
        };
      })
      .toList()
);

function mapStateToProps(state) {
  return {
    faq: state.conf.get("faq"),
    sections: faqSectionsSelector(state),
  };
}
class FAQContainer extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options() {
    return {
      topBar: {
        title: getTopBarTitle("FAQ"),
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

  onSelectLink(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  renderCell(item) {
    const text = item.get("answer");
    const mapLink = item.get("mapLink");
    let photoLink = item.get("photoLink");
    if (photoLink && photoLink.startsWith("http:")) {
      photoLink = undefined;
    }
    const otherLink = item.get("otherLink");
    const viewWidth = Dimensions.get("window").width;

    const content = (
      <View>
        <Text>{text}</Text>
        {photoLink && (
          <View style={{ alignItems: "center" }}>
            <CachedImage style={{ width: viewWidth - 24, height: 100, marginTop: 4 }} url={photoLink} />
          </View>
        )}
      </View>
    );

    if (mapLink || otherLink) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (mapLink) {
              this.onSelectLink(transformGeoLink(mapLink));
            } else if (otherLink) {
              this.onSelectLink(otherLink);
            }
          }}
          style={styles.cellContainer}
        >
          {content}
        </TouchableOpacity>
      );
    } else {
      return <View style={styles.cellContainer}>{content}</View>;
    }
  }

  renderSectionHeader(section) {
    return (
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Text Bold grey600 size={15}>
          {section.title}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <SectionList
        style={{ paddingVertical: 12 }}
        renderItem={({ item }) => this.renderCell(item)}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
        sections={this.props.sections.toArray()}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={Separator}
        renderSectionFooter={() => <SectionSeparator />}
        keyExtractor={item => item.get("answer")}
      />
    );
  }
}
export default connect(mapStateToProps)(FAQContainer);

const styles = StyleSheet.create({
  cellContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
  },
});
