import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    Modal,
    Pressable, FlatList, StyleSheet, KeyboardAvoidingView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import LoaderKit from 'react-native-loader-kit';
import { images, icons, COLORS, FONTS, SIZES } from "../../constants";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const NoCourse = ({ data }) => {
    const navigation = useNavigation();

    return (
        <>
            {/* <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%" , borderBottomStartRadius: 30, borderBottomEndRadius: 30}}>
                <TouchableOpacity style={{ marginLeft: "4%" }} onPress={()=>navigation.goBack()}>
                    <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Cart</Text>
            </View> */}
            <View style={styles.mainContainer}>
                <View style={{ height: "40%", width: "60%" }}>
                    <Image source={images.noCourseGif} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
                </View>
                <View style={{ width: "80%", margin: "5%", alignItems: "center" }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotomedium, textAlign: "center" }}>Hey<Text style={{ color: COLORS.primary }}> {data}</Text>, Your Course List is currently empty!</Text>
                    <Pressable onPress={() => navigation.navigate("Home", { screen: 'Search' })}>
                        <Text style={{ color: COLORS.primary, fontSize: RFValue(10), ...FONTS.robotoregular, textDecorationLine: "underline" }}>Here's where you might find something you need</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    }

});
export default NoCourse;