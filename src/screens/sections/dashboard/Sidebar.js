import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { DrawerActions } from '@react-navigation/compat';
import { COLORS, FONTS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';

const Sidebar = (props) => {
  const navigation = useNavigation();

  const handlePage = (router, params = {}) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    if (router == "Course") {
      navigation.navigate('Home', { screen: 'MyCourse' });
    }
    else if (router == "Wishlist") {
      navigation.navigate('Home', { screen: 'MyCourse', params: { screen: 'Wish Lists' } });
    }
    else if (router && router != "Course" && "Wishlist") {
      navigation.navigate(router);
    }
  };

  const dataHelpInfo = [
    {
      id: 1,
      name: "My Courses",
      router: "Course"
    },
    {
      id: 2,
      name: "My Wishlist",
      router: "Wishlist",
    },
    {
      id: 3,
      name: "My webinars",
      router: "MyWebinars",
      // params: {
      //   type: 'page',
      //   id: configs.getIn(['about', language]),
      // },
    },
    {
      id: 4,
      name: "Results",
      // router: mainStack.term,
      // params: {
      //   type: 'page',
      //   id: configs.getIn(['term', language]),
      // },
    },
    {
      id: 5,
      name: "Notes",
      router: "TakeNotesScreen",
      // params: {
      //   type: 'page',
      //   id: configs.getIn(['policy', language]),
      // },
    },
    {
      id: 6,
      name: "Forum",
      router: "ForumScreen",
    },
    {
      id: 7,
      name: "Achievements"
    },
    {
      id: 8,
      name: "Announcements"
    },
    {
      id: 9,
      name: "View Awards"
    },
    {
      id: 10,
      name: "Quiz Result"
    }
  ];

  return (
    <View style={{ backgroundColor: COLORS.lightGray }}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontSize: 20, textAlign: "center" }]}>Dashboard</Text>
      </View>
      <ScrollView style={styles.scrollViewContainer}>
        <View>
          {dataHelpInfo.map(value => (
            <>
              <View key={value.id} style={styles.mapViewContainer}>
                <TouchableOpacity onPress={() => handlePage(value.router, value.params)} style={styles.buttonstyle}>
                  <Text style={[styles.title, { color: COLORS.primary }]}>{value.name}</Text>
                </TouchableOpacity>
              </View>
            </>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    height: "8%",
    backgroundColor: COLORS.primary,
    justifyContent: "center"
  },
  scrollViewContainer: {
    height: "92%"
  },
  title: {
    ...FONTS.robotoregular,
    color: COLORS.white,
    fontSize: 16
  },
  mapViewContainer: {
    width: "94%",
    height: 40,
    alignSelf: "center",
    marginBottom: 4
  },
  buttonstyle: {
    width: "100%",
    height: "100%",
    justifyContent: "center"
  }
});

export default Sidebar;
