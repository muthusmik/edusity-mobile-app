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
const WishList = () => <WishListScreen />

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
            activeColor={"yellow"}
            inactiveColor={COLORS.black}
            indicatorStyle={{
                backgroundColor: "yellow",
                borderWidth: 1.8,
                borderColor: "yellow"
            }}
            contentContainerStyle={{ width: '100%' }}
            labelStyle={{ ...FONTS.robotomedium }}
            style={{ backgroundColor: COLORS.primary, flex: 0.07, justifyContent: 'space-between' }}
        />

    )
    return (
        <View style={{ height: "100%" }}>
            {/* {Platform.OS=='ios'?
                    <View style={{height:"5%"}}>

                    </View>:null} */}
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
    tab: {
        width: "auto"
    }
})

export default MyCourseWishListTab;