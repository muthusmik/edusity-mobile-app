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
import {images,COLORS,FONTS} from "../../constants";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const NoWishList = ({data}) => {
    const navigation = useNavigation();
    return (
        <>
            {/* <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%" , borderBottomStartRadius: 30, borderBottomEndRadius: 30}}>
                <TouchableOpacity style={{ marginLeft: "4%" }} onPress={()=>navigation.goBack()}>
                    <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Cart</Text>
            </View> */}
            <KeyboardAvoidingView style={styles.mainContainer}>

                <Image source={images.emptyCart} resizeMode="contain" style={{ height: 200, width: 200 }} />
                <View style={{ width: "80%", margin: "5%" }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotomedium }}>Hey<Text style={{ color: COLORS.primary }}> {data}</Text>, Your Wish List is currently empty!</Text>
                    <Pressable onPressIn={() => navigation.navigate("Home")}>
                        <Text style={{ color: COLORS.primary, fontSize: RFValue(10), ...FONTS.robotoregular }}>Here's where you might find something you like!!!</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "95%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth:2,
        paddingBottom:"20%",
        marginTop:"14%"
    },
    
});
export default NoWishList;