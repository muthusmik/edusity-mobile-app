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
import { images, icons, COLORS, FONTS, SIZES } from "../constants";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { cartListUrl } from '../services/constant';
const CheckoutComplete = () => {
    const navigation = useNavigation();
    const Token = useSelector((state) => state.loginHandle.data)
    useEffect(()=>{
        const cartDelete=async()=>{
            // console.log("deleted")
            return await axios.delete(cartListUrl, {
                headers: {
                    Authorization: `Bearer +${Token.data}`

                }
            }).then(response => {
                // console.log(response.data, "data recieved")
            }).catch(err => {
                console.log(err, "error")
            })
        }
        cartDelete();

    }, [])
    // console.log("inside Success Page")
    return (
        <View style={{ backgroundColor: COLORS.white }}>
            <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%", borderBottomStartRadius: 30, borderBottomEndRadius: 30 }}>
                <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.navigate("Cart")}>
                    <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Checkout</Text>
            </View>
            <KeyboardAvoidingView style={styles.mainContainer}>
                <Image source={images.checkoutGif} resizeMode="cover" style={{ height: 300, width: 300 }} />
                <Text style={{ ...FONTS.robotomedium, fontSize: RFValue(18), color: COLORS.black }}>Hurray! Successfully Purchased</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: RFValue(14), ...FONTS.robotoregular, flexDirection: "column" }}>Your Purchased Course will be shown in</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'MyCourse' })}>
                        <Text style={{ color: "red",fontSize: RFValue(14), ...FONTS.robotoregular,flexDirection:"column" }}> MyCourses</Text>
                    </TouchableOpacity>
                    
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        // justifyContent:"center",
        marginTop: "35%",
        alignItems: "center",
        backgroundColor: COLORS.white
    },
});
export default CheckoutComplete;