import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { DrawerActions } from '@react-navigation/compat';

const Sidebar = (props) => {
  const handlePage = (router, params = {}) => {
    if (!navigation) {
      return null;
    }
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(router, params);
  };
  const dataHelpInfo = [
    {
      id: '1',
      name: "Home",
      // router: homeTabs.home_drawer,
    },
    {
      id: '2',
      name: "WishList",
      // router: mainStack.blogs,
    },
    {
      id: '3',
      name: "Wishlist",
      // router: mainStack.about,
      // params: {
      //   type: 'page',
      //   id: configs.getIn(['about', language]),
      // },
    },
    {
      id: '4',
      name: "WishList",
      // router: mainStack.term,
      // params: {
      //   type: 'page',
      //   id: configs.getIn(['term', language]),
      // },
    },
    {
      id: '5',
      name: "Wish",
      // router: mainStack.privacy,
      // params: {
      //   type: 'page',
      //   id: configs.getIn(['policy', language]),
      // },
    },
    {
      id: '6',
      name: "List",
      // router: mainStack.contact,
    },
  ];


  return (
    <ScrollView>
      <Text>Dashboard</Text>
      {dataHelpInfo.map(value => (
        <View key={value.id}>
          <TouchableOpacity onPress={() => handlePage(value.router, value.params)}>
            <Text>{value.name}</Text>

          </TouchableOpacity>
          {/* containerStyle={styles.item} */}
          {/* onPress={() => handlePage(value.router, value.params)}
        /> */}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // title: {
  //   marginTop: margin.big + 4,
  //   marginBottom: margin.small + 1,
  //   paddingHorizontal: padding.large,
  // },
  // titleHead: {
  //   paddingTop: getStatusBarHeight(),
  // },
  // item: {
  //   paddingHorizontal: padding.large,
  // },
});

export default Sidebar;
