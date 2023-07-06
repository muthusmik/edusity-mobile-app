import React, { useEffect, useState } from "react";
import { Image, Text, Button, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Dashboard from "../screens/sections/dashboard/dashboard";
import DrawerScreen from "../screens/dashDrawer";
import MyCourse from "../screens/sections/myCourse";
import MyCourseWishListTab from "../screens/sections/wishListTab";
import Search from "../screens/sections/search/search";
import Profile from "../screens/sections/user/user";
import { icons, COLORS, FONTS } from "../constants";
import Icon from 'react-native-vector-icons/FontAwesome'
import BrandIcons from "react-native-vector-icons/Ionicons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import { color } from "@rneui/base";
import { RFValue } from "react-native-responsive-fontsize";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Login from '../screens/login/login';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const tabOptions = {
    showLabel: false,

    tabStyle:
        [{ backgroundColor: COLORS.primary }],
    style: {
        height: 90,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.53,
        shadowRadius: 13.97,

        elevation: 21,
    },
};


const Tabs = () => {

    const navigation = useNavigation();

    return (
        <Tab.Navigator
            initialRouteName={'Search'}
            // tabBarOptions={tabOptions}
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: COLORS.primary },
                tabBarIcon: ({ focused }) => {
                    const tintColor = focused ? "yellow" : COLORS.white;

                    switch (route.name) {
                        case "Dashboard":
                            return (
                                <MCIcon name="view-dashboard" size={34} color={tintColor} />
                            );
                        case "Search":
                            return (
                                <BrandIcons name="home" size={32} color={tintColor} />
                            );
                        case "MyCourse":
                            return (
                                <BrandIcons name="book-sharp" size={32} color={tintColor} />
                            );
                        case "Profile":
                            return (
                                <EntypoIcons name="user" size={32} color={tintColor} />
                            );

                    }
                }
            })}
        >
            <Tab.Screen
                name="Search"
                component={Search}
                options={{ headerShown: false }}
            // {{title: "Search Your Courses",
            // headerStyle: {
            //     backgroundColor: COLORS.primary,
            // },
            // headerTitleStyle:{
            //     color:COLORS.white,
            //     marginLeft:"15%",
            //     marginTop:"5%",
            //     fontSize:RFValue(14,580)
            // }}}
            />
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
            // title: "Dashboard",
            // headerStyle: {
            //     backgroundColor: COLORS.primary,

            // },
            // headerTitleStyle:{
            //     color:COLORS.white,
            //     marginLeft:"25%",
            //     fontSize:RFValue(16,580)

            // }
            // headerLeft: null,
            // headerRight: () => (
            //     <TouchableOpacity
            //         style={{ marginRight: SIZES.padding }}
            //         onPress={() => console.log("Pressed")}
            //     >

            //     </TouchableOpacity>
            // ),
            //}}
            />

            <Tab.Screen
                name="MyCourse"
                component={MyCourseWishListTab}
                options={{
                    title: <Text>MyCourses <Text style={{ fontSize: RFValue(8) }}>and</Text> WishLists</Text>,
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate('Home', { screen: 'Search' })}>
                            <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                        </TouchableOpacity>
                    ),
                    headerStyle: {
                        backgroundColor: COLORS.primary
                    },
                    headerTitleStyle: {
                        color: COLORS.white,
                        ...FONTS.robotoregular,
                        borderWidth: 0,
                        fontSize: RFValue(16, 580)
                    }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: "Profile",
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: "20%", borderWidth: 0 }} onPress={() => navigation.navigate('Home', { screen: 'Search' })}>
                            <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                        </TouchableOpacity>
                    ),
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                        // borderBottomStartRadius: 30, 
                        // borderBottomEndRadius: 30
                    },
                    headerTitleStyle: {
                        color: COLORS.white,
                        ...FONTS.robotoregular,
                        right: "115%",
                        fontSize: RFValue(16, 580)
                    }
                }}
            />
        </Tab.Navigator>
    );
};

export default Tabs;
