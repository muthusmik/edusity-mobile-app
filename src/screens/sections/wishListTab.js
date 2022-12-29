import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { icons, COLORS, FONTS, } from "../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyCourse from "../sections/myCourse";
import WishListScreen from "../sections/wishListScreen";

const MyCourseRoute = () => <MyCourse />
const WishList = () => <ScrollView><WishListScreen /></ScrollView>

const MyCourseWishListTab = () => {
    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'first', title: 'My Courses' },
        { key: 'second', title: 'Wish Lists' }
    ])

    const renderScene = SceneMap({
        first: MyCourseRoute,
        second: WishList
    })

    const renderTabBar = props => (
        <TabBar
            {...props}
            activeColor={COLORS.primary}
            inactiveColor={COLORS.black}
            scrollEnabled={true}
            indicatorStyle={{
                backgroundColor:COLORS.primary,  
            }}
            labelStyle={{ ...FONTS.robotoregular }}
            style={{ backgroundColor: COLORS.white }}
            // tabStyle={styles.tab}
        />
    )
    return (
        <View style={{ height: "100%" }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    tab:{
        width:"auto"
    }
})

export default MyCourseWishListTab;