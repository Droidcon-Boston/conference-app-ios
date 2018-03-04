import React, { Component } from "react";
import { View, StyleSheet, SectionList } from "react-native";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { Text } from "../components";
import { setRootNavigatorActions } from "../util/UtilNavigation";

const Separator = () => {
  return <View style={{ height: 4 }} />;
};

const SectionSeparator = () => {
  return <View style={{ height: 20 }} />;
};

const faqSelector = state => state.conf.get("faq");
const faqSectionsSelector = createSelector(faqSelector, items =>
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

    setRootNavigatorActions({
      navigator: this.props.navigator,
      currentScreen: "FAQContainer",
      title: "FAQ",
    });
  }

  renderCell(item) {
    const text = item.get("answer");
    return (
      <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
        <Text>{text}</Text>
      </View>
    );
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
